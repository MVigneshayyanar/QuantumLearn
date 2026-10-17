import { NextRequest, NextResponse } from 'next/server';
import { recordPresence } from '@/lib/presence-store';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, userId, name, email, role, mode, page, language } = body;

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'Missing sessionId' }, { status: 400 });
    }

    recordPresence({
      sessionId,
      userId: userId || req.cookies.get('ql_user_id')?.value,
      name,
      email,
      role: role || req.cookies.get('ql_user_role')?.value,
      mode: mode === 'technical' ? 'technical' : 'simple',
      page: page || '/',
      language: language || 'en',
    });

    // Throttle DB write: at 1,000 req/sec, we must not hit Postgres on every heartbeat.
    // Touch lastActiveAt at most once every 10 minutes or sampled (1 in 10) to protect connection limits.
    const effectiveUserId = userId || req.cookies.get('ql_user_id')?.value;
    if (effectiveUserId && Math.random() < 0.1) {
      prisma.user
        .update({
          where: { id: effectiveUserId },
          data: { lastActiveAt: new Date() },
        })
        .catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to record heartbeat' }, { status: 500 });
  }
}
