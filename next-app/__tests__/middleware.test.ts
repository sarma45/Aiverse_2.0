import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

describe('CSRF Middleware', () => {
  it('should block POST requests without CSRF token', async () => {
    const req = new NextRequest('http://localhost:3000/api/tools', {
      method: 'POST',
    });
    
    const res = middleware(req);
    expect(res.status).toBe(403);
  });

  it('should allow GET requests without CSRF token', async () => {
    const req = new NextRequest('http://localhost:3000/api/tools', {
      method: 'GET',
    });
    
    const res = middleware(req);
    // NextResponse.next() returns a response with status 200 by default in this mock
    expect(res.status).toBe(200);
  });

  it('should allow POST requests with valid CSRF tokens', async () => {
    const req = new NextRequest('http://localhost:3000/api/tools', {
      method: 'POST',
      headers: new Headers({
        'x-csrf-token': 'valid-token'
      })
    });
    req.cookies.set('csrf_token', 'valid-token');
    
    const res = middleware(req);
    expect(res.status).toBe(200);
  });
});
