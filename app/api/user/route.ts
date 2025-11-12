import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getUserById, updateUser } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, validateRequestBodySize, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { z } from 'zod'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

const SECRET = new TextEncoder().encode(env.jwtSecret)

const MAX_REQUEST_SIZE = 10 * 1024 // 10KB

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
})

async function getCurrentUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (!session) {
    return null
  }

  try {
    const { payload } = await jwtVerify(session.value, SECRET)
    return payload as { userId: string; email: string; emailVerified: boolean }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userPayload = await getCurrentUser()

    if (!userPayload) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const user = getUserById(userPayload.userId)
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user
    return createSuccessResponse({ user: userWithoutPassword })
  } catch (error) {
    return createErrorResponse(error, 'Failed to get user')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userPayload = await getCurrentUser()

    if (!userPayload) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

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
    const validationResult = updateUserSchema.safeParse(requestData)
    if (!validationResult.success) {
      throw new AppError(
        `Validation failed: ${validationResult.error.errors[0]?.message || 'Invalid request data'}`,
        400,
        'VALIDATION_ERROR'
      )
    }

    const { name } = validationResult.data

    const updatedUser = updateUser(userPayload.userId, { name })

    if (!updatedUser) {
      throw new AppError('Failed to update user', 500, 'UPDATE_FAILED')
    }

    const { password, ...userWithoutPassword } = updatedUser
    return createSuccessResponse({ user: userWithoutPassword })
  } catch (error) {
    return createErrorResponse(error, 'Failed to update user')
  }
}

