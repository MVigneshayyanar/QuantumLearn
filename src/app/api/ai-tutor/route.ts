import { NextRequest, NextResponse } from 'next/server';
import { generateSocraticResponse } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const { query, explanationMode, activeMisconception, language } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

    // If an external LLM key is configured in env, make a request with Socratic system prompt
    if (process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a Socratic Quantum Computing AI Tutor on the QuantumLearn platform.
Learner Mode: ${explanationMode === 'simple' ? 'Simple / School Student (intuitive analogies, clear metaphors)' : 'Technical / Researcher (Dirac notation, unitary matrices, state vectors)'}.
Language: ${language === 'hi' ? 'Hindi' : 'English'}.
Active Misconception Flag: ${activeMisconception || 'None'}.

STRICT INSTRUCTIONS:
1. NEVER dump full direct solutions immediately.
2. Ask targeted, guiding questions to lead the student to discover the physics insight themselves.
3. If a misconception is flagged, explain WHY that mental model is flawed without being condescending.
4. Keep explanations concise, inspiring, and physically accurate.`
              },
              { role: 'user', content: query }
            ],
            max_tokens: 450
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch {
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
