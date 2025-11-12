import { getAgents } from '@/lib/data'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'

export async function GET() {
  try {
    const agents = getAgents()
    return createSuccessResponse(agents, {
      cache: {
        maxAge: 600, // Cache for 10 minutes
        revalidate: 1800, // Revalidate every 30 minutes
      },
    })
  } catch (error) {
    return createErrorResponse(error, 'Failed to read agents')
  }
}

