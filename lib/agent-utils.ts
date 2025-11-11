import { Agent } from '@/lib/data'

/**
 * Generate tracking URL for agent with UTM parameters
 */
export function getAgentTrackingUrl(agent: Agent, productLink?: string): string {
  const baseUrl = productLink || agent.siteUrl
  const url = new URL(baseUrl, 'https://example.com')
  
  // Add tracking parameters
  url.searchParams.set('source', 'xfinds')
  url.searchParams.set('utm_medium', 'bridge')
  url.searchParams.set('utm_agent', agent.id)
  
  // Return the full URL (handle both absolute and relative URLs)
  if (productLink && productLink.startsWith('http')) {
    const productUrl = new URL(productLink)
    productUrl.searchParams.set('source', 'xfinds')
    productUrl.searchParams.set('utm_medium', 'bridge')
    productUrl.searchParams.set('utm_agent', agent.id)
    return productUrl.toString()
  }
  
  if (productLink) {
    // Relative URL - append params
    const separator = productLink.includes('?') ? '&' : '?'
    return `${productLink}${separator}source=xfinds&utm_medium=bridge&utm_agent=${agent.id}`
  }
  
  // Agent site URL
  const separator = agent.siteUrl.includes('?') ? '&' : '?'
  return `${agent.siteUrl}${separator}source=xfinds&utm_medium=bridge&utm_agent=${agent.id}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    throw error
  }
}

/**
 * Get agent logo path with fallback to placeholder
 */
export function getAgentLogoPath(agent: Agent): string {
  if (agent.logo && agent.logo.startsWith('/')) {
    return agent.logo
  }
  // Fallback to placeholder or default logo
  return '/agents/placeholder.png'
}

/**
 * Get clean site URL without tracking parameters
 */
export function getCleanSiteUrl(agent: Agent): string {
  return agent.siteUrl
}

