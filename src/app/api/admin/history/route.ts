import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAccess } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export interface AdminHistoryItem {
  id: string;
  timestamp: string; // ISO string
  category: 'learning' | 'auth';
  type: 'quiz_attempt' | 'practice_submission' | 'ai_interaction' | 'user_registration' | 'user_login';
  userName: string;
  userEmail: string;
  role: string;
  title: string;
  details: string;
  badge: {
    label: string;
    variant: 'emerald' | 'indigo' | 'amber' | 'blue' | 'purple';
  };
}

/**
 * GET /api/admin/history
 * Fetches persistent historical logs of student learning activities and user registrations/logins.
 * Loaded on demand on admin page load or manual refresh (zero background polling/heartbeats).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized admin access.' }, { status: 403 });
    }

    // Query historical records in parallel from database
    const [quizzes, practices, aiInteractions, progresses, users] = await Promise.all([
      // 1. Quizzes
      prisma.quizAttempt.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),

      // 2. Practice Submissions
      prisma.practiceSubmission.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),

      // 3. AI Tutor Interactions
      prisma.aIInteraction.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),

      // 4. Module Learning Progress
      prisma.userProgress.findMany({
        take: 100,
        orderBy: { lastVisitedAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),

      // 5. User Registrations & Active Logins
      prisma.user.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          lastActiveAt: true,
        },
      }),
    ]);

    const items: AdminHistoryItem[] = [];

    // Map Quizzes
    for (const q of quizzes) {
      items.push({
        id: `quiz_${q.id}`,
        timestamp: q.createdAt.toISOString(),
        category: 'learning',
        type: 'quiz_attempt',
        userName: q.user?.name || 'Student',
        userEmail: q.user?.email || 'N/A',
        role: q.user?.role || 'STUDENT',
        title: `Quiz Attempt: ${q.moduleSlug}`,
        details: `${q.isCorrect ? 'Answered Correctly' : 'Incorrect Answer'} (Time: ${(q.timeTakenMs / 1000).toFixed(1)}s${q.misconceptionTag ? `, Tag: ${q.misconceptionTag}` : ''})`,
        badge: {
          label: q.isCorrect ? 'Correct Quiz' : 'Quiz Missed',
          variant: q.isCorrect ? 'emerald' : 'amber',
        },
      });
    }

    // Map Module Learning Progress
    for (const prog of progresses) {
      items.push({
        id: `prog_${prog.id}`,
        timestamp: prog.lastVisitedAt.toISOString(),
        category: 'learning',
        type: 'practice_submission',
        userName: prog.user?.name || 'Student',
        userEmail: prog.user?.email || 'N/A',
        role: prog.user?.role || 'STUDENT',
        title: `Module Progress: ${prog.moduleSlug}`,
        details: `Stage ${prog.stageReached} reached • Score: ${Math.round(prog.masteryScore)}%${prog.isCompleted ? ' (Completed)' : ''}`,
        badge: {
          label: prog.isCompleted ? 'Module Completed' : `Stage ${prog.stageReached}`,
          variant: prog.isCompleted ? 'emerald' : 'indigo',
        },
      });
    }

    // Map Practice Submissions
    for (const p of practices) {
      const isAccepted = p.result === 'accepted';
      items.push({
        id: `prac_${p.id}`,
        timestamp: p.createdAt.toISOString(),
        category: 'learning',
        type: 'practice_submission',
        userName: p.user?.name || 'Student',
        userEmail: p.user?.email || 'N/A',
        role: p.user?.role || 'STUDENT',
        title: `Problem: ${p.problemId} (${p.moduleSlug})`,
        details: `Submission result: ${p.result}${p.isAIAssisted ? ' (AI Assisted)' : ''}`,
        badge: {
          label: isAccepted ? 'Problem Solved' : 'Problem Attempt',
          variant: isAccepted ? 'emerald' : 'indigo',
        },
      });
    }

    // Map AI Tutor Questions
    for (const ai of aiInteractions) {
      items.push({
        id: `ai_${ai.id}`,
        timestamp: ai.createdAt.toISOString(),
        category: 'learning',
        type: 'ai_interaction',
        userName: ai.user?.name || 'Student',
        userEmail: ai.user?.email || 'N/A',
        role: ai.user?.role || 'STUDENT',
        title: `AI Tutor: ${ai.action}`,
        details: ai.query ? `Query: "${ai.query.slice(0, 100)}${ai.query.length > 100 ? '...' : ''}"` : `Context: ${ai.context || 'General'}`,
        badge: {
          label: 'AI Tutor',
          variant: 'blue',
        },
      });
    }

    // Map Registrations and Logins for ALL users
    for (const u of users) {
      // 1. Account Created Event
      items.push({
        id: `reg_${u.id}`,
        timestamp: u.createdAt.toISOString(),
        category: 'auth',
        type: 'user_registration',
        userName: u.name || 'User',
        userEmail: u.email,
        role: u.role,
        title: `Account Registered`,
        details: `New ${u.role.toLowerCase()} account created for ${u.email}`,
        badge: {
          label: 'New Account',
          variant: 'purple',
        },
      });

      // 2. Last Login / Session Event
      if (u.lastActiveAt) {
        items.push({
          id: `login_${u.id}_${u.lastActiveAt.getTime()}`,
          timestamp: u.lastActiveAt.toISOString(),
          category: 'auth',
          type: 'user_login',
          userName: u.name || 'User',
          userEmail: u.email,
          role: u.role,
          title: `User Session Active`,
          details: `Active login session recorded`,
          badge: {
            label: 'Session Active',
            variant: 'indigo',
          },
        });
      }
    }

    // Sort all records chronologically: LATEST ON TOP
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      history: items.slice(0, 150), // Top 150 latest chronological records
    });
  } catch (err: any) {
    console.error('[GET /api/admin/history] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch history logs' }, { status: 500 });
  }
}
