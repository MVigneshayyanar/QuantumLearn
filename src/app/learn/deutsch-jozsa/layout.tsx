import type { Metadata } from 'next';

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
  alternates: {
    canonical: '/learn/deutsch-jozsa',
  },
  openGraph: {
    title: 'Deutsch-Jozsa Quantum Algorithm Simulator & Guide | QLearn',
    description:
      'Step-by-step interactive simulation of the Deutsch-Jozsa algorithm demonstrating quantum superposition and parallelism.',
    url: '/learn/deutsch-jozsa',
  },
};

export default function DeutschJozsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
