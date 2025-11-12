'use client'

import { useEffect, useState } from 'react'
import { useCurrencyStore, CurrencyCode, shouldRefreshRates } from '@/store/currency-store'
import { convertCurrency, formatPriceWithConversion } from '@/lib/currency'

/**
 * Hook to fetch and manage exchange rates
 */
export function useExchangeRates() {
  const { exchangeRates, ratesLastUpdated, setExchangeRates } = useCurrencyStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch if rates are missing or stale
    if (!shouldRefreshRates(ratesLastUpdated)) return

    setIsLoading(true)
    setError(null)

    fetch('/api/exchange-rates')
      .then((res) => res.json())
      .then((data) => {
        setExchangeRates(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch exchange rates:', err)
        setError('Failed to load exchange rates')
        setIsLoading(false)
      })
  }, [ratesLastUpdated, setExchangeRates])

  return { exchangeRates, isLoading, error }
}

/**
 * Hook to convert and format price
 */
export function usePriceDisplay(
  amount: number,
  originalCurrency: CurrencyCode = 'CNY'
) {
  const { selectedCurrency, exchangeRates } = useCurrencyStore()
  const { exchangeRates: rates } = useExchangeRates()

  const ratesToUse = exchangeRates || rates
  // Extract only currency rates (exclude base and timestamp)
  const ratesOnly: Record<string, number> | null = ratesToUse
    ? Object.fromEntries(
        Object.entries(ratesToUse).filter(
          ([key]) => key !== 'base' && key !== 'timestamp'
        )
      ) as Record<string, number>
    : null
  const convertedAmount = convertCurrency(
    amount,
    originalCurrency,
    selectedCurrency,
    ratesOnly
  )

  const formatted = formatPriceWithConversion(
    amount,
    originalCurrency,
    convertedAmount,
    selectedCurrency
  )

  return {
    originalAmount: amount,
    originalCurrency,
    convertedAmount,
    convertedCurrency: selectedCurrency,
    formatted,
    isConverted: originalCurrency !== selectedCurrency,
  }
}

