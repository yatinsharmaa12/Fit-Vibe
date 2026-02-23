import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
{/* export { default } from "next-auth/middleware" */ }
import { getToken } from 'next-auth/jwt'

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/sign-up',
  '/register',
  '/otp',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images'
]

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => url.pathname.startsWith(path))

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (token && (url.pathname.startsWith('/login') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and tries to access protected pages, redirect to login
  if (!token && !isPublicPath && url.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Add performance headers to response
  const response = NextResponse.next()
  
  // Add caching headers for static assets
  if (url.pathname.startsWith('/_next/static') || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|avif)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
