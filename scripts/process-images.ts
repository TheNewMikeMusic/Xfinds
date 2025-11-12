import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'
import { generateSafeFilename, extractFilenameInfo, createFilenameMapping } from '../lib/image-utils'

const PUBLIC_DIR = join(process.cwd(), 'public')
const OUTPUT_DIR = join(PUBLIC_DIR, 'images', 'optimized')
const MAPPING_FILE = join(OUTPUT_DIR, 'filename-mapping.json')

// 支持的图片格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const OUTPUT_FORMAT = 'webp' // 输出格式

interface ProcessResult {
  success: boolean
  original: string
  optimized: string
  error?: string
}

interface ImageMapping {
  [originalPath: string]: {
    safe: string
    hash: string
    optimized: string
    original: string
  }
}

/**
 * 处理单张图片：重命名、转换格式、压缩
 */
async function processImage(
  filePath: string,
  relativePath: string
): Promise<ProcessResult> {
  try {
    // 读取文件
    const fileBuffer = await readFile(filePath)
    const originalFilename = basename(filePath)
    
    // 生成安全文件名
    const safeFilename = generateSafeFilename(fileBuffer, originalFilename)
    
    // 提取文件信息
    const fileInfo = extractFilenameInfo(originalFilename)
    
    // 使用 sharp 处理图片
    let processedBuffer: Buffer
    
    try {
      // 转换为 WebP 格式并压缩
      processedBuffer = await sharp(fileBuffer)
        .webp({ 
          quality: 85, // 质量设置（0-100）
          effort: 6, // 压缩努力程度（0-6，越高压缩越好但越慢）
        })
        .toBuffer()
      
      // 如果转换后的文件比原文件大，使用原文件
      if (processedBuffer.length > fileBuffer.length) {
        // 如果原文件已经是 WebP，直接使用
        if (fileInfo.extension === '.webp') {
          processedBuffer = fileBuffer
        } else {
          // 否则转换为 WebP 但使用更高质量
          processedBuffer = await sharp(fileBuffer)
            .webp({ quality: 90, effort: 4 })
            .toBuffer()
        }
      }
    } catch (error) {
      // 如果处理失败，使用原文件
      console.warn(`Failed to process image ${originalFilename}, using original:`, error)
      processedBuffer = fileBuffer
    }
    
    // 确定输出文件名（使用 WebP 扩展名）
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
    
    // 创建文件名映射
    const mapping = createFilenameMapping(
      originalFilename,
      outputFilename,
      fileBuffer,
      `/images/optimized/${outputSubDir === '.' ? '' : outputSubDir + '/'}${outputFilename}`
    )
    
    return {
      success: true,
      original: relativePath,
      optimized: mapping.path,
    }
  } catch (error) {
    return {
      success: false,
      original: relativePath,
      optimized: '',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * 递归扫描目录中的图片文件
 */
async function scanDirectory(dir: string, baseDir: string = PUBLIC_DIR): Promise<string[]> {
  const files: string[] = []
  
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = fullPath.replace(baseDir + '/', '')
      
      // 跳过输出目录和 node_modules
      if (relativePath.startsWith('images/optimized') || 
          relativePath.includes('node_modules')) {
        continue
      }
      
      if (entry.isDirectory()) {
        // 递归扫描子目录
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

/**
 * 主处理函数
 */
async function main() {
  console.log('开始处理图片...')
  console.log(`输入目录: ${PUBLIC_DIR}`)
  console.log(`输出目录: ${OUTPUT_DIR}`)
  
  // 确保输出目录存在
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true })
  }
  
  // 扫描所有图片文件
  const imageFiles = await scanDirectory(PUBLIC_DIR)
  console.log(`找到 ${imageFiles.length} 张图片`)
  
  // 加载现有的映射文件
  let existingMapping: ImageMapping = {}
  if (existsSync(MAPPING_FILE)) {
    try {
      const mappingContent = await readFile(MAPPING_FILE, 'utf-8')
      existingMapping = JSON.parse(mappingContent)
    } catch (error) {
      console.warn('无法读取现有映射文件，将创建新文件')
    }
  }
  
  // 处理每张图片
  const results: ProcessResult[] = []
  const newMapping: ImageMapping = { ...existingMapping }
  
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(PUBLIC_DIR + '/', '')
    console.log(`处理: ${relativePath}`)
    
    const result = await processImage(filePath, relativePath)
    results.push(result)
    
    if (result.success) {
      newMapping[relativePath] = {
        safe: basename(result.optimized),
        hash: '', // 可以从文件名中提取
        optimized: result.optimized,
        original: result.original,
      }
    }
  }
  
  // 保存映射文件
  await writeFile(MAPPING_FILE, JSON.stringify(newMapping, null, 2), 'utf-8')
  
  // 输出统计信息
  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length
  
  console.log('\n处理完成!')
  console.log(`成功: ${successCount}`)
  console.log(`失败: ${failCount}`)
  console.log(`映射文件: ${MAPPING_FILE}`)
  
  if (failCount > 0) {
    console.log('\n失败的文件:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.original}: ${r.error}`)
    })
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error)
}

export { processImage, scanDirectory, main }

