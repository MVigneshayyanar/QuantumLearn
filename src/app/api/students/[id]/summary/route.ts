/**
 * GET /api/students/[id]/summary
 *
 * Returns the student's progress summary from the DB.
 * Shape mirrors what the ProgressDashboard component needs:
 * {
 *   student: { id, name, email, streakDays, lastActiveAt },
 *   completedModules: Record<string, boolean>,
 *   moduleScores: Record<string, number>,
 *   quizStats: { total, correct, accuracy },
 *   misconceptions: Array<{ tag, count, isResolved }>,
 *   recentQuizAttempts: Array<QuizAttempt>
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(context?.params);
    const userId = resolvedParams?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Student ID is required.' }, { status: 400 });
    }

    // Fetch user, progress, quiz attempts, misconceptions in parallel
    const [user, progressRecords, quizAttempts, misconceptions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, streakDays: true, lastActiveAt: true },
      }),
      prisma.userProgress.findMany({
        where: { userId },
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.misconceptionLog.findMany({
        where: { userId },
        orderBy: { lastFlaggedAt: 'desc' },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    // Build completedModules and moduleScores maps
    const completedModules: Record<string, boolean> = {};
    const moduleScores: Record<string, number> = {};

    for (const p of (progressRecords as any[])) {
      completedModules[p.moduleSlug] = p.isCompleted;
      moduleScores[p.moduleSlug] = p.masteryScore;
    }

    // Quiz stats
    const totalAttempts = quizAttempts.length;
    const correctAttempts = (quizAttempts as any[]).filter((a: any) => a.isCorrect).length;

    // Build concept mastery from quiz attempt data (approximate from quiz performance per concept)
    // We compute this from recent quiz data per module rather than a static field
    const conceptMastery: Record<string, number> = {
      superposition: 40,
      entanglement: 30,
      phaseKickback: 20,
      interference: 35,
      measurement: 50,
    };

    // Calculate per-module accuracy and use that to refine mastery
    const moduleAccuracy: Record<string, number> = {};
    const moduleAttemptCounts: Record<string, { total: number; correct: number }> = {};
    for (const a of (quizAttempts as any[])) {
      if (!moduleAttemptCounts[a.moduleSlug]) {
        moduleAttemptCounts[a.moduleSlug] = { total: 0, correct: 0 };
      }
      moduleAttemptCounts[a.moduleSlug].total++;
      if (a.isCorrect) moduleAttemptCounts[a.moduleSlug].correct++;
    }
    for (const [slug, counts] of Object.entries(moduleAttemptCounts)) {
      moduleAccuracy[slug] = Math.round((counts.correct / counts.total) * 100);
    }

    // Map module accuracy to concept mastery (simplified heuristic)
    if (moduleAccuracy['deutsch-jozsa'] !== undefined) {
      conceptMastery.phaseKickback = moduleAccuracy['deutsch-jozsa'];
      conceptMastery.interference = moduleAccuracy['deutsch-jozsa'];
    }
    if (moduleAccuracy['grover'] !== undefined) {
      conceptMastery.superposition = moduleAccuracy['grover'];
    }
    if (moduleAccuracy['teleportation'] !== undefined) {
      conceptMastery.entanglement = moduleAccuracy['teleportation'];
    }
    if (moduleAccuracy['superdense-coding'] !== undefined) {
      conceptMastery.measurement = moduleAccuracy['superdense-coding'];
    }

    return NextResponse.json({
      student: user,
      completedModules,
      moduleScores,
      conceptMastery,
      quizStats: {
        total: totalAttempts,
        correct: correctAttempts,
        accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
      },
      misconceptions: (misconceptions as any[]).map((m: any) => ({
        tag: m.misconceptionTag,
        count: m.occurrenceCount,
        isResolved: m.isResolved,
      })),
      recentQuizAttempts: (quizAttempts as any[]).slice(0, 20).map((a: any) => ({
        moduleSlug: a.moduleSlug,
        questionId: a.questionId,
        isCorrect: a.isCorrect,
        misconceptionTag: a.misconceptionTag,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error('[GET /api/students/[id]/summary] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
