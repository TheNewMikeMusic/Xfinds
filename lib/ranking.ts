import { ProductOffer, Agent } from '@/lib/data'

export interface RankingWeights {
  priceWeight: number
  shippingWeight: number
  promoWeight: number
  ratingWeight: number
  speedWeight: number
}

export interface RankingResult {
  score: number
  breakdown: {
    priceScore: number
    shippingScore: number
    promoScore: number
    ratingScore: number
    speedScore: number
  }
  reason: string
}

export interface RankedOffer extends ProductOffer {
  rank: number
  score: number
  scoreReason: string
}

const DEFAULT_WEIGHTS: RankingWeights = {
  priceWeight: 0.4,
  shippingWeight: 0.3,
  promoWeight: 0.1,
  ratingWeight: 0.15,
  speedWeight: 0.05,
}

/**
 * Calculate ranking score for an offer (0-100)
 */
export function calculateRankingScore(
  offer: ProductOffer,
  agent: Agent | undefined,
  allOffers: ProductOffer[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): RankingResult {
  // Normalize price score (lower is better)
  const prices = allOffers.map((o) => o.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1
  const priceScore = priceRange > 0 
    ? Math.max(0, 100 - ((offer.price - minPrice) / priceRange) * 100)
    : 100

  // Normalize shipping score (lower is better)
  const shippingCosts = allOffers.map((o) => o.shipFee)
  const minShipping = Math.min(...shippingCosts)
  const maxShipping = Math.max(...shippingCosts)
  const shippingRange = maxShipping - minShipping || 1
  const shippingScore = shippingRange > 0
    ? Math.max(0, 100 - ((offer.shipFee - minShipping) / shippingRange) * 100)
    : 100

  // Promo score (binary: has promo or not)
  const promoScore = agent?.promoText ? 100 : 0

  // Rating score (normalize 0-5 to 0-100)
  const ratingScore = agent ? (agent.rating / 5) * 100 : 50

  // Speed score (fast = 100, standard = 50)
  const speedScore = agent?.speedTag === 'fast' ? 100 : 50

  // Calculate weighted total
  const totalScore =
    priceScore * weights.priceWeight +
    shippingScore * weights.shippingWeight +
    promoScore * weights.promoWeight +
    ratingScore * weights.ratingWeight +
    speedScore * weights.speedWeight

  // Generate reason
  const reasons: string[] = []
  if (priceScore >= 80 && shippingScore >= 80) {
    reasons.push('best_value') // Best value
  }
  if (agent?.speedTag === 'fast' && ratingScore >= 80) {
    reasons.push('fast_delivery') // Fast delivery
  }
  if (promoScore > 0) {
    reasons.push('promo_available') // Promo available
  }
  if (ratingScore >= 90) {
    reasons.push('high_rating') // High rating
  }

  const reason = reasons.length > 0 
    ? reasons[0] // Use first matching reason
    : 'good_option' // Default reason

  return {
    score: Math.round(totalScore),
    breakdown: {
      priceScore: Math.round(priceScore),
      shippingScore: Math.round(shippingScore),
      promoScore: Math.round(promoScore),
      ratingScore: Math.round(ratingScore),
      speedScore: Math.round(speedScore),
    },
    reason,
  }
}

/**
 * Rank offers by score
 */
export function rankOffers(
  offers: ProductOffer[],
  agents: Agent[]
): RankedOffer[] {
  const ranked = offers.map((offer) => {
    const agent = agents.find((a) => a.id === offer.agentId)
    const ranking = calculateRankingScore(offer, agent, offers)
    
    return {
      ...offer,
      rank: 0, // Will be set after sorting
      score: ranking.score,
      scoreReason: ranking.reason,
    }
  })

  // Sort by score (descending) and assign ranks
  ranked.sort((a, b) => b.score - a.score)
  ranked.forEach((offer, index) => {
    offer.rank = index + 1
  })

  return ranked
}

