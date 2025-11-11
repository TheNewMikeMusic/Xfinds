'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Product, Category } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

interface ProductSummaryProps {
  product: Product
  category?: Category
  locale: string
}

export function ProductSummary({ product, category, locale }: ProductSummaryProps) {
  const t = useTranslations('product')
  const shouldReduceMotion = useReducedMotion()

  const minPrice = formatPrice(product.priceGuide.min, product.priceGuide.currency)
  const maxPrice = formatPrice(product.priceGuide.max, product.priceGuide.currency)

  const statItems = [
    { label: t('priceMinLabel'), value: minPrice },
    { label: t('priceMaxLabel'), value: maxPrice },
    {
      label: t('offerCountLabel', { count: product.offers.length }),
      value: t('offers', { count: product.offers.length }),
    },
  ]

  return (
    <motion.section
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass relative overflow-hidden rounded-3xl border-white/10 bg-gradient-to-br from-[rgba(8,13,28,0.95)] via-[rgba(7,11,24,0.9)] to-[rgba(4,6,12,0.95)] p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(125,211,252,0.35), transparent 50%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.25), transparent 55%)',
        }}
      />
      <div className="relative space-y-6">
        {category && (
          <Link
            href={`/${locale}/search?cat=${category.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-100 transition-colors hover:border-white/40"
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </Link>
        )}

        <div>
          <motion.h1
            className="mb-2 text-4xl font-semibold text-white md:text-5xl"
            initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
          >
            {product.title}
          </motion.h1>
          <p className="text-xl text-gray-400 mb-4">{product.brand}</p>
          {product.description && (
            <motion.p
              className="text-gray-300 leading-relaxed mb-6"
              initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              {product.description}
            </motion.p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/15 via-transparent to-fuchsia-400/15 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">{t('price')}</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-bold text-white">{minPrice}</span>
              <span className="text-xl text-gray-300">— {maxPrice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {product.tags.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">{t('tagsTitle')}</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-cyan-100 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {category && (
          <Button
            asChild
            variant="ghost"
            className="btn-ripple group flex items-center gap-3 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-cyan-100 hover:bg-white/5"
          >
            <Link href={`/${locale}/search?cat=${category.id}`}>
              {t('viewCategory')}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        )}
      </div>
    </motion.section>
  )
}
