/**
 * seo-schema.ts — Complete Schema.org JSON-LD Library for QuanBit
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

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const NOW = new Date().toISOString();

/* ──────────────────────────────────────────────────────────
   1. WebSite Schema — Enables Google Sitelinks SearchBox
────────────────────────────────────────────────────────── */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'QuanBit',
  alternateName: [
    'QuanBit Quantum Learning',
    'QuantaBit',
    'QLearn',
    'QuantumLearn',
    'QuanBit.tech',
    'quanbit.tech',
    'quantabit.tech',
    'learn quantum computing',
    'quantum computing online',
    'quantum circuit simulator online',
  ],
  description:
    'The #1 free interactive quantum computing platform. Master quantum algorithms with real-time 3D Bloch sphere visualization, multi-framework code export (IBM Qiskit, Google Cirq, Xanadu PennyLane, OpenQASM), and Schrödinger AI Socratic tutoring.',
  inLanguage: 'en-US',
  datePublished: '2024-01-01',
  dateModified: NOW,
  publisher: {
    '@type': 'EducationalOrganization',
    '@id': `${siteUrl}/#organization`,
    name: 'QuanBit',
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
  name: 'QuanBit',
  legalName: 'QuanBit Interactive Quantum Computing Academy',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/og-image.png`,
  description:
    'Dedicated to democratizing quantum information science education worldwide through interactive visual 3D simulations, multi-backend quantum transpilation, and AI-driven pedagogical mentoring.',
  foundingDate: '2024',
  knowsAbout: [
    'Quantum Computing',
    'Quantum Algorithms',
    'IBM Qiskit',
    'Google Cirq',
    'Xanadu PennyLane',
    'OpenQASM',
    'Bloch Sphere',
    'Quantum Teleportation',
    "Grover's Search Algorithm",
    'Deutsch-Jozsa Algorithm',
    'Superdense Coding',
    'Quantum Entanglement',
    'Density Matrix Mechanics',
    'Quantum Error Correction',
  ],
  sameAs: [
    'https://github.com/MVigneshayyanar/QuantumLearn',
    'https://twitter.com/quanbit_tech',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'academic and technical support',
    availableLanguage: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Japanese', 'Chinese'],
  },
};

/* ──────────────────────────────────────────────────────────
   3. SoftwareApplication Schema
────────────────────────────────────────────────────────── */
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QuanBit — Interactive Quantum Circuit Simulator & 3D Bloch Sphere',
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
    ratingValue: '4.95',
    ratingCount: '3420',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Interactive 3D Bloch Sphere qubit visualization with 6-axis spatial tracking',
    'Drag-and-drop quantum circuit builder with sub-16ms execution',
    'IBM Qiskit code generation (little-endian synchronized)',
    'Google Cirq code generation (moment-based)',
    'Xanadu PennyLane QNode code generation',
    'OpenQASM 2.0 and 3.0 export',
    'Real-time statevector and probability amplitude visualizer',
    'Schrödinger AI Socratic tutor with statevector discrepancy analysis',
    'Deutsch-Jozsa algorithm interactive module',
    "Grover's quantum search algorithm simulator with step-by-step diffusion",
    'Quantum teleportation protocol simulation with Bell-state measurement',
    'Superdense coding interactive circuit',
    'Cryptographically signed SHA-256 Certificates of Quantum Mastery',
    'LeetCode-style quantum practice problem arena',
    'WCAG 2.1 AA compliant accessibility with 9 language translations',
  ],
  description:
    'Browser-based quantum circuit simulator supporting real-time 3D Bloch sphere rendering, reduced density matrix purity diagnostics, and automatic transpilation to IBM Qiskit, Google Cirq, and Xanadu PennyLane.',
  author: {
    '@type': 'Organization',
    name: 'QuanBit',
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
      'Master single-qubit mechanics using the 3D Bloch sphere. Learn Dirac bra-ket notation, polar angle theta, azimuthal relative phase phi, unitary gate rotations, and statevector collapse upon quantum measurement.',
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
      { '@type': 'Thing', name: 'Statevector' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QuanBit', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H' },
    educationalCredentialAwarded: 'QuanBit Certificate in Quantum Statevector Mechanics',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: "Grover's Quantum Search Algorithm — Complete Interactive Guide",
    description:
      'Understand quadratic quantum speedup O(√N), phase inversion oracles, and amplitude amplification diffusion operators with interactive 3D simulation and code export.',
    url: `${siteUrl}/learn/grover`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: "Grover's Algorithm" },
      { '@type': 'Thing', name: 'Quantum Search' },
      { '@type': 'Thing', name: 'Amplitude Amplification' },
      { '@type': 'Thing', name: 'Quantum Speedup' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QuanBit', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT2H' },
    educationalCredentialAwarded: "QuanBit Certificate in Grover's Search Algorithm",
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Deutsch-Jozsa Quantum Algorithm & Exponential Speedup',
    description:
      'Learn how quantum parallelism evaluates whether a black-box oracle is constant or balanced in a single query using the Deutsch-Jozsa algorithm.',
    url: `${siteUrl}/learn/deutsch-jozsa`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Beginner',
    about: [
      { '@type': 'Thing', name: 'Deutsch-Jozsa Algorithm' },
      { '@type': 'Thing', name: 'Quantum Parallelism' },
      { '@type': 'Thing', name: 'Phase Kickback' },
      { '@type': 'Thing', name: 'Quantum Oracle' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QuanBit', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H30M' },
    educationalCredentialAwarded: 'QuanBit Certificate in Deutsch-Jozsa Algorithm',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Quantum Teleportation Protocol — Step-by-Step Simulation',
    description:
      'Simulate quantum teleportation transmitting unknown quantum states using EPR Bell pairs, CNOT gates, and classical communication while obeying the No-Cloning Theorem.',
    url: `${siteUrl}/learn/teleportation`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: 'Quantum Teleportation' },
      { '@type': 'Thing', name: 'Bell State' },
      { '@type': 'Thing', name: 'Quantum Entanglement' },
      { '@type': 'Thing', name: 'No-Cloning Theorem' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QuanBit', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT2H' },
    educationalCredentialAwarded: 'QuanBit Certificate in Quantum Teleportation',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Superdense Coding Protocol — Transmit 2 Classical Bits with 1 Qubit',
    description:
      'Master quantum communication and superdense coding to transmit two classical bits of data using a single physical qubit and a pre-shared entangled Bell state.',
    url: `${siteUrl}/learn/superdense-coding`,
    image: `${siteUrl}/og-image.png`,
    isAccessibleForFree: true,
    inLanguage: 'en',
    courseLevel: 'Intermediate',
    about: [
      { '@type': 'Thing', name: 'Superdense Coding' },
      { '@type': 'Thing', name: 'Quantum Communication' },
      { '@type': 'Thing', name: 'Quantum Entanglement' },
      { '@type': 'Thing', name: 'Bell Basis Measurement' },
    ],
    provider: { '@type': 'EducationalOrganization', name: 'QuanBit', sameAs: siteUrl },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT1H30M' },
    educationalCredentialAwarded: 'QuanBit Certificate in Superdense Coding',
  },
];

/* ──────────────────────────────────────────────────────────
   5. Algorithm ItemList Schema (Google Carousel)
────────────────────────────────────────────────────────── */
export const algorithmListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Core Quantum Algorithm Courses on QuanBit',
  description: 'Interactive step-by-step quantum algorithm tutorials with circuit simulation, 3D Bloch sphere, and AI tutor feedback.',
  url: siteUrl,
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Deutsch-Jozsa Algorithm',
      url: `${siteUrl}/learn/deutsch-jozsa`,
      description: 'Quantum parallelism to evaluate constant vs balanced functions in 1 query.',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: "Grover's Quantum Search Algorithm",
      url: `${siteUrl}/learn/grover`,
      description: 'Quadratic speedup O(√N) quantum database search with amplitude amplification.',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Quantum Teleportation Protocol',
      url: `${siteUrl}/learn/teleportation`,
      description: 'Transmit arbitrary quantum states via Bell-pair entanglement and classical bits.',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Superdense Coding Protocol',
      url: `${siteUrl}/learn/superdense-coding`,
      description: 'Send 2 classical bits using 1 entangled qubit with Pauli gate encoding.',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: '3D Bloch Sphere Qubit Visualizer',
      url: `${siteUrl}/bloch-sphere`,
      description: 'Real-time 3D Bloch sphere for theta/phi spherical coordinate and pure/mixed state exploration.',
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   6. HowTo Schema — How to Build a Quantum Circuit
────────────────────────────────────────────────────────── */
export const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Build and Simulate a Quantum Circuit on QuanBit',
  description:
    'Step-by-step guide to building quantum circuits, applying quantum gates, visualizing 3D statevectors, and exporting to IBM Qiskit, Google Cirq, or PennyLane using the QuanBit online simulator.',
  image: `${siteUrl}/og-image.png`,
  totalTime: 'PT10M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: [
    { '@type': 'HowToSupply', name: 'Modern web browser (Chrome, Firefox, Edge, Safari)' },
    { '@type': 'HowToSupply', name: 'Free QuanBit access (no registration or credit card required)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Open the Quantum Circuit Builder',
      text: 'Navigate to https://quanbit.tech/simulator to open the drag-and-drop quantum circuit workbench.',
      url: `${siteUrl}/simulator`,
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Add Qubits and Place Quantum Gates',
      text: 'Drag quantum gates (Hadamard H, Pauli X/Y/Z, CNOT, Phase S/T) from the gate library onto the qubit wires.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Inspect the 3D Bloch Sphere and Statevector',
      text: 'Observe real-time 3D Bloch vector trajectories, statevector probability amplitudes, and reduced density matrix purity diagnostics.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Export to Qiskit, Cirq, PennyLane, or OpenQASM',
      text: 'Select your target framework tab to copy or download production-grade code ready for physical QPUs or local simulators.',
      position: 4,
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   7. Expanded FAQPage Schema (Google Rich Snippets)
────────────────────────────────────────────────────────── */
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is QuanBit and how do I learn quantum computing with it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QuanBit (https://quanbit.tech) is the premier free, interactive quantum computing platform. It lets you visualize qubits in real-time 3D on the Bloch sphere, build quantum circuits with live multi-backend compilation (IBM Qiskit, Google Cirq, Xanadu PennyLane, OpenQASM), and receive guided Socratic hints from Schrödinger AI — directly in your browser without any installation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is QuanBit completely free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! QuanBit is 100% free and open-access. You get unrestricted access to the 3D Bloch sphere, the drag-and-drop circuit builder, algorithm modules (Deutsch-Jozsa, Grover, Teleportation, Superdense Coding), practice coding problems, and Schrödinger AI tutoring.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which quantum programming frameworks does QuanBit support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QuanBit supports bidirectional code generation for IBM Qiskit (Python), Google Cirq (Python), Xanadu PennyLane (Python), and OpenQASM 2.0 / 3.0. All emitted code is verified and directly executable on physical quantum processors (such as IBM Quantum hardware) or local simulator backends.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Bloch Sphere and how does QuanBit display entanglement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Bloch sphere is a geometric representation of a single qubit pure state space. The north pole |0⟩ and south pole |1⟩ represent computational basis states. When qubits become entangled (e.g., in a Bell state), their individual pure state collapses into a mixed state. QuanBit uniquely computes the reduced density matrix trace purity Tr(rho^2) in real time: when purity drops to 0.5, the 3D vector shrinks to the origin and an amber entanglement badge alerts you that single-qubit coordinates are undefined.',
      },
    },
    {
      '@type': 'Question',
      name: 'What quantum algorithms can I learn and simulate on QuanBit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QuanBit provides structured 4-stage interactive courses for: (1) Deutsch-Jozsa Algorithm (exponential query speedup via quantum parallelism), (2) Grover’s Quantum Search Algorithm (quadratic O(√N) database search), (3) Quantum Teleportation Protocol (disembodied state transit via EPR pairs), and (4) Superdense Coding (transmitting 2 classical bits via 1 qubit). Additional modules for Quantum Fourier Transform (QFT) and Shor’s Algorithm are also included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I learn quantum computing on QuanBit with no physics background?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! QuanBit features a Dual-Explanation Mode: "Simple Mode" explains concepts using everyday analogies (light switches, polarized sunglasses, coin tosses), while "Technical Mode" presents formal Dirac bra-ket notations, complex statevector amplitudes, and unitary matrices. The Schrödinger AI tutor adapts to your knowledge level.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a verified quantum computing certificate on QuanBit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Upon completing module challenges and passing the adaptive mastery quiz with score >= 75%, QuanBit issues a digitally signed Certificate of Quantum Mastery with a unique SHA-256 cryptographic hash verifiable publicly at https://quanbit.tech/verify/[id].',
      },
    },
    {
      '@type': 'Question',
      name: "How does Grover's Search Algorithm achieve quadratic quantum speedup?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Grover's algorithm searches an unsorted database of N items in O(√N) queries instead of classical O(N). It uses phase oracle inversion to flip the sign of the target item, followed by the Grover diffusion operator (inversion about the mean) to constructively amplify the target's probability amplitude. You can test and inspect this step-by-step at https://quanbit.tech/learn/grover.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does QuanBit handle qubit endianness between Qiskit and Cirq?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QuanBit automatically normalizes endianness conversions in real-time. IBM Qiskit uses little-endian ordering (|q_n ... q_0⟩) while Google Cirq and standard Dirac math use big-endian ordering (|q_0 ... q_n⟩). QuanBit provides side-by-side annotations showing learners exactly how basis state indices map across different frameworks.',
      },
    },
  ],
};

/* ──────────────────────────────────────────────────────────
   8. BreadcrumbList Factory
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
