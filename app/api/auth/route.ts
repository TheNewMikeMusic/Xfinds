import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import {
  getUserByEmail,
  createUser,
  verifyPassword,
  generateNewVerificationToken,
} from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { SignJWT, jwtVerify } from 'jose'
import { createErrorResponse, createSuccessResponse, validateRequestBodySize, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const SECRET = new TextEncoder().encode(env.jwtSecret)

const MAX_REQUEST_SIZE = 10 * 1024 // 10KB

// Validation schemas
const emailSchema = z.string().email().max(255)
const passwordSchema = z.string().min(8).max(128)
const nameSchema = z.string().min(1).max(100).optional()

const registerSchema = z.object({
  action: z.literal('register'),
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

const loginSchema = z.object({
  action: z.literal('login'),
  email: emailSchema,
  password: passwordSchema,
})

const resendVerificationSchema = z.object({
  action: z.literal('resend-verification'),
  email: emailSchema,
})

const logoutSchema = z.object({
  action: z.literal('logout'),
})

const authSchema = z.discriminatedUnion('action', [
  registerSchema,
  loginSchema,
  resendVerificationSchema,
  logoutSchema,
])

export async function POST(request: NextRequest) {
  try {
    // Validate request body size
    const body = await request.text()
    validateRequestBodySize(body, MAX_REQUEST_SIZE)

    // Parse and validate JSON
    let requestData: unknown
    try {
      requestData = JSON.parse(body)
    } catch {
      throw new AppError('Invalid JSON', 400, 'INVALID_JSON')
    }

    // Validate request data
    const validationResult = authSchema.safeParse(requestData)
    if (!validationResult.success) {
      throw new AppError(
        `Validation failed: ${validationResult.error.errors[0]?.message || 'Invalid request data'}`,
        400,
        'VALIDATION_ERROR'
      )
    }

    const { action } = validationResult.data

    if (action === 'register') {
      const { email, password, name } = validationResult.data

      // Check if user exists
      if (getUserByEmail(email)) {
        throw new AppError('User already exists', 400, 'USER_EXISTS')
      }

      // Create user (with hashed password and verification token)
      const user = createUser(email, password, name)

      // Send verification email (demo mode: outputs to console)
      if (user.emailVerificationToken) {
        await sendVerificationEmail(user.email, user.emailVerificationToken)
      }

      // Create session
      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(SECRET)

      const cookieStore = await cookies()
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      // Don't return verificationToken in production
      const userResponse: {
        id: string
        email: string
        emailVerified: boolean
        verificationToken?: string
      } = {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      }

      if (env.isDevelopment && user.emailVerificationToken) {
        userResponse.verificationToken = user.emailVerificationToken
      }

      return createSuccessResponse({
        success: true,
        user: userResponse,
      })
    }

    if (action === 'login') {
      const { email, password } = validationResult.data

      const user = getUserByEmail(email)

      if (!user) {
        // Use generic error message to prevent user enumeration
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
      }

      // Verify password using bcrypt
      if (!verifyPassword(password, user.password)) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
      }

      // Create session
      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(SECRET)

      const cookieStore = await cookies()
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return createSuccessResponse({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      })
    }

    if (action === 'resend-verification') {
      const { email } = validationResult.data

      const user = getUserByEmail(email)
      if (!user) {
        // Don't reveal if user exists to prevent enumeration
        return createSuccessResponse({ success: true })
      }

      if (user.emailVerified) {
        throw new AppError('Email already verified', 400, 'ALREADY_VERIFIED')
      }

      const token = generateNewVerificationToken(email)
      if (token) {
        await sendVerificationEmail(email, token)
        const response: { success: boolean; verificationToken?: string } = { success: true }
        // Only return token in development
        if (env.isDevelopment) {
          response.verificationToken = token
        }
        return createSuccessResponse(response)
      }

      throw new AppError('Failed to generate token', 500, 'TOKEN_GENERATION_FAILED')
    }

    if (action === 'logout') {
      const cookieStore = await cookies()
      cookieStore.delete('session')

      return createSuccessResponse({ success: true })
    }

    throw new AppError('Invalid action', 400, 'INVALID_ACTION')
  } catch (error) {
    return createErrorResponse(error, 'Authentication failed')
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (!session) {
      return createSuccessResponse({ user: null })
    }

    try {
      const { payload } = await jwtVerify(session.value, SECRET)
      return createSuccessResponse({ user: payload })
    } catch (error) {
      logger.warn('Invalid session token', { error })
      return createSuccessResponse({ user: null })
    }
  } catch (error) {
    return createErrorResponse(error, 'Failed to get session')
  }
}

