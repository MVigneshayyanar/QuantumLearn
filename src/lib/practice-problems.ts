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
    "id": "prob-superposition",
    "title": "Equal Superposition State |+⟩",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Prepare a 1-qubit system into an equal superposition state $|+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$ starting from $|0\\rangle$.",
    "task": "Apply the Hadamard (H) gate on Qubit 0 so measuring yields equal 50% probabilities for |0⟩ and |1⟩.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "x",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-minus-state",
    "title": "Minus Superposition | - ⟩ State",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Prepare the orthogonal superposition state $|-\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)$ starting from $|0\\rangle$.",
    "task": "Apply Pauli-X followed by Hadamard on Qubit 0 to prepare the phase-kickback resource state.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "x",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": -0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-bit-and-phase-flip",
    "title": "Combined Bit and Phase Flip -|1⟩",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Starting from $|0\\rangle$, map the qubit state to $-|1\\rangle$.",
    "task": "Find the gate sequence that transforms $|0\\rangle$ into $|1\\rangle$ with an overall negative phase $(-1)$.",
    "numQubits": 1,
    "allowedGates": [
      "x",
      "z",
      "y",
      "h",
      "s",
      "t"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-y-basis-state",
    "title": "Circular Polarization |i+⟩ State",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Prepare the positive Y-eigenstate $|i+\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + i|1\\rangle)$ from $|0\\rangle$.",
    "task": "Use a combination of Hadamard (H) and Phase (S) gates to rotate the state vector from the Z-axis to the positive Y-axis on the Bloch Sphere.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "s",
      "t",
      "x",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "s",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0.707107
      }
    ]
  },
  {
    "id": "prob-y-minus-state",
    "title": "Negative Y-Eigenstate |i-⟩ Preparation",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Prepare the negative Y-eigenstate $|i-\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle - i|1\\rangle)$ starting from $|0\\rangle$.",
    "task": "Apply Hadamard followed by Phase (S) and Pauli-Z to create the $-i$ relative phase.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "s",
      "z",
      "x",
      "t"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "s",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": -0.707107
      }
    ]
  },
  {
    "id": "prob-t-gate-phase",
    "title": "T-Gate π/4 Relative Phase Shift",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Create the state $\\frac{1}{\\sqrt{2}}(|0\\rangle + e^{i\\pi/4}|1\\rangle)$ on the equatorial plane of the Bloch sphere.",
    "task": "Apply Hadamard followed by the non-Clifford T gate on Qubit 0 to rotate the azimuth angle $\\phi$ to exactly $45^\\circ$ ($+\\pi/4$).",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "t",
      "s",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "t",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0.5
      }
    ]
  },
  {
    "id": "prob-s-dagger-identity",
    "title": "Inverse Phase Operation (S† from S & Z)",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Synthesize the adjoint phase gate $S^\\dagger = \\begin{pmatrix}1 & 0 \\\\ 0 & -i\\end{pmatrix}$ using only S and Z gates.",
    "task": "Starting from equal superposition $|+\\rangle$, apply S and Z to transform it to $|i-\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle - i|1\\rangle)$.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "s",
      "z",
      "x"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "s",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": -0.707107
      }
    ]
  },
  {
    "id": "prob-hadamard-reversibility",
    "title": "Hadamard Self-Inverse Identity (H · H = I)",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Demonstrate that the Hadamard transformation is unitary and its own inverse ($H^\\dagger = H$).",
    "task": "Apply two successive Hadamard gates on Qubit 0 initialized in $|0\\rangle$ to recover the initial $|0\\rangle$ state with 100% fidelity.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "x",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 1,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-pauli-x-involution",
    "title": "Pauli-X Involution (X · X = I)",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Demonstrate that applying two consecutive bit-flip operations restores the original state.",
    "task": "Apply two Pauli-X gates on Qubit 0 to verify $X^2 = I$.",
    "numQubits": 1,
    "allowedGates": [
      "x",
      "h",
      "z"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 1,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-clifford-h-s-h",
    "title": "Clifford Sequence H · S · H",
    "difficulty": "Medium",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Construct the composite unitary transformation $U = H S H$ on $|0\\rangle$.",
    "task": "Apply Hadamard, Phase (S), and Hadamard in series on Qubit 0 and observe the resulting state in the computational basis.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "s",
      "x",
      "z",
      "t"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "s",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.5,
        "im": 0.5
      },
      {
        "re": 0.5,
        "im": -0.5
      }
    ]
  },
  {
    "id": "prob-pauli-y-flip",
    "title": "Pauli-Y Combined Bit & Phase Operation",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Apply the Pauli-Y operator $Y = \\begin{pmatrix}0 & -i \\\\ i & 0\\end{pmatrix}$ directly on state $|0\\rangle$.",
    "task": "Apply the Pauli-Y gate on Qubit 0 to reach $i|1\\rangle$.",
    "numQubits": 1,
    "allowedGates": [
      "y",
      "x",
      "z",
      "h"
    ],
    "maxGates": 2,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "y",
        "qubits": [
          0
        ],
        "step": 0
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 1
      }
    ]
  },
  {
    "id": "prob-t-squared-s",
    "title": "T-Gate Squaring Identity (T · T = S)",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Demonstrate that two consecutive $\\pi/4$ phase rotations equal a $\\pi/2$ Phase gate ($T^2 = S$).",
    "task": "Prepare $|+\\rangle$ with Hadamard, then apply two T gates to produce $|i+\\rangle$.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "t",
      "s",
      "z"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "t",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "t",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0.707107
      }
    ]
  },
  {
    "id": "prob-z-eigenstate-flip",
    "title": "Z-Basis Eigenstate Phase Modulation",
    "difficulty": "Easy",
    "category": "Single-Qubit Operations",
    "moduleSlug": "deutsch-jozsa",
    "description": "Demonstrate that the Pauli-Z gate leaves $|0\\rangle$ unchanged and maps $|1\\rangle$ to $-|1\\rangle$.",
    "task": "Apply Pauli-X to prepare $|1\\rangle$, then apply Pauli-Z to obtain $-|1\\rangle$.",
    "numQubits": 1,
    "allowedGates": [
      "x",
      "z",
      "h"
    ],
    "maxGates": 3,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-bell-state",
    "title": "Maximally Entangled Bell Pair |Φ+⟩",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Construct the canonical Bell state $|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$ on 2 qubits initialized to $|00\\rangle$.",
    "task": "Use a Hadamard and a two-qubit entangling gate (CNOT) to create perfect quantum correlation where measuring one qubit determines the other.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "cx",
      "x",
      "z"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-bell-phi-minus",
    "title": "Bell State |Φ-⟩ Generation",
    "difficulty": "Easy",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Construct the orthogonal Bell state $|\\Phi^-\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle - |11\\rangle)$ starting from $|00\\rangle$.",
    "task": "Add a Phase (Z) gate to the standard Bell state generator to introduce the $-1$ relative phase between $|00\\rangle$ and $|11\\rangle$.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "z",
      "x",
      "cx"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-bell-psi-plus",
    "title": "Bell State |Ψ+⟩ Generation",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Generate the symmetric entangled state $|\\Psi^+\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle + |10\\rangle)$ on 2 qubits starting from $|00\\rangle$.",
    "task": "Use a Pauli-X gate on Qubit 1 followed by the standard Bell creator circuit to flip the target qubit in the entangled superposition.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-bell-psi-minus",
    "title": "Singlet State |Ψ-⟩ Generation",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Prepare the antisymmetric singlet state $|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)$ starting from $|00\\rangle$.",
    "task": "Combine Pauli flips and a Bell creator circuit to reach the singlet subspace with negative relative phase.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -0.707107,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-ghz-state",
    "title": "3-Qubit Greenberger–Horne–Zeilinger (GHZ) State",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Generate the genuine tripartite entangled GHZ state $|\\text{GHZ}\\rangle = \\frac{1}{\\sqrt{2}}(|000\\rangle + |111\\rangle)$ on 3 qubits.",
    "task": "Apply a Hadamard gate on Qubit 0, followed by a chain of two CNOT gates (CX(0,1) and CX(1,2)) to cascade maximal entanglement across all 3 qubits.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "cx",
      "x",
      "z"
    ],
    "maxGates": 5,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-ghz-parity",
    "title": "3-Qubit GHZ Parity Verification",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Generate the 3-qubit GHZ state and verify computational basis measurements strictly yield only |000⟩ or |111⟩.",
    "task": "Construct GHZ $|\\text{GHZ}\\rangle = \\frac{1}{\\sqrt{2}}(|000\\rangle + |111\\rangle)$ and verify measurement probability of 000 is ~50%.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "cx",
      "x"
    ],
    "maxGates": 4,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "000",
      "minProbability": 0.45
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-ghz-minus",
    "title": "3-Qubit GHZ |GHZ-⟩ State with Negative Phase",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Prepare the state $|\\text{GHZ}^-\\rangle = \\frac{1}{\\sqrt{2}}(|000\\rangle - |111\\rangle)$ across 3 qubits.",
    "task": "Combine a Pauli-Z phase flip with the GHZ cascade circuit to induce destructive relative phase on $|111\\rangle$.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "z",
      "cx",
      "x"
    ],
    "maxGates": 5,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -0.707107,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-cluster-state-2q",
    "title": "2-Qubit Cluster State via Controlled-Z",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Create the 2-qubit graph state $|G_2\\rangle = \\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle - |11\\rangle)$ essential for measurement-based quantum computing.",
    "task": "Apply Hadamard on both Qubit 0 and Qubit 1, then apply a Controlled-Z (CZ) gate between them.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "cz",
      "z",
      "x"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": -0.5,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-w-subspace-2q",
    "title": "2-Qubit Symmetric Superposition (|01⟩ + |10⟩)",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Prepare the symmetric zero-net-spin subspace state $\\frac{1}{\\sqrt{2}}(|01\\rangle + |10\\rangle)$ without any component of $|00\\rangle$ or $|11\\rangle$.",
    "task": "Use Pauli-X on Qubit 0 followed by Hadamard on Qubit 0 and CNOT(0->1) with target bit adjustments.",
    "numQubits": 2,
    "allowedGates": [
      "x",
      "h",
      "cx"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-cnot-entangle-minus",
    "title": "Entangling Superposition with Phase Kickback",
    "difficulty": "Medium",
    "category": "Quantum Entanglement",
    "moduleSlug": "teleportation",
    "description": "Generate the entangled state $\\frac{1}{\\sqrt{2}}(|00\\rangle - |01\\rangle)$ and observe phase kickback under CX.",
    "task": "Apply Pauli-X on Q1, Hadamard on Q1, and CNOT(0->1).",
    "numQubits": 2,
    "allowedGates": [
      "x",
      "h",
      "cx"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -0.707107,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-deutsch-jozsa-constant",
    "title": "Deutsch-Jozsa Constant Oracle (f(x) = 0)",
    "difficulty": "Medium",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Implement the Deutsch-Jozsa test for a Constant-0 function $f(x)=0$ (identity oracle).",
    "task": "Initialize input Q0 and ancilla Q1 into superposition/phase kickback states, apply no gate for $f(x)=0$, and apply final Hadamard interference on Q0 so measurement yields |0⟩ with 100% confidence.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cx",
      "measure"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "01",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "measure",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-deutsch-jozsa-balanced",
    "title": "Deutsch-Jozsa Balanced Oracle Discrimination",
    "difficulty": "Hard",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Implement the Deutsch-Jozsa algorithm for the balanced oracle $f(x) = x$ (represented by a CNOT from input Q0 to ancilla Q1).",
    "task": "Initialize Q1 in $|-\\rangle$, put Q0 in superposition, evaluate the oracle with CNOT, and apply interference so that measuring Q0 gives |1⟩ with 100% confidence.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cx",
      "measure"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "11",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-6",
        "type": "measure",
        "qubits": [
          0
        ],
        "step": 4
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-deutsch-constant-one",
    "title": "Deutsch Oracle: Constant-1 Function f(x) = 1",
    "difficulty": "Medium",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Implement Deutsch algorithm for oracle $f(x)=1$, which applies an unconditional bit-flip (Pauli-X) on the ancilla qubit.",
    "task": "Prepare ancilla Q1 in $|-\\rangle$, put Q0 in $|+\\rangle$, apply Pauli-X on Q1 as the oracle, and apply Hadamard on Q0 to measure $|0\\rangle$ with 100% probability.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "01",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-deutsch-balanced-not",
    "title": "Deutsch Oracle: Balanced Inverted Function f(x) = ¬x",
    "difficulty": "Hard",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Construct the Deutsch algorithm circuit for $f(x) = 1 - x$, an inverted balanced oracle.",
    "task": "Prepare phase-kickback register on Q1, apply CNOT(0->1) followed by Pauli-X on Q1, and measure Q0 to confirm the balanced state |1⟩.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 7,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "11",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 3
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-bv-oracle-1",
    "title": "Bernstein-Vazirani 1-Bit Hidden String s = \"1\"",
    "difficulty": "Medium",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Extract the 1-bit secret string $s = 1$ in a single query using the Bernstein-Vazirani algorithm.",
    "task": "Initialize ancilla Q1 into $|-\\rangle$, put Q0 in $|+\\rangle$, apply CNOT(0->1) to encode inner product $s \\cdot x$, and apply Hadamard on Q0 to decode $s=1$.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "11",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-bv-oracle-11",
    "title": "Bernstein-Vazirani 2-Bit Hidden String s = \"11\"",
    "difficulty": "Hard",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Find the secret 2-bit string $s = 11$ with a single quantum oracle evaluation on 3 qubits (Q0, Q1 inputs, Q2 ancilla).",
    "task": "Prepare Q2 in $|-\\rangle$, put Q0,Q1 in $|+\\rangle$, apply CNOT(0->2) and CNOT(1->2) to query the oracle, then apply Hadamard on Q0,Q1 to measure state |111⟩.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 9,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "111",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          2
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          2
        ],
        "step": 1
      },
      {
        "id": "sol-5",
        "type": "cx",
        "qubits": [
          0,
          2
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      },
      {
        "id": "sol-8",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 4
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-bv-oracle-10",
    "title": "Bernstein-Vazirani 2-Bit Hidden String s = \"10\"",
    "difficulty": "Hard",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Find the secret 2-bit string $s = 10$ with a single quantum query on 3 qubits (Q0, Q1 inputs, Q2 ancilla).",
    "task": "Prepare Q2 in $|-\\rangle$, put Q0,Q1 in $|+\\rangle$, apply CNOT(0->2) for $s_0=1$ and no gate for $s_1=0$, and decode with Hadamards on Q0,Q1 to measure 101.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 8,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "101",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          2
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          2
        ],
        "step": 1
      },
      {
        "id": "sol-5",
        "type": "cx",
        "qubits": [
          0,
          2
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-bv-oracle-01",
    "title": "Bernstein-Vazirani 2-Bit Hidden String s = \"01\"",
    "difficulty": "Hard",
    "category": "Quantum Parallelism",
    "moduleSlug": "deutsch-jozsa",
    "description": "Find the secret 2-bit string $s = 01$ with a single quantum query on 3 qubits (Q0, Q1 inputs, Q2 ancilla).",
    "task": "Prepare Q2 in $|-\\rangle$, put Q0,Q1 in $|+\\rangle$, apply CNOT(1->2) for $s_1=1$, and decode with Hadamards on Q0,Q1 to measure 011.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "x",
      "cx"
    ],
    "maxGates": 8,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "011",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          2
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          2
        ],
        "step": 1
      },
      {
        "id": "sol-5",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-grover-search",
    "title": "Grover's 2-Qubit Search for |11⟩",
    "difficulty": "Hard",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Implement a 2-qubit Grover Search circuit to find the marked database entry $|11\\rangle$.",
    "task": "Put qubits into equal superposition, apply the phase oracle (CZ gate for $|11\\rangle$), and apply the 2-qubit Grover Diffusion Operator to amplify $|11\\rangle$ to 100% probability.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cz",
      "measure"
    ],
    "maxGates": 9,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "11",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "z",
        "qubits": [
          1
        ],
        "step": 3
      },
      {
        "id": "sol-8",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 4
      },
      {
        "id": "sol-9",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 5
      },
      {
        "id": "sol-10",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 5
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-grover-search-00",
    "title": "Grover's Search for Marked State |00⟩",
    "difficulty": "Hard",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Construct a Grover Search instance configured to search and amplify the target $|00\\rangle$.",
    "task": "Apply superposition, construct the phase oracle for $|00\\rangle$ using Pauli-X encodings around CZ, followed by the Grover diffusion operator.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cz"
    ],
    "maxGates": 13,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "00",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-5",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 3
      },
      {
        "id": "sol-8",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      },
      {
        "id": "sol-9",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 4
      },
      {
        "id": "sol-10",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 5
      },
      {
        "id": "sol-11",
        "type": "z",
        "qubits": [
          1
        ],
        "step": 5
      },
      {
        "id": "sol-12",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 6
      },
      {
        "id": "sol-13",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 7
      },
      {
        "id": "sol-14",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 7
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-grover-search-01",
    "title": "Grover's Search for Marked State |01⟩",
    "difficulty": "Hard",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Construct a 2-qubit Grover Search circuit configured to find and amplify target state $|01\\rangle$ (Q0=1, Q1=0).",
    "task": "Put qubits in superposition, build phase oracle for $|01\\rangle$ using Pauli-X on Qubit 1 around CZ, then apply Grover diffusion.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cz"
    ],
    "maxGates": 12,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "01",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 3
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      },
      {
        "id": "sol-7",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 4
      },
      {
        "id": "sol-8",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 5
      },
      {
        "id": "sol-9",
        "type": "z",
        "qubits": [
          1
        ],
        "step": 5
      },
      {
        "id": "sol-10",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 6
      },
      {
        "id": "sol-11",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 7
      },
      {
        "id": "sol-12",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 7
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-grover-search-10",
    "title": "Grover's Search for Marked State |10⟩",
    "difficulty": "Hard",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Construct a 2-qubit Grover Search circuit configured to find and amplify target state $|10\\rangle$ (Q0=0, Q1=1).",
    "task": "Put qubits in superposition, build phase oracle for $|10\\rangle$ using Pauli-X on Qubit 0 around CZ, then apply Grover diffusion.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cz"
    ],
    "maxGates": 12,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "10",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      },
      {
        "id": "sol-7",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 4
      },
      {
        "id": "sol-8",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 5
      },
      {
        "id": "sol-9",
        "type": "z",
        "qubits": [
          1
        ],
        "step": 5
      },
      {
        "id": "sol-10",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 6
      },
      {
        "id": "sol-11",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 7
      },
      {
        "id": "sol-12",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 7
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-phase-inversion-11",
    "title": "Phase Oracle Inversion for |11⟩",
    "difficulty": "Easy",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Implement the phase oracle $U_f = I - 2|11\\rangle\\langle 11|$ that flips the sign of the marked item $|11\\rangle$.",
    "task": "Initialize qubits in equal superposition and apply a Controlled-Z (CZ) gate to achieve negative phase on $|11\\rangle$.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "cz",
      "x",
      "z"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 1
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": -0.5,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-phase-inversion-00",
    "title": "Phase Oracle Inversion for |00⟩",
    "difficulty": "Medium",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Implement the phase oracle $U_0 = I - 2|00\\rangle\\langle 00|$ that marks $|00\\rangle$ with a $-1$ relative phase.",
    "task": "Put qubits in superposition, wrap CZ with Pauli-X on both qubits, and verify the resulting statevector.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cz",
      "z"
    ],
    "maxGates": 6,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-5",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-6",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-7",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": -0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-phase-inversion-01",
    "title": "Phase Oracle Inversion for |01⟩",
    "difficulty": "Medium",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Construct the phase-marking operator $U_f = I - 2|01\\rangle\\langle 01|$ for target state $|01\\rangle$.",
    "task": "Prepare superposition, apply Pauli-X on Qubit 1 before and after CZ(0,1).",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cz"
    ],
    "maxGates": 6,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": -0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-phase-inversion-10",
    "title": "Phase Oracle Inversion for |10⟩",
    "difficulty": "Medium",
    "category": "Amplitude Amplification",
    "moduleSlug": "grover",
    "description": "Construct the phase-marking operator $U_f = I - 2|10\\rangle\\langle 10|$ for target state $|10\\rangle$.",
    "task": "Prepare superposition, apply Pauli-X on Qubit 0 before and after CZ(0,1).",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "cz"
    ],
    "maxGates": 6,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-4",
        "type": "cz",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      },
      {
        "re": -0.5,
        "im": 0
      },
      {
        "re": 0.5,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-swap-cnot",
    "title": "Swap Protocol via 3 CNOT Gates",
    "difficulty": "Medium",
    "category": "Circuit Identities",
    "moduleSlug": "superdense-coding",
    "description": "Exchange the quantum states of two qubits WITHOUT using the SWAP gate.",
    "task": "Use exactly three alternating CNOT gates (CX(0,1), CX(1,0), CX(0,1)) to swap the states of Qubit 0 and Qubit 1.",
    "numQubits": 2,
    "allowedGates": [
      "cx",
      "x"
    ],
    "maxGates": 5,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-0",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-1",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          1,
          0
        ],
        "step": 2
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 1,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-pauli-conjugation",
    "title": "H-X-H Conjugation Identity (H · X · H = Z)",
    "difficulty": "Easy",
    "category": "Circuit Identities",
    "moduleSlug": "deutsch-jozsa",
    "description": "Verify the foundational Clifford identity that conjugating Pauli-X with Hadamard gates converts a bit flip into a phase flip: $H X H = Z$.",
    "task": "Apply the sequence H -> X -> H on Qubit 0 initialized in $|1\\rangle$ to achieve state $-|1\\rangle$.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "x",
      "z"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-0",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-2",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-hzh-conjugation",
    "title": "H-Z-H Conjugation Identity (H · Z · H = X)",
    "difficulty": "Easy",
    "category": "Circuit Identities",
    "moduleSlug": "deutsch-jozsa",
    "description": "Demonstrate that conjugating Pauli-Z with Hadamard converts a phase flip into a bit flip: $H Z H = X$.",
    "task": "Starting from $|0\\rangle$, apply H -> Z -> H on Qubit 0 to transform the state to $|1\\rangle$.",
    "numQubits": 1,
    "allowedGates": [
      "h",
      "z",
      "x"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-cz-from-cx",
    "title": "Controlled-Z Synthesis from CNOT & Hadamards",
    "difficulty": "Medium",
    "category": "Circuit Identities",
    "moduleSlug": "deutsch-jozsa",
    "description": "Synthesize a Controlled-Z gate between Qubit 0 and Qubit 1 using only Hadamard gates and a standard CNOT.",
    "task": "Apply Hadamards on Qubit 1 before and after CNOT(0->1) on state $|11\\rangle$ to flip its phase to $-|11\\rangle$.",
    "numQubits": 2,
    "allowedGates": [
      "x",
      "h",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-0",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-1",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": -1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-cx-reversal",
    "title": "CNOT Direction Reversal with Hadamards",
    "difficulty": "Medium",
    "category": "Circuit Identities",
    "moduleSlug": "deutsch-jozsa",
    "description": "Reverse the direction of a CNOT gate (making Q1 control and Q0 target) using 4 Hadamard gates: $CX_{1,0} = (H \\otimes H) CX_{0,1} (H \\otimes H)$.",
    "task": "Prepare Q1 in $|1\\rangle$, apply Hadamards on both qubits, apply CX(0->1), and apply Hadamards again to flip Q0 to $|1\\rangle$.",
    "numQubits": 2,
    "allowedGates": [
      "x",
      "h",
      "cx"
    ],
    "maxGates": 7,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-0",
        "type": "x",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 1
      },
      {
        "id": "sol-2",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 1,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-swap-self-inverse",
    "title": "SWAP Gate Self-Inverse Identity",
    "difficulty": "Easy",
    "category": "Circuit Identities",
    "moduleSlug": "superdense-coding",
    "description": "Verify that applying the SWAP gate twice is equivalent to the identity operation ($SWAP^2 = I$).",
    "task": "Prepare $|10\\rangle$ with Pauli-X on Q0, apply SWAP(0,1), and apply SWAP(0,1) again to return to $|10\\rangle$.",
    "numQubits": 2,
    "allowedGates": [
      "x",
      "swap",
      "h"
    ],
    "maxGates": 4,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-0",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-1",
        "type": "swap",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-2",
        "type": "swap",
        "qubits": [
          0,
          1
        ],
        "step": 2
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 1,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      },
      {
        "re": 0,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-teleportation-circuit",
    "title": "Quantum Teleportation of Superposition |+⟩",
    "difficulty": "Hard",
    "category": "Quantum Communication",
    "moduleSlug": "teleportation",
    "description": "Teleport an unknown quantum state $|psi\\rangle = |+\\rangle$ on Qubit 0 to Bob’s Qubit 2 using an entangled Bell pair between Q1 and Q2.",
    "task": "Create Bell pair on (Q1, Q2), prepare $|psi\\rangle = |+\\rangle$ on Q0, apply Bell-state measurement (CNOT Q0->Q1 and H on Q0), and verify Q2 receives the state.",
    "numQubits": 3,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 8,
    "checkerType": "fidelity",
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          1
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          1,
          2
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true,
    "targetStatevector": [
      {
        "re": 0.353553,
        "im": 0
      },
      {
        "re": 0.353553,
        "im": 0
      },
      {
        "re": 0.353553,
        "im": 0
      },
      {
        "re": -0.353553,
        "im": 0
      },
      {
        "re": 0.353553,
        "im": 0
      },
      {
        "re": -0.353553,
        "im": 0
      },
      {
        "re": 0.353553,
        "im": 0
      },
      {
        "re": 0.353553,
        "im": 0
      }
    ]
  },
  {
    "id": "prob-superdense-encode",
    "title": "Superdense Coding: 2-Bit Transmission \"11\"",
    "difficulty": "Hard",
    "category": "Quantum Communication",
    "moduleSlug": "superdense-coding",
    "description": "Encode classical bits (1, 1) using Alice’s local unitary on an entangled Bell pair and verify Bob can decode it with 100% certainty.",
    "task": "Create Bell pair $|\\Phi^+\\rangle$, apply $Z$ then $X$ on Qubit 0, and run Bob’s decoding (CNOT followed by Hadamard on Q0).",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 7,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "11",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 3
      },
      {
        "id": "sol-5",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 4
      },
      {
        "id": "sol-6",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 5
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-superdense-01",
    "title": "Superdense Coding: Encode Bits \"01\"",
    "difficulty": "Hard",
    "category": "Quantum Communication",
    "moduleSlug": "superdense-coding",
    "description": "Transmit the 2-bit classical message \"01\" by applying Alice’s local Pauli-Z operation to an entangled Bell pair.",
    "task": "Prepare Bell pair $|\\Phi^+\\rangle$, apply $Z$ on Qubit 0, and run Bob’s decoding circuit to measure state |01⟩ with >95% probability.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "01",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "z",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 3
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-superdense-10",
    "title": "Superdense Coding: Encode Bits \"10\"",
    "difficulty": "Hard",
    "category": "Quantum Communication",
    "moduleSlug": "superdense-coding",
    "description": "Transmit the 2-bit classical message \"10\" by applying Alice’s local Pauli-X operation to an entangled Bell pair.",
    "task": "Prepare Bell pair $|\\Phi^+\\rangle$, apply $X$ on Qubit 0, and run Bob’s decoding circuit to measure state |10⟩ with >95% probability.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 6,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "10",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "x",
        "qubits": [
          0
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 3
      },
      {
        "id": "sol-5",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 4
      }
    ],
    "hintsDisabled": true
  },
  {
    "id": "prob-superdense-00",
    "title": "Superdense Coding: Encode Bits \"00\"",
    "difficulty": "Medium",
    "category": "Quantum Communication",
    "moduleSlug": "superdense-coding",
    "description": "Transmit the 2-bit classical message \"00\" (identity operation) across an EPR channel.",
    "task": "Prepare Bell pair $|\\Phi^+\\rangle$, apply identity (no gate), and execute Bob’s Bell measurement to decode |00⟩.",
    "numQubits": 2,
    "allowedGates": [
      "h",
      "x",
      "z",
      "cx"
    ],
    "maxGates": 5,
    "checkerType": "measurement_probability",
    "targetOutcome": {
      "basis": "00",
      "minProbability": 0.95
    },
    "sampleSolutionGates": [
      {
        "id": "sol-1",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 0
      },
      {
        "id": "sol-2",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 1
      },
      {
        "id": "sol-3",
        "type": "cx",
        "qubits": [
          0,
          1
        ],
        "step": 2
      },
      {
        "id": "sol-4",
        "type": "h",
        "qubits": [
          0
        ],
        "step": 3
      }
    ],
    "hintsDisabled": true
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
