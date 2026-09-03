/**
 * GET /api/instructor/overview
 *
 * Returns aggregate stats for the instructor dashboard:
 * - Total students
 * - Module completion counts and rates
 * - Average mastery scores
 * - Total quiz attempts
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyInstructorAccess } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyInstructorAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized: Instructor access required.' }, { status: 403 });
    }
    const [
      totalStudents,
      progressRecords,
      totalQuizAttempts,
      correctQuizAttempts,
      totalPracticeSubmissions,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.userProgress.findMany(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.count({ where: { isCorrect: true } }),
      prisma.practiceSubmission.count(),
    ]);

    // Module-level aggregation
    const moduleSlugs = ['deutsch-jozsa', 'grover', 'teleportation', 'superdense-coding'];
    const moduleStats = moduleSlugs.map((slug) => {
      const records = progressRecords.filter((r) => r.moduleSlug === slug);
      const completedCount = records.filter((r) => r.isCompleted).length;
      const inProgressCount = records.filter((r) => !r.isCompleted).length;
      const avgScore =
        records.length > 0
          ? Math.round(records.reduce((sum, r) => sum + r.masteryScore, 0) / records.length)
          : 0;

      return {
        moduleSlug: slug,
        totalStudents: records.length,
        completedCount,
        inProgressCount,
        completionRate: records.length > 0 ? Math.round((completedCount / records.length) * 100) : 0,
        averageScore: avgScore,
      };
    });

    return NextResponse.json({
      totalStudents,
      totalQuizAttempts,
      quizAccuracy: totalQuizAttempts > 0
        ? Math.round((correctQuizAttempts / totalQuizAttempts) * 100)
        : 0,
      totalPracticeSubmissions,
      moduleStats,
    });
  } catch (err) {
    console.error('[GET /api/instructor/overview] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
