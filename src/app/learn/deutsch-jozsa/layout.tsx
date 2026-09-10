import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.qlearn.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: 'Deutsch-Jozsa Algorithm', item: `${siteUrl}/learn/deutsch-jozsa` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Deutsch-Jozsa Quantum Algorithm Interactive Tutorial & Simulator',
  description: 'Interactive tutorial demonstrating quantum parallelism: determine whether a function is constant or balanced in a single query.',
  url: `${siteUrl}/learn/deutsch-jozsa`,
  educationalLevel: 'Beginner to Intermediate',
  learningResourceType: 'Interactive Simulation',
  teaches: 'Deutsch-Jozsa Algorithm, Quantum Parallelism, Phase Kickback, Quantum Oracle, Exponential Speedup',
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QLearn', url: siteUrl },
};

export const metadata: Metadata = {
  title: 'Deutsch-Jozsa Quantum Algorithm Interactive Tutorial & Simulator',
  description:
    'Learn the Deutsch-Jozsa quantum algorithm step-by-step. Understand quantum parallelism, balanced vs constant oracles, phase kickback, and how quantum computers solve oracular problems with exponential speedup.',
  keywords: [
    'deutsch jozsa algorithm',
    'deutsch jozsa quantum',
    'constant vs balanced oracle',
    'quantum parallelism',
    'phase kickback',
    'quantum speedup',
    'deutsch jozsa tutorial',
    'deutsch algorithm interactive',
    'quantum oracle tutorial',
  ],
  alternates: { canonical: '/learn/deutsch-jozsa' },
  openGraph: {
    title: 'Deutsch-Jozsa Quantum Algorithm Simulator & Guide | QLearn',
    description: 'Step-by-step interactive simulation of the Deutsch-Jozsa algorithm demonstrating quantum superposition and parallelism.',
    url: '/learn/deutsch-jozsa',
  },
};

export default function DeutschJozsaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="deutsch-jozsa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="deutsch-jozsa-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
