'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardProps {
  product: Product
  locale?: string
}

const BLUR_DATA_URL =
  "data:image/svg+xml,%3Csvg%20width%3D'400'%20height%3D'400'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'grad'%20x1%3D'0%25'%20x2%3D'100%25'%20y1%3D'0%25'%20y2%3D'100%25'%3E%3Cstop%20offset%3D'0%25'%20stop-color%3D'%230b1220'/%3E%3Cstop%20offset%3D'60%25'%20stop-color%3D'%2320345c'/%3E%3Cstop%20offset%3D'100%25'%20stop-color%3D'%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20fill%3D'url(%23grad)'%20width%3D'400'%20height%3D'400'/%3E%3C/svg%3E"

export function ProductCard({ product, locale }: ProductCardProps) {
  const params = useParams()
  const currentLocale = locale || (params?.locale as string) || 'en'
  const t = useTranslations('search')
  const minPrice = product.priceGuide.min
  const currency = product.priceGuide.currency
  const shouldReduceMotion = useReducedMotion()
  const isDeal = product.tags.some((tag) => /sale|deal|特价|限时/i.test(tag))

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.45, ease: 'easeOut' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -8,
              scale: 1.01,
              transition: { duration: 0.35, ease: 'easeOut' },
            }
      }
    >
      <Link href={`/${currentLocale}/product/${product.slug}`} className="group block rounded-3xl focus-ring">
        <Card className="glass-card overflow-hidden rounded-3xl border-blue-600/20 p-0 focus-ring">
          <div className="relative aspect-square overflow-hidden rounded-[1.8rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Image
              src={product.cover || '/placeholder.jpg'}
              alt={product.title}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-blue-200">
              {product.title}
            </h3>
            <p className="mb-3 text-sm text-gray-400">{product.brand}</p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xl font-bold text-blue-300 ${isDeal ? 'animate-[priceFlash_1.8s_ease-in-out_infinite]' : ''}`}
              >
                {formatPrice(minPrice, currency)}
              </span>
              <span className="text-xs text-gray-500">
                {t('offers', { count: product.offers.length })}
              </span>
            </div>
            {product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-blue-500/30 px-3 py-1 text-xs text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card space-y-4">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}
