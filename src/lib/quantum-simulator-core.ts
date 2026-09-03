import { ComplexAmplitude, BlochVector, SimulationResult, PlacedGate, StepSnapshot } from './types';

// Complex number utilities
interface Complex {
  r: number; // real
  i: number; // imag
}

function cAdd(a: Complex, b: Complex): Complex {
  return { r: a.r + b.r, i: a.i + b.i };
}

function cSub(a: Complex, b: Complex): Complex {
  return { r: a.r - b.r, i: a.i - b.i };
}

function cMul(a: Complex, b: Complex): Complex {
  return { r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r };
}

function cScale(a: Complex, s: number): Complex {
  return { r: a.r * s, i: a.i * s };
}

function cMag(a: Complex): number {
  return Math.sqrt(a.r * a.r + a.i * a.i);
}

function cPhase(a: Complex): number {
  return Math.atan2(a.i, a.r);
}

const INV_SQRT2 = 1 / Math.SQRT2;

// Standard single-qubit 2x2 unitary matrices
const GATES_1Q: Record<string, Complex[][]> = {
  h: [
    [{ r: INV_SQRT2, i: 0 }, { r: INV_SQRT2, i: 0 }],
    [{ r: INV_SQRT2, i: 0 }, { r: -INV_SQRT2, i: 0 }]
  ],
  x: [
    [{ r: 0, i: 0 }, { r: 1, i: 0 }],
    [{ r: 1, i: 0 }, { r: 0, i: 0 }]
  ],
  y: [
    [{ r: 0, i: 0 }, { r: 0, i: -1 }],
    [{ r: 0, i: 1 }, { r: 0, i: 0 }]
  ],
  z: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: -1, i: 0 }]
  ],
  s: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: 0, i: 1 }]
  ],
  t: [
    [{ r: 1, i: 0 }, { r: 0, i: 0 }],
    [{ r: 0, i: 0 }, { r: Math.cos(Math.PI / 4), i: Math.sin(Math.PI / 4) }]
  ]
};

export class QuantumState {
  numQubits: number;
  dim: number;
  amplitudes: Complex[];

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.dim = 1 << numQubits;
    this.amplitudes = new Array(this.dim).fill(0).map((_, idx) => ({
      r: idx === 0 ? 1 : 0,
      i: 0
    }));
  }

  clone(): QuantumState {
    const next = new QuantumState(this.numQubits);
    next.amplitudes = this.amplitudes.map(a => ({ r: a.r, i: a.i }));
    return next;
  }

  // Apply single qubit gate to qubit target (0 = q0, rightmost/least significant in bit index)
  apply1Q(target: number, matrix: Complex[][]) {
    const nextAmps = new Array(this.dim).fill(0).map(() => ({ r: 0, i: 0 }));
    const targetBit = 1 << target;

    for (let i = 0; i < this.dim; i++) {
      if ((i & targetBit) === 0) {
        const i0 = i;
        const i1 = i | targetBit;
        const amp0 = this.amplitudes[i0];
        const amp1 = this.amplitudes[i1];

        // next0 = m00 * amp0 + m01 * amp1
        nextAmps[i0] = cAdd(cMul(matrix[0][0], amp0), cMul(matrix[0][1], amp1));
        // next1 = m10 * amp0 + m11 * amp1
        nextAmps[i1] = cAdd(cMul(matrix[1][0], amp0), cMul(matrix[1][1], amp1));
      }
    }
    this.amplitudes = nextAmps;
  }

  // Apply CNOT (CX)
  applyCX(control: number, target: number) {
    const controlBit = 1 << control;
    const targetBit = 1 << target;
    const nextAmps = this.amplitudes.map(a => ({ r: a.r, i: a.i }));

    for (let i = 0; i < this.dim; i++) {
      if ((i & controlBit) !== 0 && (i & targetBit) === 0) {
        const i0 = i;
        const i1 = i | targetBit;
        // Swap amplitudes between |...1...0...> and |...1...1...>
        const temp = nextAmps[i0];
        nextAmps[i0] = nextAmps[i1];
        nextAmps[i1] = temp;
      }
    }
    this.amplitudes = nextAmps;
  }

  // Apply Controlled-Z (CZ)
  applyCZ(control: number, target: number) {
    const controlBit = 1 << control;
    const targetBit = 1 << target;
    for (let i = 0; i < this.dim; i++) {
      if ((i & controlBit) !== 0 && (i & targetBit) !== 0) {
        this.amplitudes[i] = { r: -this.amplitudes[i].r, i: -this.amplitudes[i].i };
      }
    }
  }

  // Apply SWAP
  applySWAP(qubitA: number, qubitB: number) {
    const bitA = 1 << qubitA;
    const bitB = 1 << qubitB;
    const nextAmps = this.amplitudes.map(a => ({ r: a.r, i: a.i }));

    for (let i = 0; i < this.dim; i++) {
      const isA = (i & bitA) !== 0;
      const isB = (i & bitB) !== 0;
      if (isA !== isB && !isA) {
        const iA0_B1 = i;
        const iA1_B0 = (i | bitA) & ~bitB;
        const temp = nextAmps[iA0_B1];
        nextAmps[iA0_B1] = nextAmps[iA1_B0];
        nextAmps[iA1_B0] = temp;
      }
    }
    this.amplitudes = nextAmps;
  }

  // Compute 2x2 reduced density matrix for qubit k via partial trace
  getReducedDensityMatrix(targetQubit: number): Complex[][] {
    const targetBit = 1 << targetQubit;
    let rho00: Complex = { r: 0, i: 0 };
    let rho01: Complex = { r: 0, i: 0 };
    let rho10: Complex = { r: 0, i: 0 };
    let rho11: Complex = { r: 0, i: 0 };

    for (let i = 0; i < this.dim; i++) {
      if ((i & targetBit) === 0) {
        const i0 = i;
        const i1 = i | targetBit;
        const amp0 = this.amplitudes[i0];
        const amp1 = this.amplitudes[i1];

        // rho00 += |amp0|^2
        rho00 = cAdd(rho00, { r: amp0.r * amp0.r + amp0.i * amp0.i, i: 0 });
        // rho11 += |amp1|^2
        rho11 = cAdd(rho11, { r: amp1.r * amp1.r + amp1.i * amp1.i, i: 0 });
        // rho01 += amp0 * conj(amp1)
        rho01 = cAdd(rho01, { r: amp0.r * amp1.r + amp0.i * amp1.i, i: amp0.i * amp1.r - amp0.r * amp1.i });
        // rho10 += amp1 * conj(amp0)
        rho10 = cAdd(rho10, { r: amp1.r * amp0.r + amp1.i * amp0.i, i: amp1.i * amp0.r - amp1.r * amp0.i });
      }
    }

    return [
      [rho00, rho01],
      [rho10, rho11]
    ];
  }

  // Calculate Bloch coordinates and verify purity
  getBlochVector(qubit: number): { bloch: BlochVector | null; warning?: string } {
    const rho = this.getReducedDensityMatrix(qubit);

    // Tr(rho^2) = rho00^2 + rho11^2 + 2*|rho01|^2
    const rho00 = rho[0][0].r;
    const rho11 = rho[1][1].r;
    const rho01_mag2 = rho[0][1].r * rho[0][1].r + rho[0][1].i * rho[0][1].i;
    const purity = rho00 * rho00 + rho11 * rho11 + 2 * rho01_mag2;

    // Pauli expectations:
    // x = 2 * Re(rho01)
    const x = 2 * rho[0][1].r;
    // y = 2 * Im(rho10) = -2 * Im(rho01)
    const y = 2 * rho[1][0].i;
    // z = rho00 - rho11
    const z = rho00 - rho11;

    const radius = Math.sqrt(x * x + y * y + z * z);
    const isPure = purity >= 0.99 && radius >= 0.99;

    if (!isPure) {
      return {
        bloch: null,
        warning: `qubit ${qubit} is entangled with another qubit (purity=${purity.toFixed(3)}) — single-qubit pure Bloch vector is undefined`
      };
    }

    const normZ = Math.max(-1.0, Math.min(1.0, z / (radius > 1e-6 ? radius : 1.0)));
    const theta = Math.acos(normZ);
    let phi = Math.atan2(y, x);
    if (phi < 0) phi += 2 * Math.PI;

    return {
      bloch: {
        qubit,
        x: Number(x.toFixed(4)),
        y: Number(y.toFixed(4)),
        z: Number(z.toFixed(4)),
        theta: Number(theta.toFixed(4)),
        phi: Number(phi.toFixed(4)),
        purity: Number(purity.toFixed(4)),
        is_pure: true
      }
    };
  }

  getProbabilities(): Record<string, number> {
    const probs: Record<string, number> = {};
    for (let i = 0; i < this.dim; i++) {
      const amp = this.amplitudes[i];
      const p = amp.r * amp.r + amp.i * amp.i;
      // Convert to binary string with numQubits width
      const bitstr = i.toString(2).padStart(this.numQubits, '0');
      probs[bitstr] = Number(p.toFixed(6));
    }
    return probs;
  }

  getFormattedAmplitudes(): ComplexAmplitude[] {
    return this.amplitudes.map(a => ({
      re: Number(a.r.toFixed(4)),
      im: Number(a.i.toFixed(4)),
      magnitude: Number(cMag(a).toFixed(4)),
      phase: Number(cPhase(a).toFixed(4))
    }));
  }

  sampleMeasurements(shots: number = 1024): Record<string, number> {
    const probs = this.getProbabilities();
    const counts: Record<string, number> = {};
    const keys = Object.keys(probs);
    keys.forEach(k => (counts[k] = 0));

    for (let s = 0; s < shots; s++) {
      const rand = Math.random();
      let cumulative = 0;
      for (const k of keys) {
        cumulative += probs[k];
        if (rand <= cumulative) {
          counts[k] = (counts[k] || 0) + 1;
          break;
        }
      }
    }
    return counts;
  }
}

export function simulateLocalCircuit(
  numQubits: number,
  gates: PlacedGate[],
  shots: number = 1024
): SimulationResult {
  const startTime = performance.now();
  const state = new QuantumState(numQubits);
  const snapshots: StepSnapshot[] = [];

  // Snapshot 0
  const initBloch = Array.from({ length: numQubits }, (_, q) => state.getBlochVector(q).bloch);
  snapshots.push({
    step: 0,
    label: 'Initial State: All qubits in |0⟩',
    description_simple: 'All qubits start initialized to |0⟩.',
    description_technical: 'Initial state |0...0> in 2^n Hilbert space.',
    gate_applied: 'INIT',
    qubits_affected: Array.from({ length: numQubits }, (_, i) => i),
    statevector: state.getFormattedAmplitudes(),
    probabilities: state.getProbabilities(),
    bloch_vectors: initBloch
  });

  // Sort gates by step
  const sorted = [...gates].sort((a, b) => a.step - b.step);

  sorted.forEach((gate, idx) => {
    const type = gate.type.toLowerCase();
    if (GATES_1Q[type]) {
      state.apply1Q(gate.qubits[0], GATES_1Q[type]);
    } else if (type === 'cx') {
      state.applyCX(gate.qubits[0], gate.qubits[1]);
    } else if (type === 'cz') {
      state.applyCZ(gate.qubits[0], gate.qubits[1]);
    } else if (type === 'swap') {
      state.applySWAP(gate.qubits[0], gate.qubits[1]);
    }

    const stepBlochs: (BlochVector | null)[] = [];
    for (let q = 0; q < numQubits; q++) {
      stepBlochs.push(state.getBlochVector(q).bloch);
    }

    snapshots.push({
      step: idx + 1,
      label: `Step ${idx + 1}: ${gate.type.toUpperCase()} on Q${gate.qubits.join(', Q')}`,
      gate_applied: gate.type.toUpperCase(),
      qubits_affected: gate.qubits,
      statevector: state.getFormattedAmplitudes(),
      probabilities: state.getProbabilities(),
      bloch_vectors: stepBlochs
    });
  });

  const finalBloch: (BlochVector | null)[] = [];
  const warnings: string[] = [];

  for (let q = 0; q < numQubits; q++) {
    const { bloch, warning } = state.getBlochVector(q);
    finalBloch.push(bloch);
    if (warning) warnings.push(warning);
  }

  const elapsed = performance.now() - startTime;

  return {
    num_qubits: numQubits,
    statevector: state.getFormattedAmplitudes(),
    probabilities: state.getProbabilities(),
    measurement_counts: state.sampleMeasurements(shots),
    bloch_vectors: finalBloch,
    circuit_diagram_ascii: generateAsciiCircuit(numQubits, sorted),
    warnings,
    qasm: generateQasm(numQubits, sorted),
    step_by_step: snapshots,
    execution_time_ms: Number(elapsed.toFixed(2))
  };
}

function generateAsciiCircuit(numQubits: number, gates: PlacedGate[]): string {
  const lines = Array.from({ length: numQubits }, (_, i) => `q_${i}: ───`);
  const maxStep = Math.max(0, ...gates.map(g => g.step), 3);

  for (let s = 0; s <= maxStep; s++) {
    const stepGates = gates.filter(g => g.step === s);
    for (let q = 0; q < numQubits; q++) {
      const g = stepGates.find(gate => gate.qubits.includes(q));
      if (!g) {
        lines[q] += `──────`;
      } else if (g.type === 'cx') {
        if (g.qubits[0] === q) lines[q] += `──●───`;
        else lines[q] += `──⊕───`;
      } else if (g.type === 'cz') {
        lines[q] += `──●───`;
      } else if (g.type === 'swap') {
        lines[q] += `──✕───`;
      } else {
        lines[q] += `─[${g.type.toUpperCase()}]──`;
      }
    }
  }
  return lines.join('\n');
}

export function generateQasm(numQubits: number, gates: PlacedGate[]): string {
  const lines = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${numQubits}];`,
    `creg c[${numQubits}];`
  ];

  const sorted = [...gates].sort((a, b) => a.step - b.step);
  sorted.forEach(g => {
    const t = g.type.toLowerCase();
    if (t === 'h' || t === 'x' || t === 'y' || t === 'z' || t === 's' || t === 't') {
      lines.push(`${t} q[${g.qubits[0]}];`);
    } else if (t === 'cx') {
      lines.push(`cx q[${g.qubits[0]}], q[${g.qubits[1]}];`);
    } else if (t === 'cz') {
      lines.push(`cz q[${g.qubits[0]}], q[${g.qubits[1]}];`);
    } else if (t === 'swap') {
      lines.push(`swap q[${g.qubits[0]}], q[${g.qubits[1]}];`);
    } else if (t === 'measure') {
      lines.push(`measure q[${g.qubits[0]}] -> c[${g.qubits[0]}];`);
    }
  });

  return lines.join('\n');
}

/**
 * Calculates quantum statevector fidelity: |<target|actual>|^2
 * Invariant under global phase differences (0.0 to 1.0).
 */
export function calculateStatevectorFidelity(
  svA: { re: number; im: number }[],
  svB: { re: number; im: number }[]
): number {
  if (!svA || !svB || svA.length !== svB.length || svA.length === 0) return 0;

  let innerReal = 0;
  let innerImag = 0;

  for (let k = 0; k < svA.length; k++) {
    const a = svA[k];
    const b = svB[k];
    // a* * b = (a.re*b.re + a.im*b.im) + i*(a.re*b.im - a.im*b.re)
    innerReal += a.re * b.re + a.im * b.im;
    innerImag += a.re * b.im - a.im * b.re;
  }

  const fidelity = innerReal * innerReal + innerImag * innerImag;
  return Math.min(1.0, Math.max(0.0, fidelity));
}
