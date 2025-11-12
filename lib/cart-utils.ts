import { CartItem } from '@/store/cart-store'
import { Agent } from '@/lib/data'

export interface ShippingEstimate {
  min: number
  max: number
  currency: string
  note?: string
}

export interface AgentGroup {
  agentId: string
  agent: Agent | undefined
  items: CartItem[]
  estimatedShipping: ShippingEstimate
  subtotal: number
  total: number
  promoText?: string
}

/**
 * Group cart items by agent
 */
export function groupCartItemsByAgent(
  items: CartItem[],
  agents: Agent[]
): AgentGroup[] {
  const groupsMap = new Map<string, CartItem[]>()

  // Group items by agent
  items.forEach((item) => {
    const existing = groupsMap.get(item.agentId) || []
    groupsMap.set(item.agentId, [...existing, item])
  })

  // Convert to AgentGroup array
  const groups: AgentGroup[] = []
  groupsMap.forEach((groupItems, agentId) => {
    const agent = agents.find((a) => a.id === agentId)
    
    // Calculate subtotal (items only)
    const subtotal = groupItems.reduce((sum, item) => sum + item.price, 0)
    
    // Estimate shipping (simple sum for now, can be enhanced with weight-based calculation)
    const shippingSum = groupItems.reduce((sum, item) => sum + item.shipFee, 0)
    const estimatedShipping: ShippingEstimate = {
      min: shippingSum,
      max: shippingSum,
      currency: groupItems[0]?.price ? 'CNY' : 'CNY', // Default currency
    }
    
    const total = subtotal + estimatedShipping.min

    groups.push({
      agentId,
      agent,
      items: groupItems,
      estimatedShipping,
      subtotal,
      total,
      promoText: agent?.promoText,
    })
  })

  // Sort by agent name
  groups.sort((a, b) => {
    const nameA = a.agent?.name || a.agentId
    const nameB = b.agent?.name || b.agentId
    return nameA.localeCompare(nameB)
  })

  return groups
}

/**
 * Calculate total cost across all groups
 */
export function calculateCartTotal(groups: AgentGroup[]): number {
  return groups.reduce((sum, group) => sum + group.total, 0)
}

