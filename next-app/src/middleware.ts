import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CSRF Protection for state-changing API routes
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.method !== 'OPTIONS' &&
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/webhooks/') // Webhooks use their own signature validation
  ) {
    const csrfCookie = request.cookies.get('csrf_token')?.value;
    const csrfHeader = request.headers.get('x-csrf-token');

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return NextResponse.json({ error: 'CSRF Violation: Invalid or missing token' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
