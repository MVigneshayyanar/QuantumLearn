'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { useStudentContext } from '@/lib/student-context';
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
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BuildItTab } from './BuildItTab';

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

  const [activeTab, setActiveTab] = useState<'intuition' | 'math' | 'circuit' | 'build_it' | 'quiz'>('intuition');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [circuitGates, setCircuitGates] = useState<PlacedGate[]>(() => getDefaultGatesForAlgorithm(algorithmBackendId));
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState<Record<string, any>>(defaultParams);

  // Fetch algorithm simulation
  const fetchSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/simulate/algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: algorithmBackendId,
          params,
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
    fetchSimulation();
  }, [algorithmBackendId]);

  // Report module "in_progress" to DB on first access
  const { userId } = useStudentContext();
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (userId && !hasReportedRef.current) {
      hasReportedRef.current = true;
      apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: 1 });
    }
  }, [userId, moduleSlug]);

  // Report stage progression when navigating tabs
  const STAGE_MAP: Record<string, number> = { intuition: 1, math: 2, circuit: 3, build_it: 4, quiz: 5 };
  useEffect(() => {
    if (userId && STAGE_MAP[activeTab]) {
      apiReportProgress(userId, moduleSlug, 'in_progress', { stageReached: STAGE_MAP[activeTab] });
    }
  }, [activeTab, userId, moduleSlug]);

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
    { id: 'intuition', label: '1. Intuition & Concepts', icon: Lightbulb },
    { id: 'math', label: '2. Math & Construction', icon: FileCode },
    { id: 'circuit', label: '3. Interactive Circuit', icon: Cpu },
    { id: 'build_it', label: '4. Build It (Guided AI)', icon: Wand2 },
    { id: 'quiz', label: '5. Knowledge Check', icon: GraduationCap }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Module Header */}
      <div className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                {category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-dark-100 text-dark-800">
                {qubitCount} Qubits
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {speedup}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">{title}</h1>
            <p className="text-sm text-dark-600 leading-relaxed">{subtitle}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-dark-100 pb-2" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  announce(`Switched to stage: ${tab.label}`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage 1: Intuition */}
      {activeTab === 'intuition' && (
        <div className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-dark-900">Plain-Language Intuition</h2>
            </div>
            <span className="text-xs text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full font-medium">
              Mode: {explanationMode === 'simple' ? 'Simple / School' : 'Technical / Researcher'}
            </span>
          </div>

          <div className="intuition-text-block text-sm text-dark-800 space-y-4 whitespace-pre-wrap">
            <MathRenderer text={explanationMode === 'simple' ? intuitionSimple : intuitionTechnical} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('math')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Mathematical Walkthrough</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Mathematical Walkthrough */}
      {activeTab === 'math' && (
        <div className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-dark-900">Step-by-Step Mathematical Walkthrough</h2>
            </div>
          </div>

          <div className="space-y-6">
            {mathWalkthrough.map((step, idx) => (
              <div key={idx} className="math-step-card space-y-4 p-6 rounded-2xl bg-white border border-dark-200 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="math-step-badge">{idx + 1}</div>
                  <span className="font-bold text-base text-dark-900">{step.stepName}</span>
                </div>

                <MathBlock equation={step.equation} />

                <p className="text-sm text-dark-700 leading-relaxed">
                  <MathRenderer text={explanationMode === 'simple' ? step.descriptionSimple : step.descriptionTechnical} />
                </p>

                {/* Construction & Gate Rationale Layer */}
                {step.gateRationale && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs">
                    <Hammer className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-indigo-950 block">Circuit Construction &amp; Gate Choice Rationale:</span>
                      <p className="text-indigo-900 leading-relaxed">{step.gateRationale}</p>
                    </div>
                  </div>
                )}

                {/* Live Mini-Preview of Circuit State at this Step */}
                {step.stepGates && step.stepGates.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-dark-900 text-white space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-dark-400 font-sans">
                      <span>Circuit State at Step {idx + 1}:</span>
                      <span>{step.stepGates.length} operation(s) applied</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {step.stepGates.map((g, gIdx) => (
                        <div
                          key={gIdx}
                          className="px-2.5 py-1 rounded bg-dark-800 border border-dark-700 text-primary-300 flex items-center gap-1.5 shrink-0"
                        >
                          <span className="font-bold text-white uppercase">{g.type}</span>
                          <span className="text-dark-400 text-[10px]">Q{g.qubits.join(', Q')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Construction Mistakes */}
                {step.commonMistakes && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-950 block">Common Pitfall &amp; Construction Mistake:</span>
                      <p className="text-amber-900 leading-relaxed">{step.commonMistakes}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab('intuition')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Intuition</span>
            </button>
            <button
              onClick={() => setActiveTab('circuit')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Interactive Circuit & Simulation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Interactive Circuit Simulation */}
      {activeTab === 'circuit' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Algorithm Parameter Selector if available */}
          {paramControls && (
            <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs">
              {paramControls}
            </div>
          )}

          {/* Step-by-Step Execution Scrubber */}
          {snapshots.length > 0 && (
            <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary-600" />
                  <h3 className="font-bold text-sm text-dark-900">
                    Algorithm Step Playback ({currentStepIdx + 1} of {snapshots.length})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentStepIdx <= 0}
                    onClick={() => setCurrentStepIdx((i) => Math.max(0, i - 1))}
                    className="p-1.5 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-40"
                    title="Previous step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentStepIdx >= snapshots.length - 1}
                    onClick={() => setCurrentStepIdx((i) => Math.min(snapshots.length - 1, i + 1))}
                    className="p-1.5 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-40"
                    title="Next step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={snapshots.length - 1}
                value={currentStepIdx}
                onChange={(e) => setCurrentStepIdx(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />

              {/* Step info banner */}
              {currentSnapshot && (
                <div className="p-4 rounded-2xl bg-primary-50/60 border border-primary-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    {currentSnapshot.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary-900">{currentSnapshot.label}</h4>
                    <p className="text-sm text-dark-700 mt-1 leading-relaxed">
                      <MathRenderer text={
                        explanationMode === 'simple'
                          ? (currentSnapshot.description_simple || currentSnapshot.label)
                          : (currentSnapshot.description_technical || currentSnapshot.label)
                      } />
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step-Synchronized Quantum Circuit Board */}
          <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-sm text-dark-900">Step-Synchronized Quantum Circuit Board</h3>
                <span className="text-xs text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full font-semibold">
                  Step {currentStepIdx} of {snapshots.length > 0 ? snapshots.length - 1 : 0}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Executed (Active)
                </span>
                <span className="flex items-center gap-1.5 text-dark-500 bg-dark-50 px-2.5 py-1 rounded-md font-medium border border-dark-200">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Visual Circuit Canvas */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[640px] space-y-5 py-2">
                {/* Step Columns Timeline Header */}
                <div className="flex items-center gap-4 pl-24">
                  {Array.from({ length: totalStepsCount }, (_, sIdx) => {
                    const isPassed = sIdx < currentStepIdx;
                    const isCurrent = sIdx === currentStepIdx - 1;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => setCurrentStepIdx(sIdx + 1)}
                        className={`w-12 py-1 rounded-lg text-[10px] font-mono font-bold transition-all text-center ${
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
                  <div key={qIdx} className="flex items-center gap-4">
                    <div className="w-20 shrink-0 flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-dark-800">q[{qIdx}]</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                          currentStepIdx === 0
                            ? 'bg-primary-100 text-primary-900 ring-2 ring-primary-500/30 font-bold'
                            : 'bg-dark-100 text-dark-600'
                        }`}
                      >
                        |0⟩
                      </span>
                    </div>

                    <div className="flex-1 flex items-center gap-4 circuit-wire relative">
                      {Array.from({ length: totalStepsCount }, (_, sIdx) => {
                        const placed = circuitGates.find((g) => g.step === sIdx && g.qubits.includes(qIdx));
                        const isExecuted = sIdx < currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx - 1;

                        return (
                          <div
                            key={sIdx}
                            onClick={() => setCurrentStepIdx(sIdx + 1)}
                            className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                              isCurrent
                                ? 'ring-4 ring-primary-500/40 ring-offset-2 border-primary-600 scale-110 shadow-md bg-white'
                                : isExecuted
                                ? 'border-emerald-300 bg-white shadow-xs'
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
                            {placed ? (
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs relative ${
                                  GATE_COLORS[placed.type.toLowerCase()] || 'bg-primary-600 text-white'
                                }`}
                              >
                                {placed.type.toUpperCase()}
                                {isExecuted && !isCurrent && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-dark-300">·</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-dark-100 flex items-center justify-between text-xs text-dark-500">
              <span>Click on any step box (S1, S2...) to scrub playback directly to that operation.</span>
              <span className="font-mono">
                {currentStepIdx === 0
                  ? 'System at Ground State |0⟩'
                  : `Active Operation: ${currentSnapshot?.gate_applied || 'Gate'} on Qubit(s) ${currentSnapshot?.qubits_affected?.join(', ') ?? 'None'}`}
              </span>
            </div>
          </div>

          {/* 3D Bloch Spheres */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-dark-900">Real-Time Bloch Spheres</h3>
            <div className={`grid grid-cols-1 ${qubitCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
              {Array.from({ length: qubitCount }, (_, qIdx) => (
                <BlochSphere3D
                  key={qIdx}
                  qubitIndex={qIdx}
                  bloch={currentBlochs[qIdx] || null}
                  warning={simResult?.warnings?.find((w) => w.includes(`qubit ${qIdx}`))}
                  size={260}
                />
              ))}
            </div>
          </div>

          {/* Probabilities & State Amplitudes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-dark-900">Current Statevector Amplitudes</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentAmps.map((amp, idx) => {
                  const bitstr = idx.toString(2).padStart(qubitCount, '0');
                  const prob = (currentProbs[bitstr] || 0) * 100;
                  return (
                    <div key={bitstr} className="p-2.5 bg-dark-50 rounded-xl border border-dark-100 flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-primary-700">|{bitstr}⟩</span>
                      <span className="text-dark-600">{amp.re >= 0 ? '+' : ''}{amp.re} + {amp.im}i</span>
                      <span className="font-bold text-dark-900">{prob.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-dark-900">Measurement Probability Histogram</h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v: any) => [`${v}%`, 'Probability']} />
                    <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                      {histogramData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.prob > 0 ? '#4F46E5' : '#D1D5DB'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setActiveTab('math')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back: Math</span>
            </button>
            <button
              onClick={() => setActiveTab('build_it')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Build It Yourself (Guided AI)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Guided Build It */}
      {activeTab === 'build_it' && (
        <div className="space-y-6 animate-fadeIn">
          <BuildItTab
            moduleSlug={moduleSlug}
            onProceedToQuiz={() => {
              setActiveTab('quiz');
              announce('Proceeding to Knowledge Check Quiz');
            }}
          />
        </div>
      )}

      {/* Stage 5: Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-fadeIn">
          <AdaptiveQuizEngine moduleSlug={moduleSlug} />
        </div>
      )}
    </div>
  );
}
