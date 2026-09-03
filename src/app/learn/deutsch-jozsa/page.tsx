'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function DeutschJozsaPage() {
  const [oracleType, setOracleType] = useState<'balanced_id' | 'constant_0' | 'constant_1' | 'balanced_not'>('balanced_id');

  const intuitionSimple = `Imagine you are given a mystery coin.
You want to know if it is a "Fair Coin" (Balanced: one side is Heads 0, one side is Tails 1) or a "Trick Coin" (Constant: both sides are identical).

In the classical world, you MUST look at both sides one after the other (2 queries).
With a Quantum Computer, you can place the coin into a quantum superposition of BOTH sides at once. Through Phase Kickback, the coin's property is encoded into the phase. A single final measurement reveals with 100% certainty whether the coin is Constant or Balanced in just ONE try!`;

  const intuitionTechnical = `The Deutsch-Jozsa problem considers a boolean black-box oracle function $f: \\{0, 1\\}^n \\to \\{0, 1\\}$ guaranteed to be either constant ($f(x) = c \\in \\{0,1\\}$) or balanced ($|f^{-1}(0)| = |f^{-1}(1)|$).

While any classical deterministic algorithm requires $\\Omega(2^{n-1} + 1)$ queries in the worst case to distinguish the two classes, the Deutsch-Jozsa algorithm achieves deterministic exact distinction in $\\mathcal{O}(1)$ query by exploiting global quantum interference across the Fourier/Hadamard basis.`;

  const mathWalkthrough = [
    {
      stepName: "State Initialization",
      equation: "|\\psi_0\\rangle = |0\\rangle_{\\text{input}} \\otimes |0\\rangle_{\\text{ancilla}}",
      descriptionSimple: "Both qubits start in the ground state |0⟩.",
      descriptionTechnical: "Register in Hilbert space $\\mathcal{H}^{\\otimes 2}$, initialized to $|00\\rangle$.",
      gateRationale: "No gates applied yet. Natural computational ground state |0⟩ of standard superconducting transmon qubits.",
      stepGates: [],
      commonMistakes: "Assuming qubits start in superposition automatically — in real hardware, all qubits reset to |0⟩."
    },
    {
      stepName: "Ancilla Inversion & Hadamard Layer",
      equation: "|\\psi_1\\rangle = (H \\otimes H)(I \\otimes X)|00\\rangle = |+\\rangle \\otimes |-\\rangle = \\frac{1}{2}(|0\\rangle + |1\\rangle)(|0\\rangle - |1\\rangle)",
      descriptionSimple: "Flip the helper qubit with X, then apply Hadamard to put both in superposition.",
      descriptionTechnical: "Prepares the target qubit in the $|-\\rangle$ eigenstate of the Pauli-$X$ operator to trigger phase kickback.",
      gateRationale: "Pauli-X flips Q1 to |1⟩. Then parallel Hadamard gates (H on Q0, H on Q1) map |0⟩ → |+⟩ and |1⟩ → |-⟩, establishing the required interference framework.",
      stepGates: [
        { type: 'x', qubits: [1], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 }
      ],
      commonMistakes: "Applying H to the ancilla BEFORE flipping it with X. This creates |+⟩ instead of |-⟩, completely disabling the phase kickback mechanism!"
    },
    {
      stepName: "Oracle Evaluation (Phase Kickback)",
      equation: "U_f |x\\rangle|-\\rangle = (-1)^{f(x)} |x\\rangle|-\\rangle",
      descriptionSimple: "The function calculates its value and 'kicks' the negative sign back into the input qubit!",
      descriptionTechnical: "Unitary $U_f |x\\rangle|y\\rangle = |x\\rangle|y \\oplus f(x)\\rangle$ transforms input basis state $|x\\rangle$ with global phase $(-1)^{f(x)}$.",
      gateRationale: "For a balanced oracle f(x)=x, a CNOT gate with control Q0 and target Q1 kicks the negative eigenvalue of |-⟩ into the phase of Q0.",
      stepGates: [
        { type: 'x', qubits: [1], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [0, 1], step: 2 }
      ],
      commonMistakes: "Reversing CNOT control and target (using Q1 as control). This corrupts the ancilla rather than imprinting the phase on the input register."
    },
    {
      stepName: "Interference & Measurement",
      equation: "H|\\psi_{\\text{input}}\\rangle = \\frac{1}{2}\\Big[((-1)^{f(0)} + (-1)^{f(1)})|0\\rangle + ((-1)^{f(0)} - (-1)^{f(1)})|1\\rangle\\Big]",
      descriptionSimple: "If f is Constant, constructive interference yields |0⟩ (100%). If Balanced, destructive interference yields |1⟩ (100%)!",
      descriptionTechnical: "Constructive interference yields amplitude $\\pm 1$ at $|0\\rangle$ for constant $f$, and destructive interference yields 0 amplitude at $|0\\rangle$ (yielding $|1\\rangle$ with probability 1) for balanced $f$.",
      gateRationale: "A final Hadamard gate on Q0 transforms the relative phase information back into the computational basis |0⟩ vs |1⟩ so a standard Z-basis measurement reads the answer.",
      stepGates: [
        { type: 'x', qubits: [1], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [0, 1], step: 2 },
        { type: 'h', qubits: [0], step: 3 },
        { type: 'measure', qubits: [0], step: 4 }
      ],
      commonMistakes: "Measuring in the X-basis without the final Hadamard gate, or measuring the ancilla qubit Q1 instead of input qubit Q0."
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-dark-800">Select Oracle Function:</span>
        <div className="inline-flex rounded-lg border border-dark-200 p-0.5 bg-dark-50">
          <button
            onClick={() => setOracleType('balanced_id')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              oracleType === 'balanced_id' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            Balanced: f(x) = x
          </button>
          <button
            onClick={() => setOracleType('balanced_not')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              oracleType === 'balanced_not' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            Balanced: f(x) = ¬x
          </button>
          <button
            onClick={() => setOracleType('constant_0')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              oracleType === 'constant_0' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            Constant: f(x) = 0
          </button>
          <button
            onClick={() => setOracleType('constant_1')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              oracleType === 'constant_1' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            Constant: f(x) = 1
          </button>
        </div>
      </div>
      <span className="text-dark-500 font-mono">Input Qubit: Q0 | Ancilla: Q1</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="deutsch-jozsa"
      title="Deutsch-Jozsa Algorithm"
      subtitle="The foundational demonstration of deterministic quantum advantage over classical computation."
      category="Quantum Parallelism"
      qubitCount={2}
      speedup="Deterministic O(1) vs Classical Exponential"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="deutsch_jozsa"
      defaultParams={{ oracle_type: oracleType }}
      paramControls={paramControls}
    />
  );
}
