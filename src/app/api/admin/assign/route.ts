import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAccess } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/assign
 * Assign or unassign a student to/from an instructor
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized.' }, { status: 403 });
    }

    const body = await req.json();
    const { action, instructorId, studentId } = body;

    if (!instructorId || !studentId) {
      return NextResponse.json({ error: 'instructorId and studentId are required.' }, { status: 400 });
    }

    if (action === 'unassign') {
      await prisma.instructorStudent.deleteMany({
        where: {
          instructorId,
          studentId,
        }
      });
      return NextResponse.json({ success: true, message: 'Student unassigned successfully.' });
    }

    // Default action: assign / map
    const existing = await prisma.instructorStudent.findUnique({
      where: {
        instructorId_studentId: {
          instructorId,
          studentId
        }
      }
    });

    if (!existing) {
      await prisma.instructorStudent.create({
        data: {
          instructorId,
          studentId,
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Student assigned successfully.' });
  } catch (err: any) {
    console.error('[POST /api/admin/assign] Error:', err);
    return NextResponse.json({ error: 'Failed to update assignment.' }, { status: 500 });
  }
}
