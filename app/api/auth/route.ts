import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByEmail, createUser, readUsers } from '@/lib/auth'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  const { action, email, password } = await request.json()

  if (action === 'register') {
    // Check if user exists
    if (getUserByEmail(email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = createUser(email, password)

    // Create session
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET)

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  }

  if (action === 'login') {
    const user = getUserByEmail(email)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET)

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  }

  if (action === 'logout') {
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (!session) {
    return NextResponse.json({ user: null })
  }

  try {
    const { payload } = await jwtVerify(session.value, SECRET)
    return NextResponse.json({ user: payload })
  } catch {
    return NextResponse.json({ user: null })
  }
}

