import { getToken } from "next-auth/jwt"
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from "next/server"

export default async function middleware(req, event) {
    const token = await getToken({ req })
    const isAuthenticated = !!token

    if (req.nextUrl.pathname.startsWith('/login') && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    const authMiddleware = withAuth({
        pages: {
            signIn: `/login`,
        },
    })

    return authMiddleware(req, event)
}

export const config = {
    matcher: [
        /*
            * Match all request paths except for the ones starting with:
            * - api (API routes)
            * - _next/static (static files)
            * - _next/image (image optimization files)
            * - favicon.ico (favicon file)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
}