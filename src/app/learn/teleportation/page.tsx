'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function TeleportationPage() {
  const [statePrep, setStatePrep] = useState<'plus' | 'one' | 't_state'>('plus');

  const intuitionSimple = `Imagine Alice has a fragile soap bubble (an unknown quantum state |ψ⟩).
If she tries to look at it or measure it, it pops (measurement collapse).
Because of the No-Cloning Theorem, she cannot even make a photocopy of it!

How can she send this exact bubble to Bob on the other side of the world?
1. Alice and Bob first share an entangled pair of particles (Bell pair).
2. Alice interacts her mystery bubble with her half of the entangled pair and measures them.
3. This creates 2 classical bits (like a phone call message), and destroys Alice's original bubble.
4. Alice calls Bob with the 2 bits. Bob uses these bits to rotate his entangled particle, and miraculously, Alice's exact bubble appears in Bob's hands!`;

  const intuitionTechnical = `Quantum Teleportation (Bennett et al. 1993) accomplishes the exact state transfer $\\mathcal{T}: \\mathcal{H}_A \\to \\mathcal{H}_B$ for an arbitrary unknown state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ by utilizing 1 shared e-bit of entanglement ($|\\Phi^+\\rangle_{AB} = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$) and consuming 2 classical bits (c-bits).

The protocol obeys the No-Cloning Theorem because Alice's joint Bell-basis projective measurement completely destroys her local state. It obeys the No-Signaling Theorem because Bob's reduced density matrix prior to classical feedforward correction is maximally mixed $\\rho_B = \\frac{1}{2}I$, possessing zero accessible mutual information.`;

  const mathWalkthrough = [
    {
      stepName: "Total 3-Qubit Composite State",
      equation: "|\\psi_0\\rangle = \\underbrace{(\\alpha|0\\rangle + \\beta|1\\rangle)}_{\\text{Alice's message}} \\otimes \\underbrace{\\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}}_{\\text{Shared Bell pair}}",
      descriptionSimple: "Alice holds Q0 (|ψ⟩) and Q1. Bob holds Q2.",
      descriptionTechnical: "Composite statevector in $\\mathcal{H}_A \\otimes \\mathcal{H}_{A'} \\otimes \\mathcal{H}_B = \\frac{1}{\\sqrt{2}}[\\alpha|000\\rangle + \\alpha|011\\rangle + \\beta|100\\rangle + \\beta|111\\rangle]$.",
      gateRationale: "First create the communication channel: apply H on Q1 and CX on (Q1, Q2) to share an entangled Bell pair between Alice (Q1) and Bob (Q2).",
      stepGates: [
        { type: 'h', qubits: [0], step: 0 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 }
      ],
      commonMistakes: "Entangling Q0 directly with Bob's Q2 — that violates the scenario where Alice and Bob are physically separated."
    },
    {
      stepName: "Alice's Bell-Basis Transform",
      equation: "(H_0 \\otimes I \\otimes I)(\\text{CNOT}_{0,1} \\otimes I)|\\psi_0\\rangle",
      descriptionSimple: "Alice mixes her unknown state with her entangled particle using CNOT and Hadamard.",
      descriptionTechnical: "Unitary mapping onto the 4 Bell basis states $\\{|\\Phi^+\\rangle, |\\Phi^-\\rangle, |\\Psi^+\\rangle, |\\Psi^-\\rangle\\}$ on Alice's subsystem.",
      gateRationale: "CNOT from Q0 to Q1 couples the unknown quantum state to the shared Bell pair, followed by H on Q0 to rotate into the Bell measurement basis.",
      stepGates: [
        { type: 'h', qubits: [0], step: 0 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 },
        { type: 'cx', qubits: [0, 1], step: 3 },
        { type: 'h', qubits: [0], step: 4 }
      ],
      commonMistakes: "Applying CNOT in reverse (Q1 as control and Q0 as target). This entangles backwards and scrambles Alice's input state."
    },
    {
      stepName: "Bell Measurement & State Rearrangement",
      equation: "= \\frac{1}{2}\\Big[|00\\rangle(\\alpha|0\\rangle+\\beta|1\\rangle) + |01\\rangle(\\alpha|1\\rangle+\\beta|0\\rangle) + |10\\rangle(\\alpha|0\\rangle-\\beta|1\\rangle) + |11\\rangle(\\alpha|1\\rangle-\\beta|0\\rangle)\\Big]",
      descriptionSimple: "Depending on Alice's 2-bit measurement outcome (00, 01, 10, or 11), Bob's qubit is in one of 4 known rotations of |ψ⟩.",
      descriptionTechnical: "Projection onto Alice's computational basis leaves Bob's qubit in state $X^{b} Z^{a} |\\psi\\rangle$.",
      gateRationale: "Measuring Q0 and Q1 collapses Alice's subsystem, leaving Bob's qubit correlated with her 2 classical measurement outcomes.",
      stepGates: [
        { type: 'h', qubits: [0], step: 0 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 },
        { type: 'cx', qubits: [0, 1], step: 3 },
        { type: 'h', qubits: [0], step: 4 },
        { type: 'measure', qubits: [0], step: 5 },
        { type: 'measure', qubits: [1], step: 5 }
      ],
      commonMistakes: "Believing Alice's measurement alone transmits data faster-than-light (FTL). Without the 2 classical bits sent to Bob, Bob's state is completely random mixed state."
    },
    {
      stepName: "Bob's Feedforward Correction",
      equation: "Z^{m_0} X^{m_1} |\\psi_B\\rangle = |\\psi\\rangle \\quad (\\text{Fidelity } F = 1.0)",
      descriptionSimple: "If Alice measures bit 1, Bob applies X (bit flip). If Alice measures bit 0, Bob applies Z (phase flip). Bob now has the exact state |ψ⟩!",
      descriptionTechnical: "Conditional unitary operations Pauli-$X$ and Pauli-$Z$ eliminate the Pauli byproduct operators, yielding exact fidelity $F = 1.0$.",
      gateRationale: "Bob applies Pauli-X if Q1 measured 1, and Pauli-Z if Q0 measured 1, fully undoing the rotation to recover Alice's original state |ψ⟩ with 100% fidelity.",
      stepGates: [
        { type: 'h', qubits: [0], step: 0 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [1, 2], step: 2 },
        { type: 'cx', qubits: [0, 1], step: 3 },
        { type: 'h', qubits: [0], step: 4 }
      ],
      commonMistakes: "Applying the corrections in the wrong order or applying them to Alice's qubits instead of Bob's qubit Q2."
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-dark-800 text-[11px]">Alice&apos;s Prepared State:</span>
        <div className="inline-flex rounded-lg border border-dark-200 p-0.5 bg-dark-50 gap-0.5">
          <button
            onClick={() => setStatePrep('plus')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statePrep === 'plus' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900 hover:bg-white'
            }`}
          >
            |+⟩ (H)
          </button>
          <button
            onClick={() => setStatePrep('one')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statePrep === 'one' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900 hover:bg-white'
            }`}
          >
            |1⟩ (X)
          </button>
          <button
            onClick={() => setStatePrep('t_state')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              statePrep === 't_state' ? 'bg-primary-600 text-white shadow-xs' : 'text-dark-700 hover:text-dark-900 hover:bg-white'
            }`}
          >
            T-State (H+T)
          </button>
        </div>
      </div>
      <span className="text-dark-500 font-mono text-[11px]">Q0: Msg | Q1: Alice Bell | Q2: Bob Target</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="teleportation"
      title="Quantum Teleportation"
      subtitle="Transfer arbitrary quantum states across arbitrary distances without moving the physical particle."
      category="Quantum Communication"
      qubitCount={3}
      speedup="Entanglement & Classical Feedforward"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="teleportation"
      defaultParams={{ state_prep: statePrep }}
      paramControls={paramControls}
    />
  );
}
