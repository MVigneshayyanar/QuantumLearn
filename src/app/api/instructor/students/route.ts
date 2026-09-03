/**
 * GET /api/instructor/students
 *
 * Returns list of all students with their progress summaries
 * for the instructor's student roster view.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        streakDays: true,
        lastActiveAt: true,
        createdAt: true,
        progress: {
          select: {
            moduleSlug: true,
            isCompleted: true,
            masteryScore: true,
            stageReached: true,
            lastVisitedAt: true,
          },
        },
        _count: {
          select: {
            quizAttempts: true,
            misconceptions: true,
          },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    });

    const studentList = students.map((s) => {
      const completedModules = s.progress.filter((p) => p.isCompleted).length;
      const avgScore =
        s.progress.length > 0
          ? Math.round(
              s.progress.reduce((sum, p) => sum + p.masteryScore, 0) / s.progress.length
            )
          : 0;

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        streakDays: s.streakDays,
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        completedModules,
        totalModules: 4,
        averageScore: avgScore,
        quizAttempts: s._count.quizAttempts,
        activeMisconceptions: s._count.misconceptions,
        moduleProgress: s.progress,
      };
    });

    return NextResponse.json({ students: studentList });
  } catch (err) {
    console.error('[GET /api/instructor/students] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
