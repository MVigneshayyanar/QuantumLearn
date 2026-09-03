import { GateType, PlacedGate } from './types';

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  success: boolean;
  numQubits: number;
  gates: PlacedGate[];
  errors: ParseError[];
  warnings?: string[];
}

export type SupportedSyntaxDialect = 'qiskit' | 'cirq' | 'pennylane';

/**
 * Intelligent qubit step scheduler:
 * Places gates in the earliest available time step where all target qubits are free.
 */
function scheduleGates(
  rawGates: { type: GateType; qubits: number[]; rawLine: number }[],
  numQubits: number,
  maxSteps: number = 8
): { gates: PlacedGate[]; errors: ParseError[] } {
  // qubitLastBusyStep[q] tracks the highest step used by qubit q
  const qubitNextFreeStep: number[] = new Array(numQubits).fill(0);
  const gates: PlacedGate[] = [];
  const errors: ParseError[] = [];

  for (let i = 0; i < rawGates.length; i++) {
    const g = rawGates[i];
    
    // Check qubit boundaries
    const invalidQubit = g.qubits.find(q => q < 0 || q >= numQubits);
    if (invalidQubit !== undefined) {
      errors.push({
        line: g.rawLine,
        message: `Qubit index ${invalidQubit} is out of range for ${numQubits}-qubit circuit (valid: 0 to ${numQubits - 1}).`
      });
      continue;
    }

    // Earliest step where all involved qubits are free
    const earliestStep = Math.max(...g.qubits.map(q => qubitNextFreeStep[q]));

    if (earliestStep >= maxSteps) {
      errors.push({
        line: g.rawLine,
        message: `Circuit exceeds maximum depth of ${maxSteps} time steps. Please shorten the circuit.`
      });
      continue;
    }

    // Place gate
    gates.push({
      id: `gate-code-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      type: g.type,
      qubits: g.qubits,
      step: earliestStep
    });

    // Mark all involved qubits as occupied through this step
    for (const q of g.qubits) {
      qubitNextFreeStep[q] = earliestStep + 1;
    }
  }

  return { gates, errors };
}

/**
 * Parses Qiskit-style Python syntax:
 * Example:
 *   qc = QuantumCircuit(2)
 *   qc.h(0)
 *   qc.cx(0, 1)
 *   qc.measure_all()
 */
export function parseQiskitCode(code: string, defaultNumQubits: number = 2): ParseResult {
  const lines = code.split('\n');
  const errors: ParseError[] = [];
  let numQubits = defaultNumQubits;
  let hasFoundCircuitDeclaration = false;

  const rawGates: { type: GateType; qubits: number[]; rawLine: number }[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const lineNum = lineIdx + 1;
    const trimmed = rawLine.trim();

    // Ignore empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Ignore imports and boilerplate print statements
    if (
      trimmed.startsWith('import ') ||
      trimmed.startsWith('from ') ||
      trimmed.startsWith('print(') ||
      trimmed.startsWith('sv =') ||
      trimmed.startsWith('backend =') ||
      trimmed.startsWith('job =') ||
      trimmed.startsWith('result =')
    ) {
      continue;
    }

    // Detect QuantumCircuit declaration: e.g. QuantumCircuit(2) or qc = QuantumCircuit(3, 3)
    const qcDeclMatch = trimmed.match(/(?:(?:[a-zA-Z0-9_]+)\s*=\s*)?QuantumCircuit\s*\(\s*(\d+)/i);
    if (qcDeclMatch) {
      const parsedQubits = parseInt(qcDeclMatch[1], 10);
      if (parsedQubits < 1 || parsedQubits > 3) {
        errors.push({
          line: lineNum,
          message: `Supported simulator circuit size is 1 to 3 qubits (received ${parsedQubits}).`
        });
      } else {
        numQubits = parsedQubits;
        hasFoundCircuitDeclaration = true;
      }
      continue;
    }

    // Match single qubit gates: qc.h(0), qc.x(1), qc.y(0), qc.z(0), qc.s(1), qc.t(0)
    const singleGateMatch = trimmed.match(/^[a-zA-Z0-9_]+\.(h|x|y|z|s|t)\s*\(\s*(\d+)\s*\)/i);
    if (singleGateMatch) {
      const gateType = singleGateMatch[1].toLowerCase() as GateType;
      const qubit = parseInt(singleGateMatch[2], 10);
      rawGates.push({ type: gateType, qubits: [qubit], rawLine: lineNum });
      continue;
    }

    // Match 2-qubit CNOT / CX: qc.cx(0, 1) or qc.cnot(0, 1)
    const cxMatch = trimmed.match(/^[a-zA-Z0-9_]+\.(?:cx|cnot)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (cxMatch) {
      const ctrl = parseInt(cxMatch[1], 10);
      const tgt = parseInt(cxMatch[2], 10);
      if (ctrl === tgt) {
        errors.push({
          line: lineNum,
          message: `CNOT control and target qubits cannot be the same qubit (Q${ctrl}).`
        });
      } else {
        rawGates.push({ type: 'cx', qubits: [ctrl, tgt], rawLine: lineNum });
      }
      continue;
    }

    // Match CZ: qc.cz(0, 1)
    const czMatch = trimmed.match(/^[a-zA-Z0-9_]+\.cz\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (czMatch) {
      const q0 = parseInt(czMatch[1], 10);
      const q1 = parseInt(czMatch[2], 10);
      if (q0 === q1) {
        errors.push({
          line: lineNum,
          message: `CZ qubits cannot be identical (Q${q0}).`
        });
      } else {
        rawGates.push({ type: 'cz', qubits: [q0, q1], rawLine: lineNum });
      }
      continue;
    }

    // Match SWAP: qc.swap(0, 1)
    const swapMatch = trimmed.match(/^[a-zA-Z0-9_]+\.swap\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (swapMatch) {
      const q0 = parseInt(swapMatch[1], 10);
      const q1 = parseInt(swapMatch[2], 10);
      if (q0 === q1) {
        errors.push({
          line: lineNum,
          message: `SWAP qubits cannot be identical (Q${q0}).`
        });
      } else {
        rawGates.push({ type: 'swap', qubits: [q0, q1], rawLine: lineNum });
      }
      continue;
    }

    // Match measure_all() or measure(0, 0)
    const measureAllMatch = trimmed.match(/^[a-zA-Z0-9_]+\.measure_all\s*\(\s*\)/i);
    if (measureAllMatch) {
      for (let q = 0; q < numQubits; q++) {
        rawGates.push({ type: 'measure', qubits: [q], rawLine: lineNum });
      }
      continue;
    }

    const measureSingleMatch = trimmed.match(/^[a-zA-Z0-9_]+\.measure\s*\(\s*(\d+)/i);
    if (measureSingleMatch) {
      const q = parseInt(measureSingleMatch[1], 10);
      rawGates.push({ type: 'measure', qubits: [q], rawLine: lineNum });
      continue;
    }

    // If it starts with qc. something that we don't recognize
    if (trimmed.startsWith('qc.') || trimmed.includes('.append(')) {
      errors.push({
        line: lineNum,
        message: `Unsupported or unrecognized quantum operation: "${trimmed}". Supported gates: H, X, Y, Z, S, T, CX, CZ, SWAP, measure_all.`
      });
      continue;
    }

    // Any other statement we couldn't parse
    errors.push({
      line: lineNum,
      message: `Syntax error: unexpected Python statement "${trimmed}".`
    });
  }

  // Schedule gates to time steps
  const { gates, errors: scheduleErrors } = scheduleGates(rawGates, numQubits);
  errors.push(...scheduleErrors);

  return {
    success: errors.length === 0,
    numQubits,
    gates,
    errors
  };
}

/**
 * Generate Qiskit Python Code
 */
export function generateQiskitCode(numQubits: number, gates: PlacedGate[]): string {
  const lines: string[] = [
    'import qiskit',
    'from qiskit import QuantumCircuit',
    'from qiskit.quantum_info import Statevector',
    '',
    `# Initialize ${numQubits}-qubit Quantum Circuit`,
    `qc = QuantumCircuit(${numQubits})`,
    ''
  ];

  const sortedGates = [...gates].sort((a, b) => a.step - b.step || a.qubits[0] - b.qubits[0]);

  if (sortedGates.length === 0) {
    lines.push('# Add gates, e.g. qc.h(0)');
  } else {
    for (const g of sortedGates) {
      switch (g.type) {
        case 'h':
          lines.push(`qc.h(${g.qubits[0]})`);
          break;
        case 'x':
          lines.push(`qc.x(${g.qubits[0]})`);
          break;
        case 'y':
          lines.push(`qc.y(${g.qubits[0]})`);
          break;
        case 'z':
          lines.push(`qc.z(${g.qubits[0]})`);
          break;
        case 's':
          lines.push(`qc.s(${g.qubits[0]})`);
          break;
        case 't':
          lines.push(`qc.t(${g.qubits[0]})`);
          break;
        case 'cx':
          lines.push(`qc.cx(${g.qubits[0]}, ${g.qubits[1]})`);
          break;
        case 'cz':
          lines.push(`qc.cz(${g.qubits[0]}, ${g.qubits[1]})`);
          break;
        case 'swap':
          lines.push(`qc.swap(${g.qubits[0]}, ${g.qubits[1]})`);
          break;
        case 'measure':
          lines.push(`qc.measure_all()`);
          break;
      }
    }
  }

  lines.push('');
  lines.push('# Simulate on Qiskit Aer Statevector Backend');
  lines.push('sv = Statevector.from_instruction(qc)');
  lines.push('print("Final Statevector:", sv.data)');
  lines.push('print("Probabilities:", sv.probabilities_dict())');

  return lines.join('\n');
}

/**
 * Generate Cirq Python Code
 */
export function generateCirqCode(numQubits: number, gates: PlacedGate[]): string {
  const lines: string[] = [
    'import cirq',
    '',
    `# Create qubits and circuit`,
    `qubits = [cirq.LineQubit(i) for i in range(${numQubits})]`,
    `circuit = cirq.Circuit()`,
    ''
  ];

  const sortedGates = [...gates].sort((a, b) => a.step - b.step || a.qubits[0] - b.qubits[0]);

  for (const g of sortedGates) {
    const q0 = `qubits[${g.qubits[0]}]`;
    const q1 = g.qubits[1] !== undefined ? `qubits[${g.qubits[1]}]` : '';

    switch (g.type) {
      case 'h':
        lines.push(`circuit.append(cirq.H(${q0}))`);
        break;
      case 'x':
        lines.push(`circuit.append(cirq.X(${q0}))`);
        break;
      case 'y':
        lines.push(`circuit.append(cirq.Y(${q0}))`);
        break;
      case 'z':
        lines.push(`circuit.append(cirq.Z(${q0}))`);
        break;
      case 's':
        lines.push(`circuit.append(cirq.S(${q0}))`);
        break;
      case 't':
        lines.push(`circuit.append(cirq.T(${q0}))`);
        break;
      case 'cx':
        lines.push(`circuit.append(cirq.CNOT(${q0}, ${q1}))`);
        break;
      case 'cz':
        lines.push(`circuit.append(cirq.CZ(${q0}, ${q1}))`);
        break;
      case 'swap':
        lines.push(`circuit.append(cirq.SWAP(${q0}, ${q1}))`);
        break;
      case 'measure':
        lines.push(`circuit.append(cirq.measure(*qubits, key="result"))`);
        break;
    }
  }

  lines.push('');
  lines.push('simulator = cirq.Simulator()');
  lines.push('result = simulator.simulate(circuit)');
  lines.push('print("Statevector:", result.final_state_vector)');

  return lines.join('\n');
}

/**
 * Generate PennyLane Code
 */
export function generatePennyLaneCode(numQubits: number, gates: PlacedGate[]): string {
  const lines: string[] = [
    'import pennylane as qml',
    '',
    `dev = qml.device("default.qubit", wires=${numQubits})`,
    '',
    '@qml.qnode(dev)',
    'def circuit():',
  ];

  const sortedGates = [...gates].sort((a, b) => a.step - b.step || a.qubits[0] - b.qubits[0]);

  if (sortedGates.length === 0) {
    lines.push('    # Identity/No-op');
    lines.push('    return qml.state()');
  } else {
    for (const g of sortedGates) {
      switch (g.type) {
        case 'h':
          lines.push(`    qml.Hadamard(wires=${g.qubits[0]})`);
          break;
        case 'x':
          lines.push(`    qml.PauliX(wires=${g.qubits[0]})`);
          break;
        case 'y':
          lines.push(`    qml.PauliY(wires=${g.qubits[0]})`);
          break;
        case 'z':
          lines.push(`    qml.PauliZ(wires=${g.qubits[0]})`);
          break;
        case 's':
          lines.push(`    qml.S(wires=${g.qubits[0]})`);
          break;
        case 't':
          lines.push(`    qml.T(wires=${g.qubits[0]})`);
          break;
        case 'cx':
          lines.push(`    qml.CNOT(wires=[${g.qubits[0]}, ${g.qubits[1]}])`);
          break;
        case 'cz':
          lines.push(`    qml.CZ(wires=[${g.qubits[0]}, ${g.qubits[1]}])`);
          break;
        case 'swap':
          lines.push(`    qml.SWAP(wires=[${g.qubits[0]}, ${g.qubits[1]}])`);
          break;
      }
    }
    lines.push('    return qml.state()');
  }

  lines.push('');
  lines.push('print("Output State:", circuit())');

  return lines.join('\n');
}
