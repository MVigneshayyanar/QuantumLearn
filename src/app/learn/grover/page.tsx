'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function GroverPage() {
  const [markedState, setMarkedState] = useState<string>('11');
  const [numQubits, setNumQubits] = useState<number>(2);

  const intuitionSimple = `Imagine searching for a specific face in a crowd of N people.
Classically, you must check each person one by one (on average N/2 checks, and in the worst case N checks).

Grover's Quantum Search works like an audio equalizer:
1. First, you put all items in equal volume (superposition).
2. The Oracle turns the phase of the target face upside down (inverts its sign to negative).
3. The Diffusion Operator flips all amplitudes around their average value. Since the target face was negative, this pulls its volume WAY UP to nearly 100% while canceling out all the wrong faces!`;

  const intuitionTechnical = `Grover's algorithm solves the unstructured database search problem in $\\mathcal{O}(\\sqrt{N})$ queries for a search space $N = 2^n$.

The algorithm operates by geometric rotation in a 2-dimensional subspace spanned by the uniform state $|s\\rangle = \\frac{1}{\\sqrt{N}}\\sum_x |x\\rangle$ and the target state $|w\\rangle$.
The Grover iteration $G = U_s U_w = (2|s\\rangle\\langle s| - I)(I - 2|w\\rangle\\langle w|)$ rotates the state towards $|w\\rangle$ by angle $2\\theta$ per iteration (where $\\sin\\theta = 1/\\sqrt{N}$), reaching optimality in $\\approx \\frac{\\pi}{4}\\sqrt{N}$ iterations.`;

  const mathWalkthrough = [
    {
      stepName: "Uniform Superposition State",
      equation: "|s\\rangle = H^{\\otimes n}|0\\rangle^{\\otimes n} = \\frac{1}{\\sqrt{N}} \\sum_{x=0}^{N-1} |x\\rangle",
      descriptionSimple: "Every item in the database receives an equal $\\frac{1}{N}$ probability.",
      descriptionTechnical: "Uniform statevector in $2^n$-dimensional Hilbert space with real amplitudes $\\frac{1}{\\sqrt{2^n}}$."
    },
    {
      stepName: "Phase Oracle (Marking Target)",
      equation: "U_w = I - 2|w\\rangle\\langle w| \\implies U_w|x\\rangle = (-1)^{\\delta_{x,w}} |x\\rangle",
      descriptionSimple: "The oracle flips the sign of only the marked item from $+$ to $-$.",
      descriptionTechnical: "Selective phase inversion operator reflecting the statevector across the hyperplane orthogonal to $|w\\rangle$."
    },
    {
      stepName: "Diffusion Operator (Inversion About Mean)",
      equation: "U_s = 2|s\\rangle\\langle s| - I \\implies \\alpha_x' = 2\\langle\\alpha\\rangle - \\alpha_x",
      descriptionSimple: "All amplitudes are reflected across the average line, boosting the negative target to near 100%!",
      descriptionTechnical: "Householder reflection about the uniform superposition state $|s\\rangle$."
    },
    {
      stepName: "Measurement",
      equation: "P(w) = |\\langle w|G^k|s\\rangle|^2 \\approx 1.0",
      descriptionSimple: "Measuring the circuit collapses the register onto the target marked item with near 100% accuracy.",
      descriptionTechnical: "Projective measurement yields the solution index $w$ with probability $1.0$ (for $N=4$ in 1 iteration)."
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-dark-800">Target Marked State:</span>
        <div className="inline-flex rounded-lg border border-dark-200 p-0.5 bg-dark-50">
          {['00', '01', '10', '11'].map((state) => (
            <button
              key={state}
              onClick={() => {
                setNumQubits(2);
                setMarkedState(state);
              }}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition-colors ${markedState === state && numQubits === 2
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-700 hover:text-dark-900'
                }`}
            >
              |{state}⟩
            </button>
          ))}
        </div>
      </div>
      <span className="text-dark-500 font-mono">Search Space N = {2 ** numQubits} items (1 Grover Iteration)</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="grover"
      title="Grover's Search Algorithm"
      subtitle="Unstructured quantum search through phase oracle marking and amplitude amplification."
      category="Amplitude Amplification"
      qubitCount={numQubits}
      speedup="Quadratic Speedup O(√N) vs Classical O(N)"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="grover"
      defaultParams={{ num_qubits: numQubits, marked_state: markedState }}
      paramControls={paramControls}
    />
  );
}
