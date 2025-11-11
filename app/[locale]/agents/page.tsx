import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { AgentCard } from '@/components/agents/agent-card'
import { getAgents } from '@/lib/data'

interface AgentsPageProps {
  params: Promise<{ locale: string }>
}

export default async function AgentsPage({ params }: AgentsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('agents')
  const agents = getAgents()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-400">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
