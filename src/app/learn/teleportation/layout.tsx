import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Quantum Teleportation Protocol', item: `${siteUrl}/learn/teleportation` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Quantum Teleportation Protocol Simulator & Step-by-Step Guide',
  description: 'Interactive simulation of quantum teleportation using Bell state entanglement and classical communication channels.',
  url: `${siteUrl}/learn/teleportation`,
  educationalLevel: 'Intermediate',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Quantum Teleportation, Bell State, EPR Pairs, No-Cloning Theorem, Quantum Entanglement',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QLearn', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Quantum Teleportation Protocol Simulator & Step-by-Step Guide',
  description:
    'Explore the quantum teleportation protocol. Understand Bell state entanglement, Einstein-Podolsky-Rosen (EPR) pairs, quantum measurement collapse, classical communication channels, and the no-cloning theorem.',
  keywords: [
    'quantum teleportation',
    'quantum teleportation protocol',
    'bell state entanglement',
    'epr pair quantum',
    'no cloning theorem',
    'quantum communication',
    'teleporting quantum states',
    'quantum teleportation circuit',
    'alice and bob quantum',
  ],
  alternates: { canonical: '/learn/teleportation' },
  openGraph: {
    title: 'Quantum Teleportation Protocol Simulator | QLearn',
    description: 'Step-by-step interactive simulator transmitting unknown quantum states through Bell-state entanglement and classical bits.',
    url: '/learn/teleportation',
  },
};

export default function TeleportationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="teleportation-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="teleportation-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
