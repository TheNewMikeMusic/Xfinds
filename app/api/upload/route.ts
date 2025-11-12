import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'
import { createErrorResponse, createSuccessResponse, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { generateSafeFilename, extractFilenameInfo } from '@/lib/image-utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')
const OPTIMIZED_DIR = join(process.cwd(), 'public', 'images', 'optimized', 'uploads')

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

    // Read file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const originalFilename = file.name

    // Validate file extension
    const ext = originalFilename.toLowerCase().substring(originalFilename.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new AppError('Invalid file extension', 400, 'INVALID_EXTENSION')
    }

    // Generate safe filename based on file content hash
    const safeFilename = generateSafeFilename(buffer, originalFilename)
    
    // Ensure directories exist
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
    }
    if (!existsSync(OPTIMIZED_DIR)) {
      await mkdir(OPTIMIZED_DIR, { recursive: true })
    }

    // Save original file (for backup/reference)
    const originalFilepath = join(UPLOADS_DIR, safeFilename)
    await writeFile(originalFilepath, buffer)

    // Process and optimize image
    let optimizedBuffer: Buffer
    let optimizedFilename: string
    let optimizedUrl: string
    
    try {
      // Convert to WebP and compress
      optimizedBuffer = await sharp(buffer)
        .webp({ 
          quality: 85,
          effort: 6,
        })
        .toBuffer()
      
      // If optimized is larger, use better quality
      if (optimizedBuffer.length > buffer.length) {
        optimizedBuffer = await sharp(buffer)
          .webp({ quality: 90, effort: 4 })
          .toBuffer()
      }
      
      optimizedFilename = safeFilename.replace(ext, '.webp')
      const optimizedFilepath = join(OPTIMIZED_DIR, optimizedFilename)
      await writeFile(optimizedFilepath, optimizedBuffer)
      
      optimizedUrl = `/images/optimized/uploads/${optimizedFilename}`
      
      logger.info('Image processed and optimized', {
        original: originalFilename,
        safe: safeFilename,
        optimized: optimizedFilename,
        originalSize: buffer.length,
        optimizedSize: optimizedBuffer.length,
        reduction: `${Math.round(((buffer.length - optimizedBuffer.length) / buffer.length) * 100)}%`,
      })
    } catch (error) {
      // If optimization fails, use original file
      logger.warn('Image optimization failed, using original', { error, filename: originalFilename })
      optimizedUrl = `/uploads/${safeFilename}`
    }

    return createSuccessResponse({
      url: optimizedUrl,
      originalUrl: `/uploads/${safeFilename}`,
      originalFilename,
      safeFilename,
      optimized: optimizedUrl !== `/uploads/${safeFilename}`,
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to upload file')
  }
}

