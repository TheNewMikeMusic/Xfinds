import { CurrencyCode, SUPPORTED_CURRENCIES, detectCurrencyFromLocale } from '@/store/currency-store'

/**
 * Convert amount from source currency to target currency
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  exchangeRates: Record<string, number> | null
): number {
  if (fromCurrency === toCurrency) return amount
  if (!exchangeRates) return amount // Return original if no rates available
  
  // Exchange rates are relative to CNY (base currency)
  // Convert to CNY first, then to target currency
  let amountInCNY: number
  
  if (fromCurrency === 'CNY') {
    amountInCNY = amount
  } else {
    const fromRate = exchangeRates[fromCurrency]
    if (!fromRate) return amount // Return original if rate not available
    amountInCNY = amount / fromRate
  }
  
  if (toCurrency === 'CNY') {
    return amountInCNY
  }
  
  const toRate = exchangeRates[toCurrency]
  if (!toRate) return amountInCNY // Return CNY amount if rate not available
  
  return amountInCNY * toRate
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = 'CNY',
  locale?: string
): string {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency)
  if (!currencyInfo) {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }
  
  // Use locale-specific formatting
  const localeMap: Record<CurrencyCode, string> = {
    'CNY': 'zh-CN',
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'AUD': 'en-AU',
    'CAD': 'en-CA',
    'HKD': 'zh-HK',
    'SGD': 'en-SG',
    'KRW': 'ko-KR',
    'INR': 'en-IN',
    'THB': 'th-TH',
    'MYR': 'ms-MY',
    'PHP': 'en-PH',
    'IDR': 'id-ID',
    'VND': 'vi-VN',
    'NZD': 'en-NZ',
    'CHF': 'de-CH',
    'SEK': 'sv-SE',
    'NOK': 'nb-NO',
    'DKK': 'da-DK',
    'PLN': 'pl-PL',
    'RUB': 'ru-RU',
    'BRL': 'pt-BR',
    'MXN': 'es-MX',
    'ZAR': 'en-ZA',
  }
  
  const formatLocale = locale || localeMap[currency] || 'en-US'
  
  return new Intl.NumberFormat(formatLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format price with both original and converted currencies
 */
export function formatPriceWithConversion(
  originalAmount: number,
  originalCurrency: CurrencyCode,
  convertedAmount: number,
  convertedCurrency: CurrencyCode,
  locale?: string
): { original: string; converted: string; display: string } {
  const original = formatPrice(originalAmount, originalCurrency, locale)
  const converted = formatPrice(convertedAmount, convertedCurrency, locale)
  
  // Display format: "¥1,200 (≈ $170)" - converted currency is primary
  const display = `${converted} (≈ ${original})`
  
  return {
    original,
    converted,
    display,
  }
}

/**
 * Get currency name by code
 */
export function getCurrencyName(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.name || code
}

/**
 * Get currency symbol by code
 */
export function getCurrencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code
}

