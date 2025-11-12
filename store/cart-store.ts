import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemSKU {
  [key: string]: string // e.g., { "Color": "Black", "Size": "M" }
}

export interface CartItem {
  productId: string
  offerId: string
  agentId: string
  price: number
  shipFee: number
  link: string
  title?: string
  thumbnail?: string
  weight?: number
  volume?: number
  sku?: CartItemSKU // Selected SKU options
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (offerId: string) => void
  updateItemAgent: (offerId: string, newAgentId: string, newPrice: number, newShipFee: number, newLink: string) => void
  clear: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }))
      },
      removeItem: (offerId) => {
        set((state) => ({
          items: state.items.filter((item) => item.offerId !== offerId),
        }))
      },
      updateItemAgent: (offerId, newAgentId, newPrice, newShipFee, newLink) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.offerId === offerId
              ? { ...item, agentId: newAgentId, price: newPrice, shipFee: newShipFee, link: newLink }
              : item
          ),
        }))
      },
      clear: () => {
        set({ items: [] })
      },
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price + item.shipFee,
          0
        )
      },
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'xfinds-cart',
      skipHydration: true, // Skip hydration to prevent SSR mismatch
    }
  )
)

