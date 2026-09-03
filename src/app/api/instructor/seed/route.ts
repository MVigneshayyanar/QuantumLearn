import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const mockStudents = [
      {
        name: 'Aarav Patel',
        email: 'aarav.patel@iitb.ac.in',
        streakDays: 4,
        modules: [
          { slug: 'deutsch-jozsa', isCompleted: true, score: 100 },
          { slug: 'grover', isCompleted: true, score: 90 },
          { slug: 'teleportation', isCompleted: false, score: 50 },
          { slug: 'superdense-coding', isCompleted: false, score: 0 },
        ],
        quizAttempts: [
          { slug: 'deutsch-jozsa', qId: 'dj-q1', correct: true },
          { slug: 'deutsch-jozsa', qId: 'dj-q2', correct: true },
          { slug: 'deutsch-jozsa', qId: 'dj-q3', correct: true },
          { slug: 'grover', qId: 'gr-q1', correct: true },
          { slug: 'grover', qId: 'gr-q2', correct: false, misconception: 'GROVER_AMPLITUDE_MEAN' },
        ],
        misconceptions: ['GROVER_AMPLITUDE_MEAN']
      },
      {
        name: 'Elena Rostova',
        email: 'elena.r@quantum-lab.org',
        streakDays: 7,
        modules: [
          { slug: 'deutsch-jozsa', isCompleted: true, score: 100 },
          { slug: 'grover', isCompleted: true, score: 100 },
          { slug: 'teleportation', isCompleted: true, score: 85 },
          { slug: 'superdense-coding', isCompleted: true, score: 95 },
        ],
        quizAttempts: [
          { slug: 'deutsch-jozsa', qId: 'dj-q1', correct: true },
          { slug: 'deutsch-jozsa', qId: 'dj-q2', correct: true },
          { slug: 'teleportation', qId: 'tp-q1', correct: true },
          { slug: 'teleportation', qId: 'tp-q2', correct: false, misconception: 'ENTANGLEMENT_COMMUNICATION' },
        ],
        misconceptions: ['ENTANGLEMENT_COMMUNICATION']
      },
      {
        name: 'Marcus Vance',
        email: 'mvance@mit.edu',
        streakDays: 2,
        modules: [
          { slug: 'deutsch-jozsa', isCompleted: true, score: 67 },
          { slug: 'grover', isCompleted: false, score: 40 },
          { slug: 'teleportation', isCompleted: false, score: 0 },
          { slug: 'superdense-coding', isCompleted: false, score: 0 },
        ],
        quizAttempts: [
          { slug: 'deutsch-jozsa', qId: 'dj-q1', correct: false, misconception: 'DEUTSCH_ORACLE_QUERY' },
          { slug: 'deutsch-jozsa', qId: 'dj-q2', correct: false, misconception: 'PHASE_KICKBACK_MISUNDERSTANDING' },
          { slug: 'deutsch-jozsa', qId: 'dj-q3', correct: true },
        ],
        misconceptions: ['DEUTSCH_ORACLE_QUERY', 'PHASE_KICKBACK_MISUNDERSTANDING']
      },
      {
        name: 'Zara Chen',
        email: 'zara.chen@berkeley.edu',
        streakDays: 5,
        modules: [
          { slug: 'deutsch-jozsa', isCompleted: true, score: 100 },
          { slug: 'grover', isCompleted: true, score: 80 },
          { slug: 'teleportation', isCompleted: true, score: 90 },
          { slug: 'superdense-coding', isCompleted: false, score: 30 },
        ],
        quizAttempts: [
          { slug: 'teleportation', qId: 'tp-q1', correct: false, misconception: 'NO_CLONING_VIOLATION' },
          { slug: 'teleportation', qId: 'tp-q2', correct: true },
        ],
        misconceptions: ['NO_CLONING_VIOLATION']
      },
      {
        name: 'Kavita Rao',
        email: 'kavita.rao@delhi.ac.in',
        streakDays: 3,
        modules: [
          { slug: 'deutsch-jozsa', isCompleted: true, score: 100 },
          { slug: 'grover', isCompleted: false, score: 50 },
          { slug: 'teleportation', isCompleted: false, score: 0 },
          { slug: 'superdense-coding', isCompleted: false, score: 0 },
        ],
        quizAttempts: [
          { slug: 'deutsch-jozsa', qId: 'dj-q2', correct: false, misconception: 'PHASE_KICKBACK_MISUNDERSTANDING' },
          { slug: 'deutsch-jozsa', qId: 'dj-q1', correct: true },
        ],
        misconceptions: ['PHASE_KICKBACK_MISUNDERSTANDING']
      }
    ];

    for (const student of mockStudents) {
      // Upsert User
      const user = await prisma.user.upsert({
        where: { email: student.email },
        update: {
          name: student.name,
          streakDays: student.streakDays,
          lastActiveAt: new Date()
        },
        create: {
          name: student.name,
          email: student.email,
          role: 'STUDENT',
          streakDays: student.streakDays
        }
      });

      // Upsert Progress
      for (const mod of student.modules) {
        await prisma.userProgress.upsert({
          where: {
            userId_moduleSlug: { userId: user.id, moduleSlug: mod.slug }
          },
          update: {
            isCompleted: mod.isCompleted,
            masteryScore: mod.score
          },
          create: {
            userId: user.id,
            moduleSlug: mod.slug,
            isCompleted: mod.isCompleted,
            masteryScore: mod.score,
            stageReached: mod.isCompleted ? 4 : 2
          }
        });
      }

      // Create Quiz Attempts
      for (const qa of student.quizAttempts) {
        await prisma.quizAttempt.create({
          data: {
            userId: user.id,
            moduleSlug: qa.slug,
            questionId: qa.qId,
            selectedAnswer: 'opt-selected',
            isCorrect: qa.correct,
            timeTakenMs: 12000,
            difficulty: 'INTERMEDIATE',
            misconceptionTag: qa.misconception || null
          }
        });
      }

      // Upsert Misconceptions
      for (const misc of student.misconceptions) {
        await prisma.misconceptionLog.upsert({
          where: {
            userId_misconceptionTag: { userId: user.id, misconceptionTag: misc }
          },
          update: {
            occurrenceCount: { increment: 1 }
          },
          create: {
            userId: user.id,
            misconceptionTag: misc,
            occurrenceCount: 1,
            isResolved: false
          }
        });
      }
    }

    return NextResponse.json({ success: true, count: mockStudents.length });
  } catch (err: any) {
    console.error('Seed Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to seed database' }, { status: 500 });
  }
}
