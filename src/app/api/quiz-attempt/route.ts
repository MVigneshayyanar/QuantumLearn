/**
 * POST /api/quiz-attempt
 *
 * Log a single quiz question attempt.
 * Body: {
 *   userId: string,
 *   moduleSlug: string,
 *   questionId: string,
 *   selectedAnswer: string,
 *   isCorrect: boolean,
 *   timeTakenMs: number,
 *   difficulty: "beginner" | "intermediate" | "advanced",
 *   misconceptionTag?: string
 * }
 *
 * Each attempt is its own row — this is a log, not an upsert.
 * If misconceptionTag is present, also upserts a MisconceptionLog row.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFFICULTY_MAP: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  advanced: 'ADVANCED',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      moduleSlug,
      questionId,
      selectedAnswer,
      isCorrect,
      timeTakenMs,
      difficulty,
      misconceptionTag,
    } = body;

    // Validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }
    if (!moduleSlug || typeof moduleSlug !== 'string') {
      return NextResponse.json({ error: 'moduleSlug is required.' }, { status: 400 });
    }
    if (!questionId || typeof questionId !== 'string') {
      return NextResponse.json({ error: 'questionId is required.' }, { status: 400 });
    }
    if (!selectedAnswer || typeof selectedAnswer !== 'string') {
      return NextResponse.json({ error: 'selectedAnswer is required.' }, { status: 400 });
    }
    if (typeof isCorrect !== 'boolean') {
      return NextResponse.json({ error: 'isCorrect must be a boolean.' }, { status: 400 });
    }
    if (typeof timeTakenMs !== 'number' || timeTakenMs < 0) {
      return NextResponse.json({ error: 'timeTakenMs must be a non-negative number.' }, { status: 400 });
    }
    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json(
        { error: `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}` },
        { status: 400 }
      );
    }

    // Create quiz attempt row (log — never upsert)
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        moduleSlug,
        questionId,
        selectedAnswer,
        isCorrect,
        timeTakenMs: Math.round(timeTakenMs),
        difficulty: DIFFICULTY_MAP[difficulty],
        misconceptionTag: misconceptionTag || null,
      },
    });

    // If misconception was flagged, upsert the MisconceptionLog
    if (misconceptionTag && typeof misconceptionTag === 'string' && !isCorrect) {
      await prisma.misconceptionLog.upsert({
        where: {
          userId_misconceptionTag: { userId, misconceptionTag },
        },
        update: {
          occurrenceCount: { increment: 1 },
          isResolved: false,
          lastFlaggedAt: new Date(),
        },
        create: {
          userId,
          misconceptionTag,
          occurrenceCount: 1,
          isResolved: false,
        },
      });
    }

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/quiz-attempt] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
