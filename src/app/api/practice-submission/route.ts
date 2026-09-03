/**
 * POST /api/practice-submission
 *
 * STUB ROUTE — Practice/Judge feature does not exist in the frontend yet.
 * This route is created ahead of time so the API surface is ready when
 * the practice submission UI is built.
 *
 * Expected body (for future use):
 * {
 *   userId: string,
 *   moduleSlug: string,
 *   problemId: string,
 *   result: "accepted" | "wrong_answer" | "invalid_circuit",
 *   code?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, moduleSlug, problemId, result, code } = body;

    // Validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }
    if (!moduleSlug || typeof moduleSlug !== 'string') {
      return NextResponse.json({ error: 'moduleSlug is required.' }, { status: 400 });
    }
    if (!problemId || typeof problemId !== 'string') {
      return NextResponse.json({ error: 'problemId is required.' }, { status: 400 });
    }
    const validResults = ['accepted', 'wrong_answer', 'invalid_circuit'];
    if (!result || !validResults.includes(result)) {
      return NextResponse.json(
        { error: `result must be one of: ${validResults.join(', ')}` },
        { status: 400 }
      );
    }

    const submission = await prisma.practiceSubmission.create({
      data: {
        userId,
        moduleSlug,
        problemId,
        result,
        code: code || null,
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/practice-submission] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
