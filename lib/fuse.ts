import Fuse from 'fuse.js'
import { Product } from './data'

export interface SearchOptions {
  query?: string
  categoryId?: string
  agentId?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'relevance' | 'price' | 'new'
}

export function buildFuseIndex(products: Product[]): Fuse<Product> {
  return new Fuse(products, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
      { name: 'brand', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
}

export function searchProducts(
  products: Product[],
  options: SearchOptions
): Product[] {
  let results = products

  // Text search
  if (options.query) {
    const fuse = buildFuseIndex(products)
    const fuseResults = fuse.search(options.query)
    results = fuseResults.map((result) => result.item)
  }

  // Category filter
  if (options.categoryId) {
    results = results.filter((p) => p.categoryId === options.categoryId)
  }

  // Agent filter
  if (options.agentId) {
    results = results.filter((p) =>
      p.offers.some((offer) => offer.agentId === options.agentId)
    )
  }

  // Price filter
  if (options.minPrice !== undefined) {
    results = results.filter((p) => p.priceGuide.max >= options.minPrice!)
  }
  if (options.maxPrice !== undefined) {
    results = results.filter((p) => p.priceGuide.min <= options.maxPrice!)
  }

  // Sort
  switch (options.sort) {
    case 'price':
      results.sort((a, b) => a.priceGuide.min - b.priceGuide.min)
      break
    case 'new':
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      break
    case 'relevance':
    default:
      // Relevance is already handled by Fuse.js scoring
      break
  }

  return results
}

