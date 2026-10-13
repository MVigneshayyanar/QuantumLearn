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
  Wand2,
  Code2,
  BarChart2,
  Columns,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { MathRenderer } from '@/components/math/MathRenderer';
import { QuantumCircuitCodePanel } from '@/components/circuit/QuantumCircuitCodePanel';
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
  const [showHints, setShowHints] = useState(false);
  const [activeHintIdx, setActiveHintIdx] = useState(0);
  const [activeLowerTab, setActiveLowerTab] = useState<'probabilities' | 'code'>('probabilities');
  const [buildViewMode, setBuildViewMode] = useState<'split' | 'gates' | 'code'>('split');

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
          setAiCoachingMessage(data.reply || 'Check your gate sequence against the algorithm requirements.');
        } catch {
          setAiCoachingMessage(
            `• ✓ Progress: Current gates placed.\n• ➜ Quantum Concept: ${evaluation.nextActionSuggestion}\n• 💡 Socratic Clue: ${evaluation.currentClue}`
          );
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
  const histogramData = Object.entries(liveSim.probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    prob: Math.round(prob * 100)
  }));

  return (
    <div className="space-y-2 animate-fadeIn text-xs">
      {/* Top Banner & Challenge Description: Compact Header (~38px) */}
      <div className="bg-white rounded-xl border border-dark-200 px-3.5 py-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
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
          {/* View mode switcher */}
          <div className="flex items-center bg-dark-100 p-0.5 rounded-lg border border-dark-200">
            <button
              onClick={() => setBuildViewMode('split')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                buildViewMode === 'split'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
              title="Side-by-side visual circuit and live editable Python code"
            >
              <Columns className="w-2.5 h-2.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setBuildViewMode('gates')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                buildViewMode === 'gates'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
              title="Visual circuit wires"
            >
              <Cpu className="w-2.5 h-2.5" />
              <span>Gates</span>
            </button>
            <button
              onClick={() => setBuildViewMode('code')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                buildViewMode === 'code'
                  ? 'bg-white text-primary-700 shadow-2xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
              title="Python code"
            >
              <Code2 className="w-2.5 h-2.5" />
              <span>Code</span>
            </button>
          </div>

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

      {/* Cockpit Layout: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
        {/* Left Column (cols 1-7): Gate Toolbox + Circuit Wire Grid */}
        <div className="lg:col-span-7 space-y-2">
          {/* Gate Toolbox */}
          {buildViewMode !== 'code' && (
            <div className="bg-white rounded-xl border border-dark-200 px-3 py-2 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-primary-600" />
                  <span className="font-bold text-xs text-dark-900">Select Gate</span>
                  <span className="text-[10px] text-dark-400 hidden sm:inline">(drag & drop onto wire slot)</span>
                </div>
                {['cx', 'cz', 'swap'].includes(selectedGateType) && (
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-dark-600">Ctrl:</span>
                    <select
                      value={controlQubit}
                      onChange={(e) => setControlQubit(Number(e.target.value))}
                      className="bg-dark-50 border border-dark-200 rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                    <span className="text-dark-600">Tgt:</span>
                    <select
                      value={targetQubit}
                      onChange={(e) => setTargetQubit(Number(e.target.value))}
                      className="bg-dark-50 border border-dark-200 rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1">
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
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold cursor-grab active:cursor-grabbing transition-all select-none ${
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
          )}

          {/* Interactive Circuit Canvas & Live Code Editor (Side-by-Side in Split Mode) */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Visual Circuit Wire Grid */}
            {buildViewMode !== 'code' && (
              <div
                className={`bg-white rounded-xl border border-dark-200 p-2.5 shadow-xs overflow-x-auto ${
                  buildViewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
                }`}
              >
                <div className="min-w-[320px] space-y-2">
                  {Array.from({ length: numQubits }, (_, qIdx) => (
                    <div key={qIdx} className="flex items-center gap-2">
                      <div className="w-12 shrink-0 flex items-center gap-1">
                        <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                        <span className="px-1 py-0.5 rounded bg-dark-100 font-mono text-[9px] text-dark-600">|0⟩</span>
                      </div>

                      <div className="flex-1 flex items-center gap-1 circuit-wire">
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
                              className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                                isDragOver
                                  ? 'ring-2 ring-primary-500 border-primary-600 bg-primary-100 scale-105 shadow-xs'
                                  : isSelected
                                  ? 'ring-2 ring-primary-600 border-primary-600 bg-primary-50'
                                  : placed
                                  ? 'border-dark-300 bg-white shadow-2xs'
                                  : isDraggingActive
                                  ? 'border-dashed border-primary-400 bg-primary-50/40 animate-pulse'
                                  : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/90 hover:bg-primary-50/30'
                              }`}
                              title={
                                placed
                                  ? `Step ${sIdx}: ${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')}. Right-click to remove.`
                                  : `Step ${sIdx}: Click or drag gate here`
                              }
                            >
                              {/* Vertical line connecting control and target */}
                              {isControl && placed && (
                                <div
                                  className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-600 pointer-events-none z-0"
                                  style={{
                                    top: '50%',
                                    height: `${(placed.qubits[1] - placed.qubits[0]) * 44}px`
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
                                      <ControlDotIcon size={11} />
                                    ) : isTarget ? (
                                      <TargetPlusIcon size={18} />
                                    ) : (
                                      <QuantumGateSymbol type={placed.type} size="sm" />
                                    )
                                  ) : placed.type === 'cz' ? (
                                    isControl ? (
                                      <ControlDotIcon size={11} />
                                    ) : isTarget ? (
                                      <QuantumGateSymbol type="z" size="sm" />
                                    ) : (
                                      <QuantumGateSymbol type={placed.type} size="sm" />
                                    )
                                  ) : placed.type === 'swap' ? (
                                    <SwapXIcon size={16} />
                                  ) : (
                                    <QuantumGateSymbol type={placed.type} size="sm" />
                                  )}
                                </div>
                              ) : isDragOver ? (
                                <span className="text-[8px] font-mono font-bold text-primary-700">DROP</span>
                              ) : (
                                <span className="text-[8px] font-mono text-dark-400 opacity-60">S{sIdx}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-1 border-t border-dark-100 flex items-center justify-between text-[10px] text-dark-500">
                  <span>💡 Drag/click gate to wire.</span>
                  <span className="font-mono font-semibold">{gates.length} gates placed</span>
                </div>
              </div>
            )}

            {/* Beside visual wires: Live Bidirectional Code Panel */}
            {buildViewMode !== 'gates' && (
              <div
                className={`bg-white rounded-xl border border-dark-200 p-2 shadow-xs ${
                  buildViewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
                }`}
              >
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary-600" />
                    <span className="font-bold text-xs text-dark-900">Live Code Sync</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                      2-WAY LIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-dark-400">Type code to place gates</span>
                </div>
                <QuantumCircuitCodePanel
                  numQubits={numQubits}
                  gates={gates}
                  editable={true}
                  onCircuitCodeChange={(newNum, newGates) => setGates(newGates)}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Lower Left Card: Live Measurement Probabilities */}
          <div className="bg-white rounded-xl border border-dark-200 p-2.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-primary-600" />
                <span className="font-bold text-xs text-dark-900">Live Measurement Probabilities</span>
              </div>
              <span className="text-[10px] font-mono text-dark-500">1024 shots</span>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 4, right: 8, left: -25, bottom: 0 }}>
                  <XAxis dataKey="state" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Probability']} />
                  <Bar dataKey="prob" fill="#7C3AED" radius={[3, 3, 0, 0]}>
                    {histogramData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.prob > 50 ? '#10B981' : '#7C3AED'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (cols 8-12): Actions, AI Coaching & Milestones */}
        <div className="lg:col-span-5 space-y-2">
          {/* Action Header Card */}
          <div className="bg-white rounded-xl border border-dark-200 p-3 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleSubmitCircuit()}
                disabled={isSubmitting || gates.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Verify Circuit</span>
                  </>
                )}
              </button>

              <button
                onClick={requestAiSocraticHint}
                disabled={isLoadingAi}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-primary-300 bg-primary-50 hover:bg-primary-100 text-primary-800 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                title="Get hint from Schrödinger AI"
              >
                {isLoadingAi ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                )}
                <span>Hint</span>
              </button>
            </div>

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
          </div>

          {/* Verified Success State */}
          {hasPassed && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  ✓
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-xs text-emerald-950 truncate">Circuit 100% Verified!</h4>
                  <p className="text-[10px] text-emerald-800 truncate">
                    Fidelity: {fidelityResult ? `${(fidelityResult * 100).toFixed(1)}%` : '100%'}
                  </p>
                </div>
              </div>

              <button
                onClick={onProceedToQuiz}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <span>Stage 5 →</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Socratic Feedback Coaching (Dynamic Schrödinger AI Response) */}
          {!hasPassed && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border border-amber-200/90 space-y-2 text-xs shadow-2xs animate-fadeIn max-h-[310px] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    <Bot className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-[11px] text-amber-950">Schrödinger AI Guidance</h4>
                </div>

                {isLoadingAi ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-600" />
                    <span>Thinking...</span>
                  </span>
                ) : (
                  <button
                    onClick={requestAiSocraticHint}
                    className="text-[9px] font-bold text-primary-700 hover:text-primary-900 bg-white border border-primary-200 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-primary-600" />
                    <span>Ask AI</span>
                  </button>
                )}
              </div>

              {/* AI Coaching Response Content */}
              {isLoadingAi ? (
                <div className="py-3 flex items-center justify-center gap-2 text-xs text-amber-800 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Analyzing quantum circuit...</span>
                </div>
              ) : aiCoachingMessage ? (
                <div className="p-2.5 rounded-lg bg-white/95 border border-amber-200/80 shadow-2xs text-[11px]">
                  <FormattedAIFeedback message={aiCoachingMessage} />
                </div>
              ) : (
                <div className="space-y-1 text-[11px] leading-snug">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-emerald-700 shrink-0">✓</span>
                    <span className="text-emerald-950 font-medium truncate">
                      {evaluationResult && evaluationResult.completedMilestonesCount > 0
                        ? evaluationResult.milestones
                            .filter((m) => m.completed)
                            .map((m) => m.label)
                            .join(' · ')
                        : 'Scaffold loaded'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-amber-900 shrink-0">➜</span>
                    <span className="font-bold text-dark-900">
                      {evaluationResult?.nextActionSuggestion || 'Synthesize next quantum transformation'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-indigo-700 shrink-0">💡</span>
                    <span className="text-indigo-950 font-medium italic">
                      <MathRenderer
                        text={
                          evaluationResult?.currentClue ||
                          challenge.hints[0] ||
                          'Analyze which quantum unitary causes the desired state transformation.'
                        }
                      />
                    </span>
                  </div>
                </div>
              )}

              {/* Milestone Tracker Badges */}
              {evaluationResult && (
                <div className="pt-1.5 border-t border-amber-200/60 flex flex-wrap items-center gap-1 text-[9px]">
                  <span className="font-bold text-amber-900 mr-0.5">Milestones:</span>
                  {evaluationResult.milestones.map((m, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                        m.completed
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-white/80 text-dark-500 border border-dark-200'
                      }`}
                    >
                      <span>{m.completed ? '✓' : '○'}</span>
                      <span>{m.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
