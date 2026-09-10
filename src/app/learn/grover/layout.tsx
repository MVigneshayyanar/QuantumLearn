import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Grover's Quantum Search Algorithm Tutorial & Interactive Simulator",
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
  ],
  alternates: {
    canonical: '/learn/grover',
  },
  openGraph: {
    title: "Grover's Quantum Search Algorithm Step-by-Step Simulator | QLearn",
    description:
      "Interactive tutorial and visualizer for Grover's quantum search algorithm and amplitude amplification.",
    url: '/learn/grover',
  },
};

export default function GroverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
