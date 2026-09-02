'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { AdaptiveQuizEngine } from '@/components/quiz/AdaptiveQuizEngine';
import { MathRenderer, MathBlock } from '@/components/math/MathRenderer';
import { SimulationResult, StepSnapshot } from '@/lib/types';
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
  HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface AlgorithmModuleViewProps {
  moduleSlug: string;
  title: string;
  subtitle: string;
  category: string;
  qubitCount: number;
  speedup: string;
  intuitionSimple: string;
  intuitionTechnical: string;
  mathWalkthrough: {
    stepName: string;
    equation: string;
    descriptionSimple: string;
    descriptionTechnical: string;
  }[];
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

  const [activeTab, setActiveTab] = useState<'intuition' | 'math' | 'circuit' | 'quiz'>('intuition');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
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
        const data: SimulationResult = await res.json();
        setSimResult(data);
        setCurrentStepIdx(0);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, [algorithmBackendId]);

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

  const tabs = [
    { id: 'intuition', label: '1. Intuition & Concepts', icon: Lightbulb },
    { id: 'math', label: '2. Math Walkthrough', icon: FileCode },
    { id: 'circuit', label: '3. Interactive Circuit', icon: Cpu },
    { id: 'quiz', label: '4. Knowledge Check', icon: GraduationCap }
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

          <div className="space-y-4">
            {mathWalkthrough.map((step, idx) => (
              <div key={idx} className="math-step-card space-y-3">
                <div className="flex items-center gap-3">
                  <div className="math-step-badge">{idx + 1}</div>
                  <span className="font-bold text-sm text-dark-900">{step.stepName}</span>
                </div>

                <MathBlock equation={step.equation} />

                <p className="text-sm text-dark-600 leading-relaxed">
                  <MathRenderer text={explanationMode === 'simple' ? step.descriptionSimple : step.descriptionTechnical} />
                </p>
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
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Next: Knowledge Check & Adaptive Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-fadeIn">
          <AdaptiveQuizEngine moduleSlug={moduleSlug} />
        </div>
      )}
    </div>
  );
}
