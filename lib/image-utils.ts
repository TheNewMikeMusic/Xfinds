import { createHash } from 'crypto'
import { extname, basename } from 'path'

/**
 * 基于文件内容生成安全的文件名（使用哈希）
 * @param fileBuffer 文件内容缓冲区
 * @param originalFilename 原始文件名（用于提取扩展名）
 * @returns 安全文件名，格式：{hash}.{ext}
 */
export function generateSafeFilename(fileBuffer: Buffer, originalFilename: string): string {
  // 生成文件内容的 SHA-256 哈希
  const hash = createHash('sha256').update(fileBuffer).digest('hex')
  
  // 提取原始文件扩展名
  const ext = extname(originalFilename).toLowerCase() || '.jpg'
  
  // 使用前16位哈希 + 扩展名
  return `${hash.substring(0, 16)}${ext}`
}

/**
 * URL编码图片路径（处理中文等特殊字符）
 * @param path 图片路径
 * @returns URL编码后的路径
 */
export function encodeImagePath(path: string): string {
  // 分离路径和文件名
  const parts = path.split('/')
  const encodedParts = parts.map((part, index) => {
    // 路径部分保持原样，文件名部分编码
    if (index === parts.length - 1) {
      // 文件名部分：编码非ASCII字符
      return encodeURIComponent(part)
    }
    return part
  })
  return encodedParts.join('/')
}

/**
 * URL解码图片路径
 * @param path 编码后的图片路径
 * @returns 解码后的路径
 */
export function decodeImagePath(path: string): string {
  const parts = path.split('/')
  const decodedParts = parts.map((part, index) => {
    if (index === parts.length - 1) {
      return decodeURIComponent(part)
    }
    return part
  })
  return decodedParts.join('/')
}

/**
 * 从原始文件名提取有意义的部分（用于匹配商品）
 * 保留文件名中的关键信息，去除特殊字符
 */
export function extractFilenameInfo(originalFilename: string): {
  name: string
  extension: string
  safeName: string
} {
  const ext = extname(originalFilename)
  const nameWithoutExt = basename(originalFilename, ext)
  
  // 移除特殊字符，保留中文、字母、数字、连字符、下划线
  const safeName = nameWithoutExt.replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '')
  
  return {
    name: nameWithoutExt,
    extension: ext.toLowerCase(),
    safeName: safeName || 'image',
  }
}

/**
 * 检查文件名是否包含中文字符
 */
export function containsChinese(filename: string): boolean {
  return /[\u4e00-\u9fa5]/.test(filename)
}

/**
 * 生成文件名映射信息（用于追踪原始文件名）
 */
export interface FilenameMapping {
  original: string
  safe: string
  hash: string
  path: string
}

export function createFilenameMapping(
  originalFilename: string,
  safeFilename: string,
  fileBuffer: Buffer,
  outputPath: string
): FilenameMapping {
  const hash = createHash('sha256').update(fileBuffer).digest('hex')
  return {
    original: originalFilename,
    safe: safeFilename,
    hash: hash,
    path: outputPath,
  }
}

