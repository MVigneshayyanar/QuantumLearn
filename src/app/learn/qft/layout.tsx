import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Quantum Fourier Transform (QFT)', item: `${siteUrl}/learn/qft` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Quantum Fourier Transform (QFT) Tutorial & Interactive Simulator | QuanBit',
  description: 'Interactive tutorial for the Quantum Fourier Transform demonstrating exponential speedup O(n²) in the frequency domain with step-by-step circuit simulation.',
  url: `${siteUrl}/learn/qft`,
  educationalLevel: 'Intermediate',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Quantum Fourier Transform, QFT, Controlled Phase Rotations, Frequency Domain, Quantum Speedup',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QuanBit', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Quantum Fourier Transform (QFT) Tutorial & Interactive Simulator | QuanBit',
  description:
    'Master the Quantum Fourier Transform (QFT) with interactive phase rotations, SWAP networks, and wave interference. Understand how QFT scales in O(n²) vs classical FFT O(n 2ⁿ).',
  keywords: [
    'quantum fourier transform',
    'qft quantum algorithm',
    'quantum fourier transform circuit',
    'qft simulation',
    'controlled phase rotation',
    'inverse qft',
    'quantum frequency domain',
    'quanbit qft'
  ],
  alternates: { canonical: '/learn/qft' },
  openGraph: {
    title: 'Quantum Fourier Transform (QFT) Simulator & Course | QuanBit',
    description: 'Interactive tutorial and circuit simulator for the Quantum Fourier Transform with 6-stage pedagogy.',
    url: '/learn/qft',
  },
};

export default function QFTLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="qft-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="qft-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
