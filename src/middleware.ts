import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Debug bypass 
    if (process.env.NODE_ENV === 'development' ){
        return NextResponse.next()
    }

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth/login') ||
        pathname.startsWith('/api/auth/signup') ||
        pathname === '/modules/auth/login' ||
        pathname === '/modules/auth/signup' ||
        pathname === '/' ||
        /\.(.*)$/.test(pathname)
    ) {
        return NextResponse.next()
    }

    const token = req.cookies.get('treko_token')?.value
    if (!token) {
        // no token → redirect to login
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/modules/auth/login'
        return NextResponse.redirect(loginUrl)
    }

    try {
        // verify JWT
        jwt.verify(token, "TREKOOOO")
        return NextResponse.next()
    } catch {
        // invalid/expired token → redirect
        console.log("JWT inválido")
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/modules/auth/login'
        return NextResponse.redirect(loginUrl)
    }
}

export const config = {
    matcher: '/((?!api/auth/login|_next|static|favicon\\.ico).*)',
}