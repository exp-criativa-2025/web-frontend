import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = [
  /^\/_next\//,
  /^\/api\/auth($|\/)/,    
  /^\/login$/,
  /^\/signup$/,
  /^\/$/,
  /\.(.*)$/
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // if (process.env.NODE_ENV === 'development') {
  //   return NextResponse.next()
  // }

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