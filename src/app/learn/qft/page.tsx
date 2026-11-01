'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function QFTPage() {
  const [inputBasis, setInputBasis] = useState<'000' | '001' | '010' | '100' | '101' | '111'>('001');

  const intuitionSimple = `Imagine listening to a musical chord played on a piano.
To your ear, it's a complex sound wave vibrating together. But a musician with perfect pitch can instantly decompose that sound into individual notes (C, E, G).

The classical Discrete Fourier Transform (FFT) does this for signals, but testing N frequencies takes N·log(N) steps.
The Quantum Fourier Transform (QFT) transforms quantum amplitude waves across all 2ⁿ states in just O(n²) steps — an exponential speedup!
Instead of analyzing frequencies one by one, QFT maps computational numbers directly into the relative clock-face angles (phases) of your qubits.`;

  const intuitionTechnical = `The Quantum Fourier Transform (QFT) acts on a state in a $2^n$-dimensional Hilbert space by mapping the computational basis state $|j\\rangle$ ($j \\in \\{0, \\dots, 2^n - 1\\}$) into the Fourier basis:
$$\\text{QFT}_N |j\\rangle = \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi i j k / N} |k\\rangle, \\quad N = 2^n$$

Crucially, this linear transformation factors into an unentangled tensor product of single-qubit states:
$$\\text{QFT}_N |j_1 j_2 \\dots j_n\\rangle = \\frac{1}{\\sqrt{2^n}} \\left(|0\\rangle + e^{2\\pi i 0.j_n}|1\\rangle\\right) \\otimes \\left(|0\\rangle + e^{2\\pi i 0.j_{n-1}j_n}|1\\rangle\\right) \\otimes \\dots \\otimes \\left(|0\\rangle + e^{2\\pi i 0.j_1 j_2 \\dots j_n}|1\\rangle\\right)$$

This product factorization enables compilation using only $\\frac{n(n+1)}{2}$ elementary single- and two-qubit gates, achieving exponential acceleration over the classical Fast Fourier Transform $\\mathcal{O}(n 2^n)$.`;

  const mathWalkthrough = [
    {
      stepName: "Input State Encoding",
      equation: "|\\psi_0\\rangle = |j_1 j_2 j_3\\rangle \\in \\{|000\\rangle, \\dots, |111\\rangle\\}",
      descriptionSimple: "The register starts encoded with the integer value j to be transformed.",
      descriptionTechnical: "Computational basis state representing integer $j = \\sum_{l=1}^n j_l 2^{n-l}$.",
      gateRationale: "Prepares the chosen digital input state vector before frequency transform.",
      stepGates: [
        { type: 'x', qubits: [2], step: 0 }
      ],
      commonMistakes: "Confusing little-endian hardware wire indexing with standard big-endian mathematical notation."
    },
    {
      stepName: "First Qubit Hadamard & Phase Rotations",
      equation: "H_0 |j_1\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + e^{2\\pi i 0.j_1}|1\\rangle), \\quad R_k = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i / 2^k} \\end{pmatrix}",
      descriptionSimple: "Apply Hadamard on wire 0, then add precise controlled rotation angles from wires 1 and 2.",
      descriptionTechnical: "Controlled phase shifts $CR_2$ and $CR_3$ accumulate the fractional binary phases $0.j_1 j_2 j_3$.",
      gateRationale: "Hadamard generates uniform superposition; controlled rotations imprint higher-order binary fractional digits into the phase angle.",
      stepGates: [
        { type: 'h', qubits: [0], step: 1 },
        { type: 's', qubits: [0], step: 2 },
        { type: 'cz', qubits: [0, 1], step: 3 }
      ],
      commonMistakes: "Applying uncontrolled rotation gates instead of controlled unitary phase shifts."
    },
    {
      stepName: "Second Qubit Cascade",
      equation: "H_1 |j_2\\rangle \\xrightarrow{CR_2} \\frac{1}{\\sqrt{2}}(|0\\rangle + e^{2\\pi i 0.j_2 j_3}|1\\rangle)",
      descriptionSimple: "Repeat the Hadamard and controlled phase rotation for the middle qubit.",
      descriptionTechnical: "Processes the sub-register with Hadamard and a single controlled phase rotation conditioned on $j_3$.",
      gateRationale: "Wire 1 only depends on bits $j_2$ and $j_3$, requiring fewer controlled rotation gates.",
      stepGates: [
        { type: 'h', qubits: [1], step: 4 },
        { type: 's', qubits: [1], step: 5 },
        { type: 'cz', qubits: [1, 2], step: 6 }
      ],
      commonMistakes: "Forgetting to condition subsequent rotations on remaining less-significant qubits."
    },
    {
      stepName: "Final Hadamard & Bit Reversal SWAP",
      equation: "H_2 |j_3\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + e^{2\\pi i 0.j_3}|1\\rangle), \\quad \\text{SWAP}(Q_0, Q_2)",
      descriptionSimple: "Apply a final Hadamard on wire 2 and SWAP the outer qubits to restore correct binary order.",
      descriptionTechnical: "The sequential gate sequence outputs phase terms in reversed bit order. A network of $\\lfloor n/2 \\rfloor$ SWAP gates realigns the register.",
      gateRationale: "Hadamard on the last qubit completes all fractional phase terms, and the SWAP gate mirrors wire indices to match standard Fourier frequency ordering.",
      stepGates: [
        { type: 'h', qubits: [2], step: 7 },
        { type: 'swap', qubits: [0, 2], step: 8 },
        { type: 'measure', qubits: [0], step: 9 },
        { type: 'measure', qubits: [1], step: 9 },
        { type: 'measure', qubits: [2], step: 9 }
      ],
      commonMistakes: "Omitting the final SWAP gates, which leaves the frequency output in bit-reversed order!"
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-dark-800 dark:text-dark-200 text-[11px]">Input Basis State |j⟩:</span>
      <div className="inline-flex rounded-lg border border-dark-200 dark:border-dark-700 p-0.5 bg-dark-50 dark:bg-dark-800 gap-0.5">
        {(['000', '001', '010', '100', '101', '111'] as const).map(state => (
          <button
            key={state}
            onClick={() => setInputBasis(state)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              inputBasis === state
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
            }`}
          >
            |{state}⟩
          </button>
        ))}
      </div>
      <span className="text-dark-400 font-mono text-[10px] hidden sm:inline">3-Qubit Register (N = 8)</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="qft"
      title="Quantum Fourier Transform (QFT)"
      subtitle="The computational engine of quantum speedup: mapping discrete numbers to relative wave phases in O(n²) gates."
      category="Frequency Domain"
      qubitCount={3}
      speedup="$\mathcal{O}(n^2)$ Quantum vs $\mathcal{O}(n \cdot 2^n)$ Classical FFT"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="qft"
      defaultParams={{ input_basis: inputBasis }}
      paramControls={paramControls}
    />
  );
}
