import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import { env } from '@/lib/env'

const SECRET = new TextEncoder().encode(env.jwtSecret)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=missing-token', request.url))
  }

  const user = verifyEmailToken(token)

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login?error=invalid-token', request.url))
  }

  // Create session for verified user
  const jwtToken = await new SignJWT({
    userId: user.id,
    email: user.email,
    emailVerified: true,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)

  const cookieStore = await cookies()
  cookieStore.set('session', jwtToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  // Redirect to dashboard or home
  return NextResponse.redirect(new URL('/dashboard?verified=true', request.url))
}

