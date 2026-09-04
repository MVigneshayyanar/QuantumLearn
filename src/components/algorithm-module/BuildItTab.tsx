'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BUILD_IT_CHALLENGES, evaluateBuildItCircuit } from '@/lib/build-it-challenges';
import { GateType, PlacedGate } from '@/lib/types';
import { useStudentContext } from '@/lib/student-context';
import { apiReportProgress } from '@/lib/api-helpers';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
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

const AVAILABLE_GATES: { type: GateType; name: string; desc: string; multi?: boolean; color: string }[] = [
  { type: 'h', name: 'H', desc: 'Hadamard: Creates equal superposition', color: 'bg-indigo-600 text-white' },
  { type: 'x', name: 'X', desc: 'Pauli-X: Bit flip', color: 'bg-emerald-600 text-white' },
  { type: 'y', name: 'Y', desc: 'Pauli-Y: Bit and phase flip', color: 'bg-teal-600 text-white' },
  { type: 'z', name: 'Z', desc: 'Pauli-Z: Phase flip', color: 'bg-violet-600 text-white' },
  { type: 's', name: 'S', desc: 'Phase Gate: +90° phase shift', color: 'bg-purple-600 text-white' },
  { type: 't', name: 'T', desc: 'T Gate: +45° phase shift', color: 'bg-pink-600 text-white' },
  { type: 'cx', name: 'CX', desc: 'CNOT: Controlled NOT (Entanglement)', multi: true, color: 'bg-indigo-700 text-white' },
  { type: 'cz', name: 'CZ', desc: 'Controlled-Z: Inverts phase of |11>', multi: true, color: 'bg-blue-700 text-white' },
  { type: 'swap', name: 'SWAP', desc: 'SWAP: Exchanges state of 2 qubits', multi: true, color: 'bg-cyan-700 text-white' },
  { type: 'measure', name: 'M', desc: 'Measurement in computational basis', color: 'bg-dark-800 text-white' },
];

const MAX_STEPS = 8;

interface BuildItTabProps {
  moduleSlug: string;
  onProceedToQuiz: () => void;
}

export function BuildItTab({ moduleSlug, onProceedToQuiz }: BuildItTabProps) {
  const challenge = BUILD_IT_CHALLENGES[moduleSlug] || BUILD_IT_CHALLENGES['deutsch-jozsa'];
  const { userId, openLoginModal } = useStudentContext();

  const [gates, setGates] = useState<PlacedGate[]>([]);
  const [selectedGateType, setSelectedGateType] = useState<GateType>('h');
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [targetQubit, setTargetQubit] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<{ qubit: number; step: number } | null>(null);

  // Evaluation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [fidelityResult, setFidelityResult] = useState<number | null>(null);
  const [aiCoachingMessage, setAiCoachingMessage] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [activeHintIdx, setActiveHintIdx] = useState(0);

  // Initialize with challenge scaffold
  useEffect(() => {
    setGates([...challenge.scaffoldGates]);
    setHasPassed(false);
    setFidelityResult(null);
    setAiCoachingMessage(null);
  }, [moduleSlug]);

  const numQubits = challenge.numQubits;

  // Gate manipulation
  const addGateOnSlot = (qubit: number, step: number) => {
    const isMulti = ['cx', 'cz', 'swap'].includes(selectedGateType);
    const newGates = gates.filter((g) => !(g.step === step && g.qubits.includes(qubit)));

    if (isMulti) {
      const tgt = qubit === controlQubit ? (qubit + 1) % numQubits : qubit;
      newGates.push({
        id: `b-gate-${Date.now()}-${step}`,
        type: selectedGateType,
        qubits: [controlQubit, tgt],
        step
      });
    } else {
      newGates.push({
        id: `b-gate-${Date.now()}-${step}`,
        type: selectedGateType,
        qubits: [qubit],
        step
      });
    }

    setGates(newGates);
  };

  const removeGateAt = (qubit: number, step: number) => {
    setGates(gates.filter((g) => !(g.step === step && g.qubits.includes(qubit))));
  };

  const handleResetScaffold = () => {
    setGates([...challenge.scaffoldGates]);
    setHasPassed(false);
    setFidelityResult(null);
    setAiCoachingMessage(null);
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
          {AVAILABLE_GATES.map((gate) => {
            const isSelected = selectedGateType === gate.type;
            return (
              <button
                key={gate.type}
                onClick={() => setSelectedGateType(gate.type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all select-none hover:scale-105 active:scale-95 ${
                  isSelected
                    ? 'border-primary-600 ring-2 ring-primary-500/20 bg-primary-50 text-primary-900 shadow-xs'
                    : 'border-dark-200 hover:border-dark-300 bg-white text-dark-800 hover:bg-dark-50'
                }`}
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${gate.color}`}>
                  {gate.name}
                </span>
                <span>{gate.type.toUpperCase()}</span>
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

                  return (
                    <div
                      key={sIdx}
                      onClick={() => {
                        setSelectedSlot({ qubit: qIdx, step: sIdx });
                        addGateOnSlot(qIdx, sIdx);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        removeGateAt(qIdx, sIdx);
                      }}
                      className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                        isSelected
                          ? 'ring-2 ring-primary-600 ring-offset-2 border-primary-600 bg-primary-50'
                          : placed
                          ? 'border-dark-300 bg-white shadow-xs'
                          : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/90 hover:bg-primary-50/30'
                      }`}
                      title={placed ? `Right-click to remove ${placed.type.toUpperCase()}` : `Click to place ${selectedGateType.toUpperCase()}`}
                    >
                      {placed ? (
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-2xs ${
                            AVAILABLE_GATES.find((g) => g.type === placed.type)?.color || 'bg-primary-600 text-white'
                          }`}
                        >
                          {placed.type.toUpperCase()}
                        </div>
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
          <span>Click on wire slots to place gates. Right-click any placed gate to delete.</span>
          <span>{gates.length} gates placed</span>
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

      {/* Result Card: Success or Socratic AI Coaching */}
      {hasPassed && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-emerald-950">Circuit Construction Verified!</h3>
                <p className="text-xs text-emerald-800">
                  Fidelity: {fidelityResult ? `${(fidelityResult * 100).toFixed(1)}%` : '100%'} — Your quantum gate sequence accurately implements the algorithm!
                </p>
              </div>
            </div>

            <button
              onClick={onProceedToQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <span>Unlock Knowledge Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mini probabilities preview */}
          <div className="pt-2 border-t border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-900 block mb-2">Simulated Measurement Probabilities:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(liveSim.probabilities).map(([st, p]) => (
                <span key={st} className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 font-mono text-xs text-emerald-950">
                  |{st}⟩: <strong>{Math.round(p * 100)}%</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasPassed && aiCoachingMessage && (
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-300 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Bot className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Schrödinger AI Tutor — Guided Feedback</span>
          </div>

          <div className="text-xs text-amber-950 leading-relaxed whitespace-pre-line pl-7">
            <MathRenderer text={aiCoachingMessage} />
          </div>

          <div className="pl-7 pt-2 flex items-center gap-3">
            <span className="text-[11px] text-amber-800">
              💡 Review the circuit layout above, adjust your gate placements, and click &quot;Submit &amp; Verify Circuit&quot; to try again.
            </span>
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
