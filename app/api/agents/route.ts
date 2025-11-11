import { getAgents } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET() {
  const agents = getAgents()
  return NextResponse.json(agents)
}

