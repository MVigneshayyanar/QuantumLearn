import { NextRequest, NextResponse } from 'next/server';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';

const PYTHON_SIM_URL = process.env.PYTHON_SIM_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Try forwarding to Python FastAPI + Qiskit microservice
    try {
      const response = await fetch(`${PYTHON_SIM_URL}/simulate/algorithm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fall back if microservice is offline
    }

    // High-fidelity fallback for 4 algorithms
    const algo = (body.algorithm || 'deutsch_jozsa').toLowerCase();
    let numQubits = 2;
    let gates: any[] = [];

    if (algo === 'deutsch_jozsa') {
      numQubits = 2;
      gates = [
        { id: 'dj1', type: 'x', qubits: [1], step: 0 },
        { id: 'dj2', type: 'h', qubits: [0], step: 1 },
        { id: 'dj3', type: 'h', qubits: [1], step: 1 },
        { id: 'dj4', type: 'cx', qubits: [0, 1], step: 2 },
        { id: 'dj5', type: 'h', qubits: [0], step: 3 }
      ];
    } else if (algo === 'grover') {
      numQubits = body.params?.num_qubits || 2;
      gates = [
        { id: 'gr1', type: 'h', qubits: [0], step: 0 },
        { id: 'gr2', type: 'h', qubits: [1], step: 0 },
        { id: 'gr3', type: 'cz', qubits: [0, 1], step: 1 },
        { id: 'gr4', type: 'h', qubits: [0], step: 2 },
        { id: 'gr5', type: 'h', qubits: [1], step: 2 },
        { id: 'gr6', type: 'x', qubits: [0], step: 3 },
        { id: 'gr7', type: 'x', qubits: [1], step: 3 },
        { id: 'gr8', type: 'cz', qubits: [0, 1], step: 4 },
        { id: 'gr9', type: 'x', qubits: [0], step: 5 },
        { id: 'gr10', type: 'x', qubits: [1], step: 5 },
        { id: 'gr11', type: 'h', qubits: [0], step: 6 },
        { id: 'gr12', type: 'h', qubits: [1], step: 6 }
      ];
    } else if (algo === 'teleportation') {
      numQubits = 3;
      gates = [
        { id: 'tp1', type: 'h', qubits: [0], step: 0 },
        { id: 'tp2', type: 'h', qubits: [1], step: 1 },
        { id: 'tp3', type: 'cx', qubits: [1, 2], step: 2 },
        { id: 'tp4', type: 'cx', qubits: [0, 1], step: 3 },
        { id: 'tp5', type: 'h', qubits: [0], step: 4 },
        { id: 'tp6', type: 'cx', qubits: [1, 2], step: 5 },
        { id: 'tp7', type: 'cz', qubits: [0, 2], step: 6 }
      ];
    } else if (algo === 'superdense_coding') {
      numQubits = 2;
      gates = [
        { id: 'sd1', type: 'h', qubits: [0], step: 0 },
        { id: 'sd2', type: 'cx', qubits: [0, 1], step: 1 },
        { id: 'sd3', type: 'z', qubits: [0], step: 2 },
        { id: 'sd4', type: 'cx', qubits: [0, 1], step: 3 },
        { id: 'sd5', type: 'h', qubits: [0], step: 4 }
      ];
    }

    const localResult = simulateLocalCircuit(numQubits, gates, body.shots || 1024);
    return NextResponse.json({ ...localResult, gates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
