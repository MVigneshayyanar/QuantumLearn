import type { Metadata } from 'next';

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
  alternates: {
    canonical: '/learn/superdense-coding',
  },
  openGraph: {
    title: 'Superdense Coding Protocol Simulator & Guide | QLearn',
    description:
      'Learn how to transmit two classical bits with one entangled qubit using the superdense coding quantum circuit.',
    url: '/learn/superdense-coding',
  },
};

export default function SuperdenseCodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
