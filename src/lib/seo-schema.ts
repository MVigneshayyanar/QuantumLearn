/**
 * Structured Data (Schema.org JSON-LD) for QLearn Platform
 * Powers Google Rich Snippets, Sitelinks Searchbox, Course Badges, and Knowledge Graph
 */

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qlearn.tech';

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'QLearn',
  alternateName: ['QuantumLearn', 'QLearn.tech', 'qlearn.tech'],
  description:
    'Free interactive quantum computing platform with 3D Bloch spheres, multi-simulator engine (Qiskit, Cirq, PennyLane), and Socratic AI tutoring.',
  inLanguage: 'en-US',
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'QLearn',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
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

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${siteUrl}/#organization`,
  name: 'QLearn',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://github.com/MVigneshayyanar/QuantumLearn',
    'https://twitter.com/qlearn_tech',
  ],
  description:
    'Dedicated to making quantum computing intuitive and accessible through interactive visual simulations and AI guidance.',
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QLearn Quantum Circuit Simulator & 3D Bloch Sphere',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any (Web Browser)',
  browserRequirements: 'Requires JavaScript, WebGL for 3D Bloch Sphere',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Interactive web-based quantum circuit simulator supporting IBM Qiskit, Google Cirq, and Xanadu PennyLane code export with real-time 3D Bloch sphere statevector rendering.',
};

export const courseSchemaList = [
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Interactive 3D Bloch Sphere & Qubit Statevector Exploration',
    description:
      'Master single-qubit representation, superposition, Dirac bra-ket notation, and rotation matrices on the 3D Bloch Sphere.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'QLearn',
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT1H',
    },
    url: `${siteUrl}/bloch-sphere`,
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: "Grover's Quantum Search Algorithm",
    description:
      'Understand quadratic quantum speedup O(sqrt(N)), phase inversion oracles, and amplitude amplification diffusion operators.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'QLearn',
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT2H',
    },
    url: `${siteUrl}/learn/grover`,
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Deutsch-Jozsa Algorithm & Quantum Parallelism',
    description:
      'Learn how quantum parallelism determines whether a function is constant or balanced in a single query with exponential speedup.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'QLearn',
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT1H30M',
    },
    url: `${siteUrl}/learn/deutsch-jozsa`,
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Quantum Teleportation Protocol & Entanglement',
    description:
      'Step-by-step quantum teleportation simulation transmitting unknown quantum states using Bell states and classical communication.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'QLearn',
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT2H',
    },
    url: `${siteUrl}/learn/teleportation`,
    isAccessibleForFree: true,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Superdense Coding Quantum Protocol',
    description:
      'Learn how to transmit two classical bits of information using only one physical entangled qubit.',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'QLearn',
      sameAs: siteUrl,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT1H30M',
    },
    url: `${siteUrl}/learn/superdense-coding`,
    isAccessibleForFree: true,
  },
];

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is QLearn and how does it help learn quantum computing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QLearn is an AI-powered interactive quantum learning platform that lets you visualize qubits in 3D using a real-time Bloch Sphere, build quantum circuits with multi-backend simulation (IBM Qiskit, Google Cirq, Xanadu PennyLane), and get guided Socratic hints from the Schrödinger AI tutor.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is QLearn completely free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Core interactive tutorials, 3D Bloch sphere simulations, circuit builder, algorithm modules, and community practice problems are completely free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which quantum programming frameworks does QLearn support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QLearn supports live code generation and multi-backend simulation for IBM Qiskit, Google Cirq, and Xanadu PennyLane, with instant OpenQASM 2.0 and 3.0 circuit export.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Bloch Sphere in quantum computing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Bloch sphere is a geometric representation of the pure state space of a two-level quantum mechanical system (qubit). The north pole represents |0⟩, the south pole represents |1⟩, and the equator represents equal superpositions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What quantum algorithms can I learn on QLearn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can learn Deutsch-Jozsa, Grover’s Quantum Search, Quantum Teleportation, Superdense Coding, Quantum Fourier Transform (QFT), and Shor’s Algorithm with interactive step-by-step statevector and probability visualizers.',
      },
    },
  ],
};
