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
    objective: 'Build the complete quantum circuit to evaluate a balanced oracle $f(x) = x$ using Phase Kickback.',
    taskDescription: '1. Initialize ancilla Qubit 1 to $|1\\rangle$ to prepare for phase kickback.\n2. Create equal superposition across both registers.\n3. Apply the balanced oracle querying $f(x) = x$.\n4. Apply interference on the input register to cause destructive cancellation.',
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
      'Ancilla $Q_1$ must be in $|-\\rangle$ to kick back a $-1$ phase.',
      'The balanced oracle $f(x)=x$ flips the target conditioned on $Q_0$.',
      'Interference on $Q_0$ converts the relative phase into a deterministic computational measurement of $|1\\rangle$.'
    ],
    milestones: [
      {
        id: 'ancilla-init',
        label: 'Ancilla Setup',
        shortAction: 'Initialize ancilla for phase kickback',
        simpleClue: 'Which state must the ancilla hold so a subsequent rotation creates $|-\\rangle$?',
        requiredGateSignatures: ['X(Q1)'],
        minStep: 0
      },
      {
        id: 'superposition',
        label: 'Superposition',
        shortAction: 'Synthesize equal superposition across both registers',
        simpleClue: 'Which single-qubit unitary rotates computational ground states into a balanced linear combination?',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 1
      },
      {
        id: 'balanced-oracle',
        label: 'CNOT Oracle',
        shortAction: 'Query the balanced oracle mapping',
        simpleClue: 'How can the input register flip the ancilla conditioned on $f(x) = x$ to trigger kickback?',
        requiredGateSignatures: ['CX(Q0,1)'],
        minStep: 2
      },
      {
        id: 'interference',
        label: 'Interference',
        shortAction: 'Convert phase difference into computational interference',
        simpleClue: 'What unitary maps the relative phase shift back to a deterministic measurable basis state?',
        requiredGateSignatures: ['H(Q0)'],
        minStep: 3
      }
    ]
  },
  'grover': {
    moduleSlug: 'grover',
    title: "Construct Grover's 2-Qubit Search",
    objective: 'Assemble the Oracle and Diffusion operators to amplify target state $|11\\rangle$ to 100% probability.',
    taskDescription: '1. Create uniform superposition across the 2-qubit register.\n2. Apply the Phase Oracle to mark $|11\\rangle$ with a $\\pi$ phase shift.\n3. Apply the Grover Diffusion operator to invert amplitudes about the mean.',
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
      'Grover requires an Oracle (to mark $|11\\rangle$) and a Diffusion operator (to amplify it).',
      'A controlled phase operation flips only the state where both control and target are active.',
      'Diffusion inverts all amplitudes about the average mean amplitude.'
    ],
    milestones: [
      {
        id: 'uniform-superposition',
        label: 'Superposition',
        shortAction: 'Initialize uniform database state space',
        simpleClue: 'Consider which gate prepares all 4 basis states with equal probability amplitude.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 0
      },
      {
        id: 'phase-oracle',
        label: 'Phase Oracle',
        shortAction: 'Mark the target state with a phase inversion',
        simpleClue: 'What 2-qubit controlled phase transformation inverts only the amplitude of target $|11\\rangle$?',
        requiredGateSignatures: ['CZ(Q0,1)'],
        minStep: 1
      },
      {
        id: 'diffusion-basis',
        label: 'Diffusion H-Layer',
        shortAction: 'Transform register into the diffusion basis',
        simpleClue: 'Which unitary rotates the state space so reflection about $|00\\rangle$ becomes reflection about $|s\\rangle$?',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 2
      },
      {
        id: 'diffusion-reflection',
        label: 'Diffusion Inversion',
        shortAction: 'Apply reflection about the mean',
        simpleClue: 'Synthesize the conditional phase shift around the uniform state to amplify the marked target.',
        requiredGateSignatures: ['Z(Q0)', 'Z(Q1)', 'CZ(Q0,1)'],
        minStep: 3
      }
    ]
  },
  'teleportation': {
    moduleSlug: 'teleportation',
    title: 'Construct Quantum Teleportation',
    objective: "Transmit an unknown state from Alice's $Q_0$ to Bob's $Q_2$ using shared entanglement.",
    taskDescription: "1. Create an entangled Bell pair between $Q_1$ (Alice) and $Q_2$ (Bob).\n2. Perform Bell Measurement on Alice's qubits: couple $Q_0$ to $Q_1$ and rotate $Q_0$.\n3. Bob applies feedforward unitary corrections.",
    numQubits: 3,
    scaffoldGates: [
      { id: 'scaffold-prep', type: 'h', qubits: [0], step: 0 }
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
      'Teleportation requires shared entanglement between Alice ($Q_1$) and Bob ($Q_2$).',
      'Alice performs Bell measurement by coupling $Q_0$ to $Q_1$ with CNOT, then applying $H$ on $Q_0$.',
      'Only quantum information travels — no physical matter is transferred.'
    ],
    milestones: [
      {
        id: 'message-prep',
        label: 'Message Prep',
        shortAction: 'Prepare the input quantum state to teleport',
        simpleClue: 'Synthesize a coherent test state on Alice’s source qubit $Q_0$.',
        requiredGateSignatures: ['H(Q0)'],
        minStep: 0
      },
      {
        id: 'bell-entanglement',
        label: 'Bell Entanglement',
        shortAction: 'Establish shared Bell pair entanglement',
        simpleClue: 'How do you construct the maximally entangled channel $|\\Phi^+\\rangle$ between Alice ($Q_1$) and Bob ($Q_2$)?',
        requiredGateSignatures: ['H(Q1)', 'CX(Q1,2)'],
        minStep: 1
      },
      {
        id: 'bell-measurement',
        label: 'Bell Measurement',
        shortAction: 'Perform Bell basis measurement coupling',
        simpleClue: 'How can Alice project her joint 2-qubit register onto the Bell measurement basis?',
        requiredGateSignatures: ['CX(Q0,1)', 'H(Q0)'],
        minStep: 3
      }
    ]
  },
  'superdense-coding': {
    moduleSlug: 'superdense-coding',
    title: 'Construct Superdense Coding (2 Bits on 1 Qubit)',
    objective: 'Transmit 2 classical bits (message "11") using only 1 physical qubit transfer.',
    taskDescription: "1. Prepare a shared Bell pair $|\\Phi^+\\rangle$ on $Q_0$ and $Q_1$.\n2. Alice encodes two classical bits $(1, 1)$ with single-qubit unitaries on $Q_0$.\n3. Bob decodes both bits deterministically by inverting the Bell entanglement.",
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
      'To transmit "11", apply both phase-flip and bit-flip unitaries to $Q_0$.',
      'Bob decodes with the inverse Bell circuit: CNOT followed by Hadamard on $Q_0$.',
      'Two classical bits are recovered with 100% fidelity from a single transferred qubit.'
    ],
    milestones: [
      {
        id: 'bell-pair-prep',
        label: 'Bell Pair',
        shortAction: 'Construct the shared EPR quantum link',
        simpleClue: 'What circuit creates the entangled Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$?',
        requiredGateSignatures: ['H(Q0)', 'CX(Q0,1)'],
        minStep: 0
      },
      {
        id: 'alice-encoding',
        label: '2-Bit Encoding',
        shortAction: 'Encode classical message into local quantum operations',
        simpleClue: 'Which combination of bit-flip and phase-flip operations maps $|\\Phi^+\\rangle$ to the target message state?',
        requiredGateSignatures: ['Z(Q0)', 'X(Q0)'],
        minStep: 2
      },
      {
        id: 'bob-decoding',
        label: 'Bell Decoding',
        shortAction: 'Invert the Bell state for deterministic decoding',
        simpleClue: 'How does Bob reverse the entanglement transformation to read out both bits with certainty?',
        requiredGateSignatures: ['CX(Q0,1)', 'H(Q0)'],
        minStep: 4
      }
    ]
  },
  'qft': {
    moduleSlug: 'qft',
    title: 'Construct the Quantum Fourier Transform',
    objective: 'Synthesize the 3-qubit QFT circuit mapping computational basis states to Fourier relative phases.',
    taskDescription: '1. Apply Hadamard on Qubit 0, followed by controlled phase rotations from Q1 and Q2.\n2. Apply Hadamard on Qubit 1 and controlled phase rotation from Q2.\n3. Apply Hadamard on Qubit 2.\n4. Complete the transform with a SWAP gate between Q0 and Q2.',
    numQubits: 3,
    scaffoldGates: [
      { id: 'scaffold-h0', type: 'h', qubits: [0], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-h0', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-s0', type: 's', qubits: [0], step: 1 },
      { id: 'sol-cz01', type: 'cz', qubits: [0, 1], step: 2 },
      { id: 'sol-h1', type: 'h', qubits: [1], step: 3 },
      { id: 'sol-s1', type: 's', qubits: [1], step: 4 },
      { id: 'sol-cz12', type: 'cz', qubits: [1, 2], step: 5 },
      { id: 'sol-h2', type: 'h', qubits: [2], step: 6 },
      { id: 'sol-swap', type: 'swap', qubits: [0, 2], step: 7 }
    ],
    checkerType: 'fidelity',
    hints: [
      'Each qubit requires a Hadamard followed by successively smaller controlled phase rotations.',
      'Controlled phase gates couple each qubit to subsequent qubits.',
      'A final SWAP gate reverses qubit ordering to match standard binary frequency order.'
    ],
    milestones: [
      {
        id: 'qft-q0-hadamard',
        label: 'Hadamard Q0',
        shortAction: 'Initialize first Fourier register stage',
        simpleClue: 'Which single-qubit gate creates the equal superposition foundation on Q0?',
        requiredGateSignatures: ['H(Q0)'],
        minStep: 0
      },
      {
        id: 'qft-phase-rotations',
        label: 'Entangling Rotations',
        shortAction: 'Apply controlled phase interactions between qubits',
        simpleClue: 'Apply the controlled phase operations coupling Q0, Q1, and Q2.',
        requiredGateSignatures: ['CZ(Q0,1)', 'CZ(Q1,2)'],
        minStep: 2
      },
      {
        id: 'qft-qubit-reversal',
        label: 'Register Reversal',
        shortAction: 'Reorder qubits to restore conventional bit-significance order',
        simpleClue: 'What gate exchanges Q0 and Q2 to finish the Fourier transform?',
        requiredGateSignatures: ['SWAP(Q0,2)'],
        minStep: 7
      }
    ]
  },
  'quantum-phase-estimation': {
    moduleSlug: 'quantum-phase-estimation',
    title: 'Construct Quantum Phase Estimation',
    objective: 'Extract the eigenphase eigenvalue of a unitary operator into a 2-qubit measurement register.',
    taskDescription: '1. Prepare the target qubit in eigenstate |1⟩.\n2. Create equal superposition across counting qubits Q0 and Q1.\n3. Apply controlled unitary operations with powers 2⁰ and 2¹.\n4. Apply the inverse QFT on the counting register to read out the phase.',
    numQubits: 3,
    scaffoldGates: [
      { id: 'scaffold-prep', type: 'x', qubits: [2], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-x', type: 'x', qubits: [2], step: 0 },
      { id: 'sol-h0', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-h1', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-cu1', type: 'cz', qubits: [1, 2], step: 2 },
      { id: 'sol-cu2', type: 'cz', qubits: [0, 2], step: 3 },
      { id: 'sol-iqft-h0', type: 'h', qubits: [0], step: 4 },
      { id: 'sol-iqft-cz', type: 'cz', qubits: [0, 1], step: 5 },
      { id: 'sol-iqft-h1', type: 'h', qubits: [1], step: 6 },
      { id: 'sol-iqft-swap', type: 'swap', qubits: [0, 1], step: 7 }
    ],
    checkerType: 'measurement',
    targetOutcome: '11',
    hints: [
      'The target register must start in an eigenstate of the unitary U.',
      'Controlled-U operations imprint powers of the phase 2^k θ onto the counting qubits.',
      'Inverse QFT converts the geometric phase rotations into computational basis binary fractions.'
    ],
    milestones: [
      {
        id: 'qpe-target-eigenstate',
        label: 'Eigenstate Prep',
        shortAction: 'Initialize target qubit into an eigenstate',
        simpleClue: 'Which gate flips Q2 from |0⟩ into computational eigenstate |1⟩?',
        requiredGateSignatures: ['X(Q2)'],
        minStep: 0
      },
      {
        id: 'qpe-counting-superposition',
        label: 'Counting Superposition',
        shortAction: 'Put counting register into uniform superposition',
        simpleClue: 'Which parallel gates create equal amplitude over Q0 and Q1?',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 1
      },
      {
        id: 'qpe-controlled-u',
        label: 'Controlled Powers',
        shortAction: 'Apply controlled unitary gates onto target qubit',
        simpleClue: 'Apply the controlled phase operations that imprint the phase onto counting qubits.',
        requiredGateSignatures: ['CZ(Q1,2)', 'CZ(Q0,2)'],
        minStep: 2
      },
      {
        id: 'qpe-iqft-readout',
        label: 'Inverse QFT',
        shortAction: 'Interferometrically decode phase into binary readout',
        simpleClue: 'Invert the Fourier transformation across the counting register.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)', 'SWAP(Q0,1)'],
        minStep: 4
      }
    ]
  },
  'shor': {
    moduleSlug: 'shor',
    title: "Construct Shor's Period Finding Circuit",
    objective: 'Implement quantum order finding for modular exponentiation to extract the period r of a coprime base.',
    taskDescription: '1. Prepare target register in state |1⟩ (Q3).\n2. Place control qubits Q0 and Q1 into equal superposition.\n3. Apply modular multiplication oracle operations.\n4. Apply inverse QFT to control register to detect the interference peaks.',
    numQubits: 4,
    scaffoldGates: [
      { id: 'scaffold-sh-x', type: 'x', qubits: [3], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-sh-x', type: 'x', qubits: [3], step: 0 },
      { id: 'sol-sh-h0', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-sh-h1', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-sh-cx1', type: 'cx', qubits: [1, 2], step: 2 },
      { id: 'sol-sh-cx2', type: 'cx', qubits: [0, 3], step: 3 },
      { id: 'sol-sh-h0-iqft', type: 'h', qubits: [0], step: 4 },
      { id: 'sol-sh-cz', type: 'cz', qubits: [0, 1], step: 5 },
      { id: 'sol-sh-h1-iqft', type: 'h', qubits: [1], step: 6 },
      { id: 'sol-sh-swap', type: 'swap', qubits: [0, 1], step: 7 }
    ],
    checkerType: 'measurement',
    targetOutcome: '10',
    hints: [
      'The modular multiplication register starts in identity state |1⟩.',
      'Control qubits evaluate a superposition of powers a^x mod N.',
      'Constructive interference in the inverse QFT isolates multiples of 1/r.'
    ],
    milestones: [
      {
        id: 'shor-target-init',
        label: 'Target Init',
        shortAction: 'Initialize modular register to |1⟩',
        simpleClue: 'Which gate prepares the target register in computational basis state |0...01⟩?',
        requiredGateSignatures: ['X(Q3)'],
        minStep: 0
      },
      {
        id: 'shor-control-superposition',
        label: 'Control Superposition',
        shortAction: 'Prepare control register in equal superposition',
        simpleClue: 'Which gates create the simultaneous evaluation register over all powers x?',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 1
      },
      {
        id: 'shor-modular-oracle',
        label: 'Modular Oracle',
        shortAction: 'Apply controlled modular multiplication',
        simpleClue: 'Couple the control register to target bits via entangling CNOT operations.',
        requiredGateSignatures: ['CX(Q1,2)', 'CX(Q0,3)'],
        minStep: 2
      },
      {
        id: 'shor-period-readout',
        label: 'Period Readout',
        shortAction: 'Inverse QFT on control register',
        simpleClue: 'Apply the inverse Fourier transform to extract the peak frequencies yielding period r.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)', 'SWAP(Q0,1)'],
        minStep: 4
      }
    ]
  },
  'vqe': {
    moduleSlug: 'vqe',
    title: 'Construct the Variational Quantum Eigensolver (VQE)',
    objective: 'Build a parameterized molecular ansatz to find the ground state energy eigenvalue of a 2-qubit Hamiltonian.',
    taskDescription: '1. Prepare Hartree-Fock reference state |10⟩.\n2. Apply parameterized rotation gates (Hadamard/R_y layers).\n3. Apply entangling CNOT to model electron correlation.\n4. Apply variational phase tuning and final entangling readout.',
    numQubits: 2,
    scaffoldGates: [
      { id: 'scaffold-vqe-hf', type: 'x', qubits: [0], step: 0 }
    ],
    solutionGates: [
      { id: 'sol-vqe-hf', type: 'x', qubits: [0], step: 0 },
      { id: 'sol-vqe-h0', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-vqe-h1', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-vqe-cx1', type: 'cx', qubits: [0, 1], step: 2 },
      { id: 'sol-vqe-z0', type: 'z', qubits: [0], step: 3 },
      { id: 'sol-vqe-s1', type: 's', qubits: [1], step: 3 },
      { id: 'sol-vqe-cx2', type: 'cx', qubits: [0, 1], step: 4 }
    ],
    checkerType: 'fidelity',
    hints: [
      'Hartree-Fock initialization prepares the closest classical mean-field electron configuration.',
      'Single-qubit rotation layers generate variational parameter freedom.',
      'Entangling CNOT gates create the quantum electron correlation that classical computers struggle to simulate.'
    ],
    milestones: [
      {
        id: 'vqe-hartree-fock',
        label: 'Hartree-Fock State',
        shortAction: 'Initialize reference electronic configuration',
        simpleClue: 'Which gate flips Q0 to establish the reference electronic occupation state |10⟩?',
        requiredGateSignatures: ['X(Q0)'],
        minStep: 0
      },
      {
        id: 'vqe-ansatz-superposition',
        label: 'Variational Layers',
        shortAction: 'Apply parameterized single-qubit rotations',
        simpleClue: 'Rotate both qubits into coherent superposition.',
        requiredGateSignatures: ['H(Q0)', 'H(Q1)'],
        minStep: 1
      },
      {
        id: 'vqe-electron-entanglement',
        label: 'Correlation Entangler',
        shortAction: 'Entangle electron orbitals via CNOT',
        simpleClue: 'Which 2-qubit unitary creates quantum entanglement between both molecular orbitals?',
        requiredGateSignatures: ['CX(Q0,1)'],
        minStep: 2
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

  const completedMilestoneLabels = evaluatedMilestones.filter(m => m.completed).map(m => m.label).join(', ') || 'Initial scaffold';
  const nextMilestone = firstIncomplete?.label || 'Final Verification';

  const diagnosisPrompt = `Challenge: "${challenge.title}"
Progress: ${completionPercentage}% (${completedMilestonesCount}/${totalMilestones} milestones completed)
Current Stage Reached: ${completedMilestoneLabels}
Target Milestone: "${nextMilestone}"
Conceptual Target: "${nextActionSuggestion}"
Socratic Inquiry: "${currentClue}"

PEDAGOGICAL REQUIREMENT: Socratic coaching only.
NEVER name any gate (do NOT mention H, X, CNOT, CZ, etc.) or wire index.
Return 3 SHORT lines (max 50 words total):
• Progress: <physical state achieved>
• Quantum Concept: <physical transformation needed next>
• Socratic Clue: <inquiry question guiding learner to deduce the unitary matrix>`;

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
