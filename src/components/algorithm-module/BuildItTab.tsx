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
  RotateCcw,
  Bot,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  ChevronDown,
  Info,
  Wand2,
  Code2,
  Cpu,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { MathRenderer } from '@/components/math/MathRenderer';
import { QuantumCircuitCodePanel } from '@/components/circuit/QuantumCircuitCodePanel';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
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

function cleanFeedbackBody(raw: string, headerPattern: RegExp): string {
  return raw
    .replace(headerPattern, '')
    .replace(/^[:\*\s\-–—]+/, '')
    .replace(/[\*\s]+$/, '')
    .trim();
}

function FormattedAIFeedback({ message }: { message: string }) {
  // Normalize and parse message lines
  const lines = message
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2.5">
      {lines.map((rawLine, idx) => {
        // Strip leading bullets/stars/numbers
        const clean = rawLine.replace(/^[•\-\*\d\.]+\s*/, '').trim();
        const lower = clean.toLowerCase();

        // 1. Progress / What is done
        const isProgress =
          lower.startsWith('progress') ||
          lower.startsWith('**progress') ||
          lower.startsWith('step done') ||
          lower.startsWith('✓') ||
          lower.startsWith('completed');

        // 2. Quantum Concept / Physical mechanism
        const isConcept =
          lower.startsWith('quantum concept') ||
          lower.startsWith('**quantum concept') ||
          lower.startsWith('concept') ||
          lower.startsWith('➜') ||
          lower.startsWith('next step');

        // 3. Socratic Inquiry / Clue / Guiding question
        const isClue =
          lower.startsWith('socratic clue') ||
          lower.startsWith('**socratic clue') ||
          lower.startsWith('socratic inquiry') ||
          lower.startsWith('**socratic inquiry') ||
          lower.startsWith('quick clue') ||
          lower.startsWith('💡') ||
          lower.includes('inquiry:');

        if (isProgress) {
          const bodyText = cleanFeedbackBody(
            clean,
            /^(?:✓\s*)?(?:\*\*)?(?:Progress|Step Done|Completed)(?:\*\*)?:?/i
          );
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                ✓
              </div>
              <div className="text-emerald-950 leading-relaxed font-sans min-w-0">
                <span className="font-bold text-emerald-900 mr-1.5">Progress:</span>
                <MathRenderer text={bodyText} />
              </div>
            </div>
          );
        }

        if (isConcept) {
          const bodyText = cleanFeedbackBody(
            clean,
            /^(?:➜\s*)?(?:\*\*)?(?:Quantum Concept|Concept|Next Step)(?:\*\*)?:?/i
          );
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-amber-50/90 border border-amber-300 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                ➜
              </div>
              <div className="text-amber-950 leading-relaxed font-sans min-w-0">
                <span className="font-bold text-amber-900 mr-1.5">Quantum Concept:</span>
                <MathRenderer text={bodyText} />
              </div>
            </div>
          );
        }

        if (isClue) {
          const bodyText = cleanFeedbackBody(
            clean,
            /^(?:💡\s*)?(?:\*\*)?(?:Socratic Clue|Socratic Inquiry|Quick Clue)(?:\*\*)?:?/i
          );
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 flex items-start gap-2.5 shadow-2xs text-xs"
            >
              <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                💡
              </div>
              <div className="text-indigo-950 leading-relaxed font-medium min-w-0">
                <span className="font-bold text-indigo-900 mr-1.5">Socratic Inquiry:</span>
                <MathRenderer text={bodyText} />
              </div>
            </div>
          );
        }

        const fallbackBody = clean.replace(/^[:\*\s\-–—]+/, '').replace(/[\*\s]+$/, '');
        return (
          <div
            key={idx}
            className="px-3.5 py-2 rounded-xl bg-white/90 border border-amber-200/70 text-xs text-dark-900 leading-relaxed shadow-2xs"
          >
            <MathRenderer text={fallbackBody} />
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
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'vectors' | 'code' | 'verify'>('vectors');
  const [isVerifyEnabled, setIsVerifyEnabled] = useState(false);

  // Request dynamic Socratic coaching from Schrödinger AI
  const requestAiSocraticHint = async () => {
    setIsLoadingAi(true);
    const evaluation = evaluateBuildItCircuit(challenge, gates);
    setEvaluationResult(evaluation);

    try {
      const gateSummary = gates.length > 0
        ? gates.map((g) => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`).join(', ')
        : 'Initial scaffold';

      const completedMilestoneLabels = evaluation.milestones
        .filter((m) => m.completed)
        .map((m) => m.label)
        .join(', ') || 'Initial scaffold';
      const nextMilestone = evaluation.milestones.find((m) => !m.completed);

      const prompt = `Algorithm: "${challenge.title}" - ${challenge.objective}
Milestone Progress: ${evaluation.completedMilestonesCount} of ${evaluation.totalMilestones} milestones completed (${evaluation.completionPercentage}%)
Stage Achieved: ${completedMilestoneLabels}
Target Milestone: "${nextMilestone?.label || 'Algorithm Complete'}"
Physical Transformation Goal: "${evaluation.nextActionSuggestion}"
Socratic Inquiry: "${evaluation.currentClue}"

PEDAGOGICAL CONSTRAINT: Socratic coaching only.
NEVER name any gate (do NOT mention H, X, CNOT, CZ, etc.) or wire index.
Return 3 SHORT lines (max 50 words total):
• ✓ Progress: <physical state achieved>
• ➜ Quantum Concept: <physical transformation needed next>
• 💡 Socratic Clue: <inquiry question guiding learner to deduce the unitary matrix>`;

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'diagnose_build_it',
          query: prompt,
          moduleSlug,
          userGates: gates,
          structuralDiff: evaluation.structuralDiff,
          fidelity: evaluation.fidelity,
          completionPercentage: evaluation.completionPercentage,
          explanationMode: 'simple',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setAiCoachingMessage(data.reply);
        }
      }
    } catch (e) {
      console.error('Failed to get AI Socratic hint:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Initialize with challenge scaffold
  useEffect(() => {
    setGates([...challenge.scaffoldGates]);
    setHasPassed(false);
    setFidelityResult(null);
    setAiCoachingMessage(null);
    setEvaluationResult(null);
    setRightPanelMode('vectors');
    setIsVerifyEnabled(false);
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
    setIsSubmitting(false);
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
        // Call Schrödinger AI for dynamic Socratic coaching
        setIsLoadingAi(true);
        try {
          const gateSummary = gates.length > 0
            ? gates.map((g) => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`).join(', ')
            : 'Initial scaffold';

          const completedMilestoneLabels = evaluation.milestones
            .filter((m) => m.completed)
            .map((m) => m.label)
            .join(', ') || 'Initial scaffold';
          const nextMilestone = evaluation.milestones.find((m) => !m.completed);

          const prompt = `Algorithm: "${challenge.title}" - ${challenge.objective}
Milestone Progress: ${evaluation.completedMilestonesCount} of ${evaluation.totalMilestones} milestones completed (${evaluation.completionPercentage}%)
Stage Achieved: ${completedMilestoneLabels}
Target Milestone: "${nextMilestone?.label || 'Algorithm Complete'}"
Physical Transformation Goal: "${evaluation.nextActionSuggestion}"
Socratic Inquiry: "${evaluation.currentClue}"

PEDAGOGICAL CONSTRAINT: Socratic coaching only.
NEVER name any gate (do NOT mention H, X, CNOT, CZ, etc.) or wire index.
Return 3 SHORT lines (max 50 words total):
• ✓ Progress: <physical state achieved>
• ➜ Quantum Concept: <physical transformation needed next>
• 💡 Socratic Clue: <inquiry question guiding learner to deduce the unitary matrix>`;

          const res = await fetch('/api/ai-tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'diagnose_build_it',
              query: prompt,
              moduleSlug,
              userGates: gates,
              structuralDiff: evaluation.structuralDiff,
              fidelity: evaluation.fidelity,
              completionPercentage: evaluation.completionPercentage,
              explanationMode: 'simple',
            }),
          });
          const data = await res.json();
          if (data.reply) {
            setAiCoachingMessage(data.reply);
          }
        } catch {
          console.error('Failed to get AI coaching for circuit verification.');
        } finally {
          setIsLoadingAi(false);
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
  const liveBlochs = liveSim?.bloch_vectors || [];
  const liveAmps = liveSim?.statevector || [];
  const histogramData = Object.entries(liveSim.probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    prob: Number((prob * 100).toFixed(1))
  }));

  return (
    <div className="h-full min-h-0 flex flex-col gap-3 bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs overflow-hidden animate-fadeIn text-xs">
      {/* Top Banner & Challenge Description: Compact Header (~38px) */}
      <div className="shrink-0 bg-white rounded-xl border border-dark-200 px-3.5 py-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-200 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-primary-600" />
            Guided Build It
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-dark-100 text-dark-700 shrink-0">
            {numQubits}Q
          </span>
          <h2 className="text-xs font-bold text-dark-900 truncate">
            <MathRenderer text={challenge.title} />
          </h2>
          <span className="text-[11px] font-medium text-primary-700 truncate hidden md:inline">
            — <MathRenderer text={challenge.objective} />
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetScaffold}
            className="flex items-center gap-1 text-[11px] text-dark-500 hover:text-dark-800 font-medium transition-colors cursor-pointer"
            title="Reset circuit to default scaffold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Cockpit Layout: Side-by-Side Unified Grid Matching Circuit Tab */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:gap-2 lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-[auto_minmax(0,1fr)] lg:items-stretch">
        {/* Left Column (cols 1-7): Toolbox + Circuit Board + Probabilities & Statevector */}
        <div className="lg:row-span-2 grid min-w-0 min-h-0 grid-rows-[auto_minmax(0,250px)] gap-3 lg:pr-0">
          {/* Quantum Circuit Board Card */}
          <div className="bg-white rounded-xl border border-dark-200 p-3 sm:p-4 shadow-xs space-y-2 min-h-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-primary-600" />
                <h3 className="font-bold text-sm text-dark-900">Quantum Circuit Board</h3>
              </div>
            </div>

            {/* Gate Toolbox */}
            <div className="bg-dark-50/70 rounded-xl border border-dark-200 px-3 py-2 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-primary-600" />
                  <span className="font-bold text-xs text-dark-900">Select Gate</span>
                  <span className="text-[10px] text-dark-400 hidden sm:inline">(drag & drop onto wire slot or click)</span>
                </div>
                {['cx', 'cz', 'swap'].includes(selectedGateType) && (
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-dark-600">Ctrl:</span>
                    <select
                      value={controlQubit}
                      onChange={(e) => setControlQubit(Number(e.target.value))}
                      className="bg-white border border-dark-200 rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                    <span className="text-dark-600">Tgt:</span>
                    <select
                      value={targetQubit}
                      onChange={(e) => setTargetQubit(Number(e.target.value))}
                      className="bg-white border border-dark-200 rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 pb-0.5">
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
                      className={`flex items-center gap-1 px-1.5 py-1 rounded-lg border text-[10px] font-semibold cursor-grab active:cursor-grabbing transition-all select-none ${
                        isSelected
                          ? 'border-primary-600 ring-2 ring-primary-500/20 bg-primary-50 text-primary-900 shadow-2xs'
                          : 'border-dark-200 hover:border-dark-300 bg-white text-dark-800 hover:bg-dark-50'
                      }`}
                      title={`${gate.desc} — Drag & drop onto wire or click to select`}
                    >
                      <QuantumGateSymbol type={gate.type} size="sm" />
                      <span className="font-bold font-sans">{gate.name}</span>
                      {gate.multi && <span className="text-[9px] text-dark-400 uppercase font-mono">2Q</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Circuit Canvas */}
            <div className="w-full overflow-x-auto pb-0.5">
              <div className={`w-full min-w-[340px] space-y-2 ${numQubits <= 1 ? 'py-4' : numQubits === 2 ? 'py-2.5' : 'py-1.5'}`}>
                    {/* Step Columns Timeline Header */}
                    <div className="flex items-center gap-2 pl-16">
                      {Array.from({ length: MAX_STEPS }, (_, sIdx) => {
                        return (
                          <div
                            key={sIdx}
                            className="w-11 py-1 rounded text-[10px] font-mono font-bold text-center bg-dark-50 text-dark-600 border border-dark-200/60"
                          >
                            S{sIdx}
                          </div>
                        );
                      })}
                    </div>

                    {/* Qubit Wires */}
                    {Array.from({ length: numQubits }, (_, qIdx) => (
                      <div key={qIdx} className={`flex items-center gap-2 ${numQubits <= 1 ? 'my-6' : numQubits === 2 ? 'my-4' : 'my-2.5'}`}>
                        <div className="w-14 shrink-0 flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                          <span className="px-1.5 py-0.5 rounded bg-dark-100 font-mono text-[10px] text-dark-600">|0⟩</span>
                        </div>

                        <div className="flex-1 flex items-center gap-2 circuit-wire relative pr-1 min-h-12">
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
                                className={`relative z-10 w-11 h-11 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
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
                                    ? `Step ${sIdx}: ${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')}. Right-click to remove.`
                                    : `Step ${sIdx}: Click or drag gate here`
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

              <div className="mt-2 pt-1 border-t border-dark-100 flex items-center justify-between text-[10px] text-dark-500">
                <span>💡 Drag or click gates to wires. Right-click any gate to delete.</span>
                <span className="font-mono font-semibold">{gates.length} gates placed</span>
              </div>
            </div>
          </div>

          {/* Bottom Split Row: Measurement Probabilities + Quantum Statevector (Identical to Circuit Tab) */}
          <div className="grid min-h-0 grid-cols-1 sm:grid-cols-2 gap-2 items-stretch lg:h-[250px]">
            {/* Measurement Probabilities Histogram */}
            <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1 flex min-h-0 flex-col h-full">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[11px] text-dark-900">Measurement Probabilities</h3>
                <span className="text-[9px] text-dark-500 font-mono">1024 shots</span>
              </div>
              <div className="relative mx-auto mt-1 flex-1 w-full max-w-[240px] aspect-square min-h-0 max-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                    <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}% (${Math.round((Number(val) / 100) * 1024)} shots)`, 'Probability']}
                      contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '6px', fontSize: '10px', padding: '4px 8px' }}
                    />
                    <Bar dataKey="prob" fill="#4f46e5" radius={[3, 3, 0, 0]}>
                      {histogramData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.prob > 50 ? '#4f46e5' : '#818cf8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quantum Statevector Readout */}
            <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs gap-2 flex min-h-0 flex-col h-full">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[11px] text-dark-900">Quantum Statevector |ψ⟩</h4>
                <span className="text-[9px] font-mono text-dark-500">{numQubits} Qubits ({Math.pow(2, numQubits)} states)</span>
              </div>
              {liveAmps && liveAmps.length > 0 ? (
                <div className="grid grid-cols-2 auto-rows-fr gap-1 text-xs font-mono flex-1 min-h-0">
                  {liveAmps.map((amp, idx) => {
                    const basisStr = idx.toString(2).padStart(numQubits, '0');
                    const re = amp.re ?? 0;
                    const im = amp.im ?? 0;
                    const magSq = (re * re + im * im) * 100;
                    return (
                      <div key={idx} className="p-1 bg-dark-50 rounded-lg border border-dark-200 text-center flex flex-col items-center justify-center min-h-0">
                        <span className="font-bold text-primary-700 block text-base">|{basisStr}⟩</span>
                        <span className="text-xs text-dark-700 block mt-0.5">
                          {re.toFixed(2)}{im >= 0 ? '+' : ''}{im.toFixed(2)}i
                        </span>
                        <span className="text-xs font-sans font-semibold text-dark-500 block mt-0.5">
                          {magSq.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-dark-500">Run simulation to view statevector.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (cols 8-12): Live 3D Bloch Spheres / Code + Action / AI Coaching Verification Card */}
        <div className="lg:row-span-2 self-stretch min-w-0 bg-white rounded-xl border border-dark-200 p-3 sm:p-4 shadow-xs space-y-3 flex flex-col">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <h3 className="font-bold text-sm text-dark-900">
              {rightPanelMode === 'verify' ? 'Verification' : 'Live 3D Bloch Spheres'}
            </h3>
            <div className="flex items-center bg-dark-100 p-1 rounded-xl border border-dark-200 shrink-0 shadow-2xs">
              <button
                onClick={() => setRightPanelMode('vectors')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  rightPanelMode === 'vectors'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-dark-700 hover:bg-white hover:text-dark-900'
                }`}
              >
                {liveBlochs.length > 1 ? `${liveBlochs.length} Qubit Vectors` : 'Qubit Vector'}
              </button>
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
                onClick={() => {
                  if (isVerifyEnabled) {
                    setRightPanelMode('verify');
                  }
                }}
                disabled={!isVerifyEnabled}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  rightPanelMode === 'verify'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : isVerifyEnabled
                    ? 'text-dark-700 hover:bg-white hover:text-dark-900'
                    : 'text-dark-400 opacity-50 cursor-not-allowed'
                }`}
              >
                Verify
              </button>
            </div>
          </div>

          {rightPanelMode === 'vectors' ? (
            <div className="flex flex-1 min-h-0 flex-col gap-1.5">
              <span className="block text-[10px] font-mono text-dark-500">
                {liveBlochs.length} Qubit Vector{liveBlochs.length > 1 ? 's' : ''}
              </span>
              <div className={`grid flex-1 grid-cols-1 ${liveBlochs.length > 1 ? 'grid-cols-2' : ''} gap-2`}>
                {liveBlochs.map((bv, idx) => (
                  <div key={idx} className="w-full h-full">
                    <BlochSphere3D
                      bloch={bv}
                      qubitIndex={bv ? bv.qubit : idx}
                      size={160}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : rightPanelMode === 'code' ? (
            <div className="min-h-0 flex-1">
              <QuantumCircuitCodePanel
                numQubits={numQubits}
                gates={gates}
                title="Algorithm Code"
                compact={false}
                className="h-full min-h-0"
                editable={true}
                onCircuitCodeChange={(newNum, newGates) => setGates(newGates)}
              />
            </div>
          ) : null}

          {/* Verification and Schrödinger AI guidance */}
          {rightPanelMode === 'verify' && (
          <div className="relative flex min-h-0 flex-1 flex-col gap-2 border-t border-dark-100 pt-2">
            {/* Inline Completion Progress */}
            {evaluationResult && !hasPassed && (
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-dark-100 text-[11px]">
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="font-bold text-amber-950 font-mono">
                    {evaluationResult.completionPercentage}% Done
                  </span>
                  <span className="text-dark-400">
                    ({evaluationResult.completedMilestonesCount}/{evaluationResult.totalMilestones})
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.max(6, evaluationResult.completionPercentage)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Verified Success State */}
            {hasPassed && (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="w-full max-w-md flex flex-col items-center gap-3 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-emerald-950">Congratulations!</h4>
                    <p className="mt-1 text-xs text-dark-600">
                      You successfully built and verified the quantum circuit.
                    </p>
                  </div>

                  <div className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 text-left">
                      <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                        ✓
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-sm text-emerald-950 truncate">Circuit 100% Verified!</h4>
                        <p className="text-[11px] text-emerald-800 truncate">
                          Fidelity: {fidelityResult ? `${(fidelityResult * 100).toFixed(1)}%` : '100%'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0">
                      Ready for Stage 5
                    </span>
                  </div>

                  <p className="text-[11px] text-dark-500">
                    Continue to the knowledge check to test what you learned.
                  </p>
                </div>
              </div>
            )}

            {/* Socratic Feedback Coaching (Dynamic Schrödinger AI Response) */}
            {!hasPassed && (
              <div className="min-h-0 flex-1 overflow-y-auto p-2.5 rounded-xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border border-amber-200/90 space-y-2 text-xs shadow-2xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-amber-200/70 pb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                      <Bot className="w-2.5 h-2.5" />
                    </div>
                    <h4 className="font-bold text-[11px] text-amber-950">Schrödinger AI Guidance</h4>
                  </div>

                </div>

                {aiCoachingMessage ? (
                  <div className="p-2 rounded-lg bg-white/95 border border-amber-200/80 shadow-2xs text-[11px]">
                    <FormattedAIFeedback message={aiCoachingMessage} />
                  </div>
                ) : (
                  <p className="text-[11px] text-dark-500">
                    No AI guidance was returned.
                  </p>
                )}
              </div>
            )}
            {(isSubmitting || isLoadingAi) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-800">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                  <span>Verifying quantum circuit...</span>
                </div>
              </div>
            )}
          </div>
          )}

          <div className="mt-auto border-t border-dark-100 pt-2">
            {hasPassed ? (
              <button
                onClick={onProceedToQuiz}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Stage 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsVerifyEnabled(true);
                  setRightPanelMode('verify');
                  void handleSubmitCircuit();
                }}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
