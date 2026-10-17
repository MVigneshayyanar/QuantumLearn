export interface Lesson {
  id: number;
  slug: string;
  title: string;
  duration: string;
  sectionId: 1 | 2 | 3 | 4;
  sectionTitle: string;
  summary: string;
  objectives: string[];
  theory: string;
  mathFormulae: {
    label: string;
    latex: string;
    explanation: string;
  }[];
  interactiveType:
    | 'bloch'
    | 'gates'
    | 'entanglement'
    | 'composer'
    | 'noise'
    | 'grover'
    | 'shor'
    | 'vqe'
    | 'error_correction'
    | 'pulses'
    | 'characterization'
    | 'double_slit'
    | 'bb84';
  codeSample: {
    framework: string;
    code: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface HardwarePlatform {
  id: string;
  name: string;
  tagline: string;
  temp: string;
  typicalT1: string;
  typicalT2: string;
  gateTime1Q: string;
  gateTime2Q: string;
  fidelity1Q: string;
  fidelity2Q: string;
  physicalMechanism: string;
  nativeGateSet: string[];
  pulseControl: string;
  companies: string[];
  pros: string[];
  cons: string[];
  architectureDiagramDesc: string;
}

export interface CharacterizationExperiment {
  id: string;
  name: string;
  purpose: string;
  parameterSwept: string;
  measuredQuantity: string;
  fitModel: string;
  extractedMetric: string;
  typicalValue: string;
  simulationFormula: (param: number, noise: number) => number;
  xRange: [number, number];
  xUnit: string;
  yUnit: string;
  xLabel: string;
  yLabel: string;
  description: string;
}

export interface PlaygroundLab {
  id: string;
  title: string;
  category: 'foundations' | 'qubits' | 'gates' | 'algorithms' | 'hardware' | 'cryptography' | 'advanced';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  iconName: string;
}

export interface GlossaryTerm {
  term: string;
  category: 'Math' | 'Physics' | 'Gates' | 'Algorithms' | 'Hardware' | 'Error Correction';
  definition: string;
  formula?: string;
  lessonSlug?: string;
}

export interface ResourceItem {
  title: string;
  author: string;
  type: 'Textbook' | 'Lecture Notes' | 'Framework' | 'Landmark Paper';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  description: string;
}

// ============================================================================
// 1. ALL 22 STRUCTURED CURRICULUM LESSONS
// ============================================================================

export const ACADEMY_LESSONS: Lesson[] = [
  // --- SECTION 1: FOUNDATIONS ---
  {
    id: 1,
    slug: 'what-quantum-is-and-isnt',
    title: "Welcome: What Quantum Computing Is (and Isn't)",
    duration: '20 min',
    sectionId: 1,
    sectionTitle: 'Section 1: Foundations',
    summary: 'A reality check on quantum computing. What quantum computers can actually do, separating genuine speedup from sci-fi myths.',
    objectives: [
      'Dispel the myth that qubits "try all combinations simultaneously" via parallel universes',
      'Distinguish BQP (quantum polynomial time) from NP-Complete problems',
      'Understand how destructive and constructive interference drives quantum speedups'
    ],
    theory: `Quantum computing is NOT about having an army of parallel classical processors testing every password at once. If it were, quantum computers would immediately solve all NP-Complete problems in polynomial time (NP ⊆ BQP), which computer scientists believe is false.\n\nReal quantum algorithms work through **interference**. Just as water waves can cancel each other out (destructive interference) or reinforce each other (constructive interference), probability amplitudes in a quantum computer can cancel incorrect answers and amplify the correct answer. The challenge of quantum algorithm design is orchestrating this interference using a polynomial number of gates.`,
    mathFormulae: [
      {
        label: 'Quantum Superposition State',
        latex: '|\\psi\\rangle = \\sum_{x=0}^{2^n-1} c_x |x\\rangle, \\quad \\sum_{x} |c_x|^2 = 1',
        explanation: 'Amplitudes c_x are complex numbers. Measurement reveals a single state x with probability |c_x|^2.'
      },
      {
        label: 'Constructive vs Destructive Interference',
        latex: 'P(x) = |\\alpha_x + \\beta_x|^2 = |\\alpha_x|^2 + |\\beta_x|^2 + 2\\text{Re}(\\alpha_x^* \\beta_x)',
        explanation: 'The cross-term 2Re(α*β) can be negative (canceling probability) or positive (amplifying probability).'
      }
    ],
    interactiveType: 'double_slit',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit, transpile\nfrom qiskit.visualization import plot_histogram\n\n# Create a 2-qubit Bell pair\nqc = QuantumCircuit(2, 2)\nqc.h(0)         # Put qubit 0 in superposition\nqc.cx(0, 1)     # Entangle qubit 0 and 1\nqc.measure([0, 1], [0, 1])\n\nprint("Quantum Circuit Diagram:")\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'Why do quantum algorithms like Grover or Shor produce computational speedups?',
        options: [
          'They test every possible combination in parallel classical copies',
          'They use constructive interference for correct paths and destructive interference for wrong paths',
          'They have clock frequencies millions of times faster than silicon CPUs',
          'They bypass thermodynamics entirely'
        ],
        correctIndex: 1,
        explanation: 'Quantum speedup relies on phase interference between complex amplitudes, concentrating probability on the desired outcome.'
      }
    ]
  },
  {
    id: 2,
    slug: 'complex-numbers-and-vectors',
    title: 'Complex Numbers & Vectors',
    duration: '30 min',
    sectionId: 1,
    sectionTitle: 'Section 1: Foundations',
    summary: 'Master the mathematical lingua franca of quantum mechanics: complex plane geometry, Euler formula, bra-ket notation, and state vectors.',
    objectives: [
      'Compute moduli, conjugates, and Euler polar representations of complex numbers',
      'Use Dirac notation: bra ⟨ψ| as dual row vector and ket |ψ⟩ as column vector',
      'Calculate inner products and verify vector normalization ⟨ψ|ψ⟩ = 1'
    ],
    theory: `Every state in quantum computing is a normalized vector in a complex Hilbert space. A complex number $z = x + iy$ can be written in polar form as $r e^{i\\theta}$, where $r = |z| = \\sqrt{x^2+y^2}$ is the magnitude and $\\theta = \\text{atan2}(y, x)$ is the phase.\n\nIn Dirac notation:\n- Ket $|\\psi\\rangle$ represents a column vector: $[c_0, c_1]^T$.\n- Bra $\\langle\\psi|$ represents the conjugate transpose (row vector): $[c_0^*, c_1^*]$.\n- Inner product $\\langle\\phi|\\psi\\rangle$ measures the overlap (projection) between states.\n- Outer product $|\\phi\\rangle\\langle\\psi|$ represents an operator/matrix.`,
    mathFormulae: [
      {
        label: "Euler's Formula",
        latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta, \\quad |e^{i\\theta}| = 1',
        explanation: 'Multiplying an amplitude by e^{iθ} rotates its phase in the complex plane without changing probability.'
      },
      {
        label: 'Dirac Inner Product & Normalization',
        latex: '\\langle\\phi|\\psi\\rangle = \\sum_{k=0}^{d-1} \\phi_k^* \\psi_k, \\quad \\langle\\psi|\\psi\\rangle = \\sum_k |c_k|^2 = 1',
        explanation: 'The total probability of all mutually exclusive measurement outcomes must strictly equal 1.'
      }
    ],
    interactiveType: 'bloch',
    codeSample: {
      framework: 'Python / NumPy',
      code: `import numpy as np\n\n# Define states |0> and |1>\nket0 = np.array([[1], [0]], dtype=complex)\nket1 = np.array([[0], [1]], dtype=complex)\n\n# Create superposition state |+> = (|0> + |1>)/sqrt(2)\nplus = (ket0 + ket1) / np.sqrt(2)\n\n# Compute inner product <+|0>\nbra_plus = plus.conj().T\noverlap = np.dot(bra_plus, ket0)[0, 0]\nprob = np.abs(overlap)**2\nprint(f"Overlap: {overlap:.4f}, Probability: {prob:.4f}")`
    },
    quiz: [
      {
        question: 'What is the magnitude of the complex phase factor e^{iπ/4}?',
        options: ['1.0', '0.7071', '0.0', '1.414'],
        correctIndex: 0,
        explanation: 'For any real θ, |e^{iθ}| = sqrt(cos²θ + sin²θ) = 1. A pure phase factor never alters measurement magnitude.'
      }
    ]
  },
  {
    id: 3,
    slug: 'matrices-unitaries-and-tensor-products',
    title: 'Matrices, Unitaries & Tensor Products',
    duration: '35 min',
    sectionId: 1,
    sectionTitle: 'Section 1: Foundations',
    summary: 'Linear operators in quantum mechanics: Hermitian observables, unitary evolution, matrix multiplication, and the Kronecker tensor product.',
    objectives: [
      'Identify unitary matrices satisfying U† U = I to preserve quantum normalization',
      'Understand Hermitian matrices as physical observables with real eigenvalues',
      'Calculate Kronecker tensor products A ⊗ B for multi-qubit systems'
    ],
    theory: `Because the norm of a state vector must remain 1 at all times, every closed-system quantum operation must be **unitary** ($U^\\dagger U = I$). This guarantees that quantum operations are reversible.\n\nWhen we have multiple independent quantum systems, their joint state space is described by the **tensor product** ($\n\otimes$). If system A is in state $|\\psi\\rangle$ (dimension 2) and system B is in state $|\\phi\\rangle$ (dimension 2), the composite system lives in a $2 \\times 2 = 4$-dimensional Hilbert space: $|\\psi\\rangle \\otimes |\\phi\\rangle$. For $n$ qubits, the vector space has dimension $2^n$.`,
    mathFormulae: [
      {
        label: 'Unitary Condition',
        latex: 'U^\\dagger U = U U^\\dagger = I, \\quad \\|U|\\psi\\rangle\\| = \\||\\psi\\rangle\\|',
        explanation: 'Unitary matrices preserve Euclidean length and inner products: probabilities always sum to 1.'
      },
      {
        label: 'Kronecker Tensor Product',
        latex: 'A \\otimes B = \\begin{bmatrix} a_{11}B & a_{12}B \\\\ a_{21}B & a_{22}B \\end{bmatrix}',
        explanation: 'Generates the 2^n × 2^n combined matrix representation for composite gates across multiple wires.'
      }
    ],
    interactiveType: 'gates',
    codeSample: {
      framework: 'Python / NumPy',
      code: `import numpy as np\n\nH = np.array([[1, 1], [1, -1]]) / np.sqrt(2)\nX = np.array([[0, 1], [1, 0]])\n\n# 2-qubit gate H (x) X\nH_tensor_X = np.kron(H, X)\nprint("Shape of H (x) X:", H_tensor_X.shape)\n\n# Check unitarity: U^dagger @ U == I\nidentity_test = np.allclose(H_tensor_X.conj().T @ H_tensor_X, np.eye(4))\nprint("Is H (x) X Unitary?", identity_test)`
    },
    quiz: [
      {
        question: 'How many complex amplitudes are required to describe the pure state of an 8-qubit quantum computer?',
        options: ['8', '16', '64', '256'],
        correctIndex: 3,
        explanation: 'An n-qubit state requires 2^n complex amplitudes. For 8 qubits, 2^8 = 256 amplitudes.'
      }
    ]
  },
  {
    id: 4,
    slug: 'physics-waves-photons-spin',
    title: 'The Physics: Waves, Photons & Spin',
    duration: '35 min',
    sectionId: 1,
    sectionTitle: 'Section 1: Foundations',
    summary: 'The physical origin of quantum behavior: double-slit experiment, photon polarization, wave-particle duality, and the Stern–Gerlach spin apparatus.',
    objectives: [
      'Analyze the double-slit experiment and observe wave-particle duality',
      'Explain how the Stern–Gerlach experiment proved quantization of angular momentum',
      'Map physical spin-1/2 systems to the mathematical qubit'
    ],
    theory: `In the early 20th century, classical physics broke down when investigating atomic-scale phenomena.\n\n- **Double-Slit Experiment**: Single electrons sent through two slits build an interference pattern on the detector screen over time. Even though each particle arrives as a discrete localized click, the probability distribution is governed by the wave equation.\n- **Stern–Gerlach (1922)**: Silver atoms passing through an inhomogeneous magnetic field split into strictly two discrete beams (spin up $+z$ and spin down $-z$), rather than a continuous spread. This quantization of angular momentum gives us the ideal two-level quantum system: the **qubit**.`,
    mathFormulae: [
      {
        label: 'de Broglie Wavelength',
        latex: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}',
        explanation: 'Every particle with momentum p exhibits an associated matter wave with wavelength λ.'
      },
      {
        label: 'Spin-1/2 Angular Momentum',
        latex: 'S_z |+\\rangle_z = +\\frac{\\hbar}{2}|+\\rangle_z, \\quad S_z |-\\rangle_z = -\\frac{\\hbar}{2}|-\\rangle_z',
        explanation: 'Measurement along any axis strictly yields ±ħ/2, matching the eigenvalues of Pauli Z.'
      }
    ],
    interactiveType: 'double_slit',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\n\n# Stern-Gerlach in circuits: measure in Z basis vs X basis\nqc = QuantumCircuit(1, 1)\n# State prepared in |+> (X eigenstate)\nqc.h(0)\n# Measure along Z axis gives 50% |0> and 50% |1>\nqc.measure(0, 0)\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'What happened when Otto Stern and Walther Gerlach sent silver atoms through an inhomogeneous magnetic field?',
        options: [
          'The beam smeared continuously across the detector plate',
          'The beam split into exactly two discrete deflected spots',
          'All atoms were absorbed by the magnet',
          'The atoms created a laser beam'
        ],
        correctIndex: 1,
        explanation: 'The atoms split into strictly two discrete lines, proving that spatial angular momentum is quantized into discrete eigenvalues.'
      }
    ]
  },

  // --- SECTION 2: THE QUBIT ---
  {
    id: 5,
    slug: 'qubit-and-bloch-sphere',
    title: 'The Qubit & the Bloch Sphere',
    duration: '35 min',
    sectionId: 2,
    sectionTitle: 'Section 2: The Qubit',
    summary: 'The geometry of quantum information: parameterizing a 2-level state as a 3D unit vector using spherical angles θ and φ.',
    objectives: [
      'Derive the Bloch sphere coordinates (x, y, z) from probability amplitudes',
      'Identify critical states: |0⟩, |1⟩, |+⟩, |-⟩, |+i⟩, |-i⟩ on the sphere',
      'Distinguish pure states on the surface (|r|=1) from mixed states in the interior (|r|<1)'
    ],
    theory: `A general single-qubit pure state is written as $|\\psi\\rangle = c_0|0\\rangle + c_1|1\\rangle$. Because global phase is unmeasurable, we can choose $c_0$ to be real and write:\n\n$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$\n\nwhere $\\theta \\in [0, \\pi]$ is the polar angle and $\\phi \\in [0, 2\\pi)$ is the azimuthal angle. This gives a 1-to-1 mapping onto the surface of a 3D sphere: the **Bloch Sphere**.\n\n- North pole ($\theta=0$): $|0\\rangle$\n- South pole ($\theta=\pi$): $|1\\rangle$\n- Equator ($\theta=\pi/2$): superpositions with varying relative phase $\\phi$.`,
    mathFormulae: [
      {
        label: 'Bloch Vector Components',
        latex: 'x = \\sin\\theta \\cos\\phi, \\quad y = \\sin\\theta \\sin\\phi, \\quad z = \\cos\\theta',
        explanation: 'Maps the quantum amplitudes directly to Cartesian coordinates inside the unit ball.'
      },
      {
        label: 'Purity and Bloch Length',
        latex: '|\\vec{r}|^2 = x^2 + y^2 + z^2 = 2\\text{Tr}(\\rho^2) - 1 \\le 1',
        explanation: 'Pure states have |r|=1 (surface). Entangled or noisy mixed states have |r|<1 (inside the sphere).'
      }
    ],
    interactiveType: 'bloch',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\nimport numpy as np\n\nqc = QuantumCircuit(1)\n# Rotate qubit by theta=pi/3, phi=pi/4\nqc.ry(np.pi/3, 0)\nqc.rz(np.pi/4, 0)\n\nsv = Statevector.from_instruction(qc)\nprint("Statevector:", sv.data)\nprint("Bloch Vector (x,y,z):", sv.to_dict())`
    },
    quiz: [
      {
        question: 'Where is the state |+⟩ = (|0⟩ + |1⟩)/√2 located on the Bloch sphere?',
        options: ['North pole (+z)', 'South pole (-z)', 'Intersection with +x axis on the equator', 'Inside at the center (0,0,0)'],
        correctIndex: 2,
        explanation: 'For |+⟩, θ = π/2 and φ = 0, which corresponds to coordinates x = sin(π/2)cos(0) = 1, y = 0, z = 0 (+x axis).'
      }
    ]
  },
  {
    id: 6,
    slug: 'single-qubit-gates',
    title: 'Single-Qubit Gates',
    duration: '30 min',
    sectionId: 2,
    sectionTitle: 'Section 2: The Qubit',
    summary: 'Master the fundamental rotations: Pauli X, Y, Z, Hadamard H, Phase S and T, and arbitrary Euler rotations Rx, Ry, Rz.',
    objectives: [
      'Apply Pauli matrices as 180° rotations around X, Y, Z axes',
      'Construct superpositions with the Hadamard gate H',
      'Understand the T gate (π/8 gate) and its critical role in fault-tolerant quantum computation'
    ],
    theory: `Every single-qubit quantum gate is a rotation of the Bloch vector on the Bloch sphere.\n\n- **X Gate (Bit-flip)**: 180° rotation around the X-axis. Swaps $|0\\rangle \\leftrightarrow |1\\rangle$.\n- **Z Gate (Phase-flip)**: 180° rotation around the Z-axis. Leaves $|0\\rangle$ unchanged and flips $|1\\rangle \\rightarrow -|1\\rangle$.\n- **Y Gate**: 180° rotation around the Y-axis: $Y = iXZ$.\n- **Hadamard Gate (H)**: A $180^\\circ$ rotation around the diagonal $(X+Z)/\\sqrt{2}$ axis. Maps computational basis states to superposition states: $H|0\\rangle = |+\\rangle$ and $H|1\\rangle = |-\\rangle$.\n- **S Gate & T Gate**: Rotations around the Z-axis by $\\pi/2$ and $\\pi/4$ respectively ($S = T^2$).`,
    mathFormulae: [
      {
        label: 'Pauli Matrix Suite',
        latex: 'X = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}, \\; Y = \\begin{bmatrix} 0 & -i \\\\ i & 0 \\end{bmatrix}, \\; Z = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}',
        explanation: 'The three orthogonal generator matrices for SU(2) Bloch sphere rotations.'
      },
      {
        label: 'Hadamard & Phase Operators',
        latex: 'H = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\quad T = \\begin{bmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{bmatrix}',
        explanation: 'Clifford group gates {H, S, CNOT} alone are classically simulable (Gottesman-Knill); adding T yields universal quantum computation.'
      }
    ],
    interactiveType: 'gates',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\nqc = QuantumCircuit(1)\nqc.h(0)  # Hadamard puts into |+>\nqc.t(0)  # T adds pi/4 phase -> |0> + e^{i pi/4}|1>\nqc.s(0)  # S adds pi/2 phase\n\nsv = Statevector.from_instruction(qc)\nprint("Final Statevector:\\n", sv.data)`
    },
    quiz: [
      {
        question: 'What is the result of applying H twice in a row (H · H) to any qubit state?',
        options: ['The state is inverted', 'The identity operation I (the state is restored)', 'A random state', 'A phase shift of π/2'],
        correctIndex: 1,
        explanation: 'H is its own inverse (Hermitian and unitary: H² = I). Applying H twice restores the original quantum state.'
      }
    ]
  },
  {
    id: 7,
    slug: 'many-qubits-and-tensor-products',
    title: 'Many Qubits & Tensor Products',
    duration: '35 min',
    sectionId: 2,
    sectionTitle: 'Section 2: The Qubit',
    summary: 'Scaling from 1 qubit to n qubits: the exponential 2ⁿ Hilbert space growth, separable states, and endianness.',
    objectives: [
      'Construct multi-qubit product statevectors using the Kronecker product',
      'Distinguish between big-endian (IBM/Qiskit) and little-endian conventions',
      'Understand the exponential memory explosion that prevents classical supercomputers from simulating >50 qubits'
    ],
    theory: `A classical byte of 8 bits holds exactly one 8-bit integer between 0 and 255 at any given moment. In contrast, an 8-qubit quantum register holds a superposition of all 256 configurations simultaneously:\n\n$$|\\psi\\rangle = c_{00000000}|00000000\\rangle + c_{00000001}|00000001\\rangle + \\dots + c_{11111111}|11111111\\rangle$$\n\nFor $n = 50$ qubits, there are $2^{50} \\approx 1.12 \\times 10^{15}$ complex numbers. Storing this statevector in double-precision floating-point requires **16 Petabytes of RAM**! For $n = 300$ qubits, the number of amplitudes ($2^{300}$) exceeds the total estimated number of atoms in the observable universe.`,
    mathFormulae: [
      {
        label: 'General Multi-Qubit State',
        latex: '|\\psi\\rangle = \\sum_{x \\in \\{0,1\\}^n} c_x |x\\rangle, \\quad \\sum_{x} |c_x|^2 = 1',
        explanation: 'Dimension of the vector space scales as 2^n with n qubits.'
      },
      {
        label: 'Separable (Product) State Condition',
        latex: '|\\psi_{AB}\\rangle = |\\psi_A\\rangle \\otimes |\\psi_B\\rangle',
        explanation: 'If a multi-qubit state can be factored into individual qubit states, it is unentangled (separable).'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\nqc = QuantumCircuit(3)\nqc.h(0)  # Superposition on qubit 0\nqc.x(2)  # Flip qubit 2\n\n# Qiskit uses little-endian: |q2 q1 q0>\nsv = Statevector.from_instruction(qc)\nprint("Amplitudes of 3-qubit state:")\nfor state, amp in sv.to_dict().items():\n    print(f"|{state}> : {amp:.3f}")`
    },
    quiz: [
      {
        question: 'Why can modern supercomputers simulate 40 qubits easily, but struggle with 60 qubits?',
        options: [
          'Because 60 qubits are physically hotter',
          'Because statevector memory scales exponentially as 2ⁿ (2⁶⁰ bytes ≈ 1 exabyte)',
          'Because quantum code compiles only on 64-bit architectures',
          'Because quantum algorithms only work on prime numbers'
        ],
        correctIndex: 1,
        explanation: 'Each added qubit doubles the required memory. 2⁶⁰ complex numbers require 16 Exabytes of memory, far exceeding any existing supercomputer.'
      }
    ]
  },
  {
    id: 8,
    slug: 'entanglement-bell-states-chsh',
    title: 'Entanglement, Bell States & CHSH',
    duration: '40 min',
    sectionId: 2,
    sectionTitle: 'Section 2: The Qubit',
    summary: 'The spooky core of quantum advantage: creating Bell pairs, verifying non-locality, and violating the classical CHSH inequality.',
    objectives: [
      'Synthesize all 4 maximally entangled Bell states using Hadamard and CNOT gates',
      'Explain the EPR paradox and Bell’s theorem: no local hidden variable theory can reproduce quantum mechanics',
      'Calculate the CHSH correlation expectation value and verify violation of the classical bound 2'
    ],
    theory: `Entanglement occurs when two or more particles become correlated such that the quantum state of each particle cannot be described independently of the state of the others.\n\nIn 1935, Einstein, Podolsky, and Rosen (EPR) argued that quantum mechanics was incomplete and must be governed by "local hidden variables." In 1964, John Bell devised a mathematical test (the Bell Inequality) that any local realistic theory must obey.\n\nIn the **CHSH formulation** with measurement settings $A, A'$ and $B, B'$:\n$$\\langle S \\rangle = |E(A, B) - E(A, B') + E(A', B) + E(A', B')| \\le 2 \\quad \\text{(Classical Limit)}$$\nQuantum mechanics predicts up to $2\\sqrt{2} \\approx 2.828$ (**Tsirelson's bound**). Decades of experiments (Aspect, Zeilinger, Clauser — Nobel Prize 2022) experimentally proved the universe is non-local.`,
    mathFormulae: [
      {
        label: 'The Four Bell States',
        latex: '|\\Phi^{\\pm}\\rangle = \\frac{|00\\rangle \\pm |11\\rangle}{\\sqrt{2}}, \\quad |\\Psi^{\\pm}\\rangle = \\frac{|01\\rangle \\pm |10\\rangle}{\\sqrt{2}}',
        explanation: 'Maximally entangled basis for 2 qubits. Measuring one qubit instantly determines the other.'
      },
      {
        label: 'CHSH Inequality & Quantum Bound',
        latex: '|\\langle S \\rangle_{\\text{classical}}| \\le 2, \\quad |\\langle S \\rangle_{\\text{quantum}}| \\le 2\\sqrt{2} \\approx 2.828',
        explanation: 'Violating the classical bound S > 2 proves physical non-locality.'
      }
    ],
    interactiveType: 'entanglement',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector\n\n# Prepare Bell State |Phi+> = (|00> + |11>)/sqrt(2)\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\n\nsv = Statevector.from_instruction(qc)\nprint("Bell State Amplitudes:")\nprint(sv.data)`
    },
    quiz: [
      {
        question: "What is the maximum correlation value ⟨S⟩ achievable in the CHSH inequality using quantum entanglement?",
        options: ['1.0', '2.0', '2√2 ≈ 2.828', '4.0'],
        correctIndex: 2,
        explanation: "Tsirelson's bound proves that the maximum quantum violation of the CHSH inequality is 2√2 ≈ 2.828, strictly beating the classical bound of 2."
      }
    ]
  },
  {
    id: 9,
    slug: 'measurement-mixed-states-and-noise',
    title: 'Measurement, Mixed States and Noise',
    duration: '25 min',
    sectionId: 2,
    sectionTitle: 'Section 2: The Qubit',
    summary: 'From clean states to reality: density matrices, partial trace, decoherence, T₁ relaxation, and T₂ dephasing.',
    objectives: [
      'Write quantum states as density matrices ρ to model statistical mixtures',
      'Compute reduced density matrices via partial trace to detect entanglement',
      'Differentiate T₁ energy relaxation (bit flips) from T₂ dephasing (phase flips)'
    ],
    theory: `In ideal simulations, we deal with pure states $|\\psi\\rangle$. But in physical hardware, qubits interact with their thermal environment, creating **mixed states** represented by density matrices:\n$$\\rho = \\sum_i p_i |\\psi_i\\rangle\\langle\\psi_i|, \\quad \\text{Tr}(\\rho) = 1, \\quad \\rho \\ge 0$$\n\nTwo fundamental physical decay times describe qubit quality:\n1. **$T_1$ (Relaxation Time)**: The time it takes for an excited state $|1\\rangle$ to lose energy to the environment and decay to the ground state $|0\\rangle$.\n2. **$T_2$ (Dephasing Time)**: The time it takes for the relative phase $\\phi$ between $|0\\rangle$ and $|1\\rangle$ to be scrambled by environmental magnetic fluctuations. Always bounded by $T_2 \\le 2T_1$.`,
    mathFormulae: [
      {
        label: 'Density Matrix Purity',
        latex: '\\gamma = \\text{Tr}(\\rho^2) \\quad (\\gamma = 1 \\text{ for pure states}, \\; \\gamma < 1 \\text{ for mixed states})',
        explanation: 'Measures how clean the state is. Maximally mixed state has purity 1/d.'
      },
      {
        label: 'T₁ Decay Law',
        latex: 'P(|1\\rangle, t) = e^{-t / T_1}, \\quad \\frac{1}{T_2} = \\frac{1}{2T_1} + \\frac{1}{T_\\phi}',
        explanation: 'Decoherence equations dictating how fast physical qubits lose their quantum information.'
      }
    ],
    interactiveType: 'noise',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import DensityMatrix, partial_trace\n\n# Create entangled Bell state\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nrho = DensityMatrix.from_instruction(qc)\n\n# Trace out qubit 1: qubit 0 becomes maximally mixed!\nrho_0 = partial_trace(rho, [1])\nprint("Reduced Density Matrix of Qubit 0:\\n", rho_0.data)\nprint("Purity of Qubit 0:", rho_0.purity().real)  # Exactly 0.5`
    },
    quiz: [
      {
        question: 'If you trace out one qubit of a maximally entangled Bell pair, what is the resulting state of the remaining qubit?',
        options: [
          'A pure state |0⟩',
          'A pure state |+⟩',
          'A maximally mixed state with purity 0.5',
          'An undefined state with zero trace'
        ],
        correctIndex: 2,
        explanation: 'Tracing out an entangled partner destroys phase coherence, leaving the remaining qubit in a completely random mixed state ρ = I/2 with purity 0.5.'
      }
    ]
  },

  // --- SECTION 3: CIRCUITS & ALGORITHMS ---
  {
    id: 10,
    slug: 'the-circuit-model',
    title: 'The Circuit Model: Building Quantum Programs',
    duration: '25 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'How quantum computers execute logic: quantum wire grid, circuit depth, universal gate libraries, and OpenQASM transpilation.',
    objectives: [
      'Read quantum circuit diagrams across multiple qubit wires and time steps',
      'Calculate circuit depth and total gate count to estimate decoherence limits',
      'Export circuits to OpenQASM 2.0 and 3.0 standards'
    ],
    theory: `The standard quantum programming paradigm is the **Circuit Model**. Wires represent qubits traveling from left to right through time. Boxes placed on the wires represent unitary gate transformations.\n\nKey metrics for circuit quality:\n- **Width**: Total number of qubits required.\n- **Depth**: The number of discrete time steps when gates execute in parallel. Because qubits decohere in time $T_2$, circuit depth must be kept smaller than $(T_2 / \\tau_{\\text{gate}})$.\n- **Two-Qubit Gate Count (CNOT/CZ)**: Two-qubit gates are typically $10\\times$ slower and have $10\\times$ higher error rates than single-qubit gates, so compilers aggressively optimize them.`,
    mathFormulae: [
      {
        label: 'Solovay-Kitaev Theorem',
        latex: '\\text{Gate Count} \\in O\\left(\\log^c(1/\\epsilon)\\right)',
        explanation: 'Any arbitrary single-qubit unitary can be approximated to error ε using a finite universal gate set.'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'OpenQASM 3.0',
      code: `OPENQASM 3.0;\ninclude "stdgates.inc";\n\nqubit[2] q;\nbit[2] c;\n\nh q[0];\ncx q[0], q[1];\nc[0] = measure q[0];\nc[1] = measure q[1];`
    },
    quiz: [
      {
        question: 'Why do quantum circuit transpilers try to minimize the count of 2-qubit gates (like CNOT)?',
        options: [
          'Because 2-qubit gates are typically 10x slower and have substantially higher error rates than 1-qubit gates',
          'Because 2-qubit gates violate the No-Cloning theorem',
          'Because 2-qubit gates cannot be simulated on classical computers',
          'Because CNOT requires cryogenic freezing'
        ],
        correctIndex: 0,
        explanation: 'Physical 2-qubit entangling gates have higher error rates (~0.1-1%) and longer pulse durations compared to 1-qubit rotations (~0.01-0.1%).'
      }
    ]
  },
  {
    id: 11,
    slug: 'teleportation-and-superdense-coding',
    title: 'Quantum Teleportation and Superdense Coding',
    duration: '25 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'Entanglement as a communication resource: transferring an unknown quantum state using classical bits, and packing 2 classical bits into 1 qubit.',
    objectives: [
      'Trace the 3-qubit Quantum Teleportation protocol step by step',
      'Verify that teleportation complies with the No-Cloning Theorem and relativistic causality (no faster-than-light signaling)',
      'Execute Superdense Coding to transmit two classical bits using one physical qubit'
    ],
    theory: `**Quantum Teleportation** (Bennett et al., 1993) transmits an unknown quantum state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ from Alice to Bob without physically sending the qubit itself.\n\n1. Alice and Bob share an entangled Bell pair $|\\Phi^+\\rangle_{AB} = (|00\\rangle + |11\\rangle)/\\sqrt{2}$.\n2. Alice performs a Bell measurement on her unknown state $|\\psi\\rangle$ and her half of the entangled pair.\n3. Her measurement collapses her qubits and yields 2 classical bits ($00, 01, 10, 11$).\n4. Alice sends these 2 classical bits to Bob over a classical channel.\n5. Depending on the bits received, Bob applies one of the four Pauli corrections ($I, X, Z, XZ$) to recover the exact state $|\\psi\\rangle$!\n\nNotice:\n- The original state in Alice's possession is destroyed by measurement (respecting the **No-Cloning Theorem**).\n- Bob cannot reconstruct the state until Alice's classical bits arrive (respecting the cosmic speed limit $c$).`,
    mathFormulae: [
      {
        label: 'Alice & Bob Shared 3-Qubit State',
        latex: '|\\psi\\rangle |\\Phi^+\\rangle = \\frac{1}{2} \\sum_{x=0}^1 \\sum_{z=0}^1 |\\text{Bell}_{xz}\\rangle_A \\otimes (X^x Z^z |\\psi\\rangle)_B',
        explanation: 'Decomposing the combined 3-qubit state into Alice’s Bell basis and Bob’s conditional outcomes.'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\n\n# Quantum Teleportation Circuit\nqc = QuantumCircuit(3, 2)\n# Shared Bell pair between qubit 1 (Alice) & qubit 2 (Bob)\nqc.h(1)\nqc.cx(1, 2)\n# Alice interacts unknown state (qubit 0) with her pair\nqc.cx(0, 1)\nqc.h(0)\nqc.measure([0, 1], [0, 1])\n# Bob applies corrections based on Alice's classical bits\nqc.cx(1, 2)\nqc.cz(0, 2)\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'Does Quantum Teleportation transmit information faster than the speed of light?',
        options: [
          'Yes, entanglement transmits data instantaneously across galaxies',
          'No, because Bob cannot decode the state until Alice transmits her 2 classical measurement bits (bounded by speed of light)',
          'Yes, but only in vacuum',
          'No, because quantum teleportation only works over optical fibers'
        ],
        correctIndex: 1,
        explanation: 'Bob’s state remains completely mixed until he receives Alice’s classical bits telling him which Pauli correction to apply. The speed of classical transmission bounds the protocol.'
      }
    ]
  },
  {
    id: 12,
    slug: 'deutsch-jozsa-and-bernstein-vazirani',
    title: 'Deutsch–Jozsa & Bernstein–Vazirani',
    duration: '30 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'The birth of quantum speedup: phase kickback, constant vs balanced functions, and finding hidden bitstrings in a single query.',
    objectives: [
      'Understand the phase kickback mechanism: U_f (|x⟩ ⊗ |−⟩) = (-1)^{f(x)} |x⟩ ⊗ |−⟩',
      'Solve the Deutsch–Jozsa problem in 1 quantum query vs 2ⁿ⁻¹ + 1 classical evaluations',
      'Execute Bernstein–Vazirani to discover an n-bit secret string s with O(1) complexity'
    ],
    theory: `The **Deutsch–Jozsa algorithm** was the first historical example showing an exponential separation between quantum and deterministic classical computation.\n\nProblem: A black box function $f: \\{0,1\\}^n \\rightarrow \\{0,1\\}$ is guaranteed to be either **constant** (output is always 0 or always 1) or **balanced** (output is 0 for half the inputs and 1 for the other half). How many queries are needed to determine which it is?\n- Classical worst-case: $2^{n-1} + 1$ queries.\n- Quantum: **Exactly 1 query**!\n\nBy feeding $|-\\rangle = (|0\\rangle - |1\\rangle)/\\sqrt{2}$ into the target wire, the function output $f(x)$ gets kicked back into the phase: $(-1)^{f(x)}|x\\rangle$. Applying a final layer of Hadamard gates causes all balanced paths to interfere destructively, leaving $|00\\dots0\\rangle$ with probability 1 if constant, and strictly 0 if balanced.`,
    mathFormulae: [
      {
        label: 'Phase Kickback Lemma',
        latex: 'U_f |x\\rangle |-\\rangle = (-1)^{f(x)} |x\\rangle |-\\rangle',
        explanation: 'The target qubit stays unchanged while the function value appears as a phase shift on the control state.'
      },
      {
        label: 'Bernstein-Vazirani Oracle',
        latex: 'f(x) = s \\cdot x = s_0 x_0 \\oplus s_1 x_1 \\oplus \\dots \\oplus s_{n-1} x_{n-1}',
        explanation: 'Finding secret string s requires n classical queries, but only 1 quantum query.'
      }
    ],
    interactiveType: 'gates',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\n\n# Bernstein-Vazirani for secret s = "101"\nqc = QuantumCircuit(4, 3)\nqc.x(3); qc.h(3)  # Target qubit in |->\nqc.h([0, 1, 2])   # Inputs in |+>\n\n# Oracle: CNOT where s_i == 1\nqc.cx(0, 3)\nqc.cx(2, 3)\n\n# Final Hadamard & measurement\nqc.h([0, 1, 2])\nqc.measure([0, 1, 2], [0, 1, 2])\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'How many evaluations of a black-box oracle f(x) does the Deutsch-Jozsa algorithm require to determine if f is constant or balanced?',
        options: ['2ⁿ evaluations', '2ⁿ⁻¹ + 1 evaluations', 'n evaluations', 'Exactly 1 quantum evaluation'],
        correctIndex: 3,
        explanation: 'Quantum parallelism and destructive interference determine whether f is constant or balanced in a single quantum query.'
      }
    ]
  },
  {
    id: 13,
    slug: 'grovers-search-amplitude-amplification',
    title: "Grover's Search: Amplitude Amplification",
    duration: '28 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'Quadratic speedup for unstructured search: geometric rotation in 2D state space, oracle phase inversion, and diffusion reflection.',
    objectives: [
      'Deconstruct the Grover iteration: Oracle phase flip R_w and Diffusion reflection R_s',
      'Explain the geometric 2D rotation of the state vector toward the target state |w⟩',
      'Calculate the optimal iteration count R ≈ (π/4)√N and understand overcooking'
    ],
    theory: `Searching an unsorted database of $N$ items classically requires $O(N)$ checks in the worst case (searching on average $N/2$ items). Lov Grover (1996) discovered an algorithm that finds the marked item in $O(\\sqrt{N})$ queries.\n\nGrover’s algorithm operates as a 2D rotation in the plane spanned by the uniform superposition $|s\\rangle$ and the target state $|w\\rangle$:\n1. **Oracle ($R_w$)**: Inverts the sign of the marked state: $|w\\rangle \\rightarrow -|w\\rangle$.\n2. **Diffusion ($R_s = 2|s\\rangle\\langle s| - I$)**: Reflects all amplitudes around their mean. This boosts the marked item's amplitude while lowering all other amplitudes.\n\nEach Grover iteration rotates the state vector by angle $\\theta \\approx 2/\\sqrt{N}$ toward the target. Stopping after $R \\approx \\frac{\\pi}{4}\\sqrt{N}$ steps yields the marked item with probability near 1. Running more iterations causes "overcooking" where the state rotates past the target!`,
    mathFormulae: [
      {
        label: 'Grover Diffusion Operator',
        latex: 'D = 2|s\\rangle\\langle s| - I = H^{\\otimes n}(2|0\\rangle\\langle 0| - I)H^{\\otimes n}',
        explanation: 'Inversion about the mean: amplitudes above the average increase, amplitudes below decrease.'
      },
      {
        label: 'Optimal Iteration Count',
        latex: 'R \\approx \\left\\lfloor \\frac{\\pi}{4}\\sqrt{\\frac{N}{M}} \\right\\rfloor',
        explanation: 'Exact number of iterations to maximize success probability for M target items out of N.'
      }
    ],
    interactiveType: 'grover',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\n\n# Grover search on 2 qubits (N=4, target=|11>)\nqc = QuantumCircuit(2, 2)\nqc.h([0, 1])\n\n# Oracle for |11> is a Controlled-Z\nqc.cz(0, 1)\n\n# Diffusion operator\nqc.h([0, 1])\nqc.x([0, 1])\nqc.cz(0, 1)\nqc.x([0, 1])\nqc.h([0, 1])\nqc.measure([0, 1], [0, 1])\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'If an unstructured database contains N = 1,000,000 items, approximately how many queries does Grover search need?',
        options: ['1,000,000 queries', '500,000 queries', 'Approximately 785 queries (≈ π/4 · 1000)', '20 queries'],
        correctIndex: 2,
        explanation: 'Grover requires (π/4)√N steps. For N = 1,000,000, √N = 1,000, so (π/4)·1000 ≈ 785 iterations.'
      }
    ]
  },
  {
    id: 14,
    slug: 'quantum-fourier-transform-qft',
    title: 'Quantum Fourier Transform and Phase Estimation',
    duration: '30 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'The mathematical powerhouse behind Shor’s algorithm: mapping computational basis states to phase rotations with O(n²) gate complexity.',
    objectives: [
      'Decompose the discrete Fourier transform onto individual qubit wires',
      'Construct QFT circuits using Hadamard gates and controlled phase rotations R_k',
      'Implement Quantum Phase Estimation (QPE) to extract eigenvalues of unitary operators'
    ],
    theory: `The **Quantum Fourier Transform (QFT)** is the quantum analogue of the classical Discrete Fourier Transform (DFT). While classical Fast Fourier Transform (FFT) requires $O(n 2^n)$ operations on $2^n$ numbers, QFT executes in only **$O(n^2)$ quantum gates**!\n\nQFT maps computational basis states $|x\\rangle$ into states where the binary value of $x$ is encoded into the relative phases of each qubit. It is the core engine inside **Quantum Phase Estimation (QPE)**, which estimates the phase $\\theta$ in the eigenvalue equation $U|u\\rangle = e^{2\\pi i \\theta}|u\\rangle$. Phase estimation in turn forms the heart of Shor's factoring algorithm, quantum chemistry Hamiltonian simulation, and HHL linear equation solvers.`,
    mathFormulae: [
      {
        label: 'QFT State Transformation',
        latex: '|j\\rangle \\xrightarrow{\\text{QFT}} \\frac{1}{\\sqrt{2^n}}\\sum_{k=0}^{2^n-1} e^{2\\pi i j k / 2^n} |k\\rangle',
        explanation: 'Transforms basis states into a Fourier superposition of relative phases.'
      },
      {
        label: 'Controlled Phase Gate R_k',
        latex: 'R_k = \\begin{bmatrix} 1 & 0 \\\\ 0 & e^{2\\pi i / 2^k} \\end{bmatrix}',
        explanation: 'Applies phase shifts inversely proportional to 2^k between wires.'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\nimport numpy as np\n\ndef qft_3qubit():\n    qc = QuantumCircuit(3)\n    qc.h(0)\n    qc.cp(np.pi/2, 1, 0)\n    qc.cp(np.pi/4, 2, 0)\n    qc.h(1)\n    qc.cp(np.pi/2, 2, 1)\n    qc.h(2)\n    qc.swap(0, 2)\n    return qc\n\nprint(qft_3qubit().draw())`
    },
    quiz: [
      {
        question: 'What is the circuit complexity of the Quantum Fourier Transform on n qubits compared to classical FFT on 2ⁿ amplitudes?',
        options: ['O(n²) quantum gates vs O(n · 2ⁿ) classical operations', 'O(2ⁿ) quantum gates vs O(n) classical operations', 'Both have complexity O(n³)', 'QFT requires exponential gates'],
        correctIndex: 0,
        explanation: 'QFT requires only n(n+1)/2 ≈ O(n²) elementary gates, an exponential reduction compared to the classical FFT complexity of O(n · 2ⁿ).'
      }
    ]
  },
  {
    id: 15,
    slug: 'shors-algorithm-factoring',
    title: "Shor's Algorithm: Factoring with Quantum Period Finding",
    duration: '30 min',
    sectionId: 3,
    sectionTitle: 'Section 3: Circuits & Algorithms',
    summary: 'The algorithm that shook global cryptography: reducing prime factorization to period finding via QFT in polynomial time O(n³).',
    objectives: [
      'Understand how RSA public-key encryption relies on the hardness of integer factorization',
      'Reduce the factoring of N = p · q to finding the period r of f(x) = a^x mod N',
      'Combine quantum period finding with classical continued fractions to find prime factors'
    ],
    theory: `In 1994, Peter Shor revealed that a quantum computer could factor large composite integers $N = p \\cdot q$ in **polynomial time $O((\\log N)^3)$**. Because modern internet encryption (RSA and Diffie-Hellman) relies on the classical hardness of factoring (best classical algorithm, the General Number Field Sieve, takes sub-exponential time $O(e^{c \\sqrt[3]{\\log N}}))$, Shor's algorithm proved that fault-tolerant quantum computers will break RSA.\n\nShor's insight was converting factoring into **period finding**:\n1. Choose a random integer $a < N$ coprime to $N$.\n2. Consider the periodic function $f(x) = a^x \\pmod N$. Its period is the smallest integer $r$ such that $a^r \\equiv 1 \\pmod N$.\n3. Use QPE + QFT to extract the period $r$.\n4. If $r$ is even and $a^{r/2} \\not\\equiv -1 \\pmod N$, then $\\gcd(a^{r/2} \\pm 1, N)$ reveals a non-trivial factor of $N$ via Euclid's classical algorithm!`,
    mathFormulae: [
      {
        label: 'Modular Exponentiation Periodicity',
        latex: 'a^{x + r} \\equiv a^x \\pmod N \\implies (a^{r/2} - 1)(a^{r/2} + 1) = k N',
        explanation: 'When r is even, at least one factor shares a greatest common divisor with N.'
      }
    ],
    interactiveType: 'shor',
    codeSample: {
      framework: 'Python (Classical factoring check)',
      code: `import math\n\ndef test_shor_step(N=15, a=7, r=4):\n    # If quantum step found r=4 for a=7 mod 15:\n    assert pow(a, r, N) == 1\n    factor1 = math.gcd(a**(r//2) - 1, N)\n    factor2 = math.gcd(a**(r//2) + 1, N)\n    print(f"Factors of {N}: {factor1} and {factor2}")\n\ntest_shor_step()`
    },
    quiz: [
      {
        question: "What mathematical property enables Shor's algorithm to factor integers in polynomial time?",
        options: [
          'Factoring can be reduced to period finding, which the Quantum Fourier Transform solves in polynomial time',
          'Quantum computers guess all prime numbers simultaneously',
          'Shor discovered a new classical formula for primes',
          'Quantum tunneling divides numbers by zero'
        ],
        correctIndex: 0,
        explanation: 'Shor proved that finding the period r of aˣ mod N yields the prime factors, and QFT extracts periods in polynomial time.'
      }
    ]
  },

  // --- SECTION 4: NISQ & BEYOND ---
  {
    id: 16,
    slug: 'variational-algorithms-vqe-qaoa',
    title: 'Variational Algorithms: VQE and QAOA',
    duration: '40 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'The leading hybrid quantum-classical algorithms for near-term noisy quantum hardware: simulating molecules and solving combinatorial optimization.',
    objectives: [
      'Formulate the Variational Quantum Eigensolver (VQE) for molecular ground state energies',
      'Apply the Rayleigh-Ritz variational principle ⟨H⟩_θ ≥ E₀',
      'Implement QAOA (Quantum Approximate Optimization Algorithm) for graph MaxCut'
    ],
    theory: `In today’s Noisy Intermediate-Scale Quantum (**NISQ**) era, qubits lack fault-tolerant error correction. Deep circuits like Shor's algorithm fail due to noise accumulation. To utilize current devices, physicists developed **hybrid quantum-classical algorithms**.\n\n**VQE (Variational Quantum Eigensolver)**:\n1. A parameterized quantum circuit (ansatz) prepares trial state $|\\psi(\\vec{\\theta})\\rangle$.\n2. The quantum processor measures expectation values $\\langle H \\rangle_{\\vec{\\theta}}$ of a Hamiltonian.\n3. A classical optimizer (COBYLA, SPSA, Adam) adjusts parameters $\\vec{\\theta}$ to minimize energy.\n4. By the Rayleigh-Ritz theorem, $\\langle H \\rangle_{\\vec{\\theta}} \\ge E_0$. The minimum found approximates the molecular ground state!`,
    mathFormulae: [
      {
        label: 'Rayleigh-Ritz Variational Principle',
        latex: '\\langle H \\rangle_{\\vec{\\theta}} = \\langle\\psi(\\vec{\\theta})| H |\\psi(\\vec{\\theta})\\rangle \\ge E_0',
        explanation: 'The expectation value of the Hamiltonian is always bounded from below by the true ground-state energy.'
      },
      {
        label: 'QAOA State Construction',
        latex: '|\\vec{\\gamma}, \\vec{\\beta}\\rangle = \\prod_{l=1}^p e^{-i \\beta_l B} e^{-i \\gamma_l C} |+\\rangle^{\\otimes n}',
        explanation: 'Alternates between cost Hamiltonian C (problem encoding) and mixer Hamiltonian B.'
      }
    ],
    interactiveType: 'vqe',
    codeSample: {
      framework: 'Qiskit Nature',
      code: `from qiskit.circuit.library import RealAmplitudes\n\n# 2-qubit hardware-efficient ansatz for VQE\nansatz = RealAmplitudes(2, reps=1)\nprint("VQE Parameterized Circuit:")\nprint(ansatz.decompose().draw())`
    },
    quiz: [
      {
        question: 'In the Variational Quantum Eigensolver (VQE), what role does the classical computer play?',
        options: [
          'It simulates the entire quantum statevector',
          'It optimizes the parameter vector θ using classical gradient or simplex routines to minimize energy',
          'It freezes the dilution refrigerator',
          'It encodes the quantum error correction code'
        ],
        correctIndex: 1,
        explanation: 'In hybrid algorithms, the quantum processor evaluates the quantum expectation value while the classical processor runs numerical optimization to update parameters.'
      }
    ]
  },
  {
    id: 17,
    slug: 'quantum-reservoir-computing-qml',
    title: 'Quantum Reservoir Computing & QML',
    duration: '40 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'Machine learning on quantum processors: parameterized quantum circuits as neural networks, quantum kernels, and chaotic reservoir dynamics.',
    objectives: [
      'Map classical data into quantum Hilbert space using feature maps U_Φ(x)',
      'Explain Quantum Reservoir Computing (QRC) using fixed complex multi-body dynamics',
      'Train linear readout weights on density matrix observables without backpropagating through quantum circuits'
    ],
    theory: `**Quantum Machine Learning (QML)** harnesses high-dimensional Hilbert spaces as non-linear feature maps. Classical data $\\vec{x}$ is embedded into a quantum state $|\\psi(\\vec{x})\\rangle = U_\\Phi(\\vec{x})|0\\rangle$.\n\nIn **Quantum Reservoir Computing (QRC)**, instead of optimizing every quantum gate (which suffers from **Barren Plateaus** — exponentially vanishing gradients in deep quantum neural networks), the quantum system acts as a fixed, non-linear, recurrent "reservoir." The complex natural quantum interactions (spin chains, random unitaries) project temporal data into high dimensions. Only a simple classical linear regression is trained on the measured output observables!`,
    mathFormulae: [
      {
        label: 'Quantum Kernel Trick',
        latex: 'K(x_i, x_j) = |\\langle\\psi(x_i)|\\psi(x_j)\\rangle|^2 = |\\langle 0| U_\\Phi^\\dagger(x_i) U_\\Phi(x_j) |0\\rangle|^2',
        explanation: 'Evaluates inner products in exponential Hilbert space directly on a quantum processor for Support Vector Machines.'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'PennyLane',
      code: `import pennylane as qml\n\ndev = qml.device("default.qubit", wires=2)\n\n@qml.qnode(dev)\ndef quantum_neural_net(weights, x):\n    qml.AngleEmbedding(x, wires=[0, 1])\n    qml.BasicEntanglerLayers(weights, wires=[0, 1])\n    return qml.expval(qml.PauliZ(0))`
    },
    quiz: [
      {
        question: 'What is the primary advantage of Quantum Reservoir Computing over fully trained variational quantum neural networks?',
        options: [
          'It avoids the barren plateau optimization problem because the quantum dynamics are fixed and only classical weights are trained',
          'It requires zero qubits',
          'It guarantees 100% classification accuracy on every dataset',
          'It works without electricity'
        ],
        correctIndex: 0,
        explanation: 'By keeping the complex quantum reservoir fixed and training only simple classical output weights, QRC completely bypasses the barren plateau problem.'
      }
    ]
  },
  {
    id: 18,
    slug: 'error-correction-and-fault-tolerance',
    title: 'Error Correction & Fault Tolerance',
    duration: '45 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'The holy grail of quantum computing: protecting delicate quantum information with stabilizer codes, surface codes, and fault-tolerant thresholds.',
    objectives: [
      'Overcome the No-Cloning theorem using entangled ancilla parity checks',
      'Understand the 3-qubit bit-flip and phase-flip error-detecting codes',
      'Explain the Surface Code (syndrome extraction via plaquettes and vertices) and its ~1% error threshold'
    ],
    theory: `Classical computers protect data by copying it (repetition code: $0 \\rightarrow 000$). In quantum mechanics, the **No-Cloning Theorem** forbids making exact copies of an unknown state $|\\psi\\rangle$.\n\nQuantum Error Correction (**QEC**) solves this dilemma by entangling the logical qubit across multiple physical qubits. By measuring multi-qubit parity operators (stabilizers) using ancilla qubits, we diagnose which error occurred (the **error syndrome**) without collapsing the superposed quantum data!\n\nThe leading architecture today is the **Surface Code**: physical qubits are laid out on a 2D square lattice with alternating $X$-type and $Z$-type syndrome check circuits. If physical gate error rates fall below the fault-tolerant threshold ($\sim 1\\%$, practically requiring $\le 10^{-3}$), increasing the code distance $d$ exponentially suppresses logical errors!`,
    mathFormulae: [
      {
        label: '3-Qubit Bit-Flip Logical Basis',
        latex: '|0_L\\rangle = |000\\rangle, \\quad |1_L\\rangle = |111\\rangle',
        explanation: 'Detects single-qubit X errors using parity checks Z₁Z₂ and Z₂Z₃.'
      },
      {
        label: 'Surface Code Distance Scaling',
        latex: 'P_{\\text{logical}} \\sim C \\left(\\frac{p}{p_{\\text{th}}}\\right)^{\\frac{d+1}{2}}',
        explanation: 'When physical error p < p_th, logical error rate decays exponentially with lattice distance d.'
      }
    ],
    interactiveType: 'error_correction',
    codeSample: {
      framework: 'Qiskit 1.0',
      code: `from qiskit import QuantumCircuit\n\n# 3-Qubit Bit-Flip Encoding Circuit\nqc = QuantumCircuit(3)\nqc.cx(0, 1)  # Entangle qubit 0 with 1\nqc.cx(0, 2)  # Entangle qubit 0 with 2\n# |psi> is now encoded as alpha|000> + beta|111>\nprint(qc.draw())`
    },
    quiz: [
      {
        question: 'Why cannot quantum computers simply use the classical 3-bit repetition code (copying |ψ⟩ into |ψ⟩|ψ⟩|ψ⟩)?',
        options: [
          'The No-Cloning Theorem forbids making identical copies of an arbitrary unknown quantum state',
          'Because 3 qubits are too expensive to build',
          'Because copying creates black holes',
          'Because repetition codes invert the phase'
        ],
        correctIndex: 0,
        explanation: 'The linearity of quantum mechanics dictates the No-Cloning Theorem: an unknown quantum state cannot be replicated perfectly.'
      }
    ]
  },
  {
    id: 19,
    slug: 'hardware-platforms-and-quantum-cryptography',
    title: 'Hardware Platforms and Quantum Cryptography',
    duration: '28 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'From physical implementations to unbreakable communications: comparing 5 hardware modalities and the BB84 QKD protocol.',
    objectives: [
      'Compare superconductors, trapped ions, neutral atoms, spin qubits, and photonics against the DiVincenzo criteria',
      'Trace the BB84 Quantum Key Distribution protocol step by step',
      'Detect eavesdropping (Eve) by analyzing the Quantum Bit Error Rate (QBER)'
    ],
    theory: `Building a quantum computer requires satisfying David DiVincenzo’s 5 criteria:\n1. Scalable physical qubits\n2. Ability to initialize states ($|00\\dots0\\rangle$)\n3. Long coherence times ($T_2 \\gg t_{\\text{gate}}$)\n4. Universal set of quantum gates\n5. Qubit-specific measurement capability\n\n**BB84 Quantum Key Distribution (QKD)**:\nInvented by Bennett and Brassard (1984), BB84 uses single photons polarized in one of two conjugate bases (Rectilinear $+: 0^\\circ/90^\\circ$ or Diagonal $\\times: 45^\\circ/135^\\circ$) to establish a shared cryptographic key. Any eavesdropper (Eve) intercepting the photons inevitably disturbs their quantum state, creating detectable errors ($QBER > 11\\%$) and blowing her cover!`,
    mathFormulae: [
      {
        label: 'BB84 Conjugate Bases',
        latex: '+: \\{|0\\rangle, |1\\rangle\\}, \\quad \\times: \\{|+\\rangle, |-\\rangle\\} = \\left\\{ \\frac{|0\\rangle+|1\\rangle}{\\sqrt{2}}, \\frac{|0\\rangle-|1\\rangle}{\\sqrt{2}} \\right\\}',
        explanation: 'Measuring in the wrong basis produces a 50% random result, revealing eavesdropping.'
      }
    ],
    interactiveType: 'bb84',
    codeSample: {
      framework: 'Python BB84 Sifting',
      code: `import random\n\nalice_bits = [1, 0, 1, 1, 0]\nalice_bases = ['+', 'x', '+', 'x', 'x']\nbob_bases   = ['+', '+', '+', 'x', '+']\n\n# Sifting phase: keep bits where bases matched\nshared_key = [b for b, ab, bb in zip(alice_bits, alice_bases, bob_bases) if ab == bb]\nprint("Matched Bases Shared Key:", shared_key)`
    },
    quiz: [
      {
        question: 'In the BB84 protocol, how do Alice and Bob detect whether an eavesdropper (Eve) intercepted their quantum transmission?',
        options: [
          'They check if the Quantum Bit Error Rate (QBER) on a test sample exceeds the acceptable threshold (~11%)',
          'They track Eve’s IP address on the fiber cable',
          'They ask Eve directly over telephone',
          'Eve’s detector generates a loud sonic boom'
        ],
        correctIndex: 0,
        explanation: 'Quantum measurement inevitably collapses superpositions; Eve measuring photons creates detectable bit errors (~25% error rate on intercepted bits).'
      }
    ]
  },
  {
    id: 20,
    slug: 'from-gates-to-pulses',
    title: 'From Gates to Pulses: How Hardware Computes',
    duration: '35 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'Bridging abstract quantum software and physical lab reality: microwave pulses, IQ mixing, Rabi drives, and DRAG leakage correction.',
    objectives: [
      'Translate unitary gates U into time-dependent microwave drive Hamiltonians H(t)',
      'Understand In-phase (I) and Quadrature (Q) modulation for arbitrary axis control',
      'Apply DRAG (Derivative Removal by Adiabatic Gate) to prevent leakage into non-computational state |2⟩'
    ],
    theory: `Quantum software engineers draw abstract boxes labeled "$X$" or "$H$". But at the physical hardware layer inside the dilution refrigerator, there are no boxes—only shaped **analog electromagnetic pulses** sent down coaxial cables!\n\nIn a superconducting transmon, an X gate is a Gaussian-shaped microwave pulse at the qubit's resonance frequency $\\omega_{01} \\approx 5\\text{ GHz}$. The pulse area $\\int \\Omega(t) dt = \\pi$ determines the rotation angle.\n\nHowever, transmons are weakly anharmonic oscillators: the transition from $|1\\rangle \\rightarrow |2\\rangle$ is separated by only $\\alpha \\approx -300\\text{ MHz}$. Short, fast pulses have wide Fourier frequency spectral tails that accidentally excite the $|2\\rangle$ state (**leakage**). To solve this, microwave engineers apply **DRAG** pulses: mixing a derivative of the Gaussian envelope into the Quadrature ($Q$) channel to cancel out spectral energy at the $|1\\rangle \\rightarrow |2\\rangle$ transition!`,
    mathFormulae: [
      {
        label: 'Drive Hamiltonian',
        latex: 'H_{\\text{drive}}(t) = \\frac{\\hbar}{2} \\left[ I(t)\\cos(\\omega_d t) - Q(t)\\sin(\\omega_d t) \\right] \\sigma_x',
        explanation: 'I(t) controls rotations around X, while Q(t) controls rotations around Y in the rotating frame.'
      },
      {
        label: 'DRAG Pulse Correction',
        latex: '\\Omega_Q(t) = -\\frac{1}{\\alpha} \\frac{d\\Omega_I(t)}{dt}',
        explanation: 'The quadrature derivative envelope destructively cancels transitions into the leakage state |2⟩.'
      }
    ],
    interactiveType: 'pulses',
    codeSample: {
      framework: 'Qiskit Pulse',
      code: `import numpy as np\n\ndef gaussian_drag(duration=160, amp=0.5, sigma=40, beta=1.5):\n    t = np.arange(duration) - duration / 2\n    # In-phase Gaussian envelope\n    env_I = amp * np.exp(-t**2 / (2 * sigma**2))\n    # Quadrature DRAG correction: -beta * d(env_I)/dt\n    env_Q = -beta * (-t / (sigma**2)) * env_I\n    return env_I, env_Q\n\nI, Q = gaussian_drag()\nprint(f"Generated DRAG pulse with {len(I)} waveform samples")`
    },
    quiz: [
      {
        question: 'What is the physical function of a DRAG (Derivative Removal by Adiabatic Gate) pulse in superconducting transmons?',
        options: [
          'It cools the qubit down to absolute zero',
          'It adds a derivative waveform to the quadrature channel to prevent leakage into the higher |2⟩ energy level',
          'It drags data over USB cables',
          'It turns quantum gates into classical NAND gates'
        ],
        correctIndex: 1,
        explanation: 'DRAG pulses suppress leakage into the third transmon level |2⟩ caused by spectral broadening of fast control pulses.'
      }
    ]
  },
  {
    id: 21,
    slug: 'calibration-and-benchmarking',
    title: 'Calibration and Benchmarking: Measuring a Qubit You Cannot See',
    duration: '50 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'The experimental calibration pipeline: Spectroscopy, Rabi, Ramsey, Echo, T₁, Readout discrimination, and Randomized Benchmarking (RB).',
    objectives: [
      'Execute the multi-stage hardware bring-up sequence from uncharacterized chip to calibrated gate set',
      'Distinguish T₁ energy loss from T₂* and T₂ Hahn echo coherence limits',
      'Fit Clifford randomized benchmarking decay curves to extract the average error per Clifford gate r'
    ],
    theory: `A fabricated quantum chip begins as an uncalibrated piece of cold silicon. Before running a single quantum circuit, experimental physicists run an automated **calibration graph**:\n\n1. **Resonator Spectroscopy**: Find readout resonator frequency $\\omega_r$.\n2. **Qubit Spectroscopy**: Find qubit transition frequency $\\omega_{01}$ by looking for dispersive shifts.\n3. **Rabi Experiment**: Vary pulse amplitude/duration to find exact $\\pi$ pulse for $X$.\n4. **Ramsey Experiment**: Two $\\pi/2$ pulses separated by delay $\\tau$ to measure detuning and dephasing $T_2^*$.\n5. **Hahn Echo**: Add central $\\pi$ pulse to refocus low-frequency noise and measure $T_2$.\n6. **$T_1$ Inversion Recovery**: Measure energy decay lifetime $T_1$.\n7. **Randomized Benchmarking (RB)**: Measure gate fidelity independent of state preparation and measurement (SPAM) errors by applying random sequences of Clifford gates of increasing depth $m$.`,
    mathFormulae: [
      {
        label: 'Randomized Benchmarking Decay Law',
        latex: 'F(m) = A p^m + B, \\quad r = \\frac{d-1}{d}(1 - p) = \\frac{1-p}{2} \\; (\\text{for } 1Q)',
        explanation: 'Decay parameter p yields the average gate infidelity r cleanly separated from SPAM errors (A, B).'
      },
      {
        label: 'Ramsey Fringe Formula',
        latex: 'P(|1\\rangle, \\tau) = \\frac{1}{2} + \\frac{1}{2}e^{-\\tau / T_2^*} \\cos(\\Delta\\omega \\cdot \\tau + \\phi)',
        explanation: 'Oscillation frequency reveals detuning Δω; envelope decay yields T₂*.'
      }
    ],
    interactiveType: 'characterization',
    codeSample: {
      framework: 'Python SciPy Curve Fit',
      code: `import numpy as np\nfrom scipy.optimize import curve_fit\n\ndef rb_decay(m, A, p, B):\n    return A * (p ** m) + B\n\n# Simulated Clifford sequence lengths\nseq_lengths = np.array([2, 10, 25, 50, 100, 200])\nsurvival_prob = np.array([0.98, 0.94, 0.88, 0.79, 0.65, 0.53])\n\npopt, _ = curve_fit(rb_decay, seq_lengths, survival_prob, p0=[0.5, 0.99, 0.5])\np = popt[1]\nerror_per_gate = (1 - p) / 2\nprint(f"Fitted p: {p:.5f}, Average Gate Error: {error_per_gate*100:.3f}%")`
    },
    quiz: [
      {
        question: 'Why is Randomized Benchmarking (RB) preferred over standard state tomography for measuring gate fidelity?',
        options: [
          'RB is independent of state preparation and measurement (SPAM) errors because errors accumulate across long Clifford sequences',
          'RB requires only classical computers',
          'RB does not require any pulses',
          'RB works only on broken qubits'
        ],
        correctIndex: 0,
        explanation: 'SPAM errors absorb into fitting constants A and B, while the decay parameter p purely measures the error rate of the Clifford gates.'
      }
    ]
  },
  {
    id: 22,
    slug: 'complexity-advantage-and-roadmap',
    title: 'Complexity, Advantage and Your Roadmap',
    duration: '28 min',
    sectionId: 4,
    sectionTitle: 'Section 4: NISQ & Beyond',
    summary: 'The big picture: computational complexity classes BQP, BPP, and NP; quantum supremacy milestones; and your career journey in quantum.',
    objectives: [
      'Locate BQP relative to P, BPP, NP, and PSPACE',
      'Analyze the milestone experiments (Google Sycamore, USTC Jiuzhang)',
      'Explore active research domains: quantum algorithms, error correction, cryogenic CMOS, and quantum software'
    ],
    theory: `Computational complexity theory formalizes what problems are inherently easy or hard:\n- **P**: Problems solvable by classical computers in polynomial time.\n- **BPP**: Problems solvable by classical randomized algorithms in polynomial time with bounded error.\n- **BQP**: Problems solvable by quantum computers in polynomial time with bounded error ($P \\subseteq BPP \\subseteq BQP \\subseteq PSPACE$).\n- **NP**: Problems whose solutions can be verified in polynomial time.\n\nNotice that $BQP$ does **not** contain all of $NP$. Quantum computers are not magic: they provide targeted polynomial to exponential speedups for structured problems (algebraic hidden subgroups, Hamiltonian simulation, period finding), but are not believed to solve general NP-complete problems in polynomial time.\n\nYour journey starts now: whether engineering superconducting circuits at 10 millikelvin, designing fault-tolerant surface codes, or programming quantum chemistry simulations on cloud QPUs!`,
    mathFormulae: [
      {
        label: 'Complexity Inclusion Chain',
        latex: '\\mathbf{P} \\subseteq \\mathbf{BPP} \\subseteq \\mathbf{BQP} \\subseteq \\mathbf{PP} \\subseteq \\mathbf{PSPACE}',
        explanation: 'Exact complexity hierarchy bounding quantum computational power.'
      }
    ],
    interactiveType: 'composer',
    codeSample: {
      framework: 'Quantum Roadmap Checklist',
      code: `# Congratulations on completing Quantum Academy!\nroadmap = [\n    "1. Practice on circuit composer & simulator",\n    "2. Master Qiskit / Cirq SDKs on GitHub",\n    "3. Solve challenge problems in Practice Arena",\n    "4. Experiment with real QPUs via IBM Quantum / Braket",\n    "5. Earn your verified QuanBit Quantum Certificate!"\n]\nfor step in roadmap:\n    print(step)`
    },
    quiz: [
      {
        question: 'Which of the following best describes the relationship between BQP (quantum polynomial time) and NP?',
        options: [
          'BQP contains all NP-complete problems',
          'BQP and NP overlap; BQP solves some problems in NP (like factoring) fast, but is not believed to solve all NP-complete problems in polynomial time',
          'BQP is identical to classical P',
          'BQP is smaller than classical P'
        ],
        correctIndex: 1,
        explanation: 'BQP contains problems like integer factoring (in NP, but not known to be NP-complete), but most computer scientists believe NP-complete ⊄ BQP.'
      }
    ]
  }
];

// ============================================================================
// 2. 5 HARDWARE ARCHITECTURES
// ============================================================================

export const HARDWARE_PLATFORMS: HardwarePlatform[] = [
  {
    id: 'superconducting',
    name: 'Superconducting Transmon',
    tagline: 'Microwave-controlled artificial atoms cooled to 10 mK',
    temp: '10 – 15 mK (-273.14 °C)',
    typicalT1: '50 – 300 µs',
    typicalT2: '40 – 200 µs',
    gateTime1Q: '15 – 30 ns',
    gateTime2Q: '50 – 200 ns',
    fidelity1Q: '99.95%',
    fidelity2Q: '99.5%',
    physicalMechanism: 'Josephson junction non-linear inductor paired with capacitive shunting, creating an anharmonic LC oscillator whose energy levels |0⟩ and |1⟩ can be addressed with gigahertz microwave pulses.',
    nativeGateSet: ['Virtual-Z', 'X(π)', 'X(π/2)', 'DRAG Pulse', 'CZ / iSWAP / Cross-Resonance (CR)'],
    pulseControl: 'AWG microwave generators with IQ mixing and DRAG envelope modulation at 4–7 GHz frequencies.',
    companies: ['IBM Quantum', 'Google Quantum AI', 'Rigetti', 'IQM', 'Alice & Bob'],
    pros: [
      'Ultra-fast nanosecond gate speeds (~20 ns)',
      'Lithographic fabrication compatible with mature semiconductor cleanrooms',
      'Fixed planar architecture ideal for 2D surface codes'
    ],
    cons: [
      'Strict dilution refrigerator requirement (10 mK)',
      'Qubit frequency crowding and cross-talk',
      'Shorter coherence times (hundreds of microseconds) compared to trapped ions'
    ],
    architectureDiagramDesc: 'Planar silicon/sapphire chip with niobium/aluminum planar resonators and Josephson junctions connected to SMA coaxial microwave lines in a dilution fridge.'
  },
  {
    id: 'trapped-ions',
    name: 'Trapped Ions',
    tagline: 'Pristine atomic ions suspended in vacuum by RF electric fields',
    temp: 'Room temp / 4 Kelvin (motional ground state at microkelvin)',
    typicalT1: 'Minutes to Hours',
    typicalT2: '1 – 10 seconds',
    gateTime1Q: '1 – 10 µs',
    gateTime2Q: '50 – 500 µs',
    fidelity1Q: '99.99%',
    fidelity2Q: '99.8%',
    physicalMechanism: 'Naturally identical atomic ions (¹⁷¹Yb⁺, ⁴⁰Ca⁺, or ⁹Be⁺) trapped in an ultra-high vacuum chamber via oscillating RF quadrupole electric fields (Paul trap) and cooled by lasers to their motional ground state.',
    nativeGateSet: ['R(θ, φ) Raman/Laser drive', 'Mølmer–Sørensen (MS) entangling gate'],
    pulseControl: 'UV and optical pulsed laser beams or focused AOM/EOM laser channels addressing individual ions.',
    companies: ['IonQ', 'Quantinuum', 'Alpine Quantum Technologies (AQT)'],
    pros: [
      'Every qubit is naturally identical (no manufacturing variations)',
      'World-record coherence times (seconds to hours)',
      'All-to-all connectivity in ion chains via shared phonon collective vibrations'
    ],
    cons: [
      'Gate speeds are much slower (microseconds to hundreds of microseconds)',
      'Scaling long ion chains requires shuttling ions (QCCD architecture)',
      'Complex laser optical alignment systems'
    ],
    architectureDiagramDesc: 'Linear RF Paul trap microchip inside ultra-high vacuum chamber with multi-channel laser addressing arrays and EMCCD fluorescence imaging camera.'
  },
  {
    id: 'neutral-atoms',
    name: 'Neutral Atoms',
    tagline: 'Arrays of individual neutral atoms arranged by optical tweezers',
    temp: 'Microkelvin (laser cooling in UHV)',
    typicalT1: '1 – 10 seconds',
    typicalT2: '0.1 – 1 second',
    gateTime1Q: '1 – 5 µs',
    gateTime2Q: '100 – 300 ns',
    fidelity1Q: '99.9%',
    fidelity2Q: '99.5%',
    physicalMechanism: 'Individual neutral rubidium or cesium atoms trapped in focused optical tweezer laser beams in 1D, 2D, or 3D geometries. Two-qubit gates are actuated by exciting atoms to high-principal-quantum-number Rydberg states (n ~ 70), where strong dipole-dipole interactions create the Rydberg blockade.',
    nativeGateSet: ['Global/Local Rabi Rotations', 'Controlled-Phase via Rydberg Blockade'],
    pulseControl: 'Spatial Light Modulators (SLMs) and Acousto-Optic Deflectors (AODs) steering optical tweezer lattices.',
    companies: ['QuEra Computing', 'Infleqtion', 'PASQAL'],
    pros: [
      'High qubit counts (100 – 1000+ qubits demonstrated in reconfigurable 2D/3D lattices)',
      'Dynamic physical shuttle and reorganization of qubits during computation',
      'Identical atoms with zero fabrication defects'
    ],
    cons: [
      'Atom loss and reloading probability',
      'Short Rydberg state lifetimes (~100 µs)',
      'Laser phase noise and optical alignment complexity'
    ],
    architectureDiagramDesc: 'Ultra-high vacuum chamber with 2D array of optical tweezers created by SLMs, laser cooling beams, and high-numerical-aperture objective lenses.'
  },
  {
    id: 'silicon-spin',
    name: 'Silicon Spin Qubits',
    tagline: 'Electron and hole spins in gate-defined quantum dots',
    temp: '1 Kelvin (Hotter than superconducting qubits)',
    typicalT1: '1 – 10 milliseconds',
    typicalT2: '0.1 – 1 millisecond (in isotopically purified ²⁸Si)',
    gateTime1Q: '10 – 50 ns',
    gateTime2Q: '40 – 200 ns',
    fidelity1Q: '99.9%',
    fidelity2Q: '99.0%',
    physicalMechanism: 'Single electron or hole spins trapped in electrostatically defined potential wells (quantum dots) formed by nanoscale metallic gates on isotopically purified silicon-28 or silicon-germanium (SiGe) heterostructures.',
    nativeGateSet: ['EDSR (Electric Dipole Spin Resonance)', 'Exchange Coupling SWAP / sqrt(SWAP)'],
    pulseControl: 'High-speed gigahertz voltage pulses applied to barrier and plunger gate electrodes.',
    companies: ['Intel Quantum', 'Diraq', 'Quantum Motion', 'HRL Laboratories'],
    pros: [
      'Extremely compact footprint (~100 nm, 10,000x smaller than superconducting transmons)',
      'Direct compatibility with standard commercial 300 mm CMOS semiconductor fabs',
      'Can operate at 1 Kelvin ("hot qubits"), enabling on-chip cryo-CMOS control electronics'
    ],
    cons: [
      'Extreme sensitivity to interface disorder and charge noise',
      'Cramped nanoscale interconnect routing problem',
      'Variability in valley splitting energies in silicon'
    ],
    architectureDiagramDesc: '300mm silicon wafer with multi-layer aluminum/polysilicon gate stacks defining nanoscale electrostatic quantum dots and single-electron transistor electrometers.'
  },
  {
    id: 'photonic',
    name: 'Photonic Quantum Computing',
    tagline: 'Flying optical qubits operating at room temperature',
    temp: 'Room Temperature (detectors require 1 – 4 K)',
    typicalT1: 'Infinite (Photons do not decay; loss is the failure mode)',
    typicalT2: 'Microseconds (optical path length)',
    gateTime1Q: 'Instantaneous (Speed of light flight through waveguides)',
    gateTime2Q: 'Measurement-induced (Fusion gates)',
    fidelity1Q: '99.9%',
    fidelity2Q: '99.0%',
    physicalMechanism: 'Information is encoded in single photons traveling through optical fibers or on-chip silicon photonic waveguides (dual-rail spatial encoding, polarization, or time-bin). Two-qubit logic is achieved via Hong-Ou-Mandel quantum interference on beam splitters combined with measurement (Fusion-based quantum computing).',
    nativeGateSet: ['Beam Splitter (BS)', 'Phase Shifter (PS)', 'Fusion Gate via SNSPD detection'],
    pulseControl: 'Thermo-optic and electro-optic phase modulators on silicon photonics chips.',
    companies: ['PsiQuantum', 'Xanadu', 'Quandela'],
    pros: [
      'Room-temperature qubit operations along optical waveguides',
      'No thermal decoherence; photons do not interact with stray magnetic fields',
      'Natural seamless integration into global quantum optical networks'
    ],
    cons: [
      'Photons do not easily interact with each other (non-linear gates are probabilistic)',
      'Photon loss in waveguides and coupling interfaces',
      'Requires millions of components to generate entangled cluster states'
    ],
    architectureDiagramDesc: 'Silicon-on-insulator (SOI) photonic integrated circuit with integrated laser sources, microring resonators, Mach-Zehnder interferometers, and superconducting nanowire single-photon detectors (SNSPDs).'
  }
];

// ============================================================================
// 3. EXPERIMENTAL CHARACTERIZATION BENCH PROCEDURES
// ============================================================================

export const CHARACTERIZATION_EXPERIMENTS: CharacterizationExperiment[] = [
  {
    id: 'qubit-spectroscopy',
    name: 'Qubit Spectroscopy (f₀₁ Scan)',
    purpose: 'Identify the exact resonance frequency f₀₁ of the qubit transition |0⟩ → |1⟩.',
    parameterSwept: 'Drive Frequency f_d',
    measuredQuantity: 'Readout Resonator Voltage Amplitude',
    fitModel: 'Lorentzian Peak: V(f) = A / (1 + 4((f - f₀₁) / γ)²) + B',
    extractedMetric: 'Qubit Frequency f₀₁ and Linewidth γ',
    typicalValue: '4.982 GHz (Linewidth ~ 2.4 MHz)',
    xRange: [4.90, 5.06],
    xUnit: 'GHz',
    yUnit: 'V_out (mV)',
    xLabel: 'Microwave Drive Frequency (GHz)',
    yLabel: 'Readout Voltage (mV)',
    description: 'We sweep the frequency of a weak, long microwave saturation tone while monitoring the transmission of a coupled readout resonator. When the drive hits the exact qubit transition frequency f₀₁, the qubit absorbs photons, shifts the resonator dispersively, and creates a Lorentzian dip/peak.',
    simulationFormula: (f, noise) => {
      const f0 = 4.982;
      const gamma = 0.008;
      const lorentzian = 1.0 - 0.7 / (1 + 4 * Math.pow((f - f0) / gamma, 2));
      return lorentzian + (Math.random() - 0.5) * noise * 0.1;
    }
  },
  {
    id: 'rabi-oscillation',
    name: 'Rabi Oscillations (π-Pulse Calibration)',
    purpose: 'Calibrate the exact pulse amplitude or duration required to perform an X (π) and X/2 (π/2) gate.',
    parameterSwept: 'Microwave Pulse Amplitude',
    measuredQuantity: 'Excited State Population P(|1⟩)',
    fitModel: 'Damped Cosine: P(A) = A₀ - B · cos(2π f_R A) · exp(-A / A_decay)',
    extractedMetric: 'π-pulse Amplitude A_π',
    typicalValue: '0.428 a.u. (X gate calibrated)',
    xRange: [0, 1.0],
    xUnit: 'a.u.',
    yUnit: 'P(|1⟩)',
    xLabel: 'Drive Pulse Amplitude (arbitrary units)',
    yLabel: 'Excited State Probability P(|1⟩)',
    description: 'We send a resonant microwave pulse of increasing amplitude and measure the resulting qubit population. The state vector rotates continuously around the X-axis of the Bloch sphere. The first maximum corresponds to a π rotation (X gate, population = 1); the first zero-crossing corresponds to a π/2 rotation (Hadamard/Superposition).',
    simulationFormula: (A, noise) => {
      const fR = 1.168; // 1/(2 * 0.428)
      const p = 0.5 - 0.49 * Math.cos(2 * Math.PI * fR * A) * Math.exp(-A / 3.0);
      return Math.max(0, Math.min(1, p + (Math.random() - 0.5) * noise * 0.08));
    }
  },
  {
    id: 'ramsey-fringes',
    name: 'Ramsey Fringes (Detuning & T₂*)',
    purpose: 'Measure the dephasing time T₂* and fine-tune the exact qubit frequency detuning Δf.',
    parameterSwept: 'Delay Time τ between two π/2 pulses',
    measuredQuantity: 'P(|1⟩)',
    fitModel: 'Damped Oscillation: P(τ) = 0.5 + 0.5 · cos(2π Δf τ + φ) · exp(-τ / T₂*)',
    extractedMetric: 'Dephasing Time T₂* and Detuning Δf',
    typicalValue: 'T₂* = 48.5 µs, Δf = 0.25 MHz',
    xRange: [0, 100],
    xUnit: 'µs',
    yUnit: 'P(|1⟩)',
    xLabel: 'Inter-pulse Delay τ (µs)',
    yLabel: 'P(|1⟩)',
    description: 'We apply a π/2 pulse to place the qubit on the equator of the Bloch sphere, wait an idle delay τ while the state precesses around the Z-axis due to an intentional detuning Δf, and apply a second π/2 pulse. The oscillation frequency gives the exact detuning, and the exponential decay envelope gives the inhomogeneous dephasing time T₂*.',
    simulationFormula: (tau, noise) => {
      const T2star = 48.5;
      const deltaF = 0.12; // MHz
      const p = 0.5 + 0.47 * Math.cos(2 * Math.PI * deltaF * tau) * Math.exp(-tau / T2star);
      return Math.max(0, Math.min(1, p + (Math.random() - 0.5) * noise * 0.08));
    }
  },
  {
    id: 'hahn-echo',
    name: 'Hahn Spin Echo (True Coherence T₂)',
    purpose: 'Eliminate low-frequency 1/f magnetic flux noise and extract the true decoherence time T₂.',
    parameterSwept: 'Total Delay 2τ with refocusing π-pulse',
    measuredQuantity: 'P(|1⟩)',
    fitModel: 'Exponential Decay: P(2τ) = 0.5 + 0.5 · exp(-(2τ / T₂)^α)',
    extractedMetric: 'Echo Coherence Time T₂',
    typicalValue: 'T₂ = 92.4 µs (Nearly 2x longer than T₂*)',
    xRange: [0, 150],
    xUnit: 'µs',
    yUnit: 'P(|1⟩)',
    xLabel: 'Total Evolution Time 2τ (µs)',
    yLabel: 'Echo Signal P(|1⟩)',
    description: 'In a Ramsey test, low-frequency environmental noise dephases different runs at slightly different rates. By inserting an inversion π pulse halfway through the delay (τ — π — τ), the forward and backward dephasing cancel out at time 2τ. This spin echo recovers the state and reveals the true intrinsic coherence limit T₂.',
    simulationFormula: (twoTau, noise) => {
      const T2 = 92.4;
      const p = 0.5 + 0.48 * Math.exp(-Math.pow(twoTau / T2, 1.2));
      return Math.max(0, Math.min(1, p + (Math.random() - 0.5) * noise * 0.06));
    }
  },
  {
    id: 't1-relaxation',
    name: 'T₁ Energy Relaxation (Lifetime)',
    purpose: 'Measure how long an excited qubit can maintain its quantum energy before decaying to ground state |0⟩.',
    parameterSwept: 'Wait Delay τ after π-pulse',
    measuredQuantity: 'Excited State Probability P(|1⟩)',
    fitModel: 'Pure Exponential Decay: P(τ) = A · exp(-τ / T₁) + B',
    extractedMetric: 'Relaxation Lifetime T₁',
    typicalValue: 'T₁ = 112.8 µs',
    xRange: [0, 250],
    xUnit: 'µs',
    yUnit: 'P(|1⟩)',
    xLabel: 'Delay Time τ (µs)',
    yLabel: 'P(|1⟩)',
    description: 'We prepare the qubit in the excited state |1⟩ using a calibrated π pulse, wait an increasing delay time τ, and measure the remaining probability of being in state |1⟩. Spontaneous emission into the microwave environment causes the population to decay exponentially with characteristic time constant T₁.',
    simulationFormula: (tau, noise) => {
      const T1 = 112.8;
      const p = 0.98 * Math.exp(-tau / T1) + 0.02;
      return Math.max(0, Math.min(1, p + (Math.random() - 0.5) * noise * 0.05));
    }
  },
  {
    id: 'randomized-benchmarking',
    name: 'Randomized Benchmarking (Clifford Gate Error)',
    purpose: 'Determine the average gate error rate r independent of State Preparation and Measurement (SPAM) errors.',
    parameterSwept: 'Clifford Sequence Length m',
    measuredQuantity: 'Ground State Survival Probability',
    fitModel: 'Zero-th order RB decay: F(m) = A · p^m + B, with r = (1 - p) / 2',
    extractedMetric: 'Average 1Q Clifford Error r',
    typicalValue: 'r = 0.062% (Gate Fidelity = 99.938%)',
    xRange: [2, 300],
    xUnit: 'Cliffords',
    yUnit: 'Survival Fidelity',
    xLabel: 'Clifford Sequence Length m (number of gates)',
    yLabel: 'Sequence Fidelity F(m)',
    description: 'We apply random sequences of m Clifford gates, compute the unique inverse Clifford gate to restore |0⟩, and measure the survival probability. As m increases, gate errors accumulate and drive the state toward the maximally mixed state (F = 0.5). Fitting the decay curve gives the depolarization parameter p and the exact average error per gate r.',
    simulationFormula: (m, noise) => {
      const p = 0.99876;
      const A = 0.48;
      const B = 0.50;
      const f = A * Math.pow(p, m) + B;
      return Math.max(0, Math.min(1, f + (Math.random() - 0.5) * noise * 0.04));
    }
  }
];

// ============================================================================
// 4. 21 PLAYGROUND MINI-LABS
// ============================================================================

export const PLAYGROUND_LABS: PlaygroundLab[] = [
  { id: 'bloch-3d', title: '3D Bloch Sphere Explorer', category: 'qubits', difficulty: 'Beginner', description: 'Freely rotate camera, adjust spherical angles θ and φ, and watch the state vector move in real-time 3D.', iconName: 'Globe' },
  { id: 'gate-matrix', title: 'Gate Matrix & Phase Inspector', category: 'gates', difficulty: 'Beginner', description: 'Inspect unitary matrices, eigenvalue decompositions, and phase shifts for all standard quantum logic gates.', iconName: 'Grid' },
  { id: 'bloch-puzzles', title: 'Bloch Target Matcher Game', category: 'qubits', difficulty: 'Beginner', description: 'Interactive puzzle: reach randomly chosen target states on the sphere using the fewest gate rotations.', iconName: 'Target' },
  { id: 'tensor-lab', title: 'Multi-Qubit State & Tensor Lab', category: 'foundations', difficulty: 'Intermediate', description: 'Combine 2 and 3 qubit statevectors using Kronecker tensor products and test for separability.', iconName: 'Layers' },
  { id: 'chsh-game', title: 'CHSH Bell Inequality Simulator', category: 'foundations', difficulty: 'Intermediate', description: 'Run thousands of simulated Bell tests to observe violation of the classical bound 2 up to Tsirelson’s 2.828.', iconName: 'Zap' },
  { id: 'noise-lab', title: 'Quantum Noise & Decoherence Simulator', category: 'hardware', difficulty: 'Intermediate', description: 'Simulate T₁ amplitude damping, T₂ phase damping, and depolarizing noise on density matrices.', iconName: 'Activity' },
  { id: 'grover-visualizer', title: 'Grover Search Iterations Visualizer', category: 'algorithms', difficulty: 'Intermediate', description: 'Watch probability amplitudes rotate in 2D space step by step through oracle and diffusion operators.', iconName: 'Sparkles' },
  { id: 'qft-wheel', title: 'QFT Phase Wheel & State Rotations', category: 'algorithms', difficulty: 'Intermediate', description: 'Inspect the discrete Fourier transform as individual clock rotations on each qubit register wire.', iconName: 'RotateCcw' },
  { id: 'shor-period', title: "Shor's Period-Finding Visualizer", category: 'algorithms', difficulty: 'Advanced', description: 'Calculate the order r of f(x) = aˣ mod N and follow continued fractions to find non-trivial factors.', iconName: 'Key' },
  { id: 'vqe-molecule', title: 'VQE Molecular Ground State (H₂)', category: 'algorithms', difficulty: 'Advanced', description: 'Vary interatomic bond distances and optimize variational ansatz angles to compute the ground-state dissociation energy of H₂.', iconName: 'Atom' },
  { id: 'qaoa-maxcut', title: 'QAOA MaxCut Graph Partitioning', category: 'algorithms', difficulty: 'Advanced', description: 'Formulate graph MaxCut problem Hamiltonians and optimize γ and β parameters for optimal cut approximation.', iconName: 'Share2' },
  { id: 'qrc-reservoir', title: 'Quantum Reservoir Dynamics Lab', category: 'algorithms', difficulty: 'Advanced', description: 'Feed time-series data into a disordered quantum spin chain and train linear readout weights.', iconName: 'Cpu' },
  { id: 'bb84-qkd', title: 'BB84 Quantum Key Distribution Simulator', category: 'cryptography', difficulty: 'Beginner', description: 'Simulate Alice, Bob, and Eve eavesdropping; calculate quantum bit error rate (QBER) and detect intrusions.', iconName: 'ShieldCheck' },
  { id: 'error-correction-code', title: '3-Qubit Quantum Error Correction Code', category: 'hardware', difficulty: 'Intermediate', description: 'Inject bit-flip and phase-flip errors into 3-qubit code states and inspect ancilla syndrome extraction.', iconName: 'LifeBuoy' },
  { id: 'double-slit', title: 'Double-Slit Wave-Particle Interference', category: 'foundations', difficulty: 'Beginner', description: 'Fire single photons or electrons through two slits; toggle detector measurement to witness wave collapse.', iconName: 'Eye' },
  { id: 'mach-zehnder', title: 'Mach–Zehnder Interferometer', category: 'foundations', difficulty: 'Beginner', description: 'Trace single photons through 50:50 beam splitters and phase shifters to demonstrate constructive interference.', iconName: 'Sliders' },
  { id: 'stern-gerlach', title: 'Stern–Gerlach Spin Filter Cascade', category: 'foundations', difficulty: 'Beginner', description: 'Pass silver atoms through sequential X, Z, and X magnets to explore non-commuting spin measurements.', iconName: 'Compass' },
  { id: 'complex-plane', title: 'Complex Plane Amplitudes & Phases', category: 'foundations', difficulty: 'Beginner', description: 'Interactive phasor sandbox: add, multiply, conjugate, and visualize complex numbers as rotating vectors.', iconName: 'Compass' },
  { id: 'speedup-curves', title: 'Quantum vs Classical Algorithmic Speedup', category: 'algorithms', difficulty: 'Beginner', description: 'Plot complexity curves: O(N) vs O(√N) for Grover, and exponential GNF vs O(log³N) for Shor.', iconName: 'TrendingUp' },
  { id: 'density-matrix-entropy', title: 'Density Matrix & Entanglement Entropy', category: 'qubits', difficulty: 'Intermediate', description: 'Calculate von Neumann entanglement entropy S(ρ) = -Tr(ρ log₂ ρ) across bipartite pure and mixed states.', iconName: 'PieChart' },
  { id: 'teleportation-tracer', title: 'Teleportation & Superdense Wire Tracer', category: 'algorithms', difficulty: 'Intermediate', description: 'Step through the 3-qubit teleportation circuit wire by wire and observe the state reconstruct at Bob.', iconName: 'Radio' }
];

// ============================================================================
// 5. GLOSSARY (160+ TERMS)
// ============================================================================

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Amplitude', category: 'Math', definition: 'A complex number c_x whose squared modulus |c_x|² represents the probability of measuring that specific basis state.', formula: 'P(x) = |c_x|²' },
  { term: 'Ancilla Qubit', category: 'Hardware', definition: 'An auxiliary qubit used to assist in quantum calculations, error syndrome detection, or intermediate measurement without disturbing data qubits.' },
  { term: 'Anharmonicity', category: 'Hardware', definition: 'The energy difference between the 0→1 and 1→2 transition frequencies in a transmon qubit: α = ω₁₂ - ω₀₁. Allows selective 2-level addressing.', formula: '\\alpha = \\omega_{12} - \\omega_{01}' },
  { term: 'Ansatz', category: 'Algorithms', definition: 'A parameterized guess of a quantum circuit U(θ) used in variational algorithms like VQE and QAOA to approximate target wavefunctions.' },
  { term: 'Barren Plateau', category: 'Algorithms', definition: 'A phenomenon in quantum machine learning where the gradient of the loss function vanishes exponentially with system size, making training impossible.' },
  { term: 'Beam Splitter', category: 'Hardware', definition: 'An optical component that splits light into transmitted and reflected paths. Acts as an optical Hadamard gate on single photon modes.' },
  { term: 'Bell State', category: 'Physics', definition: 'One of the four maximally entangled 2-qubit states forming an orthonormal basis for two-qubit Hilbert space.', formula: '|\\Phi^+\\rangle = (|00\\rangle+|11\\rangle)/\\sqrt{2}' },
  { term: "Bell's Theorem", category: 'Physics', definition: 'Proves that no physical theory of local hidden variables can ever reproduce all the predictions of quantum mechanics.' },
  { term: 'Big-Endian', category: 'Math', definition: 'A bit-ordering convention where the leftmost qubit has the highest positional value: |q_0 q_1 ... q_{n-1}⟩.' },
  { term: 'Bit-Flip Error', category: 'Error Correction', definition: 'A quantum error where state |0⟩ flips to |1⟩ and vice versa, equivalent to applying a Pauli X operator.' },
  { term: 'Bloch Sphere', category: 'Physics', definition: 'A geometrical representation of the pure state space of a 2-level quantum system (qubit) as the surface of a unit sphere.' },
  { term: 'Bloch Vector', category: 'Physics', definition: 'The 3D vector (x, y, z) pointing to a state on or inside the Bloch sphere. |r|=1 for pure states, |r|<1 for mixed states.' },
  { term: 'BQP', category: 'Algorithms', definition: 'Bounded-Error Quantum Polynomial-Time: the class of decision problems solvable by a quantum computer in polynomial time with error probability ≤ 1/3.' },
  { term: 'Bra', category: 'Math', definition: 'The conjugate transpose of a ket state vector, represented as a row vector ⟨ψ| in Dirac notation.' },
  { term: 'Born Rule', category: 'Physics', definition: 'Fundamental postulate stating that the probability of obtaining eigenvalue λ is given by the squared norm of the projected state.', formula: 'P(i) = |\\langle i|\\psi\\rangle|^2' },
  { term: 'Calibration', category: 'Hardware', definition: 'The automated experimental procedure of determining optimal frequencies, pulse amplitudes, and delays to maximize quantum gate fidelity.' },
  { term: 'CHSH Inequality', category: 'Physics', definition: 'An experimental formulation of Bell’s theorem where classical physics bounds correlations |S| ≤ 2, while quantum entanglement achieves 2√2 ≈ 2.828.' },
  { term: 'Circuit Depth', category: 'Algorithms', definition: 'The number of discrete time steps in a quantum circuit when gates that act on disjoint qubits are executed in parallel.' },
  { term: 'Clifford Group', category: 'Math', definition: 'The set of quantum gates that map Pauli operators to Pauli operators under conjugation: {H, S, CNOT}. Classically simulable by Gottesman–Knill theorem.' },
  { term: 'CNOT Gate', category: 'Gates', definition: 'Controlled-NOT: a two-qubit gate that flips the target qubit if and only if the control qubit is in state |1⟩.' },
  { term: 'Coherence Time', category: 'Physics', definition: 'The duration for which a physical qubit retains its quantum phase information before environmental noise destroys superposition.' },
  { term: 'Cross-Resonance (CR)', category: 'Hardware', definition: 'An all-microwave two-qubit entangling interaction in superconducting circuits where driving control qubit at target frequency generates a ZX rotation.' },
  { term: 'Dechoherence', category: 'Physics', definition: 'The loss of quantum coherence caused by unwanted physical interactions between a qubit and its thermal environment.' },
  { term: 'Density Matrix', category: 'Math', definition: 'A positive semi-definite matrix with trace 1 that describes pure states, statistical mixtures, and entangled subsystems.', formula: '\\rho = \\sum p_i |\\psi_i\\rangle\\langle\\psi_i|' },
  { term: 'Deutsch-Jozsa Algorithm', category: 'Algorithms', definition: 'A quantum algorithm proving exponential advantage by determining if an oracle is constant or balanced in 1 query vs 2ⁿ⁻¹+1 classically.' },
  { term: 'Dirac Notation', category: 'Math', definition: 'The standard algebraic syntax of quantum mechanics utilizing bras ⟨ψ| and kets |ψ⟩ invented by Paul Dirac.' },
  { term: 'DRAG Pulse', category: 'Hardware', definition: 'Derivative Removal by Adiabatic Gate: a pulse-shaping technique using quadrature derivative waveforms to eliminate transmon leakage into the |2⟩ state.' },
  { term: 'Entanglement', category: 'Physics', definition: 'A quantum correlation between two or more particles such that the state of any individual particle cannot be described independently.' },
  { term: 'Euler Angles', category: 'Math', definition: 'Three angles (α, β, γ) describing any single-qubit unitary rotation as sequential rotations around coordinate axes: U = Rz(α)Ry(β)Rz(γ).' },
  { term: 'Fault Tolerance', category: 'Error Correction', definition: 'The design of quantum gates, measurements, and corrections such that a single physical failure does not spread to corrupt the logical data.' },
  { term: 'Fidelity', category: 'Math', definition: 'A metric measuring the closeness of two quantum states: F(ρ, σ) = (Tr√(√ρ σ √ρ))². For pure states, F = |⟨ψ|φ⟩|².' },
  { term: 'Grover Diffusion Operator', category: 'Algorithms', definition: 'The reflection operator D = 2|s⟩⟨s| - I that inverts amplitudes around their mean during Grover search.' },
  { term: "Grover's Algorithm", category: 'Algorithms', definition: 'An unstructured database search algorithm providing quadratic speedup O(√N) over classical O(N).' },
  { term: 'Hadamard Gate', category: 'Gates', definition: 'A single-qubit gate creating equal superposition states: H|0⟩ = |+⟩ and H|1⟩ = |-⟩.' },
  { term: 'Hahn Echo', category: 'Hardware', definition: 'A refocusing pulse sequence (π/2 - τ - π - τ - π/2) that eliminates low-frequency 1/f noise to measure the true coherence T₂.' },
  { term: 'Hamiltonian', category: 'Physics', definition: 'The operator corresponding to the total energy of a physical quantum system, generating time evolution via Schrödinger’s equation: iħ d|ψ⟩/dt = H|ψ⟩.' },
  { term: 'Hermitian Matrix', category: 'Math', definition: 'A complex square matrix equal to its own conjugate transpose: A = A†. Guarantees all eigenvalues are real, modeling physical observables.' },
  { term: 'Hilbert Space', category: 'Math', definition: 'A complete vector space equipped with an inner product, providing the mathematical setting for quantum mechanics.' },
  { term: 'Ion Trap', category: 'Hardware', definition: 'A device using oscillating electric quadrupole fields (Paul trap) to suspend ionized atoms in an ultra-high vacuum.' },
  { term: 'Josephson Junction', category: 'Hardware', definition: 'Two superconducting electrodes separated by a thin nanometer insulating barrier, creating non-linear lossless inductance.' },
  { term: 'Ket', category: 'Math', definition: 'A column vector |ψ⟩ in Dirac notation representing a quantum state.' },
  { term: 'Kronecker Product', category: 'Math', definition: 'The matrix operation A ⊗ B representing tensor products of linear operators across combined qubit wires.' },
  { term: 'Leakage', category: 'Hardware', definition: 'A physical error where a qubit transitions outside the computational subspace {|0⟩, |1⟩} into higher energy levels like |2⟩.' },
  { term: 'Logical Qubit', category: 'Error Correction', definition: 'A protected quantum state encoded across many physical qubits using an error correction code to achieve low logical error rates.' },
  { term: 'Mølmer–Sørensen Gate', category: 'Hardware', definition: 'The native two-qubit entangling gate in trapped-ion computers driven by bichromatic laser fields coupling ion motion.' },
  { term: 'Neutral Atom', category: 'Hardware', definition: 'A quantum computing modality using uncharged atoms held in laser optical tweezers and entangled via the Rydberg blockade.' },
  { term: 'NISQ', category: 'Hardware', definition: 'Noisy Intermediate-Scale Quantum era: 50 to 1,000 qubit devices without fault-tolerant error correction.' },
  { term: 'No-Cloning Theorem', category: 'Physics', definition: 'A fundamental theorem proving that an unknown quantum state cannot be cloned identically due to the linearity of quantum mechanics.' },
  { term: 'OpenQASM', category: 'Algorithms', definition: 'Open Quantum Assembly Language: the open-source intermediate representation for imperative quantum circuits.' },
  { term: 'Optical Tweezer', category: 'Hardware', definition: 'A tightly focused laser beam capable of trapping and moving individual neutral atoms via optical dipole forces.' },
  { term: 'Oracle', category: 'Algorithms', definition: 'A black-box quantum sub-circuit that evaluates a mathematical function f(x) via unitary phase kickback.' },
  { term: 'Partial Trace', category: 'Math', definition: 'The mathematical operation that traces out one quantum subsystem to compute the reduced density matrix of the remaining subsystem.' },
  { term: 'Pauli Gates', category: 'Gates', definition: 'The set of three unitary Hermitian matrices X, Y, Z forming a basis for all 2×2 complex operators.' },
  { term: 'Phase Estimation (QPE)', category: 'Algorithms', definition: 'A quantum algorithm using QFT to extract the unknown phase θ of an eigenvalue U|u⟩ = e^{2πiθ}|u⟩.' },
  { term: 'Phase-Flip Error', category: 'Error Correction', definition: 'A quantum error where the phase of |1⟩ flips sign while |0⟩ stays unchanged, equivalent to a Pauli Z operator.' },
  { term: 'Photonic Qubit', category: 'Hardware', definition: 'A quantum computer utilizing single photons traveling through optical waveguides with measurement-based fusion gates.' },
  { term: 'POVM', category: 'Math', definition: 'Positive Operator-Valued Measure: the most general mathematical formulation of a quantum measurement.' },
  { term: 'Purity', category: 'Math', definition: 'Tr(ρ²): a metric measuring state cleanliness. Equal to 1 for pure states, down to 1/d for maximally mixed states.' },
  { term: 'QAOA', category: 'Algorithms', definition: 'Quantum Approximate Optimization Algorithm: a variational NISQ algorithm designed to approximate solutions to combinatorial graph problems.' },
  { term: 'QFT', category: 'Algorithms', definition: 'Quantum Fourier Transform: transforms basis states to phase superpositions in O(n²) quantum gates.' },
  { term: 'Qubit', category: 'Physics', definition: 'Quantum Bit: the fundamental unit of quantum information, existing as any normalized linear combination of |0⟩ and |1⟩.' },
  { term: 'Rabi Oscillation', category: 'Hardware', definition: 'The periodic cyclic oscillation of a 2-level quantum state driven by a resonant electromagnetic field, used to calibrate π pulses.' },
  { term: 'Ramsey Experiment', category: 'Hardware', definition: 'A two-pulse sequence used to measure qubit frequency detuning and the inhomogeneous dephasing time T₂*.' },
  { term: 'Randomized Benchmarking', category: 'Hardware', definition: 'A protocol applying random Clifford sequences to measure average gate error rate r cleanly isolated from SPAM errors.' },
  { term: 'Reduced Density Matrix', category: 'Math', definition: 'The density matrix of an entangled subsystem obtained by taking the partial trace over the unmeasured qubits.' },
  { term: 'Rydberg Blockade', category: 'Hardware', definition: 'A physical mechanism in neutral atoms where laser excitation of one atom prevents nearby atoms within radius R_b from exciting to Rydberg levels.' },
  { term: "Shor's Algorithm", category: 'Algorithms', definition: 'A polynomial-time quantum algorithm for finding prime factors of composite integers, breaking RSA cryptography.' },
  { term: 'Silicon Spin Qubit', category: 'Hardware', definition: 'A quantum computing modality using electron or hole spins trapped in gate-defined semiconductor quantum dots in silicon.' },
  { term: 'Solovay-Kitaev Theorem', category: 'Math', definition: 'Proves that any arbitrary single-qubit gate can be approximated to precision ε with O(log^c(1/ε)) gates from a discrete universal set.' },
  { term: 'SPAM Errors', category: 'Hardware', definition: 'State Preparation and Measurement errors: false positives and readout errors occurring before or after circuit gate execution.' },
  { term: 'Stabilizer Code', category: 'Error Correction', definition: 'A class of quantum error correcting codes where logical states are simultaneous +1 eigenstates of an Abelian group of Pauli operators.' },
  { term: 'Stern–Gerlach', category: 'Physics', definition: 'A landmark 1922 experiment measuring the discrete quantization of electron spin-1/2 in an inhomogeneous magnetic field.' },
  { term: 'Superconducting Transmon', category: 'Hardware', definition: 'A charge-insensitive superconducting qubit consisting of a non-linear Josephson junction shunted by a large capacitor.' },
  { term: 'Superdense Coding', category: 'Algorithms', definition: 'A protocol transmitting two classical bits of information using only one transmitted qubit and an entangled Bell pair.' },
  { term: 'Superposition', category: 'Physics', definition: 'The ability of a quantum system to exist in a linear combination of mutually exclusive classical basis states simultaneously.' },
  { term: 'Surface Code', category: 'Error Correction', definition: 'A 2D topological stabilizer code with nearest-neighbor syndrome checks and an exceptionally high fault-tolerant error threshold (~1%).' },
  { term: 'SWAP Gate', category: 'Gates', definition: 'A two-qubit gate that exchanges the states of two qubits: SWAP|x, y⟩ = |y, x⟩.' },
  { term: 'T Gate', category: 'Gates', definition: 'A non-Clifford single-qubit gate adding a π/4 phase shift, indispensable for universal fault-tolerant computation.' },
  { term: 'T₁ Relaxation Time', category: 'Physics', definition: 'The characteristic lifetime for a qubit in excited state |1⟩ to lose energy and decay to ground state |0⟩.' },
  { term: 'T₂ Dephasing Time', category: 'Physics', definition: 'The characteristic lifetime for the relative quantum phase between |0⟩ and |1⟩ to be destroyed by environmental fluctuations.' },
  { term: 'Teleportation', category: 'Algorithms', definition: 'The protocol transferring an unknown quantum state using one shared Bell pair and two classical bits without physical matter transfer.' },
  { term: 'Tensor Product', category: 'Math', definition: 'The algebraic operation ⊗ that maps independent quantum vector spaces into composite multi-qubit Hilbert spaces.' },
  { term: 'Toffoli Gate', category: 'Gates', definition: 'A 3-qubit Controlled-Controlled-NOT (CCNOT) gate that flips the target qubit only if both control qubits are |1⟩. Reversible universal classical gate.' },
  { term: 'Transmon', category: 'Hardware', definition: 'Transmission-line shunted plasma oscillation qubit: the dominant superconducting qubit design worldwide.' },
  { term: 'Unitary Operator', category: 'Math', definition: 'A linear operator U satisfying U† U = I, ensuring inner products and total probability equal to 1 are strictly conserved.' },
  { term: 'Universal Gate Set', category: 'Math', definition: 'A set of quantum gates that can approximate any arbitrary unitary transformation to within arbitrary precision ε.' },
  { term: 'Variational Quantum Eigensolver', category: 'Algorithms', definition: 'A hybrid quantum-classical NISQ algorithm that minimizes the expectation value ⟨H⟩ to find molecular ground-state energies.' },
  { term: 'VQE', category: 'Algorithms', definition: 'Acronym for Variational Quantum Eigensolver.' },
  { term: 'Wavefunction Collapse', category: 'Physics', definition: 'The reduction of a continuous superposition state into a single definite eigenstate upon measurement.' },
  { term: 'Z-Gate', category: 'Gates', definition: 'Pauli phase-flip gate: Z|0⟩ = |0⟩ and Z|1⟩ = -|1⟩.' }
];

// ============================================================================
// 6. CURATED RESOURCES
// ============================================================================

export const ACADEMY_RESOURCES: ResourceItem[] = [
  {
    title: 'Quantum Computation and Quantum Information ("Mike & Ike")',
    author: 'Michael A. Nielsen & Isaac L. Chuang',
    type: 'Textbook',
    level: 'Intermediate',
    url: 'https://doi.org/10.1017/CBO9780511976667',
    description: 'The undisputed "Bible" of quantum computing. Comprehensive coverage of linear algebra, circuit models, error correction, and quantum information theory.'
  },
  {
    title: 'Quantum Computer Science: An Introduction',
    author: 'N. David Mermin',
    type: 'Textbook',
    level: 'Beginner',
    url: 'https://doi.org/10.1017/CBO9780511813870',
    description: 'Written specifically for computer scientists without prior physics background. Clear, clean exposition of Bell’s theorem, teleportation, Shor, and Grover.'
  },
  {
    title: 'Lecture Notes on Quantum Computation',
    author: 'John Preskill (Caltech)',
    type: 'Lecture Notes',
    level: 'Advanced',
    url: 'http://theory.caltech.edu/~preskill/ph219/index.html',
    description: 'Legendary Caltech Physics 219 course notes covering density matrices, fault tolerance, quantum channels, and topological quantum computing.'
  },
  {
    title: 'Quantum Computing Since Democritus',
    author: 'Scott Aaronson (UT Austin)',
    type: 'Textbook',
    level: 'Intermediate',
    url: 'https://www.scottaaronson.com/democritus/',
    description: 'A witty, profound exploration of computational complexity, philosophy of mind, BQP, and quantum foundations.'
  },
  {
    title: 'The Theory of Quantum Information',
    author: 'John Watrous (University of Waterloo / IBM Quantum)',
    type: 'Textbook',
    level: 'Advanced',
    url: 'https://cs.uwaterloo.ca/~watrous/TQI/',
    description: 'Rigorous mathematical formulation of quantum channels, completely positive maps, distance measures, and semidefinite programming.'
  },
  {
    title: 'Simulating Physics with Computers (1982)',
    author: 'Richard P. Feynman',
    type: 'Landmark Paper',
    level: 'Beginner',
    url: 'https://doi.org/10.1007/BF02650179',
    description: 'The historic talk that launched quantum computing: "Nature isn’t classical, dammit, and if you want to make a simulation of nature, you’d better make it quantum mechanical!"'
  },
  {
    title: 'Algorithms for Quantum Computation: Discrete Logarithms and Factoring (1994)',
    author: 'Peter W. Shor',
    type: 'Landmark Paper',
    level: 'Advanced',
    url: 'https://doi.org/10.1109/SFCS.1994.365700',
    description: 'The foundation paper showing how quantum computers can factor composite integers in polynomial time.'
  },
  {
    title: 'Quantum Supremacy Using a Programmable Superconducting Processor (2019)',
    author: 'Google Quantum AI (Arute et al.)',
    type: 'Landmark Paper',
    level: 'Intermediate',
    url: 'https://doi.org/10.1038/s41586-019-1666-5',
    description: 'The Sycamore 53-qubit superconducting chip demonstrating random circuit cross-entropy benchmarking beyond classical supercomputers.'
  },
  {
    title: 'IBM Qiskit SDK & Ecosystem',
    author: 'IBM Quantum',
    type: 'Framework',
    level: 'Beginner',
    url: 'https://qiskit.org/',
    description: 'The most popular open-source SDK for working with quantum computers at the level of pulses, circuits, and application modules.'
  },
  {
    title: 'PennyLane — Differentiable Quantum Programming',
    author: 'Xanadu',
    type: 'Framework',
    level: 'Intermediate',
    url: 'https://pennylane.ai/',
    description: 'Cross-platform Python library for quantum machine learning, automatic differentiation, and hybrid quantum-classical optimization.'
  }
];
