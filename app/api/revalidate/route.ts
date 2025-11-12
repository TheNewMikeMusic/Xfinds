import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'
import { createErrorResponse, createSuccessResponse, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { invalidateCache } from '@/lib/data'

export async function POST(request: NextRequest) {
  // Check authorization
  if (!env.isDevelopment && request.headers.get('x-admin-token') !== env.adminToken) {
    return createErrorResponse(
      new AppError('Unauthorized', 403, 'UNAUTHORIZED'),
      'Unauthorized'
    )
  }

  try {
    const body = await request.json()
    const { path } = body

    if (path && typeof path === 'string') {
      revalidatePath(path)
    } else {
      revalidatePath('/')
      revalidatePath('/search')
    }

    // Also invalidate data cache
    invalidateCache()

    return createSuccessResponse({ success: true })
  } catch (error) {
    return createErrorResponse(error, 'Failed to revalidate')
  }
}

