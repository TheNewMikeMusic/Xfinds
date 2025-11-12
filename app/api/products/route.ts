import { NextRequest } from 'next/server'
import { writeProduct, Product, readProducts } from '@/lib/data'
import { createErrorResponse, createSuccessResponse, validateRequestBodySize, AppError } from '@/lib/api-utils'
import { env } from '@/lib/env'
import { z } from 'zod'

// Product schema for validation
const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  brand: z.string().min(1),
  categoryId: z.string().min(1),
  cover: z.string().url(),
  gallery: z.array(z.string().url()),
  priceGuide: z.object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
    currency: z.string().length(3),
  }),
  tags: z.array(z.string()),
  description: z.string().optional(),
  specs: z.record(z.string().optional()),
  skuOptions: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).optional(),
  createdAt: z.string().optional(),
  offers: z.array(z.object({
    agentId: z.string(),
    title: z.string(),
    price: z.number().nonnegative(),
    shipFee: z.number().nonnegative(),
    estDays: z.number().int().nonnegative(),
    currency: z.string().length(3),
    link: z.string().url(),
    inStock: z.boolean(),
  })),
})

const MAX_REQUEST_SIZE = 1024 * 1024 // 1MB

export async function GET() {
  try {
    const products = readProducts()
    return createSuccessResponse(products, {
      cache: {
        maxAge: 300, // Cache for 5 minutes
        revalidate: 600, // Revalidate every 10 minutes
      },
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to read products')
  }
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
    // Read and validate request body size
    const body = await request.text()
    validateRequestBodySize(body, MAX_REQUEST_SIZE)

    // Parse and validate JSON
    let productData: unknown
    try {
      productData = JSON.parse(body)
    } catch {
      throw new AppError('Invalid JSON', 400, 'INVALID_JSON')
    }

    // Validate product data
    const validationResult = productSchema.safeParse(productData)
    if (!validationResult.success) {
      throw new AppError(
        `Validation failed: ${validationResult.error.errors[0]?.message || 'Invalid product data'}`,
        400,
        'VALIDATION_ERROR'
      )
    }

    let product: Product = validationResult.data as Product

    // Generate ID if not provided
    if (!product.id) {
      product = { ...product, id: `prod-${Date.now()}` }
    }

    // Set createdAt if not provided
    if (!product.createdAt) {
      product.createdAt = new Date().toISOString()
    }

    writeProduct(product)

    return createSuccessResponse({ success: true, product })
  } catch (error) {
    return createErrorResponse(error, 'Failed to create product')
  }
}

