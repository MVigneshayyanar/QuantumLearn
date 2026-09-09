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
    // SPECIAL CREDENTIALS CHECK
    // Admin: admin@qlearn.com | Pass: admin123
    // Instructor: instructor@qlearn.com | Pass: qlearn123
    // Student Demo: student@qlearn.com | Pass: student123
    // ==========================================
    const isAdminCredentials =
      normalizedEmail === 'admin@qlearn.com' && trimmedPassword === 'admin123';
    const isInstructorCredentials =
      normalizedEmail === 'instructor@qlearn.com' && trimmedPassword === 'qlearn123';
    const isStudentCredentials =
      normalizedEmail === 'student@qlearn.com' && trimmedPassword === 'student123';

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

      const role = isAdminCredentials ? 'ADMIN' : isInstructorCredentials ? 'EDUCATOR' : 'STUDENT';

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

      const res = NextResponse.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'ADMIN',
        isInstructor: user.role === 'EDUCATOR' || user.role === 'ADMIN'
      });

      res.cookies.set('ql_user_id', user.id, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      res.cookies.set('ql_user_role', user.role, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return res;
    }

    if (action === 'signin' || action === 'login') {
      // Find user by email
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      // If admin credentials used for the first time, auto-provision
      if (!user && isAdminCredentials) {
        user = await (prisma.user as any).create({
          data: {
            name: 'System Administrator',
            email: 'admin@qlearn.com',
            passwordHash,
            role: 'ADMIN',
            lastActiveAt: new Date()
          }
        });
      }

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

      // If student demo credentials used for the first time, auto-provision
      if (!user && isStudentCredentials) {
        user = await (prisma.user as any).create({
          data: {
            name: 'Alex Mercer (Student)',
            email: 'student@qlearn.com',
            passwordHash,
            role: 'STUDENT',
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

      // Verify either matching hash or admin/instructor/student override
      if (isAdminCredentials) {
        if (user.role !== 'ADMIN') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN', passwordHash }
          });
        }
      } else if (isInstructorCredentials) {
        if (user.role !== 'EDUCATOR' && user.role !== 'ADMIN') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'EDUCATOR', passwordHash }
          });
        }
      } else if (isStudentCredentials) {
        if (user.role !== 'STUDENT') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'STUDENT', passwordHash }
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
      const res = NextResponse.json({
        userId: finalUser.id,
        name: finalUser.name,
        email: finalUser.email,
        role: finalUser.role,
        isAdmin: finalUser.role === 'ADMIN',
        isInstructor: finalUser.role === 'EDUCATOR' || finalUser.role === 'ADMIN'
      });

      res.cookies.set('ql_user_id', finalUser.id, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      res.cookies.set('ql_user_role', finalUser.role, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return res;
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    console.error('[POST /api/auth] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
