import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Superdense Coding Protocol', item: `${siteUrl}/learn/superdense-coding` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Superdense Coding Protocol Simulator & Quantum Information Guide',
  description: 'Interactive simulation of the superdense coding protocol transmitting 2 classical bits using a single entangled qubit.',
  url: `${siteUrl}/learn/superdense-coding`,
  educationalLevel: 'Intermediate',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Superdense Coding, Quantum Communication, Bell Basis Measurement, Quantum Entanglement, Pauli Gate Encoding',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QLearn', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Superdense Coding Protocol Simulator & Quantum Information Guide',
  description:
    'Learn how the superdense coding protocol transmits two classical bits (00, 01, 10, 11) using only a single entangled qubit. Interactive quantum circuit simulation, Pauli gate encoding, and Bell basis measurement.',
  keywords: [
    'superdense coding',
    'dense coding quantum',
    'transmit 2 bits 1 qubit',
    'bell basis measurement',
    'quantum information theory',
    'quantum communication protocol',
    'superdense coding simulation',
    'quantum entanglement protocol',
  ],
  alternates: { canonical: '/learn/superdense-coding' },
  openGraph: {
    title: 'Superdense Coding Protocol Simulator & Guide | QLearn',
    description: 'Learn how to transmit two classical bits with one entangled qubit using the superdense coding quantum circuit.',
    url: '/learn/superdense-coding',
  },
};

export default function SuperdenseCodingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="superdense-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="superdense-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
