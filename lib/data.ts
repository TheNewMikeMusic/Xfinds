import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')

export type AgentId = 'kakobuy' | 'mulebuy' | 'hipobuy' | 'rizzitgo' | 'eastmallbuy' | 'tigbuy'

export interface Agent {
  id: AgentId
  name: string
  slug: string
  rating: number
  badges: string[]
  speedTag: string
  logo: string
  siteUrl: string
  promoText?: string
  recommended?: boolean
  notes?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface ProductOffer {
  agentId: string
  title: string
  price: number
  shipFee: number
  estDays: number
  currency: string
  link: string
  inStock: boolean
}

export interface Product {
  id: string
  slug: string
  title: string
  brand: string
  categoryId: string
  cover: string
  gallery: string[]
  priceGuide: {
    min: number
    max: number
    currency: string
  }
  tags: string[]
  description?: string
  specs: {
    size?: string
    color?: string
    material?: string
  }
  createdAt: string
  offers: ProductOffer[]
}

export function readAgents(): Agent[] {
  const filePath = join(DATA_DIR, 'agents.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

let agentsCache: Agent[] | null = null

export function getAgents(): Agent[] {
  if (!agentsCache) {
    agentsCache = readAgents()
  }
  return agentsCache
}

export function readCategories(): Category[] {
  const filePath = join(DATA_DIR, 'categories.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

export function readProducts(): Product[] {
  const filePath = join(DATA_DIR, 'products.json')
  const fileContents = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContents)
}

export function getProductBySlug(slug: string): Product | null {
  const products = readProducts()
  return products.find((p) => p.slug === slug) || null
}

export function getAgentById(id: string): Agent | null {
  const agents = readAgents()
  return agents.find((a) => a.id === id) || null
}

export function getCategoryById(id: string): Category | null {
  const categories = readCategories()
  return categories.find((c) => c.id === id) || null
}

export function getFeaturedProducts(limit: number = 6): Product[] {
  const products = readProducts()
  return products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Development-only write functions
export function writeProduct(product: Product): void {
  if (process.env.NODE_ENV !== 'development' && !process.env.ADMIN_TOKEN) {
    throw new Error('Product creation is only allowed in development mode')
  }

  const filePath = join(DATA_DIR, 'products.json')
  const products = readProducts()
  products.push(product)
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')
}

export function writeProducts(products: Product[]): void {
  if (process.env.NODE_ENV !== 'development' && !process.env.ADMIN_TOKEN) {
    throw new Error('Product modification is only allowed in development mode')
  }

  const filePath = join(DATA_DIR, 'products.json')
  writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')
}

