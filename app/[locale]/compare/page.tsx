'use client'

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { useCompareStore } from '@/store/compare-store'
import { formatPrice } from '@/lib/currency'
import { CurrencyCode } from '@/store/currency-store'
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Agent, getAgents } from '@/lib/data'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getAgentTrackingUrl, getCleanSiteUrl } from '@/lib/agent-utils'
import { CopyLinkButton } from '@/components/shared/copy-link-button'

export default function ComparePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('compare')
  const { offers, removeOffer, clear } = useCompareStore()
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    // Fetch agents from API (client-side)
    fetch('/api/agents')
      .then((res) => res.json())
      .then(setAgents)
      .catch(() => setAgents([]))
  }, [])

  const getAgent = (agentId: string) => {
    return agents.find((a) => a.id === agentId)
  }

  if (offers.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <EmptyState
            title={t('empty')}
            description={t('emptyDesc')}
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <Button
            variant="outline"
            onClick={clear}
            className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl"
          >
            {t('clear')}
          </Button>
        </div>

        <Card className="glass overflow-x-auto">
          <CardContent className="p-0">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-600/30">
                    <th className="text-left p-4 sticky left-0 bg-gray-800/95 backdrop-blur-xl z-10">
                      {t('agent')}
                    </th>
                    <th className="text-left p-4">{t('price')}</th>
                    <th className="text-left p-4">{t('shipping')}</th>
                    <th className="text-left p-4">{t('estimatedDays')}</th>
                    <th className="text-left p-4">{t('total')}</th>
                    <th className="text-left p-4">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => {
                    const agent = getAgent(offer.agentId)
                    const total = offer.price + offer.shipFee
                    const trackingUrl = agent ? getAgentTrackingUrl(agent, offer.link) : offer.link
                    const cleanUrl = agent ? getCleanSiteUrl(agent) : offer.link

                    return (
                      <tr
                        key={offer.offerId}
                        className="border-b border-blue-600/30 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="p-4 sticky left-0 bg-gray-800/95 backdrop-blur-xl z-10">
                          <div className="flex items-center gap-3">
                            {agent?.logo ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                                <Image
                                  src={agent.logo}
                                  alt={agent.name}
                                  fill
                                  className="object-contain p-1.5"
                                  sizes="40px"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {agent?.name.charAt(0) || '?'}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold truncate">
                                {agent?.name || t('unknownAgent')}
                              </div>
                              {agent?.badges && agent.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {agent.badges.slice(0, 2).map((badge) => (
                                    <Badge
                                      key={badge}
                                      className="text-xs bg-blue-600/20 text-blue-300 border-blue-600/30"
                                    >
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {agent?.promoText && (
                                <div className="text-xs sm:text-sm text-blue-400 mt-1 break-words">
                                  {agent.promoText}
                                </div>
                              )}
                              <div className="text-sm text-gray-400 mt-1 truncate">
                                {offer.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-blue-400">
                            {formatPrice(offer.price, offer.currency as CurrencyCode)}
                          </span>
                        </td>
                        <td className="p-4">
                          {formatPrice(offer.shipFee, offer.currency as CurrencyCode)}
                        </td>
                        <td className="p-4">{offer.estDays} {t('days')}</td>
                        <td className="p-4">
                          <span className="font-bold text-lg">
                            {formatPrice(total, offer.currency as CurrencyCode)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeOffer(offer.offerId)}
                              className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl"
                              aria-label={t('remove')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl"
                            >
                              <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('viewOnAgentSite')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            {agent && (
                              <CopyLinkButton
                                url={cleanUrl}
                                variant="outline"
                                size="icon"
                                className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl"
                                ariaLabel={t('copyLink')}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
