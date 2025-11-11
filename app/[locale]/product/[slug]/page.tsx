import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { MediaGallery } from '@/components/product/media-gallery'
import { Specs } from '@/components/product/specs'
import { AgentOfferList } from '@/components/product/agent-offer-list'
import {
  getProductBySlug,
  getAgents,
  readCategories,
} from '@/lib/data'
import { notFound } from 'next/navigation'
import { ProductSummary } from '@/components/product/product-summary'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const product = getProductBySlug(slug)
  const agents = getAgents()
  const categories = readCategories()

  if (!product) {
    notFound()
  }

  const category = categories.find((c) => c.id === product.categoryId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <MediaGallery cover={product.cover} gallery={product.gallery} title={product.title} />
          <div className="space-y-6">
            <ProductSummary product={product} category={category} locale={locale} />
            <Specs specs={product.specs} />
          </div>
        </div>

        {/* Agent Offers */}
        <div className="mt-12">
          <AgentOfferList
            offers={product.offers}
            agents={agents}
            productId={product.id}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

