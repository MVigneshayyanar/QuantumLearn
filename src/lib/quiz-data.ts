import { QuizQuestion, SkillSection } from './types';

export const ALGORITHM_SKILL_SECTIONS: Record<string, SkillSection[]> = {
  'deutsch-jozsa': [
    {
      id: 'dj-sec-1',
      title: 'Quantum Parallelism & Queries',
      description: 'Superposition of all 2ⁿ inputs and single-query evaluation advantage.',
      weightPercent: 25,
      questionIds: ['dj-q1']
    },
    {
      id: 'dj-sec-2',
      title: 'Phase Kickback & Ancilla Dynamics',
      description: 'Helper qubit eigenvalue -1 behavior and relative phase encoding.',
      weightPercent: 25,
      questionIds: ['dj-q2']
    },
    {
      id: 'dj-sec-3',
      title: 'Interference & Deterministic Collapse',
      description: 'Hadamard transformation, constructive vs destructive interference.',
      weightPercent: 25,
      questionIds: ['dj-q3']
    },
    {
      id: 'dj-sec-4',
      title: 'Fault-Tolerant Oracle Scaling & Noise',
      description: 'Multi-qubit gate synthesis, NISQ decoherence, and real QPU fidelity.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['dj-q4']
    }
  ],
  'grover': [
    {
      id: 'gr-sec-1',
      title: 'Search Optimality & Complexity',
      description: 'Quadratic speedup O(√N) and provable lower bounds in unstructured search.',
      weightPercent: 25,
      questionIds: ['gr-q1']
    },
    {
      id: 'gr-sec-2',
      title: 'Phase Oracle & Target Marking',
      description: 'Controlled phase inversion (-1) on marked basis states.',
      weightPercent: 25,
      questionIds: ['gr-q2']
    },
    {
      id: 'gr-sec-3',
      title: 'Diffusion Operator & Mean Reflection',
      description: 'Inversion about the average amplitude in 2D state space.',
      weightPercent: 25,
      questionIds: ['gr-q3']
    },
    {
      id: 'gr-sec-4',
      title: 'Overcooking & NISQ Noise Thresholds',
      description: 'Optimal iteration limits π/4√(N/M) and error mitigation in noisy QPUs.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['gr-q4']
    }
  ],
  'teleportation': [
    {
      id: 'tp-sec-1',
      title: 'No-Cloning Theorem & State Integrity',
      description: 'Destruction of original state to preserve linearity and unitarity.',
      weightPercent: 25,
      questionIds: ['tp-q1']
    },
    {
      id: 'tp-sec-2',
      title: 'Relativistic Causality & Classical Channel',
      description: 'Speed of light communication bound and 2-bit classical transmission.',
      weightPercent: 25,
      questionIds: ['tp-q2']
    },
    {
      id: 'tp-sec-3',
      title: 'Bell Measurement & Unitary Corrections',
      description: 'Joint measurement in Bell basis and conditional Pauli X/Z gate corrections.',
      weightPercent: 25,
      questionIds: ['tp-q3']
    },
    {
      id: 'tp-sec-4',
      title: 'Quantum Repeater Networks & Distillation',
      description: 'Entanglement swapping across nodes and purification over noisy fiber.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['tp-q4']
    }
  ],
  'superdense-coding': [
    {
      id: 'sd-sec-1',
      title: 'Channel Capacity & Holevo Limit',
      description: 'Transmitting 2 classical bits per physical qubit via prior entanglement.',
      weightPercent: 25,
      questionIds: ['sd-q1']
    },
    {
      id: 'sd-sec-2',
      title: 'Pauli Operations on Entangled Pairs',
      description: 'Local encoding with I, X, Z, and XZ gates across 4 orthogonal Bell states.',
      weightPercent: 25,
      questionIds: ['sd-q2']
    },
    {
      id: 'sd-sec-3',
      title: 'Bell State Discrimination & Decoding',
      description: 'CNOT and Hadamard gates for deterministic 2-bit measurement.',
      weightPercent: 25,
      questionIds: ['sd-q3']
    },
    {
      id: 'sd-sec-4',
      title: 'High-Dimensional Qudit Channels & Noise',
      description: 'D-level qudit capacity and phase damping in quantum communication.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['sd-q4']
    }
  ],
  'qft': [
    {
      id: 'qft-sec-1',
      title: 'Fourier Basis & Relative Phase Mapping',
      description: 'Mapping computational basis states |j⟩ to frequency phase rotations e^(2πijk/2ⁿ).',
      weightPercent: 25,
      questionIds: ['qft-q1']
    },
    {
      id: 'qft-sec-2',
      title: 'Controlled Phase Rotations (R_k)',
      description: 'Unitary decomposition with Hadamard and conditional R_k = diag(1, e^(2πi/2^k)) gates.',
      weightPercent: 25,
      questionIds: ['qft-q2']
    },
    {
      id: 'qft-sec-3',
      title: 'Bit Reversal & SWAP Network',
      description: 'Restoring standard bit-significance endianness using O(n) SWAP gates.',
      weightPercent: 25,
      questionIds: ['qft-q3']
    },
    {
      id: 'qft-sec-4',
      title: 'Algorithmic Complexity & Approximate QFT',
      description: 'O(n²) gate scaling vs classical FFT O(n·2ⁿ) and truncation thresholds for NISQ circuits.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['qft-q4']
    }
  ],
  'quantum-phase-estimation': [
    {
      id: 'qpe-sec-1',
      title: 'Eigenphase Extraction Framework',
      description: 'Encoding unitary eigenvalue U|u⟩ = e^(2πiθ)|u⟩ into phase kickback amplitudes.',
      weightPercent: 25,
      questionIds: ['qpe-q1']
    },
    {
      id: 'qpe-sec-2',
      title: 'Controlled Unitary Powers (U^(2^j))',
      description: 'Imprinting successive binary fraction digits of θ via binary exponentiation.',
      weightPercent: 25,
      questionIds: ['qpe-q2']
    },
    {
      id: 'qpe-sec-3',
      title: 'Inverse QFT & Measurement Precision',
      description: 'Decoding phase into computational basis states with success probability and error bounds.',
      weightPercent: 25,
      questionIds: ['qpe-q3']
    },
    {
      id: 'qpe-sec-4',
      title: 'Hamiltonian Simulation & NISQ Coherence',
      description: 'Estimating ground state energies exp(-iHt) and quantum resource budgeting.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['qpe-q4']
    }
  ],
  'shor': [
    {
      id: 'sh-sec-1',
      title: 'Classical Reduction to Order Finding',
      description: 'Reducing integer factorization N = pq to finding the modular period of f(x) = a^x mod N.',
      weightPercent: 25,
      questionIds: ['sh-q1']
    },
    {
      id: 'sh-sec-2',
      title: 'Quantum Modular Exponentiation',
      description: 'Evaluating a superposition of powers a^x mod N using reversible modular arithmetic.',
      weightPercent: 25,
      questionIds: ['sh-q2']
    },
    {
      id: 'sh-sec-3',
      title: 'Period Extraction via Continued Fractions',
      description: 'Extracting period r from phase measurement s/r using classical convergents.',
      weightPercent: 25,
      questionIds: ['sh-q3']
    },
    {
      id: 'sh-sec-4',
      title: 'Cryptographic Implications & RSA Breaking',
      description: 'Polynomial-time O(log³ N) factoring vs classical subexponential GNFS and post-quantum cryptography.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['sh-q4']
    }
  ],
  'vqe': [
    {
      id: 'vqe-sec-1',
      title: 'Variational Quantum-Classical Principle',
      description: 'Rayleigh-Ritz theorem guarantee ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀ for molecular ground states.',
      weightPercent: 25,
      questionIds: ['vqe-q1']
    },
    {
      id: 'vqe-sec-2',
      title: 'Ansatz Circuit Design (Hardware vs UCC)',
      description: 'Unitary Coupled Cluster (UCCSD) vs hardware-efficient parameterized rotation circuits.',
      weightPercent: 25,
      questionIds: ['vqe-q2']
    },
    {
      id: 'vqe-sec-3',
      title: 'Hamiltonian Pauli Decomposition & Measurement',
      description: 'Measuring fermionic operators Jordan-Wigner mapped to weighted sums of Pauli strings.',
      weightPercent: 25,
      questionIds: ['vqe-q3']
    },
    {
      id: 'vqe-sec-4',
      title: 'Barren Plateaus & Gradient Optimization',
      description: 'Exponential gradient vanishing in random parameterized unitaries and classical optimizers.',
      weightPercent: 25,
      isPremium: true,
      questionIds: ['vqe-q4']
    }
  ]
};

export const ALGORITHM_QUIZZES: Record<string, QuizQuestion[]> = {
  'deutsch-jozsa': [
    {
      id: 'dj-q1',
      module_slug: 'deutsch-jozsa',
      skillSectionId: 'dj-sec-1',
      difficulty: 'beginner',
      concept_tag: 'Quantum Parallelism & Queries',
      question: "How many function evaluations does the Deutsch-Jozsa algorithm need to determine if a 1-bit function is constant or balanced?",
      question_hi: "ड्यूश-जोज़ा एल्गोरिदम को यह तय करने के लिए फ़ंक्शन का कितने बार मूल्यांकन करना पड़ता है कि वह स्थिर (Constant) है या संतुलित (Balanced)?",
      hint: "Think about the main advantage quantum parallelism provides over classical computers.",
      hint_hi: "क्वांटम पैरेललिज्म के मुख्य लाभ के बारे में सोचें।",
      options: [
        {
          id: 'dj-q1-opt1',
          text: "Exactly 1 quantum evaluation",
          text_hi: "सटीक 1 क्वांटम मूल्यांकन",
          is_correct: true,
          explanation: "Correct! Deutsch-Jozsa uses quantum superposition and interference to evaluate global function properties in a single step.",
          explanation_hi: "सही! ड्यूश-जोज़ा सुपरपोजिशन और इंटरफेरेंस का उपयोग करके सिर्फ 1 चरण में फ़ंक्शन के वैश्विक गुण की जांच करता है।"
        },
        {
          id: 'dj-q1-opt2',
          text: "2 evaluations (one for f(0) and one for f(1))",
          text_hi: "2 मूल्यांकन (एक f(0) के लिए और एक f(1) के लिए)",
          is_correct: false,
          misconception_tag: 'DEUTSCH_ORACLE_QUERY',
          explanation: "Incorrect: Testing f(0) and f(1) separately is the classical deterministic approach. Quantum parallelism avoids this.",
          explanation_hi: "गलत: f(0) और f(1) को अलग-अलग जांचना क्लासिकल तरीका है।"
        },
        {
          id: 'dj-q1-opt3',
          text: "It depends on whether the function is constant or balanced",
          text_hi: "यह इस बात पर निर्भर करता है कि फ़ंक्शन स्थिर है या संतुलित",
          is_correct: false,
          explanation: "Incorrect: The quantum algorithm always terminates deterministically in exactly 1 query regardless of function type."
        }
      ]
    },
    {
      id: 'dj-q2',
      module_slug: 'deutsch-jozsa',
      skillSectionId: 'dj-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Phase Kickback',
      question: "Why is the ancillary (helper) qubit initialized in the |-⟩ state before applying the oracle?",
      question_hi: "ओरेकल लागू करने से पहले सहायक (Ancilla) क्यूबिट को |-⟩ अवस्था में क्यों तैयार किया जाता है?",
      hint: "Look at what happens to the sign (-1)^f(x) when applying CNOT to a target in |->.",
      hint_hi: "जब CNOT को |-⟩ अवस्था वाले टारगेट पर लगाया जाता है तो क्या होता है?",
      options: [
        {
          id: 'dj-q2-opt1',
          text: "To enable Phase Kickback, transferring the function value f(x) into the relative phase of the input qubit",
          text_hi: "फ़ेज़ किकबैक सक्षम करने के लिए, जिससे f(x) इनपुट क्यूबिट के रिलेटिव फ़ेज़ में आ जाता है",
          is_correct: true,
          explanation: "Correct! Because |-⟩ is an eigenstate of the X operator with eigenvalue -1, applying U_f kicks the phase (-1)^f(x) back onto the control qubit.",
          explanation_hi: "सही! |-⟩ X ऑपरेटर का -1 आइगेनस्टेट है, जिससे फ़ेज़ किकबैक इनपुट क्यूबिट में चला जाता है।"
        },
        {
          id: 'dj-q2-opt2',
          text: "To make the helper qubit output the final answer",
          text_hi: "सहायक क्यूबिट से अंतिम उत्तर प्राप्त करने के लिए",
          is_correct: false,
          misconception_tag: 'PHASE_KICKBACK_MISUNDERSTANDING',
          explanation: "Incorrect: The final measurement is performed on the INPUT qubit, not the helper ancilla."
        },
        {
          id: 'dj-q2-opt3',
          text: "To prevent the qubits from entangling",
          text_hi: "क्यूबिट्स को एंटैंगल होने से रोकने के लिए",
          is_correct: false,
          explanation: "Incorrect: The qubits do interact through the controlled unitary gate."
        }
      ]
    },
    {
      id: 'dj-q3',
      module_slug: 'deutsch-jozsa',
      skillSectionId: 'dj-sec-3',
      difficulty: 'advanced',
      concept_tag: 'Interference & Measurement',
      question: "If the input qubit is measured and yields |0⟩ with 100% probability after the final Hadamard gate, what does this conclude?",
      question_hi: "यदि अंतिम हैडामार्ड के बाद इनपुट क्यूबिट 100% संभावना के साथ |0⟩ मापा जाता है, तो इसका क्या निष्कर्ष निकलता है?",
      hint: "Remember the interference condition: constructive interference on |0> occurs when all phases match.",
      options: [
        {
          id: 'dj-q3-opt1',
          text: "The function is definitely Constant (f(0) = f(1))",
          text_hi: "फ़ंक्शन निश्चित रूप से स्थिर (Constant) है",
          is_correct: true,
          explanation: "Correct! When f is constant, the phases do not cancel, leading to constructive interference at |0⟩.",
          explanation_hi: "सही! जब f स्थिर होता है, तो रचनात्मक इंटरफेरेंस |0⟩ उत्पन्न करता है।"
        },
        {
          id: 'dj-q3-opt2',
          text: "The function is definitely Balanced",
          text_hi: "फ़ंक्शन निश्चित रूप से संतुलित (Balanced) है",
          is_correct: false,
          explanation: "Incorrect: A balanced function leads to destructive interference at |0⟩ and measures |1⟩ with 100% certainty."
        },
        {
          id: 'dj-q3-opt3',
          text: "The measurement collapsed the state randomly (50% chance)",
          text_hi: "मापन ने अवस्था को यादृच्छिक रूप से 50% पर संक्षिप्त कर दिया",
          is_correct: false,
          misconception_tag: 'SUPERPOSITION_VS_CLASSICAL_PROB',
          explanation: "Incorrect: The interference in Deutsch-Jozsa is 100% deterministic, not random!"
        }
      ]
    },
    {
      id: 'dj-q4',
      module_slug: 'deutsch-jozsa',
      skillSectionId: 'dj-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Fault-Tolerant Oracle Scaling & Noise',
      isPremium: true,
      question: "In an n-qubit Deutsch-Jozsa circuit running on physical superconducting hardware (NISQ), which error mechanism most commonly leads to false detection of a balanced function as constant?",
      question_hi: "भौतिक सुपरकंडक्टिंग हार्डवेयर पर n-क्यूबिट ड्यूश-जोज़ा सर्किट चलाते समय, कौन सा त्रुटि तंत्र संतुलित फ़ंक्शन को गलती से स्थिर बता सकता है?",
      hint: "Consider how phase damping (T2 dephasing) affects the coherence of relative phases before the final Hadamard transform.",
      options: [
        {
          id: 'dj-q4-opt1',
          text: "Phase dephasing (T2 decay) damping the destructive interference, causing residual probability in the |0...0⟩ state",
          text_hi: "फ़ेज़ डीफ़ेज़िंग (T2 क्षय) जो विनाशी इंटरफेरेंस को कम करता है और |0...0⟩ अवस्था में अवशिष्ट प्रायिकता छोड़ता है",
          is_correct: true,
          explanation: "Correct! On NISQ QPUs, T2 dephasing decoheres relative phases across the superposition. When destructive interference is incomplete, leakage into |00...0⟩ falsely mimics a constant oracle.",
          explanation_hi: "सही! NISQ हार्डवेयर पर T2 डीफ़ेज़िंग से इंटरफेरेंस अधूरा रह जाता है, जिससे |0...0⟩ में रिसाव होता है।"
        },
        {
          id: 'dj-q4-opt2',
          text: "Thermal relaxation (T1) immediately flipping all ancilla qubits to |1⟩",
          text_hi: "थर्मल रिलैक्सेशन (T1) जो सभी सहायक क्यूबिट्स को |1⟩ में बदल देता है",
          is_correct: false,
          explanation: "Incorrect: T1 relaxation decays excited states towards ground state |0⟩, not |1⟩."
        },
        {
          id: 'dj-q4-opt3',
          text: "Classical readout error in 100% of physical measurement lines",
          text_hi: "सभी मापन लाइनों में 100% क्लासिकल रीडआउट त्रुटि",
          is_correct: false,
          explanation: "Incorrect: Readout error rates on modern QPUs are typically 1-3%, insufficient alone to systematically invert the global parity."
        }
      ]
    }
  ],
  'grover': [
    {
      id: 'gr-q1',
      module_slug: 'grover',
      skillSectionId: 'gr-sec-1',
      difficulty: 'beginner',
      concept_tag: 'Grover Speedup',
      question: "What is the computational complexity of Grover's search on an unsorted database of N items compared to a classical computer?",
      question_hi: "N वस्तुओं के अनसॉर्टेड डेटाबेस में क्लासिकल कंप्यूटर की तुलना में ग्रोवर सर्च की जटिलता क्या है?",
      hint: "Grover offers a quadratic speedup.",
      options: [
        {
          id: 'gr-q1-opt1',
          text: "O(√N) quantum queries vs O(N) classical queries",
          text_hi: "O(√N) क्वांटम बनाम O(N) क्लासिकल",
          is_correct: true,
          explanation: "Correct! Grover's algorithm provides a provable quadratic speedup, searching N items in roughly √N steps.",
          explanation_hi: "सही! ग्रोवर एल्गोरिदम लगभग √N चरणों में N वस्तुओं की खोज करता है।"
        },
        {
          id: 'gr-q1-opt2',
          text: "O(1) vs O(N)",
          text_hi: "O(1) बनाम O(N)",
          is_correct: false,
          explanation: "Incorrect: Grover achieves a quadratic speedup (O(√N)), not constant time."
        },
        {
          id: 'gr-q1-opt3',
          text: "O(log N) vs O(N)",
          text_hi: "O(log N) बनाम O(N)",
          is_correct: false,
          explanation: "Incorrect: Unstructured search cannot be done in O(log N) — Bennett et al. proved O(√N) is optimal."
        }
      ]
    },
    {
      id: 'gr-q2',
      module_slug: 'grover',
      skillSectionId: 'gr-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Phase Oracle',
      question: "What is the exact role of the Phase Oracle in Grover's algorithm?",
      question_hi: "ग्रोवर एल्गोरिदम में फ़ेज़ ओरेकल (Phase Oracle) की सटीक भूमिका क्या है?",
      hint: "Does the oracle increase the probability directly, or change the phase sign?",
      options: [
        {
          id: 'gr-q2-opt1',
          text: "It inverts the relative phase (multiplies amplitude by -1) of only the marked target state",
          text_hi: "यह केवल लक्षित अवस्था के रिलेटिव फ़ेज़ को -1 से गुणा करता है",
          is_correct: true,
          explanation: "Correct! The oracle marks the target state with a negative amplitude without changing its measurement probability yet.",
          explanation_hi: "सही! ओरेकल लक्षित अवस्था के आयाम को ऋणात्मक (-1) बनाता है।"
        },
        {
          id: 'gr-q2-opt2',
          text: "It directly boosts the probability of the target state to 100%",
          text_hi: "यह सीधे लक्षित अवस्था की प्रायिकता को 100% तक बढ़ा देता है",
          is_correct: false,
          misconception_tag: 'GROVER_AMPLITUDE_MEAN',
          explanation: "Incorrect: The oracle alone does not change probabilities (| -a |² = | a |²). The subsequent Diffusion operator is required to amplify it!"
        },
        {
          id: 'gr-q2-opt3',
          text: "It measures all qubits to check if they match the search key",
          text_hi: "यह सभी क्यूबिट्स को मापता है",
          is_correct: false,
          misconception_tag: 'MEASUREMENT_COLLAPSE',
          explanation: "Incorrect: Measuring early would collapse the superposition and destroy the quantum speedup."
        }
      ]
    },
    {
      id: 'gr-q3',
      module_slug: 'grover',
      skillSectionId: 'gr-sec-3',
      difficulty: 'advanced',
      concept_tag: 'Diffusion Operator & Mean Reflection',
      question: "In the 2D geometric subspace spanned by the target state |ω⟩ and orthogonal superposition |s'⟩, how much does each Grover iteration rotate the state vector?",
      hint: "Remember that an iteration consists of two reflections: one about |s'> and one about |s>.",
      options: [
        {
          id: 'gr-q3-opt1',
          text: "Exactly 2θ radians, where sin(θ) = 1/√N",
          is_correct: true,
          explanation: "Correct! The combination of oracle reflection followed by diffusion reflection produces a net rotation of 2θ towards the target state |ω⟩."
        },
        {
          id: 'gr-q3-opt2',
          text: "Exactly π/2 radians in a single step",
          is_correct: false,
          explanation: "Incorrect: A single Grover step only rotates by 2θ ≈ 2/√N, which is very small for large N."
        },
        {
          id: 'gr-q3-opt3',
          text: "θ / 2 radians",
          is_correct: false,
          explanation: "Incorrect: Two successive reflections across axes separated by angle θ produce a rotation of 2θ."
        }
      ]
    },
    {
      id: 'gr-q4',
      module_slug: 'grover',
      skillSectionId: 'gr-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Overcooking & NISQ Noise Thresholds',
      isPremium: true,
      question: "What occurs if Grover's iteration is executed beyond the optimal R ≈ (π/4)·√(N/M) iterations?",
      hint: "Think of Grover search as continuous rotation on a circle.",
      options: [
        {
          id: 'gr-q4-opt1',
          text: "Overcooking occurs: the state vector rotates past the target, and success probability decreases sinusoidally back towards zero",
          is_correct: true,
          explanation: "Correct! Grover's algorithm is periodic, not monotonic. Applying too many iterations overcooks the state, rotating it past |ω⟩ and dropping target probability."
        },
        {
          id: 'gr-q4-opt2',
          text: "The quantum state collapses into thermal equilibrium automatically",
          is_correct: false,
          explanation: "Incorrect: Unitary operations do not cause thermal collapse; they simply continue rotating."
        },
        {
          id: 'gr-q4-opt3',
          text: "Success probability asymptotically stays locked at 100%",
          is_correct: false,
          explanation: "Incorrect: Grover is an oscillatory rotation (sin²((2R+1)θ)), not an asymptotic convergence."
        }
      ]
    }
  ],
  'teleportation': [
    {
      id: 'tp-q1',
      module_slug: 'teleportation',
      skillSectionId: 'tp-sec-1',
      difficulty: 'beginner',
      concept_tag: 'No-Cloning & Teleportation',
      question: "Does Quantum Teleportation create a clone of the original quantum state?",
      question_hi: "क्या क्वांटम टेलीपोर्टेशन मूल क्वांटम अवस्था की प्रतिलिपि (Clone) बनाता है?",
      hint: "Remember the fundamental No-Cloning Theorem of quantum mechanics.",
      options: [
        {
          id: 'tp-q1-opt1',
          text: "No: Alice's original state is destroyed upon measurement, perfectly preserving the No-Cloning Theorem",
          text_hi: "नहीं: मापन पर ऐलिस की मूल अवस्था नष्ट हो जाती है (नो-क्लोनिंग प्रमेय सुरक्षित रहता है)",
          is_correct: true,
          explanation: "Correct! Quantum Teleportation transfers the state rather than copying it, because measuring Alice's qubits destroys her copy.",
          explanation_hi: "सही! टेलीपोर्टेशन अवस्था का स्थानांतरण करता है, क्लोन नहीं बनाता।"
        },
        {
          id: 'tp-q1-opt2',
          text: "Yes: Both Alice and Bob now possess identical copies of the quantum state",
          text_hi: "हाँ: ऐलिस और बॉब दोनों के पास समान प्रतियां होती हैं",
          is_correct: false,
          misconception_tag: 'NO_CLONING_VIOLATION',
          explanation: "Incorrect: The No-Cloning Theorem strictly forbids duplicating an unknown quantum state."
        }
      ]
    },
    {
      id: 'tp-q2',
      module_slug: 'teleportation',
      skillSectionId: 'tp-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Classical Communication',
      question: "Why does Quantum Teleportation NOT allow faster-than-light (superluminal) communication?",
      question_hi: "क्वांटम टेलीपोर्टेशन प्रकाश से तेज़ संचार की अनुमति क्यों नहीं देता?",
      hint: "What does Bob need from Alice before he can reconstruct the state?",
      options: [
        {
          id: 'tp-q2-opt1',
          text: "Bob cannot recover the state until he receives Alice's 2 classical bits through a conventional channel (limited by the speed of light)",
          text_hi: "बॉब तब तक अवस्था प्राप्त नहीं कर सकता जब तक उसे ऐलिस के 2 क्लासिकल bits नहीं मिल जाते (जो प्रकाश की गति तक सीमित हैं)",
          is_correct: true,
          explanation: "Correct! Without Alice's classical measurement results, Bob's qubit is in a totally random mixed state with zero extractable information.",
          explanation_hi: "सही! क्लासिकल बिट्स के बिना बॉब का क्यूबिट पूरी तरह से यादृच्छिक मिश्रित अवस्था में रहता है।"
        },
        {
          id: 'tp-q2-opt2',
          text: "Because entanglement collapses instantly everywhere in the universe",
          text_hi: "क्योंकि एंटैंगलमेंट तुरंत टूट जाता है",
          is_correct: false,
          misconception_tag: 'ENTANGLEMENT_COMMUNICATION',
          explanation: "Incorrect: Entangled collapse alone cannot carry usable data without classical correlation."
        }
      ]
    },
    {
      id: 'tp-q3',
      module_slug: 'teleportation',
      skillSectionId: 'tp-sec-3',
      difficulty: 'advanced',
      concept_tag: 'Bell Measurement & Unitary Corrections',
      question: "If Alice performs her Bell measurement and records classical outcomes (bit1 = 1, bit2 = 1), which unitary operator must Bob apply to recover state |ψ⟩?",
      hint: "Recall the Pauli correction dictionary: 00 -> I, 01 -> X, 10 -> Z, 11 -> XZ (or ZX).",
      options: [
        {
          id: 'tp-q3-opt1',
          text: "Bob applies Pauli Z followed by Pauli X (X·Z)",
          is_correct: true,
          explanation: "Correct! A classical result of '11' indicates the state experienced both a bit-flip and phase-flip, requiring X·Z correction."
        },
        {
          id: 'tp-q3-opt2',
          text: "Bob applies identity I (no gate needed)",
          is_correct: false,
          explanation: "Incorrect: Identity is only applied when Alice measures '00'."
        },
        {
          id: 'tp-q3-opt3',
          text: "Bob applies a Hadamard gate",
          is_correct: false,
          explanation: "Incorrect: Hadamard does not correct arbitrary bit/phase flips; only Pauli X and Z gates are used."
        }
      ]
    },
    {
      id: 'tp-q4',
      module_slug: 'teleportation',
      skillSectionId: 'tp-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Quantum Repeater Networks & Distillation',
      isPremium: true,
      question: "In a global Quantum Repeater network spanning 1,000 km of optical fiber, what technique overcomes the exponential photon loss without measuring and destroying the quantum state?",
      hint: "Consider how Bell state measurements can connect adjacent entangled links.",
      options: [
        {
          id: 'tp-q4-opt1',
          text: "Entanglement Swapping with Quantum Memory nodes and Entanglement Purification",
          is_correct: true,
          explanation: "Correct! Quantum repeaters segment the channel into short distances, create entangled pairs, store them in quantum memories, and perform entanglement swapping with purification to extend entanglement across continents."
        },
        {
          id: 'tp-q4-opt2',
          text: "Classical optical erbium-doped fiber amplifiers (EDFA)",
          is_correct: false,
          explanation: "Incorrect: Classical optical amplifiers measure and amplify power, which destroys quantum superposition and violates the No-Cloning theorem."
        },
        {
          id: 'tp-q4-opt3',
          text: "Direct single-mode laser transmission at ultra-high optical wattage",
          is_correct: false,
          explanation: "Incorrect: High wattage generates multi-photon emission, enabling photon number splitting attacks and overwhelming quantum detectors."
        }
      ]
    }
  ],
  'superdense-coding': [
    {
      id: 'sd-q1',
      module_slug: 'superdense-coding',
      skillSectionId: 'sd-sec-1',
      difficulty: 'beginner',
      concept_tag: 'Superdense Capacity',
      question: "How many classical bits of information can Alice transmit to Bob by sending just 1 physical qubit in Superdense Coding?",
      question_hi: "सुपरडेंस कोडिंग में केवल 1 भौतिक क्यूबिट भेजकर ऐलिस बॉब को कितने क्लासिकल बिट्स भेज सकती है?",
      hint: "Compare this with transmitting an unentangled qubit (Holevo bound).",
      options: [
        {
          id: 'sd-q1-opt1',
          text: "2 classical bits (00, 01, 10, or 11)",
          text_hi: "2 क्लासिकल बिट्स (00, 01, 10, या 11)",
          is_correct: true,
          explanation: "Correct! Prior entanglement allows Alice to manipulate the shared 2-qubit Bell state into 4 orthogonal states using only local gates on her single qubit.",
          explanation_hi: "सही! पूर्व एंटैंगलमेंट ऐलिस को केवल 1 क्यूबिट पर गेट्स लगाकर 4 ऑर्थोगोनल अवस्थाएं बनाने की अनुमति देता है।"
        },
        {
          id: 'sd-q1-opt2',
          text: "1 classical bit",
          text_hi: "1 क्लासिकल बिट",
          is_correct: false,
          explanation: "Incorrect: 1 bit is the limit for an unentangled qubit. Entanglement doubles this capacity."
        },
        {
          id: 'sd-q1-opt3',
          text: "Infinite classical bits",
          text_hi: "अनंत क्लासिकल बिट्स",
          is_correct: false,
          misconception_tag: 'SUPERDENSE_BIT_CAPACITY',
          explanation: "Incorrect: Holevo's theorem and the 4-dimensional Bell basis strictly bound the capacity to 2 bits."
        }
      ]
    },
    {
      id: 'sd-q2',
      module_slug: 'superdense-coding',
      skillSectionId: 'sd-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Pauli Operations on Entangled Pairs',
      question: "If Alice wants to transmit the 2-bit message '10' to Bob starting from Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2, which local Pauli gate does she apply to her qubit?",
      hint: "Remember: '00' -> I, '01' -> X (bit flip), '10' -> Z (phase flip), '11' -> XZ.",
      options: [
        {
          id: 'sd-q2-opt1',
          text: "Pauli Z gate (transforms |Φ+⟩ into |Φ-⟩)",
          is_correct: true,
          explanation: "Correct! Applying Z to Alice's qubit maps (|00⟩ + |11⟩)/√2 to (|00⟩ - |11⟩)/√2 = |Φ-⟩, which encodes '10'."
        },
        {
          id: 'sd-q2-opt2',
          text: "Pauli X gate (transforms |Φ+⟩ into |Ψ+⟩)",
          is_correct: false,
          explanation: "Incorrect: Pauli X bit-flips Alice's qubit, creating |Ψ+⟩ which encodes '01'."
        },
        {
          id: 'sd-q2-opt3',
          text: "Hadamard gate",
          is_correct: false,
          explanation: "Incorrect: Applying Hadamard on Alice's qubit creates a superposition of Bell states rather than an orthogonal basis state."
        }
      ]
    },
    {
      id: 'sd-q3',
      module_slug: 'superdense-coding',
      skillSectionId: 'sd-sec-3',
      difficulty: 'advanced',
      concept_tag: 'Bell State Discrimination & Decoding',
      question: "When Bob receives Alice's qubit, in what exact order does he apply decoding gates before measuring in the computational basis?",
      hint: "He must reverse the Bell state creation circuit (Hadamard then CNOT).",
      options: [
        {
          id: 'sd-q3-opt1',
          text: "CNOT (Alice's qubit as control, Bob's as target), followed by Hadamard on Alice's qubit",
          is_correct: true,
          explanation: "Correct! Bell decoding is the exact inverse of Bell generation: first CNOT disentangles the pair, then Hadamard converts phase differences into bit values."
        },
        {
          id: 'sd-q3-opt2',
          text: "Hadamard on both qubits, followed by SWAP",
          is_correct: false,
          explanation: "Incorrect: Disentanglement requires an entangling gate (CNOT) before the single-qubit basis rotation."
        },
        {
          id: 'sd-q3-opt3',
          text: "Direct Z-basis measurement without any pre-rotation gates",
          is_correct: false,
          explanation: "Incorrect: All 4 Bell states yield 50/50 random outcomes under direct computational measurement without pre-rotation."
        }
      ]
    },
    {
      id: 'sd-q4',
      module_slug: 'superdense-coding',
      skillSectionId: 'sd-sec-4',
      difficulty: 'advanced',
      concept_tag: 'High-Dimensional Qudit Channels & Noise',
      isPremium: true,
      question: "If Superdense Coding is generalized from 2-level qubits to d-level quantum systems (qudits) with maximally entangled state |Φ_d⟩, what is the maximum number of orthogonal classical states transmittable via 1 physical qudit?",
      hint: "Consider the dimension of Alice's local Generalized Pauli Heisenberg-Weyl operators.",
      options: [
        {
          id: 'sd-q4-opt1',
          text: "d² classical states (log₂(d²) = 2·log₂(d) bits)",
          is_correct: true,
          explanation: "Correct! Using d² generalized Pauli operators (clock and shift operators X^j Z^k for j,k ∈ {0,...,d-1}), Alice can locally transform |Φ_d⟩ into d² mutually orthogonal maximally entangled states, doubling the qudit's classical capacity."
        },
        {
          id: 'sd-q4-opt2',
          text: "2d classical states",
          is_correct: false,
          explanation: "Incorrect: The state space dimension of a bipartite qudit system is d × d = d², not 2d."
        },
        {
          id: 'sd-q4-opt3',
          text: "d classical states (no enhancement over classical)",
          is_correct: false,
          explanation: "Incorrect: Prior entanglement doubles the capacity from d to d² states."
        }
      ]
    }
  ],
  'qft': [
    {
      id: 'qft-q1',
      module_slug: 'qft',
      skillSectionId: 'qft-sec-1',
      difficulty: 'intermediate',
      concept_tag: 'Fourier Basis & Relative Phase Mapping',
      question: 'How does the Quantum Fourier Transform (QFT) act on a computational basis state |j⟩ in an n-qubit register?',
      hint: 'Recall the definition of discrete Fourier transform on amplitudes.',
      options: [
        {
          id: 'qft-q1-opt1',
          text: 'It maps |j⟩ to (1/√2ⁿ) ∑_{k=0}^{2ⁿ-1} e^(2πijk/2ⁿ) |k⟩',
          is_correct: true,
          explanation: 'Correct! The QFT maps computational basis states into uniform superpositions with linearly progressive relative phases e^(2πijk/2ⁿ).'
        },
        {
          id: 'qft-q1-opt2',
          text: 'It permutes |j⟩ to |2ⁿ - 1 - j⟩ deterministically',
          is_correct: false,
          explanation: 'Incorrect: Permuting bitstrings is done by bit-flip gates, not the Fourier transform.'
        },
        {
          id: 'qft-q1-opt3',
          text: 'It creates equal probability amplitudes with zero relative phases',
          is_correct: false,
          explanation: 'Incorrect: That is what Hadamard H^{\\otimes n} produces from |0⟩, not general QFT on state |j⟩.'
        }
      ]
    },
    {
      id: 'qft-q2',
      module_slug: 'qft',
      skillSectionId: 'qft-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Controlled Phase Rotations (R_k)',
      question: 'In an exact n-qubit QFT circuit, how many total 1-qubit and 2-qubit gates are required?',
      hint: 'Count the gates on wire 1 (1 H + n-1 controlled rotations), wire 2 (1 H + n-2 rotations), etc.',
      options: [
        {
          id: 'qft-q2-opt1',
          text: 'O(n²) gates (specifically n(n+1)/2 gates plus ⌊n/2⌋ SWAP gates)',
          is_correct: true,
          explanation: 'Correct! The QFT requires n Hadamard gates and n(n-1)/2 controlled phase gates, giving O(n²) scaling — an exponential speedup over classical FFT O(n·2ⁿ).'
        },
        {
          id: 'qft-q2-opt2',
          text: 'O(2ⁿ) gates',
          is_correct: false,
          explanation: 'Incorrect: The classical Discrete Fourier Transform requires O(2ⁿ log 2ⁿ) operations, but quantum circuits only need O(n²).'
        },
        {
          id: 'qft-q2-opt3',
          text: 'Exactly n gates',
          is_correct: false,
          explanation: 'Incorrect: n gates only applies single-qubit Hadamards without the crucial entangling phase rotations.'
        }
      ]
    },
    {
      id: 'qft-q3',
      module_slug: 'qft',
      skillSectionId: 'qft-sec-3',
      difficulty: 'beginner',
      concept_tag: 'Bit Reversal & SWAP Network',
      question: 'Why are SWAP gates necessary at the end of the standard Quantum Fourier Transform circuit?',
      hint: 'Look at the indices of the output product state after sequential controlled rotations.',
      options: [
        {
          id: 'qft-q3-opt1',
          text: 'Because the sequential rotation formulation naturally outputs qubits in bit-reversed order',
          is_correct: true,
          explanation: 'Correct! The circuit derives the most significant phase bits on the lowest wire index, so reversing the register with SWAP restores conventional bit order.'
        },
        {
          id: 'qft-q3-opt2',
          text: 'To undo unwanted entanglement with the environment',
          is_correct: false,
          explanation: 'Incorrect: SWAP gates are unitary swaps within the register, not environmental decoupling.'
        },
        {
          id: 'qft-q3-opt3',
          text: 'Because measurement is physically impossible without SWAP gates',
          is_correct: false,
          explanation: 'Incorrect: Any qubit can be measured directly; SWAP is simply for correct binary index ordering.'
        }
      ]
    },
    {
      id: 'qft-q4',
      module_slug: 'qft',
      skillSectionId: 'qft-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Algorithmic Complexity & Approximate QFT',
      isPremium: true,
      question: 'In Approximate QFT (AQFT), controlled phase rotations R_k where k > m are dropped. Why does this benefit NISQ hardware without destroying algorithmic utility?',
      hint: 'Recall R_k applies a phase shift of 2π/2^k.',
      options: [
        {
          id: 'qft-q4-opt1',
          text: 'For large k, phase angle 2π/2^k is exponentially smaller than physical gate noise, so dropping them decreases depth while retaining high state fidelity',
          is_correct: true,
          explanation: 'Correct! When k is large, 2π/2^k is tiny compared to gate error rates. Pruning high-k rotations bounds total trace distance error while reducing circuit depth from O(n²) to O(n log n).'
        },
        {
          id: 'qft-q4-opt2',
          text: 'Dropping gates makes the circuit classical',
          is_correct: false,
          explanation: 'Incorrect: The circuit remains fully quantum and coherent.'
        },
        {
          id: 'qft-q4-opt3',
          text: 'It eliminates the need for Hadamard gates entirely',
          is_correct: false,
          explanation: 'Incorrect: Hadamard gates remain essential for basis transformation in every wire.'
        }
      ]
    }
  ],
  'quantum-phase-estimation': [
    {
      id: 'qpe-q1',
      module_slug: 'quantum-phase-estimation',
      skillSectionId: 'qpe-sec-1',
      difficulty: 'intermediate',
      concept_tag: 'Eigenphase Extraction Framework',
      question: 'Given a unitary operator U with eigenvector |u⟩ such that U|u⟩ = e^(2πiθ)|u⟩, what is the core goal of Quantum Phase Estimation (QPE)?',
      hint: 'Focus on where the unknown scalar θ ends up.',
      options: [
        {
          id: 'qpe-q1-opt1',
          text: 'To estimate the unknown phase parameter θ to t bits of binary precision in a counting register',
          is_correct: true,
          explanation: 'Correct! QPE transfers the eigenphase θ from the exponential eigenvalue of U into computational basis states |2^t · θ⟩ for deterministic measurement.'
        },
        {
          id: 'qpe-q1-opt2',
          text: 'To clone the unknown quantum state |u⟩',
          is_correct: false,
          explanation: 'Incorrect: Cloning an unknown quantum state is strictly prohibited by the No-Cloning Theorem.'
        },
        {
          id: 'qpe-q1-opt3',
          text: 'To invert the matrix U without applying it',
          is_correct: false,
          explanation: 'Incorrect: QPE executes controlled powers of U to measure its eigenvalue phase.'
        }
      ]
    },
    {
      id: 'qpe-q2',
      module_slug: 'quantum-phase-estimation',
      skillSectionId: 'qpe-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Controlled Unitary Powers (U^(2^j))',
      question: 'Why does QPE apply successive controlled operations U^(2^j) with powers of 2 rather than simple repetitions of U?',
      hint: 'Think about how a fraction 0.θ₁θ₂θ₃... is written in binary.',
      options: [
        {
          id: 'qpe-q2-opt1',
          text: 'Because each successive power shifts the phase by 2^j, directly aligning with the binary fraction digits of θ in the Fourier basis',
          is_correct: true,
          explanation: 'Correct! Applying U^(2^j) multiplies the phase by 2^j, allowing the inverse QFT to isolate binary bit θ_j on qubit j.'
        },
        {
          id: 'qpe-q2-opt2',
          text: 'Because quantum computers can only evaluate powers of 2',
          is_correct: false,
          explanation: 'Incorrect: Any unitary can be compiled, but powers of 2 correspond to binary expansion digits.'
        },
        {
          id: 'qpe-q2-opt3',
          text: 'To cancel out quantum noise',
          is_correct: false,
          explanation: 'Incorrect: Higher powers increase circuit depth, which classical and NISQ compilers optimize.'
        }
      ]
    },
    {
      id: 'qpe-q3',
      module_slug: 'quantum-phase-estimation',
      skillSectionId: 'qpe-sec-3',
      difficulty: 'intermediate',
      concept_tag: 'Inverse QFT & Measurement Precision',
      question: 'If the exact phase θ is not an exact binary rational (i.e. θ cannot be written as m/2^t), what happens when the counting register is measured?',
      hint: 'Consider the sinc-like amplitude distribution around the true phase.',
      options: [
        {
          id: 'qpe-q3-opt1',
          text: 'The measurement peaks with high probability at the nearest binary fraction ⌊2^t θ⌉, with probability decaying as a sinc² distribution away from it',
          is_correct: true,
          explanation: 'Correct! Destructive interference concentrates >81% of probability amplitude in the two nearest integers to 2^t θ, and adding a few ancilla bits drives success probability arbitrarily close to 1.'
        },
        {
          id: 'qpe-q3-opt2',
          text: 'The algorithm fails completely with a uniform random outcome across all 2^t states',
          is_correct: false,
          explanation: 'Incorrect: Interference still creates a sharp peak centered around the true continuous phase.'
        },
        {
          id: 'qpe-q3-opt3',
          text: 'The quantum state explodes due to non-unitary evolution',
          is_correct: false,
          explanation: 'Incorrect: All operations in QPE are strictly unitary and preserve norm.'
        }
      ]
    },
    {
      id: 'qpe-q4',
      module_slug: 'quantum-phase-estimation',
      skillSectionId: 'qpe-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Hamiltonian Simulation & NISQ Coherence',
      isPremium: true,
      question: 'In quantum chemistry, QPE is applied to U = e^(-i H t) to extract molecular ground state energies E₀. What is the primary bottleneck preventing standard QPE on current NISQ devices?',
      hint: 'Consider the coherence time needed to apply high powers of U.',
      options: [
        {
          id: 'qpe-q4-opt1',
          text: 'Executing deep circuits of controlled-U^(2^j) requires circuit depths far exceeding current physical qubit coherence times T₂ and fault-tolerance thresholds',
          is_correct: true,
          explanation: 'Correct! Exact QPE requires thousands to millions of coherent entangling gates, which is why NISQ algorithms like VQE are used today until fault-tolerant QPUs mature.'
        },
        {
          id: 'qpe-q4-opt2',
          text: 'Hamiltonian matrices cannot be written on digital computers',
          is_correct: false,
          explanation: 'Incorrect: Molecular Hamiltonians are easily mapped to Pauli operators via Jordan-Wigner transformations.'
        },
        {
          id: 'qpe-q4-opt3',
          text: 'Molecules do not have energy eigenvalues',
          is_correct: false,
          explanation: 'Incorrect: Ground state energies are fundamental physical eigenvalues of molecular Hamiltonians.'
        }
      ]
    }
  ],
  'shor': [
    {
      id: 'sh-q1',
      module_slug: 'shor',
      skillSectionId: 'sh-sec-1',
      difficulty: 'intermediate',
      concept_tag: 'Classical Reduction to Order Finding',
      question: 'How does Shor’s Algorithm reduce the difficult problem of factoring a composite integer N = p·q to order finding?',
      hint: 'Recall Euler’s theorem and difference of squares: a^r - 1 = (a^(r/2) - 1)(a^(r/2) + 1).',
      options: [
        {
          id: 'sh-q1-opt1',
          text: 'Finding the period r where a^r ≡ 1 (mod N) allows computing non-trivial factors via gcd(a^(r/2) ± 1, N) whenever r is even and a^(r/2) ≢ -1 (mod N)',
          is_correct: true,
          explanation: 'Correct! By number theory, if period r is even, then (a^(r/2) - 1)(a^(r/2) + 1) = k·N, so taking gcd with N efficiently extracts prime factors p and q with probability ≥ 1/2.'
        },
        {
          id: 'sh-q1-opt2',
          text: 'By checking every prime number sequentially up to √N using Grover search',
          is_correct: false,
          explanation: 'Incorrect: That would still be exponential/subexponential. Shor’s algorithm is fundamentally based on period finding via QFT.'
        },
        {
          id: 'sh-q1-opt3',
          text: 'By inverting modular division using quantum teleportation',
          is_correct: false,
          explanation: 'Incorrect: Teleportation transmits quantum states, it does not factor integers.'
        }
      ]
    },
    {
      id: 'sh-q2',
      module_slug: 'shor',
      skillSectionId: 'sh-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Quantum Modular Exponentiation',
      question: 'What is the role of the quantum register in the modular exponentiation stage |x⟩|0⟩ ↦ |x⟩|a^x mod N⟩?',
      hint: 'Think about quantum parallelism across all values of x simultaneously.',
      options: [
        {
          id: 'sh-q2-opt1',
          text: 'It evaluates all powers a^x mod N simultaneously in quantum superposition across the control register',
          is_correct: true,
          explanation: 'Correct! Thanks to quantum superposition, all 2^m powers of a^x mod N are computed simultaneously, entangling control exponent values with periodic modular outputs.'
        },
        {
          id: 'sh-q2-opt2',
          text: 'It calculates the prime factors directly without any measurement',
          is_correct: false,
          explanation: 'Incorrect: Modular exponentiation creates the periodic state; the inverse QFT and continued fractions extract the actual period.'
        },
        {
          id: 'sh-q2-opt3',
          text: 'It encrypts the message with a secret quantum key',
          is_correct: false,
          explanation: 'Incorrect: Shor’s algorithm is a cryptanalytic factoring tool, not an encryption cipher.'
        }
      ]
    },
    {
      id: 'sh-q3',
      module_slug: 'shor',
      skillSectionId: 'sh-sec-3',
      difficulty: 'intermediate',
      concept_tag: 'Period Extraction via Continued Fractions',
      question: 'After applying the inverse QFT in Shor’s algorithm, measurement yields an integer s. How is the true period r obtained from s / 2^m?',
      hint: 'Recall the classical algorithm for rational approximation.',
      options: [
        {
          id: 'sh-q3-opt1',
          text: 'By using the classical Continued Fractions algorithm to find the unique rational convergent d/r closest to s/2^m with r < N',
          is_correct: true,
          explanation: 'Correct! The measured phase approximates s/r. The continued fractions algorithm efficiently reconstructs the denominator r in polynomial time O(log³ N).'
        },
        {
          id: 'sh-q3-opt2',
          text: 'By multiplying s by the speed of light',
          is_correct: false,
          explanation: 'Incorrect: Continued fractions is an efficient classical mathematical algorithm.'
        },
        {
          id: 'sh-q3-opt3',
          text: 'By guessing random numbers until r works',
          is_correct: false,
          explanation: 'Incorrect: Continued fractions deterministically extracts the optimal convergent in logarithmic time.'
        }
      ]
    },
    {
      id: 'sh-q4',
      module_slug: 'shor',
      skillSectionId: 'sh-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Cryptographic Implications & RSA Breaking',
      isPremium: true,
      question: 'Why does Shor’s Algorithm pose an existential threat to modern RSA and Elliptic Curve Cryptography (ECC), but not to symmetric AES-256?',
      hint: 'Compare exponential speedup (Shor) vs quadratic speedup (Grover).',
      options: [
        {
          id: 'shor-q4-opt1',
          text: 'Shor provides an exponential polynomial-time speedup O(n³) against hidden subgroup / discrete log problems breaking RSA/ECC, whereas AES-256 only faces quadratic speedup (Grover), which is countered simply by doubling key length',
          is_correct: true,
          explanation: 'Correct! RSA, Diffie-Hellman, and ECC rely on integer factoring and discrete logarithms, which Shor solves in polynomial time. Symmetric ciphers like AES-256 only face quadratic speedup from Grover (effective security 128 bits), which remains unbreakable.'
        },
        {
          id: 'shor-q4-opt2',
          text: 'Because AES uses quantum keys that cannot be copied',
          is_correct: false,
          explanation: 'Incorrect: AES is a purely classical symmetric cipher.'
        },
        {
          id: 'shor-q4-opt3',
          text: 'Because Shor’s algorithm only works on prime numbers smaller than 10',
          is_correct: false,
          explanation: 'Incorrect: Shor asymptotically scales to numbers with thousands of digits.'
        }
      ]
    }
  ],
  'vqe': [
    {
      id: 'vqe-q1',
      module_slug: 'vqe',
      skillSectionId: 'vqe-sec-1',
      difficulty: 'intermediate',
      concept_tag: 'Variational Quantum-Classical Principle',
      question: 'What mathematical theorem guarantees that the expectation value measured in VQE satisfies ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀?',
      hint: 'Named after two classical physicists and forms the basis of quantum variational methods.',
      options: [
        {
          id: 'vqe-q1-opt1',
          text: 'The Rayleigh-Ritz Variational Principle',
          is_correct: true,
          explanation: 'Correct! The variational principle guarantees that the energy expectation value for any trial wavefunction |ψ(θ)⟩ is strictly greater than or equal to the exact ground state energy E₀.'
        },
        {
          id: 'vqe-q1-opt2',
          text: 'Heisenberg Uncertainty Principle',
          is_correct: false,
          explanation: 'Incorrect: Heisenberg uncertainty bounds complementary observables (Δx Δp ≥ ℏ/2).'
        },
        {
          id: 'vqe-q1-opt3',
          text: 'No-Cloning Theorem',
          is_correct: false,
          explanation: 'Incorrect: The No-Cloning theorem prohibits copying unknown quantum states.'
        }
      ]
    },
    {
      id: 'vqe-q2',
      module_slug: 'vqe',
      skillSectionId: 'vqe-sec-2',
      difficulty: 'intermediate',
      concept_tag: 'Ansatz Circuit Design (Hardware vs UCC)',
      question: 'In VQE, why is the choice of Parameterized Quantum Circuit (ansatz) critical on current NISQ hardware?',
      hint: 'Consider the tradeoff between physical noise, gate depth, and chemical accuracy.',
      options: [
        {
          id: 'vqe-q2-opt1',
          text: 'Hardware-efficient ansätze minimize two-qubit gate depth to avoid decoherence, whereas physically motivated ansätze (like UCCSD) guarantee physical states but require deeper circuits',
          is_correct: true,
          explanation: 'Correct! Circuit depth is severely constrained by T₂ coherence times on NISQ devices. Hardware-efficient ansätze trade physical chemical structure for shallow depth.'
        },
        {
          id: 'vqe-q2-opt2',
          text: 'Because an ansatz determines how fast the classical computer calculates gradients',
          is_correct: false,
          explanation: 'Incorrect: The ansatz is executed on the quantum processor; classical computers only update parameters.'
        },
        {
          id: 'vqe-q2-opt3',
          text: 'Because only one ansatz exists for all chemical molecules',
          is_correct: false,
          explanation: 'Incorrect: There are dozens of ansatz families (UCCSD, RyRz, ADAPT-VQE, etc.).'
        }
      ]
    },
    {
      id: 'vqe-q3',
      module_slug: 'vqe',
      skillSectionId: 'vqe-sec-3',
      difficulty: 'intermediate',
      concept_tag: 'Hamiltonian Pauli Decomposition & Measurement',
      question: 'How is a molecular electronic Hamiltonian H evaluated on a quantum computer in VQE?',
      hint: 'Fermionic creation/annihilation operators must be translated into qubit Pauli gates.',
      options: [
        {
          id: 'vqe-q3-opt1',
          text: 'It is mapped via Jordan-Wigner or Bravyi-Kitaev into a linear combination of Pauli strings ∑ c_i P_i, and each Pauli string is measured independently',
          is_correct: true,
          explanation: 'Correct! Transforming fermionic operators into sums of Pauli tensor products (I, X, Y, Z) allows estimating ⟨H⟩ by summing the measured expectation values of each Pauli string.'
        },
        {
          id: 'vqe-q3-opt2',
          text: 'By measuring the temperature of the dilution refrigerator',
          is_correct: false,
          explanation: 'Incorrect: Cryogenic temperature is not an eigenvalue of the molecular Hamiltonian.'
        },
        {
          id: 'vqe-q3-opt3',
          text: 'By inverting the density matrix using classical matrix diagonalization',
          is_correct: false,
          explanation: 'Incorrect: Classical diagonalization has exponential O(4ⁿ) complexity, which VQE avoids.'
        }
      ]
    },
    {
      id: 'vqe-q4',
      module_slug: 'vqe',
      skillSectionId: 'vqe-sec-4',
      difficulty: 'advanced',
      concept_tag: 'Barren Plateaus & Gradient Optimization',
      isPremium: true,
      question: 'What is the "Barren Plateau" problem in variational quantum algorithms, and what causes it?',
      hint: 'Consider the variance of cost function gradients as system size grows.',
      options: [
        {
          id: 'vqe-q4-opt1',
          text: 'For sufficiently deep or random ansätze, the variance of the gradients vanishes exponentially in the number of qubits (Var[∂E/∂θ] ∈ O(2⁻ⁿ)), making gradient descent training impossible without exponential measurement shots',
          is_correct: true,
          explanation: 'Correct! McClean et al. (2018) proved that random parameterized quantum circuits form 2-designs, causing gradients to concentrate exponentially around zero — a major obstacle in scaling VQE.'
        },
        {
          id: 'vqe-q4-opt2',
          text: 'It means the quantum computer runs out of liquid helium and overheats',
          is_correct: false,
          explanation: 'Incorrect: Barren plateaus are a fundamental geometric phenomenon in parameter Hilbert space.'
        },
        {
          id: 'vqe-q4-opt3',
          text: 'It is a state where all measurement probabilities equal 1',
          is_correct: false,
          explanation: 'Incorrect: Probabilities must sum to 1, they cannot each be 1.'
        }
      ]
    }
  ]
};
