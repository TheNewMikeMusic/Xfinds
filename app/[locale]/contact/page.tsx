import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import { Mail, MessageSquare, HelpCircle, Clock, MapPin, Phone, Shield } from 'lucide-react'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')
  
  const contactMethods = [
    {
      icon: Mail,
      title: t('methods.email.title'),
      description: t('methods.email.description'),
      contact: 'support@xfinds.com',
      link: 'mailto:support@xfinds.com'
    },
    {
      icon: MessageSquare,
      title: t('methods.general.title'),
      description: t('methods.general.description'),
      contact: 'info@xfinds.com',
      link: 'mailto:info@xfinds.com'
    },
    {
      icon: HelpCircle,
      title: t('methods.support.title'),
      description: t('methods.support.description'),
      contact: 'help@xfinds.com',
      link: 'mailto:help@xfinds.com'
    },
    {
      icon: Shield,
      title: t('methods.security.title'),
      description: t('methods.security.description'),
      contact: 'security@xfinds.com',
      link: 'mailto:security@xfinds.com'
    }
  ]
  
  const supportHours = [
    { day: t('hours.monday'), time: '9:00 AM - 6:00 PM' },
    { day: t('hours.tuesday'), time: '9:00 AM - 6:00 PM' },
    { day: t('hours.wednesday'), time: '9:00 AM - 6:00 PM' },
    { day: t('hours.thursday'), time: '9:00 AM - 6:00 PM' },
    { day: t('hours.friday'), time: '9:00 AM - 6:00 PM' },
    { day: t('hours.saturday'), time: '10:00 AM - 4:00 PM' },
    { day: t('hours.sunday'), time: t('hours.closed') }
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

        {/* Contact Methods */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {t('methods.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <Card key={index} className="glass hover:border-blue-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Icon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {method.title}
                          </h3>
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {method.description}
                          </p>
                          <a
                            href={method.link}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2"
                          >
                            {method.contact}
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Support Hours & FAQ */}
        <section className="py-12 md:py-16 px-4 bg-gray-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Support Hours */}
              <Card className="glass">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <Clock className="h-6 w-6 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">
                      {t('hours.title')}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {supportHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
                        <span className="text-gray-300">{schedule.day}</span>
                        <span className="text-gray-400 font-medium">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-6">
                    {t('hours.note')}
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="glass">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <HelpCircle className="h-6 w-6 text-blue-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">
                      {t('faq.title')}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <h3 className="font-semibold text-white mb-2">
                        {t('faq.question1.title')}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {t('faq.question1.answer')}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <h3 className="font-semibold text-white mb-2">
                        {t('faq.question2.title')}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {t('faq.question2.answer')}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <h3 className="font-semibold text-white mb-2">
                        {t('faq.question3.title')}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {t('faq.question3.answer')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <Card className="glass">
              <CardContent className="p-6 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {t('additional.title')}
                </h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {t('additional.response.title')}
                    </h3>
                    <p>
                      {t('additional.response.description')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {t('additional.feedback.title')}
                    </h3>
                    <p>
                      {t('additional.feedback.description')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {t('additional.partnership.title')}
                    </h3>
                    <p>
                      {t('additional.partnership.description')}
                    </p>
                  </div>
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

