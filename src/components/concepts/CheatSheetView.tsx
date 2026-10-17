'use client';

import React from 'react';
import { FileText, Cpu, Sparkles } from 'lucide-react';

export function CheatSheetView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-primary-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Rapid Reference Manual</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Quantum Gate &amp; Formula Cheat Sheet
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">
            Essential single-qubit unitaries, two-qubit entanglers, Bell states, Pauli algebra, and Dirac identities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* SECTION 1: PAULI MATRICES & BASIC GATES */}
        <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Pauli Matrices &amp; Single-Qubit Unitaries</span>
          </h3>

          <div className="space-y-3">
            {/* Identity */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-primary-700 dark:text-primary-400">Identity (I)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">Leaves qubit state unchanged</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                [[1, 0], [0, 1]]
              </div>
            </div>

            {/* Pauli-X */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">Pauli-X (NOT / Bit Flip)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">X|0⟩ = |1⟩, X|1⟩ = |0⟩</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                [[0, 1], [1, 0]]
              </div>
            </div>

            {/* Pauli-Y */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">Pauli-Y (Bit + Phase Flip)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                [[0, -i], [i, 0]]
              </div>
            </div>

            {/* Pauli-Z */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">Pauli-Z (Phase Flip)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                [[1, 0], [0, -1]]
              </div>
            </div>

            {/* Hadamard H */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">Hadamard (H)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">H|0⟩ = |+⟩, H|1⟩ = |-⟩</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                1/√2 [[1, 1], [1, -1]]
              </div>
            </div>

            {/* Phase S & T */}
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-pink-700 dark:text-pink-400">Phase (S) &amp; T-Gate (π/8)</div>
                <div className="text-[11px] text-dark-500 mt-0.5">S = √Z, T = √S = exp(iπ/8)</div>
              </div>
              <div className="font-mono text-xs text-dark-800 dark:text-dark-200 bg-white dark:bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-800 notranslate">
                diag(1, e^(iπ/4))
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BELL STATES & ENTANGLING GATES */}
        <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Maximally Entangled Bell Basis</span>
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">|Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)</div>
              <div className="text-[11px] text-dark-500 mt-1">Generated by: H(q0) → CNOT(q0, q1)</div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">|Φ⁻⟩ = 1/√2 (|00⟩ - |11⟩)</div>
              <div className="text-[11px] text-dark-500 mt-1">Generated by: X(q0) → H(q0) → CNOT(q0, q1)</div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">|Ψ⁺⟩ = 1/√2 (|01⟩ + |10⟩)</div>
              <div className="text-[11px] text-dark-500 mt-1">Generated by: X(q1) → H(q0) → CNOT(q0, q1)</div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
              <div className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">|Ψ⁻⟩ = 1/√2 (|01⟩ - |10⟩)</div>
              <div className="text-[11px] text-dark-500 mt-1">Singlet State: invariant under joint SU(2) rotations</div>
            </div>
          </div>

          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-dark-400 pt-2">
            Two-Qubit Matrix Unitaries
          </h4>

          <div className="p-4 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-2 text-xs font-mono">
            <div className="text-primary-700 dark:text-primary-400 font-bold">CNOT (CX Gate):</div>
            <div className="text-dark-800 dark:text-dark-200 overflow-x-auto notranslate">
              [[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]
            </div>
            <div className="text-dark-400 text-[11px]">Flips target qubit q1 if control qubit q0 = 1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
