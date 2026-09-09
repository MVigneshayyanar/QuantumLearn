import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAccess } from '@/lib/auth-server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

/**
 * GET /api/admin/users
 * Returns list of instructors and students with their mapping metadata.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized.' }, { status: 403 });
    }

    const [instructors, students, mappings] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'EDUCATOR' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          lastActiveAt: true,
          instructorMappings: {
            select: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: {
          id: true,
          name: true,
          email: true,
          streakDays: true,
          createdAt: true,
          lastActiveAt: true,
          studentMappings: {
            select: {
              instructor: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: {
              quizAttempts: true,
              practiceSubmissions: true,
              aiInteractions: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.instructorStudent.count()
    ]);

    return NextResponse.json({
      instructors: instructors.map(inst => ({
        ...inst,
        assignedStudentCount: inst.instructorMappings.length,
        assignedStudents: inst.instructorMappings.map(m => m.student)
      })),
      students: students.map(s => ({
        ...s,
        assignedInstructors: s.studentMappings.map(m => m.instructor),
        isAssigned: s.studentMappings.length > 0,
        activityCount: s._count.quizAttempts + s._count.practiceSubmissions,
        aiInteractionCount: s._count.aiInteractions,
      })),
      totalMappings: mappings,
    });
  } catch (err: any) {
    console.error('[GET /api/admin/users] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new user (instructor or student)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, mapToInstructorId } = body;

    const trimmedName = (name || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: 'Valid name is required (at least 2 characters).' }, { status: 400 });
    }

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const assignedRole = role === 'EDUCATOR' || role === 'INSTRUCTOR' ? 'EDUCATOR' : 'STUDENT';

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        passwordHash: hashPassword(trimmedPassword),
        role: assignedRole,
        lastActiveAt: new Date(),
      }
    });

    // If student and mapToInstructorId provided, map them
    if (assignedRole === 'STUDENT' && mapToInstructorId) {
      await prisma.instructorStudent.create({
        data: {
          instructorId: mapToInstructorId,
          studentId: newUser.id,
        }
      }).catch(() => {});
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/admin/users] Error:', err);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
}
