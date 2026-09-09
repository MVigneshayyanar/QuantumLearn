import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyInstructorAccess } from '@/lib/auth-server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

/**
 * GET /api/instructor/mapping
 * Returns:
 * 1. mappedStudents: students mapped to the current instructor
 * 2. availableStudents: students in the system not yet mapped to this instructor
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyInstructorAccess(req);
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.error || 'Unauthorized: Instructor access required.' }, { status: 403 });
    }

    const instructorId = auth.userId;

    // Get current mappings
    const mappings = await prisma.instructorStudent.findMany({
      where: { instructorId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            streakDays: true,
            lastActiveAt: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const mappedStudentIds = mappings.map(m => m.studentId);

    // Get available students not mapped to this instructor
    const availableStudents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        id: { notIn: mappedStudentIds.length > 0 ? mappedStudentIds : ['none'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastActiveAt: true,
      },
      orderBy: { lastActiveAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      mappedStudents: mappings.map(m => ({
        ...m.student,
        mappedAt: m.createdAt,
      })),
      availableStudents,
    });
  } catch (err: any) {
    console.error('[GET /api/instructor/mapping] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * POST /api/instructor/mapping
 * Map an existing student OR create a brand new student directly mapped to this instructor
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyInstructorAccess(req);
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.error || 'Unauthorized: Instructor access required.' }, { status: 403 });
    }

    const instructorId = auth.userId;
    const body = await req.json();
    const { studentId, name, email, password } = body;

    // Case 1: Map existing student
    if (studentId) {
      const student = await prisma.user.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
      }

      await prisma.instructorStudent.upsert({
        where: {
          instructorId_studentId: {
            instructorId,
            studentId,
          }
        },
        update: {},
        create: {
          instructorId,
          studentId,
        }
      });

      return NextResponse.json({ success: true, message: 'Student mapped to your class.' });
    }

    // Case 2: Create a new student and map immediately
    const trimmedName = (name || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
    }
    if (!trimmedPassword || trimmedPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      // If user exists, map them to this instructor
      await prisma.instructorStudent.upsert({
        where: {
          instructorId_studentId: {
            instructorId,
            studentId: existing.id,
          }
        },
        update: {},
        create: {
          instructorId,
          studentId: existing.id,
        }
      });
      return NextResponse.json({ success: true, message: 'Existing student mapped to your class.' });
    }

    // Create new student
    const newStudent = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        passwordHash: hashPassword(trimmedPassword),
        role: 'STUDENT',
        lastActiveAt: new Date(),
        studentMappings: {
          create: {
            instructorId,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'New student created and mapped to your class.',
      student: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/instructor/mapping] Error:', err);
    return NextResponse.json({ error: 'Failed to map student.' }, { status: 500 });
  }
}

/**
 * DELETE /api/instructor/mapping
 * Unmap student from this instructor
 */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyInstructorAccess(req);
    if (!auth.authorized || !auth.userId) {
      return NextResponse.json({ error: auth.error || 'Unauthorized.' }, { status: 403 });
    }

    const instructorId = auth.userId;
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId query param required.' }, { status: 400 });
    }

    await prisma.instructorStudent.deleteMany({
      where: {
        instructorId,
        studentId,
      }
    });

    return NextResponse.json({ success: true, message: 'Student removed from your class.' });
  } catch (err: any) {
    console.error('[DELETE /api/instructor/mapping] Error:', err);
    return NextResponse.json({ error: 'Failed to unmap student.' }, { status: 500 });
  }
}
