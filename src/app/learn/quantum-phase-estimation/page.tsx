'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function QuantumPhaseEstimationPage() {
  const [targetEigenphase, setTargetEigenphase] = useState<'0.50' | '0.25' | '0.75'>('0.50');

  const intuitionSimple = `Imagine a clock hand inside a black box that spins at an unknown speed whenever you push a button (the unitary operator U).
Every time you activate U on its special natural vibration state (eigenvector |u⟩), it doesn't change color or shape — it just turns by an angle θ:
U |u⟩ = e^(2πiθ) |u⟩

How can you measure that hidden turning angle θ?
1. You attach "counting gears" (qubits in superposition) to the button.
2. The first gear activates the button once, the second activates it twice, the third four times (controlled powers of U).
3. The mystery angle kicks back into the counting gears as wave frequencies.
4. An Inverse Quantum Fourier Transform reads the clock hand directly into digital binary numbers on your screen!`;

  const intuitionTechnical = `Quantum Phase Estimation (QPE) is designed to estimate the unknown eigenphase $\\theta \\in [0, 1)$ of a unitary operator $U$ satisfying:
$$U|u\\rangle = e^{2\\pi i \\theta} |u\\rangle$$

Using an ancilla register of $t$ counting qubits initialized in $|0\\rangle^{\\otimes t}$ and a target register holding $|u\\rangle$:
1. **Superposition**: $H^{\\otimes t}$ transforms the counting register into $\\frac{1}{2^{t/2}} \\sum_{k=0}^{2^t - 1} |k\\rangle$.
2. **Controlled Unitary Powers**: Applying controlled-$U^{2^j}$ operations entangles the counting register with $|u\\rangle$, yielding the Fourier-encoded state:
$$\\frac{1}{2^{t/2}} \\sum_{k=0}^{2^t - 1} e^{2\\pi i \\theta k} |k\\rangle \\otimes |u\\rangle = |\\widetilde{2^t \\theta}\\rangle \\otimes |u\\rangle$$
3. **Inverse QFT ($\\text{QFT}^\\dagger$)**: Applies constructive interference across the counting register, mapping $|\\widetilde{2^t \\theta}\\rangle$ into the best $t$-bit binary approximation $|2^t \\theta\\rangle$.
4. **Measurement**: Measuring the counting register yields the binary expansion $0.\\theta_1 \\theta_2 \\dots \\theta_t$ with success probability $P \\ge \\frac{4}{\\pi^2} \\approx 81\\%$, boosted arbitrarily close to 1 with $O(\\log(1/\\epsilon))$ additional qubits.`;

  const mathWalkthrough = [
    {
      stepName: "Eigenstate & Counting Register Setup",
      equation: "|\\psi_0\\rangle = |0\\rangle^{\\otimes t} \\otimes |u\\rangle = |00\\rangle \\otimes |1\\rangle",
      descriptionSimple: "The counting qubits start at |00⟩, while the target qubit is prepared in eigenstate |1⟩.",
      descriptionTechnical: "Hilbert space decomposition $\\mathcal{H}_{\\text{count}}^{\\otimes 2} \\otimes \\mathcal{H}_{\\text{target}}$, with target initialized to Pauli-Z eigenstate $|1\\rangle$.",
      gateRationale: "A Pauli-X gate initializes the target into the eigenstate $|1\\rangle$ of the phase operator.",
      stepGates: [
        { type: 'x', qubits: [2], step: 0 }
      ],
      commonMistakes: "Leaving the target register in |0⟩ when the unitary operator acts trivially on |0⟩."
    },
    {
      stepName: "Counting Register Superposition",
      equation: "|\\psi_1\\rangle = (H^{\\otimes 2} \\otimes I)|\\psi_0\\rangle = \\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle) \\otimes |1\\rangle",
      descriptionSimple: "Put both counting qubits into equal superposition so they can test multiple powers in parallel.",
      descriptionTechnical: "Creates uniform distribution across all $2^t$ integer control values.",
      gateRationale: "Parallel Hadamard gates on counting qubits Q0 and Q1 prepare the input register for Fourier phase kickback.",
      stepGates: [
        { type: 'x', qubits: [2], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 }
      ],
      commonMistakes: "Applying Hadamard to the target qubit instead of keeping it in eigenstate |u⟩."
    },
    {
      stepName: "Controlled Unitary Powers & Phase Kickback",
      equation: "\\text{C-}U^{2^0}_{1\\to 2} \\text{ and } \\text{C-}U^{2^1}_{0\\to 2} \\implies \\frac{1}{2}\\sum_{k=0}^3 e^{2\\pi i \\theta k}|k\\rangle \\otimes |1\\rangle",
      descriptionSimple: "Activate controlled powers of U. The eigenvalues kick back into the phases of the counting qubits!",
      descriptionTechnical: "Controlled-phase gates imprint eigenvalues $e^{2\\pi i \\theta \\cdot 2^j}$ onto control qubit $j$.",
      gateRationale: "Controlled-Z on (Q1, Q2) applies $U^1$; Controlled-Z + S on (Q0, Q2) applies $U^2$.",
      stepGates: [
        { type: 'x', qubits: [2], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cz', qubits: [1, 2], step: 2 },
        { type: 'cz', qubits: [0, 2], step: 3 },
        { type: 's', qubits: [0], step: 4 }
      ],
      commonMistakes: "Reversing control and target wire order or applying identical powers of U across all counting qubits."
    },
    {
      stepName: "Inverse QFT & Phase Readout",
      equation: "\\text{QFT}^\\dagger |\\widetilde{2^t \\theta}\\rangle = |2^t \\theta\\rangle = |\\theta_1 \\theta_2\\rangle",
      descriptionSimple: "The inverse QFT converts the wave phases into definite binary bits that can be read by measurement.",
      descriptionTechnical: "Unitary inverse Fourier transform maps phase angles bijectively onto computational basis projections.",
      gateRationale: "Hadamard, controlled-phase inversion, and SWAP on the counting register decode the phase into binary digits.",
      stepGates: [
        { type: 'x', qubits: [2], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cz', qubits: [1, 2], step: 2 },
        { type: 'cz', qubits: [0, 2], step: 3 },
        { type: 's', qubits: [0], step: 4 },
        { type: 'h', qubits: [0], step: 5 },
        { type: 'cz', qubits: [0, 1], step: 6 },
        { type: 'h', qubits: [1], step: 7 },
        { type: 'swap', qubits: [0, 1], step: 8 },
        { type: 'measure', qubits: [0], step: 9 },
        { type: 'measure', qubits: [1], step: 9 }
      ],
      commonMistakes: "Measuring before applying the inverse QFT, which destroys the phase information and yields random bits!"
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-dark-800 dark:text-dark-200 text-[11px]">Target Phase θ:</span>
      <div className="inline-flex rounded-lg border border-dark-200 dark:border-dark-700 p-0.5 bg-dark-50 dark:bg-dark-800 gap-0.5">
        <button
          onClick={() => setTargetEigenphase('0.50')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            targetEigenphase === '0.50'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          θ = 1/2 (Binary: 0.10)
        </button>
        <button
          onClick={() => setTargetEigenphase('0.25')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            targetEigenphase === '0.25'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          θ = 1/4 (Binary: 0.01)
        </button>
        <button
          onClick={() => setTargetEigenphase('0.75')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            targetEigenphase === '0.75'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          θ = 3/4 (Binary: 0.11)
        </button>
      </div>
      <span className="text-dark-400 font-mono text-[10px] hidden sm:inline">Q0-Q1: Counting · Q2: Target Eigenstate</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="quantum-phase-estimation"
      title="Quantum Phase Estimation (QPE)"
      subtitle="Extracting the eigenvalue spectrum of physical unitary operators into digital bits with exponential precision."
      category="Eigenvalue Extraction"
      qubitCount={3}
      speedup="Exponential Precision Scaling per Query"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="quantum_phase_estimation"
      defaultParams={{ eigenphase: targetEigenphase }}
      paramControls={paramControls}
    />
  );
}
