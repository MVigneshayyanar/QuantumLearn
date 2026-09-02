import { NextRequest, NextResponse } from 'next/server';
import { simulateLocalCircuit } from '@/lib/quantum-simulator-core';

const PYTHON_SIM_URL = process.env.PYTHON_SIM_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Try forwarding to Python FastAPI + Qiskit microservice
    try {
      const response = await fetch(`${PYTHON_SIM_URL}/simulate/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000) // 3s timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      // Python microservice unreachable or starting up -> gracefully fall back
    }

    // 2. Fall back to internal high-precision simulator
    const numQubits = body.num_qubits || 2;
    const gates = body.gates || [];
    const shots = body.shots || 1024;

    const formattedGates = gates.map((g: any, i: number) => ({
      id: `g-${i}`,
      type: g.type,
      qubits: g.qubits,
      step: g.step ?? i
    }));

    const localResult = simulateLocalCircuit(numQubits, formattedGates, shots);
    return NextResponse.json(localResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Simulation failed' }, { status: 500 });
  }
}
