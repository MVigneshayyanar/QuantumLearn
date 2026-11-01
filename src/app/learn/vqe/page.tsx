'use client';

import React, { useState } from 'react';
import { AlgorithmModuleView } from '@/components/algorithm-module/AlgorithmModuleView';

export default function VQEPage() {
  const [interatomicDistance, setInteratomicDistance] = useState<'0.74' | '1.00' | '1.50'>('0.74');

  const intuitionSimple = `How do new life-saving medicines, efficient fertilizers, and super-batteries get discovered?
By simulating how electrons bond inside molecules!
The problem: electrons are deeply entangled quantum particles. Simulating a modest molecule like caffeine with classical supercomputers would require a hard drive larger than the visible universe!

The Variational Quantum Eigensolver (VQE) is the flagship algorithm for today's NISQ quantum computers:
1. Instead of running a massive quantum circuit that decoheres in milliseconds, VQE forms a quantum-classical tag team.
2. The Quantum Chip prepares a trial electron wave (ansatz) and measures its energy.
3. A Classical Supercomputer acts like a trainer: it looks at the energy, adjusts the dials (rotation angles θ), and asks the quantum chip to try again.
4. By the Rayleigh-Ritz law, the energy can never drop below the real ground state — so downhill optimization converges directly on the true molecular bond!`;

  const intuitionTechnical = `The Variational Quantum Eigensolver (VQE, Peruzzo et al. 2014) is a hybrid quantum-classical algorithm designed to calculate the minimum eigenvalue (ground state energy $E_0$) of a molecular electronic Hamiltonian $\\hat{H}$.

It relies fundamentally on the **Rayleigh-Ritz Variational Principle**:
$$\\langle \\psi(\\vec{\\theta}) | \\hat{H} | \\psi(\\vec{\\theta}) \\rangle \\ge E_0, \\quad \\forall \\vec{\\theta}$$

Workflow:
1. **Fermionic to Qubit Mapping**: Second-quantized electronic Hamiltonian $\\hat{H} = \\sum_{pq} h_{pq} a_p^\\dagger a_q + \\frac{1}{2} \\sum_{pqrs} g_{pqrs} a_p^\\dagger a_q^\\dagger a_s a_r$ is mapped via Jordan-Wigner transformation to a linear combination of Pauli string observables:
$$\\hat{H} = \\sum_{i} c_i \\hat{P}_i, \\quad \\hat{P}_i \\in \\{I, X, Y, Z\\}^{\\otimes n}$$
2. **Parameterized State Preparation**: A shallow Parameterized Quantum Circuit (ansatz $U(\\vec{\\theta})$) prepares trial state $|\\psi(\\vec{\\theta})\\rangle = U(\\vec{\\theta})|\\Phi_0\\rangle$ from a Hartree-Fock reference state.
3. **Quantum Measurement**: Evaluates expectation values $\\langle \\hat{P}_i \\rangle$ by measuring in respective Pauli bases.
4. **Classical Parameter Optimization**: Classical optimizer (COBYLA, SPSA, or L-BFGS-B) computes the energy estimate $E(\\vec{\\theta}) = \\sum_i c_i \\langle \\hat{P}_i \\rangle$ and iteratively updates parameters $\\vec{\\theta}_{k+1} = \\vec{\\theta}_k - \\eta \\nabla E(\\vec{\\theta}_k)$ until convergence to $E_0$.`;

  const mathWalkthrough = [
    {
      stepName: "Hartree-Fock Reference State Preparation",
      equation: "|\\psi_0\\rangle = |\\Phi_{\\text{HF}}\\rangle = |10\\rangle",
      descriptionSimple: "Set up the initial electron configuration (one electron in bonding orbital 0, antibonding orbital 1 empty).",
      descriptionTechnical: "Computational basis state $|10\\rangle$ representing mean-field Slater determinant occupation.",
      gateRationale: "Pauli-X gate on Q0 flips the ground state $|00\\rangle$ to the occupied Hartree-Fock state $|10\\rangle$.",
      stepGates: [
        { type: 'x', qubits: [0], step: 0 }
      ],
      commonMistakes: "Starting from $|00\\rangle$ (zero electrons), which represents physical vacuum rather than the molecule."
    },
    {
      stepName: "Parameterized Variational Rotation Layer",
      equation: "R_y(\\theta_1) \\otimes R_y(\\theta_2) |10\\rangle, \\quad R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}",
      descriptionSimple: "Apply rotation gates whose angles θ can be adjusted by the classical computer.",
      descriptionTechnical: "Single-qubit rotation gates introduce continuous variational degrees of freedom.",
      gateRationale: "Hadamard-like rotations on Q0 and Q1 create parameterized superpositions over molecular orbital configurations.",
      stepGates: [
        { type: 'x', qubits: [0], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 }
      ],
      commonMistakes: "Using rigid gates without parameters, preventing classical optimization from exploring the energy landscape."
    },
    {
      stepName: "Entangling Layer (Electron Correlation)",
      equation: "|\\psi(\\vec{\\theta})\\rangle = \\text{CNOT}_{0,1} \\Big( R_y(\\vec{\\theta}) |\\Phi_{\\text{HF}}\\rangle \\Big)",
      descriptionSimple: "Entangle the two qubits with CNOT to simulate quantum electron-electron repulsion (correlation).",
      descriptionTechnical: "Generates multi-orbital entanglement required to capture dynamic correlation beyond the mean-field Hartree-Fock approximation.",
      gateRationale: "A CNOT gate between Q0 and Q1 creates the quantum superposition of double-excitation configurations.",
      stepGates: [
        { type: 'x', qubits: [0], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [0, 1], step: 2 }
      ],
      commonMistakes: "Omitting entangling gates, which limits the ansatz to uncorrelated classical product states."
    },
    {
      stepName: "Pauli Measurement & Classical Feedback",
      equation: "\\langle \\hat{H} \\rangle = c_0 \\langle II \\rangle + c_1 \\langle Z_0 \\rangle + c_2 \\langle Z_1 \\rangle + c_3 \\langle Z_0 Z_1 \\rangle + c_4 \\langle X_0 X_1 \\rangle \\ge E_0",
      descriptionSimple: "Measure the qubits in Z and X bases, calculate energy, and let the classical optimizer update θ.",
      descriptionTechnical: "Expectation values of Pauli strings are accumulated over statistical shot counts and fed into classical gradient minimization.",
      gateRationale: "Z and S rotations followed by basis rotations and measurement yield the statistical expectation values for molecular energy evaluation.",
      stepGates: [
        { type: 'x', qubits: [0], step: 0 },
        { type: 'h', qubits: [0], step: 1 },
        { type: 'h', qubits: [1], step: 1 },
        { type: 'cx', qubits: [0, 1], step: 2 },
        { type: 'z', qubits: [0], step: 3 },
        { type: 's', qubits: [1], step: 3 },
        { type: 'cx', qubits: [0, 1], step: 4 },
        { type: 'measure', qubits: [0], step: 5 },
        { type: 'measure', qubits: [1], step: 5 }
      ],
      commonMistakes: "Trying to measure non-commuting Pauli observables (e.g. Z and X) in the same shot without separate circuit executions."
    }
  ];

  const paramControls = (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-bold text-dark-800 dark:text-dark-200 text-[11px]">H₂ Interatomic Bond Length:</span>
      <div className="inline-flex rounded-lg border border-dark-200 dark:border-dark-700 p-0.5 bg-dark-50 dark:bg-dark-800 gap-0.5">
        <button
          onClick={() => setInteratomicDistance('0.74')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            interatomicDistance === '0.74'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          R = 0.74 Å (Equilibrium Ground State: -1.137 Ha)
        </button>
        <button
          onClick={() => setInteratomicDistance('1.00')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            interatomicDistance === '1.00'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          R = 1.00 Å (Stretched: -1.101 Ha)
        </button>
        <button
          onClick={() => setInteratomicDistance('1.50')}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            interatomicDistance === '1.50'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-700'
          }`}
        >
          R = 1.50 Å (Dissociated: -1.025 Ha)
        </button>
      </div>
      <span className="text-dark-400 font-mono text-[10px] hidden sm:inline">Minimal Basis STO-3G</span>
    </div>
  );

  return (
    <AlgorithmModuleView
      moduleSlug="vqe"
      title="Variational Quantum Eigensolver (VQE)"
      subtitle="Hybrid quantum-classical optimization finding molecular ground state energies on noisy NISQ processors."
      category="Quantum Chemistry & NISQ"
      qubitCount={2}
      speedup="NISQ-Tolerant Chemical Simulation"
      intuitionSimple={intuitionSimple}
      intuitionTechnical={intuitionTechnical}
      mathWalkthrough={mathWalkthrough}
      algorithmBackendId="vqe"
      defaultParams={{ bond_length: interatomicDistance }}
      paramControls={paramControls}
    />
  );
}
