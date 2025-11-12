import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { createErrorResponse, createSuccessResponse, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Sanitizes filename to prevent path traversal attacks
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  const sanitized = filename
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow alphanumeric, dots, underscores, hyphens
    .substring(0, 255) // Limit length
  
  // Ensure it has a valid extension
  const ext = sanitized.toLowerCase().substring(sanitized.lastIndexOf('.'))
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new AppError('Invalid file extension', 400, 'INVALID_EXTENSION')
  }
  
  return sanitized
}

export async function POST(request: NextRequest) {
  // Check authorization
  if (!env.isDevelopment && request.headers.get('x-admin-token') !== env.adminToken) {
    return createErrorResponse(
      new AppError('Unauthorized', 403, 'UNAUTHORIZED'),
      'Unauthorized'
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      throw new AppError('No file provided', 400, 'NO_FILE')
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        413,
        'FILE_TOO_LARGE'
      )
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new AppError(
        'Invalid file type. Only images are allowed',
        400,
        'INVALID_FILE_TYPE'
      )
    }

    // Validate file extension
    const originalFilename = file.name
    const sanitizedFilename = sanitizeFilename(originalFilename)

    // Read file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate safe filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${sanitizedFilename}`
    const filepath = join(uploadsDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    logger.info('File uploaded successfully', { filename, size: file.size })

    return createSuccessResponse({ url })
  } catch (error) {
    return createErrorResponse(error, 'Failed to upload file')
  }
}

