'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink } from 'lucide-react'
import { Agent } from '@/lib/data'
import Image from 'next/image'
import { RecommendRibbon } from '@/components/shared/recommend-ribbon'
import { CopyLinkButton } from '@/components/shared/copy-link-button'
import { getAgentTrackingUrl, getCleanSiteUrl } from '@/lib/agent-utils'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('agent')
  const trackingUrl = getAgentTrackingUrl(agent)
  const cleanUrl = getCleanSiteUrl(agent)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.01,
            }
      }
      className="group"
    >
      <Card className="glass-card relative overflow-hidden border-blue-600/30 bg-gray-900/75">
        {agent.recommended && <RecommendRibbon />}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-3xl" />
        </div>

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 shadow-[0_15px_35px_rgba(56,189,248,0.35)]">
                {agent.logo ? (
                  <Image
                    src={agent.logo}
                    alt={agent.name}
                    fill
                    className="object-contain p-2"
                    sizes="64px"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">{agent.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="mb-1 truncate text-white">{agent.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 flex-shrink-0 text-amber-300" aria-hidden="true" />
                  <span className="text-sm font-semibold text-amber-200">{agent.rating}</span>
                  <span className="sr-only">
                    {t('rating')} {agent.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-5">
          {agent.promoText && (
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-3 text-sm text-blue-100 shadow-[0_10px_30px_rgba(37,99,235,0.25)]"
            >
              {agent.promoText}
            </motion.div>
          )}

          <div>
            <p className="mb-2 text-sm text-gray-400">{t('speedTag')}</p>
            <Badge variant="outline" className="rounded-full border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">
              {agent.speedTag}
            </Badge>
          </div>

          {agent.badges.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-400">{t('features')}</p>
              <div className="flex flex-wrap gap-2">
                {agent.badges.map((badge) => (
                  <Badge key={badge} className="rounded-full border-blue-500/20 bg-blue-500/15 text-xs text-blue-100">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              asChild
              className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-4 py-3 text-base font-semibold text-white shadow-[0_15px_45px_rgba(14,165,233,0.35)]"
            >
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer" aria-label={t('enter')}>
                <span>{t('enter')}</span>
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <CopyLinkButton
              url={cleanUrl}
              variant="outline"
              size="icon"
              className="glass rounded-2xl border-blue-500/30 bg-gray-900/60"
              ariaLabel={t('copyLink')}
            />
          </div>
        </CardContent>
      </Card>
    </motion.article>
  )
}
