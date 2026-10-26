import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Variational Quantum Eigensolver (VQE)', item: `${siteUrl}/learn/vqe` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Variational Quantum Eigensolver (VQE) Simulator & Guide | QuanBit',
  description: 'Interactive tutorial for the Variational Quantum Eigensolver (VQE) demonstrating hybrid quantum-classical molecular energy simulation on NISQ processors.',
  url: `${siteUrl}/learn/vqe`,
  educationalLevel: 'Advanced',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Variational Quantum Eigensolver, VQE, Molecular Simulation, Hartree-Fock, Quantum Chemistry, NISQ Algorithms',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QuanBit', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Variational Quantum Eigensolver (VQE) Tutorial & Simulator | QuanBit',
  description:
    'Master the Variational Quantum Eigensolver (VQE) with interactive molecular bond calculations, parameterized ansatz circuits, and classical optimization.',
  keywords: [
    'variational quantum eigensolver',
    'vqe quantum algorithm',
    'quantum chemistry simulation',
    'molecular ground state vqe',
    'parameterized quantum circuit',
    'nisq algorithms',
    'quanbit vqe'
  ],
  alternates: { canonical: '/learn/vqe' },
  openGraph: {
    title: 'Variational Quantum Eigensolver (VQE) Interactive Simulator | QuanBit',
    description: 'Interactive tutorial and circuit simulator for VQE and quantum molecular chemistry on NISQ hardware.',
    url: '/learn/vqe',
  },
};

export default function VQELayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="vqe-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="vqe-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
