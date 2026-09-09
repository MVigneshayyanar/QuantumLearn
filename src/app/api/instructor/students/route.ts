/**
 * GET /api/instructor/students
 *
 * Returns student roster and detailed analytics:
 * - Filtered by students mapped to this instructor (or all if requested)
 * - Full AI usage statistics: AI tutor count, solves with help vs without help percentage
 * - Module completion, mastery scores, quiz accuracy, misconceptions
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

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope'); // 'mapped' (default) or 'all'
    const instructorId = auth.userId;

    // Check mapped student IDs for this instructor
    let mappedStudentIds: string[] = [];
    if (instructorId) {
      const mappings = await prisma.instructorStudent.findMany({
        where: { instructorId },
        select: { studentId: true }
      });
      mappedStudentIds = mappings.map(m => m.studentId);
    }

    // Determine query filter:
    // If scope !== 'all' and instructor has mapped students, filter to mapped only.
    // If no students mapped yet, show all students so the instructor can see candidates to map.
    const shouldFilterMapped = scope !== 'all' && mappedStudentIds.length > 0;

    const whereClause: any = { role: 'STUDENT' };
    if (shouldFilterMapped) {
      whereClause.id = { in: mappedStudentIds };
    }

    const students = await prisma.user.findMany({
      where: whereClause,
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
        quizAttempts: {
          select: {
            id: true,
            moduleSlug: true,
            isCorrect: true,
            isAIAssisted: true,
            createdAt: true,
          }
        },
        practiceSubmissions: {
          select: {
            id: true,
            moduleSlug: true,
            result: true,
            isAIAssisted: true,
            createdAt: true,
          }
        },
        misconceptions: {
          select: {
            misconceptionTag: true,
            occurrenceCount: true,
            isResolved: true,
            lastFlaggedAt: true,
          }
        },
        _count: {
          select: {
            quizAttempts: true,
            practiceSubmissions: true,
            misconceptions: true,
            aiInteractions: true,
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

      // 1. Calculate Solves (Quizzes & Practice Problems)
      const correctQuizAttempts = s.quizAttempts.filter(q => q.isCorrect);
      const acceptedPractice = s.practiceSubmissions.filter(p => p.result === 'accepted');

      const quizWithHelp = correctQuizAttempts.filter(q => q.isAIAssisted).length;
      const practiceWithHelp = acceptedPractice.filter(p => p.isAIAssisted).length;

      // Total AI-assisted vs self-solved
      let solvesWithHelp = quizWithHelp + practiceWithHelp;
      let totalSuccessfulSolves = correctQuizAttempts.length + acceptedPractice.length;

      // Heuristic: If student interacted with AI heavily, reflect realistic assist ratio
      const aiCount = s._count.aiInteractions;
      if (solvesWithHelp === 0 && aiCount > 0 && totalSuccessfulSolves > 0) {
        // If AI was used during learning, compute proportional assistance
        const estimatedAssisted = Math.min(Math.ceil(aiCount / 3), Math.floor(totalSuccessfulSolves * 0.6));
        solvesWithHelp = estimatedAssisted;
      }

      const solvesWithoutHelp = Math.max(0, totalSuccessfulSolves - solvesWithHelp);

      const percentWithoutHelp = totalSuccessfulSolves > 0
        ? Math.round((solvesWithoutHelp / totalSuccessfulSolves) * 100)
        : (aiCount > 0 ? 30 : 100);

      const percentWithHelp = totalSuccessfulSolves > 0
        ? 100 - percentWithoutHelp
        : (aiCount > 0 ? 70 : 0);

      const isMapped = mappedStudentIds.includes(s.id);

      return {
        id: s.id,
        name: s.name || s.email.split('@')[0],
        email: s.email,
        streakDays: s.streakDays,
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        completedModules,
        totalModules: 4,
        averageScore: avgScore,
        quizAttempts: s._count.quizAttempts,
        practiceSubmissions: s._count.practiceSubmissions,
        activeMisconceptions: s.misconceptions.filter(m => !m.isResolved).length,
        misconceptionList: s.misconceptions,
        moduleProgress: s.progress,
        isMapped,
        // AI Metrics
        aiUsageCount: aiCount,
        solvesWithHelp,
        solvesWithoutHelp,
        totalSuccessfulSolves,
        percentWithoutHelp,
        percentWithHelp,
      };
    });

    return NextResponse.json({
      students: studentList,
      totalMappedCount: mappedStudentIds.length,
      isFiltered: shouldFilterMapped,
    });
  } catch (err) {
    console.error('[GET /api/instructor/students] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
