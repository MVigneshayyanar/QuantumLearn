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
    const body = await req.json();
    const { action, prompt, code, errors, query, explanationMode, activeMisconception, language } = body;
    const apiKey = getGeminiApiKey();

    // 1. AI Circuit Code Generation
    if (action === 'generate_circuit') {
      const userPrompt = prompt || query || 'Create a Bell state';
      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: `You are an expert quantum compiler on QLearn.
Convert the user's natural language request into a valid, minimal Qiskit circuit using ONLY the following constrained Python syntax:
- qc = QuantumCircuit(num_qubits) where num_qubits is 1, 2, or 3.
- qc.h(q)
- qc.x(q)
- qc.y(q)
- qc.z(q)
- qc.s(q)
- qc.t(q)
- qc.cx(control, target)
- qc.cz(control, target)
- qc.swap(q0, q1)
- qc.measure_all()

STRICT RULES:
- Maximum 3 qubits (0, 1, 2).
- Return ONLY valid Python code with brief comments.
- Do NOT use markdown code blocks (\`\`\`python). Output pure executable code.
- Always include qc.measure_all() at the end.`,
            generationConfig: { maxOutputTokens: 250, temperature: 0.2 }
          });
          const res = await model.generateContent(`Generate circuit for: "${userPrompt}"`);
          let genCode = res.response.text().trim();
          // Strip any markdown backticks if model included them
          genCode = genCode.replace(/^```(?:python)?\s*/i, '').replace(/```\s*$/i, '').trim();
          if (genCode.includes('QuantumCircuit')) {
            return NextResponse.json({
              code: genCode,
              explanation: `Generated quantum circuit for: "${userPrompt}"`
            });
          }
        } catch (err) {
          console.error("Gemini circuit generation error:", err);
        }
      }

      // Offline / Fallback Generator
      const fallback = fallbackGenerateCircuit(userPrompt);
      return NextResponse.json(fallback);
    }

    // 2. AI Circuit Debugging
    if (action === 'debug_circuit') {
      const circuitCode = code || '';
      const errorList = errors ? JSON.stringify(errors) : 'Syntax or semantic issue';
      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: `You are Schrödinger AI, debugging a quantum circuit on QLearn.
Analyze the user's code and errors. Explain what went wrong in 2-3 concise sentences.
Then provide the corrected circuit code using only the supported gates (H, X, Y, Z, S, T, CX, CZ, SWAP, measure_all) and max 3 qubits.
Format your output as:
DIAGNOSIS: <brief explanation>
FIXED_CODE:
<the corrected python code without markdown formatting>`,
            generationConfig: { maxOutputTokens: 300, temperature: 0.3 }
          });
          const res = await model.generateContent(`Code to debug:\n${circuitCode}\n\nErrors encountered:\n${errorList}`);
          const text = res.response.text().trim();
          const diagnosisMatch = text.match(/DIAGNOSIS:\s*([\s\S]*?)(?=FIXED_CODE:|$)/i);
          const fixedCodeMatch = text.match(/FIXED_CODE:\s*([\s\S]*)/i);

          const explanation = diagnosisMatch ? diagnosisMatch[1].trim() : text;
          let fixedCode = fixedCodeMatch ? fixedCodeMatch[1].trim() : circuitCode;
          fixedCode = fixedCode.replace(/^```(?:python)?\s*/i, '').replace(/```\s*$/i, '').trim();

          return NextResponse.json({
            explanation,
            fixedCode
          });
        } catch (err) {
          console.error("Gemini debugging error:", err);
        }
      }

      // Fallback debugger
      return NextResponse.json({
        explanation: "Check that your circuit has between 1 and 3 qubits (`qc = QuantumCircuit(2)`), and all qubit indices are within [0, num_qubits - 1]. Ensure control and target qubits for CNOT are distinct.",
        fixedCode: `qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`
      });
    }

    // 3. Normal Socratic Tutor Chat
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const langMap: Record<string, string> = {
          en: 'English',
          hi: 'Hindi (हिन्दी)',
          es: 'Spanish (Español)',
          fr: 'French (Français)',
          de: 'German (Deutsch)',
          ta: 'Tamil (தமிழ்)',
          te: 'Telugu (తెలుగు)',
          ja: 'Japanese (日本語)',
          'zh-CN': 'Simplified Chinese (简体中文)'
        };
        const activeLangName = langMap[language] || 'English';

        const systemInstruction = `You are Schrödinger AI, an expert Quantum Computing AI Tutor on the QLearn platform.
Learner Mode: ${explanationMode === 'simple' ? 'Simple / School Student (intuitive analogies, clear metaphors)' : 'Technical / Researcher (Dirac notation, unitary matrices, state vectors)'}.
Active Misconception Flag: ${activeMisconception || 'None'}.

MULTILINGUAL REQUIREMENT:
- The user's active platform language is: ${activeLangName}.
- You MUST respond fully and fluently in ${activeLangName}.
- Keep all Dirac notations ($|0\\rangle$, $|1\\rangle$), gates (H, X, CNOT), and formulas intact.

QLEARN PLATFORM CAPABILITIES:
- Drag-and-drop & code-based circuit builder (Qiskit, Cirq, PennyLane).
- Multi-backend simulation (Qiskit Aer, PennyLane default.qubit, Cirq, qBraid cloud).
- Socratic guided teaching.`;

        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          systemInstruction,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        });

        const result = await model.generateContent(query);
        const reply = result.response.text();
        if (reply) return NextResponse.json({ reply });
      } catch (e: any) {
        console.error("Gemini API Error:", e);
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

function fallbackGenerateCircuit(prompt: string): { code: string; explanation: string } {
  const p = prompt.toLowerCase();
  if (p.includes('bell') || p.includes('entangle')) {
    return {
      code: `qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`,
      explanation: "Created Bell state (|00> + |11>)/√2 using Hadamard on Q0 followed by CNOT from Q0 to Q1."
    };
  }
  if (p.includes('ghz') || (p.includes('3') && p.includes('qubit'))) {
    return {
      code: `qc = QuantumCircuit(3)\nqc.h(0)\nqc.cx(0, 1)\nqc.cx(1, 2)\nqc.measure_all()`,
      explanation: "Created 3-qubit GHZ state (|000> + |111>)/√2 using Hadamard on Q0 followed by cascading CNOTs."
    };
  }
  if (p.includes('grover') || p.includes('search')) {
    return {
      code: `qc = QuantumCircuit(2)\nqc.h(0)\nqc.h(1)\nqc.cz(0, 1)\nqc.h(0)\nqc.h(1)\nqc.z(0)\nqc.z(1)\nqc.cz(0, 1)\nqc.h(0)\nqc.h(1)\nqc.measure_all()`,
      explanation: "Created Grover's algorithm for 2 qubits with |11> marked state and diffusion operator."
    };
  }
  if (p.includes('teleport')) {
    return {
      code: `qc = QuantumCircuit(3)\nqc.h(1)\nqc.cx(1, 2)\nqc.cx(0, 1)\nqc.h(0)\nqc.measure_all()`,
      explanation: "Created Quantum Teleportation protocol circuit with shared Bell pair on Q1-Q2 and Bell measurement on Q0-Q1."
    };
  }
  if (p.includes('superdense')) {
    return {
      code: `qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.z(0)\nqc.x(0)\nqc.cx(0, 1)\nqc.h(0)\nqc.measure_all()`,
      explanation: "Created Superdense Coding circuit: entanglement prep, Alice's 2-bit encoding (ZX), and Bob's Bell measurement."
    };
  }
  if (p.includes('deutsch')) {
    return {
      code: `qc = QuantumCircuit(2)\nqc.x(1)\nqc.h(0)\nqc.h(1)\nqc.cx(0, 1)\nqc.h(0)\nqc.measure_all()`,
      explanation: "Created Deutsch-Jozsa algorithm with ancilla in |-> and balanced oracle (CNOT)."
    };
  }
  if (p.includes('swap')) {
    return {
      code: `qc = QuantumCircuit(2)\nqc.x(0)\nqc.swap(0, 1)\nqc.measure_all()`,
      explanation: "Prepares |10> and swaps Q0 and Q1 to yield |01>."
    };
  }
  return {
    code: `qc = QuantumCircuit(2)\nqc.h(0)\nqc.h(1)\nqc.measure_all()`,
    explanation: "Created a 2-qubit uniform superposition circuit using parallel Hadamard gates."
  };
}
