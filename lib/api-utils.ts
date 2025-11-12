/**
 * API utility functions for error handling and response formatting
 */

import { NextResponse } from 'next/server'
import { logger } from './logger'
import { env } from './env'

export interface ApiError {
  message: string
  statusCode: number
  code?: string
}

export class AppError extends Error {
  statusCode: number
  code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'AppError'
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = 'An error occurred',
  defaultStatusCode: number = 500
): NextResponse {
  let message = defaultMessage
  let statusCode = defaultStatusCode
  let code: string | undefined

  if (error instanceof AppError) {
    message = error.message
    statusCode = error.statusCode
    code = error.code
  } else if (error instanceof Error) {
    message = error.message
  }

  // Log error for debugging (sanitized in production)
  logger.error('API Error', error, { statusCode, code })

  // In production, don't expose detailed error messages
  const responseMessage = env.isProduction && statusCode >= 500 
    ? 'Internal server error' 
    : message

  return NextResponse.json(
    {
      error: responseMessage,
      ...(code && { code }),
      ...(env.isDevelopment && { details: error instanceof Error ? error.stack : String(error) }),
    },
    { status: statusCode }
  )
}

/**
 * Validates request body size
 */
export function validateRequestBodySize(body: string, maxSize: number = 1024 * 1024): void {
  const size = Buffer.byteLength(body, 'utf8')
  if (size > maxSize) {
    throw new AppError('Request body too large', 413, 'REQUEST_TOO_LARGE')
  }
}

/**
 * Creates a success response with optional caching
 */
export function createSuccessResponse<T>(
  data: T,
  options?: {
    status?: number
    cache?: {
      maxAge?: number
      revalidate?: number
    }
  }
): NextResponse {
  const response = NextResponse.json(data, { status: options?.status || 200 })

  if (options?.cache) {
    const { maxAge, revalidate } = options.cache
    if (maxAge) {
      response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`)
    }
    if (revalidate) {
      response.headers.set('Cache-Control', `public, s-maxage=${revalidate}, stale-while-revalidate=60`)
    }
  }

  return response
}

