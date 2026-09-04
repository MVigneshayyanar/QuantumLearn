'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCircuitStore } from '@/lib/state-store';
import { useAccessibility } from '@/lib/accessibility-context';
import { GateType, PlacedGate } from '@/lib/types';
import { translations } from '@/lib/i18n';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import {
  Play,
  RotateCcw,
  Download,
  Code,
  Sliders,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  Columns,
  Server
} from 'lucide-react';
import { QuantumCodeEditor } from './QuantumCodeEditor';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const MAX_STEPS = 8;

const AVAILABLE_GATES: { type: GateType; name: string; desc: string; multi?: boolean; color: string }[] = [
  { type: 'h', name: 'H', desc: 'Hadamard: Creates equal superposition (|0> -> |+>)', color: 'bg-indigo-600 text-white' },
  { type: 'x', name: 'X', desc: 'Pauli-X: Bit flip / Quantum NOT (|0> <-> |1>)', color: 'bg-emerald-600 text-white' },
  { type: 'y', name: 'Y', desc: 'Pauli-Y: Bit and phase flip', color: 'bg-teal-600 text-white' },
  { type: 'z', name: 'Z', desc: 'Pauli-Z: Phase flip (|1> -> -|1>)', color: 'bg-violet-600 text-white' },
  { type: 's', name: 'S', desc: 'Phase Gate: +90° phase shift', color: 'bg-purple-600 text-white' },
  { type: 't', name: 'T', desc: 'T Gate: +45° phase shift (π/8 gate)', color: 'bg-pink-600 text-white' },
  { type: 'cx', name: 'CX', desc: 'CNOT: Controlled NOT (Entanglement)', multi: true, color: 'bg-indigo-700 text-white' },
  { type: 'cz', name: 'CZ', desc: 'Controlled-Z: Inverts phase of |11>', multi: true, color: 'bg-blue-700 text-white' },
  { type: 'swap', name: 'SWAP', desc: 'SWAP: Exchanges state of 2 qubits', multi: true, color: 'bg-cyan-700 text-white' },
  { type: 'measure', name: 'M', desc: 'Measurement in Z computational basis', color: 'bg-dark-800 text-white' },
];

export function CircuitBuilder() {
  const {
    numQubits,
    setNumQubits,
    gates,
    shots,
    setShots,
    addGate,
    removeGateAt,
    clearCircuit,
    loadPreset,
    selectedSlot,
    setSelectedSlot,
    activeStep,
    setActiveStep,
    simResult,
    isLoading,
    runSimulation
  } = useCircuitStore();

  const { language, announce, explanationMode } = useAccessibility();
  const t = translations[language];

  const [selectedGateType, setSelectedGateType] = useState<GateType>('h');
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [targetQubit, setTargetQubit] = useState<number>(1);
  const [copiedQasm, setCopiedQasm] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [stepScrubber, setStepScrubber] = useState<number>(0);
  const [dragOverSlot, setDragOverSlot] = useState<{ qubit: number; step: number } | null>(null);
  const [isDraggingActive, setIsDraggingActive] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'visual' | 'split' | 'code'>('visual');
  const [activeBackend, setActiveBackend] = useState<'qiskit' | 'cirq' | 'pennylane' | 'qbraid'>('qiskit');
  const gridContainerRef = useRef<HTMLDivElement>(null);

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

  const currentSnapshot = simResult?.step_by_step && simResult.step_by_step[stepScrubber]
    ? simResult.step_by_step[stepScrubber]
    : null;

  const currentBlochVectors = currentSnapshot ? currentSnapshot.bloch_vectors : (simResult?.bloch_vectors || []);
  const currentProbs = currentSnapshot ? currentSnapshot.probabilities : (simResult?.probabilities || {});
  const currentAmplitudes = currentSnapshot ? currentSnapshot.statevector : (simResult?.statevector || []);

  const histogramData = Object.entries(simResult?.measurement_counts || currentProbs).map(([basis, countOrProb]) => ({
    state: `|${basis}⟩`,
    value: typeof countOrProb === 'number' ? countOrProb : 0,
    prob: (currentProbs[basis] || 0) * 100
  }));

  const copyQasmCode = () => {
    if (simResult?.qasm) {
      navigator.clipboard.writeText(simResult.qasm);
      setCopiedQasm(true);
      setTimeout(() => setCopiedQasm(false), 2000);
    }
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
      {/* Gate Toolbox */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <h3 className="font-bold text-sm text-dark-900">Quantum Gate Toolbox</h3>
            <span className="text-xs text-dark-500">(Click a gate or press hotkey to place on selected wire)</span>
          </div>
          <span className="text-xs text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full font-medium">
            Keyboard Accessible: Arrow keys + Hotkeys
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {AVAILABLE_GATES.map((gate) => {
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'border-primary-600 ring-2 ring-primary-500/20 bg-primary-50/60 text-primary-900 shadow-xs'
                    : 'border-dark-200 hover:border-dark-300 bg-white text-dark-800 hover:bg-dark-50'
                }`}
                title={`${gate.desc} — Drag & drop onto wire or click to select`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold notranslate ${gate.color}`}
                  translate="no"
                >
                  {gate.name}
                </span>
                <span className="notranslate" translate="no">{gate.type.toUpperCase()}</span>
                {gate.multi && <span className="text-[10px] text-dark-400 uppercase font-mono notranslate" translate="no">2Q</span>}
              </button>
            );
          })}
        </div>

        {/* Multi-qubit configuration if CX/CZ/SWAP selected */}
        {['cx', 'cz', 'swap'].includes(selectedGateType) && (
          <div className="mt-3 p-3 bg-dark-50 rounded-xl border border-dark-200 flex items-center gap-4 text-xs">
            <span className="font-semibold text-dark-800">2-Qubit Target Assignment:</span>
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

      {/* Unified Side-by-Side Stage: Interactive Circuit Wire Grid + Live 3D Bloch Spheres */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Main Interactive Circuit Wire Grid */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-dark-900">Quantum Circuit Board</h3>
            <span className="text-xs text-dark-500 font-mono">
              {numQubits} Qubit{numQubits > 1 ? 's' : ''} · {MAX_STEPS} Steps
            </span>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="min-w-[420px] space-y-4">
              {Array.from({ length: numQubits }, (_, qIdx) => (
                <div key={qIdx} className="flex items-center gap-3">
                  {/* Qubit Label */}
                  <div className="w-16 shrink-0 flex items-center gap-1.5 notranslate" translate="no">
                    <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                    <span className="px-1.5 py-0.5 rounded bg-dark-100 font-mono text-[10px] text-dark-600">|0⟩</span>
                  </div>

                  {/* Wire slots */}
                  <div className="flex-1 flex items-center gap-2 circuit-wire pr-2">
                    {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                      const placed = gates.find((g) => g.step === sIdx && g.qubits.includes(qIdx));
                      const isSelected = selectedSlot?.qubit === qIdx && selectedSlot?.step === sIdx;
                      const isDragOver = dragOverSlot?.qubit === qIdx && dragOverSlot?.step === sIdx;
                      const isControl = placed && placed.type === 'cx' && placed.qubits[0] === qIdx;
                      const isTarget = placed && placed.type === 'cx' && placed.qubits[1] === qIdx;

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
                          className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                            isDragOver
                              ? 'ring-3 ring-primary-500 ring-offset-1 border-primary-600 bg-primary-100 scale-105 shadow-md'
                              : isSelected
                              ? 'ring-2 ring-primary-600 ring-offset-1 border-primary-600 bg-primary-50/80 shadow-xs'
                              : placed
                              ? 'border-dark-300 bg-white shadow-2xs'
                              : isDraggingActive
                              ? 'border-dashed border-primary-400 bg-primary-50/30 animate-pulse'
                              : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/90 hover:bg-primary-50/30'
                          }`}
                          title={
                            placed
                              ? `Step ${sIdx}: ${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')}. Drag to move, or right-click to remove.`
                              : `Step ${sIdx} (Empty). Drag a gate here or click to place ${selectedGateType.toUpperCase()}`
                          }
                        >
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
                              {isControl ? (
                                <div className="w-3 h-3 rounded-full bg-primary-600 ring-2 ring-white" />
                              ) : isTarget ? (
                                <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center font-bold text-primary-700 text-[11px] bg-white">
                                  +
                                </div>
                              ) : (
                                <span
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shadow-xs ${
                                    AVAILABLE_GATES.find((g) => g.type === placed.type)?.color || 'bg-primary-600 text-white'
                                  }`}
                                >
                                  {placed.type.toUpperCase()}
                                </span>
                              )}
                            </div>
                          ) : isDragOver ? (
                            <span className="text-[9px] font-mono font-bold text-primary-700">DROP</span>
                          ) : (
                            <span className="text-[9px] font-mono text-dark-400 opacity-60">S{sIdx}</span>
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
            <span>Backend: <strong className="text-dark-800">Qiskit Aer (Local)</strong></span>
          </div>
        </div>

        {/* Live 3D Bloch Spheres */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs sm:text-sm text-dark-900">Live 3D Bloch Spheres</h3>
            <span className="text-[10px] font-mono text-dark-500">
              {numQubits} Qubit Vector{numQubits > 1 ? 's' : ''}
            </span>
          </div>

          <div className={`grid grid-cols-1 ${numQubits === 1 ? 'grid-cols-1' : numQubits === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'} gap-2.5`}>
            {Array.from({ length: numQubits }, (_, qIdx) => (
              <div key={qIdx} className="w-full">
                <BlochSphere3D
                  qubitIndex={qIdx}
                  bloch={currentBlochVectors[qIdx] || null}
                  warning={simResult?.warnings?.find((w) => w.includes(`qubit ${qIdx}`))}
                  size={numQubits > 2 ? 150 : 180}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="space-y-6"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Quantum Circuit Simulator Workbench"
    >
      {/* Top Interactive Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Qubit Selector & Presets */}
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-dark-700 uppercase tracking-wide">Qubits:</span>
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

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-dark-200">
            <span className="text-xs font-bold text-dark-700 uppercase tracking-wide">Presets:</span>
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
        </div>

        {/* Multi-Backend Simulator Selector & Mode Toggles */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Multi-Backend Selector */}
          <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-xl px-2.5 py-1 text-xs">
            <Server className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="text-dark-500 font-bold uppercase text-[10px]">Backend:</span>
            <select
              value={activeBackend}
              onChange={(e) => setActiveBackend(e.target.value as any)}
              className="bg-white border border-dark-200 rounded-lg px-2 py-0.5 font-medium text-xs text-dark-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-label="Simulation Execution Backend"
            >
              <option value="qiskit">Qiskit Aer (Local Statevector)</option>
              <option value="cirq">Cirq Simulator (Matrix Engine)</option>
              <option value="pennylane">PennyLane default.qubit</option>
              <option value="qbraid">qBraid Cloud SDK (API Key / Coming Soon)</option>
            </select>
            {activeBackend === 'qbraid' && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                Cloud Key Req.
              </span>
            )}
          </div>

          {/* View Mode Toggle: Visual | Split | Code */}
          <div className="inline-flex rounded-xl border border-dark-200 p-0.5 bg-dark-100">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'visual'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-primary-600" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-indigo-600" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'code'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-600" />
              <span>Code</span>
            </button>
          </div>

          {/* Action Buttons: Run, Clear, Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-dark-50 border border-dark-200 rounded-lg px-2 py-1 text-xs">
              <span className="text-dark-500 font-medium">Shots:</span>
              <select
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                aria-label="Measurement Shots Count"
                className="bg-white border border-dark-200 rounded px-1.5 py-0.5 font-mono text-xs font-medium"
              >
                <option value="512">512</option>
                <option value="1024">1024</option>
                <option value="4096">4096</option>
              </select>
            </div>

            <button
              onClick={() => runSimulation()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t.simulator.runSimulation}</span>
            </button>

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

      {/* Workspace: Visual Canvas, Monaco Code Editor, or Live Split View */}
      {viewMode === 'code' && (
        <QuantumCodeEditor
          numQubits={numQubits}
          gates={gates}
          onCircuitParsed={(newNum, newGates) => loadPreset(newNum, newGates)}
          onRunSimulation={() => runSimulation()}
          isLoading={isLoading}
        />
      )}

      {viewMode === 'visual' && renderVisualWorkspace()}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-7">
            {renderVisualWorkspace()}
          </div>
          <div className="xl:col-span-5 sticky top-6">
            <QuantumCodeEditor
              numQubits={numQubits}
              gates={gates}
              onCircuitParsed={(newNum, newGates) => loadPreset(newNum, newGates)}
              onRunSimulation={() => runSimulation()}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Step Scrubber & Playback */}
      {simResult?.step_by_step && simResult.step_by_step.length > 1 && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-sm text-dark-900">Step-by-Step State Playback</h3>
              <span className="text-xs text-dark-500">
                (Step {stepScrubber} of {simResult.step_by_step.length - 1})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={stepScrubber <= 0}
                onClick={() => setStepScrubber((s) => Math.max(0, s - 1))}
                className="p-1 rounded border border-dark-200 disabled:opacity-40 hover:bg-dark-50 transition-colors"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={stepScrubber >= (simResult?.step_by_step?.length || 1) - 1}
                onClick={() => setStepScrubber((s) => Math.min((simResult?.step_by_step?.length || 1) - 1, s + 1))}
                className="p-1 rounded border border-dark-200 disabled:opacity-40 hover:bg-dark-50 transition-colors"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={(simResult?.step_by_step?.length || 1) - 1}
            value={stepScrubber}
            onChange={(e) => setStepScrubber(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />

          {currentSnapshot && (
            <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                {currentSnapshot.step}
              </div>
              <div>
                <h4 className="font-bold text-xs text-primary-900">{currentSnapshot.label}</h4>
                <p className="text-xs text-dark-700 mt-0.5 leading-relaxed">
                  {explanationMode === 'simple'
                    ? currentSnapshot.description_simple || currentSnapshot.label
                    : currentSnapshot.description_technical || currentSnapshot.label}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* State Vector Amplitudes & Measurement Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Vector Breakdown */}
        <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-dark-900">
              Quantum State Vector <span className="notranslate" translate="no">|ψ⟩</span>
            </h3>
            <span className="font-mono text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded notranslate" translate="no">
              Dimension 2^{numQubits} = {1 << numQubits}
            </span>
          </div>

          <div className="space-y-2">
            {currentAmplitudes.map((amp, idx) => {
              const bitstr = idx.toString(2).padStart(numQubits, '0');
              const prob = (currentProbs[bitstr] || 0) * 100;
              return (
                <div key={bitstr} className="p-3 rounded-xl bg-dark-50 border border-dark-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-primary-700 bg-white px-2 py-1 rounded border border-dark-200 shadow-2xs notranslate" translate="no">
                      |{bitstr}⟩
                    </span>
                    <div className="text-xs">
                      <span className="text-dark-500">Amplitude: </span>
                      <span className="font-mono font-bold text-dark-800 notranslate" translate="no">
                        {amp.re >= 0 ? '+' : ''}{amp.re} {amp.im >= 0 ? '+' : ''}{amp.im}i
                      </span>
                    </div>
                  </div>
                  <div className="text-right notranslate" translate="no">
                    <span className="text-xs font-mono font-bold text-dark-900 block">{prob.toFixed(1)}%</span>
                    <span className="text-[10px] text-dark-500">probability</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Measurement Probability Histogram */}
        <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-dark-900">Measurement Histogram ({shots} shots)</h3>
            <span className="text-xs text-dark-500">Computational Basis Z</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="state" tick={{ fontSize: 12, fill: '#374151' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} counts (${item.payload.prob.toFixed(1)}%)`,
                    'Measurements'
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.prob > 0 ? '#4F46E5' : '#D1D5DB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
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
                <p className="text-xs text-dark-500">Run your exact circuit in Python Qiskit or OpenQASM 2.0</p>
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
                {simResult?.qasm || '// OpenQASM representation'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
