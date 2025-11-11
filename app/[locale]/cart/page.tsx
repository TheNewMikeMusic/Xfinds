'use client'

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { ExternalLink, X, ShoppingBag, LinkIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Agent } from '@/lib/data'
import { getAgentTrackingUrl, getCleanSiteUrl } from '@/lib/agent-utils'
import { CopyLinkButton } from '@/components/shared/copy-link-button'

export default function CartPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('cart')
  const { items, removeItem, clear, getTotal } = useCartStore()
  const [openingLinks, setOpeningLinks] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then(setAgents)
      .catch(() => setAgents([]))
  }, [])

  const getAgent = (agentId: string) => {
    return agents.find((a) => a.id === agentId)
  }

  const handleOpenAll = () => {
    setOpeningLinks(true)
    items.forEach((item, index) => {
      setTimeout(() => {
        const agent = getAgent(item.agentId)
        const url = agent ? getAgentTrackingUrl(agent, item.link) : `${item.link}?source=xfinds`
        window.open(url, '_blank', 'noopener,noreferrer')
      }, index * 200) // Stagger opens
    })
    setTimeout(() => setOpeningLinks(false), items.length * 200)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <EmptyState
            title={t('empty')}
            description={t('emptyDesc')}
            action={
              <Button asChild className="mt-4">
                <Link href={`/${locale}/search`}>{t('browseProducts')}</Link>
              </Button>
            }
          />
        </main>
        <Footer />
      </div>
    )
  }

  const total = getTotal()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{t('note')}</p>
            <h1 className="bg-gradient-to-r from-sky-200 via-blue-300 to-violet-400 bg-clip-text text-4xl font-semibold text-transparent">
              {t('title')}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleOpenAll}
              disabled={openingLinks}
              className="btn-ripple rounded-2xl border border-white/15 bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow-[0_18px_35px_rgba(59,130,246,0.35)] hover:shadow-[0_25px_45px_rgba(192,132,252,0.4)]"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('openAll')}
            </Button>
            <Button
              onClick={clear}
              className="btn-ripple rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              {t('clear')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const agent = getAgent(item.agentId)
              const trackingUrl = agent ? getAgentTrackingUrl(agent, item.link) : `${item.link}?source=xfinds`
              const cleanUrl = agent ? getCleanSiteUrl(agent) : item.link

              return (
                <Card key={item.offerId} className="glass border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-4">
                          {agent?.logo ? (
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-200/60 to-violet-200/60 p-2 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                              <Image
                                src={agent.logo}
                                alt={agent.name}
                                fill
                                className="object-contain"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="rounded-2xl bg-white/5 p-3">
                              <ShoppingBag className="h-6 w-6 text-sky-200" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-lg font-semibold text-white">
                              {agent?.name || item.agentId}
                            </p>
                            <p className="truncate text-sm text-slate-400 font-hacker">
                              {t('productId')} · {item.productId}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('price')}</p>
                            <p className="mt-1 font-hacker text-xl text-sky-200">
                              {formatPrice(item.price, 'CNY')}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('shipping')}</p>
                            <p className="mt-1 font-hacker text-xl text-blue-200">
                              {formatPrice(item.shipFee, 'CNY')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-col gap-2 md:w-48">
                        <Button
                          onClick={() => removeItem(item.offerId)}
                          className="btn-ripple rounded-2xl border border-white/10 bg-white/5 py-2 text-sm text-white hover:bg-white/10"
                          aria-label={t('remove')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t('remove')}
                        </Button>
                        <Button
                          asChild
                          className="btn-ripple rounded-2xl bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-300 py-2 text-sm font-semibold text-gray-900 shadow-[0_12px_30px_rgba(245,195,114,0.35)]"
                        >
                          <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('openLink')}
                          </a>
                        </Button>
                        {agent && (
                          <CopyLinkButton
                            url={cleanUrl}
                            variant="outline"
                            size="sm"
                            className="btn-ripple rounded-2xl border border-white/10 bg-white/5 py-2 text-sm text-white hover:bg-white/10"
                            ariaLabel={t('copyLink')}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="glass sticky top-24 border-white/10 bg-gradient-to-br from-[rgba(7,11,20,0.95)] via-[rgba(5,8,15,0.92)] to-[rgba(2,4,8,0.95)]">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{t('summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{t('itemCount')}</span>
                  <span className="font-semibold text-white">{items.length}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>{t('total')}</span>
                    <span className="bg-gradient-to-r from-sky-200 to-violet-300 bg-clip-text text-transparent">
                      {formatPrice(total, 'CNY')}
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <Button
                    onClick={handleOpenAll}
                    disabled={openingLinks}
                    className="btn-ripple w-full rounded-2xl bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 py-3 text-base font-semibold text-gray-900 shadow-[0_18px_35px_rgba(59,130,246,0.35)]"
                  >
                    {openingLinks ? t('opening') : t('openAll')}
                  </Button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-sky-200" />
                    <span>{t('note')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
