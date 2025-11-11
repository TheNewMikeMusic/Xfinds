import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  offerId: string
  agentId: string
  price: number
  shipFee: number
  link: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (offerId: string) => void
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
    }
  )
)

