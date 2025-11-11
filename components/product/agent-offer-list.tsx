'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductOffer, Agent } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useCompareStore } from '@/store/compare-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getAgentTrackingUrl, getCleanSiteUrl } from '@/lib/agent-utils'
import { CopyLinkButton } from '@/components/shared/copy-link-button'

interface AgentOfferListProps {
  offers: ProductOffer[]
  agents: Agent[]
  productId: string
}

export function AgentOfferList({
  offers,
  agents,
  productId,
}: AgentOfferListProps) {
  const t = useTranslations('product')
  const addToCart = useCartStore((state) => state.addItem)
  const addToCompare = useCompareStore((state) => state.addOffer)

  const getAgent = (agentId: string) => {
    return agents.find((a) => a.id === agentId)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>{t('offers')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {offers.map((offer, index) => {
          const agent = getAgent(offer.agentId)
          const total = offer.price + offer.shipFee
          const trackingUrl = agent ? getAgentTrackingUrl(agent, offer.link) : `${offer.link}?source=xfinds`
          const cleanUrl = agent ? getCleanSiteUrl(agent) : offer.link

          return (
            <div
              key={index}
              className="glass border border-blue-600/30 bg-gray-800/30 backdrop-blur-xl p-4 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
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
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1 truncate">{offer.title}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-gray-400">{agent?.name || offer.agentId}</p>
                      {agent?.badges && agent.badges.length > 0 && (
                        <div className="flex gap-1">
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {offer.inStock ? (
                    <span className="flex items-center gap-1 text-sm text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      {t('inStock')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-red-400">
                      <XCircle className="h-4 w-4" />
                      {t('outOfStock')}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">{t('price')}:</span>
                  <span className="ml-2 font-semibold text-blue-400">
                    {formatPrice(offer.price, offer.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('shipping')}:</span>
                  <span className="ml-2">
                    {formatPrice(offer.shipFee, offer.currency)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('estimatedDays')}:</span>
                  <span className="ml-2">{offer.estDays} {t('days')}</span>
                </div>
                <div>
                  <span className="text-gray-400">{t('total')}:</span>
                  <span className="ml-2 font-bold text-lg">
                    {formatPrice(total, offer.currency)}
                  </span>
                </div>
              </div>

              {agent?.promoText && (
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-2">
                  <p className="text-xs text-blue-300">{agent.promoText}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToCompare({
                      productId,
                      offerId: `${productId}-${index}`,
                      ...offer,
                    })
                  }}
                  className="flex-1 glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl"
                >
                  {t('addToCompare')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    addToCart({
                      productId,
                      offerId: `${productId}-${index}`,
                      ...offer,
                    })
                  }}
                  disabled={!offer.inStock}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                >
                  {t('addToCart')}
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
                    aria-label={t('viewOnAgent')}
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
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
