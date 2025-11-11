// Compare utilities
export function getCompareTotal(offers: Array<{ price: number; shipFee: number }>): number {
  return offers.reduce((sum, offer) => sum + offer.price + offer.shipFee, 0)
}

