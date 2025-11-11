import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/store/cart-store'
import { CartItem } from '@/store/cart-store'

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
  })

  it('should add item to cart', () => {
    const item: CartItem = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      price: 1000,
      shipFee: 100,
      link: 'https://example.com',
    }

    useCartStore.getState().addItem(item)
    const items = useCartStore.getState().items

    expect(items.length).toBe(1)
    expect(items[0]).toEqual(item)
  })

  it('should remove item from cart', () => {
    const item: CartItem = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      price: 1000,
      shipFee: 100,
      link: 'https://example.com',
    }

    useCartStore.getState().addItem(item)
    useCartStore.getState().removeItem('offer-1')
    const items = useCartStore.getState().items

    expect(items.length).toBe(0)
  })

  it('should calculate total correctly', () => {
    const item1: CartItem = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      price: 1000,
      shipFee: 100,
      link: 'https://example.com',
    }

    const item2: CartItem = {
      productId: 'prod-2',
      offerId: 'offer-2',
      agentId: 'agent-2',
      price: 2000,
      shipFee: 200,
      link: 'https://example.com',
    }

    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    const total = useCartStore.getState().getTotal()

    expect(total).toBe(3300) // 1000 + 100 + 2000 + 200
  })

  it('should get item count correctly', () => {
    const item1: CartItem = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      price: 1000,
      shipFee: 100,
      link: 'https://example.com',
    }

    const item2: CartItem = {
      productId: 'prod-2',
      offerId: 'offer-2',
      agentId: 'agent-2',
      price: 2000,
      shipFee: 200,
      link: 'https://example.com',
    }

    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    const count = useCartStore.getState().getItemCount()

    expect(count).toBe(2)
  })

  it('should clear cart', () => {
    const item: CartItem = {
      productId: 'prod-1',
      offerId: 'offer-1',
      agentId: 'agent-1',
      price: 1000,
      shipFee: 100,
      link: 'https://example.com',
    }

    useCartStore.getState().addItem(item)
    useCartStore.getState().clear()
    const items = useCartStore.getState().items

    expect(items.length).toBe(0)
  })
})

