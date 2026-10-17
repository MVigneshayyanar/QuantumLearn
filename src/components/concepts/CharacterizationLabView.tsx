'use client';

import React, { useState, useMemo } from 'react';
import { 
  Activity, Play, RotateCcw, Sliders, Info, CheckCircle2, TrendingUp, Sparkles, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { CHARACTERIZATION_EXPERIMENTS } from '@/lib/quantum-academy-data';

export function CharacterizationLabView() {
  const [activeExpId, setActiveExpId] = useState<string>(CHARACTERIZATION_EXPERIMENTS[0].id);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.04);
  const [shots, setShots] = useState<number>(2048);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [hasScanned, setHasScanned] = useState<boolean>(true);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  const experiment = useMemo(() => {
    return CHARACTERIZATION_EXPERIMENTS.find(e => e.id === activeExpId) || CHARACTERIZATION_EXPERIMENTS[0];
  }, [activeExpId]);

  // Generate simulated experimental data points with realistic quantum projection noise
  const data = useMemo(() => {
    const points = 45;
    const [min, max] = experiment.xRange;
    const step = (max - min) / (points - 1);
    const result = [];

    for (let i = 0; i < points; i++) {
      const x = min + i * step;
      const ideal = experiment.simulationFormula(x, 0);
      const pClamped = Math.max(0.01, Math.min(0.99, ideal));
      const shotNoiseStd = Math.sqrt((pClamped * (1 - pClamped)) / shots);
      const totalNoise = shotNoiseStd + (Math.random() - 0.5) * noiseLevel;
      const measured = Math.max(0, Math.min(1, ideal + totalNoise));
      const errorMargin = Math.max(0.01, shotNoiseStd * 1.96);

      result.push({
        x: Number(x.toFixed(2)),
        ideal: Number(ideal.toFixed(4)),
        measured: Number(measured.toFixed(4)),
        error: Number(errorMargin.toFixed(4)),
      });
    }

    return result;
  }, [experiment, noiseLevel, shots, hasScanned]);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setHasScanned(true);
          return 100;
        }
        return prev + 12;
      });
    }, 80);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-primary-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold backdrop-blur-xs border border-white/10 mb-2">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Qubit Physics &amp; Calibration Bench</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Characterization Lab
            </h2>
            <p className="text-xs sm:text-sm text-dark-300 mt-1 max-w-2xl leading-relaxed">
              Simulate actual physical laboratory experiments used to calibrate, tune, and benchmark physical quantum processors before running circuits.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowTheory(!showTheory)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-teal-300" />
              <span>{showTheory ? 'Hide Physics' : 'Experiment Theory'}</span>
            </button>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-dark-950 text-xs font-bold shadow-card flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                  <span>Acquiring ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Acquire Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Experiment Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
          {CHARACTERIZATION_EXPERIMENTS.map((exp) => {
            const isActive = exp.id === activeExpId;
            return (
              <button
                key={exp.id}
                onClick={() => {
                  setActiveExpId(exp.id);
                  handleRunScan();
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-sm'
                    : 'bg-black/30 border-white/10 text-dark-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold truncate">{exp.name}</div>
                <div className="text-[10px] text-dark-400 mt-1 truncate">
                  Swept: {exp.parameterSwept}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lab Bench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Columns: Oscilloscope / Experimental Scan Plot */}
        <div className="lg:col-span-8 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{experiment.name} Scan</span>
                </h3>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                  {experiment.measuredQuantity} vs. {experiment.parameterSwept} ({experiment.xUnit})
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                  <span>Noisy Shots Data</span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-semibold">
                  <span className="w-2.5 h-0.5 bg-teal-500 inline-block" />
                  <span>Least-Squares Fit</span>
                </div>
              </div>
            </div>

            {/* Live Scan Plot */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                  <XAxis 
                    dataKey="x" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickFormatter={(v) => `${v}`}
                    label={{ value: `${experiment.parameterSwept} (${experiment.xUnit})`, position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    domain={[0, 1.05]}
                    label={{ value: experiment.measuredQuantity, angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b0f19',
                      borderColor: '#1e293b',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: string) => [
                      value,
                      name === 'measured' ? 'Measured P(|1⟩)' : 'Theoretical Fit'
                    ]}
                    labelFormatter={(label) => `${experiment.parameterSwept}: ${label} ${experiment.xUnit}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ideal" 
                    stroke="#0d9488" 
                    strokeWidth={2.5} 
                    dot={false}
                    name="fit"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="measured" 
                    stroke="#4F46E5" 
                    strokeWidth={1} 
                    strokeDasharray="2 2"
                    dot={{ r: 2.5, fill: '#4F46E5' }}
                    name="measured"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fit Results / Extracted Calibration Parameter */}
          <div className="mt-6 pt-5 border-t border-dark-200 dark:border-dark-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-[11px] text-dark-500 font-semibold">Extracted Calibration</div>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                {experiment.typicalValue}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-[11px] text-dark-500 font-semibold">Model Fit Equation</div>
              <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-1 truncate">
                {experiment.fitModel}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-dark-500 font-semibold">Scan Status</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Calibrated (99.8%)
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Instrumentation Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-dark-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Instrumentation Controls</span>
            </h3>

            {/* Shots per point slider */}
            <div>
              <div className="flex justify-between text-xs font-mono font-semibold mb-1.5">
                <span className="text-dark-600 dark:text-dark-400">Shots per Point</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">{shots.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="256"
                max="8192"
                step="256"
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-dark-200 dark:bg-dark-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-dark-400 mt-1">
                <span>Fast (256)</span>
                <span>High Precision (8192)</span>
              </div>
            </div>

            {/* Thermal Noise slider */}
            <div>
              <div className="flex justify-between text-xs font-mono font-semibold mb-1.5">
                <span className="text-dark-600 dark:text-dark-400">Dilution / Thermal Noise</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{(noiseLevel * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(Number(e.target.value))}
                className="w-full accent-cyan-600 h-2 bg-dark-200 dark:bg-dark-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-dark-400 mt-1">
                <span>Ultra-Cold (10 mK)</span>
                <span>High Fluctuations</span>
              </div>
            </div>

            <button
              onClick={() => {
                setNoiseLevel(0.04);
                setShots(2048);
              }}
              className="w-full py-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Instruments</span>
            </button>
          </div>

          {/* Procedure & Calibration Purpose Card */}
          <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-7 shadow-xs">
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calibration Objective</span>
            </h4>
            <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed font-article">
              {experiment.description}
            </p>
          </div>
        </div>
      </div>

      {/* Experimental Physics Drawer */}
      {showTheory && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-900 border border-teal-300 dark:border-teal-800 shadow-xs animate-fadeIn">
          <h3 className="text-sm font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Theoretical Physics: {experiment.name}</span>
          </h3>
          <div className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 space-y-3 leading-relaxed">
            <p>
              In practical quantum hardware, physical qubits do not begin in calibrated mathematical states. Engineers sweep continuous microwave frequencies and pulse amplitudes to detect energy level transitions (spectroscopy), determine the exact pulse duration for a $\pi$ flip (Rabi oscillation), and quantify environmental decoherence ($T_1$ and $T_2$).
            </p>
            <div className="p-3 rounded-xl bg-dark-50 dark:bg-dark-950 font-mono text-cyan-600 dark:text-cyan-400 text-xs border border-dark-200 dark:border-dark-800 notranslate">
              Fitting Formula: <span className="font-bold">{experiment.fitModel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
