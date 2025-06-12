import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username } = body
    
    if (!username) {
      console.log("Login failed")
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }
    
    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error("JWT_SECRET is not defined")
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const token = jwt.sign({ username }, secret, {
      expiresIn: '6h',
    })
    
    const res = NextResponse.json({status: 200})
    res.cookies.set({
      name: 'treko_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 6,
      path: '/',
      sameSite: 'lax'
    })
    
    return res

  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}