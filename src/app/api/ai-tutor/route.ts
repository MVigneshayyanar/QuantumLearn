import { NextRequest, NextResponse } from 'next/server';
import { generateSocraticResponse } from '@/lib/ai-engine';
import { GoogleGenerativeAI } from '@google/generative-ai';

import fs from 'fs';
import path from 'path';

function getGeminiApiKey(): string | null {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
      if (match && match[1]) return match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch {}
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { query, explanationMode, activeMisconception, language } = await req.json();
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Latest recommended Google Gemini model for interactive web applications
        const systemInstruction = `You are Schrödinger AI, a Socratic Quantum Computing AI Tutor on the QLearn platform.
Learner Mode: ${explanationMode === 'simple' ? 'Simple / School Student (intuitive analogies, clear metaphors)' : 'Technical / Researcher (Dirac notation, unitary matrices, state vectors)'}.
Language: ${language === 'hi' ? 'Hindi' : 'English'}.
Active Misconception Flag: ${activeMisconception || 'None'}.

QLearn Curriculum Context (RAG Knowledge Base):
- Deutsch-Jozsa Algorithm: Evaluates if an unknown oracle function f(x) is constant (same output for all inputs) or balanced (output is 0 for half and 1 for half) with just ONE query using quantum superposition and Hadamard interference, compared to 2^(n-1)+1 classical queries.
- Grover's Algorithm: Provides quadratic speedup O(sqrt(N)) for searching unstructured databases using repeated applications of the Oracle and Diffusion Operator (inversion about the average).
- Quantum Teleportation: Transmits an unknown qubit state |ψ⟩ from Alice to Bob without moving the physical particle, using a shared entangled Bell pair (|Φ+⟩ = (|00⟩+|11⟩)/√2) and two classical communication bits.
- Superdense Coding: Transmits two classical bits of information using only ONE transmitted qubit, enabled by pre-shared entanglement.
- Platform Tools:
  * Interactive Circuit Builder: Drag-and-drop workbench supporting 1-3 qubits, common single and 2-qubit gates (H, X, Y, Z, S, T, CX, CZ, SWAP), real statevector calculations, and measurement probability histograms.
  * 3D Bloch Sphere: Interactive Three.js visualization of qubit state pure vectors (x, y, z coordinates, θ and φ angles).

PEDAGOGICAL RULES:
1. Socratic method: Guide the learner by asking insightful questions rather than just dumping answers.
2. Adapt tone to Learner Mode (Simple: relatable real-world metaphors like coin flips and sound waves; Technical: Dirac bra-ket notation, unitary matrices, tensor products).
3. If an active misconception is tagged, address it gently and constructively.
4. Keep explanations engaging, concise, and physically accurate.`;

        // High-speed low-latency model for instant responses
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-3.1-flash-lite',
          systemInstruction,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
        });

        const result = await model.generateContent(query);
        const reply = result.response.text();
        if (reply) return NextResponse.json({ reply });
      } catch (e: any) {
        console.error("Gemini API Error:", e);
        const errMsg = e?.message || '';
        return NextResponse.json({
          reply: `⚠️ **Gemini Response Error**: ${errMsg || 'Unable to generate response from Gemini.'}`
        });
      }
    }

    // Fallback local engine if no API key is present
    const reply = generateSocraticResponse(query, {
      explanationMode: explanationMode || 'simple',
      activeMisconception
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Outer route error:", err);
    return NextResponse.json(
      { reply: `Route Error: ${err?.message || err}` },
      { status: 200 }
    );
  }
}
