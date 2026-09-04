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
  ChevronRight,
  Terminal,
  BarChart3,
  HelpCircle,
  Settings,
  X,
  Layout,
  Code2,
  Keyboard
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
    if (!userId) {
      setSubmissions([]);
      return;
    }
    try {
      const history = JSON.parse(localStorage.getItem(`ql_practice_history_${problem.id}`) || '[]');
      setSubmissions(history);
    } catch {
      setSubmissions([]);
    }
  }, [problem, userId]);

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

  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'submissions' | 'hints'>('description');
  const [activeRightBottomTab, setActiveRightBottomTab] = useState<'testresult' | 'probabilities'>('testresult');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'layout' | 'editor' | 'shortcuts'>('layout');
  const [buttonPlacement, setButtonPlacement] = useState<'toolbar' | 'editor'>('toolbar');
  const [layoutRatio, setLayoutRatio] = useState<'split-5-7' | 'split-6-6' | 'split-7-5' | 'full-editor'>('split-5-7');
  const [fontFamilySetting, setFontFamilySetting] = useState<'default' | 'fira' | 'source'>('default');
  const [fontSizeSetting, setFontSizeSetting] = useState('13px');
  const [tabSizeSetting, setTabSizeSetting] = useState('4 spaces');
  const [wordWrapSetting, setWordWrapSetting] = useState(true);
  const [relativeLineNumbers, setRelativeLineNumbers] = useState(false);
  const [fontLigatures, setFontLigatures] = useState(false);
  const [keyBinding, setKeyBinding] = useState('Standard');
  const [runCodeShortcut, setRunCodeShortcut] = useState(true);
  const [submitShortcut, setSubmitShortcut] = useState(true);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut keys if user is typing inside an input/select/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Submit: Ctrl + Enter
      if (submitShortcut && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (gates.length > 0 && !isEvaluating) {
          handleSubmitSolution();
        }
      }
      // Run Code / Refresh Live: Ctrl + ' or Ctrl + R
      else if (runCodeShortcut && (e.ctrlKey || e.metaKey) && (e.key === "'" || e.key === 'r')) {
        e.preventDefault();
        setActiveRightBottomTab('testresult');
      }
      // Open Settings: Ctrl + ,
      else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
      // Reset Circuit: Ctrl + Alt + R
      else if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleClearCircuit();
      }
      // Close Modal / Clear Selection: Alt + W or Escape
      else if ((e.altKey && (e.key === 'w' || e.key === 'W')) || e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (selectedSlot) {
          setSelectedSlot(null);
        }
      }
      // Delete Selected Slot Gate: Delete or Backspace
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedSlot) {
        e.preventDefault();
        removeGateAt(selectedSlot.qubit, selectedSlot.step);
      }
      // Maximize Editor Panel: Alt + +
      else if (e.altKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setLayoutRatio((prev) => (prev === 'full-editor' ? 'split-5-7' : 'full-editor'));
      }
      // Full Screen: Alt + F
      else if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
      // Switch Left Tabs: Alt + 1, Alt + 2, Alt + 3
      else if (e.altKey && e.key === '1') {
        e.preventDefault();
        setActiveLeftTab('description');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setActiveLeftTab('submissions');
      } else if (e.altKey && e.key === '3') {
        e.preventDefault();
        setActiveLeftTab('hints');
      }
      // Toggle Console Bottom Tab: Ctrl + J or Alt + J
      else if (((e.ctrlKey || e.metaKey) || e.altKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        setActiveRightBottomTab((prev) => (prev === 'testresult' ? 'probabilities' : 'testresult'));
      }
      // Quick Pick Gates 1 to 9 (only if not holding modifier keys)
      else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key >= '1' && e.key <= '9') {
        const allowed = AVAILABLE_GATES.filter((g) => problem.allowedGates.includes(g.type));
        const index = parseInt(e.key) - 1;
        if (index < allowed.length) {
          setSelectedGateType(allowed[index].type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitShortcut, runCodeShortcut, isSettingsOpen, gates, isEvaluating, selectedSlot, problem]);

  const fontFamiliesMap: Record<string, string> = {
    default: 'inherit',
    fira: '"Fira Code", "Courier New", monospace',
    source: '"Source Code Pro", Consolas, monospace'
  };

  const leftColSpanClass = 
    layoutRatio === 'split-5-7' ? 'lg:col-span-5' :
    layoutRatio === 'split-6-6' ? 'lg:col-span-6' :
    layoutRatio === 'split-7-5' ? 'lg:col-span-7' :
    'hidden';

  const rightColSpanClass = 
    layoutRatio === 'split-5-7' ? 'lg:col-span-7' :
    layoutRatio === 'split-6-6' ? 'lg:col-span-6' :
    layoutRatio === 'split-7-5' ? 'lg:col-span-5' :
    'lg:col-span-12';

  return (
    <div 
      style={{
        fontSize: fontSizeSetting,
        fontFamily: fontFamiliesMap[fontFamilySetting] || 'inherit',
        fontVariantLigatures: fontLigatures ? 'normal' : 'none',
        tabSize: tabSizeSetting === '2 spaces' ? 2 : 4
      }}
      className="flex flex-col h-screen min-h-[580px] bg-[#F8FAFC] text-dark-900 overflow-hidden select-none"
    >
      {/* Top Header Bar (LeetCode Style Light Theme) */}
      <div className="h-12 bg-white border-b border-dark-200 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="flex items-center gap-1.5 text-xs font-semibold text-dark-700 hover:text-dark-900 transition-colors bg-dark-50 hover:bg-dark-100 px-2.5 py-1.5 rounded-lg border border-dark-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Problem List</span>
          </Link>
          <div className="h-4 w-px bg-dark-200" />
          <span className="text-xs font-bold text-dark-900 truncate max-w-[200px] sm:max-w-xs">
            {problem.id}. {problem.title}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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

        {/* Center/Right Actions: Reset / Submit / Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCircuit}
            title="Reset Circuit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-dark-50 text-dark-700 hover:text-dark-900 text-xs font-medium border border-dark-200 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {buttonPlacement === 'toolbar' && (
            <button
              onClick={() => handleSubmitSolution()}
              disabled={isEvaluating || gates.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isEvaluating ? 'Evaluating...' : 'Submit'}</span>
            </button>
          )}

          {/* LeetCode Style Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="IDE Settings"
            className="p-1.5 rounded-lg border border-dark-200 hover:border-dark-300 hover:bg-dark-50 text-dark-600 hover:text-dark-900 transition-colors shadow-2xs ml-1"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal (Clean White LeetCode Style Dialog with Fixed Size) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white text-dark-900 rounded-2xl shadow-2xl border border-dark-200 w-full max-w-2xl h-[500px] max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200 bg-white shrink-0">
              <h2 className="text-base font-bold text-dark-900 flex items-center gap-2">
                <span>Settings</span>
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-dark-500 hover:text-dark-900 p-1 rounded-lg hover:bg-dark-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Left Settings Sidebar */}
              <div className="w-48 bg-[#F8FAFC] border-r border-dark-200 p-2 space-y-1 shrink-0 overflow-y-auto">
                <button
                  onClick={() => setActiveSettingsTab('layout')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                    activeSettingsTab === 'layout'
                      ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                      : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                  <span>Dynamic Layout</span>
                </button>

                <button
                  onClick={() => setActiveSettingsTab('editor')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                    activeSettingsTab === 'editor'
                      ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                      : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Code Editor</span>
                </button>

                <button
                  onClick={() => setActiveSettingsTab('shortcuts')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                    activeSettingsTab === 'shortcuts'
                      ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                      : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Shortcuts</span>
                </button>
              </div>

              {/* Right Tab Content Panel */}
              <div className="flex-1 h-full overflow-y-auto p-6 bg-white text-xs">
                {/* 1. DYNAMIC LAYOUT */}
                {activeSettingsTab === 'layout' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-dark-900">Workspace Layout Split</span>
                      <button
                        onClick={() => {
                          setButtonPlacement('toolbar');
                          setLayoutRatio('split-5-7');
                        }}
                        className="px-3 py-1 rounded-lg bg-dark-50 hover:bg-dark-100 text-dark-700 text-xs font-semibold border border-dark-200 transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Layout Ratio Presets */}
                    <div className="space-y-3">
                      <span className="text-dark-700 font-medium block">Panel Grid Ratio</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                          onClick={() => setLayoutRatio('split-5-7')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                            layoutRatio === 'split-5-7'
                              ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                              : 'border-dark-200 bg-dark-50 hover:bg-white'
                          }`}
                        >
                          <div className="flex gap-1 h-6">
                            <div className="w-5/12 bg-dark-300 rounded" />
                            <div className="w-7/12 bg-primary-600 rounded" />
                          </div>
                          <span className="font-semibold text-[11px] text-dark-800">5 : 7 (Default)</span>
                        </button>

                        <button
                          onClick={() => setLayoutRatio('split-6-6')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                            layoutRatio === 'split-6-6'
                              ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                              : 'border-dark-200 bg-dark-50 hover:bg-white'
                          }`}
                        >
                          <div className="flex gap-1 h-6">
                            <div className="w-1/2 bg-dark-300 rounded" />
                            <div className="w-1/2 bg-primary-600 rounded" />
                          </div>
                          <span className="font-semibold text-[11px] text-dark-800">6 : 6 (Equal)</span>
                        </button>

                        <button
                          onClick={() => setLayoutRatio('split-7-5')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                            layoutRatio === 'split-7-5'
                              ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                              : 'border-dark-200 bg-dark-50 hover:bg-white'
                          }`}
                        >
                          <div className="flex gap-1 h-6">
                            <div className="w-7/12 bg-dark-300 rounded" />
                            <div className="w-5/12 bg-primary-600 rounded" />
                          </div>
                          <span className="font-semibold text-[11px] text-dark-800">7 : 5 (Desc Focused)</span>
                        </button>

                        <button
                          onClick={() => setLayoutRatio('full-editor')}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                            layoutRatio === 'full-editor'
                              ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                              : 'border-dark-200 bg-dark-50 hover:bg-white'
                          }`}
                        >
                          <div className="flex gap-1 h-6">
                            <div className="w-full bg-primary-600 rounded" />
                          </div>
                          <span className="font-semibold text-[11px] text-dark-800">Full Circuit View</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-dark-100">
                      <span className="text-dark-700 font-medium block">Show Run / Submit / Debug buttons in</span>
                      <div className="flex items-center gap-4">
                        {/* Option 1: Toolbar */}
                        <button
                          onClick={() => setButtonPlacement('toolbar')}
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                          <div
                            className={`w-28 h-18 rounded-xl p-1.5 flex flex-col justify-between border-2 transition-all shadow-2xs ${
                              buttonPlacement === 'toolbar'
                                ? 'border-primary-600 bg-primary-50/50'
                                : 'border-dark-200 bg-dark-50 group-hover:border-dark-300'
                            }`}
                          >
                            <div className="h-4 rounded bg-emerald-600 text-white w-14 mx-auto flex items-center justify-center text-[8px] font-bold shadow-2xs">
                              Run / Submit
                            </div>
                            <div className="grid grid-cols-2 gap-1 h-8">
                              <div className="bg-white border border-dark-200 rounded" />
                              <div className="bg-white border border-dark-200 rounded" />
                            </div>
                          </div>
                          <span className={`text-xs font-semibold ${buttonPlacement === 'toolbar' ? 'text-primary-700' : 'text-dark-500'}`}>
                            Toolbar (Top Bar)
                          </span>
                        </button>

                        {/* Option 2: Code Editor */}
                        <button
                          onClick={() => setButtonPlacement('editor')}
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                          <div
                            className={`w-28 h-18 rounded-xl p-1.5 flex flex-col justify-between border-2 transition-all shadow-2xs ${
                              buttonPlacement === 'editor'
                                ? 'border-primary-600 bg-primary-50/50'
                                : 'border-dark-200 bg-dark-50 group-hover:border-dark-300'
                            }`}
                          >
                            <div className="text-[8px] text-dark-400 font-mono text-left">&lt;/&gt; Circuit</div>
                            <div className="h-3 rounded bg-emerald-600 text-white w-12 ml-auto flex items-center justify-center text-[7px] font-bold">
                              Submit
                            </div>
                          </div>
                          <span className={`text-xs font-semibold ${buttonPlacement === 'editor' ? 'text-primary-700' : 'text-dark-500'}`}>
                            Circuit Palette
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CODE EDITOR */}
                {activeSettingsTab === 'editor' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2.5 border-b border-dark-100">
                      <div>
                        <span className="text-dark-800 font-medium block">Font Family</span>
                        <p className="text-[11px] text-dark-500">Choose typography across problem & circuit workspace</p>
                      </div>
                      <select
                        value={fontFamilySetting}
                        onChange={(e) => setFontFamilySetting(e.target.value as any)}
                        className="bg-dark-50 border border-dark-200 text-dark-900 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                      >
                        <option value="default">Default (Inter / Sans)</option>
                        <option value="fira">Fira Code (Monospace)</option>
                        <option value="source">Source Code Pro</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-2.5 border-b border-dark-100">
                      <div>
                        <span className="text-dark-800 font-medium block">Font Size</span>
                        <p className="text-[11px] text-dark-500">Scale entire IDE text and math typography</p>
                      </div>
                      <select
                        value={fontSizeSetting}
                        onChange={(e) => setFontSizeSetting(e.target.value)}
                        className="bg-dark-50 border border-dark-200 text-dark-900 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                      >
                        <option value="12px">12px (Compact)</option>
                        <option value="13px">13px (Default)</option>
                        <option value="14px">14px (Medium)</option>
                        <option value="16px">16px (Large)</option>
                      </select>
                    </div>

                    {/* <div className="flex items-center justify-between py-2.5 border-b border-dark-100">
                      <div>
                        <span className="text-dark-800 font-medium block">Font Ligatures</span>
                        <p className="text-[11px] text-dark-500">Enable programming glyph ligatures for symbols</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={fontLigatures}
                        onChange={(e) => setFontLigatures(e.target.checked)}
                        className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                      />
                    </div> */}

                    {/* <div className="flex items-center justify-between py-2.5 border-b border-dark-100"> */}
                      {/* <div>
                        <span className="text-dark-800 font-medium block">Key Binding Mode</span>
                        <p className="text-[11px] text-dark-500">Standard / Vim / Emacs navigation profiles</p>
                      </div> */}
                      {/* <select
                        value={keyBinding}
                        onChange={(e) => setKeyBinding(e.target.value)}
                        className="bg-dark-50 border border-dark-200 text-dark-900 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Vim">Vim</option>
                        <option value="Emacs">Emacs</option>
                      </select> */}
                    {/* </div> */}

                    <div className="flex items-center justify-between py-2.5">
                      <div>
                        <span className="text-dark-800 font-medium block">Tab Size</span>
                        <p className="text-[11px] text-dark-500">Indentation column spacing</p>
                      </div>
                      <select
                        value={tabSizeSetting}
                        onChange={(e) => setTabSizeSetting(e.target.value)}
                        className="bg-dark-50 border border-dark-200 text-dark-900 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                      >
                        <option value="2 spaces">2 spaces</option>
                        <option value="4 spaces">4 spaces</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. SHORTCUTS */}
                {activeSettingsTab === 'shortcuts' && (
                  <div className="space-y-6">
                    {/* Category 1: Execution & Judge */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-dark-500 uppercase tracking-wider">Execution & Judge</h4>
                      <div className="rounded-xl border border-dark-200 divide-y divide-dark-100 overflow-hidden bg-dark-50/40">
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Submit Solution to Judge</span>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={submitShortcut}
                              onChange={(e) => setSubmitShortcut(e.target.checked)}
                              className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                            />
                            <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                              <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Ctrl</span>
                              <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Enter</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Run Live Simulation & Preview</span>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={runCodeShortcut}
                              onChange={(e) => setRunCodeShortcut(e.target.checked)}
                              className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                            />
                            <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                              <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Ctrl</span>
                              <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">&apos;</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Clear / Reset Circuit</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Ctrl</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Alt</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">R</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category 2: Quantum Circuit Editing */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-dark-500 uppercase tracking-wider">Circuit Gate Editing</h4>
                      <div className="rounded-xl border border-dark-200 divide-y divide-dark-100 overflow-hidden bg-dark-50/40">
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Quick Select Gates (H, X, Y, Z, CX...)</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">1</span>
                            <span className="text-dark-400">to</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">9</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Delete Gate on Selected Slot</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Delete</span>
                            <span className="text-dark-400">/</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Backspace</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Clear Slot Selection</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Esc</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category 3: Navigation & Layout */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-dark-500 uppercase tracking-wider">Workspace Navigation</h4>
                      <div className="rounded-xl border border-dark-200 divide-y divide-dark-100 overflow-hidden bg-dark-50/40">
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Open Settings Modal</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Ctrl</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">,</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Switch Left Tabs (Desc / Subs / Rules)</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Alt</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">1</span>
                            <span className="text-dark-400">..</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">3</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Toggle Bottom Console Tab</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Ctrl</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">J</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Maximize / Restore Circuit Panel</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Alt</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">+</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Enter / Exit Full Screen Mode</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Alt</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">F</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
                          <span className="text-dark-800 font-medium">Close Modal / Dialog</span>
                          <div className="flex gap-1 font-mono text-[11px] text-dark-700">
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">Alt</span>
                            <span className="px-1.5 py-0.5 rounded bg-dark-100 border border-dark-200">W</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Body (Dynamic Layout & Ratios) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 bg-[#F1F5F9] overflow-hidden">
        {/* Left Column: Problem Description & Tabs */}
        <div className={`${leftColSpanClass} flex flex-col bg-white rounded-2xl border border-dark-200 shadow-xs overflow-hidden`}>
          {/* Left Tabs */}
          <div className="flex items-center bg-dark-50/80 border-b border-dark-200 px-2 h-10 shrink-0 gap-1">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeLeftTab === 'description'
                  ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                  : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-primary-600" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('submissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                  : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>Submissions ({submissions.length})</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('hints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeLeftTab === 'hints'
                  ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                  : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>Constraints & Rules</span>
            </button>
          </div>

          {/* Left Tab Content (Scrollable independently with dynamic font size) */}
          <div 
            style={{ fontSize: fontSizeSetting }}
            className={`flex-1 overflow-y-auto p-5 space-y-5 text-dark-700 leading-relaxed ${wordWrapSetting ? 'break-words whitespace-normal' : 'whitespace-nowrap overflow-x-auto'}`}
          >
            {activeLeftTab === 'description' && (
              <>
                <div>
                  <h1 
                    style={{ fontSize: `calc(${fontSizeSetting} * 1.35)` }}
                    className="font-bold text-dark-900 flex items-center gap-2"
                  >
                    <MathRenderer text={problem.title} />
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span 
                      style={{ fontSize: `calc(${fontSizeSetting} * 0.88)` }}
                      className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-mono border border-primary-100"
                    >
                      {problem.category}
                    </span>
                    <span 
                      style={{ fontSize: `calc(${fontSizeSetting} * 0.88)` }}
                      className="text-dark-500"
                    >
                      Qubits: <strong className="text-dark-900">{problem.numQubits}Q</strong>
                    </span>
                  </div>
                </div>

                <div 
                  style={{ fontSize: fontSizeSetting }}
                  className="space-y-3 text-dark-700 leading-relaxed"
                >
                  <MathRenderer text={problem.description} />
                </div>

                <div className="p-4 rounded-xl bg-dark-50 border border-dark-200 space-y-1.5">
                  <span 
                    style={{ fontSize: fontSizeSetting }}
                    className="font-bold text-dark-900 block flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Target Objective:
                  </span>
                  <div 
                    style={{ fontSize: fontSizeSetting }}
                    className="text-dark-700"
                  >
                    <MathRenderer text={problem.task} />
                  </div>
                </div>

                {/* Verification Criteria */}
                <div 
                  style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                  className="p-3.5 rounded-xl bg-primary-50/40 border border-primary-100 space-y-1"
                >
                  <span className="font-semibold text-primary-900 block">Judge Acceptance Criteria:</span>
                  <p className="text-dark-600">
                    {problem.checkerType === 'fidelity'
                      ? 'Statevector fidelity must reach ≥ 99.9% with the target unitary solution.'
                      : `Measurement probability for designated basis state must reach ≥ ${(problem.targetOutcome?.minProbability || 0.95) * 100}%.`}
                  </p>
                </div>
              </>
            )}

            {activeLeftTab === 'submissions' && (
              <div 
                style={{ fontSize: fontSizeSetting }}
                className="space-y-3"
              >
                <h3 
                  style={{ fontSize: `calc(${fontSizeSetting} * 1.15)` }}
                  className="font-bold text-dark-900"
                >
                  Submission History
                </h3>
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-dark-400">
                    No submissions yet. Build your circuit and press <strong className="text-dark-700">Submit</strong>.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-dark-50 border border-dark-200 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span
                            style={{ fontSize: `calc(${fontSizeSetting} * 0.82)` }}
                            className={`inline-block px-2 py-0.5 rounded font-bold ${
                              sub.status === 'ACCEPTED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : sub.status === 'WRONG_ANSWER'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {sub.status.replace('_', ' ')}
                          </span>
                          <p 
                            style={{ fontSize: `calc(${fontSizeSetting} * 0.9)` }}
                            className="text-dark-600 line-clamp-1"
                          >
                            {sub.message}
                          </p>
                        </div>
                        <div 
                          style={{ fontSize: `calc(${fontSizeSetting} * 0.85)` }}
                          className="text-right text-dark-500 shrink-0 font-mono"
                        >
                          <div>{sub.timestamp}</div>
                          <div>{sub.executionTimeMs} ms</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'hints' && (
              <div 
                style={{ fontSize: fontSizeSetting }}
                className="space-y-3"
              >
                <h3 
                  style={{ fontSize: `calc(${fontSizeSetting} * 1.15)` }}
                  className="font-bold text-dark-900"
                >
                  Constraints & Allowed Operations
                </h3>
                <div className="space-y-2 text-dark-700">
                  <div className="p-3.5 rounded-xl bg-dark-50 border border-dark-200">
                    <span className="font-semibold text-dark-900 block mb-1">Allowed Gate Set:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.allowedGates.map((g) => (
                        <span 
                          key={g} 
                          style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                          className="px-2 py-0.5 rounded bg-white font-mono text-primary-700 font-bold border border-dark-200 shadow-2xs"
                        >
                          {g.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {problem.maxGates && (
                    <div className="p-3.5 rounded-xl bg-dark-50 border border-dark-200">
                      <span className="font-semibold text-dark-900 block mb-1">Gate Budget:</span>
                      <p className="text-dark-600">Maximum allowed gates in circuit: <strong className="text-dark-900">{problem.maxGates}</strong></p>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-dark-50 border border-dark-200">
                    <span className="font-semibold text-dark-900 block mb-1">Circuit Grid:</span>
                    <p className="text-dark-600">Fixed 8 execution steps (S0 - S7) across {problem.numQubits} qubit register wires.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Split Top (Circuit Wire Editor) & Split Bottom (Test Result / Console) */}
        <div className={`${rightColSpanClass} flex flex-col gap-2 overflow-hidden`}>
          {/* Top-Right: Gate Palette & Circuit Grid */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-dark-200 shadow-xs overflow-hidden min-h-[260px]">
            {/* Top Gate Bar */}
            <div className="bg-dark-50/80 border-b border-dark-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <span 
                  style={{ fontSize: `calc(${fontSizeSetting} * 0.85)` }}
                  className="font-bold text-dark-600 uppercase tracking-wide shrink-0 mr-1"
                >
                  Gates:
                </span>
                {AVAILABLE_GATES.filter((g) => problem.allowedGates.includes(g.type)).map((gate) => {
                  const isSelected = selectedGateType === gate.type;
                  return (
                    <button
                      key={gate.type}
                      onClick={() => setSelectedGateType(gate.type)}
                      style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold transition-all select-none shrink-0 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20 shadow-xs'
                          : 'border-dark-200 bg-white text-dark-700 hover:bg-dark-100 hover:text-dark-900'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center font-mono text-[10px] font-bold ${gate.color}`}>
                        {gate.name}
                      </span>
                      <span>{gate.type.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>

              {/* 2-Qubit Selector if multi */}
              {['cx', 'cz', 'swap'].includes(selectedGateType) && (
                <div 
                  style={{ fontSize: `calc(${fontSizeSetting} * 0.85)` }}
                  className="flex items-center gap-2 text-dark-700 bg-white px-2 py-1 rounded-lg border border-dark-200 shadow-2xs"
                >
                  <label className="flex items-center gap-1">
                    C:
                    <select
                      value={controlQubit}
                      onChange={(e) => setControlQubit(Number(e.target.value))}
                      className="bg-dark-50 border border-dark-200 text-dark-900 rounded px-1.5 py-0.5 text-[11px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    T:
                    <select
                      value={targetQubit}
                      onChange={(e) => setTargetQubit(Number(e.target.value))}
                      className="bg-dark-50 border border-dark-200 text-dark-900 rounded px-1.5 py-0.5 text-[11px]"
                    >
                      {Array.from({ length: numQubits }, (_, i) => (
                        <option key={i} value={i}>q[{i}]</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {/* In-Editor Placement Actions when enabled */}
              {buttonPlacement === 'editor' && (
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button
                    onClick={handleClearCircuit}
                    title="Reset Circuit"
                    style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-dark-50 text-dark-700 font-medium border border-dark-200 transition-colors shadow-2xs"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleSubmitSolution()}
                    disabled={isEvaluating || gates.length === 0}
                    style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                    className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold shadow-xs transition-all"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isEvaluating ? 'Evaluating...' : 'Submit'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Circuit Grid Canvas */}
            <div className="flex-1 overflow-auto p-4 flex flex-col justify-center bg-[#FAFAFA]">
              <div className="space-y-4 min-w-[500px]">
                {Array.from({ length: numQubits }, (_, qIdx) => (
                  <div key={qIdx} className="flex items-center gap-3">
                    <div 
                      style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                      className="w-16 shrink-0 flex items-center gap-1.5 font-mono text-dark-700"
                    >
                      <span className="font-bold text-dark-900">q[{qIdx}]</span>
                      <span className="px-1.5 py-0.5 rounded bg-dark-100 text-[10px] text-dark-600 border border-dark-200">|0⟩</span>
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
                            className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                              isSelected
                                ? 'ring-2 ring-primary-600 border-primary-600 bg-primary-50'
                                : placed
                                ? 'border-dark-300 bg-white shadow-xs'
                                : 'border-dashed border-dark-200 hover:border-primary-400 bg-white/90 hover:bg-primary-50/30'
                            }`}
                            title={placed ? `Right-click to remove ${placed.type.toUpperCase()}` : `Click to place ${selectedGateType.toUpperCase()}`}
                          >
                            {placed ? (
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] shadow-2xs ${
                                  AVAILABLE_GATES.find((g) => g.type === placed.type)?.color || 'bg-primary-600 text-white'
                                }`}
                              >
                                {placed.type.toUpperCase()}
                              </div>
                            ) : (
                              <span className="text-[9px] font-mono text-dark-400 opacity-60">
                                {relativeLineNumbers ? `[${sIdx}]` : `S${sIdx}`}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Footer Stats */}
            <div 
              style={{ fontSize: `calc(${fontSizeSetting} * 0.85)` }}
              className="bg-white border-t border-dark-200 px-3 py-1.5 flex items-center justify-between text-dark-500 shrink-0"
            >
              <span>Click slot to place selected gate. Right-click to remove.</span>
              <span className="font-mono font-semibold text-dark-700">{gates.length} gates in circuit</span>
            </div>
          </div>

          {/* Bottom-Right: Testcase / Test Result Console (LeetCode Style Light Theme) */}
          <div className="h-56 flex flex-col bg-white rounded-2xl border border-dark-200 shadow-xs overflow-hidden shrink-0">
            {/* Bottom Tabs */}
            <div className="flex items-center bg-dark-50/80 border-b border-dark-200 px-2 h-9 shrink-0 gap-1">
              <button
                onClick={() => setActiveRightBottomTab('testresult')}
                style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                className={`flex items-center gap-1.5 px-3 py-1 font-semibold rounded-lg transition-colors ${
                  activeRightBottomTab === 'testresult'
                    ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                    : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Judge Result</span>
              </button>

              <button
                onClick={() => setActiveRightBottomTab('probabilities')}
                style={{ fontSize: `calc(${fontSizeSetting} * 0.92)` }}
                className={`flex items-center gap-1.5 px-3 py-1 font-semibold rounded-lg transition-colors ${
                  activeRightBottomTab === 'probabilities'
                    ? 'bg-white text-primary-700 shadow-2xs border border-dark-200/60'
                    : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live Statevector & Output</span>
              </button>
            </div>

            {/* Bottom Console Panel Content */}
            <div 
              style={{ fontSize: fontSizeSetting }}
              className="flex-1 overflow-y-auto p-4 bg-white font-mono"
            >
              {activeRightBottomTab === 'testresult' && (
                <div>
                  {verdict ? (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {verdict.status === 'ACCEPTED' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : verdict.status === 'WRONG_ANSWER' ? (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          )}
                          <span
                            className={`text-base font-bold ${
                              verdict.status === 'ACCEPTED'
                                ? 'text-emerald-700'
                                : verdict.status === 'WRONG_ANSWER'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {verdict.status === 'ACCEPTED'
                              ? 'Accepted'
                              : verdict.status === 'WRONG_ANSWER'
                              ? 'Wrong Answer'
                              : 'Runtime / Compilation Error'}
                          </span>
                        </div>
                        <span className="text-dark-500 text-[11px] font-sans">Runtime: <strong>{verdict.executionTimeMs} ms</strong></span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 space-y-1">
                        <div className="text-dark-500 text-[11px] font-sans">Judge Output:</div>
                        <div className="text-dark-900 font-sans text-xs font-medium">{verdict.message}</div>
                        {verdict.fidelity !== undefined && (
                          <div className="text-emerald-700 font-bold text-[11px] pt-1">
                            Fidelity Score: {(verdict.fidelity * 100).toFixed(2)}%
                          </div>
                        )}
                        {verdict.measuredProbability !== undefined && (
                          <div className="text-emerald-700 font-bold text-[11px] pt-1">
                            Target State Probability: {(verdict.measuredProbability * 100).toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-dark-400 py-6 gap-2">
                      <Terminal className="w-6 h-6 opacity-40 text-dark-500" />
                      <span className="font-sans text-xs">Click &quot;Submit&quot; in the top bar to run automated test cases against your circuit.</span>
                    </div>
                  )}
                </div>
              )}

              {activeRightBottomTab === 'probabilities' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-dark-500 text-[11px] font-sans">
                    <span>State Measurement Distribution:</span>
                    <span className="font-semibold text-dark-700">{Object.keys(liveSim.probabilities).length} non-zero basis states</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(liveSim.probabilities).map(([state, prob]) => (
                      <div key={state} className="p-2.5 rounded-xl bg-dark-50 border border-dark-200 flex items-center justify-between">
                        <span className="text-primary-700 font-bold">|{state}⟩</span>
                        <span className="text-dark-900 font-semibold">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
