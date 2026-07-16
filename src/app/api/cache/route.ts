import { NextResponse } from 'next/server'
import { itemsService } from '@/lib/server/singletons'

export async function GET() {
  return NextResponse.json(itemsService.cache.snapshot())
}
