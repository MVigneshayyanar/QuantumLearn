/**
 * seo-schema.ts — Complete Schema.org JSON-LD Library for QLearn
 *
 * Structured data types in use:
 *  - WebSite (Sitelinks SearchBox for Google)
 *  - EducationalOrganization
 *  - SoftwareApplication (EducationalApplication)
 *  - Course × 5 (one per major algorithm/tool)
 *  - FAQPage (expanded — triggers Google accordion snippets)
 *  - BreadcrumbList (per-page, exported as factory functions)
 *  - HowTo (how to use the quantum circuit simulator)
 *  - ItemList (algorithm list for Google carousel snippets)
 */

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const NOW = new Date().toISOString();

/* ──────────────────────────────────────────────────────────
   1. WebSite Schema — Enables Google Sitelinks SearchBox
────────────────────────────────────────────────────────── */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'QLearn',
  alternateName: ['QuantumLearn', 'QLearn.tech', 'qlearn.tech', 'quantum learn'],
  description:
    'Free interactive quantum computing platform with 3D Bloch spheres, multi-simulator engine (Qiskit, Cirq, PennyLane), and Socratic AI tutoring.',
  inLanguage: 'en-US',
  datePublished: '2024-01-01',
  dateModified: NOW,
  publisher: {
    '@type': 'EducationalOrganization',
    '@id': `${siteUrl}/#organization`,
    name: 'QLearn',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
  },
  image: {
    '@type': 'ImageObject',
    url: `${siteUrl}/og-image.png`,
    width: 1200,
    height: 630,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/practice?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/* ──────────────────────────────────────────────────────────
   2. EducationalOrganization Schema
────────────────────────────────────────────────────────── */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${siteUrl}/#organization`,
  name: 'QLearn',
  legalName: 'QLearn Interactive Quantum Education Platform',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/og-image.png`,
  description:
    'Dedicated to making quantum computing intuitive and accessible through interactive visual simulations and AI guidance. Supporting learners from high school students to PhD researchers worldwide.',
  foundingDate: '2024',
  knowsAbout: [
    'Quantum Computing',
    'Quantum Algorithms',
    'Qiskit',
    'Google Cirq',
    'PennyLane',
    'Bloch Sphere',
    'Quantum Teleportation',
    "Grover's Algorithm",
    'Deutsch-Jozsa Algorithm',
    'Superdense Coding',
    'Quantum Circuit Design',
  ],
  sameAs: [
    'https://github.com/MVigneshayyanar/QuantumLearn',
    'https://twitter.com/qlearn_tech',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    availableLanguage: 'English',
  },
};

/* ──────────────────────────────────────────────────────────
   3. SoftwareApplication Schema
────────────────────────────────────────────────────────── */
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QLearn — Quantum Circuit Simulator & 3D Bloch Sphere',
  applicationCategory: 'EducationalApplication',
  applicationSubCategory: 'Quantum Computing Simulator',
  operatingSystem: 'Any (Web Browser)',
  browserRequirements: 'Requires modern browser with JavaScript and WebGL for 3D Bloch Sphere visualization',
  url: siteUrl,
  image: `${siteUrl}/og-image.png`,
  screenshot: `${siteUrl}/og-image.png`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '100',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Interactive 3D Bloch Sphere qubit visualization',
    'Drag-and-drop quantum circuit builder',
    'IBM Qiskit code generation',
    'Google Cirq code generation',
    'Xanadu PennyLane code generation',
    'OpenQASM 2.0 and 3.0 export',
    'Statevector probability amplitude visualizer',
    'Schrödinger AI Socratic tutor',
    'Deutsch-Jozsa algorithm interactive module',
    "Grover's quantum search algorithm simulator",
    'Quantum teleportation step-by-step protocol',
    'Superdense coding interactive circuit',
    'WCAG 2.1 AA accessibility',
  ],
  description:
    'Interactive web-based quantum circuit simulator supporting IBM Qiskit, Google Cirq, and Xanadu PennyLane code export with real-time 3D Bloch sphere statevector rendering.',
  author: {
    '@type': 'Organization',
    name: 'QLearn',
  },
  datePublished: '2024-01-01',
  dateModified: NOW,
};

/* ──────────────────────────────────────────────────────────
   4. Course Schema List (one per algorithm / tool)
────────────────────────────────────────────────────────── */
export const courseSchemaList = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Interactive 3D Bloch Sphere & Qubit Statevector Visualization',
    description:
      'Master single-qubit representation with the 3D Bloch sphere. Learn Dirac bra-ket notation, theta polar angle, phi azimuth, Pauli gate rotations, and statevector collapse upon quantum measurement.',
    url: `${siteUrl}/bloch-sphere`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Beginner',
    about: [
      { '@type': 'Thing', name: 'Qubit' },
      { '@type': 'Thing', name: 'Bloch Sphere' },
      { '@type': 'Thing', name: 'Quantum Superposition' },
      { '@type': 'Thing', name: 'Dirac Notation' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QLearn', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: "Grover's Quantum Search Algorithm — Step-by-Step Tutorial",
    description:
      'Understand quadratic quantum speedup O(√N), phase inversion oracles, and amplitude amplification diffusion operators with interactive simulation.',
    url: `${siteUrl}/learn/grover`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: "Grover's Algorithm" },
      { '@type': 'Thing', name: 'Quantum Search' },
      { '@type': 'Thing', name: 'Amplitude Amplification' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QLearn', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT2H' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Deutsch-Jozsa Quantum Algorithm & Quantum Parallelism',
    description:
      'Learn how quantum parallelism determines whether a black-box function is constant or balanced in a single query using the Deutsch-Jozsa algorithm.',
    url: `${siteUrl}/learn/deutsch-jozsa`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Beginner',
    about: [
      { '@type': 'Thing', name: 'Deutsch-Jozsa Algorithm' },
      { '@type': 'Thing', name: 'Quantum Parallelism' },
      { '@type': 'Thing', name: 'Quantum Oracle' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QLearn', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H30M' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Quantum Teleportation Protocol — Interactive Simulation',
    description:
      'Step-by-step quantum teleportation simulation transmitting unknown quantum states using Bell states, EPR pairs, and classical communication.',
    url: `${siteUrl}/learn/teleportation`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: 'Quantum Teleportation' },
      { '@type': 'Thing', name: 'Bell State' },
      { '@type': 'Thing', name: 'Quantum Entanglement' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QLearn', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT2H' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Superdense Coding Quantum Protocol — Transmit 2 Classical Bits with 1 Qubit',
    description:
      'Learn how entanglement and the superdense coding protocol allows transmitting two classical bits of information using only one physical qubit.',
    url: `${siteUrl}/learn/superdense-coding`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: 'Superdense Coding' },
      { '@type': 'Thing', name: 'Quantum Communication' },
      { '@type': 'Thing', name: 'Quantum Entanglement' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QLearn', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H30M' },
  },
];

/* ──────────────────────────────────────────────────────────
   5. Algorithm ItemList Schema
   Enables Google "Things to know" / Carousel rich snippets
────────────────────────────────────────────────────────── */
export const algorithmListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Quantum Algorithm Learning Modules on QLearn',
  description: 'Interactive step-by-step quantum algorithm tutorials with circuit simulation, Bloch sphere visualization, and AI tutor feedback.',
  url: siteUrl,
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Deutsch-Jozsa Algorithm',
      url: `${siteUrl}/learn/deutsch-jozsa`,
      description: 'Quantum parallelism to detect constant vs balanced oracle in one query.',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: "Grover's Quantum Search Algorithm",
      url: `${siteUrl}/learn/grover`,
      description: 'Quadratic speedup O(√N) quantum search with amplitude amplification.',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Quantum Teleportation Protocol',
      url: `${siteUrl}/learn/teleportation`,
      description: 'Transmit quantum states using Bell state entanglement and classical bits.',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Superdense Coding Protocol',
      url: `${siteUrl}/learn/superdense-coding`,
      description: 'Send 2 classical bits using 1 entangled qubit via Pauli gate encoding.',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: '3D Bloch Sphere Qubit Visualizer',
      url: `${siteUrl}/bloch-sphere`,
      description: 'Real-time 3D Bloch sphere for theta/phi qubit state exploration.',
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   6. HowTo Schema — How to Use the Quantum Circuit Simulator
   Powers Google "How to" rich result snippets
────────────────────────────────────────────────────────── */
export const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Build and Simulate a Quantum Circuit on QLearn',
  description:
    'Step-by-step guide to building quantum circuits, applying quantum gates, and exporting to IBM Qiskit, Google Cirq, or PennyLane using the QLearn online simulator.',
  image: `${siteUrl}/og-image.png`,
  totalTime: 'PT15M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: [
    { '@type': 'HowToSupply', name: 'Modern web browser (Chrome, Firefox, Edge, Safari)' },
    { '@type': 'HowToSupply', name: 'Free QLearn account (optional, for saving circuits)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Open the Quantum Circuit Builder',
      text: 'Navigate to https://qlearn.tech/simulator to open the drag-and-drop quantum circuit editor.',
      url: `${siteUrl}/simulator`,
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Add Qubits and Apply Gates',
      text: 'Drag quantum gates (Hadamard H, Pauli X/Y/Z, CNOT, Phase S/T) from the gate palette onto the qubit wires to build your circuit.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'View Statevector and Bloch Sphere',
      text: 'The real-time statevector panel and Bloch sphere visualizer update automatically as you build your circuit.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Choose Your Backend and Export',
      text: 'Select IBM Qiskit, Google Cirq, or Xanadu PennyLane from the backend dropdown, then copy or download the generated code.',
      position: 4,
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   7. Expanded FAQPage Schema
   More Q&As → more accordion rich snippets in Google Search
────────────────────────────────────────────────────────── */
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is QLearn and how does it help learn quantum computing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QLearn is a free AI-powered interactive quantum computing learning platform. It lets you visualize qubits in real-time 3D using the Bloch sphere, build quantum circuits with multi-backend simulation (IBM Qiskit, Google Cirq, Xanadu PennyLane), and get guided Socratic hints from the Schrödinger AI tutor — all directly in your browser.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is QLearn completely free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All core features are completely free: interactive algorithm tutorials, 3D Bloch sphere simulations, the quantum circuit builder, algorithm modules (Deutsch-Jozsa, Grover, Teleportation, Superdense Coding), practice problems, and AI tutor hints.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which quantum programming frameworks does QLearn support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QLearn generates and exports quantum circuit code for IBM Qiskit, Google Cirq, and Xanadu PennyLane. It also exports OpenQASM 2.0 and 3.0 format circuits. All generated code is copy-pasteable and runnable on real quantum hardware or local simulators.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Bloch Sphere in quantum computing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Bloch sphere is a geometric representation of the pure state space of a single qubit (two-level quantum system). The north pole (|0⟩) represents the ground state, the south pole (|1⟩) the excited state, and any superposition state lies on the surface of the sphere. The polar angle θ (theta) controls the probability amplitudes while φ (phi) is the relative phase. You can explore this interactively at https://qlearn.tech/bloch-sphere.',
      },
    },
    {
      '@type': 'Question',
      name: 'What quantum algorithms can I learn on QLearn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QLearn currently offers interactive modules for: Deutsch-Jozsa Algorithm (quantum parallelism), Grover\'s Quantum Search (amplitude amplification, O(√N) speedup), Quantum Teleportation (Bell state entanglement), and Superdense Coding (quantum communication protocol). Quantum Fourier Transform (QFT), Shor\'s Algorithm, and Variational Quantum Eigensolver (VQE) are coming soon.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is quantum superposition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quantum superposition is the ability of a quantum system (like a qubit) to exist in multiple states simultaneously until it is measured. Mathematically, a qubit |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. The Hadamard (H) gate creates equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩, placing the qubit at the equator of the Bloch sphere.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is quantum entanglement and how does QLearn demonstrate it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quantum entanglement is a phenomenon where two or more qubits become correlated so strongly that the quantum state of each cannot be described independently. In QLearn, you can create Bell states (maximally entangled pairs) in the circuit simulator by applying a Hadamard gate followed by a CNOT gate. The Quantum Teleportation and Superdense Coding modules heavily rely on entanglement.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is a qubit different from a classical bit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A classical bit is always definitively 0 or 1. A qubit can be in a superposition of both 0 and 1 simultaneously, represented as α|0⟩ + β|1⟩. Additionally, qubits can be entangled with each other, enabling quantum correlations with no classical analogue. This allows quantum computers to process exponentially more information in parallel for certain problem types.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use QLearn without any prior quantum computing knowledge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! QLearn is designed for all skill levels. Every module has a "Simple Mode" with intuitive analogies and everyday language, and an "Advanced / Math Mode" with full Dirac notation, unitary matrices, and Schrödinger equation formulations. The Schrödinger AI tutor also adapts its hints to your level.',
      },
    },
    {
      '@type': 'Question',
      name: "What is Grover's Algorithm and what speedup does it offer?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Grover's Algorithm is a quantum search algorithm that finds a marked item in an unsorted database of N items in O(√N) queries, compared to O(N) for classical brute-force search — a quadratic speedup. It uses amplitude amplification, oracle phase inversion, and the Grover diffusion operator. Explore it interactively at https://qlearn.tech/learn/grover.",
      },
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   8. BreadcrumbList Factory — call per route
────────────────────────────────────────────────────────── */
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
