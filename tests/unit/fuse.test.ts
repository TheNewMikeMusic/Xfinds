import { describe, it, expect } from 'vitest'
import { buildFuseIndex, searchProducts } from '@/lib/fuse'
import { Product } from '@/lib/data'

const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'test-product',
    title: 'Air Jordan 1',
    brand: 'Nike',
    categoryId: 'cat-1',
    cover: '/test.jpg',
    gallery: [],
    priceGuide: { min: 1000, max: 1500, currency: 'CNY' },
    tags: ['Jordan', 'Nike', '篮球鞋'],
    specs: {},
    createdAt: '2024-01-01T00:00:00Z',
    offers: [],
  },
  {
    id: '2',
    slug: 'test-product-2',
    title: 'Yeezy Boost',
    brand: 'Adidas',
    categoryId: 'cat-1',
    cover: '/test2.jpg',
    gallery: [],
    priceGuide: { min: 2000, max: 3000, currency: 'CNY' },
    tags: ['Yeezy', 'Adidas'],
    specs: {},
    createdAt: '2024-01-02T00:00:00Z',
    offers: [],
  },
]

describe('Fuse.js Search', () => {
  it('should build index correctly', () => {
    const index = buildFuseIndex(mockProducts)
    expect(index).toBeDefined()
  })

  it('should search by title', () => {
    const results = searchProducts(mockProducts, { query: 'Jordan' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].title).toContain('Jordan')
  })

  it('should search by tags', () => {
    const results = searchProducts(mockProducts, { query: 'Yeezy' })
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].tags).toContain('Yeezy')
  })

  it('should filter by category', () => {
    const results = searchProducts(mockProducts, {
      categoryId: 'cat-1',
    })
    expect(results.length).toBe(2)
  })

  it('should filter by price range', () => {
    const results = searchProducts(mockProducts, {
      minPrice: 500,
      maxPrice: 2500,
    })
    expect(results.length).toBeGreaterThan(0)
    // Check that price ranges overlap with filter range
    results.forEach((product) => {
      // Price range overlaps if min <= filterMax AND max >= filterMin
      expect(product.priceGuide.min).toBeLessThanOrEqual(2500)
      expect(product.priceGuide.max).toBeGreaterThanOrEqual(500)
    })
  })

  it('should sort by price', () => {
    const results = searchProducts(mockProducts, { sort: 'price' })
    expect(results.length).toBe(2)
    expect(results[0].priceGuide.min).toBeLessThanOrEqual(
      results[1].priceGuide.min
    )
  })

  it('should sort by new', () => {
    const results = searchProducts(mockProducts, { sort: 'new' })
    expect(results.length).toBe(2)
    const date1 = new Date(results[0].createdAt).getTime()
    const date2 = new Date(results[1].createdAt).getTime()
    expect(date1).toBeGreaterThanOrEqual(date2)
  })

  it('should return empty array for no matches', () => {
    const results = searchProducts(mockProducts, { query: 'NonExistentProduct' })
    expect(results.length).toBe(0)
  })
})

