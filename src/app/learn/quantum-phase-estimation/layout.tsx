import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Quantum Phase Estimation', item: `${siteUrl}/learn/quantum-phase-estimation` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Quantum Phase Estimation Tutorial & Simulator | QuanBit',
  description: 'Learn Quantum Phase Estimation (QPE) with interactive controlled unitary powers, phase kickback, and inverse QFT decoding.',
  url: `${siteUrl}/learn/quantum-phase-estimation`,
  educationalLevel: 'Advanced',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Quantum Phase Estimation, QPE, Unitary Eigenvalues, Phase Kickback, Hamiltonian Simulation',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QuanBit', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Quantum Phase Estimation (QPE) Tutorial & Simulator | QuanBit',
  description:
    'Master Quantum Phase Estimation (QPE) with step-by-step circuit simulations, controlled-U operations, and eigenvalue extraction. The foundation of Shor’s algorithm and quantum chemistry.',
  keywords: [
    'quantum phase estimation',
    'qpe algorithm',
    'eigenvalue estimation quantum',
    'controlled unitary powers',
    'inverse qft readout',
    'quantum phase estimation simulation',
    'quanbit qpe'
  ],
  alternates: { canonical: '/learn/quantum-phase-estimation' },
  openGraph: {
    title: 'Quantum Phase Estimation (QPE) Interactive Guide | QuanBit',
    description: 'Learn Quantum Phase Estimation with interactive statevector analysis, controlled unitaries, and inverse QFT.',
    url: '/learn/quantum-phase-estimation',
  },
};

export default function QPELayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="qpe-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="qpe-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
