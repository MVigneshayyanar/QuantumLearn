import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quantum Computing Practice Problems & Algorithm Challenges',
  description:
    'Test and sharpen your quantum computing skills with interactive exercises, qubit math problems, Dirac notation calculations, quantum circuit puzzles, and AI-guided hints from Schrödinger AI.',
  keywords: [
    'quantum computing practice',
    'quantum computing exercises',
    'quantum algorithm problems',
    'dirac notation practice',
    'quantum circuit exercises',
    'learn quantum computing by doing',
    'quantum coding questions',
    'bloch sphere exercises',
    'qubit superposition problems',
  ],
  alternates: {
    canonical: '/practice',
  },
  openGraph: {
    title: 'Quantum Computing Practice Problems & Challenges | QLearn',
    description:
      'Solve interactive quantum computing problems with instant feedback and Socratic AI hints.',
    url: '/practice',
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
