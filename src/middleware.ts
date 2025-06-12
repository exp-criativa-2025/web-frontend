import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = [
  /^\/_next\//,
  // allow POST /api/auth and any subpaths like /api/auth/login
  /^\/api\/auth($|\/)/,    
  /^\/modules\/auth\/login$/,
  /^\/modules\/auth\/signup$/,
  /^\/$/,
  /\.(.*)$/
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((r) => r.test(pathname))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('treko_token')?.value
  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/modules/auth/login'
    return NextResponse.redirect(loginUrl)
  }

  try {
    console.log(process.env.JWT_SECRET)
    // verify against your shared secret
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    return NextResponse.next()
  } catch (err) {
    console.error(err)
    // invalid/expired token → redirect
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/modules/auth/login'
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: '/((?!api/auth/login|_next|static|favicon\\.ico).*)',
}