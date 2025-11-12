import { NextRequest } from 'next/server'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

interface ExchangeRateResponse {
  base: string
  date: string
  rates: Record<string, number>
}

/**
 * GET /api/exchange-rates
 * Fetch exchange rates from free API
 */
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(env.exchangeRateApi, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`)
    }
    
    const data: ExchangeRateResponse = await response.json()
    
    // Transform response to our format
    const exchangeRates = {
      base: data.base,
      timestamp: Date.now(),
      ...data.rates,
    }
    
    return createSuccessResponse(exchangeRates, {
      cache: {
        maxAge: 3600, // Cache for 1 hour
        revalidate: 3600,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch exchange rates', error)
    
    // Return fallback rates (approximate) if API fails
    const fallbackRates = {
      base: 'CNY',
      timestamp: Date.now(),
      USD: 0.14,
      EUR: 0.13,
      GBP: 0.11,
      JPY: 20.0,
      AUD: 0.21,
      CAD: 0.19,
      HKD: 1.09,
      SGD: 0.19,
      KRW: 185.0,
      INR: 11.5,
      THB: 5.0,
      MYR: 0.65,
      PHP: 7.8,
      IDR: 2200.0,
      VND: 3400.0,
      NZD: 0.23,
      CHF: 0.12,
      SEK: 1.45,
      NOK: 1.5,
      DKK: 0.97,
      PLN: 0.56,
      RUB: 12.5,
      BRL: 0.7,
      MXN: 2.4,
      ZAR: 2.6,
    }
    
    // Return fallback with shorter cache since it's not real data
    return createSuccessResponse(fallbackRates, {
      cache: {
        maxAge: 300, // Cache fallback for 5 minutes
      },
    })
  }
}

