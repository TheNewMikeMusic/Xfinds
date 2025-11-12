import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Product pages
  try {
    const products = getProducts()
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    routes.push(...productRoutes)
  } catch (error) {
    console.error('Failed to generate product sitemap entries:', error)
  }

  // Category pages
  try {
    const categories = getCategories()
    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/search?category=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
    routes.push(...categoryRoutes)
  } catch (error) {
    console.error('Failed to generate category sitemap entries:', error)
  }

  return routes
}

