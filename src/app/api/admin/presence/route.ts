import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-server';
import { getPresenceStats } from '@/lib/presence-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAccess(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized admin access.' }, { status: 403 });
    }

    const stats = getPresenceStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to retrieve presence logs' },
      { status: 500 }
    );
  }
}
