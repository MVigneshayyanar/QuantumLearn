import { GateType, PlacedGate } from './types';
import { simulateLocalCircuit, calculateStatevectorFidelity } from './quantum-simulator-core';

export interface BuildItChallenge {
  moduleSlug: string;
  title: string;
  objective: string;
  taskDescription: string;
  numQubits: number;
  scaffoldGates: PlacedGate[];
  solutionGates: PlacedGate[];
  checkerType: 'fidelity' | 'measurement';
  targetOutcome?: string;
  hints: string[];
}

export const BUILD_IT_CHALLENGES: Record<string, BuildItChallenge> = {
  'deutsch-jozsa': {
    moduleSlug: 'deutsch-jozsa',
    title: 'Construct the Deutsch-Jozsa Algorithm',
    objective: 'Build the complete quantum circuit to evaluate a balanced oracle f(x) = x using Phase Kickback.',
    taskDescription: '1. Initialize ancilla Qubit 1 to |1> with an X gate.\n2. Apply Hadamard gates on both Qubit 0 and Qubit 1 to create superposition.\n3. Apply the balanced oracle using a CNOT gate (Control: Q0, Target: Q1).\n4. Apply a final Hadamard gate on input Qubit 0 to cause interference.',
    numQubits: 2,
    scaffoldGates: [
      { id: 'scaffold-x1', type: 'x', qubits: [1], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-x1', type: 'x', qubits: [1], step: 0 },
      { id: 'sol-h0', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-h1', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-cx', type: 'cx', qubits: [0, 1], step: 2 },
      { id: 'sol-h0-final', type: 'h', qubits: [0], step: 3 }
    ],
    checkerType: 'measurement',
    targetOutcome: '11',
    hints: [
      'Remember that phase kickback requires the ancilla qubit (Q1) to be in the |-> eigenstate, which is created by X followed by H.',
      'The balanced oracle f(x)=x is implemented via CNOT with input Q0 as control and ancilla Q1 as target.',
      'Don’t forget the final Hadamard on Q0 to convert the kickback phase into computational basis measurement.'
    ]
  },
  'grover': {
    moduleSlug: 'grover',
    title: "Construct Grover's 2-Qubit Search",
    objective: 'Assemble the Oracle and Diffusion operators to amplify target state |11> to 100% probability.',
    taskDescription: '1. Apply Hadamard gates on Q0 and Q1 to create uniform superposition.\n2. Apply the Phase Oracle (CZ gate on Q0 and Q1) to mark |11> with a -1 phase.\n3. Apply the Grover Diffusion operator (H gates, then Z gates, then CZ, or H + X + CZ + X + H).',
    numQubits: 2,
    scaffoldGates: [
      { id: 'scaffold-h0', type: 'h', qubits: [0], step: 0 },
      { id: 'scaffold-h1', type: 'h', qubits: [1], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-h0', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-h1', type: 'h', qubits: [1], step: 0 },
      { id: 'sol-cz-oracle', type: 'cz', qubits: [0, 1], step: 1 },
      { id: 'sol-h0-diff', type: 'h', qubits: [0], step: 2 },
      { id: 'sol-h1-diff', type: 'h', qubits: [1], step: 2 },
      { id: 'sol-z0', type: 'z', qubits: [0], step: 3 },
      { id: 'sol-z1', type: 'z', qubits: [1], step: 3 },
      { id: 'sol-cz-diff', type: 'cz', qubits: [0, 1], step: 4 }
    ],
    checkerType: 'measurement',
    targetOutcome: '11',
    hints: [
      'Grover search requires two core components: an Oracle that inverts the phase of |11>, and a Diffusion operator that inverts amplitudes about the mean.',
      'A CZ gate acts directly as a phase oracle for |11> because it negates amplitude only when both qubits are 1.',
      'The diffusion operator can be written as H-layer, followed by reflection about |00>.'
    ]
  },
  'teleportation': {
    moduleSlug: 'teleportation',
    title: 'Construct Quantum Teleportation',
    objective: "Transmit an unknown state from Alice's Qubit 0 to Bob's Qubit 2 using shared entanglement.",
    taskDescription: "1. Create an entangled Bell pair between Qubit 1 (Alice) and Qubit 2 (Bob) using H(1) and CX(1, 2).\n2. Perform Bell Measurement on Alice's qubits: CX(0, 1) followed by H(0).\n3. Bob applies classical feedforward corrections (Z and X).",
    numQubits: 3,
    scaffoldGates: [
      { id: 'scaffold-prep', type: 'h', qubits: [0], step: 0 } // Prepare test state
    ],
    solutionGates: [
      { id: 'sol-prep', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-bell-h', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-bell-cx', type: 'cx', qubits: [1, 2], step: 2 },
      { id: 'sol-meas-cx', type: 'cx', qubits: [0, 1], step: 3 },
      { id: 'sol-meas-h', type: 'h', qubits: [0], step: 4 }
    ],
    checkerType: 'fidelity',
    hints: [
      'First establish the quantum communication channel: entangle Alice (Q1) and Bob (Q2) into a Bell pair.',
      'Alice then couples the message qubit (Q0) to her half of the Bell pair (Q1) with a CNOT, then rotates with Hadamard.',
      'Notice that physical particles do not travel — only quantum information is transferred via entanglement and classical correlations.'
    ]
  },
  'superdense-coding': {
    moduleSlug: 'superdense-coding',
    title: 'Construct Superdense Coding (2 Bits on 1 Qubit)',
    objective: 'Transmit 2 classical bits (message "11") using only 1 physical qubit transfer.',
    taskDescription: "1. Prepare a shared Bell pair |Φ+> on Q0 and Q1 using H(0) and CX(0, 1).\n2. Alice encodes the two bits (1, 1) by applying Z followed by X on Q0.\n3. Bob decodes the 2 bits by applying CX(0, 1) followed by H(0).",
    numQubits: 2,
    scaffoldGates: [
      { id: 'scaffold-h', type: 'h', qubits: [0], step: 0 },
      { id: 'scaffold-cx', type: 'cx', qubits: [0, 1], step: 1 }
    ],
    solutionGates: [
      { id: 'sol-h', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-cx', type: 'cx', qubits: [0, 1], step: 1 },
      { id: 'sol-z', type: 'z', qubits: [0], step: 2 },
      { id: 'sol-x', type: 'x', qubits: [0], step: 3 },
      { id: 'sol-dec-cx', type: 'cx', qubits: [0, 1], step: 4 },
      { id: 'sol-dec-h', type: 'h', qubits: [0], step: 5 }
    ],
    checkerType: 'measurement',
    targetOutcome: '11',
    hints: [
      'To transmit "11", Alice must apply both the Z gate (flips phase) and X gate (flips bit) onto her qubit Q0.',
      'Bob decodes Alice’s transmission by running the inverse Bell circuit: CNOT followed by Hadamard on Q0.',
      'Both bits are recovered deterministically from a single qubit transfer!'
    ]
  }
};

/**
 * Evaluates the user's Build It circuit.
 * Returns { isCorrect, fidelity, diagnosisPrompt }
 */
export function evaluateBuildItCircuit(
  challenge: BuildItChallenge,
  userGates: PlacedGate[]
): {
  isCorrect: boolean;
  fidelity: number;
  structuralDiff: string[];
  diagnosisPrompt: string;
} {
  const targetSim = simulateLocalCircuit(challenge.numQubits, challenge.solutionGates, 1024);
  const userSim = simulateLocalCircuit(challenge.numQubits, userGates, 1024);

  const fidelity = calculateStatevectorFidelity(targetSim.statevector, userSim.statevector);

  // Check structural differences for Socratic feedback
  const diffs: string[] = [];
  const targetGateTypes = challenge.solutionGates.map(g => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`);
  const userGateTypes = userGates.map(g => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`);

  // Detect missing gates
  for (const tg of targetGateTypes) {
    if (!userGateTypes.includes(tg)) {
      diffs.push(`Missing expected operation ${tg}`);
    }
  }

  // Detect unexpected gates
  for (const ug of userGateTypes) {
    if (!targetGateTypes.includes(ug)) {
      diffs.push(`Unexpected operation ${ug}`);
    }
  }

  const isCorrect = Boolean(
    fidelity >= 0.99 || (
      challenge.checkerType === 'measurement' &&
      challenge.targetOutcome &&
      (userSim.probabilities[challenge.targetOutcome] || 0) >= 0.90
    )
  );

  const diagnosisPrompt = `The student is working on the guided "Build It" challenge for "${challenge.title}".
Goal: ${challenge.objective}
Student's circuit gates: [${userGateTypes.join(', ') || 'empty'}]
Expected circuit gates: [${targetGateTypes.join(', ')}]
Observed Statevector Fidelity: ${(fidelity * 100).toFixed(1)}%
Structural differences noted: ${diffs.join('; ') || 'Equivalent gate count but incorrect parameter or order'}

Provide a Socratic, encouraging pedagogical hint to help the student understand what gate is misplaced or missing and why that physical operation is critical to the algorithm. DO NOT give them the direct full answer.`;

  return {
    isCorrect,
    fidelity,
    structuralDiff: diffs,
    diagnosisPrompt
  };
}
