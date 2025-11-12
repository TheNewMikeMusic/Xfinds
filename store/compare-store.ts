import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductOffer } from '@/lib/data'

export interface CompareOffer extends ProductOffer {
  productId: string
  offerId: string
  agentId: string
}

interface CompareStore {
  offers: CompareOffer[]
  addOffer: (offer: CompareOffer) => void
  removeOffer: (offerId: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      offers: [],
      addOffer: (offer) => {
        set((state) => {
          // Check if offer already exists
          if (state.offers.some((o) => o.offerId === offer.offerId)) {
            return state
          }
          return {
            offers: [...state.offers, offer],
          }
        })
      },
      removeOffer: (offerId) => {
        set((state) => ({
          offers: state.offers.filter((o) => o.offerId !== offerId),
        }))
      },
      clear: () => {
        set({ offers: [] })
      },
    }),
    {
      name: 'xfinds-compare',
      skipHydration: true, // Skip hydration to prevent SSR mismatch
    }
  )
)

