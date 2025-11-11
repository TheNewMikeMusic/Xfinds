import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { writeProduct, Product } from '@/lib/data'

export async function POST(request: NextRequest) {
  // Check if in development mode
  if (
    process.env.NODE_ENV !== 'development' &&
    !request.headers.get('x-admin-token')
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  try {
    const product: Product = await request.json()

    // Generate ID if not provided
    if (!product.id) {
      product.id = `prod-${Date.now()}`
    }

    // Set createdAt if not provided
    if (!product.createdAt) {
      product.createdAt = new Date().toISOString()
    }

    writeProduct(product)

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

