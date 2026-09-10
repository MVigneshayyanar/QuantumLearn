import { GateType, PlacedGate } from './types';
import { simulateLocalCircuit, calculateStatevectorFidelity } from './quantum-simulator-core';

export interface BuildItMilestone {
  id: string;
  label: string;
  shortAction: string;
  simpleClue: string;
  requiredGateSignatures: string[];
  minStep?: number;
}

export interface EvaluatedMilestone extends BuildItMilestone {
  completed: boolean;
}

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
  milestones?: BuildItMilestone[];
}

export interface BuildItEvaluation {
  isCorrect: boolean;
  fidelity: number;
  completionPercentage: number;
  completedMilestonesCount: number;
  totalMilestones: number;
  milestones: EvaluatedMilestone[];
  matchedGates: string[];
  missingGates: string[];
  unexpectedGates: string[];
  structuralDiff: string[];
  diagnosisPrompt: string;
  nextActionSuggestion: string;
  currentClue: string;
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
      'Ancilla Q1 must be in |-> to kick back a -1 phase.',
      'The balanced oracle f(x)=x is a CNOT with control Q0 and target Q1.',
      'A final Hadamard on Q0 converts the phase kickback into measurable |1>.'
    ],
    milestones: [
      {
        id: 'ancilla-init',
        label: 'Ancilla Setup',
        shortAction: 'Place X gate on Q1',
        simpleClue: 'Prepares Q1 so Hadamard turns it into |−⟩.',
        requiredGateSignatures: ['X(Q1)'],
        minStep: 0
      },
      {
        id: 'superposition',
        label: 'Superposition',
        shortAction: 'Place H on Q0 and Q1',
        simpleClue: 'Puts both qubits into equal superposition.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 1
      },
      {
        id: 'balanced-oracle',
        label: 'CNOT Oracle',
        shortAction: 'Place CNOT from Q0 to Q1',
        simpleClue: 'Evaluates f(x) and kicks back a -1 phase to Q0.',
        requiredGateSignatures: ['CX(Q0,1)'],
        minStep: 2
      },
      {
        id: 'interference',
        label: 'Interference',
        shortAction: 'Place final H on Q0',
        simpleClue: 'Converts kickback phase into measurable state |1⟩.',
        requiredGateSignatures: ['H(Q0)'],
        minStep: 3
      }
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
      'Grover requires an Oracle (to mark |11>) and a Diffusion operator (to amplify it).',
      'CZ acts directly as the phase oracle for |11>.',
      'Diffusion inverts amplitudes about the mean.'
    ],
    milestones: [
      {
        id: 'uniform-superposition',
        label: 'Superposition',
        shortAction: 'Place H on Q0 and Q1',
        simpleClue: 'Creates equal superposition across all 4 states.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 0
      },
      {
        id: 'phase-oracle',
        label: 'Phase Oracle',
        shortAction: 'Place CZ gate between Q0 and Q1',
        simpleClue: 'CZ flips the phase of target |11⟩.',
        requiredGateSignatures: ['CZ(Q0,1)'],
        minStep: 1
      },
      {
        id: 'diffusion-basis',
        label: 'Diffusion H-Layer',
        shortAction: 'Place H on Q0 and Q1',
        simpleClue: 'Rotates states into the diffusion basis.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 2
      },
      {
        id: 'diffusion-reflection',
        label: 'Diffusion Inversion',
        shortAction: 'Place Z on Q0 & Q1, then CZ between them',
        simpleClue: 'Reflects amplitudes about the mean to amplify |11⟩.',
        requiredGateSignatures: ['Z(Q0)', 'Z(Q1)', 'CZ(Q0,1)'],
        minStep: 3
      }
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
      'Teleportation requires shared entanglement between Alice (Q1) and Bob (Q2).',
      'Alice performs Bell measurement by coupling Q0 to Q1 with CNOT, then H on Q0.',
      'Only quantum information travels — no physical particle is transferred.'
    ],
    milestones: [
      {
        id: 'message-prep',
        label: 'Message Prep',
        shortAction: 'Place H on Q0',
        simpleClue: 'Prepares the quantum test state to teleport.',
        requiredGateSignatures: ['H(Q0)'],
        minStep: 0
      },
      {
        id: 'bell-entanglement',
        label: 'Bell Entanglement',
        shortAction: 'Place H on Q1 and CNOT (Q1 -> Q2)',
        simpleClue: 'Creates shared entanglement between Alice & Bob.',
        requiredGateSignatures: ['H(Q1)', 'CX(Q1,2)'],
        minStep: 1
      },
      {
        id: 'bell-measurement',
        label: 'Bell Measurement',
        shortAction: 'Place CNOT (Q0 -> Q1) and H on Q0',
        simpleClue: 'Projects Alice’s qubits into the Bell basis.',
        requiredGateSignatures: ['CX(Q0,1)', 'H(Q0)'],
        minStep: 3
      }
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
      'To transmit "11", apply both Z (flips phase) and X (flips bit) to Q0.',
      'Bob decodes with inverse Bell: CNOT followed by Hadamard on Q0.',
      'Two classical bits are recovered from a single transferred qubit.'
    ],
    milestones: [
      {
        id: 'bell-pair-prep',
        label: 'Bell Pair',
        shortAction: 'Place H on Q0 and CNOT (Q0 -> Q1)',
        simpleClue: 'Prepares shared Bell state between Alice & Bob.',
        requiredGateSignatures: ['H(Q0)', 'CX(Q0,1)'],
        minStep: 0
      },
      {
        id: 'alice-encoding',
        label: '2-Bit Encoding',
        shortAction: 'Place Z then X on Q0',
        simpleClue: 'Encodes 2 classical bits ("11") into 1 qubit.',
        requiredGateSignatures: ['Z(Q0)', 'X(Q0)'],
        minStep: 2
      },
      {
        id: 'bob-decoding',
        label: 'Bell Decoding',
        shortAction: 'Place CNOT (Q0 -> Q1) and H on Q0',
        simpleClue: 'Decodes both transmitted bits deterministically.',
        requiredGateSignatures: ['CX(Q0,1)', 'H(Q0)'],
        minStep: 4
      }
    ]
  }
};

/**
 * Normalizes gate signature string for robust comparisons (e.g. CX(Q0,1) vs CX(0,1))
 */
function normalizeSig(s: string): string {
  return s.replace(/Q/g, '').replace(/\s+/g, '').toUpperCase();
}

/**
 * Evaluates the user's Build It circuit.
 * Returns { isCorrect, fidelity, completionPercentage, milestones, diagnosisPrompt, nextActionSuggestion, currentClue }
 */
export function evaluateBuildItCircuit(
  challenge: BuildItChallenge,
  userGates: PlacedGate[]
): BuildItEvaluation {
  const targetSim = simulateLocalCircuit(challenge.numQubits, challenge.solutionGates, 1024);
  const userSim = simulateLocalCircuit(challenge.numQubits, userGates, 1024);

  const fidelity = calculateStatevectorFidelity(targetSim.statevector, userSim.statevector);

  const targetGateTypes = challenge.solutionGates.map(g => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`);
  const userGateTypes = userGates.map(g => `${g.type.toUpperCase()}(Q${g.qubits.join(',')})`);

  // Detect matched, missing, and unexpected gates
  const matchedGates = targetGateTypes.filter(tg => userGateTypes.some(ug => normalizeSig(ug) === normalizeSig(tg)));
  const missingGates = targetGateTypes.filter(tg => !userGateTypes.some(ug => normalizeSig(ug) === normalizeSig(tg)));
  const unexpectedGates = userGateTypes.filter(ug => !targetGateTypes.some(tg => normalizeSig(tg) === normalizeSig(ug)));

  const diffs: string[] = [];
  for (const mg of missingGates) {
    diffs.push(`Missing ${mg}`);
  }
  for (const ug of unexpectedGates) {
    diffs.push(`Unexpected ${ug}`);
  }

  const isCorrect = Boolean(
    fidelity >= 0.99 || (
      challenge.checkerType === 'measurement' &&
      challenge.targetOutcome &&
      (userSim.probabilities[challenge.targetOutcome] || 0) >= 0.90
    )
  );

  // Evaluate milestones sequentially
  const defaultMilestones: BuildItMilestone[] = [
    {
      id: 'core-construction',
      label: 'Circuit Assembly',
      shortAction: 'Place the remaining required gates',
      simpleClue: 'Follow the algorithm workflow step by step.',
      requiredGateSignatures: targetGateTypes
    }
  ];

  const challengeMilestones = (challenge.milestones && challenge.milestones.length > 0)
    ? challenge.milestones
    : defaultMilestones;

  let priorMilestonesCompleted = true;
  const evaluatedMilestones: EvaluatedMilestone[] = challengeMilestones.map((m, index) => {
    // If prior stage is incomplete, later sequential stages cannot be marked complete
    if (!priorMilestonesCompleted) {
      return {
        ...m,
        completed: false
      };
    }

    const minStep = m.minStep ?? index;
    const isDone = m.requiredGateSignatures.every(req =>
      userGates.some(ug => {
        const sig = `${ug.type.toUpperCase()}(Q${ug.qubits.join(',')})`;
        return normalizeSig(sig) === normalizeSig(req) && ug.step >= minStep;
      })
    );

    if (!isDone) {
      priorMilestonesCompleted = false;
    }

    return {
      ...m,
      completed: isDone
    };
  });

  const completedMilestonesCount = evaluatedMilestones.filter(m => m.completed).length;
  const totalMilestones = evaluatedMilestones.length;

  // Calculate completion percentage
  let completionPercentage: number;
  if (isCorrect) {
    completionPercentage = 100;
  } else if (userGates.length === 0) {
    completionPercentage = 0;
  } else {
    const milestoneRatio = totalMilestones > 0 ? (completedMilestonesCount / totalMilestones) : 0;
    const gateRatio = targetGateTypes.length > 0 ? (matchedGates.length / targetGateTypes.length) : 0;
    let rawPct = Math.round((milestoneRatio * 0.75 + gateRatio * 0.25) * 100);
    if (rawPct < 15 && (matchedGates.length > 0 || completedMilestonesCount > 0)) {
      rawPct = 25;
    }
    completionPercentage = Math.min(95, Math.max(5, rawPct));
  }

  // Determine next action suggestion & clue based on first incomplete milestone
  const firstIncomplete = evaluatedMilestones.find(m => !m.completed);
  let nextActionSuggestion = 'Place the next required quantum gate.';
  let currentClue = challenge.hints[0] || 'Review the state transformation for the next step.';

  if (firstIncomplete) {
    nextActionSuggestion = firstIncomplete.shortAction || firstIncomplete.label;
    currentClue = firstIncomplete.simpleClue || currentClue;
  } else if (!isCorrect) {
    nextActionSuggestion = 'All gates present! Verify their sequential step order on the wire timeline.';
    currentClue = 'Double-check which column (step) each gate occupies.';
  }

  const diagnosisPrompt = `Challenge: "${challenge.title}"
Progress: ${completionPercentage}% (${completedMilestonesCount}/${totalMilestones} steps)
Placed: [${userGateTypes.join(', ') || 'empty'}]
Expected: [${targetGateTypes.join(', ')}]
Next Step: "${nextActionSuggestion}"

REQUIREMENT: Return 3 SHORT lines (max 40 words total):
• Step Done: <what is done>
• Next Step: <next gate to place>
• Quick Clue: <1 simple clue>`;

  return {
    isCorrect,
    fidelity,
    completionPercentage,
    completedMilestonesCount,
    totalMilestones,
    milestones: evaluatedMilestones,
    matchedGates,
    missingGates,
    unexpectedGates,
    structuralDiff: diffs,
    diagnosisPrompt,
    nextActionSuggestion,
    currentClue
  };
}
