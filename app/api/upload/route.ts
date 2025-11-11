import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  // Check if in development mode
  if (
    process.env.NODE_ENV !== 'development' &&
    !request.headers.get('x-admin-token')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name}`
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const filepath = join(uploadsDir, filename)

    // Ensure directory exists
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ url })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

