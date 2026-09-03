/**
 * GET /api/instructor/misconceptions
 *
 * Returns aggregated misconception data across all students
 * for the misconception heatmap on the instructor dashboard.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all misconception logs
    const misconceptionLogs = await prisma.misconceptionLog.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { occurrenceCount: 'desc' },
    });

    // Aggregate by tag
    const tagAggregation: Record<string, { tag: string; totalCount: number; studentCount: number; isResolved: number }> = {};

    for (const log of misconceptionLogs) {
      if (!tagAggregation[log.misconceptionTag]) {
        tagAggregation[log.misconceptionTag] = {
          tag: log.misconceptionTag,
          totalCount: 0,
          studentCount: 0,
          isResolved: 0,
        };
      }
      tagAggregation[log.misconceptionTag].totalCount += log.occurrenceCount;
      tagAggregation[log.misconceptionTag].studentCount += 1;
      if (log.isResolved) tagAggregation[log.misconceptionTag].isResolved += 1;
    }

    const aggregated = Object.values(tagAggregation).sort((a, b) => b.totalCount - a.totalCount);

    // Also get per-question misconception rates from quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { misconceptionTag: { not: null } },
      select: {
        moduleSlug: true,
        questionId: true,
        misconceptionTag: true,
        isCorrect: true,
      },
    });

    // Group by module+question
    const questionMisconceptions: Record<string, { moduleSlug: string; questionId: string; misconceptionTag: string; count: number }> = {};
    for (const a of quizAttempts) {
      if (!a.misconceptionTag) continue;
      const key = `${a.moduleSlug}:${a.questionId}:${a.misconceptionTag}`;
      if (!questionMisconceptions[key]) {
        questionMisconceptions[key] = {
          moduleSlug: a.moduleSlug,
          questionId: a.questionId,
          misconceptionTag: a.misconceptionTag,
          count: 0,
        };
      }
      questionMisconceptions[key].count++;
    }

    return NextResponse.json({
      aggregatedByTag: aggregated,
      byQuestion: Object.values(questionMisconceptions).sort((a, b) => b.count - a.count),
      detailedLogs: misconceptionLogs.map((l) => ({
        tag: l.misconceptionTag,
        studentName: l.user.name,
        studentEmail: l.user.email,
        occurrenceCount: l.occurrenceCount,
        isResolved: l.isResolved,
        lastFlaggedAt: l.lastFlaggedAt,
      })),
    });
  } catch (err) {
    console.error('[GET /api/instructor/misconceptions] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
