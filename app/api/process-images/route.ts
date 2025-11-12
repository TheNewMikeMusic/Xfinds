import { NextRequest } from 'next/server'
import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'
import { generateSafeFilename, extractFilenameInfo, createFilenameMapping } from '@/lib/image-utils'
import { createErrorResponse, createSuccessResponse, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'

const PUBLIC_DIR = join(process.cwd(), 'public')
const OUTPUT_DIR = join(PUBLIC_DIR, 'images', 'optimized')
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

interface ProcessImageResult {
  original: string
  optimized: string
  safe: string
  size: {
    original: number
    optimized: number
    reduction: number // percentage
  }
}

/**
 * 处理单张图片
 */
async function processImageFile(
  filePath: string,
  relativePath: string
): Promise<ProcessImageResult> {
  const fileBuffer = await readFile(filePath)
  const originalFilename = basename(filePath)
  const originalSize = fileBuffer.length
  
  // 生成安全文件名
  const safeFilename = generateSafeFilename(fileBuffer, originalFilename)
  
  // 使用 sharp 处理图片
  let processedBuffer: Buffer
  try {
    processedBuffer = await sharp(fileBuffer)
      .webp({ 
        quality: 85,
        effort: 6,
      })
      .toBuffer()
    
    // 如果转换后的文件比原文件大，使用更高质量设置
    if (processedBuffer.length > fileBuffer.length) {
      processedBuffer = await sharp(fileBuffer)
        .webp({ quality: 90, effort: 4 })
        .toBuffer()
    }
  } catch (error) {
    // 如果处理失败，使用原文件
    processedBuffer = fileBuffer
  }
  
  // 确定输出文件名
  const outputFilename = safeFilename.replace(extname(safeFilename), '.webp')
  
  // 确保输出目录存在
  const outputSubDir = dirname(relativePath)
  const finalOutputDir = outputSubDir === '.' 
    ? OUTPUT_DIR 
    : join(OUTPUT_DIR, outputSubDir)
  
  if (!existsSync(finalOutputDir)) {
    await mkdir(finalOutputDir, { recursive: true })
  }
  
  // 写入优化后的文件
  const outputPath = join(finalOutputDir, outputFilename)
  await writeFile(outputPath, processedBuffer)
  
  const optimizedPath = `/images/optimized/${outputSubDir === '.' ? '' : outputSubDir + '/'}${outputFilename}`
  const optimizedSize = processedBuffer.length
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100
  
  return {
    original: relativePath,
    optimized: optimizedPath,
    safe: outputFilename,
    size: {
      original: originalSize,
      optimized: optimizedSize,
      reduction: Math.round(reduction * 100) / 100,
    },
  }
}

/**
 * 扫描目录中的图片文件
 */
async function scanDirectory(dir: string, baseDir: string = PUBLIC_DIR): Promise<string[]> {
  const files: string[] = []
  
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = fullPath.replace(baseDir + '/', '')
      
      // 跳过输出目录
      if (relativePath.startsWith('images/optimized') || 
          relativePath.includes('node_modules')) {
        continue
      }
      
      if (entry.isDirectory()) {
        const subFiles = await scanDirectory(fullPath, baseDir)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        if (SUPPORTED_FORMATS.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error)
  }
  
  return files
}

export async function POST(request: NextRequest) {
  // 检查授权（开发环境或需要管理员token）
  if (!env.isDevelopment && request.headers.get('x-admin-token') !== env.adminToken) {
    return createErrorResponse(
      new AppError('Unauthorized', 403, 'UNAUTHORIZED'),
      'Unauthorized'
    )
  }

  try {
    const body = await request.json()
    const { path: specificPath, scanAll = false } = body

    // 确保输出目录存在
    if (!existsSync(OUTPUT_DIR)) {
      await mkdir(OUTPUT_DIR, { recursive: true })
    }

    let imageFiles: string[] = []

    if (specificPath) {
      // 处理指定路径的图片
      const fullPath = join(PUBLIC_DIR, specificPath)
      if (!existsSync(fullPath)) {
        throw new AppError('File not found', 404, 'FILE_NOT_FOUND')
      }
      imageFiles = [fullPath]
    } else if (scanAll) {
      // 扫描所有图片
      imageFiles = await scanDirectory(PUBLIC_DIR)
    } else {
      throw new AppError('Either path or scanAll must be provided', 400, 'INVALID_REQUEST')
    }

    const results: ProcessImageResult[] = []
    const errors: Array<{ path: string; error: string }> = []

    for (const filePath of imageFiles) {
      try {
        const relativePath = filePath.replace(PUBLIC_DIR + '/', '')
        const result = await processImageFile(filePath, relativePath)
        results.push(result)
      } catch (error) {
        const relativePath = filePath.replace(PUBLIC_DIR + '/', '')
        errors.push({
          path: relativePath,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return createSuccessResponse({
      processed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to process images')
  }
}

export async function GET() {
  // 返回处理统计信息
  try {
    const mappingFile = join(OUTPUT_DIR, 'filename-mapping.json')
    let mapping = {}
    
    if (existsSync(mappingFile)) {
      const content = await readFile(mappingFile, 'utf-8')
      mapping = JSON.parse(content)
    }

    return createSuccessResponse({
      outputDir: OUTPUT_DIR,
      mappingFile,
      mappingCount: Object.keys(mapping).length,
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to get processing info')
  }
}

