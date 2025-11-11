'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category, Agent } from '@/lib/data'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { FloatingInput } from '@/components/ui/floating-input'
import { Skeleton } from '@/components/ui/skeleton'

interface FiltersPanelProps {
  categories: Category[]
  agents: Agent[]
  onFilterChange: (filters: {
    categoryId?: string
    agentId?: string
    minPrice?: number
    maxPrice?: number
  }) => void
}

export function FiltersPanel({
  categories,
  agents,
  onFilterChange,
}: FiltersPanelProps) {
  const t = useTranslations('search')
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [mounted, setMounted] = useState(false)
  
  const [categoryId, setCategoryId] = useState<string>('')
  const [agentId, setAgentId] = useState<string>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [priceTouched, setPriceTouched] = useState({ min: false, max: false })

  useEffect(() => {
    setMounted(true)
    if (searchParams) {
      setCategoryId(searchParams.get('cat') || '')
      setAgentId(searchParams.get('agent') || '')
      setMinPrice(searchParams.get('minPrice') || '')
      setMaxPrice(searchParams.get('maxPrice') || '')
    }
  }, [searchParams])

  const updateUrl = (updates: Record<string, string | null>) => {
    if (!mounted || !searchParams) return
    const urlParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        urlParams.delete(key)
      } else {
        urlParams.set(key, value)
      }
    })
    router.push(`/${locale}/search?${urlParams.toString()}`)
  }

  if (!mounted) {
    return (
      <Card className="glass space-y-4">
        <CardHeader>
          <CardTitle>{t('filters')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const hasPriceRange = minPrice !== '' || maxPrice !== ''
  const minValue = Number(minPrice)
  const maxValue = Number(maxPrice)
  const priceRangeInvalid =
    minPrice !== '' && maxPrice !== '' && !Number.isNaN(minValue) && !Number.isNaN(maxValue) && minValue > maxValue
  const priceError = priceRangeInvalid ? t('priceRangeError') : ''
  const priceHint = priceError ? undefined : t('priceRangeHint')

  return (
    <Card className="glass border-blue-600/30 bg-gray-900/80 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
      <CardHeader>
        <CardTitle>{t('filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">{t('category')}</p>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              updateUrl({ cat: value || null })
            }}
          >
            <SelectTrigger
              id="category"
              aria-label={t('category')}
              className="glass w-full rounded-2xl border-blue-600/30 bg-gray-900/70 text-left"
            >
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent className="glass border-blue-600/40 bg-gray-900/95">
              <SelectItem value="">{t('all')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="capitalize">
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">{t('agent')}</p>
          <Select
            value={agentId}
            onValueChange={(value) => {
              setAgentId(value)
              updateUrl({ agent: value || null })
            }}
          >
            <SelectTrigger
              id="agent"
              aria-label={t('agent')}
              className="glass w-full rounded-2xl border-blue-600/30 bg-gray-900/70 text-left"
            >
              <SelectValue placeholder={t('selectAgent')} />
            </SelectTrigger>
            <SelectContent className="glass border-blue-600/40 bg-gray-900/95">
              <SelectItem value="">{t('all')}</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">{t('priceRange')}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FloatingInput
              id="minPrice"
              label={t('minPrice')}
              type="number"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                updateUrl({ minPrice: e.target.value || null })
              }}
              onBlur={() => setPriceTouched((prev) => ({ ...prev, min: true }))}
              state={
                priceError && (priceTouched.min || priceTouched.max)
                  ? 'error'
                  : minPrice
                  ? 'success'
                  : 'default'
              }
              error={
                priceError && (priceTouched.min || priceTouched.max)
                  ? priceError
                  : ''
              }
              hint={!hasPriceRange ? priceHint : undefined}
            />
            <FloatingInput
              id="maxPrice"
              label={t('maxPrice')}
              type="number"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                updateUrl({ maxPrice: e.target.value || null })
              }}
              onBlur={() => setPriceTouched((prev) => ({ ...prev, max: true }))}
              state={
                priceError && (priceTouched.min || priceTouched.max)
                  ? 'error'
                  : maxPrice
                  ? 'success'
                  : 'default'
              }
              error={
                priceError && (priceTouched.min || priceTouched.max)
                  ? priceError
                  : ''
              }
              hint={hasPriceRange && !priceError ? priceHint : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
