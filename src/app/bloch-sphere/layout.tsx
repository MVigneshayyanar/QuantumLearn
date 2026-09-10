import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: '3D Bloch Sphere Qubit Visualizer', item: `${siteUrl}/bloch-sphere` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: '3D Bloch Sphere Simulator & Interactive Qubit Visualizer',
  description: 'Real-time 3D Bloch sphere simulation for exploring qubit superposition, theta/phi angles, Pauli gate rotations, and quantum measurement collapse.',
  url: `${siteUrl}/bloch-sphere`,
  educationalLevel: 'Beginner',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Bloch Sphere, Qubit Statevector, Quantum Superposition, Dirac Notation, Pauli Gates, Quantum Measurement',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QLearn', url: siteUrl },
};

export const metadata: Metadata = {
  title: '3D Bloch Sphere Simulator & Interactive Qubit Visualizer',
  description:
    'Interactive 3D Bloch sphere simulator. Visualize qubit superposition, theta polar angle, phi azimuth, Dirac bra-ket notation, Pauli-X/Y/Z rotations, and statevector measurements in real-time.',
  keywords: [
    'bloch sphere',
    '3d bloch sphere',
    'bloch sphere simulator',
    'qubit visualization',
    'quantum state visualizer',
    'bloch sphere angles',
    'theta polar angle',
    'phi azimuth',
    'qubit superposition 3d',
    'pauli matrices bloch sphere',
    'dirac notation bloch sphere',
    'hadamard transformation sphere',
  ],
  alternates: { canonical: '/bloch-sphere' },
  openGraph: {
    title: '3D Bloch Sphere Simulator & Interactive Qubit Visualizer | QLearn',
    description: 'Real-time 3D Bloch sphere visualization. Control theta and phi angles, test quantum gates, and see qubit statevectors collapse upon measurement.',
    url: '/bloch-sphere',
  },
};

export default function BlochSphereLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="bloch-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="bloch-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
