'use client';

import React, { useState, useEffect } from 'react';
import { useCircuitStore } from '@/lib/state-store';
import { useAccessibility } from '@/lib/accessibility-context';
import { GateType, PlacedGate } from '@/lib/types';
import { generateQasm } from '@/lib/quantum-simulator-core';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import {
  RotateCcw,
  Code,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { QuantumCircuitCodePanel } from '@/components/circuit/QuantumCircuitCodePanel';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import {
  AVAILABLE_GATE_LIST,
  QuantumGateSymbol,
  ControlDotIcon,
  TargetPlusIcon,
  SwapXIcon
} from '@/components/circuit/QuantumGateSymbol';

const MAX_STEPS = 8;
const AVAILABLE_GATES = AVAILABLE_GATE_LIST;

export function CircuitBuilder() {
  const {
    numQubits,
    setNumQubits,
    gates,
    shots,
    addGate,
    removeGateAt,
    clearCircuit,
    loadPreset,
    selectedSlot,
    setSelectedSlot,
    simResult,
    runSimulation
  } = useCircuitStore();

  const { announce } = useAccessibility();

  const [selectedGateType, setSelectedGateType] = useState<GateType>('h');
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [targetQubit, setTargetQubit] = useState<number>(1);
  const [copiedQasm, setCopiedQasm] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [stepScrubber, setStepScrubber] = useState<number>(0);
  const [dragOverSlot, setDragOverSlot] = useState<{ qubit: number; step: number } | null>(null);
  const [isDraggingActive, setIsDraggingActive] = useState<boolean>(false);
  const [rightPanelMode, setRightPanelMode] = useState<'vectors' | 'code'>('code');

  // Initialize simulation on mount
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  // Sync step scrubber when simulation updates
  useEffect(() => {
    if (simResult?.step_by_step) {
      setStepScrubber(simResult.step_by_step.length - 1);
    }
  }, [simResult]);

  // Keyboard navigation across circuit grid (WCAG 2.1 AA)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedSlot) return;

    const { qubit, step } = selectedSlot;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (qubit > 0) {
          const next = { qubit: qubit - 1, step };
          setSelectedSlot(next);
          announce(`Selected Qubit ${next.qubit}, Step ${next.step}`);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (qubit < numQubits - 1) {
          const next = { qubit: qubit + 1, step };
          setSelectedSlot(next);
          announce(`Selected Qubit ${next.qubit}, Step ${next.step}`);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (step > 0) {
          const next = { qubit, step: step - 1 };
          setSelectedSlot(next);
          announce(`Selected Qubit ${next.qubit}, Step ${next.step}`);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (step < MAX_STEPS - 1) {
          const next = { qubit, step: step + 1 };
          setSelectedSlot(next);
          announce(`Selected Qubit ${next.qubit}, Step ${next.step}`);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        placeSelectedGateOnSlot(qubit, step);
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        removeGateAt(qubit, step);
        announce(`Removed gate at Qubit ${qubit}, Step ${step}`);
        break;
      // Shortcut keys for gates
      case 'h':
      case 'H':
        addGate('h', [qubit], step);
        announce(`Placed Hadamard on Qubit ${qubit}, Step ${step}`);
        break;
      case 'x':
      case 'X':
        addGate('x', [qubit], step);
        announce(`Placed Pauli-X on Qubit ${qubit}, Step ${step}`);
        break;
      case 'z':
      case 'Z':
        addGate('z', [qubit], step);
        announce(`Placed Pauli-Z on Qubit ${qubit}, Step ${step}`);
        break;
      case 'c':
      case 'C':
        // Place CNOT with other qubit as target
        const otherQ = (qubit + 1) % numQubits;
        addGate('cx', [qubit, otherQ], step);
        announce(`Placed CNOT from Control Qubit ${qubit} to Target Qubit ${otherQ}`);
        break;
    }
  };

  const placeSelectedGateOnSlot = (qubit: number, step: number, gateTypeToPlace?: GateType) => {
    const type = gateTypeToPlace || selectedGateType;
    const isMulti = ['cx', 'cz', 'swap'].includes(type);
    if (isMulti) {
      const tgt = qubit === controlQubit ? (qubit + 1) % numQubits : qubit;
      addGate(type, [controlQubit, tgt], step);
      announce(`Placed ${type.toUpperCase()} on Control Q${controlQubit} and Target Q${tgt}`);
    } else {
      addGate(type, [qubit], step);
      announce(`Placed ${type.toUpperCase()} on Qubit ${qubit}`);
    }
  };

  const handleSlotDrop = (e: React.DragEvent, targetQubitIdx: number, targetStepIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSlot(null);
    setIsDraggingActive(false);

    // Check if moving an existing placed gate
    const movePayload = e.dataTransfer.getData('application/quantum-move');
    if (movePayload) {
      try {
        const { qubit: srcQubit, step: srcStep, type: srcType } = JSON.parse(movePayload);
        if (srcQubit !== targetQubitIdx || srcStep !== targetStepIdx) {
          removeGateAt(srcQubit, srcStep);
          if (['cx', 'cz', 'swap'].includes(srcType)) {
            const tgt = targetQubitIdx === 0 ? 1 : 0;
            addGate(srcType, [targetQubitIdx, Math.min(tgt, numQubits - 1)], targetStepIdx);
          } else {
            addGate(srcType, [targetQubitIdx], targetStepIdx);
          }
          announce(`Moved ${srcType.toUpperCase()} gate to Qubit ${targetQubitIdx}, Step ${targetStepIdx}`);
        }
        return;
      } catch {
        // Continue to check gate type
      }
    }

    // New gate dropped from toolbox
    const droppedGateType = (e.dataTransfer.getData('application/quantum-gate') ||
      e.dataTransfer.getData('text/plain') ||
      selectedGateType) as GateType;

    if (droppedGateType && AVAILABLE_GATES.some((g) => g.type === droppedGateType)) {
      setSelectedGateType(droppedGateType);
      placeSelectedGateOnSlot(targetQubitIdx, targetStepIdx, droppedGateType);
    }
  };

  const currentSnapshot = simResult?.step_by_step?.[stepScrubber] || null;
  const currentBlochVectors = currentSnapshot?.bloch_vectors || simResult?.bloch_vectors || [];
  const currentProbabilities = currentSnapshot?.probabilities || simResult?.probabilities || {};
  const currentAmplitudes = currentSnapshot?.statevector || simResult?.statevector || [];
  const histogramData = Object.entries(currentProbabilities).map(([state, probability]) => ({
    state: `|${state}⟩`,
    prob: Number((probability * 100).toFixed(1))
  }));

  const copyQasmCode = () => {
    const qasm = simResult?.qasm || generateQasm(numQubits, gates);
    navigator.clipboard.writeText(qasm);
    setCopiedQasm(true);
    setTimeout(() => setCopiedQasm(false), 2000);
  };

  const generatePythonQiskitCode = () => {
    const lines = [
      'import qiskit',
      'from qiskit import QuantumCircuit',
      'from qiskit.quantum_info import Statevector, partial_trace',
      '',
      `# Create quantum circuit with ${numQubits} qubits`,
      `qc = QuantumCircuit(${numQubits})`,
      ''
    ];

    const sorted = [...gates].sort((a, b) => a.step - b.step);
    sorted.forEach((g) => {
      const t = g.type.toLowerCase();
      if (t === 'cx') {
        lines.push(`qc.cx(${g.qubits[0]}, ${g.qubits[1]})`);
      } else if (t === 'cz') {
        lines.push(`qc.cz(${g.qubits[0]}, ${g.qubits[1]})`);
      } else if (t === 'swap') {
        lines.push(`qc.swap(${g.qubits[0]}, ${g.qubits[1]})`);
      } else if (t === 'measure') {
        lines.push(`qc.measure_all()`);
      } else {
        lines.push(`qc.${t}(${g.qubits[0]})`);
      }
    });

    lines.push('');
    lines.push('# Simulate statevector and probabilities');
    lines.push('sv = Statevector.from_instruction(qc)');
    lines.push('print("Final Statevector:", sv.data)');
    lines.push('print("Probabilities:", sv.probabilities_dict())');

    return lines.join('\n');
  };

  const renderVisualWorkspace = () => (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-dark-700">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span>Gates</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {AVAILABLE_GATE_LIST.map((gate) => {
            const isSelected = selectedGateType === gate.type;
            return (
              <button
                key={gate.type}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', gate.type);
                  e.dataTransfer.setData('application/quantum-gate', gate.type);
                  e.dataTransfer.effectAllowed = 'copy';
                  setSelectedGateType(gate.type);
                  setIsDraggingActive(true);
                }}
                onDragEnd={() => {
                  setIsDraggingActive(false);
                  setDragOverSlot(null);
                }}
                onClick={() => setSelectedGateType(gate.type)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/70 text-blue-900 shadow-xs'
                    : 'border-dark-200 hover:border-dark-300 bg-white text-dark-800 hover:bg-dark-50'
                }`}
                title={`${gate.desc} — Drag & drop onto wire or click to select`}
              >
                <QuantumGateSymbol type={gate.type} size="sm" />
                <span className="notranslate font-semibold" translate="no">{gate.name}</span>
                {gate.multi && <span className="text-[10px] text-dark-400 uppercase font-mono notranslate" translate="no">2Q</span>}
              </button>
            );
          })}
        </div>

        {['cx', 'cz', 'swap'].includes(selectedGateType) && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dark-200 bg-dark-50 px-3 py-2 text-xs">
            <span className="font-semibold text-dark-800">2-qubit setup</span>
            <label className="flex items-center gap-1.5 text-dark-700">
              Control:
              <select
                value={controlQubit}
                onChange={(e) => setControlQubit(Number(e.target.value))}
                className="bg-white border border-dark-200 rounded px-2 py-0.5"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>Qubit {i}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-dark-700">
              Target:
              <select
                value={targetQubit}
                onChange={(e) => setTargetQubit(Number(e.target.value))}
                className="bg-white border border-dark-200 rounded px-2 py-0.5"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>Qubit {i}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] lg:items-stretch">
        <div className="lg:col-span-7 lg:row-span-2 grid min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
          <div className="bg-white rounded-xl border border-dark-200 p-3 shadow-xs space-y-2 min-h-[180px]">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                <h3 className="font-bold text-sm text-dark-900">Circuit</h3>
              </div>
              <span className="text-xs text-dark-500 font-mono">
                {numQubits} Qubit{numQubits > 1 ? 's' : ''} · {MAX_STEPS} Steps
              </span>
            </div>

            <div className="w-full overflow-x-auto pb-0.5">
              <div className={`w-full min-w-[340px] space-y-2 ${numQubits <= 1 ? 'py-4' : numQubits === 2 ? 'py-2.5' : 'py-1.5'}`}>
                {/* Step Columns Timeline Header */}
                <div className="flex items-center gap-2 pl-16">
                  {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                    const isPassed = sIdx < stepScrubber;
                    const isCurrent = sIdx === stepScrubber;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => setStepScrubber(sIdx)}
                        className={`w-9 py-0.5 rounded text-[10px] font-mono font-bold transition-all text-center cursor-pointer ${
                          isCurrent
                            ? 'bg-primary-600 text-white shadow-xs ring-2 ring-primary-400/40 scale-105'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-dark-50 text-dark-500 hover:bg-dark-100'
                        }`}
                        title={`Jump to Step ${sIdx}`}
                      >
                        S{sIdx}
                      </button>
                    );
                  })}
                </div>

                {/* Qubit Wires */}
                {Array.from({ length: numQubits }, (_, qIdx) => (
                  <div key={qIdx} className={`flex items-center gap-2 ${numQubits <= 1 ? 'my-3.5' : numQubits === 2 ? 'my-2' : 'my-1'}`}>
                    {/* Qubit Label */}
                    <div className="w-14 shrink-0 flex items-center gap-1.5 notranslate" translate="no">
                      <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                      <span className="px-1.5 py-0.5 rounded bg-dark-100 font-mono text-[10px] text-dark-600">|0⟩</span>
                    </div>

                    {/* Wire slots */}
                    <div className="flex-1 flex items-center gap-2 circuit-wire relative pr-1">
                      {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                        const placed = gates.find((g) => g.step === sIdx && g.qubits.includes(qIdx));
                        const isSelected = selectedSlot?.qubit === qIdx && selectedSlot?.step === sIdx;
                        const isDragOver = dragOverSlot?.qubit === qIdx && dragOverSlot?.step === sIdx;
                        const isControl = placed && (placed.type === 'cx' || placed.type === 'cz') && placed.qubits[0] === qIdx;
                        const isTarget = placed && (placed.type === 'cx' || placed.type === 'cz') && placed.qubits[1] === qIdx;

                        return (
                          <div
                            key={sIdx}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'copy';
                            }}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              setDragOverSlot({ qubit: qIdx, step: sIdx });
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              if (dragOverSlot?.qubit === qIdx && dragOverSlot?.step === sIdx) {
                                setDragOverSlot(null);
                              }
                            }}
                            onDrop={(e) => handleSlotDrop(e, qIdx, sIdx)}
                            onClick={() => {
                              setSelectedSlot({ qubit: qIdx, step: sIdx });
                              placeSelectedGateOnSlot(qIdx, sIdx);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              removeGateAt(qIdx, sIdx);
                            }}
                            className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                              isDragOver
                                ? 'ring-2 ring-primary-500 border-primary-600 bg-primary-100 scale-105 shadow-xs'
                                : isSelected
                                ? 'ring-2 ring-primary-600 border-primary-600 bg-primary-50'
                                : placed
                                ? 'border-dark-300 bg-white shadow-2xs'
                                : isDraggingActive
                                ? 'border-dashed border-primary-400 bg-primary-50/40 animate-pulse'
                                : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/70 hover:bg-primary-50/30'
                            }`}
                            title={
                              placed
                                ? `Step ${sIdx}: ${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')}. Drag to move, or right-click to remove.`
                                : `Step ${sIdx} (Empty). Drag a gate here or click to place ${selectedGateType.toUpperCase()}`
                            }
                          >
                            {/* Vertical connector line for multi-qubit gates (CX, CZ, SWAP) */}
                            {placed && placed.qubits.length > 1 && Math.min(...placed.qubits) === qIdx && (
                              <div
                                className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-600 pointer-events-none z-0"
                                style={{
                                  top: '50%',
                                  height: `${(Math.max(...placed.qubits) - Math.min(...placed.qubits)) * (numQubits === 2 ? 46 : 42)}px`
                                }}
                              />
                            )}

                            {placed ? (
                              <div
                                draggable={true}
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  e.dataTransfer.setData('text/plain', placed.type);
                                  e.dataTransfer.setData('application/quantum-gate', placed.type);
                                  e.dataTransfer.setData(
                                    'application/quantum-move',
                                    JSON.stringify({ qubit: qIdx, step: sIdx, gateId: placed.id, type: placed.type })
                                  );
                                  e.dataTransfer.effectAllowed = 'move';
                                  setIsDraggingActive(true);
                                }}
                                onDragEnd={() => {
                                  setIsDraggingActive(false);
                                  setDragOverSlot(null);
                                }}
                                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                              >
                                {placed.type === 'cx' ? (
                                  isControl ? (
                                    <ControlDotIcon size={12} />
                                  ) : isTarget ? (
                                    <TargetPlusIcon size={22} />
                                  ) : (
                                    <QuantumGateSymbol type={placed.type} size="sm" />
                                  )
                                ) : placed.type === 'cz' ? (
                                  isControl ? (
                                    <ControlDotIcon size={12} />
                                  ) : isTarget ? (
                                    <QuantumGateSymbol type="z" size="sm" />
                                  ) : (
                                    <QuantumGateSymbol type={placed.type} size="sm" />
                                  )
                                ) : placed.type === 'swap' ? (
                                  <SwapXIcon size={20} />
                                ) : (
                                  <QuantumGateSymbol type={placed.type} size="sm" />
                                )}
                              </div>
                            ) : isDragOver ? (
                              <span className="text-[8px] font-mono font-bold text-primary-700">DROP</span>
                            ) : (
                              <span className="text-[9px] font-mono text-dark-300">·</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-dark-100 flex items-center justify-between text-[11px] text-dark-500">
              <span>💡 Click to place gate · Right-click/Del to remove</span>
              <span>{numQubits} qubits</span>
            </div>
          </div>

          <div className="grid min-h-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:h-[250px]">
            <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1 flex min-h-0 flex-col">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[11px] text-dark-900">Measurement Probabilities</h3>
                <span className="text-[9px] text-dark-500 font-mono">{shots} shots</span>
              </div>
              <div className="relative mx-auto mt-1 min-h-0 w-full max-w-[280px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                    <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} unit="%" />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Probability']}
                      contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '6px', fontSize: '10px', padding: '4px 8px' }}
                    />
                    <Bar dataKey="prob" fill="#4f46e5" radius={[3, 3, 0, 0]}>
                      {histogramData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.prob > 50 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs gap-2 flex min-h-0 flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[11px] text-dark-900">Quantum Statevector |ψ⟩</h4>
                <span className="text-[9px] font-mono text-dark-500">{numQubits} Qubits ({2 ** numQubits} states)</span>
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-2 auto-rows-max gap-1 overflow-y-auto pr-0.5 text-xs font-mono">
                {currentAmplitudes.slice(0, 2 ** numQubits).map((amp, idx) => {
                  const basisStr = idx.toString(2).padStart(numQubits, '0');
                  const re = amp.re ?? 0;
                  const im = amp.im ?? 0;
                  const probability = (re * re + im * im) * 100;
                  return (
                    <div key={idx} className="min-h-0 rounded-lg border border-dark-200 bg-dark-50 p-1 text-center">
                      <span className="block text-base font-bold text-primary-700">|{basisStr}⟩</span>
                      <span className="mt-0.5 block text-xs text-dark-700">{re.toFixed(2)}{im >= 0 ? '+' : ''}{im.toFixed(2)}i</span>
                      <span className="mt-0.5 block text-xs font-sans font-semibold text-dark-500">{probability.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:row-span-2 self-stretch min-w-0 bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-2.5 flex flex-col">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <h3 className="font-bold text-sm text-dark-900">Code / Bloch Sphere</h3>
            <div className="flex items-center bg-dark-100 p-1 rounded-xl border border-dark-200 shrink-0 shadow-2xs">
              <button
                onClick={() => setRightPanelMode('code')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  rightPanelMode === 'code'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-dark-700 hover:bg-white hover:text-dark-900'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setRightPanelMode('vectors')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  rightPanelMode === 'vectors'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-dark-700 hover:bg-white hover:text-dark-900'
                }`}
              >
                {numQubits > 1 ? `${numQubits} Qubit Vectors` : 'Bloch Sphere'}
              </button>
            </div>
          </div>

          {rightPanelMode === 'vectors' ? (
            <div className="flex flex-1 min-h-0 flex-col gap-1.5">
              <div className={`grid flex-1 grid-cols-1 ${numQubits > 1 ? 'grid-cols-2' : ''} gap-2`}>
                {Array.from({ length: numQubits }, (_, qIdx) => (
                  <div key={qIdx} className="w-full h-full">
                    <BlochSphere3D
                      qubitIndex={qIdx}
                      bloch={currentBlochVectors[qIdx] || null}
                      warning={simResult?.warnings?.find((w) => w.includes(`qubit ${qIdx}`))}
                      size={140}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1">
              <QuantumCircuitCodePanel
                numQubits={numQubits}
                gates={gates}
                title="Code"
                compact={true}
                className="h-full min-h-0"
                editable={true}
                onCircuitCodeChange={(newNum, newGates) => loadPreset(newNum, newGates)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      className="bg-white rounded-3xl border border-dark-200 shadow-xs p-3 sm:p-4 space-y-3"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Quantum Circuit Simulator Workbench"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-dark-900">Quantum Circuit Builder</h1>
            <p className="text-xs text-dark-500">Compact circuit editor and simulator</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-dark-700 uppercase tracking-wide">Qubits</span>
            <div className="inline-flex rounded-lg border border-dark-200 p-0.5 bg-dark-50">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQubits(n)}
                  aria-pressed={numQubits === n}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    numQubits === n
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-100'
                  }`}
                >
                  {n} {n === 1 ? 'Qubit' : 'Qubits'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-3 border-l border-dark-200">
            <span className="text-xs font-semibold text-dark-700 uppercase tracking-wide">Presets</span>
            <button
              onClick={() =>
                loadPreset(2, [
                  { id: 'b1', type: 'h', qubits: [0], step: 0 },
                  { id: 'b2', type: 'cx', qubits: [0, 1], step: 1 }
                ])
              }
              className="px-2.5 py-1 text-xs font-medium rounded bg-dark-100 hover:bg-dark-200 text-dark-800 transition-colors"
            >
              Bell State (|Φ+⟩)
            </button>
            <button
              onClick={() =>
                loadPreset(3, [
                  { id: 'g1', type: 'h', qubits: [0], step: 0 },
                  { id: 'g2', type: 'cx', qubits: [0, 1], step: 1 },
                  { id: 'g3', type: 'cx', qubits: [1, 2], step: 2 }
                ])
              }
              className="px-2.5 py-1 text-xs font-medium rounded bg-dark-100 hover:bg-dark-200 text-dark-800 transition-colors"
            >
              GHZ State (3Q)
            </button>
            <button
              onClick={() =>
                loadPreset(2, [
                  { id: 's1', type: 'h', qubits: [0], step: 0 },
                  { id: 's2', type: 'h', qubits: [1], step: 0 }
                ])
              }
              className="px-2.5 py-1 text-xs font-medium rounded bg-dark-100 hover:bg-dark-200 text-dark-800 transition-colors"
            >
              Superposition
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => clearCircuit()}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dark-200 hover:bg-dark-50 text-dark-700 font-medium text-xs transition-colors"
              title="Clear all gates from circuit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dark-200 hover:bg-dark-50 text-dark-700 font-medium text-xs transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-primary-600" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {renderVisualWorkspace()}

      {exportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-dark-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-dark-200 pb-4">
              <div>
                <h3 className="font-bold text-lg text-dark-900">Export Quantum Circuit Code</h3>
                <p className="text-xs text-dark-500">Copy your circuit as Python Qiskit or OpenQASM 2.0</p>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1 rounded text-dark-400 hover:text-dark-700 hover:bg-dark-100"
              >
                ✕
              </button>
            </div>

            {/* Python Qiskit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-dark-800 font-mono">Python (Qiskit 2.5)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatePythonQiskitCode());
                    setCopiedPython(true);
                    setTimeout(() => setCopiedPython(false), 2000);
                  }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium"
                >
                  {copiedPython ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPython ? 'Copied!' : 'Copy Python'}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-dark-900 text-dark-100 font-mono text-xs overflow-x-auto notranslate" translate="no">
                {generatePythonQiskitCode()}
              </pre>
            </div>

            {/* OpenQASM */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-dark-800 font-mono notranslate" translate="no">OpenQASM 2.0</span>
                <button
                  onClick={copyQasmCode}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium"
                >
                  {copiedQasm ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedQasm ? 'Copied!' : 'Copy QASM'}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-dark-900 text-dark-100 font-mono text-xs overflow-x-auto notranslate" translate="no">
                {simResult?.qasm || generateQasm(numQubits, gates)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
