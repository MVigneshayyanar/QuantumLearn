import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Circuit Simulator', item: `${siteUrl}/simulator` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Online Quantum Circuit Simulator & Multi-Backend Builder (Qiskit, Cirq, PennyLane)',
  description: 'Drag-and-drop quantum circuit editor with real-time statevector visualization and code export for IBM Qiskit, Google Cirq, and Xanadu PennyLane.',
  url: `${siteUrl}/simulator`,
  educationalLevel: 'Beginner to Advanced',
  learningResourceType: 'Simulation Tool',
  teaches: 'Quantum Circuit Design, Qiskit, Google Cirq, PennyLane, OpenQASM, Quantum Gates, Statevector',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QLearn', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Quantum Circuit Simulator & Multi-Backend Builder (Qiskit, Cirq, PennyLane)',
  description:
    'Build and simulate quantum circuits directly in your browser. Drag-and-drop Hadamard, Pauli, Phase, and CNOT gates with real-time statevector calculations and export to IBM Qiskit, Google Cirq, Xanadu PennyLane, and OpenQASM.',
  keywords: [
    'quantum circuit simulator',
    'online quantum simulator',
    'quantum circuit builder',
    'qiskit online simulator',
    'google cirq simulator',
    'pennylane quantum simulator',
    'openqasm online editor',
    'quantum gates builder',
    'cnot gate simulator',
    'hadamard gate online',
    'multi qubit circuit builder',
    'quantum computing ide',
  ],
  alternates: { canonical: '/simulator' },
  openGraph: {
    title: 'Online Quantum Circuit Simulator (Qiskit, Cirq, PennyLane) | QLearn',
    description: 'Interactive quantum circuit editor with instant code generation for IBM Qiskit, Google Cirq, and PennyLane.',
    url: '/simulator',
  },
};

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="simulator-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="simulator-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
