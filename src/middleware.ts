import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce server-side access control on the /admin route
  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('ql_user_role')?.value;
    if (role !== 'ADMIN') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('auth_error', 'admin_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Enforce server-side access control on the /instructor route
  if (pathname.startsWith('/instructor')) {
    const role = request.cookies.get('ql_user_role')?.value;
    const isAuthorized =
      role === 'EDUCATOR' ||
      role === 'ADMIN' ||
      role === 'INSTRUCTOR';

    if (!isAuthorized) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('auth_error', 'instructor_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/instructor/:path*', '/admin/:path*'],
};
