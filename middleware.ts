import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
{/* export { default } from "next-auth/middleware" */ }
import { getToken } from 'next-auth/jwt'

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/sign-up',
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
  if (token && (url.pathname.startsWith('/login') || url.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and tries to access protected pages, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
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
