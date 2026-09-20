import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: "Grover's Quantum Search Algorithm", item: `${siteUrl}/learn/grover` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: "Grover's Quantum Search Algorithm Tutorial & Interactive Simulator | QuanBit",
  description: "Interactive tutorial for Grover's algorithm demonstrating quadratic quantum speedup O(√N) via amplitude amplification.",
  url: `${siteUrl}/learn/grover`,
  educationalLevel: 'Intermediate',
  learningResourceType: 'Interactive Simulation',
  teaches: "Grover's Algorithm, Amplitude Amplification, Quantum Oracle, Quadratic Speedup",
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QuanBit', url: siteUrl },
};

export const metadata: Metadata = {
  title: "Grover's Quantum Search Algorithm Tutorial & Interactive Simulator | QuanBit",
  description:
    "Master Grover's algorithm with interactive phase inversion oracles, diffusion operators, and amplitude amplification. Understand how quantum computing provides a quadratic speedup O(sqrt(N)) over classical brute-force search.",
  keywords: [
    'grovers algorithm',
    'grover search algorithm',
    'quantum search algorithm',
    'amplitude amplification',
    'grover diffusion operator',
    'quantum oracle phase inversion',
    'quadratic speedup quantum',
    'grovers algorithm step by step',
    'grover simulation online',
    'quanbit grover algorithm',
  ],
  alternates: { canonical: '/learn/grover' },
  openGraph: {
    title: "Grover's Quantum Search Algorithm Step-by-Step Simulator | QuanBit",
    description: "Interactive tutorial and visualizer for Grover's quantum search algorithm and amplitude amplification.",
    url: '/learn/grover',
  },
};

export default function GroverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="grover-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="grover-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
