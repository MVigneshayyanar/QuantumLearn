import { QuizQuestion } from './types';

export const ALGORITHM_QUIZZES: Record<string, QuizQuestion[]> = {
  'deutsch-jozsa': [
    {
      id: 'dj-q1',
      module_slug: 'deutsch-jozsa',
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
    }
  ],
  'grover': [
    {
      id: 'gr-q1',
      module_slug: 'grover',
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
      difficulty: 'intermediate',
      concept_tag: 'Amplitude Amplification',
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
    }
  ],
  'teleportation': [
    {
      id: 'tp-q1',
      module_slug: 'teleportation',
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
      difficulty: 'intermediate',
      concept_tag: 'Classical Communication',
      question: "Why does Quantum Teleportation NOT allow faster-than-light (superluminal) communication?",
      question_hi: "क्वांटम टेलीपोर्टेशन प्रकाश से तेज़ संचार की अनुमति क्यों नहीं देता?",
      hint: "What does Bob need from Alice before he can reconstruct the state?",
      options: [
        {
          id: 'tp-q2-opt1',
          text: "Bob cannot recover the state until he receives Alice's 2 classical bits through a conventional channel (limited by the speed of light)",
          text_hi: "बॉब तब तक अवस्था प्राप्त नहीं कर सकता जब तक उसे ऐलिस के 2 क्लासिकल बिट्स नहीं मिल जाते (जो प्रकाश की गति तक सीमित हैं)",
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
    }
  ],
  'superdense-coding': [
    {
      id: 'sd-q1',
      module_slug: 'superdense-coding',
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
    }
  ]
};
