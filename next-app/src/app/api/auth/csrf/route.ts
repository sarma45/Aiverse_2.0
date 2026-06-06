import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  const response = NextResponse.json({ csrfToken });
  
  response.cookies.set('csrf_token', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  
  return response;
}
