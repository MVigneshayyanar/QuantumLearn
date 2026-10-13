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
  Code2,
  Columns
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

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    announce(`Switched to stage: ${tabId}`);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Smooth scroll to top when switching stages (except circuit tab so user stays in cockpit)
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab !== 'circuit') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const [circuitGates, setCircuitGates] = useState<PlacedGate[]>(() => getDefaultGatesForAlgorithm(algorithmBackendId));
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>(defaultParams);
  const [circuitViewMode, setCircuitViewMode] = useState<'split' | 'visual' | 'code'>('split');

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

  const snapshots: StepSnapshot[] = simResult?.step_by_step || [];
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
    ...circuitGates.map((g) => g.step + 1),
    snapshots.length > 0 ? snapshots.length - 1 : 0
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
    <div className={`w-full mx-auto ${isCompactCockpitTab ? 'px-3 sm:px-6 py-1.5 space-y-2' : 'px-8 py-3 space-y-3.5'}`}>
      {/* Module Header: Compact Cockpit Header on interactive tabs, Full Header on intuition/math */}
      {isCompactCockpitTab ? (
        <div className="bg-white rounded-xl border border-dark-200 px-3.5 py-2 shadow-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Left: Title & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-dark-900 tracking-tight">{title}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                {category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dark-100 text-dark-800">
                {qubitCount} Qubits
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 hidden sm:inline-flex items-center gap-1">
                <MathRenderer text={speedup} />
              </span>
            </div>

            {/* Right: Certificate Trigger */}
            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-[11px] font-bold text-amber-900 transition-colors cursor-pointer"
              title="Preview Certificate of Mastery"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{isModuleFullyComplete ? 'Official Certificate' : 'Certificate'}</span>
              <ExternalLink className="w-2.5 h-2.5 text-amber-700" />
            </button>
          </div>

          {/* Compact Tab Navigation */}
          <div className="flex flex-wrap gap-1 border-t border-dark-100 pt-1.5" role="tablist">
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
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
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
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs relative overflow-hidden space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Column: Badges, Title & Subtitle */}
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                  {category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-dark-100 text-dark-800">
                  {qubitCount} Qubits
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                  <MathRenderer text={speedup} />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  6 Learning Stages
                </span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-dark-900 tracking-tight">{title}</h1>
                <p className="text-xs text-dark-600 leading-normal">{subtitle}</p>
              </div>
            </div>

            {/* Right Column: Unified Single Certificate Trigger */}
            <button
              onClick={() => setShowCertificate(true)}
              className="group/cert cursor-pointer flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-amber-200/90 dark:border-amber-700/60 bg-gradient-to-r from-amber-50/80 via-white to-orange-50/40 dark:from-dark-900 dark:via-dark-850 dark:to-dark-900 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition-all text-left shrink-0 self-start sm:self-auto"
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

              <div className="min-w-0 pr-1 leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-dark-900 dark:text-dark-100 group-hover/cert:text-amber-700 dark:group-hover/cert:text-amber-400 transition-colors">
                    {isModuleFullyComplete ? 'Official Certificate' : 'Certificate of Mastery'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isModuleFullyComplete
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                        : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                    }`}
                  >
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
          </div>

          {/* Tab Navigation with Sequential 1-by-1 Lock */}
          <div className="flex flex-wrap gap-1.5 border-t border-dark-100 pt-3" role="tablist">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
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
        </div>
      )}

      {/* Active Stage Content with bottom-to-top slideUp animation */}
      <div key={activeTab} className="animate-slideUp">
        {/* Stage 1: Intuition */}
        {activeTab === 'intuition' && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs space-y-4 animate-fadeIn">
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

          <div className="flex justify-end">
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
        <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary-600" />
              <h2 className="text-base font-bold text-dark-900">Step-by-Step Mathematical Walkthrough</h2>
            </div>
          </div>

          <div className="space-y-4">
            {mathWalkthrough.map((step, idx) => (
              <div key={idx} className="math-step-card space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-dark-200 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="math-step-badge">{idx + 1}</div>
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
                      <span>Circuit State at Step {idx + 1}:</span>
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

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setActiveTab('intuition')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Intuition</span>
            </button>
            <button
              onClick={() => {
                if (userId) {
                  apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 3 });
                }
                unlockStage(2);
                setActiveTab('circuit');
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Interactive Circuit & Simulation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}      {/* Stage 3: Interactive Circuit Simulation (High-Density Cockpit) */}
      {activeTab === 'circuit' && (
        <div className="space-y-2 animate-fadeIn">
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
                  <div className="flex items-center gap-1 text-[11px] font-bold text-dark-800 shrink-0">
                    <Play className="w-3.5 h-3.5 text-primary-600" />
                    <span>Step {currentStepIdx + 1}/{snapshots.length}</span>
                  </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
            {/* Left Column: Circuit Board + (Probabilities & Statevector split) */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              {/* Quantum Circuit Board Card */}
              <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-primary-600" />
                    <h3 className="font-bold text-xs text-dark-900">Quantum Circuit Board</h3>
                    <span className="text-[9px] text-primary-700 bg-primary-50 border border-primary-200 px-1.5 py-0.2 rounded-full font-semibold">
                      Step {currentStepIdx} of {snapshots.length > 0 ? snapshots.length - 1 : 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <div className="flex items-center bg-dark-100 p-0.5 rounded-lg border border-dark-200">
                      <button
                        onClick={() => setCircuitViewMode('split')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          circuitViewMode === 'split'
                            ? 'bg-white text-primary-700 shadow-2xs'
                            : 'text-dark-600 hover:text-dark-900'
                        }`}
                        title="Side-by-side visual circuit and Python code"
                      >
                        <Columns className="w-2.5 h-2.5" />
                        <span>Split</span>
                      </button>
                      <button
                        onClick={() => setCircuitViewMode('visual')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          circuitViewMode === 'visual'
                            ? 'bg-white text-primary-700 shadow-2xs'
                            : 'text-dark-600 hover:text-dark-900'
                        }`}
                        title="Visual circuit wires"
                      >
                        <Cpu className="w-2.5 h-2.5" />
                        <span>Wires</span>
                      </button>
                      <button
                        onClick={() => setCircuitViewMode('code')}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                          circuitViewMode === 'code'
                            ? 'bg-white text-primary-700 shadow-2xs'
                            : 'text-dark-600 hover:text-dark-900'
                        }`}
                        title="Python code"
                      >
                        <Code2 className="w-2.5 h-2.5" />
                        <span>Code</span>
                      </button>
                    </div>
                    <span className="hidden sm:flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Visual Circuit Canvas & Python Code Panel */}
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Visual Circuit Canvas */}
                  {circuitViewMode !== 'code' && (
                    <div className={`overflow-x-auto pb-0.5 ${circuitViewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
                      <div className="w-full min-w-[320px] space-y-1.5 py-0.5">
                        {/* Step Columns Timeline Header */}
                        <div className="flex items-center gap-1.5 pl-14">
                          {Array.from({ length: totalStepsCount }, (_, sIdx) => {
                            const isPassed = sIdx < currentStepIdx;
                            const isCurrent = sIdx === currentStepIdx - 1;
                            return (
                              <button
                                key={sIdx}
                                onClick={() => setCurrentStepIdx(sIdx + 1)}
                                className={`w-8 py-0.5 rounded text-[9px] font-mono font-bold transition-all text-center cursor-pointer ${
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
                          <div key={qIdx} className="flex items-center gap-1.5">
                            <div className="w-12 shrink-0 flex items-center gap-1">
                              <span className="font-mono font-bold text-[11px] text-dark-800">q[{qIdx}]</span>
                              <span
                                className={`px-1 py-0 rounded font-mono text-[9px] transition-colors ${
                                  currentStepIdx === 0
                                    ? 'bg-primary-100 text-primary-900 ring-1 ring-primary-500/30 font-bold'
                                    : 'bg-dark-100 text-dark-600'
                                }`}
                              >
                                |0⟩
                              </span>
                            </div>

                            <div className="flex-1 flex items-center gap-1.5 circuit-wire relative pr-1">
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
                                    className={`relative z-10 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all border ${
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
                                          height: `${(Math.max(...placed.qubits) - Math.min(...placed.qubits)) * 40}px`
                                        }}
                                      />
                                    )}

                                    {placed ? (
                                      <div className="relative w-full h-full flex items-center justify-center select-none">
                                        {placed.type === 'cx' ? (
                                          isControl ? (
                                            <ControlDotIcon size={10} />
                                          ) : isTarget ? (
                                            <TargetPlusIcon size={20} />
                                          ) : (
                                            <QuantumGateSymbol type={placed.type} size="sm" />
                                          )
                                        ) : placed.type === 'cz' ? (
                                          isControl ? (
                                            <ControlDotIcon size={10} />
                                          ) : isTarget ? (
                                            <QuantumGateSymbol type="z" size="sm" />
                                          ) : (
                                            <QuantumGateSymbol type={placed.type} size="sm" />
                                          )
                                        ) : placed.type === 'swap' ? (
                                          <SwapXIcon size={18} />
                                        ) : (
                                          <QuantumGateSymbol type={placed.type} size="sm" />
                                        )}
                                        {isExecuted && !isCurrent && (
                                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold shadow-xs z-20">
                                            ✓
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-[8px] font-mono text-dark-300">·</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Beside wires: Live Code Panel */}
                  {circuitViewMode !== 'visual' && (
                    <div className={`p-1.5 rounded-lg bg-dark-900 border border-dark-700 ${circuitViewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-1 px-1">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-primary-400" />
                          <span className="text-white text-xs font-bold font-mono">Algorithm Code</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-800 text-primary-300 font-mono">
                            LIVE
                          </span>
                        </div>
                        <span className="text-[10px] text-dark-400 font-mono">{circuitGates.length} gates</span>
                      </div>
                      <QuantumCircuitCodePanel
                        numQubits={qubitCount}
                        gates={circuitGates}
                        title="Algorithm Implementation"
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Split Row: Measurement Probabilities + Quantum Statevector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                {/* Measurement Probabilities Histogram */}
                <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[11px] text-dark-900">Measurement Probabilities</h3>
                    <span className="text-[9px] text-dark-500 font-mono">1024 shots</span>
                  </div>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={histogramData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
                <div className="bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[11px] text-dark-900">Quantum Statevector |ψ⟩</h4>
                    <span className="text-[9px] font-mono text-dark-500">2 Qubits (4 states)</span>
                  </div>
                  {currentAmps && currentAmps.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                      {currentAmps.map((amp, idx) => {
                        const basisStr = idx.toString(2).padStart(qubitCount, '0');
                        const re = amp.re ?? 0;
                        const im = amp.im ?? 0;
                        const magSq = (re * re + im * im) * 100;
                        return (
                          <div key={idx} className="p-1.5 bg-dark-50 rounded-lg border border-dark-200 text-center">
                            <span className="font-bold text-primary-700 block text-[11px]">|{basisStr}⟩</span>
                            <span className="text-[9px] text-dark-600 block">
                              {re.toFixed(2)}{im >= 0 ? '+' : ''}{im.toFixed(2)}i
                            </span>
                            <span className="text-[9px] font-sans text-dark-400 block mt-0.2">
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
            <div className="lg:col-span-5 bg-white rounded-xl border border-dark-200 p-2.5 sm:p-3 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between px-0.5">
                <h3 className="font-bold text-xs text-dark-900">Live 3D Bloch Spheres</h3>
                <span className="text-[10px] font-mono text-dark-500">
                  {currentBlochs.length} Qubit Vector{currentBlochs.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className={`grid grid-cols-1 ${currentBlochs.length > 1 ? 'grid-cols-2' : ''} gap-1.5`}>
                {currentBlochs.map((bv, idx) => (
                  <div key={idx} className="w-full">
                    <BlochSphere3D
                      bloch={bv}
                      qubitIndex={bv ? bv.qubit : idx}
                      size={140}
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => handleTabChange('math')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back: Math</span>
            </button>

            <span className="text-[11px] text-dark-500 font-medium hidden md:inline">
              Deterministic quantum advantage: Single query reveals balanced vs constant oracle with 100% certainty.
            </span>

            <button
              onClick={() => {
                if (userId) {
                  apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 4 });
                }
                unlockStage(3);
                handleTabChange('build_it');
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Next: Build It Hands-on</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
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
