/**
 * POST /api/progress
 *
 * Upsert module progress for a student.
 * Body: { userId: string, moduleSlug: string, status: "in_progress" | "completed", score?: number }
 *
 * Upserts on (userId, moduleSlug) — no duplicate rows for the same student/module.
 * - status: "in_progress" → updates stageReached, lastVisitedAt
 * - status: "completed"   → sets isCompleted=true, masteryScore, lastVisitedAt
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VALID_SLUGS = ['deutsch-jozsa', 'grover', 'teleportation', 'superdense-coding'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, moduleSlug, status, score, stageReached } = body;

    // Validation
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }
    if (!moduleSlug || !VALID_SLUGS.includes(moduleSlug)) {
      return NextResponse.json(
        { error: `moduleSlug must be one of: ${VALID_SLUGS.join(', ')}` },
        { status: 400 }
      );
    }
    if (!status || !['in_progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be "in_progress" or "completed".' },
        { status: 400 }
      );
    }

    const now = new Date();

    if (status === 'completed') {
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_moduleSlug: { userId, moduleSlug },
        },
        update: {
          isCompleted: true,
          masteryScore: typeof score === 'number' ? Math.max(0, Math.min(100, score)) : undefined,
          lastVisitedAt: now,
        },
        create: {
          userId,
          moduleSlug,
          isCompleted: true,
          masteryScore: typeof score === 'number' ? score : 0,
          stageReached: 4, // quiz stage = final
          lastVisitedAt: now,
        },
      });
      return NextResponse.json({ progress }, { status: 200 });
    }

    // status === 'in_progress'
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_moduleSlug: { userId, moduleSlug },
      },
      update: {
        stageReached: typeof stageReached === 'number' ? stageReached : undefined,
        lastVisitedAt: now,
      },
      create: {
        userId,
        moduleSlug,
        stageReached: typeof stageReached === 'number' ? stageReached : 1,
        lastVisitedAt: now,
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/progress] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
