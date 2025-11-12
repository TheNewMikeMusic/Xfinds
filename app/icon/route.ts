import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * Route handler for /icon.svg
 * Serves the SVG file directly without any processing
 */
export async function GET(request: NextRequest) {
  try {
    // Try app/icon.svg first
    const iconPath = join(process.cwd(), 'app', 'icon.svg')
    const iconContent = await readFile(iconPath, 'utf-8')
    
    return new NextResponse(iconContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving icon.svg:', error)
    // Return a simple fallback SVG
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#3b82f6"/></svg>`
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}

