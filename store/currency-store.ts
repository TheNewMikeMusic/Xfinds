import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'HKD' | 'SGD' | 'KRW' | 'INR' | 'THB' | 'MYR' | 'PHP' | 'IDR' | 'VND' | 'NZD' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'RUB' | 'BRL' | 'MXN' | 'ZAR'

export interface Currency {
  code: CurrencyCode
  name: string
  symbol: string
  flag?: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
]

export interface ExchangeRates {
  base: string
  timestamp: number
  // Currency rates indexed by currency code
  [key: string]: string | number // base and timestamp are string/number, rates are number
}

interface CurrencyStore {
  selectedCurrency: CurrencyCode
  exchangeRates: ExchangeRates | null
  ratesLastUpdated: number | null
  shippingAddressCountry: string | null
  autoDetectEnabled: boolean
  setCurrency: (currency: CurrencyCode) => void
  setShippingAddressCountry: (country: string | null) => void
  setExchangeRates: (rates: ExchangeRates) => void
  setAutoDetectEnabled: (enabled: boolean) => void
  getCurrency: () => CurrencyCode
  getCurrencyInfo: () => Currency
}

const DEFAULT_CURRENCY: CurrencyCode = 'CNY'
const RATES_CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: DEFAULT_CURRENCY,
      exchangeRates: null,
      ratesLastUpdated: null,
      shippingAddressCountry: null,
      autoDetectEnabled: true,
      
      setCurrency: (currency) => {
        set({ selectedCurrency: currency, autoDetectEnabled: false })
      },
      
      setShippingAddressCountry: (country) => {
        set({ shippingAddressCountry: country })
        // Auto-detect currency if enabled
        if (get().autoDetectEnabled) {
          const detectedCurrency = detectCurrencyFromCountry(country)
          if (detectedCurrency) {
            set({ selectedCurrency: detectedCurrency })
          }
        }
      },
      
      setExchangeRates: (rates) => {
        set({ 
          exchangeRates: rates,
          ratesLastUpdated: Date.now()
        })
      },
      
      setAutoDetectEnabled: (enabled) => {
        set({ autoDetectEnabled: enabled })
      },
      
      getCurrency: () => {
        return get().selectedCurrency
      },
      
      getCurrencyInfo: () => {
        const code = get().selectedCurrency
        return SUPPORTED_CURRENCIES.find(c => c.code === code) || SUPPORTED_CURRENCIES[0]
      },
    }),
    {
      name: 'xfinds-currency',
      skipHydration: true,
    }
  )
)

/**
 * Detect currency from country code
 */
function detectCurrencyFromCountry(country: string | null): CurrencyCode | null {
  if (!country) return null
  
  const countryToCurrency: Record<string, CurrencyCode> = {
    'US': 'USD',
    'GB': 'GBP',
    'JP': 'JPY',
    'AU': 'AUD',
    'CA': 'CAD',
    'HK': 'HKD',
    'SG': 'SGD',
    'KR': 'KRW',
    'IN': 'INR',
    'TH': 'THB',
    'MY': 'MYR',
    'PH': 'PHP',
    'ID': 'IDR',
    'VN': 'VND',
    'NZ': 'NZD',
    'CH': 'CHF',
    'SE': 'SEK',
    'NO': 'NOK',
    'DK': 'DKK',
    'PL': 'PLN',
    'RU': 'RUB',
    'BR': 'BRL',
    'MX': 'MXN',
    'ZA': 'ZAR',
    'CN': 'CNY',
    // EU countries
    'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR',
    'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR',
    'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'NL': 'EUR',
    'PT': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR',
  }
  
  return countryToCurrency[country.toUpperCase()] || null
}

/**
 * Detect currency from browser locale
 */
export function detectCurrencyFromLocale(): CurrencyCode | null {
  if (typeof window === 'undefined') return null
  
  const locale = navigator.language || (navigator as any).userLanguage
  if (!locale) return null
  
  // Extract country code from locale (e.g., 'en-US' -> 'US')
  const parts = locale.split('-')
  if (parts.length < 2) return null
  
  const countryCode = parts[1].toUpperCase()
  return detectCurrencyFromCountry(countryCode)
}

/**
 * Check if exchange rates need to be refreshed
 */
export function shouldRefreshRates(lastUpdated: number | null): boolean {
  if (!lastUpdated) return true
  return Date.now() - lastUpdated > RATES_CACHE_DURATION
}

