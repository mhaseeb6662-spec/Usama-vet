import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const session = request.cookies.get('admin_session')?.value;
    
    if (!session || session !== 'authorized') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Prevent logged in users from seeing login page
  if (path === '/admin/login') {
    const session = request.cookies.get('admin_session')?.value;
    if (session === 'authorized') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
