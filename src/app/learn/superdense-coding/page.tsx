'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function SuperdenseCodingPage() {
  const [messageBits, setMessageBits] = useState<'00' | '01' | '10' | '11'>('10');

  const intuitionSimple = `In standard classical communication, if you send 1 physical signal pulse, you can at most send 1 bit of information (either a 0 or a 1).

What if Alice and Bob already share an entangled pair of quantum particles?
In Superdense Coding, Alice can manipulate her single half of the pair using quantum gates (Identity, Bit flip X, Phase flip Z, or both) and send just HER ONE particle to Bob.
When Bob receives that single qubit, he combines it with his particle to read out 2 full classical bits (00, 01, 10, or 11)!

Entanglement effectively doubles the information capacity of a quantum channel!`;

  const intuitionTechnical = `Superdense coding (Bennett & Wiesner 1992) demonstrates that prior entanglement ($1\\ \\text{e-bit}$) enables the transmission of $2\\ \\text{classical bits}$ using only $1\\ \\text{transmitted physical qubit}$.

By applying one of the 4 single-qubit Pauli operators $\\{I, X, Z, iY\\}$ to her subsystem of the maximally entangled Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$, Alice transforms the joint bipartite state into one of the 4 mutually orthogonal Bell basis states:
$I \\to |\\Phi^+\\rangle$ (00), $X \\to |\\Psi^+\\rangle$ (01), $Z \\to |\\Phi^-\\rangle$ (10), $iY \\to |\\Psi^-\\rangle$ (11).

Bob then performs a complete Bell-basis measurement to decode both classical bits with deterministic 100% fidelity.`;

  const mathWalkthrough = [
    {
      stepName: "Shared Entanglement Preparation",
      equation: "|\\Phi^+\\rangle = (H_0 \\otimes I_1)\\, \\text{CNOT}_{0,1}\\, |00\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)",
      descriptionSimple: "Alice and Bob share an entangled Bell pair.",
      descriptionTechnical: "Maximally entangled bipartite state with maximal entanglement entropy $S(\\rho_A) = 1$ bit."
    },
    {
      stepName: "Alice's 2-Bit Local Encoding",
      equation: "(\\sigma_A \\otimes I_B)|\\Phi^+\\rangle \\in \\Big\\{ |\\Phi^+\\rangle\\ (00),\\  |\\Psi^+\\rangle\\ (01),\\  |\\Phi^-\\rangle\\ (10),\\  |\\Psi^-\\rangle\\ (11) \\Big\\}",
      descriptionSimple: "Alice applies $I$, $X$, $Z$, or $ZX$ to encode 00, 01, 10, or 11.",
      descriptionTechnical: "Local unitary operations on subsystem $A$ map the Bell state bijectively across the 4 orthogonal basis states in $\\mathcal{H}_A \\otimes \\mathcal{H}_B$."
    },
    {
      stepName: "Bob's Bell Basis Decoding",
      equation: "(H_0 \\otimes I_1)\\, \\text{CNOT}_{0,1}\\, |\\text{Bell}\\rangle = |b_1 b_0\\rangle",
      descriptionSimple: "Bob receives Alice's qubit, applies CNOT and Hadamard to convert the state into definite classical bits.",
      descriptionTechnical: "Inverse Bell transform maps the 4 Bell states back to computational basis states $\\{|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle\\}$."
    },
    {
      stepName: "Measurement",
      equation: "P(b_1 b_0 = \\text{message}) = 1.0",
      descriptionSimple: "Measuring both qubits yields Alice's original 2-bit message with 100% certainty!",
      descriptionTechnical: "Exact deterministic projection onto computational basis — $1\\ \\text{qubit transmitted} \\Rightarrow 2\\ \\text{classical bits decoded}$."
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-dark-800">2 Classical Bits to Transmit:</span>
        <div className="inline-flex rounded-lg border border-dark-200 p-0.5 bg-dark-50">
          {(['00', '01', '10', '11'] as const).map((bits) => (
            <button
              key={bits}
              onClick={() => setMessageBits(bits)}
              className={`px-3 py-1.5 rounded-md font-mono font-medium transition-colors ${
                messageBits === bits ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900'
              }`}
            >
              &quot;{bits}&quot; {bits === '00' ? '(I)' : bits === '01' ? '(X)' : bits === '10' ? '(Z)' : '(Z·X)'}
            </button>
          ))}
        </div>
      </div>
      <span className="text-dark-500 font-mono">1 Transmitted Qubit = 2 Classical Bits</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="superdense-coding"
      title="Superdense Coding"
      subtitle="Transmit two classical bits of data by physically sending only a single qubit through an entangled channel."
      category="Quantum Information"
      qubitCount={2}
      speedup="2x Classical Channel Capacity via Entanglement"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="superdense_coding"
      defaultParams={{ message_bits: messageBits }}
      paramControls={paramControls}
    />
  );
}
