import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { AgentCard } from '@/components/agents/agent-card'
import { ProductCard } from '@/components/search/product-card'
import { getAgents, getFeaturedProducts } from '@/lib/data'

const HeroSection = dynamic(
  () => import('@/components/home/hero-section').then((mod) => mod.HeroSection),
  { ssr: false }
)

const CategoryGrid = dynamic(
  () => import('@/components/home/category-grid').then((mod) => mod.CategoryGrid),
  { ssr: false }
)

interface LandingPageProps {
  params: Promise<{ locale: string }>
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const agents = getAgents()
  const featuredProducts = getFeaturedProducts(6)

  const categories = [
    { key: 'categorySneakers', name: t('categorySneakers') },
    { key: 'categoryClothing', name: t('categoryClothing') },
    { key: 'categoryAccessories', name: t('categoryAccessories') },
    { key: 'categoryLuxury', name: t('categoryLuxury') },
  ]

  // Show all 6 agents
  const featuredAgents = agents

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection title={t('title')} subtitle={t('subtitle')} />

        {/* Categories Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('categories')}</h2>
            <CategoryGrid categories={categories} />
          </div>
        </section>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{t('featuredProducts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Agents Section */}
        <section className="py-16 px-4 bg-gray-900/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('featuredAgents')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
