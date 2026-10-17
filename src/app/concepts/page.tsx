import { Metadata } from 'next';
import { QuantumAcademyExact } from '@/components/concepts/QuantumAcademyExact';

export const metadata: Metadata = {
  title: 'Quantum Academy | QuanBit',
  description: 'A complete, self-contained course in quantum computing: physics, maths, a 3D Bloch sphere, a circuit composer, every major algorithm, noise and error correction, and quantum reservoir computing — all interactive.',
};

export default function ConceptsPage() {
  return <QuantumAcademyExact />;
}



