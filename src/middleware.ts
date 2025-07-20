import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    // Exclude /admin/login and /api/auth/* from protection
    if (
      pathname === '/admin/login' ||
      pathname.startsWith('/api/auth/')
    ) {
      return NextResponse.next()
    }

    const token = req.nextauth.token
    const isAdmin = token?.role === 'admin'

    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin((?!/login$).*)'],
} 