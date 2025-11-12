import { CartItem } from '@/store/cart-store'
import { Agent, Product } from '@/lib/data'
import { AgentGroup, groupCartItemsByAgent, calculateCartTotal } from './cart-utils'

export interface Suggestion {
  id: string
  type: 'agent_switch' | 'split_parcel' | 'promo_optimization'
  title: string
  reason: string
  before: {
    agentId: string
    shippingCost: number
    totalCost: number
  }
  after: {
    agentId: string
    shippingCost: number
    totalCost: number
  }
  savings: number
  affectedItems: string[]
}

/**
 * Generate savings suggestions for cart optimization
 */
export function generateSuggestions(
  items: CartItem[],
  agents: Agent[],
  products: Product[] = []
): Suggestion[] {
  if (items.length === 0) return []

  const suggestions: Suggestion[] = []
  const currentGroups = groupCartItemsByAgent(items, agents)
  const currentTotal = calculateCartTotal(currentGroups)

  // Helper function to get product for an item
  const getProductForItem = (item: CartItem): Product | null => {
    return products.find((p) => p.id === item.productId) || null
  }

  // Suggestion 1: Check for promo optimization
  agents.forEach((agent) => {
    if (!agent.promoText) return

    // Find items that could benefit from this agent's promo
    items.forEach((item) => {
      if (item.agentId === agent.id) return // Already using this agent

      // Check if this agent has an offer for this product
      const product = getProductForItem(item)
      if (!product) return
      const agentOffer = product.offers.find((o) => o.agentId === agent.id)
      if (!agentOffer) return // Agent doesn't have this product

      // Calculate potential savings (simplified: assume 10% discount from promo)
      const potentialSavings = item.price * 0.1
      if (potentialSavings > 5) {
        // Only suggest if savings > 5 CNY
        const newItems = items.map((i) =>
          i.offerId === item.offerId
            ? { ...i, agentId: agent.id, price: agentOffer.price, shipFee: agentOffer.shipFee, link: agentOffer.link }
            : i
        )
        const newGroups = groupCartItemsByAgent(newItems, agents)
        const newTotal = calculateCartTotal(newGroups)
        const savings = currentTotal - newTotal

        if (savings > 0) {
          const oldGroup = currentGroups.find((g) => g.agentId === item.agentId)
          const newGroup = newGroups.find((g) => g.agentId === agent.id)

          suggestions.push({
            id: `promo-${item.offerId}-${agent.id}`,
            type: 'promo_optimization',
            title: `Move item to ${agent.name}`,
            reason: `${agent.name} current promo can save ${savings.toFixed(0)} CNY`,
            before: {
              agentId: item.agentId,
              shippingCost: oldGroup?.estimatedShipping.min || 0,
              totalCost: oldGroup?.total || 0,
            },
            after: {
              agentId: agent.id,
              shippingCost: newGroup?.estimatedShipping.min || 0,
              totalCost: newGroup?.total || 0,
            },
            savings: savings,
            affectedItems: [item.offerId],
          })
        }
      }
    })
  })

  // Suggestion 2: Check for shipping consolidation
  // If items are split across agents, suggest consolidating to reduce shipping
  if (currentGroups.length > 1) {
    // Try consolidating to the agent with most items
    const largestGroup = currentGroups.reduce((prev, current) =>
      current.items.length > prev.items.length ? current : prev
    )

    items.forEach((item) => {
      if (item.agentId === largestGroup.agentId) return

      // Check if the target agent has an offer for this product
      const product = getProductForItem(item)
      if (!product) return
      const agentOffer = product.offers.find((o) => o.agentId === largestGroup.agentId)
      if (!agentOffer) return // Target agent doesn't have this product

      const newItems = items.map((i) =>
        i.offerId === item.offerId
          ? { ...i, agentId: largestGroup.agentId, price: agentOffer.price, shipFee: agentOffer.shipFee, link: agentOffer.link }
          : i
      )
      const newGroups = groupCartItemsByAgent(newItems, agents)
      const newTotal = calculateCartTotal(newGroups)
      const savings = currentTotal - newTotal

      if (savings > 0) {
        const oldGroup = currentGroups.find((g) => g.agentId === item.agentId)
        const newGroup = newGroups.find((g) => g.agentId === largestGroup.agentId)

        suggestions.push({
          id: `consolidate-${item.offerId}-${largestGroup.agentId}`,
          type: 'agent_switch',
          title: `Move item to ${largestGroup.agent?.name || largestGroup.agentId}`,
          reason: `Consolidate shipping to save ${savings.toFixed(0)} CNY`,
          before: {
            agentId: item.agentId,
            shippingCost: oldGroup?.estimatedShipping.min || 0,
            totalCost: oldGroup?.total || 0,
          },
          after: {
            agentId: largestGroup.agentId,
            shippingCost: newGroup?.estimatedShipping.min || 0,
            totalCost: newGroup?.total || 0,
          },
          savings: savings,
          affectedItems: [item.offerId],
        })
      }
    })
  }

  // Sort by savings (descending)
  suggestions.sort((a, b) => b.savings - a.savings)

  // Return top 5 suggestions
  return suggestions.slice(0, 5)
}

