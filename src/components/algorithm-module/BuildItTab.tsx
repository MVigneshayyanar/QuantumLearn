'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BUILD_IT_CHALLENGES, evaluateBuildItCircuit, BuildItEvaluation } from '@/lib/build-it-challenges';
import { GateType, PlacedGate } from '@/lib/types';
import { useStudentContext } from '@/lib/student-context';
import { apiReportProgress } from '@/lib/api-helpers';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  Bot,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  ChevronDown,
  Info,
  Wand2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { MathRenderer } from '@/components/math/MathRenderer';
import {
  QuantumGateSymbol,
  GATE_CONFIGS,
  AVAILABLE_GATE_LIST,
  ControlDotIcon,
  TargetPlusIcon,
  SwapXIcon
} from '@/components/circuit/QuantumGateSymbol';

const MAX_STEPS = 8;

interface BuildItTabProps {
  moduleSlug: string;
  onProceedToQuiz: () => void;
}

function FormattedAIFeedback({ message, nextAction }: { message: string; nextAction?: string }) {
  // Split by double newline or bullet lines for compact rendering
  const items = message
    .split(/\n+/)
    .map((p) => p.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {items.map((text, idx) => {
        const lower = text.toLowerCase();
        const isSuccess =
          lower.startsWith('step done') ||
          lower.includes('step accomplished') ||
          lower.includes('what you did right') ||
          lower.includes('successfully') ||
          lower.includes('excellent first step');
        const isNext =
          lower.startsWith('next step') ||
          lower.includes('missing operation') ||
          lower.includes('current focus') ||
          lower.includes('place hadamard') ||
          lower.includes('apply');
        const isClue =
          lower.startsWith('quick clue') ||
          lower.includes('guiding question') ||
          lower.includes('clue:') ||
          lower.includes('?') ||
          lower.includes('physical mechanism');

        if (isSuccess) {
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                ✓
              </div>
              <div className="text-emerald-950 leading-relaxed font-sans min-w-0">
                <MathRenderer text={text} />
              </div>
            </div>
          );
        }

        if (isNext) {
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50/90 border border-amber-300 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                ➜
              </div>
              <div className="text-amber-950 leading-relaxed font-sans min-w-0">
                <MathRenderer text={text} />
              </div>
            </div>
          );
        }

        if (isClue) {
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                💡
              </div>
              <div className="text-indigo-950 leading-relaxed font-medium min-w-0">
                <MathRenderer text={text} />
              </div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="px-3.5 py-2 rounded-xl bg-white/85 border border-amber-200/70 text-xs text-amber-950 leading-relaxed shadow-2xs"
          >
            <MathRenderer text={text} />
          </div>
        );
      })}
    </div>
  );
}

export function BuildItTab({ moduleSlug, onProceedToQuiz }: BuildItTabProps) {
  const challenge = BUILD_IT_CHALLENGES[moduleSlug] || BUILD_IT_CHALLENGES['deutsch-jozsa'];
  const { userId, openLoginModal } = useStudentContext();

  const [gates, setGates] = useState<PlacedGate[]>([]);
  const [selectedGateType, setSelectedGateType] = useState<GateType>('h');
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [targetQubit, setTargetQubit] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<{ qubit: number; step: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ qubit: number; step: number } | null>(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  // Evaluation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [fidelityResult, setFidelityResult] = useState<number | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<BuildItEvaluation | null>(null);
  const [aiCoachingMessage, setAiCoachingMessage] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [activeHintIdx, setActiveHintIdx] = useState(0);

  // Initialize with challenge scaffold
  useEffect(() => {
    setGates([...challenge.scaffoldGates]);
    setHasPassed(false);
    setFidelityResult(null);
    setAiCoachingMessage(null);
    setEvaluationResult(null);
  }, [moduleSlug]);

  const numQubits = challenge.numQubits;

  // Gate manipulation
  const placeGateOnSlot = (qubit: number, step: number, gateTypeToPlace: GateType) => {
    const isMulti = ['cx', 'cz', 'swap'].includes(gateTypeToPlace);
    const newGates = gates.filter((g) => !(g.step === step && g.qubits.includes(qubit)));

    if (isMulti) {
      const tgt = qubit === controlQubit ? (qubit + 1) % numQubits : qubit;
      newGates.push({
        id: `b-gate-${Date.now()}-${step}`,
        type: gateTypeToPlace,
        qubits: [controlQubit, tgt],
        step
      });
    } else {
      newGates.push({
        id: `b-gate-${Date.now()}-${step}`,
        type: gateTypeToPlace,
        qubits: [qubit],
        step
      });
    }

    setGates(newGates);
  };

  const addGateOnSlot = (qubit: number, step: number) => {
    placeGateOnSlot(qubit, step, selectedGateType);
  };

  const removeGateAt = (qubit: number, step: number) => {
    setGates(gates.filter((g) => !(g.step === step && g.qubits.includes(qubit))));
  };

  const handleResetScaffold = () => {
    setGates([...challenge.scaffoldGates]);
    setHasPassed(false);
    setFidelityResult(null);
    setAiCoachingMessage(null);
    setEvaluationResult(null);
  };

  // Submit and evaluate
  const handleSubmitCircuit = async (explicitUserId?: string) => {
    const activeUserId =
      explicitUserId ||
      userId ||
      (typeof window !== 'undefined' ? localStorage.getItem('ql_student_id') : null);

    // Gate submission: user must be signed in
    if (!activeUserId) {
      openLoginModal((loggedInId) => {
        handleSubmitCircuit(loggedInId);
      });
      return;
    }

    setIsSubmitting(true);
    setAiCoachingMessage(null);

    try {
      const evaluation = evaluateBuildItCircuit(challenge, gates);
      setEvaluationResult(evaluation);
      setFidelityResult(evaluation.fidelity);

      if (evaluation.isCorrect) {
        setHasPassed(true);
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}

        apiReportProgress(activeUserId, moduleSlug, 'in_progress', { stageReached: 4 });
      } else {
        setHasPassed(false);
        // Call Schrödinger AI for Socratic explanation
        try {
          const res = await fetch('/api/ai-tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'diagnose_build_it',
              query: evaluation.diagnosisPrompt,
              moduleSlug,
              userGates: gates,
              structuralDiff: evaluation.structuralDiff,
              fidelity: evaluation.fidelity,
              completionPercentage: evaluation.completionPercentage,
              explanationMode: 'simple',
            }),
          });
          const data = await res.json();
          setAiCoachingMessage(data.reply || 'Check your gate sequence against the algorithm requirements.');
        } catch {
          setAiCoachingMessage(
            `Review your gate order: ${evaluation.structuralDiff.join(', ') || 'The statevector phase does not match target.'}`
          );
        }
      }
    } catch (e) {
      console.error('Build It error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live simulation for preview
  const liveSim = simulateLocalCircuit(numQubits, gates, 1024);
  const histogramData = Object.entries(liveSim.probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    prob: Math.round(prob * 100)
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Challenge Description */}
      <div className="bg-white rounded-3xl border border-dark-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              Guided Build It — AI Coaching ON
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-dark-100 text-dark-700">
              {numQubits} Qubits
            </span>
          </div>

          <button
            onClick={handleResetScaffold}
            className="flex items-center gap-1.5 text-xs text-dark-500 hover:text-dark-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Scaffold</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-dark-900 flex items-center gap-2">
            <MathRenderer text={challenge.title} />
          </h2>
          <div className="text-sm font-semibold text-primary-700 mt-1">
            <MathRenderer text={challenge.objective} />
          </div>
          <div className="mt-3 p-4 rounded-2xl bg-dark-50/80 border border-dark-200 text-xs text-dark-700 leading-relaxed whitespace-pre-line font-sans">
            <MathRenderer text={challenge.taskDescription} />
          </div>
        </div>
      </div>

      {/* Gate Toolbox */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary-600" />
            <h3 className="font-bold text-sm text-dark-900">Select Gate to Place</h3>
            <span className="text-xs text-dark-500">(Click a gate, then click wire slot to insert)</span>
          </div>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'border-primary-600 ring-2 ring-primary-500/20 bg-primary-50 text-primary-900 shadow-xs'
                    : 'border-dark-200 hover:border-dark-300 bg-white text-dark-800 hover:bg-dark-50'
                }`}
                title={`${gate.desc} — Drag & drop onto wire or click to select`}
              >
                <QuantumGateSymbol type={gate.type} size="sm" />
                <span className="font-bold font-sans">{gate.name}</span>
                {gate.multi && <span className="text-[10px] text-dark-400 uppercase font-mono">2Q</span>}
              </button>
            );
          })}
        </div>

        {/* 2-Qubit Target Assignment */}
        {['cx', 'cz', 'swap'].includes(selectedGateType) && (
          <div className="mt-3 p-3 bg-dark-50 rounded-xl border border-dark-200 flex items-center gap-4 text-xs">
            <span className="font-semibold text-dark-800">2-Qubit Wire Assignment:</span>
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

      {/* Interactive Circuit Wire Grid */}
      <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[650px] space-y-6">
          {Array.from({ length: numQubits }, (_, qIdx) => (
            <div key={qIdx} className="flex items-center gap-4">
              <div className="w-20 shrink-0 flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-dark-800">q[{qIdx}]</span>
                <span className="px-2 py-0.5 rounded bg-dark-100 font-mono text-xs text-dark-600">|0⟩</span>
              </div>

              <div className="flex-1 flex items-center gap-2 circuit-wire">
                {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                  const placed = gates.find((g) => g.step === sIdx && g.qubits.includes(qIdx));
                  const isSelected = selectedSlot?.qubit === qIdx && selectedSlot?.step === sIdx;
                  const isDragOver = dragOverSlot?.qubit === qIdx && dragOverSlot?.step === sIdx;
                  const isControl = placed && placed.qubits.length > 1 && placed.qubits[0] === qIdx;
                  const isTarget = placed && placed.qubits.length > 1 && placed.qubits[1] === qIdx;

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
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverSlot(null);
                        setIsDraggingActive(false);

                        const moveData = e.dataTransfer.getData('application/quantum-move');
                        if (moveData) {
                          try {
                            const parsed = JSON.parse(moveData);
                            const filtered = gates.filter(
                              (g) => g.id !== parsed.gateId && !(g.step === sIdx && g.qubits.includes(qIdx))
                            );
                            if (['cx', 'cz', 'swap'].includes(parsed.type)) {
                              const tgt = qIdx === 0 ? 1 : 0;
                              filtered.push({
                                id: `b-gate-${Date.now()}-${sIdx}`,
                                type: parsed.type,
                                qubits: [qIdx, tgt],
                                step: sIdx
                              });
                            } else {
                              filtered.push({
                                id: `b-gate-${Date.now()}-${sIdx}`,
                                type: parsed.type,
                                qubits: [qIdx],
                                step: sIdx
                              });
                            }
                            setGates(filtered);
                            return;
                          } catch {}
                        }

                        const droppedType = (e.dataTransfer.getData('application/quantum-gate') ||
                          e.dataTransfer.getData('text/plain') ||
                          selectedGateType) as GateType;

                        if (droppedType && GATE_CONFIGS[droppedType]) {
                          setSelectedGateType(droppedType);
                          placeGateOnSlot(qIdx, sIdx, droppedType);
                        }
                      }}
                      onClick={() => {
                        setSelectedSlot({ qubit: qIdx, step: sIdx });
                        addGateOnSlot(qIdx, sIdx);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        removeGateAt(qIdx, sIdx);
                      }}
                      className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                        isDragOver
                          ? 'ring-3 ring-primary-500 ring-offset-1 border-primary-600 bg-primary-100 scale-105 shadow-md'
                          : isSelected
                          ? 'ring-2 ring-primary-600 ring-offset-2 border-primary-600 bg-primary-50'
                          : placed
                          ? 'border-dark-300 bg-white shadow-xs'
                          : isDraggingActive
                          ? 'border-dashed border-primary-400 bg-primary-50/40 animate-pulse'
                          : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/90 hover:bg-primary-50/30'
                      }`}
                      title={
                        placed
                          ? `Step ${sIdx}: ${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')}. Drag to move, or right-click to remove.`
                          : `Step ${sIdx}: Drag a gate here or click to place ${selectedGateType.toUpperCase()}`
                      }
                    >
                      {/* Vertical line connecting control and target */}
                      {isControl && placed && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-600 pointer-events-none z-0"
                          style={{
                            top: '50%',
                            height: `${(placed.qubits[1] - placed.qubits[0]) * 72}px`
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
                              <ControlDotIcon size={14} />
                            ) : isTarget ? (
                              <TargetPlusIcon size={26} />
                            ) : (
                              <QuantumGateSymbol type={placed.type} size="md" />
                            )
                          ) : placed.type === 'cz' ? (
                            isControl ? (
                              <ControlDotIcon size={14} />
                            ) : isTarget ? (
                              <QuantumGateSymbol type="z" size="sm" />
                            ) : (
                              <QuantumGateSymbol type={placed.type} size="md" />
                            )
                          ) : placed.type === 'swap' ? (
                            <SwapXIcon size={24} />
                          ) : (
                            <QuantumGateSymbol type={placed.type} size="md" />
                          )}
                        </div>
                      ) : isDragOver ? (
                        <span className="text-[9px] font-mono font-bold text-primary-700">DROP</span>
                      ) : (
                        <span className="text-[10px] font-mono text-dark-400 opacity-60">S{sIdx}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-dark-100 flex items-center justify-between text-xs text-dark-500">
          <span>💡 Drag and drop gates onto wire slots, or click to place. Drag placed gates to move them. Right-click to delete.</span>
          <span className="font-mono font-semibold">{gates.length} gates placed</span>
        </div>
      </div>

      {/* Action Bar: Submit Solution */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dark-200 hover:bg-dark-50 text-dark-700 font-semibold text-xs transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-primary-600" />
          <span>{showHints ? 'Hide Socratic Hints' : 'Need a Socratic Hint?'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHints ? 'rotate-180' : ''}`} />
        </button>

        <button
          onClick={() => handleSubmitCircuit()}
          disabled={isSubmitting || gates.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all hover:shadow-card"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Circuit...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Submit & Verify Circuit</span>
            </>
          )}
        </button>
      </div>

      {/* Hints Card */}
      {showHints && (
        <div className="p-5 rounded-2xl bg-primary-50/70 border border-primary-200 space-y-3 text-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary-900">Socratic Coaching Clues ({challenge.hints.length}):</span>
            <div className="flex items-center gap-1">
              {challenge.hints.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHintIdx(i)}
                  className={`w-6 h-6 rounded-md font-bold text-[11px] ${
                    activeHintIdx === i ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="text-primary-800 leading-relaxed">
            <MathRenderer text={challenge.hints[activeHintIdx]} />
          </div>
        </div>
      )}

      {/* Short & Sweet Result Card: Success or AI Coaching */}
      {hasPassed && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-wrap items-center justify-between gap-4 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-emerald-950">Circuit 100% Verified!</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900 font-mono">
                  100% Complete
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Fidelity: {fidelityResult ? `${(fidelityResult * 100).toFixed(1)}%` : '100%'} — Excellent job constructing the algorithm!
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToQuiz}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <span>Unlock Knowledge Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!hasPassed && (evaluationResult || aiCoachingMessage || isSubmitting) && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/90 border border-amber-300 space-y-2.5 text-xs animate-fadeIn shadow-xs">
          {/* Top Line: Title + Completion Badge + Inline Mini Progress Bar */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-amber-200/80">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold text-amber-950">Schrödinger AI Feedback</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold text-amber-900 bg-amber-200/90 border border-amber-300 shadow-2xs">
                {evaluationResult ? `${evaluationResult.completionPercentage}% Complete` : 'Evaluating...'}
              </span>
              {evaluationResult && (
                <span className="text-[11px] text-amber-800 font-medium hidden sm:inline">
                  ({evaluationResult.completedMilestonesCount}/{evaluationResult.totalMilestones} steps)
                </span>
              )}
            </div>

            {/* Inline Mini Progress Bar */}
            {evaluationResult && (
              <div className="w-28 sm:w-36 h-2 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 shadow-2xs"
                  style={{ width: `${Math.max(6, evaluationResult.completionPercentage)}%` }}
                />
              </div>
            )}
          </div>

          {/* Short & Sweet 3-Bullet Guidance */}
          <div className="space-y-1.5 leading-snug">
            {/* 1. Step Done */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-emerald-700 shrink-0">✓ Done:</span>
              <span className="text-emerald-950 font-medium">
                {evaluationResult && evaluationResult.completedMilestonesCount > 0
                  ? evaluationResult.milestones
                      .filter((m) => m.completed)
                      .map((m) => m.label)
                      .join(', ')
                  : 'Circuit started'}
              </span>
            </div>

            {/* 2. Next Step */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-amber-800 shrink-0">➜ Next:</span>
              <span className="font-bold text-amber-950">
                {evaluationResult?.nextActionSuggestion || 'Place the next required quantum gate'}
              </span>
            </div>

            {/* 3. Quick Clue */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-indigo-700 shrink-0">💡 Clue:</span>
              <span className="text-indigo-950 italic">
                <MathRenderer
                  text={
                    evaluationResult?.currentClue ||
                    challenge.hints[0] ||
                    'Review the state transformation required for the next milestone.'
                  }
                />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Live Measurement Histogram */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-3">
        <h4 className="font-bold text-xs text-dark-800 uppercase tracking-wide">Live Canvas Simulation Output</h4>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="state" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Probability']} />
              <Bar dataKey="prob" fill="#7C3AED" radius={[4, 4, 0, 0]}>
                {histogramData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.prob > 50 ? '#10B981' : '#7C3AED'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
