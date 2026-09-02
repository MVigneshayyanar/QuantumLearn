import { NextRequest, NextResponse } from 'next/server';
import { generateSocraticResponse } from '@/lib/ai-engine';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { query, explanationMode, activeMisconception, language } = await req.json();

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-1.5-flash for fast chat responses
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // RAG Context about QLearn
        const ragContext = `
QLearn Curriculum Context:
- Deutsch-Jozsa: Determines if a function is constant or balanced in one query. Uses H gates and interference.
- Grover's Algorithm: Unstructured search with O(sqrt(N)) speedup. Uses Oracle and Diffusion operator (amplitude amplification).
- Quantum Teleportation: Transmits a qubit state using entanglement (Bell state) and 2 classical bits.
- Superdense Coding: Transmits two classical bits using one entangled qubit.

Platform features:
- Circuit Builder: A drag-and-drop quantum simulator supporting 1-3 qubits.
- Bloch Sphere 3D: Real-time 3D visualization of single qubit states.

You are Schrödinger, a Socratic Quantum Computing AI Tutor on the QLearn platform.
Learner Mode: ${explanationMode === 'simple' ? 'Simple / School Student (intuitive analogies, clear metaphors)' : 'Technical / Researcher (Dirac notation, unitary matrices, state vectors)'}.
Language: ${language === 'hi' ? 'Hindi' : 'English'}.
Active Misconception Flag: ${activeMisconception || 'None'}.

STRICT INSTRUCTIONS:
1. NEVER dump full direct solutions immediately.
2. Ask targeted, guiding questions to lead the student to discover the physics insight themselves.
3. If a misconception is flagged, explain WHY that mental model is flawed without being condescending.
4. Keep explanations concise, inspiring, and physically accurate.
5. Use the QLearn Curriculum Context when relevant to ground your answers in the platform's features.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: query }] }],
          systemInstruction: { role: 'system', parts: [{ text: ragContext }] }
        });

        const reply = result.response.text();
        if (reply) return NextResponse.json({ reply });
      } catch (e) {
        console.error("Gemini API Error:", e);
        // Fall back to local Socratic engine
      }
    }

    // High-precision local Socratic engine
    const reply = generateSocraticResponse(query, {
      explanationMode: explanationMode || 'simple',
      activeMisconception
    });

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { reply: "Let's explore how this quantum operator transforms the state amplitudes!" },
      { status: 200 }
    );
  }
}
