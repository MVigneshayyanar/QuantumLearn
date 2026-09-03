import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, email, password } = body;

    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();
    const trimmedName = (name || '').trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const passwordHash = hashPassword(trimmedPassword);

    // ==========================================
    // INSTRUCTOR SPECIAL LOGIN CHECK
    // Email: instructor@qlearn.com | Pass: qlearn123
    // ==========================================
    const isInstructorCredentials =
      normalizedEmail === 'instructor@qlearn.com' && trimmedPassword === 'qlearn123';

    if (action === 'signup') {
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: 'Name is required (at least 2 characters).' }, { status: 400 });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser && (existingUser as any).passwordHash) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        );
      }

      const role = isInstructorCredentials ? 'EDUCATOR' : 'STUDENT';

      let user;
      if (existingUser) {
        // Upgrade existing passwordless user
        user = await (prisma.user as any).update({
          where: { id: existingUser.id },
          data: {
            name: trimmedName,
            passwordHash,
            role,
            lastActiveAt: new Date()
          }
        });
      } else {
        // Create new account
        user = await (prisma.user as any).create({
          data: {
            name: trimmedName,
            email: normalizedEmail,
            passwordHash,
            role,
            lastActiveAt: new Date()
          }
        });
      }

      return NextResponse.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isInstructor: user.role === 'EDUCATOR'
      });
    }

    if (action === 'signin') {
      // Find user by email
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      // If instructor credentials used for the first time, auto-provision
      if (!user && isInstructorCredentials) {
        user = await (prisma.user as any).create({
          data: {
            name: 'Instructor Admin',
            email: 'instructor@qlearn.com',
            passwordHash,
            role: 'EDUCATOR',
            lastActiveAt: new Date()
          }
        });
      }

      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email. Please sign up.' },
          { status: 404 }
        );
      }

      // Check password
      const storedHash = (user as any).passwordHash;

      // Verify either matching hash or instructor override
      if (isInstructorCredentials) {
        // ensure instructor role is active
        if (user.role !== 'EDUCATOR') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'EDUCATOR', passwordHash }
          });
        }
      } else if (storedHash && storedHash !== passwordHash) {
        return NextResponse.json(
          { error: 'Invalid password. Please try again.' },
          { status: 401 }
        );
      } else if (!storedHash) {
        // First time setting password for legacy user
        user = await (prisma.user as any).update({
          where: { id: user.id },
          data: { passwordHash, lastActiveAt: new Date() }
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() }
        });
      }

      const finalUser = user!;
      return NextResponse.json({
        userId: finalUser.id,
        name: finalUser.name,
        email: finalUser.email,
        role: finalUser.role,
        isInstructor: finalUser.role === 'EDUCATOR'
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    console.error('[POST /api/auth] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
