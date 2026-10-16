'use client';

import React, { useState, useRef } from 'react';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { BlochVector } from '@/lib/types';
import { Globe, Sparkles, RotateCcw, Code2, Copy, Check, Terminal } from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

export default function BlochSpherePage() {
  const { explanationMode, language } = useAccessibility();
  const t = translations[language];

  // Controlled angles
  const [theta, setTheta] = useState<number>(Math.PI / 2); // default |+> (pi/2)
  const [phi, setPhi] = useState<number>(0);
  const [isEntangledDemo, setIsEntangledDemo] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('x-pos'); // Default snaps to |+> (Hadamard)

  // Sweep states
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [activeSweepAngle, setActiveSweepAngle] = useState<'theta' | 'phi' | 'both' | null>(null);
  const [showSweepArcsToggle, setShowSweepArcsToggle] = useState<boolean>(false);
  const sweepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Dynamic canvas sizing for phone screens (<480px)
  const [sphereSize, setSphereSize] = useState<number>(320);

  React.useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 420) {
          setSphereSize(260);
        } else if (window.innerWidth < 640) {
          setSphereSize(290);
        } else {
          setSphereSize(330);
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Helper to trigger angle sweep visualization when slider is moved
  const triggerSweep = (angle: 'theta' | 'phi') => {
    setActiveSweepAngle(angle);
    setIsSweeping(true);
    if (sweepTimerRef.current) clearTimeout(sweepTimerRef.current);
    sweepTimerRef.current = setTimeout(() => {
      setIsSweeping(false);
      setActiveSweepAngle(null);
    }, 2500);
  };

  // Compute (x, y, z) from spherical angles
  // x = sin(theta) * cos(phi)
  // y = sin(theta) * sin(phi)
  // z = cos(theta)
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  const currentBloch: BlochVector | null = isEntangledDemo
    ? null
    : {
        qubit: 0,
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4)),
        theta: Number(theta.toFixed(4)),
        phi: Number(phi.toFixed(4)),
        purity: 1.0,
        is_pure: true
      };

  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  const standardStates = [
    { id: 'z-pos', label: '$|0\\rangle$', name: 'North Pole (+Z)', t: 0, p: 0, mathDesc: '$|0\\rangle$' },
    { id: 'z-neg', label: '$|1\\rangle$', name: 'South Pole (-Z)', t: Math.PI, p: 0, mathDesc: '$|1\\rangle$' },
    { id: 'x-pos', label: '$|+\\rangle$', name: 'Hadamard (+X)', t: Math.PI / 2, p: 0, mathDesc: '$\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$' },
    { id: 'x-neg', label: '$|-\\rangle$', name: 'Phase Inverted (-X)', t: Math.PI / 2, p: Math.PI, mathDesc: '$\\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$' },
    { id: 'y-pos', label: '$|i\\rangle$', name: 'Circular (+Y)', t: Math.PI / 2, p: Math.PI / 2, mathDesc: '$\\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$' },
    { id: 'y-neg', label: '$|-i\\rangle$', name: 'Circular (-Y)', t: Math.PI / 2, p: (3 * Math.PI) / 2, mathDesc: '$\\frac{|0\\rangle - i|1\\rangle}{\\sqrt{2}}$' }
  ];

  return (
    <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 pb-24 lg:pb-3.5 max-w-7xl flex flex-col gap-3.5 animate-fadeIn">
      {/* Header - Compact Bar */}
      <div className="bg-white rounded-xl border border-dark-200 py-2.5 px-3.5 sm:px-5 shadow-xs flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-primary-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-dark-900 tracking-tight leading-tight truncate">
              Interactive 3D Bloch Sphere Explorer
            </h1>
            <p className="text-xs text-dark-500 truncate hidden sm:block">
              Geometrical representation of 2-level quantum state space (qubit). Rotate 3D camera to inspect poles & relative phase.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex px-2 py-0.5 rounded-md text-[10px] font-mono bg-dark-100 text-dark-700">
            6-Axis Dynamic Tracking
          </span>
          <button
            onClick={() => {
              const next = !isEntangledDemo;
              setIsEntangledDemo(next);
              if (next) setSelectedPresetId(null);
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              isEntangledDemo
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-dark-50 border-dark-200 text-dark-700 hover:bg-dark-100'
            }`}
          >
            {isEntangledDemo ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Entangled State</span>
              </span>
            ) : (
              'Entanglement Demo'
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Workspace - Split View fitting naturally */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left: 3D Canvas + Vector Info */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-dark-200 p-3 sm:p-4 flex flex-col justify-between items-center shadow-xs">
          <div className="w-full flex-1 flex items-center justify-center py-2">
            <BlochSphere3D
              bloch={currentBloch}
              qubitIndex={0}
              warning={isEntangledDemo ? 'Entangled Bell state: purity Tr(ρ²) = 0.5 < 1.0, single-qubit Bloch vector undefined.' : undefined}
              size={sphereSize}
              showSweepArcs={showSweepArcsToggle || isSweeping || selectedPresetId !== null}
              activeSweep={activeSweepAngle || (selectedPresetId ? 'both' : null)}
              selectedPole={selectedPresetId}
              onSelectPole={(poleId) => {
                const matched = standardStates.find((s) => s.id === poleId);
                if (matched) {
                  if (selectedPresetId === poleId) {
                    setSelectedPresetId(null);
                  } else {
                    setIsEntangledDemo(false);
                    setTheta(matched.t);
                    setPhi(matched.p);
                    setSelectedPresetId(matched.id);
                    triggerSweep(matched.t !== theta ? 'theta' : 'phi');
                  }
                }
              }}
              compact={false}
            />
          </div>
        </div>

        {/* Right: Presets, Controls & Readouts in compact cards */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Top Row: Presets (6 Poles) */}
          <div className="bg-white rounded-2xl border border-dark-200 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-dark-900">Standard Basis Presets (6 Poles)</h3>
              <div className="flex items-center gap-2">
                {selectedPresetId && (
                  <button
                    onClick={() => setSelectedPresetId(null)}
                    className="text-[10px] text-primary-600 hover:text-primary-800 font-semibold cursor-pointer underline underline-offset-2"
                  >
                    Unselect
                  </button>
                )}
                <span className="text-[10px] text-dark-400 font-medium">Click to snap / toggle</span>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {standardStates.map((s) => {
                const isSelected = selectedPresetId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPresetId(null);
                      } else {
                        setIsEntangledDemo(false);
                        setTheta(s.t);
                        setPhi(s.p);
                        setSelectedPresetId(s.id);
                        triggerSweep(s.t !== theta ? 'theta' : 'phi');
                      }
                    }}
                    className={`p-2 rounded-xl text-center transition-all group cursor-pointer relative ${
                      isSelected
                        ? 'border-2 border-primary-600 bg-primary-50 dark:bg-primary-950/60 shadow-xs'
                        : 'border border-dark-200 hover:border-primary-400 hover:bg-primary-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white"></span>
                    )}
                    <span
                      className={`font-mono font-bold text-xs block ${
                        isSelected ? 'text-primary-800 dark:text-primary-200' : 'text-dark-900 group-hover:text-primary-700'
                      }`}
                    >
                      <MathRenderer text={s.label} />
                    </span>
                    <span
                      className={`text-[9px] font-mono block truncate mt-0.5 ${
                        isSelected ? 'text-primary-700 font-bold' : 'text-dark-500'
                      }`}
                    >
                      {s.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Middle Row: State Parameters & Probabilities */}
          {!isEntangledDemo && (
            <div className="bg-white rounded-2xl border border-dark-200 p-3.5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-dark-900">State Parameters</h3>
                  <button
                    onClick={() => setShowSweepArcsToggle(!showSweepArcsToggle)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                      showSweepArcsToggle
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-dark-50 text-dark-700 border-dark-200 hover:bg-dark-100'
                    }`}
                  >
                    {showSweepArcsToggle ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Arcs</span>
                      </span>
                    ) : (
                      'Show Arcs'
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setTheta(0);
                    setPhi(0);
                    setSelectedPresetId('z-pos');
                    triggerSweep('theta');
                  }}
                  className="text-[11px] text-dark-500 hover:text-dark-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to <MathRenderer text="$|0\rangle$" />
                </button>
              </div>

              {/* Angle Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Polar Angle Theta */}
                <div className="space-y-1 bg-dark-50/60 p-2.5 rounded-xl border border-dark-100">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-dark-700 flex items-center gap-1">
                      <MathRenderer text="$\theta$" /> (Polar):
                    </span>
                    <span className="font-mono font-bold text-primary-700">
                      {((theta * 180) / Math.PI).toFixed(1)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.PI}
                    step={0.01}
                    value={theta}
                    onPointerDown={() => triggerSweep('theta')}
                    onChange={(e) => {
                      setTheta(Number(e.target.value));
                      setSelectedPresetId(null);
                      triggerSweep('theta');
                    }}
                    className="w-full accent-primary-600 cursor-pointer h-2"
                  />
                </div>

                {/* Azimuthal Angle Phi */}
                <div className="space-y-1 bg-dark-50/60 p-2.5 rounded-xl border border-dark-100">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-dark-700 flex items-center gap-1">
                      <MathRenderer text="$\phi$" /> (Phase):
                    </span>
                    <span className="font-mono font-bold text-cyan-700">
                      {((phi * 180) / Math.PI).toFixed(1)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2 * Math.PI}
                    step={0.01}
                    value={phi}
                    onPointerDown={() => triggerSweep('phi')}
                    onChange={(e) => {
                      setPhi(Number(e.target.value));
                      setSelectedPresetId(null);
                      triggerSweep('phi');
                    }}
                    className="w-full accent-cyan-600 cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Probabilities Row */}
              <div className="grid grid-cols-2 gap-2 text-center pt-0.5">
                <div className="py-1.5 px-3 bg-dark-50 rounded-xl border border-dark-200 flex items-center justify-between">
                  <span className="text-xs text-dark-600 font-medium">
                    <MathRenderer text="$P(|0\rangle) = \cos^2(\theta/2)$" />
                  </span>
                  <span className="font-mono font-bold text-xs text-primary-700">
                    {(prob0 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="py-1.5 px-3 bg-dark-50 rounded-xl border border-dark-200 flex items-center justify-between">
                  <span className="text-xs text-dark-600 font-medium">
                    <MathRenderer text="$P(|1\rangle) = \sin^2(\theta/2)$" />
                  </span>
                  <span className="font-mono font-bold text-xs text-sky-700">
                    {(prob1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Row: State Formula & Qiskit Code Snippet */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
            {/* Mathematical Formulation */}
            <div className="sm:col-span-5 p-3 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-xs flex flex-col justify-between shadow-xs">
              <span className="font-bold text-xs text-dark-900 dark:text-dark-100 block mb-1">State Formulation</span>
              <div className="py-2 px-3 rounded-xl bg-dark-50 dark:bg-dark-800/80 border border-dark-100 dark:border-dark-700 text-center my-auto">
                <MathRenderer
                  text="$|\psi\rangle = \cos(\frac{\theta}{2})|0\rangle + e^{i\phi}\sin(\frac{\theta}{2})|1\rangle$"
                  className="font-bold text-xs text-primary-900 dark:text-primary-200"
                />
              </div>
              <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-1.5">
                Latitude controls probability; longitude controls the quantum relative phase.
              </p>
            </div>

            {/* Python Qiskit Code */}
            <div className="sm:col-span-7 bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  <span className="font-bold text-xs text-dark-900 dark:text-dark-100">Qiskit Statevector</span>
                </div>
                <button
                  onClick={() => {
                    const pyCode = `from qiskit.quantum_info import Statevector
import numpy as np

theta = ${theta.toFixed(4)}
phi = ${phi.toFixed(4)}
psi = Statevector([np.cos(theta/2), np.exp(1j*phi)*np.sin(theta/2)])
print(psi)`;
                    navigator.clipboard.writeText(pyCode);
                    setHasCopied(true);
                    setTimeout(() => setHasCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-100 hover:bg-dark-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 hover:text-dark-900 dark:text-dark-300 dark:hover:text-white border border-dark-200 dark:border-dark-700 text-[10px] font-medium transition-colors cursor-pointer"
                  title="Copy Python snippet"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 rounded-xl bg-dark-50 dark:bg-dark-950 text-dark-800 dark:text-dark-200 border border-dark-200/80 dark:border-dark-800/80 font-mono text-[11px] overflow-x-auto leading-relaxed select-all">
{`psi = Statevector([np.cos(${theta.toFixed(2)}/2), np.exp(1j*${phi.toFixed(2)})*np.sin(${theta.toFixed(2)}/2)])
bloch = [${(Math.sin(theta) * Math.cos(phi)).toFixed(2)}, ${(Math.sin(theta) * Math.sin(phi)).toFixed(2)}, ${Math.cos(theta).toFixed(2)}]`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
