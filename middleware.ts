import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await decrypt(sessionCookie);
    if (!payload || payload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Prevent logged in users from seeing login page
  if (path === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      const payload = await decrypt(sessionCookie);
      if (payload && payload.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  const isAccountPublic = path === '/account/login' || path === '/account/register';
  const isAccountProtected = path === '/account' || (path.startsWith('/account/') && !isAccountPublic);
  if (isAccountProtected) {
    const sessionCookie = request.cookies.get('customer_session')?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }
    const payload = await decrypt(sessionCookie);
    if (!payload || payload.kind !== 'customer' || payload.role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/account/login', request.url));
    }
  }
  if (isAccountPublic) {
    const sessionCookie = request.cookies.get('customer_session')?.value;
    if (sessionCookie) {
      const payload = await decrypt(sessionCookie);
      if (payload && payload.kind === 'customer' && payload.role === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/account', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account', '/account/:path*'],
};

