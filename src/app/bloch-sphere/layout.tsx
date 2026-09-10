import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Bloch Sphere Simulator & Interactive Qubit Visualizer',
  description:
    'Interactive 3D Bloch sphere simulator. Visualize qubit superposition, theta polar angle, phi azimuth, Dirac bra-ket notation, Pauli-X/Y/Z rotations, and statevector measurements in real-time.',
  keywords: [
    'bloch sphere',
    '3d bloch sphere',
    'bloch sphere simulator',
    'qubit visualization',
    'quantum state visualizer',
    'bloch sphere angles',
    'theta polar angle',
    'phi azimuth',
    'qubit superposition 3d',
    'pauli matrices bloch sphere',
    'dirac notation bloch sphere',
    'hadamard transformation sphere',
  ],
  alternates: {
    canonical: '/bloch-sphere',
  },
  openGraph: {
    title: '3D Bloch Sphere Simulator & Interactive Qubit Visualizer | QLearn',
    description:
      'Real-time 3D Bloch sphere visualization. Control theta and phi angles, test quantum gates, and see qubit statevectors collapse upon measurement.',
    url: '/bloch-sphere',
  },
};

export default function BlochSphereLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
