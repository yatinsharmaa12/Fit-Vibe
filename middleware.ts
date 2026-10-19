import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/login', '/register', '/otp', '/api/auth', '/api/health'];

const ASSET_PATTERN = /\.(?:avif|png|jpe?g|gif|svg|ico|webp|mp3|mp4|webm|woff2?|ttf|otf|txt|xml|webmanifest)$/i;

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    ASSET_PATTERN.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;
  const requestId = crypto.randomUUID();

  const isPublicPath =
    pathname === '/' || publicPaths.some((path) => pathname.startsWith(path)) || isStaticAsset(pathname);

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const redirect = NextResponse.redirect(new URL('/dashboard', request.url));
    redirect.headers.set('x-request-id', requestId);
    return redirect;
  }

  if (!token && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      const unauthorized = NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
      unauthorized.headers.set('x-request-id', requestId);
      return unauthorized;
    }

    const redirect = NextResponse.redirect(new URL('/login', request.url));
    redirect.headers.set('x-request-id', requestId);
    return redirect;
  }

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  if (isStaticAsset(pathname)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
