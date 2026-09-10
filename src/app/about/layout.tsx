import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About QLearn | The Future of Interactive Quantum Education',
  description:
    'Discover QLearn’s mission to democratize quantum computing education. Learn how our multi-backend simulation engine (Qiskit, Cirq, PennyLane), 3D Bloch sphere, and Socratic AI tutor empower the next generation of quantum researchers and developers.',
  keywords: [
    'about qlearn',
    'quantum computing education platform',
    'interactive quantum learning',
    'quantum learning mission',
    'accessible quantum computing',
    'quantum simulation web',
    'schrodinger ai tutor',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About QLearn | Interactive Quantum Computing Platform',
    description:
      'Learn about QLearn - an interactive quantum algorithm learning platform bridging physics, mathematics, and quantum software engineering.',
    url: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
