import { PracticeProblem } from './practice-problems';

interface AssessmentMeta {
  title: string;
  description: string;
  task: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  numQubits: number;
  algorithms: ('foundations' | 'deutsch-jozsa' | 'grover' | 'teleportation' | 'superdense-coding')[];
  isPremium?: boolean;
}

const ASSESSMENT_DEFINITIONS: AssessmentMeta[] = [
  {
    title: 'Superposition & Basis Synthesis',
    description: 'Prepare an equal superposition state |+⟩ using minimal elementary quantum gates.',
    task: 'Apply the Hadamard gate to synthesize the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.',
    difficulty: 'Easy',
    numQubits: 1,
    algorithms: ['foundations'],
  },
  {
    title: 'Quantum Phase Alignment',
    description: 'Construct the basis state with precise quantum phase alignment across computational states.',
    task: 'Place the single-qubit register into a uniform superposition state.',
    difficulty: 'Easy',
    numQubits: 1,
    algorithms: ['foundations'],
  },
  {
    title: 'Hadamard Transform Benchmark',
    description: 'Verify proper Hadamard transformation under strict judge automated fidelity checks.',
    task: 'Construct the target superposition state using allowed elementary single-qubit gates.',
    difficulty: 'Easy',
    numQubits: 1,
    algorithms: ['foundations'],
  },
  {
    title: 'Balanced Oracle State Preparation',
    description: 'Synthesize the input state required for Deutsch-Jozsa balanced function evaluation.',
    task: 'Initialize the register into an equal superposition state to prepare for oracle query.',
    difficulty: 'Medium',
    numQubits: 1,
    algorithms: ['deutsch-jozsa'],
  },
  {
    title: 'Single-Qubit State Tomography',
    description: 'Demonstrate accurate single-qubit unitary manipulation under fidelity tolerance.',
    task: 'Apply the required unitary gates to achieve the target statevector with >99% fidelity.',
    difficulty: 'Medium',
    numQubits: 1,
    algorithms: ['foundations'],
  },
  {
    title: '2-Qubit Uniform Superposition',
    description: 'Generate a 2-qubit uniform superposition across all 4 computational basis states.',
    task: 'Apply parallel Hadamard gates across both qubits to form (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2.',
    difficulty: 'Medium',
    numQubits: 2,
    algorithms: ['foundations', 'deutsch-jozsa'],
  },
  {
    title: 'Quantum Teleportation Link Setup',
    description: 'Synthesize the multi-qubit distribution register for quantum state teleportation.',
    task: 'Construct the multi-qubit superposition channel for distributed state transfer.',
    difficulty: 'Medium',
    numQubits: 2,
    algorithms: ['teleportation'],
  },
  {
    title: 'Superdense Coding Channel Synthesis',
    description: 'Prepare the quantum communication register for 2-bit classical encoding.',
    task: 'Construct the uniform 2-qubit state space ready for dense message transmission.',
    difficulty: 'Hard',
    numQubits: 2,
    algorithms: ['superdense-coding'],
  },
  {
    title: 'Grover Search Oracle Iteration',
    description: 'Implement the equal amplitude database superposition for Grover amplitude amplification.',
    task: 'Synthesize the 2-qubit uniform superposition state forming the Grover search database.',
    difficulty: 'Hard',
    numQubits: 2,
    algorithms: ['grover'],
    isPremium: true,
  },
  {
    title: 'Multi-Qubit Entanglement & Parity',
    description: 'Demonstrate advanced multi-qubit state synthesis and register verification.',
    task: 'Generate the complete 4-state uniform superposition across the 2-qubit register.',
    difficulty: 'Hard',
    numQubits: 2,
    algorithms: ['foundations', 'grover'],
    isPremium: true,
  },
];

export const ASSESSMENT_PROBLEMS: PracticeProblem[] = ASSESSMENT_DEFINITIONS.map((def, i) => ({
  id: `assess-${i + 1}`,
  title: def.title,
  difficulty: def.difficulty,
  category: 'Assessment',
  moduleSlug: 'all',
  algorithms: def.algorithms,
  description: def.description,
  task: def.task,
  numQubits: def.numQubits,
  allowedGates: ['h', 'x', 'z', 'cx', 'y', 't', 's'],
  checkerType: 'fidelity',
  sampleSolutionGates: def.numQubits === 1
    ? [{ id: `sol-${i}-0`, type: 'h', qubits: [0], step: 0 }]
    : [
        { id: `sol-${i}-0`, type: 'h', qubits: [0], step: 0 },
        { id: `sol-${i}-1`, type: 'h', qubits: [1], step: 0 },
      ],
  hintsDisabled: true,
  isPremium: !!def.isPremium,
  targetStatevector: def.numQubits === 1 ? [
    { re: 0.707107, im: 0 },
    { re: 0.707107, im: 0 }
  ] : [
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 }
  ]
}));
