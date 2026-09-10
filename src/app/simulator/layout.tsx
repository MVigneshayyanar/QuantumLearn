import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quantum Circuit Simulator & Multi-Backend Builder (Qiskit, Cirq, PennyLane)',
  description:
    'Build and simulate quantum circuits directly in your browser. Drag-and-drop Hadamard, Pauli, Phase, and CNOT gates with real-time statevector calculations and export to IBM Qiskit, Google Cirq, Xanadu PennyLane, and OpenQASM.',
  keywords: [
    'quantum circuit simulator',
    'online quantum simulator',
    'quantum circuit builder',
    'qiskit online simulator',
    'google cirq simulator',
    'pennylane quantum simulator',
    'openqasm online editor',
    'quantum gates builder',
    'cnot gate simulator',
    'hadamard gate online',
    'multi qubit circuit builder',
    'quantum computing ide',
  ],
  alternates: {
    canonical: '/simulator',
  },
  openGraph: {
    title: 'Online Quantum Circuit Simulator (Qiskit, Cirq, PennyLane) | QLearn',
    description:
      'Interactive quantum circuit editor with instant code generation for IBM Qiskit, Google Cirq, and PennyLane.',
    url: '/simulator',
  },
};

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
