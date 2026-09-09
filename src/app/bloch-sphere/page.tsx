'use client';

import React, { useState } from 'react';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { useAccessibility } from '@/lib/accessibility-context';
import { BlochVector } from '@/lib/types';
import { Globe, Sparkles, Sliders, Info, RotateCcw } from 'lucide-react';

export default function BlochSpherePage() {
  const { explanationMode } = useAccessibility();

  // Controlled angles
  const [theta, setTheta] = useState<number>(Math.PI / 2); // default |+> (pi/2)
  const [phi, setPhi] = useState<number>(0);
  const [isEntangledDemo, setIsEntangledDemo] = useState<boolean>(false);

  // Compute (x, y, z) from angles
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
    { label: '|0⟩ (North Pole)', t: 0, p: 0, desc: 'Definite classical 0' },
    { label: '|1⟩ (South Pole)', t: Math.PI, p: 0, desc: 'Definite classical 1' },
    { label: '|+⟩ (Hadamard)', t: Math.PI / 2, p: 0, desc: 'Equal superposition (|0> + |1>)/√2' },
    { label: '|-⟩ (Phase -)', t: Math.PI / 2, p: Math.PI, desc: 'Equal superposition (|0> - |1>)/√2' },
    { label: '|i⟩ (+Y)', t: Math.PI / 2, p: Math.PI / 2, desc: 'Imaginary superposition (|0> + i|1>)/√2' },
    { label: '|-i⟩ (-Y)', t: Math.PI / 2, p: (3 * Math.PI) / 2, desc: 'Imaginary superposition (|0> - i|1>)/√2' }
  ];

  return (
    <div className="w-full mx-auto px-8 py-2.5 space-y-3 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-xl border border-dark-200 py-3 px-5 sm:px-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-primary-600" />
              3D Quantum Visualizer
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-dark-900 tracking-tight">
            Interactive 3D Bloch Sphere Explorer
          </h1>
          <p className="text-xs text-dark-600 mt-0.5 max-w-3xl leading-normal">
            The Bloch Sphere is the geometrical representation of pure 2-level quantum state space (qubit). Drag with your mouse or touch to rotate the 3D camera, adjust angles θ and φ, or inspect entangled mixed states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left: 3D Canvas */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md">
            <BlochSphere3D
              bloch={currentBloch}
              qubitIndex={0}
              warning={isEntangledDemo ? 'Demonstration: Qubit is entangled in a Bell state — reduced density matrix purity Tr(ρ²) = 0.5 < 1.0, rendering single-qubit Bloch vector undefined.' : undefined}
              size={360}
            />
          </div>
        </div>

        {/* Right: Angle Controls & Standard Basis Presets */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Preset Basis States */}
          <div className="bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 shadow-xs space-y-2.5">
            <h3 className="font-bold text-xs sm:text-sm text-dark-900">Standard Basis Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {standardStates.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsEntangledDemo(false);
                    setTheta(s.t);
                    setPhi(s.p);
                  }}
                  className="p-2.5 rounded-xl border border-dark-200 hover:border-primary-400 hover:bg-primary-50/50 text-left transition-all"
                >
                  <span className="font-mono font-bold text-xs text-dark-900 block">{s.label}</span>
                  <span className="text-[11px] text-dark-500 block truncate">{s.desc}</span>
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
                <h3 className="font-bold text-xs sm:text-sm text-dark-900">State Parameters (θ, φ)</h3>
                <button
                  onClick={() => {
                    setTheta(0);
                    setPhi(0);
                  }}
                  className="text-xs text-dark-500 hover:text-dark-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to |0⟩
                </button>
              </div>

              {/* Polar Angle Theta */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-dark-700">θ (Polar Angle from +Z):</span>
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
                  onChange={(e) => setTheta(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              {/* Azimuthal Angle Phi */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-dark-700">φ (Azimuthal Angle in XY plane):</span>
                  <span className="font-mono font-bold text-primary-700">
                    {((phi * 180) / Math.PI).toFixed(1)}° ({phi.toFixed(2)} rad)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2 * Math.PI}
                  step={0.01}
                  value={phi}
                  onChange={(e) => setPhi(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              {/* Probability Readout */}
              <div className="pt-2 border-t border-dark-100 grid grid-cols-2 gap-2.5 text-center">
                <div className="p-2.5 bg-dark-50 rounded-xl border border-dark-200">
                  <span className="text-[11px] text-dark-500 block font-medium">P(|0⟩) = cos²(θ/2)</span>
                  <span className="font-mono font-bold text-sm text-primary-700">
                    {(prob0 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 bg-dark-50 rounded-xl border border-dark-200">
                  <span className="text-[11px] text-dark-500 block font-medium">P(|1⟩) = sin²(θ/2)</span>
                  <span className="font-mono font-bold text-sky-700">
                    {(prob1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mathematical Parameterization */}
          <div className="p-4 rounded-2xl bg-dark-50/60 border border-dark-200 text-xs space-y-1.5 text-dark-700 leading-relaxed">
            <h4 className="font-bold text-dark-900">Bloch Sphere Formulation:</h4>
            <p className="font-mono text-[11px] text-primary-900 bg-white p-1.5 rounded border border-dark-200">
              |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
            </p>
            <p>
              {explanationMode === 'simple'
                ? 'The north pole is 0, the south pole is 1. Any other point on the globe is a unique mixture of both, with the longitude representing the phase angle!'
                : 'Unitary single-qubit gates correspond directly to 3D rotations SO(3) of the Bloch vector needle about the corresponding axis.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
