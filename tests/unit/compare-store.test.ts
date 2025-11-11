import { describe, it, expect, beforeEach } from 'vitest'
import { useCompareStore } from '@/store/compare-store'
import { CompareOffer } from '@/store/compare-store'

describe('Compare Store', () => {
  beforeEach(() => {
    useCompareStore.getState().clear()
  })

  it('should add offer to compare', () => {
    const offer: CompareOffer = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      title: 'Test Offer',
      price: 1000,
      shipFee: 100,
      estDays: 5,
      currency: 'CNY',
      link: 'https://example.com',
      inStock: true,
    }

    useCompareStore.getState().addOffer(offer)
    const offers = useCompareStore.getState().offers

    expect(offers.length).toBe(1)
    expect(offers[0]).toEqual(offer)
  })

  it('should not add duplicate offers', () => {
    const offer: CompareOffer = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      title: 'Test Offer',
      price: 1000,
      shipFee: 100,
      estDays: 5,
      currency: 'CNY',
      link: 'https://example.com',
      inStock: true,
    }

    useCompareStore.getState().addOffer(offer)
    useCompareStore.getState().addOffer(offer)
    const offers = useCompareStore.getState().offers

    expect(offers.length).toBe(1)
  })

  it('should remove offer from compare', () => {
    const offer: CompareOffer = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      title: 'Test Offer',
      price: 1000,
      shipFee: 100,
      estDays: 5,
      currency: 'CNY',
      link: 'https://example.com',
      inStock: true,
    }

    useCompareStore.getState().addOffer(offer)
    useCompareStore.getState().removeOffer('offer-1')
    const offers = useCompareStore.getState().offers

    expect(offers.length).toBe(0)
  })

  it('should clear compare list', () => {
    const offer: CompareOffer = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      title: 'Test Offer',
      price: 1000,
      shipFee: 100,
      estDays: 5,
      currency: 'CNY',
      link: 'https://example.com',
      inStock: true,
    }

    useCompareStore.getState().addOffer(offer)
    useCompareStore.getState().clear()
    const offers = useCompareStore.getState().offers

    expect(offers.length).toBe(0)
  })
})

