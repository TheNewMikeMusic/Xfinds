import { readCategories } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = readCategories()
  return NextResponse.json(categories)
}

