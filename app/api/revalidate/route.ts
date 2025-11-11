import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Check if in development mode
  if (
    process.env.NODE_ENV !== 'development' &&
    !request.headers.get('x-admin-token')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { path } = await request.json()

    if (path) {
      revalidatePath(path)
    } else {
      revalidatePath('/')
      revalidatePath('/search')
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to revalidate' },
      { status: 500 }
    )
  }
}

