import { NextRequest, NextResponse } from 'next/server';
import { prisma, withPrismaRetry } from '@/lib/prisma';
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

    if (action === 'signup') {
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json({ error: 'Name is required (at least 2 characters).' }, { status: 400 });
      }

      const user = await withPrismaRetry(async () => {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingUser && existingUser.passwordHash) {
          throw new Error('USER_EXISTS');
        }

        if (existingUser) {
          // Upgrade existing passwordless user
          return await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: trimmedName,
              passwordHash,
              lastActiveAt: new Date(),
            },
          });
        } else {
          // Create new user in database
          return await prisma.user.create({
            data: {
              name: trimmedName,
              email: normalizedEmail,
              passwordHash,
              role: 'STUDENT',
              isPremium: false,
              lastActiveAt: new Date(),
            },
          });
        }
      });

      const res = NextResponse.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'ADMIN',
        isInstructor: user.role === 'EDUCATOR' || user.role === 'ADMIN',
        isPremium: Boolean(user.isPremium),
      });

      res.cookies.set('ql_user_id', user.id, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });
      res.cookies.set('ql_user_role', user.role, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });
      res.cookies.set('ql_user_premium', String(Boolean(user.isPremium)), {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });

      return res;
    }

    if (action === 'signin' || action === 'login') {
      const user = await withPrismaRetry(async () => {
        // Find user by email in database
        const found = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!found) {
          throw new Error('USER_NOT_FOUND');
        }

        // Verify password hash against database record
        if (found.passwordHash && found.passwordHash !== passwordHash) {
          throw new Error('INVALID_PASSWORD');
        }

        // Set password for legacy account if missing
        if (!found.passwordHash) {
          return await prisma.user.update({
            where: { id: found.id },
            data: { passwordHash, lastActiveAt: new Date() },
          });
        }

        return await prisma.user.update({
          where: { id: found.id },
          data: { lastActiveAt: new Date() },
        });
      });

      const res = NextResponse.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'ADMIN',
        isInstructor: user.role === 'EDUCATOR' || user.role === 'ADMIN',
        isPremium: Boolean(user.isPremium),
      });

      res.cookies.set('ql_user_id', user.id, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });
      res.cookies.set('ql_user_role', user.role, {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });
      res.cookies.set('ql_user_premium', String(Boolean(user.isPremium)), {
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });

      return res;
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: any) {
    if (err?.message === 'USER_EXISTS') {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      );
    }
    if (err?.message === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'No account found with this email. Please check your credentials or sign up.' },
        { status: 404 }
      );
    }
    if (err?.message === 'INVALID_PASSWORD') {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }
    console.error('[POST /api/auth] Error:', err);
    return NextResponse.json({ error: 'Authentication service temporarily busy. Please try again.' }, { status: 500 });
  }
}
