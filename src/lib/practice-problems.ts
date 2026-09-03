import { GateType, PlacedGate, SimulationResult } from './types';
import { simulateLocalCircuit, calculateStatevectorFidelity } from './quantum-simulator-core';

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  category: string;
  moduleSlug: string;
  description: string;
  task: string;
  numQubits: number;
  allowedGates: GateType[];
  maxGates?: number;
  checkerType: 'fidelity' | 'measurement_probability';
  targetStatevector?: { re: number; im: number }[];
  targetOutcome?: { basis: string; minProbability: number };
  sampleSolutionGates: PlacedGate[];
  hintsDisabled: true; // Explicit confirmation that hints/AI are strictly disabled
}

export interface SubmissionVerdict {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'INVALID_CIRCUIT';
  message: string;
  fidelity?: number;
  measuredProbability?: number;
  targetProbability?: number;
  executionTimeMs: number;
}

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'prob-superposition',
    title: 'Equal Superposition State',
    difficulty: 'Easy',
    category: 'Quantum Parallelism',
    moduleSlug: 'deutsch-jozsa',
    description: 'Prepare a 1-qubit system into an equal superposition state $|+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$ starting from $|0\\rangle$.',
    task: 'Apply the appropriate quantum gate on Qubit 0 so that measuring in the computational basis yields a 50% chance of 0 and a 50% chance of 1.',
    numQubits: 1,
    allowedGates: ['h', 'x', 'z'],
    maxGates: 3,
    checkerType: 'fidelity',
    targetStatevector: [
      { re: 1 / Math.SQRT2, im: 0 },
      { re: 1 / Math.SQRT2, im: 0 }
    ],
    sampleSolutionGates: [
      { id: 'sol-1', type: 'h', qubits: [0], step: 0 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-bit-and-phase-flip',
    title: 'Combined Bit and Phase Flip',
    difficulty: 'Easy',
    category: 'Single-Qubit Operations',
    moduleSlug: 'deutsch-jozsa',
    description: 'Starting from $|0\\rangle$, map the qubit state to $-|1\\rangle$.',
    task: 'Find the gate sequence that transforms $|0\\rangle$ into $|1\\rangle$ with an overall negative phase $(-1)$.',
    numQubits: 1,
    allowedGates: ['x', 'z', 'y', 'h', 's', 't'],
    maxGates: 4,
    checkerType: 'fidelity',
    targetStatevector: [
      { re: 0, im: 0 },
      { re: -1, im: 0 }
    ],
    sampleSolutionGates: [
      { id: 'sol-1', type: 'x', qubits: [0], step: 0 },
      { id: 'sol-2', type: 'z', qubits: [0], step: 1 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-bell-state',
    title: 'Maximally Entangled Bell Pair |Φ+⟩',
    difficulty: 'Medium',
    category: 'Quantum Entanglement',
    moduleSlug: 'teleportation',
    description: 'Construct the canonical Bell state $|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$ on 2 qubits initialized to $|00\\rangle$.',
    task: 'Use a Hadamard and a two-qubit entangling gate (CNOT) to create perfect quantum correlation where measuring one qubit determines the other.',
    numQubits: 2,
    allowedGates: ['h', 'cx', 'x', 'z'],
    maxGates: 4,
    checkerType: 'fidelity',
    targetStatevector: [
      { re: 1 / Math.SQRT2, im: 0 },
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 1 / Math.SQRT2, im: 0 }
    ],
    sampleSolutionGates: [
      { id: 'sol-1', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-2', type: 'cx', qubits: [0, 1], step: 1 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-bell-psi-minus',
    title: 'Singlet State |Ψ-⟩ Generation',
    difficulty: 'Medium',
    category: 'Quantum Entanglement',
    moduleSlug: 'teleportation',
    description: 'Prepare the antisymmetric singlet state $|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)$ starting from $|00\\rangle$.',
    task: 'Combine Pauli flips and a Bell creator circuit to reach the singlet subspace with negative relative phase.',
    numQubits: 2,
    allowedGates: ['h', 'x', 'z', 'cx'],
    maxGates: 6,
    checkerType: 'fidelity',
    targetStatevector: [
      { re: 0, im: 0 },
      { re: 1 / Math.SQRT2, im: 0 },
      { re: -1 / Math.SQRT2, im: 0 },
      { re: 0, im: 0 }
    ],
    sampleSolutionGates: [
      { id: 'sol-1', type: 'x', qubits: [0], step: 0 },
      { id: 'sol-2', type: 'x', qubits: [1], step: 0 },
      { id: 'sol-3', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-4', type: 'cx', qubits: [0, 1], step: 2 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-deutsch-jozsa-balanced',
    title: 'Deutsch-Jozsa Balanced Oracle Discrimination',
    difficulty: 'Hard',
    category: 'Quantum Parallelism',
    moduleSlug: 'deutsch-jozsa',
    description: 'Implement the Deutsch-Jozsa algorithm for the balanced oracle $f(x) = x$ (represented by a CNOT from input Q0 to ancilla Q1).',
    task: 'Initialize Q1 in $|-\\rangle$, put Q0 in superposition, evaluate the oracle with CNOT, and apply interference so that measuring Q0 gives $|1\\rangle$ with 100% confidence.',
    numQubits: 2,
    allowedGates: ['h', 'x', 'cx', 'measure'],
    maxGates: 6,
    checkerType: 'measurement_probability',
    targetOutcome: { basis: '11', minProbability: 0.95 },
    sampleSolutionGates: [
      { id: 'sol-1', type: 'x', qubits: [1], step: 0 },
      { id: 'sol-2', type: 'h', qubits: [0], step: 1 },
      { id: 'sol-3', type: 'h', qubits: [1], step: 1 },
      { id: 'sol-4', type: 'cx', qubits: [0, 1], step: 2 },
      { id: 'sol-5', type: 'h', qubits: [0], step: 3 },
      { id: 'sol-6', type: 'measure', qubits: [0], step: 4 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-grover-search',
    title: "Grover's 2-Qubit Search for |11⟩",
    difficulty: 'Hard',
    category: 'Amplitude Amplification',
    moduleSlug: 'grover',
    description: "Implement a 2-qubit Grover Search circuit to find the marked database entry $|11\\rangle$.",
    task: "Put qubits into equal superposition, apply the phase oracle (CZ gate for $|11\\rangle$), and apply the 2-qubit Grover Diffusion Operator to amplify $|11\\rangle$ to 100% probability.",
    numQubits: 2,
    allowedGates: ['h', 'x', 'z', 'cz', 'measure'],
    maxGates: 8,
    checkerType: 'measurement_probability',
    targetOutcome: { basis: '11', minProbability: 0.95 },
    sampleSolutionGates: [
      { id: 'sol-1', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-2', type: 'h', qubits: [1], step: 0 },
      { id: 'sol-3', type: 'cz', qubits: [0, 1], step: 1 },
      { id: 'sol-4', type: 'h', qubits: [0], step: 2 },
      { id: 'sol-5', type: 'h', qubits: [1], step: 2 },
      { id: 'sol-6', type: 'z', qubits: [0], step: 3 },
      { id: 'sol-7', type: 'z', qubits: [1], step: 3 },
      { id: 'sol-8', type: 'cz', qubits: [0, 1], step: 4 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-swap-cnot',
    title: 'Swap Protocol via 3 CNOT Gates',
    difficulty: 'Medium',
    category: 'Circuit Identities',
    moduleSlug: 'superdense-coding',
    description: 'Exchange the quantum states of two qubits WITHOUT using the SWAP gate.',
    task: 'Use exactly three alternating CNOT gates (CX(0,1), CX(1,0), CX(0,1)) to swap the states of Qubit 0 and Qubit 1.',
    numQubits: 2,
    allowedGates: ['cx', 'x'],
    maxGates: 5,
    checkerType: 'fidelity',
    targetStatevector: [
      { re: 0, im: 0 },
      { re: 0, im: 0 },
      { re: 1, im: 0 },
      { re: 0, im: 0 }
    ],
    sampleSolutionGates: [
      { id: 'sol-0', type: 'x', qubits: [0], step: 0 },
      { id: 'sol-1', type: 'cx', qubits: [0, 1], step: 1 },
      { id: 'sol-2', type: 'cx', qubits: [1, 0], step: 2 },
      { id: 'sol-3', type: 'cx', qubits: [0, 1], step: 3 }
    ],
    hintsDisabled: true
  },
  {
    id: 'prob-superdense-encode',
    title: 'Superdense Coding: 2-Bit Transmission',
    difficulty: 'Hard',
    category: 'Quantum Communication',
    moduleSlug: 'superdense-coding',
    description: 'Encode classical bits (1, 1) using Alice’s local unitary on an entangled Bell pair and verify Bob can decode it with 100% certainty.',
    task: 'Create Bell pair $|\\Phi^+\\rangle$, apply $Z$ then $X$ on Qubit 0, and run Bob’s decoding (CNOT followed by Hadamard on Q0).',
    numQubits: 2,
    allowedGates: ['h', 'x', 'z', 'cx'],
    maxGates: 7,
    checkerType: 'measurement_probability',
    targetOutcome: { basis: '11', minProbability: 0.95 },
    sampleSolutionGates: [
      { id: 'sol-1', type: 'h', qubits: [0], step: 0 },
      { id: 'sol-2', type: 'cx', qubits: [0, 1], step: 1 },
      { id: 'sol-3', type: 'z', qubits: [0], step: 2 },
      { id: 'sol-4', type: 'x', qubits: [0], step: 3 },
      { id: 'sol-5', type: 'cx', qubits: [0, 1], step: 4 },
      { id: 'sol-6', type: 'h', qubits: [0], step: 5 }
    ],
    hintsDisabled: true
  }
];

/**
 * Strict, deterministic automated judge:
 * - NO AI hints or partial credit.
 * - Pure simulation evaluation against fidelity or outcome probability.
 */
export function evaluatePracticeSubmission(
  problem: PracticeProblem,
  submittedQubits: number,
  submittedGates: PlacedGate[]
): SubmissionVerdict {
  const startTime = performance.now();

  // 1. Constraint checks
  if (submittedQubits !== problem.numQubits) {
    return {
      status: 'INVALID_CIRCUIT',
      message: `Invalid qubit count: circuit has ${submittedQubits} qubit(s), but problem requires exactly ${problem.numQubits}.`,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  if (submittedGates.length === 0) {
    return {
      status: 'INVALID_CIRCUIT',
      message: 'Circuit is empty. Place gates to construct the solution.',
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  if (problem.maxGates && submittedGates.length > problem.maxGates) {
    return {
      status: 'INVALID_CIRCUIT',
      message: `Gate count violation: used ${submittedGates.length} gates (max allowed: ${problem.maxGates}).`,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Check gate types
  for (const g of submittedGates) {
    if (!problem.allowedGates.includes(g.type)) {
      return {
        status: 'INVALID_CIRCUIT',
        message: `Disallowed gate "${g.type.toUpperCase()}" used. Allowed gate set: [${problem.allowedGates.join(', ').toUpperCase()}].`,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }
  }

  // 2. Simulation execution
  const simResult = simulateLocalCircuit(submittedQubits, submittedGates, 1024);
  const execTime = Math.round(performance.now() - startTime);

  // 3. Checker Evaluation
  if (problem.checkerType === 'fidelity' && problem.targetStatevector) {
    const actualSv = simResult.statevector;
    const targetSv = problem.targetStatevector;

    if (actualSv.length !== targetSv.length) {
      return {
        status: 'WRONG_ANSWER',
        message: 'Statevector dimension mismatch.',
        executionTimeMs: execTime
      };
    }

    const fidelity = calculateStatevectorFidelity(targetSv, actualSv);

    if (fidelity >= 0.999) {
      return {
        status: 'ACCEPTED',
        message: `Solution Accepted! Statevector fidelity: ${(fidelity * 100).toFixed(2)}%.`,
        fidelity,
        executionTimeMs: execTime
      };
    } else {
      return {
        status: 'WRONG_ANSWER',
        message: `Wrong Answer. Statevector fidelity was ${(fidelity * 100).toFixed(2)}% (required: ≥ 99.9%).`,
        fidelity,
        executionTimeMs: execTime
      };
    }
  }

  if (problem.checkerType === 'measurement_probability' && problem.targetOutcome) {
    const { basis, minProbability } = problem.targetOutcome;
    const probMap = simResult.probabilities;
    
    // Check if any matching basis state exists (handling prefix match if measurement is partial)
    let actualProb = 0;
    for (const [key, p] of Object.entries(probMap)) {
      if (key === basis || key.endsWith(basis) || key.startsWith(basis)) {
        actualProb += p;
      }
    }

    if (actualProb >= minProbability) {
      return {
        status: 'ACCEPTED',
        message: `Solution Accepted! Target outcome |${basis}⟩ measured with ${(actualProb * 100).toFixed(1)}% probability (threshold: ${(minProbability * 100).toFixed(0)}%).`,
        measuredProbability: actualProb,
        targetProbability: minProbability,
        executionTimeMs: execTime
      };
    } else {
      return {
        status: 'WRONG_ANSWER',
        message: `Wrong Answer. Outcome |${basis}⟩ was measured with ${(actualProb * 100).toFixed(1)}% probability (required: ≥ ${(minProbability * 100).toFixed(0)}%).`,
        measuredProbability: actualProb,
        targetProbability: minProbability,
        executionTimeMs: execTime
      };
    }
  }

  return {
    status: 'WRONG_ANSWER',
    message: 'Solution did not meet the problem acceptance criteria.',
    executionTimeMs: execTime
  };
}
