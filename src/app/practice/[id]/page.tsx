'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  PRACTICE_PROBLEMS,
  evaluatePracticeSubmission,
  PracticeProblem,
  SubmissionVerdict
} from '@/lib/practice-problems';
import { MathRenderer } from '@/components/math/MathRenderer';
import { GateType, PlacedGate } from '@/lib/types';
import { useStudentContext } from '@/lib/student-context';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  History,
  Info,
  Check,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

interface SubmissionRecord {
  timestamp: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'INVALID_CIRCUIT';
  message: string;
  executionTimeMs: number;
  fidelityOrProb?: string;
}

export default function PracticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, openLoginModal } = useStudentContext();

  const problemId = params?.id as string;
  const problem = PRACTICE_PROBLEMS.find((p) => p.id === problemId);

  const [gates, setGates] = useState<PlacedGate[]>([]);
  const [selectedGateType, setSelectedGateType] = useState<GateType>('h');
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [targetQubit, setTargetQubit] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<{ qubit: number; step: number } | null>(null);

  const [verdict, setVerdict] = useState<SubmissionVerdict | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    if (!problem) return;
    try {
      const history = JSON.parse(localStorage.getItem(`ql_practice_history_${problem.id}`) || '[]');
      setSubmissions(history);
    } catch {}
  }, [problem]);

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-dark-900">Problem Not Found</h2>
        <Link href="/practice" className="text-primary-600 font-semibold text-sm hover:underline">
          Return to Practice Arena
        </Link>
      </div>
    );
  }

  const numQubits = problem.numQubits;

  // Gate manipulation
  const placeGateOnSlot = (qubit: number, step: number) => {
    const isMulti = ['cx', 'cz', 'swap'].includes(selectedGateType);
    const newGates = gates.filter((g) => !(g.step === step && g.qubits.includes(qubit)));

    if (isMulti) {
      const tgt = qubit === controlQubit ? (qubit + 1) % numQubits : qubit;
      newGates.push({
        id: `p-gate-${Date.now()}-${step}`,
        type: selectedGateType,
        qubits: [controlQubit, tgt],
        step
      });
    } else {
      newGates.push({
        id: `p-gate-${Date.now()}-${step}`,
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

  const handleClearCircuit = () => {
    setGates([]);
    setVerdict(null);
  };

  const handleSubmitSolution = async (explicitUserId?: string) => {
    const activeUserId =
      explicitUserId ||
      userId ||
      (typeof window !== 'undefined' ? localStorage.getItem('ql_student_id') : null);

    // Gate submission: user must be signed in
    if (!activeUserId) {
      openLoginModal((loggedInId) => {
        handleSubmitSolution(loggedInId);
      });
      return;
    }

    setIsEvaluating(true);
    setVerdict(null);

    // Strict evaluation against problem criteria
    const result = evaluatePracticeSubmission(problem, numQubits, gates);
    setVerdict(result);
    setIsEvaluating(false);

    // Save in history
    const record: SubmissionRecord = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: result.status,
      message: result.message,
      executionTimeMs: result.executionTimeMs,
      fidelityOrProb: result.fidelity !== undefined
        ? `Fidelity: ${(result.fidelity * 100).toFixed(1)}%`
        : result.measuredProbability !== undefined
        ? `Probability: ${(result.measuredProbability * 100).toFixed(1)}%`
        : undefined
    };

    const newHistory = [record, ...submissions].slice(0, 10);
    setSubmissions(newHistory);

    try {
      localStorage.setItem(`ql_practice_history_${problem.id}`, JSON.stringify(newHistory));

      // Update Solved / Attempted lists
      const solvedList: string[] = JSON.parse(localStorage.getItem('ql_practice_solved') || '[]');
      const attemptedList: string[] = JSON.parse(localStorage.getItem('ql_practice_attempted') || '[]');

      if (result.status === 'ACCEPTED') {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch {}

        if (!solvedList.includes(problem.id)) {
          solvedList.push(problem.id);
          localStorage.setItem('ql_practice_solved', JSON.stringify(solvedList));
        }
      } else {
        if (!attemptedList.includes(problem.id)) {
          attemptedList.push(problem.id);
          localStorage.setItem('ql_practice_attempted', JSON.stringify(attemptedList));
        }
      }

      // Sync with Neon DB backend API
      if (activeUserId) {
        fetch('/api/practice-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: activeUserId,
            problemId: problem.id,
            isCorrect: result.status === 'ACCEPTED',
            circuitJson: gates,
            executionTimeMs: result.executionTimeMs
          })
        }).catch(() => {});
      }
    } catch {}
  };

  // Live simulation for preview
  const liveSim = simulateLocalCircuit(numQubits, gates, 1024);
  const histogramData = Object.entries(liveSim.probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    prob: Math.round(prob * 100)
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/practice"
          className="flex items-center gap-1.5 text-xs font-semibold text-dark-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem List</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Strict Judge: No AI Hints
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white rounded-3xl border border-dark-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
            {problem.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mt-1 flex items-center gap-2">
            <MathRenderer text={problem.title} />
          </h1>
        </div>

        <div className="text-sm text-dark-700 leading-relaxed">
          <MathRenderer text={problem.description} />
        </div>

        <div className="p-4 rounded-2xl bg-dark-50 border border-dark-200 space-y-1.5">
          <span className="font-bold text-xs text-dark-900 block">Task:</span>
          <div className="text-xs text-dark-700 leading-relaxed">
            <MathRenderer text={problem.task} />
          </div>
        </div>

        {/* Constraints Box */}
        <div className="pt-2 border-t border-dark-100 flex flex-wrap gap-4 text-xs text-dark-600">
          <div>
            <strong className="text-dark-900">Qubits:</strong> {problem.numQubits}
          </div>
          <div>
            <strong className="text-dark-900">Allowed Gate Set:</strong>{' '}
            <span className="font-mono text-primary-700 font-bold">
              {problem.allowedGates.map((g) => g.toUpperCase()).join(', ')}
            </span>
          </div>
          {problem.maxGates && (
            <div>
              <strong className="text-dark-900">Max Gates:</strong> {problem.maxGates}
            </div>
          )}
          <div>
            <strong className="text-dark-900">Judge Criteria:</strong>{' '}
            {problem.checkerType === 'fidelity' ? 'Statevector Fidelity ≥ 99.9%' : `Target Outcome ≥ ${(problem.targetOutcome?.minProbability || 0.95) * 100}%`}
          </div>
        </div>
      </div>

      {/* Gate Toolbox */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-dark-900">Select Gate</h3>
            <span className="text-xs text-dark-500">(Click a gate, then click wire slot to place)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {AVAILABLE_GATES.filter((g) => problem.allowedGates.includes(g.type)).map((gate) => {
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

        {/* 2-Qubit Selector if CNOT/CZ/SWAP */}
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

      {/* Circuit Wire Grid */}
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
                        placeGateOnSlot(qIdx, sIdx);
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

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleClearCircuit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dark-200 hover:bg-dark-50 text-dark-700 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Circuit</span>
        </button>

        <button
          onClick={() => handleSubmitSolution()}
          disabled={isEvaluating || gates.length === 0}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all hover:shadow-card"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Submit Solution to Judge</span>
        </button>
      </div>

      {/* Judge Verdict Banner */}
      {verdict && (
        <div
          className={`p-6 rounded-3xl border-2 space-y-3 animate-fadeIn ${
            verdict.status === 'ACCEPTED'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : verdict.status === 'WRONG_ANSWER'
              ? 'bg-red-50 border-red-400 text-red-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {verdict.status === 'ACCEPTED' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : verdict.status === 'WRONG_ANSWER' ? (
                <XCircle className="w-8 h-8 text-red-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-lg">
                  {verdict.status === 'ACCEPTED'
                    ? 'Accepted — All Tests Passed!'
                    : verdict.status === 'WRONG_ANSWER'
                    ? 'Wrong Answer'
                    : 'Invalid Circuit'}
                </h3>
                <p className="text-xs opacity-90">{verdict.message}</p>
              </div>
            </div>

            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/70 border border-current shrink-0">
              Runtime: {verdict.executionTimeMs} ms
            </span>
          </div>
        </div>
      )}

      {/* Live Measurement Histogram */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-3">
        <h4 className="font-bold text-xs text-dark-800 uppercase tracking-wide">Live Measurement Probabilities</h4>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="state" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Probability']} />
              <Bar dataKey="prob" fill="#059669" radius={[4, 4, 0, 0]}>
                {histogramData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.prob > 50 ? '#059669' : '#94A3B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Past Submissions History Table */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-dark-600" />
              <h3 className="font-bold text-sm text-dark-900">Past Submission History</h3>
            </div>
            <span className="text-xs text-dark-500">{submissions.length} attempts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-dark-200 text-dark-500 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 pr-4">Time</th>
                  <th className="py-2.5 pr-4">Verdict</th>
                  <th className="py-2.5 pr-4">Metric</th>
                  <th className="py-2.5 text-right">Runtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {submissions.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-dark-50/50">
                    <td className="py-2.5 pr-4 font-mono text-dark-500">{sub.timestamp}</td>
                    <td className="py-2.5 pr-4 font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          sub.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'WRONG_ANSWER'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-dark-700">{sub.fidelityOrProb || '—'}</td>
                    <td className="py-2.5 text-right font-mono text-dark-500">{sub.executionTimeMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
