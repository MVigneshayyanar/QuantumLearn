'use client';

import React, { useState, useRef } from 'react';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { useAccessibility } from '@/lib/accessibility-context';
import { BlochVector } from '@/lib/types';
import { Globe, Sparkles, RotateCcw } from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

export default function BlochSpherePage() {
  const { explanationMode } = useAccessibility();

  // Controlled angles
  const [theta, setTheta] = useState<number>(Math.PI / 2); // default |+> (pi/2)
  const [phi, setPhi] = useState<number>(0);
  const [isEntangledDemo, setIsEntangledDemo] = useState<boolean>(false);

  // Sweep states
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [activeSweepAngle, setActiveSweepAngle] = useState<'theta' | 'phi' | 'both' | null>(null);
  const [showSweepArcsToggle, setShowSweepArcsToggle] = useState<boolean>(false);
  const sweepTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    { label: '$|0\\rangle$', name: 'North Pole (+Z)', t: 0, p: 0, mathDesc: '$|0\\rangle$' },
    { label: '$|1\\rangle$', name: 'South Pole (-Z)', t: Math.PI, p: 0, mathDesc: '$|1\\rangle$' },
    { label: '$|+\\rangle$', name: 'Hadamard (+X)', t: Math.PI / 2, p: 0, mathDesc: '$\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$' },
    { label: '$|-\\rangle$', name: 'Phase Inverted (-X)', t: Math.PI / 2, p: Math.PI, mathDesc: '$\\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$' },
    { label: '$|i\\rangle$', name: 'Circular (+Y)', t: Math.PI / 2, p: Math.PI / 2, mathDesc: '$\\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$' },
    { label: '$|-i\\rangle$', name: 'Circular (-Y)', t: Math.PI / 2, p: (3 * Math.PI) / 2, mathDesc: '$\\frac{|0\\rangle - i|1\\rangle}{\\sqrt{2}}$' }
  ];

  return (
    <div className="w-full mx-auto px-8 py-3 space-y-3.5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl border border-dark-200 py-3.5 px-5 sm:px-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary-600" />
              3D Quantum Visualizer
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-dark-100 text-dark-700">
              6-Axis Dynamic Tracking
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-dark-900 tracking-tight">
            Interactive 3D Bloch Sphere Explorer
          </h1>
          <p className="text-xs text-dark-600 mt-0.5 max-w-3xl leading-normal">
            The Bloch Sphere provides an exact geometrical representation of 2-level quantum state space (qubit). Rotate the 3D camera to track all 6 poles, move the sliders to observe angle sweep arcs, and inspect mixed-state purity.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left: 3D Canvas */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md">
            <BlochSphere3D
              bloch={currentBloch}
              qubitIndex={0}
              warning={isEntangledDemo ? 'Demonstration: Qubit is entangled in a Bell state — reduced density matrix purity Tr(ρ²) = 0.5 < 1.0, rendering single-qubit Bloch vector undefined.' : undefined}
              size={360}
              showSweepArcs={showSweepArcsToggle || isSweeping}
              activeSweep={activeSweepAngle}
            />
          </div>
        </div>

        {/* Right: Angle Controls & Standard Basis Presets */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Preset Basis States */}
          <div className="bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-dark-900">Standard Basis Presets (6 Poles)</h3>
              <span className="text-[11px] text-dark-500 font-medium">Click to snap</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {standardStates.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsEntangledDemo(false);
                    setTheta(s.t);
                    setPhi(s.p);
                    triggerSweep(s.t !== theta ? 'theta' : 'phi');
                  }}
                  className="p-2.5 rounded-xl border border-dark-200 hover:border-primary-400 hover:bg-primary-50/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-dark-900 group-hover:text-primary-700">
                      <MathRenderer text={s.label} />
                    </span>
                    <span className="text-[10px] text-dark-500 font-mono">{s.name}</span>
                  </div>
                  <span className="text-[11px] text-primary-800 block truncate mt-1">
                    <MathRenderer text={s.mathDesc} />
                  </span>
                </button>
              ))}
            </div>

            {/* Toggle Entanglement Demo */}
            <div className="pt-2">
              <button
                onClick={() => setIsEntangledDemo(!isEntangledDemo)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isEntangledDemo
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-dark-50 border-dark-200 text-dark-800 hover:bg-dark-100'
                }`}
              >
                {isEntangledDemo ? '✓ Entangled Mixed State Active' : 'Toggle Entangled / Mixed State Demo'}
              </button>
            </div>
          </div>

          {/* Continuous Angle Sliders */}
          {!isEntangledDemo && (
            <div className="bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-dark-900">State Parameters</h3>
                  <button
                    onClick={() => setShowSweepArcsToggle(!showSweepArcsToggle)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                      showSweepArcsToggle
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-dark-50 text-dark-700 border-dark-200 hover:bg-dark-100'
                    }`}
                  >
                    {showSweepArcsToggle ? '✓ Angle Arcs Active' : 'Show Angle Arcs'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setTheta(0);
                    setPhi(0);
                    triggerSweep('theta');
                  }}
                  className="text-xs text-dark-500 hover:text-dark-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to <MathRenderer text="$|0\rangle$" />
                </button>
              </div>

              {/* Polar Angle Theta */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-dark-700 flex items-center gap-1">
                    <MathRenderer text="$\theta$" /> (Polar Angle from $+Z$):
                  </span>
                  <span className="font-mono font-bold text-primary-700">
                    {((theta * 180) / Math.PI).toFixed(1)}° ({theta.toFixed(2)} rad)
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
                    triggerSweep('theta');
                  }}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              {/* Azimuthal Angle Phi */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-dark-700 flex items-center gap-1">
                    <MathRenderer text="$\phi$" /> (Azimuthal Angle in $XY$ plane):
                  </span>
                  <span className="font-mono font-bold text-cyan-700">
                    {((phi * 180) / Math.PI).toFixed(1)}° ({phi.toFixed(2)} rad)
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
                    triggerSweep('phi');
                  }}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              {/* Probability Readout with Proper KaTeX MathML */}
              <div className="pt-2 border-t border-dark-100 grid grid-cols-2 gap-2.5 text-center">
                <div className="p-2.5 bg-dark-50 rounded-xl border border-dark-200">
                  <span className="text-[11px] text-dark-600 block font-medium mb-1">
                    <MathRenderer text="$P(|0\rangle) = \cos^2(\theta/2)$" />
                  </span>
                  <span className="font-mono font-bold text-sm text-primary-700">
                    {(prob0 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 bg-dark-50 rounded-xl border border-dark-200">
                  <span className="text-[11px] text-dark-600 block font-medium mb-1">
                    <MathRenderer text="$P(|1\rangle) = \sin^2(\theta/2)$" />
                  </span>
                  <span className="font-mono font-bold text-sky-700">
                    {(prob1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Parameterization */}
          <div className="p-4 rounded-2xl bg-dark-50/60 border border-dark-200 text-xs space-y-2 text-dark-700 leading-relaxed">
            <h4 className="font-bold text-dark-900">Bloch Sphere State Vector Formulation:</h4>
            <div className="p-2.5 rounded-xl bg-white border border-dark-200 shadow-2xs text-center">
              <MathRenderer
                text="$|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$"
                className="font-bold text-sm text-primary-950"
              />
            </div>
            <p className="text-dark-600">
              {explanationMode === 'simple'
                ? 'The north pole is |0⟩, the south pole is |1⟩. Any other point on the globe is a unique quantum superposition of both, with latitude controlling probability and longitude controlling the quantum relative phase!'
                : 'Unitary single-qubit operations correspond isomorphically to 3D rotations in SO(3) acting on the Bloch vector needle about the rotation axis defined by the gate generator.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
