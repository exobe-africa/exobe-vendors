import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/privacy-policy', '/terms-and-conditions'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Expect vendor cookies if you later set them server-side; fallback to token presence check
  const token = request.cookies.get('exobeVendorToken')?.value;
  const role = request.cookies.get('exobeVendorRole')?.value as string | undefined;
  const hasVendorAccess = role === 'RETAILER' || role === 'WHOLESALER' || role === 'SERVICE_PROVIDER';

  if (!isPublicRoute && (!token || !hasVendorAccess) && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && token && hasVendorAccess && pathname !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
