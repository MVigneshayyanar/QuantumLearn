'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function ShorPage() {
  const [coprimeBase, setCoprimeBase] = useState<'7' | '2' | '4'>('7');

  const intuitionSimple = `Why is online banking and internet communication secure today?
Because multiplying two huge prime numbers together is easy, but factoring their product N = p × q back into primes takes classical supercomputers billions of years!

In 1994, Peter Shor stunned the world by showing that a Quantum Computer can break this code in minutes.
Shor realized that factoring is really about finding a repeating pattern (the period r) in modular arithmetic:
a^x mod N = 1

Classical computers must calculate powers one by one like checking locks on a door.
Shor's quantum circuit evaluates ALL powers at once in a superposition wave, uses quantum interference to cancel all the wrong frequencies, and leaves only the true period r vibrating at the top! From r, classical math instantly factors the number.`;

  const intuitionTechnical = `Shor's Algorithm achieves polynomial-time factorization $\\mathcal{O}((\\log N)^3)$ of an $L$-bit composite integer $N$, shattering the sub-exponential security bound $\\mathcal{O}\\left(\\exp\\left(c \\sqrt[3]{L \\log^2 L}\\right)\\right)$ of the General Number Field Sieve (GNFS).

The algorithm proceeds in two phases:
1. **Classical Reduction**: Pick a random integer $a < N$ with $\\gcd(a, N) = 1$. The order $r$ is the smallest integer such that $a^r \\equiv 1 \\pmod N$. If $r$ is even, then $(a^{r/2} - 1)(a^{r/2} + 1) = k N$, so non-trivial factors are found via $\\gcd(a^{r/2} \\pm 1, N)$ with probability $\\ge 1 - 2^{-(m-1)}$ for $m$ distinct prime factors.
2. **Quantum Order Finding**:
   - Initialize control register $|0\\rangle^{\\otimes 2L}$ and target register $|1\\rangle$.
   - Superposition: $H^{\\otimes 2L}|0\\rangle = \\frac{1}{\\sqrt{2^{2L}}} \\sum_{x=0}^{2^{2L}-1} |x\\rangle$.
   - Reversible Modular Exponentiation: $|x\\rangle |1\\rangle \\mapsto |x\\rangle |a^x \\pmod N\\rangle$.
   - Inverse QFT on Control Register: Destructive interference cancels non-periodic paths, concentrating amplitude in basis states $s \\approx \\frac{k \\cdot 2^{2L}}{r}$.
   - Classical Continued Fractions: Reconstructs $r$ from $\\frac{s}{2^{2L}}$ in polynomial time $\\mathcal{O}(\\log^3 N)$.`;

  const mathWalkthrough = [
    {
      stepName: "Register Initialization",
      equation: "|\\psi_0\\rangle = |0\\rangle_{\\text{ctrl}}^{\\otimes 2} \\otimes |0001\\rangle_{\\text{mod}} = |00\\rangle \\otimes |1\\rangle",
      descriptionSimple: "Control qubits start in ground state |00⟩; the modular arithmetic register starts at |1⟩ (since a⁰ = 1).",
      descriptionTechnical: "Bipartite register $\\mathcal{H}_{\\text{ctrl}} \\otimes \\mathcal{H}_{\\text{target}}$, initialized to $|00\\rangle \\otimes |1\\rangle$.",
      gateRationale: "Pauli-X on target wire Q3 establishes the identity element $a^0 \\equiv 1 \\pmod N$.",
      stepGates: [
        { type: 'x', qubits: [3], step: 0 }
      ],
      commonMistakes: "Leaving the modular register in state |0000⟩ — multiplication by 0 is irreversible and collapses the modular ring!"
    },
    {
      stepName: "Control Register Superposition",
      equation: "|\\psi_1\\rangle = (H^{\\otimes 2} \\otimes I)|\\psi_0\\rangle = \\frac{1}{2}(|0\\rangle + |1\\rangle + |2\\rangle + |3\\rangle) \\otimes |1\\rangle",
      descriptionSimple: "Prepare all exponents x ∈ {0, 1, 2, 3} simultaneously in equal quantum superposition.",
      descriptionTechnical: "Prepares uniform distribution over control exponent space for parallel modular evaluation.",
      gateRationale: "Parallel Hadamard gates on Q0 and Q1 create the control superposition across all powers.",
      stepGates: [
        { type: 'x', qubits: [3], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 }
      ],
      commonMistakes: "Applying Hadamard to the target register, which scrambles the identity state |1⟩."
    },
    {
      stepName: "Controlled Modular Exponentiation Oracle",
      equation: "U_{a} |x\\rangle|y\\rangle = |x\\rangle |y \\cdot a^x \\pmod N\\rangle \\implies \\frac{1}{2} \\sum_{x=0}^3 |x\\rangle |a^x \\pmod N\\rangle",
      descriptionSimple: "Entangle each exponent with its modular multiplication result (aˣ mod 15).",
      descriptionTechnical: "Reversible unitary implementation of modular multiplication conditioned on control bits.",
      gateRationale: "Controlled-NOT gates couple the control wires Q1 and Q0 to the target register bits.",
      stepGates: [
        { type: 'x', qubits: [3], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 },
        { type: 'cx', qubits: [0, 3], step: 3 }
      ],
      commonMistakes: "Using non-unitary irreversible operations that fail to uncompute scratch ancillas."
    },
    {
      stepName: "Inverse QFT & Period Interference",
      equation: "(\\text{QFT}^\\dagger \\otimes I)|\\psi_2\\rangle \\implies \\text{Peak Amplitudes at } s \\in \\left\\{ 0, \\frac{2^{2L}}{r}, \\frac{2 \\cdot 2^{2L}}{r}, \\dots \\right\\}",
      descriptionSimple: "The inverse QFT causes destructive interference everywhere except at exact multiples of the period frequency!",
      descriptionTechnical: "Fourier transform translates periodic state correlations into localized sharp constructive peaks.",
      gateRationale: "Inverse QFT on Q0 and Q1 followed by measurement yields phase s, from which continued fractions extracts r = 4.",
      stepGates: [
        { type: 'x', qubits: [3], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 },
        { type: 'cx', qubits: [0, 3], step: 3 },
        { type: 'h', qubits: [0], step: 4 },
        { type: 'cz', qubits: [0, 1], step: 5 },
        { type: 'h', qubits: [1], step: 6 },
        { type: 'swap', qubits: [0, 1], step: 7 },
        { type: 'measure', qubits: [0], step: 8 },
        { type: 'measure', qubits: [1], step: 8 }
      ],
      commonMistakes: "Measuring the target register before the control register, which collapses the period superposition!"
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-dark-800 dark:text-dark-200 text-[11px]">Factoring N = 15 · Base a:</span>
      <div className="inline-flex rounded-lg border border-dark-200 dark:border-dark-700 p-0.5 bg-dark-50 dark:bg-dark-800 gap-0.5">
        <button
          onClick={() => setCoprimeBase('7')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            coprimeBase === '7'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          a = 7 (Period r = 4)
        </button>
        <button
          onClick={() => setCoprimeBase('2')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            coprimeBase === '2'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          a = 2 (Period r = 4)
        </button>
        <button
          onClick={() => setCoprimeBase('4')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            coprimeBase === '4'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          a = 4 (Period r = 2)
        </button>
      </div>
      <span className="text-dark-400 font-mono text-[10px] hidden sm:inline">Factors of 15: 3 × 5</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="shor"
      title="Shor's Factoring Algorithm"
      subtitle="Breaking RSA cryptography by reducing prime factorization to quantum modular order finding in polynomial time."
      category="Number Theory & Cryptography"
      qubitCount={4}
      speedup="$\mathcal{O}(\log^3 N)$ Polynomial vs Classical Subexponential"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="shor"
      defaultParams={{ base: coprimeBase, N: 15 }}
      paramControls={paramControls}
    />
  );
}
