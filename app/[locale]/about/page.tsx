import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import { Users, Target, Zap, Shield, Globe, Heart } from 'lucide-react'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')
  
  const values = [
    {
      icon: Target,
      title: t('values.innovation.title'),
      description: t('values.innovation.description')
    },
    {
      icon: Users,
      title: t('values.userFirst.title'),
      description: t('values.userFirst.description')
    },
    {
      icon: Shield,
      title: t('values.transparency.title'),
      description: t('values.transparency.description')
    },
    {
      icon: Zap,
      title: t('values.efficiency.title'),
      description: t('values.efficiency.description')
    },
    {
      icon: Globe,
      title: t('values.global.title'),
      description: t('values.global.description')
    },
    {
      icon: Heart,
      title: t('values.excellence.title'),
      description: t('values.excellence.description')
    }
  ]
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-900/20"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <Card className="glass">
              <CardContent className="p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {t('mission.title')}
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                  {t('mission.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-900/50">
          <div className="container mx-auto max-w-5xl">
            <Card className="glass">
              <CardContent className="p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {t('story.title')}
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    {t('story.paragraph1')}
                  </p>
                  <p className="text-lg">
                    {t('story.paragraph2')}
                  </p>
                  <p className="text-lg">
                    {t('story.paragraph3')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {t('values.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="glass hover:border-blue-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Icon className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white ml-4">
                          {value.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-900/50">
          <div className="container mx-auto max-w-5xl">
            <Card className="glass">
              <CardContent className="p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {t('whatWeDo.title')}
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('whatWeDo.productSearch.title')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {t('whatWeDo.productSearch.description')}
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('whatWeDo.priceComparison.title')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {t('whatWeDo.priceComparison.description')}
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('whatWeDo.agentDirectory.title')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {t('whatWeDo.agentDirectory.description')}
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t('whatWeDo.smartTools.title')}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {t('whatWeDo.smartTools.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="glass border-2 border-blue-500/30">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {t('cta.title')}
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t('cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`/${locale}/search`}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                  >
                    {t('cta.exploreProducts')}
                  </a>
                  <a
                    href={`/${locale}/contact`}
                    className="px-8 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 transition-all duration-300"
                  >
                    {t('cta.contactUs')}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

