import type { Metadata } from 'next';

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
  alternates: {
    canonical: '/learn/teleportation',
  },
  openGraph: {
    title: 'Quantum Teleportation Protocol Simulator | QLearn',
    description:
      'Step-by-step interactive simulator transmitting unknown quantum states through Bell-state entanglement and classical bits.',
    url: '/learn/teleportation',
  },
};

export default function TeleportationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
