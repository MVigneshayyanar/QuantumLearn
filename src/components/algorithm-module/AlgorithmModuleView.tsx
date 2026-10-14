'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { useStudentContext } from '@/lib/student-context';
import { useProgressStore } from '@/lib/state-store';
import { apiReportProgress } from '@/lib/api-helpers';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { AdaptiveQuizEngine } from '@/components/quiz/AdaptiveQuizEngine';
import { MathRenderer, MathBlock } from '@/components/math/MathRenderer';
import { SimulationResult, StepSnapshot, PlacedGate } from '@/lib/types';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';
import {
  Lightbulb,
  FileCode,
  Cpu,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Wand2,
  Hammer,
  AlertTriangle,
  Check,
  Target,
  Trophy,
  Award,
  Lock,
  ExternalLink,
  Code2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BuildItTab } from './BuildItTab';
import { SkillBaseStage } from './SkillBaseStage';
import { QuantumCertificateModal } from '@/components/certificate/QuantumCertificateModal';
import { QuantumCircuitCodePanel } from '@/components/circuit/QuantumCircuitCodePanel';
import confetti from 'canvas-confetti';
import {
  QuantumGateSymbol,
  ControlDotIcon,
  TargetPlusIcon,
  SwapXIcon
} from '@/components/circuit/QuantumGateSymbol';

const GATE_COLORS: Record<string, string> = {
  h: 'bg-indigo-600 text-white',
  x: 'bg-emerald-600 text-white',
  y: 'bg-teal-600 text-white',
  z: 'bg-violet-600 text-white',
  s: 'bg-purple-600 text-white',
  t: 'bg-pink-600 text-white',
  cx: 'bg-indigo-700 text-white',
  cz: 'bg-blue-700 text-white',
  swap: 'bg-cyan-700 text-white',
  measure: 'bg-dark-800 text-white'
};

function getDefaultGatesForAlgorithm(algoId: string): PlacedGate[] {
  const norm = (algoId || '').toLowerCase().replace(/[-_]/g, '');
  if (norm.includes('deutsch')) {
    return [
      { id: 'dj1', type: 'x', qubits: [1], step: 0 },
      { id: 'dj2', type: 'h', qubits: [0], step: 1 },
      { id: 'dj3', type: 'h', qubits: [1], step: 1 },
      { id: 'dj4', type: 'cx', qubits: [0, 1], step: 2 },
      { id: 'dj5', type: 'h', qubits: [0], step: 3 },
      { id: 'dj6', type: 'measure', qubits: [0], step: 4 }
    ];
  }
  if (norm.includes('grover')) {
    return [
      { id: 'gr1', type: 'h', qubits: [0], step: 0 },
      { id: 'gr2', type: 'h', qubits: [1], step: 0 },
      { id: 'gr3', type: 'cz', qubits: [0, 1], step: 1 },
      { id: 'gr4', type: 'h', qubits: [0], step: 2 },
      { id: 'gr5', type: 'h', qubits: [1], step: 2 },
      { id: 'gr6', type: 'x', qubits: [0], step: 3 },
      { id: 'gr7', type: 'x', qubits: [1], step: 3 },
      { id: 'gr8', type: 'cz', qubits: [0, 1], step: 4 },
      { id: 'gr9', type: 'x', qubits: [0], step: 5 },
      { id: 'gr10', type: 'x', qubits: [1], step: 5 },
      { id: 'gr11', type: 'h', qubits: [0], step: 6 },
      { id: 'gr12', type: 'h', qubits: [1], step: 6 },
      { id: 'gr13', type: 'measure', qubits: [0], step: 7 },
      { id: 'gr14', type: 'measure', qubits: [1], step: 7 }
    ];
  }
  if (norm.includes('teleport')) {
    return [
      { id: 'tp1', type: 'h', qubits: [0], step: 0 },
      { id: 'tp2', type: 'h', qubits: [1], step: 1 },
      { id: 'tp3', type: 'cx', qubits: [1, 2], step: 2 },
      { id: 'tp4', type: 'cx', qubits: [0, 1], step: 3 },
      { id: 'tp5', type: 'h', qubits: [0], step: 4 },
      { id: 'tp6', type: 'measure', qubits: [0], step: 5 },
      { id: 'tp7', type: 'measure', qubits: [1], step: 5 },
      { id: 'tp8', type: 'cx', qubits: [1, 2], step: 6 },
      { id: 'tp9', type: 'cz', qubits: [0, 2], step: 7 }
    ];
  }
  if (norm.includes('superdense')) {
    return [
      { id: 'sd1', type: 'h', qubits: [0], step: 0 },
      { id: 'sd2', type: 'cx', qubits: [0, 1], step: 1 },
      { id: 'sd3', type: 'z', qubits: [0], step: 2 },
      { id: 'sd4', type: 'x', qubits: [0], step: 3 },
      { id: 'sd5', type: 'cx', qubits: [0, 1], step: 4 },
      { id: 'sd6', type: 'h', qubits: [0], step: 5 },
      { id: 'sd7', type: 'measure', qubits: [0], step: 6 },
      { id: 'sd8', type: 'measure', qubits: [1], step: 6 }
    ];
  }
  return [];
}

export interface MathWalkthroughStep {
  stepName: string;
  equation: string;
  descriptionSimple: string;
  descriptionTechnical: string;
  gateRationale?: string;
  commonMistakes?: string;
  stepGates?: { type: string; qubits: number[]; step: number }[];
}

interface AlgorithmModuleViewProps {
  moduleSlug: string;
  title: string;
  subtitle: string;
  category: string;
  qubitCount: number;
  speedup: string;
  intuitionSimple: string;
  intuitionTechnical: string;
  mathWalkthrough: MathWalkthroughStep[];
  algorithmBackendId: string;
  defaultParams?: Record<string, any>;
  paramControls?: React.ReactNode;
}

export function AlgorithmModuleView({
  moduleSlug,
  title,
  subtitle,
  category,
  qubitCount,
  speedup,
  intuitionSimple,
  intuitionTechnical,
  mathWalkthrough,
  algorithmBackendId,
  defaultParams = {},
  paramControls
}: AlgorithmModuleViewProps) {
  const { explanationMode, language, announce } = useAccessibility();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'intuition' | 'math' | 'circuit' | 'build_it' | 'quiz' | 'skill_base'>('intuition');
  const [currentMathStep, setCurrentMathStep] = useState(0);
  const [showAllMathSteps, setShowAllMathSteps] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'vectors' | 'code'>('vectors');
  const moduleTopRef = useRef<HTMLDivElement>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const STAGE_ORDER = ['intuition', 'math', 'circuit', 'build_it', 'quiz', 'skill_base'] as const;

  // Track max unlocked stage index (0 to 5) for sequential 1-by-1 progression
  const [maxUnlockedIdx, setMaxUnlockedIdx] = useState<number>(0);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsClientMounted(true);
    try {
      const stored = localStorage.getItem(`ql_stage_progress_${moduleSlug}`);
      if (stored !== null) {
        setMaxUnlockedIdx(Math.min(5, Math.max(0, parseInt(stored, 10))));
      }
    } catch {}
  }, [moduleSlug]);

  const unlockStage = (stageIdx: number) => {
    setMaxUnlockedIdx((prev) => {
      const next = Math.max(prev, stageIdx);
      try {
        localStorage.setItem(`ql_stage_progress_${moduleSlug}`, next.toString());
      } catch {}
      return next;
    });
  };

  // Scroll smoothly from bottom to top whenever changing to the next stage/module
  useEffect(() => {
    if (isClientMounted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, isClientMounted]);

  const { completedModules, markModuleComplete } = useProgressStore();
  const isModuleFullyComplete = Boolean(completedModules[moduleSlug]);

  const handleClaimCertificate = async () => {
    markModuleComplete(moduleSlug, 100);
    unlockStage(5);
    if (userId) {
      await apiReportProgress(userId, moduleSlug, 'completed', { score: 100, stageReached: 6 });
    }
    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899']
      });
    } catch {}
  };

  useEffect(() => {
    if (isModuleFullyComplete) {
      unlockStage(5);
    }
  }, [isModuleFullyComplete]);

  const scrollPageToTop = () => {
    if (typeof window === 'undefined') return;

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo(0, 0);
    };

    resetScroll();
    window.requestAnimationFrame(resetScroll);
    window.setTimeout(resetScroll, 50);
  };

  // Sync tab with URL search params (?stage=circuit or ?tab=circuit)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const stageParam = sp.get('stage') || sp.get('tab');
      if (stageParam) {
        const targetIdx = STAGE_ORDER.indexOf(stageParam as any);
        if (targetIdx !== -1) {
          unlockStage(targetIdx);
          setActiveTab(stageParam as any);
        }
      }
    }
  }, []);

  const handleTabChange = (tabId: typeof activeTab, resetMathView = true) => {
    setActiveTab(tabId);
    if (tabId === 'math' && resetMathView) {
      setCurrentMathStep(0);
      setShowAllMathSteps(false);
    }
    announce(`Switched to stage: ${tabId}`);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState(null, '', url.toString());
    }
    scrollPageToTop();
  };

  // Smooth scroll to top when switching stages (except circuit tab so user stays in cockpit)
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab !== 'circuit') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab === 'math') {
      const scrollToTop = () => {
        moduleTopRef.current?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
        scrollPageToTop();
      };

      scrollToTop();
      const frame = window.requestAnimationFrame(scrollToTop);
      return () => window.cancelAnimationFrame(frame);
    }
  }, [currentMathStep, activeTab]);

  const [circuitGates, setCircuitGates] = useState<PlacedGate[]>(() => getDefaultGatesForAlgorithm(algorithmBackendId));
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>(defaultParams);

  // Sync params when defaultParams changes
  useEffect(() => {
    setParams(defaultParams);
  }, [JSON.stringify(defaultParams)]);

  // Fetch algorithm simulation
  const fetchSimulation = async (currParams = params) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/simulate/algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: algorithmBackendId,
          params: currParams,
          shots: 1024
        })
      });

      if (res.ok) {
        const data: any = await res.json();
        setSimResult(data);
        if (data.gates && Array.isArray(data.gates) && data.gates.length > 0) {
          setCircuitGates(data.gates);
        } else {
          setCircuitGates(getDefaultGatesForAlgorithm(algorithmBackendId));
        }
        setCurrentStepIdx(0);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCircuitGates(getDefaultGatesForAlgorithm(algorithmBackendId));
    fetchSimulation(params);
  }, [algorithmBackendId, JSON.stringify(params)]);

  // Report module "in_progress" to DB on first access
  const { userId, studentName } = useStudentContext();
  const [showCertificate, setShowCertificate] = useState(false);
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (userId && !hasReportedRef.current) {
      hasReportedRef.current = true;
      apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 1 });
    }
  }, [userId, moduleSlug]);

  // One snapshot per circuit column (S1..Sn), plus initial state at index 0.
  // Computed from the gates drawn on the board so the scrubber always matches the board.
  const snapshots: StepSnapshot[] = React.useMemo(() => {
    if (circuitGates.length === 0) return simResult?.step_by_step || [];
    const sim = simulateLocalCircuit(qubitCount, circuitGates, 1024);
    const perGate = sim.step_by_step || [];
    const sorted = [...circuitGates].sort((a, b) => a.step - b.step);
    const maxStep = Math.max(...sorted.map((g) => g.step));
    const result: StepSnapshot[] = [perGate[0]];
    for (let s = 0; s <= maxStep; s++) {
      const colGates = sorted.filter((g) => g.step === s);
      const idx = sorted.filter((g) => g.step <= s).length;
      const snap = perGate[idx];
      if (!snap) continue;
      const desc = colGates.length
        ? colGates.map((g) => `${g.type.toUpperCase()} on q${g.qubits.join(',q')}`).join(', ')
        : 'No operation';
      result.push({
        ...snap,
        step: s + 1,
        label: `Step ${s + 1}`,
        description_simple: desc,
        description_technical: desc
      });
    }
    return result;
  }, [circuitGates, qubitCount, simResult]);
  const currentSnapshot = snapshots[currentStepIdx] || null;

  const currentBlochs = currentSnapshot ? currentSnapshot.bloch_vectors : (simResult?.bloch_vectors || []);
  const currentProbs = currentSnapshot ? currentSnapshot.probabilities : (simResult?.probabilities || {});
  const currentAmps = currentSnapshot ? currentSnapshot.statevector : (simResult?.statevector || []);

  const histogramData = Object.entries(currentProbs).map(([state, prob]) => ({
    state: `|${state}⟩`,
    prob: Number((prob * 100).toFixed(1)),
    value: Math.round(prob * 1024)
  }));

  const totalStepsCount = Math.max(
    1,
    ...circuitGates.map((g) => g.step + 1)
  );

  const tabs = [
    { id: 'intuition', label: '1. Intuition', icon: Lightbulb },
    { id: 'math', label: '2. Math', icon: FileCode },
    { id: 'circuit', label: '3. Circuit', icon: Cpu },
    { id: 'build_it', label: '4. Build It', icon: Wand2 },
    { id: 'quiz', label: '5. Knowledge Check', icon: GraduationCap },
    { id: 'skill_base', label: '6. Assessment', icon: Target }
  ];

  const isCompactCockpitTab = ['circuit', 'build_it', 'quiz', 'skill_base'].includes(activeTab);

  return (
    <div id="algorithm-module-root" ref={moduleTopRef} className={`w-full mx-auto lg:min-h-[calc(100vh-80px)] ${isCompactCockpitTab ? 'px-3 sm:px-6 lg:pl-8 lg:pr-8 py-1.5' : 'px-3 sm:px-6 lg:pl-8 lg:pr-8 py-3'}`}>
      <div className="lg:flex lg:items-stretch lg:gap-4 lg:h-[87.5vh]">
      {/* Module Header: Compact Cockpit Header on interactive tabs, Full Header on intuition/math */}
      {isCompactCockpitTab ? (
        <aside className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs relative space-y-4 flex flex-col lg:w-[17.5%] lg:h-full lg:shrink-0 lg:sticky lg:top-4">
          <div className="flex flex-col gap-3">
            {/* Left: Title & Badges */}
            <div className="space-y-2">
              <h1 className="text-base font-bold text-dark-900 tracking-tight leading-tight">{title}</h1>
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                {category}
              </span>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-dark-100 text-dark-800">
                {qubitCount} Qubits
              </span>
              <span className="w-full px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 inline-flex items-center gap-1 whitespace-normal leading-snug">
                <MathRenderer text={speedup} />
              </span>
              </div>
            </div>

          </div>

          {/* Compact Tab Navigation */}
          <div className="flex flex-wrap lg:flex-col gap-1 border-t border-dark-100 pt-1.5" role="tablist">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isLocked = isClientMounted
                ? idx > maxUnlockedIdx && !isModuleFullyComplete
                : idx > 0 && !isModuleFullyComplete;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    handleTabChange(tab.id as any);
                  }}
                  title={isLocked ? `Locked: Complete Stage ${idx} first` : tab.label}
                  className={`flex items-center gap-2 px-3 py-2 lg:w-full lg:justify-start rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-xs'
                      : isLocked
                      ? 'text-dark-400 bg-dark-50/60 cursor-not-allowed opacity-60'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                  }`}
                >
                  {isLocked ? <Lock className="w-3 h-3 text-dark-400" /> : <Icon className="w-3 h-3" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            className="w-full self-start mt-auto flex items-center gap-2.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left text-[11px] font-bold text-amber-900 transition-colors cursor-pointer lg:absolute lg:bottom-4 lg:left-4 lg:right-4 lg:mt-0 lg:w-auto"
            title="Preview Certificate of Mastery"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span className="min-w-0 truncate">{isModuleFullyComplete ? 'Official Certificate' : 'Certificate of Mastery'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-amber-700" />
          </button>
        </aside>
      ) : (
        <aside className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs relative overflow-hidden space-y-4 flex flex-col lg:w-[17.5%] lg:h-full lg:shrink-0 lg:sticky lg:top-4">
          <div className="flex flex-col gap-3">
            {/* Left Column: Badges, Title & Subtitle */}
            <div className="space-y-2 max-w-none">
              <div>
                <h1 className="text-lg font-bold text-dark-900 tracking-tight leading-tight">{title}</h1>
                <p className="text-xs text-dark-600 leading-relaxed">{subtitle}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                  {category}
                </span>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-dark-100 text-dark-800">
                  {qubitCount} Qubits
                </span>
                <span className="w-full px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 whitespace-normal leading-snug">
                  <MathRenderer text={speedup} />
                </span>
              </div>
            </div>

          </div>

          {/* Tab Navigation with Sequential 1-by-1 Lock */}
          <div className="flex flex-wrap lg:flex-col gap-1.5 border-t border-dark-100 pt-3" role="tablist">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isLocked = isClientMounted
                ? idx > maxUnlockedIdx && !isModuleFullyComplete
                : idx > 0 && !isModuleFullyComplete;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    handleTabChange(tab.id as any);
                  }}
                  title={isLocked ? `Locked: Complete Stage ${idx} first` : tab.label}
                  className={`flex items-center gap-2 px-3 py-2 lg:w-full lg:justify-start rounded-lg font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-xs'
                      : isLocked
                      ? 'text-dark-400 bg-dark-50/60 cursor-not-allowed opacity-60'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50 cursor-pointer'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-dark-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            className="group/cert cursor-pointer w-full self-start mt-auto flex items-start gap-2 px-2.5 py-2.5 rounded-xl border border-amber-200/90 dark:border-amber-700/60 bg-gradient-to-r from-amber-50/80 via-white to-orange-50/40 dark:from-dark-900 dark:via-white dark:to-orange-50/40 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition-all text-left lg:absolute lg:bottom-4 lg:left-4 lg:right-4 lg:mt-0 lg:w-auto"
            title={isModuleFullyComplete ? 'View Official Certificate' : 'Preview Quantum Credential'}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                isModuleFullyComplete
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
              }`}
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs font-bold text-dark-900 dark:text-dark-100 group-hover/cert:text-amber-700 dark:group-hover/cert:text-amber-400 transition-colors break-words">
                  {isModuleFullyComplete ? 'Official Certificate' : 'Certificate of Mastery'}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  isModuleFullyComplete
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                }`}>
                  {isModuleFullyComplete ? 'Claimed' : 'Stage 6 Req.'}
                </span>
              </div>
              <div className="text-[10px] text-dark-500 dark:text-dark-400 flex items-center gap-1 mt-1">
                <span suppressHydrationWarning>
                  {isModuleFullyComplete
                    ? 'View & download verified credential'
                    : `${(isClientMounted && studentName) ? studentName : 'Alex Mercer'} · Click to preview`}
                </span>
                <ExternalLink className="w-2.5 h-2.5 text-dark-400 dark:text-dark-500 group-hover/cert:text-amber-600 dark:group-hover/cert:text-amber-400" />
              </div>
            </div>
          </button>
        </aside>
      )}

      {/* Active Stage Content with bottom-to-top slideUp animation */}
      <main className="min-w-0 flex-1 flex min-h-0 flex-col mt-3.5 lg:mt-0 lg:h-full">
      <div key={activeTab} className="flex min-h-0 flex-1 flex-col animate-slideUp">
        {/* Stage 1: Intuition */}
        {activeTab === 'intuition' && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 flex flex-col flex-1 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-dark-900">Plain-Language Intuition</h2>
            </div>
            <span className="text-[11px] text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full font-medium">
              Mode: {explanationMode === 'simple' ? 'Simple / School' : 'Technical / Researcher'}
            </span>
          </div>

          <div className="intuition-text-block text-sm text-dark-800 space-y-4 whitespace-pre-wrap">
            <MathRenderer text={explanationMode === 'simple' ? intuitionSimple : intuitionTechnical} />
          </div>

          <div className="flex justify-end mt-auto">
            <button
              onClick={() => {
                if (userId) {
                  apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 2 });
                }
                unlockStage(1);
                setActiveTab('math');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Mathematical Walkthrough</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Mathematical Walkthrough */}
      {activeTab === 'math' && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 flex flex-col flex-1 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary-600" />
              <h2 className="text-base font-bold text-dark-900">Step-by-Step Mathematical Walkthrough</h2>
            </div>
          </div>

          <div className="space-y-4 overflow-visible">
            {(showAllMathSteps ? mathWalkthrough : mathWalkthrough.slice(currentMathStep, currentMathStep + 1)).map((step, idx) => (
              <div key={showAllMathSteps ? idx : currentMathStep} className="math-step-card space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-dark-200 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="math-step-badge">{showAllMathSteps ? idx + 1 : currentMathStep + 1}</div>
                  <span className="font-bold text-sm sm:text-base text-dark-900">{step.stepName}</span>
                </div>

                <MathBlock equation={step.equation} />

                <p className="text-xs sm:text-sm text-dark-700 leading-relaxed">
                  <MathRenderer text={explanationMode === 'simple' ? step.descriptionSimple : step.descriptionTechnical} />
                </p>

                {/* Construction & Gate Rationale Layer */}
                {step.gateRationale && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs">
                    <Hammer className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-indigo-950 block">Circuit Construction &amp; Gate Choice Rationale:</span>
                      <p className="text-indigo-900 leading-relaxed">{step.gateRationale}</p>
                    </div>
                  </div>
                )}

                {/* Live Mini-Preview of Circuit State at this Step */}
                {step.stepGates && step.stepGates.length > 0 && (
                  <div className="p-3 rounded-xl bg-dark-900 text-white space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-dark-400 font-sans">
                      <span>Circuit State at Step {showAllMathSteps ? idx + 1 : currentMathStep + 1}:</span>
                      <span>{step.stepGates.length} operation(s) applied</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                      {step.stepGates.map((g, gIdx) => (
                        <div
                          key={gIdx}
                          className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700 text-primary-300 flex items-center gap-2 shrink-0"
                        >
                          <QuantumGateSymbol type={(g.type.toLowerCase() as any)} size="sm" />
                          <span className="text-dark-300 text-xs font-mono">Q{g.qubits.join(', Q')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Construction Mistakes */}
                {step.commonMistakes && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-950 block">Common Pitfall &amp; Construction Mistake:</span>
                      <p className="text-amber-900 leading-relaxed">{step.commonMistakes}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentMathStep > 0) {
                    setCurrentMathStep((step) => step - 1);
                    scrollPageToTop();
                  } else {
                    setActiveTab('intuition');
                    scrollPageToTop();
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{currentMathStep > 0 ? 'Previous Step' : 'Back: Intuition'}</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const switchingToOneStep = showAllMathSteps;
                  setShowAllMathSteps((showAll) => !showAll);
                  if (switchingToOneStep) {
                    scrollPageToTop();
                    window.requestAnimationFrame(scrollPageToTop);
                  }
                }}
                className="px-3 py-2 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 font-semibold text-xs transition-colors"
              >
                {showAllMathSteps ? 'One step at a time' : 'Show all steps'}
              </button>
              <button
                onClick={() => {
                if (showAllMathSteps) {
                  if (userId) {
                    apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 3 });
                  }
                  unlockStage(2);
                  setActiveTab('circuit');
                  return;
                }
                if (currentMathStep < mathWalkthrough.length - 1) {
                  setCurrentMathStep((step) => step + 1);
                  scrollPageToTop();
                  return;
                }
                if (userId) {
                  apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 3 });
                }
                unlockStage(2);
                setActiveTab('circuit');
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {!showAllMathSteps && (
                    <span className="font-mono bg-primary-700/60 px-1.5 py-0.5 rounded text-[10px]">
                      Step {currentMathStep + 1}/{mathWalkthrough.length}
                    </span>
                  )}
                  <span>
                    {showAllMathSteps
                      ? 'Next: Interactive Circuit & Simulation'
                      : currentMathStep < mathWalkthrough.length - 1
                      ? `Go to Step ${currentMathStep + 2}`
                      : 'Next: Interactive Circuit & Simulation'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      )}      {/* Stage 3: Interactive Circuit Simulation (High-Density Cockpit) */}
      {activeTab === 'circuit' && (
        <div className="flex min-h-0 flex-1 flex-col space-y-2 animate-fadeIn">
          {/* Unified Controls Strip: Oracle Selector + Scrubber & Current Step Info */}
          <div className="bg-white rounded-xl border border-dark-200 px-3.5 py-2 shadow-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Algorithm Parameter Controls (Oracle buttons) */}
              {paramControls && (
                <div className="flex items-center gap-2 flex-wrap">
                  {paramControls}
                </div>
              )}

              {/* Step-by-Step Playback Scrubber */}
              {snapshots.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentStepIdx <= 0}
                      onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
                      className="p-1 rounded-md border border-dark-200 hover:bg-dark-50 disabled:opacity-30 cursor-pointer"
                      title="Previous step"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={snapshots.length - 1}
                      value={currentStepIdx}
                      onChange={(e) => setCurrentStepIdx(Number(e.target.value))}
                      className="w-24 sm:w-28 accent-primary-600 cursor-pointer h-1.5"
                    />
                    <button
                      disabled={currentStepIdx >= snapshots.length - 1}
                      onClick={() => setCurrentStepIdx((i) => Math.min(snapshots.length - 1, i + 1))}
                      className="p-1 rounded-md border border-dark-200 hover:bg-dark-50 disabled:opacity-30 cursor-pointer"
                      title="Next step"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Step Description Pill */}
            {currentSnapshot && (
              <div className="px-2.5 py-1 rounded-lg bg-primary-50/70 border border-primary-200 flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-md bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {currentSnapshot.step}
                </span>
                <span className="font-bold text-primary-950 text-[11px] shrink-0">{currentSnapshot.label}:</span>
                <span className="text-dark-700 text-[11px] truncate leading-tight">
                  <MathRenderer text={
                    explanationMode === 'simple'
                      ? (currentSnapshot.description_simple || currentSnapshot.label)
                      : (currentSnapshot.description_technical || currentSnapshot.label)
                  } />
                </span>
              </div>
            )}
          </div>

          {/* Main Visual Cockpit: Side-by-Side Unified Grid */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)] lg:items-stretch">
            {/* Left Column: Circuit Board + (Probabilities & Statevector split) */}
            <div className="lg:col-span-7 lg:row-span-2 grid min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
              {/* Quantum Circuit Board Card */}
              <div className="bg-white rounded-xl border border-dark-200 p-3 sm:p-4 shadow-xs space-y-2 min-h-[220px]">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-primary-600" />
                    <h3 className="font-bold text-sm text-dark-900">Quantum Circuit Board</h3>
                  </div>
                </div>

                {/* Visual Circuit Canvas */}
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="w-full overflow-x-auto pb-0.5">
                      <div className={`w-full min-w-[340px] space-y-2 ${qubitCount <= 1 ? 'py-4' : qubitCount === 2 ? 'py-2.5' : 'py-1.5'}`}>
                        {/* Step Columns Timeline Header */}
                        <div className="flex items-center gap-2 pl-16">
                          {Array.from({ length: totalStepsCount }, (_, sIdx) => {
                            const isPassed = sIdx < currentStepIdx;
                            const isCurrent = sIdx === currentStepIdx - 1;
                            return (
                              <button
                                key={sIdx}
                                onClick={() => setCurrentStepIdx(sIdx + 1)}
                                className={`w-9 py-0.5 rounded text-[10px] font-mono font-bold transition-all text-center cursor-pointer ${
                                  isCurrent
                                    ? 'bg-primary-600 text-white shadow-xs ring-2 ring-primary-400/40 scale-105'
                                    : isPassed
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-dark-50 text-dark-400 hover:bg-dark-100'
                                }`}
                                title={`Jump to Step ${sIdx + 1}`}
                              >
                                S{sIdx + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* Qubit Wires */}
                        {Array.from({ length: qubitCount }, (_, qIdx) => (
                          <div key={qIdx} className={`flex items-center gap-2 ${qubitCount <= 1 ? 'my-3.5' : qubitCount === 2 ? 'my-2' : 'my-1'}`}>
                            <div className="w-14 shrink-0 flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-mono text-[10px] transition-colors ${
                                  currentStepIdx === 0
                                    ? 'bg-primary-100 text-primary-900 ring-1 ring-primary-500/30 font-bold'
                                    : 'bg-dark-100 text-dark-600'
                                }`}
                              >
                                |0⟩
                              </span>
                            </div>

                            <div className="flex-1 flex items-center gap-2 circuit-wire relative pr-1">
                              {Array.from({ length: totalStepsCount }, (_, sIdx) => {
                                const placed = circuitGates.find((g) => g.step === sIdx && g.qubits.includes(qIdx));
                                const isExecuted = sIdx < currentStepIdx;
                                const isCurrent = sIdx === currentStepIdx - 1;
                                const isControl = placed && (placed.type === 'cx' || placed.type === 'cz') && placed.qubits[0] === qIdx;
                                const isTarget = placed && (placed.type === 'cx' || placed.type === 'cz') && placed.qubits[1] === qIdx;

                                return (
                                  <div
                                    key={sIdx}
                                    onClick={() => setCurrentStepIdx(sIdx + 1)}
                                    className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                                      isCurrent
                                        ? 'ring-2 ring-blue-500/40 border-blue-600 scale-105 shadow-sm bg-white'
                                        : isExecuted
                                        ? 'border-emerald-300 bg-white shadow-2xs'
                                        : 'border-dashed border-dark-200 bg-white/70 opacity-35 grayscale-[50%]'
                                    }`}
                                    title={
                                      placed
                                        ? `${placed.type.toUpperCase()} on Q${placed.qubits.join(', Q')} (${
                                            isCurrent ? 'Currently Executing' : isExecuted ? 'Executed' : 'Upcoming'
                                          })`
                                        : `Step ${sIdx + 1}`
                                    }
                                  >
                                    {/* Vertical connector line for multi-qubit gates (CX, CZ, SWAP) */}
                                    {placed && placed.qubits.length > 1 && Math.min(...placed.qubits) === qIdx && (
                                      <div
                                        className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-600 pointer-events-none z-0"
                                        style={{
                                          top: '50%',
                                          height: `${(Math.max(...placed.qubits) - Math.min(...placed.qubits)) * (qubitCount === 2 ? 46 : 42)}px`
                                        }}
                                      />
                                    )}

                                    {placed ? (
                                      <div className="relative w-full h-full flex items-center justify-center select-none">
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
                                        {isExecuted && !isCurrent && (
                                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs z-20">
                                            ✓
                                          </span>
                                        )}
                                      </div>
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

                </div>
              </div>

              {/* Bottom Split Row: Measurement Probabilities + Quantum Statevector */}
              <div className="grid min-h-0 grid-cols-1 sm:grid-cols-2 gap-2 items-stretch">
                {/* Measurement Probabilities Histogram */}
                <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1 flex min-h-0 flex-col h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[11px] text-dark-900">Measurement Probabilities</h3>
                    <span className="text-[9px] text-dark-500 font-mono">1024 shots</span>
                  </div>
                  <div className="relative mx-auto mt-1 flex-1 w-full max-w-[280px] aspect-square min-h-[180px] max-h-[280px]">
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
                    <span className="text-[9px] font-mono text-dark-500">2 Qubits (4 states)</span>
                  </div>
                  {currentAmps && currentAmps.length > 0 ? (
                    <div className="grid grid-cols-2 auto-rows-fr gap-1.5 text-xs font-mono flex-1">
                      {currentAmps.map((amp, idx) => {
                        const basisStr = idx.toString(2).padStart(qubitCount, '0');
                        const re = amp.re ?? 0;
                        const im = amp.im ?? 0;
                        const magSq = (re * re + im * im) * 100;
                        return (
                          <div key={idx} className="p-1.5 bg-dark-50 rounded-lg border border-dark-200 text-center flex flex-col items-center justify-center">
                            <span className="font-bold text-primary-700 block text-lg">|{basisStr}⟩</span>
                            <span className="text-sm text-dark-700 block mt-1">
                              {re.toFixed(2)}{im >= 0 ? '+' : ''}{im.toFixed(2)}i
                            </span>
                            <span className="text-sm font-sans font-semibold text-dark-500 block mt-0.5">
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

            {/* Right Column: Live 3D Bloch Spheres */}
            <div className="lg:col-span-5 lg:row-span-2 self-stretch min-w-0 bg-white rounded-xl border border-dark-200 p-3 sm:p-4 shadow-xs space-y-3 flex flex-col">
              <div className="flex items-center justify-between gap-2 px-0.5">
                <h3 className="font-bold text-sm text-dark-900">Live 3D Bloch Spheres</h3>
                <div className="flex items-center bg-dark-100 p-1 rounded-xl border border-dark-200 shrink-0 shadow-2xs">
                  <button
                    onClick={() => setRightPanelMode('vectors')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      rightPanelMode === 'vectors'
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-dark-700 hover:bg-white hover:text-dark-900'
                    }`}
                  >
                    {currentBlochs.length > 1 ? '2 Qubit Vectors' : 'Qubit Vector'}
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
                </div>
              </div>

              {rightPanelMode === 'vectors' ? (
                <div className="flex flex-1 min-h-0 flex-col gap-1.5">
                  <span className="block text-[10px] font-mono text-dark-500">
                    {currentBlochs.length} Qubit Vector{currentBlochs.length > 1 ? 's' : ''}
                  </span>
                  <div className={`grid flex-1 grid-cols-1 ${currentBlochs.length > 1 ? 'grid-cols-2' : ''} gap-2`}>
                    {currentBlochs.map((bv, idx) => (
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
              ) : (
                <div className="min-h-0 flex-1">
                  <QuantumCircuitCodePanel
                    numQubits={qubitCount}
                    gates={circuitGates}
                    title="Algorithm Code"
                    compact={false}
                    className="h-full min-h-0"
                    editable={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => handleTabChange('math', false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back: Math</span>
            </button>

            {/* Bottom Step Controls: Step Back, Step Badge, Step Forward / Next */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentStepIdx <= 0}
                onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-200 hover:bg-dark-50 text-dark-700 font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Step Back</span>
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-dark-100 text-dark-800 font-mono font-bold text-xs border border-dark-200 shadow-2xs">
                Step {currentStepIdx}/{snapshots.length > 0 ? snapshots.length - 1 : 0}
              </span>

              {snapshots.length > 0 && currentStepIdx < snapshots.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIdx((i) => Math.min(snapshots.length - 1, i + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Step Forward</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (userId) {
                      apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 4 });
                    }
                    unlockStage(3);
                    handleTabChange('build_it');
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer animate-fadeIn"
                >
                  <span>Next: Build It Hands-on</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Build It (Guided AI) */}
      {activeTab === 'build_it' && (
        <BuildItTab
          moduleSlug={moduleSlug}
          onProceedToQuiz={() => {
            if (userId) {
              apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 5 });
            }
            unlockStage(4);
            setActiveTab('quiz');
          }}
        />
      )}

      {/* Stage 5: Knowledge Check (Adaptive Quiz) */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-fadeIn">
          <AdaptiveQuizEngine
            moduleSlug={moduleSlug}
            moduleTitle={title}
            onProceedToSkillBase={() => {
              unlockStage(5);
              setActiveTab('skill_base');
            }}
          />
        </div>
      )}

      {/* Stage 6: Skill Base & Practice */}
      {activeTab === 'skill_base' && (
        <SkillBaseStage
          moduleSlug={moduleSlug}
          moduleTitle={title}
        />
      )}
      </div>
      </main>
      </div>

      {/* Quantum Algorithm Certificate Modal */}
      <QuantumCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        moduleSlug={moduleSlug}
        moduleTitle={title}
        studentName={studentName || undefined}
        isCompleted={isModuleFullyComplete}
        onClaimCertificate={handleClaimCertificate}
      />
    </div>
  );
}
