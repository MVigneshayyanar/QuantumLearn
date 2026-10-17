'use client';

import React, { useState } from 'react';
import { HARDWARE_PLATFORMS, HardwarePlatform } from '@/lib/quantum-academy-data';
import {
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Play,
  RotateCcw,
  Thermometer,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function HardwareLabView() {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('superconducting');
  const [pulseAmp, setPulseAmp] = useState<number>(0.8);
  const [pulseDuration, setPulseDuration] = useState<number>(40);
  const [dragWeight, setDragWeight] = useState<number>(1.2);
  const [viewMode, setViewMode] = useState<'pulse' | 'specs' | 'comparison'>('pulse');

  const platform = HARDWARE_PLATFORMS.find((p) => p.id === selectedPlatformId) || HARDWARE_PLATFORMS[0];

  // Generate pulse waveforms (I and Q channels)
  const pulseData = React.useMemo(() => {
    const data = [];
    const sigma = pulseDuration / 4;
    for (let t = 0; t <= pulseDuration; t += 1) {
      const tc = t - pulseDuration / 2;
      const gaussian = pulseAmp * Math.exp(-Math.pow(tc, 2) / (2 * Math.pow(sigma, 2)));
      // DRAG correction: derivative of gaussian with respect to t
      const derivative = -dragWeight * (-tc / Math.pow(sigma, 2)) * gaussian;
      data.push({
        time: t,
        I: parseFloat(gaussian.toFixed(4)),
        Q: parseFloat(derivative.toFixed(4)),
        envelope: parseFloat(Math.sqrt(gaussian * gaussian + derivative * derivative).toFixed(4))
      });
    }
    return data;
  }, [pulseAmp, pulseDuration, dragWeight]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-dark-900 via-indigo-950 to-primary-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-primary-400" />
            <span>Interactive Hardware Physics Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Synchronized Quantum Hardware Simulator
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">
            See how abstract software gates compile into physical microwave pulses, laser fields, and nanoscale potentials across 5 real physical quantum modalities.
          </p>
        </div>
      </div>

      {/* Modality Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {HARDWARE_PLATFORMS.map((plat) => {
          const isSelected = plat.id === selectedPlatformId;
          return (
            <button
              key={plat.id}
              onClick={() => setSelectedPlatformId(plat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-primary-600 text-white border-primary-500 shadow-card'
                  : 'bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 border-dark-200 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{plat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Platform Overview & Specs Card */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-900 rounded-3xl border border-dark-200 dark:border-dark-800 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold">
              Modality Architecture
            </span>
            <h3 className="text-xl font-bold text-dark-900 dark:text-white">{platform.name}</h3>
            <p className="text-xs text-dark-500 dark:text-dark-400">{platform.tagline}</p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-dark-50 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700 space-y-1">
              <span className="text-dark-400 text-[10px] font-semibold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                Operating Temp
              </span>
              <p className="font-bold text-dark-900 dark:text-white text-xs sm:text-sm">{platform.temp}</p>
            </div>

            <div className="p-3 rounded-2xl bg-dark-50 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700 space-y-1">
              <span className="text-dark-400 text-[10px] font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Coherence (T₁)
              </span>
              <p className="font-bold text-dark-900 dark:text-white text-xs sm:text-sm">{platform.typicalT1}</p>
            </div>

            <div className="p-3 rounded-2xl bg-dark-50 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700 space-y-1">
              <span className="text-dark-400 text-[10px] font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                1-Qubit Speed / Fid
              </span>
              <p className="font-bold text-dark-900 dark:text-white text-xs">
                {platform.gateTime1Q} <span className="text-emerald-600 dark:text-emerald-400">({platform.fidelity1Q})</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-dark-50 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700 space-y-1">
              <span className="text-dark-400 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                2-Qubit Speed / Fid
              </span>
              <p className="font-bold text-dark-900 dark:text-white text-xs">
                {platform.gateTime2Q} <span className="text-emerald-600 dark:text-emerald-400">({platform.fidelity2Q})</span>
              </p>
            </div>
          </div>

          {/* Physical Mechanism */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-dark-900 dark:text-white">Physical Mechanism</h4>
            <p className="text-dark-600 dark:text-dark-300 leading-relaxed bg-dark-50/60 dark:bg-dark-800/60 p-3.5 rounded-2xl border border-dark-100 dark:border-dark-700">
              {platform.physicalMechanism}
            </p>
          </div>

          {/* Native Gate Set */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-dark-900 dark:text-white">Native Gate Set</h4>
            <div className="flex flex-wrap gap-1.5">
              {platform.nativeGateSet.map((gate, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60 font-mono font-bold text-[11px]"
                >
                  {gate}
                </span>
              ))}
            </div>
          </div>

          {/* Key Players */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-dark-900 dark:text-white flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary-600" />
              Leading Industry Implementations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {platform.companies.map((co, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-200 text-[11px] font-semibold"
                >
                  {co}
                </span>
              ))}
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="space-y-1.5">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </span>
              <ul className="space-y-1 text-dark-600 dark:text-dark-300 text-[11px]">
                {platform.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Challenges
              </span>
              <ul className="space-y-1 text-dark-600 dark:text-dark-300 text-[11px]">
                {platform.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-amber-500">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Microwave / Pulse Waveform Synthesizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-200 dark:border-dark-800 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-100 dark:border-dark-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Control Physics Layer
                </span>
                <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white">
                  Real-Time Pulse Waveform Synthesizer
                </h3>
                <p className="text-xs text-dark-500 dark:text-dark-400">
                  Observe I(t) (In-phase) and Q(t) (DRAG quadrature) microwave waveforms driving the transmon/ion.
                </p>
              </div>

              {/* Reset to π-pulse default */}
              <button
                onClick={() => {
                  setPulseAmp(0.8);
                  setPulseDuration(40);
                  setDragWeight(1.2);
                }}
                className="px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-700 text-xs font-semibold hover:bg-dark-50 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-300 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset π-Pulse</span>
              </button>
            </div>

            {/* Waveform Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pulseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="time" unit=" ns" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis domain={[-1.0, 1.0]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#374151',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="I"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    name="In-Phase I(t) [X-drive]"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Q"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    name="DRAG Q(t) [Derivative]"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="envelope"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    name="Total Amplitude Envelope"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Waveform Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-100 dark:border-dark-800 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-dark-700 dark:text-dark-300">
                  <span>Pulse Amplitude (A)</span>
                  <span className="font-mono text-primary-600">{pulseAmp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={pulseAmp}
                  onChange={(e) => setPulseAmp(parseFloat(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
                <span className="text-[10px] text-dark-400 block">Controls rotation angle θ = ∫Ω(t)dt</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-dark-700 dark:text-dark-300">
                  <span>Duration (Gate Time)</span>
                  <span className="font-mono text-primary-600">{pulseDuration} ns</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="80"
                  step="2"
                  value={pulseDuration}
                  onChange={(e) => setPulseDuration(parseInt(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
                <span className="text-[10px] text-dark-400 block">Full width at 4σ envelope</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-dark-700 dark:text-dark-300">
                  <span>DRAG Parameter (β)</span>
                  <span className="font-mono text-amber-600">{dragWeight.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={dragWeight}
                  onChange={(e) => setDragWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-dark-400 block">Cancels leakage into state |2⟩</span>
              </div>
            </div>

            {/* Hardware Control Pipeline Description */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-1.5">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Physical Compilation Chain: Algorithm → Native Gate → Microwave Pulse
              </span>
              <p className="text-indigo-900/90 dark:text-indigo-300 leading-relaxed text-[11px]">
                When a user executes an <strong>X Gate</strong> in code, the quantum control electronics (AWG) synthesize these two microwave envelopes modulated at the qubit resonance frequency (~5 GHz). The In-phase (I) channel drives rotation around X, while the DRAG Quadrature (Q) channel compensates for the finite transmon anharmonicity, achieving gate fidelities &gt; 99.9%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
