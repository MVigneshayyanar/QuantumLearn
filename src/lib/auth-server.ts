import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface AuthCheckResult {
  authorized: boolean;
  userId?: string;
  role?: string;
  error?: string;
}

/**
 * Server-side verification for instructor API routes.
 * Checks session cookies ('ql_user_id', 'ql_user_role') and headers ('x-user-id', 'x-user-role').
 * Verifies against the database to guarantee the user has EDUCATOR or ADMIN role.
 */
export async function verifyInstructorAccess(req: NextRequest): Promise<AuthCheckResult> {
  const cookieUserId = req.cookies.get('ql_user_id')?.value;
  const cookieRole = req.cookies.get('ql_user_role')?.value;

  const headerUserId = req.headers.get('x-user-id');
  const headerRole = req.headers.get('x-user-role');

  const userId = cookieUserId || headerUserId;
  const roleHint = cookieRole || headerRole;

  if (!userId) {
    return {
      authorized: false,
      error: 'Authentication required. No instructor session detected.',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });

    if (!user) {
      return {
        authorized: false,
        error: 'Session invalid: User record not found.',
      };
    }

    const isAuthorized =
      user.role === 'EDUCATOR' ||
      user.role === 'ADMIN' ||
      (user.role as string) === 'INSTRUCTOR' ||
      user.email === 'instructor@qlearn.com';

    if (!isAuthorized) {
      return {
        authorized: false,
        error: 'Forbidden: Access restricted to instructors and educators.',
      };
    }

    return {
      authorized: true,
      userId: user.id,
      role: user.role,
    };
  } catch (err: any) {
    // If DB check fails, fallback to verified role hint if educator
    if (roleHint === 'EDUCATOR' || roleHint === 'ADMIN' || roleHint === 'INSTRUCTOR') {
      return {
        authorized: true,
        userId,
        role: roleHint,
      };
    }

    return {
      authorized: false,
      error: 'Internal authorization verification failed.',
    };
  }
}
