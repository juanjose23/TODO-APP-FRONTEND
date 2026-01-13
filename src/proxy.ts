import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Routes that logged-in users shouldn't access
  const authRoutes = ['/login', '/register', '/auth/verify-email']
  
  // Protected routes prefix
  // We explicitly protect dashboard and users logic
  const protectedRoutesPrefixes = ['/dashboard', '/profile', '/users']

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutesPrefixes.some(prefix => pathname.startsWith(prefix))

  // If user is logged in and tries to access auth routes, redirect to dashboard
  if (isAuthRoute && token) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is NOT logged in and tries to access protected routes, redirect to login
  if (isProtectedRoute && !token) {
     const loginUrl = new URL('/login', request.url)
     // Optional: Preserve the redirect URL
     // loginUrl.searchParams.set('callbackUrl', pathname)
     return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apply to all routes except api, static files, images, favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
