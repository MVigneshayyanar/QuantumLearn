/**
 * POST /api/students
 *
 * Find-or-create a student (User) by email.
 * Body: { name: string, email: string }
 * Returns: { userId: string }
 *
 * PLACEHOLDER FOR REAL AUTH: This is a lightweight identity endpoint.
 * No password, no email verification. Replace with NextAuth when ready.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name is required (min 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Upsert: find by email, create if not exists, update name if returning
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: trimmedName,
        lastActiveAt: new Date(),
      },
      create: {
        name: trimmedName,
        email: normalizedEmail,
        role: 'STUDENT',
      },
    });

    return NextResponse.json({ userId: user.id }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/students] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
