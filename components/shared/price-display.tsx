'use client'

import { CurrencyCode } from '@/store/currency-store'
import { usePriceDisplay } from '@/hooks/use-currency'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  amount: number
  originalCurrency?: CurrencyCode
  className?: string
  showOriginal?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({
  amount,
  originalCurrency = 'CNY',
  className,
  showOriginal = true,
  size = 'md',
}: PriceDisplayProps) {
  const t = useTranslations('currency')
  const { formatted, isConverted } = usePriceDisplay(amount, originalCurrency)

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  if (!isConverted || !showOriginal) {
    return (
      <span className={cn('font-semibold', sizeClasses[size], className)}>
        {formatted.converted}
      </span>
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn('font-semibold text-white', sizeClasses[size])}>
        {formatted.converted}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">
        {t('convertedFrom')} {formatted.original}
      </span>
    </div>
  )
}

