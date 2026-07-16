import { NextResponse } from 'next/server'
import { allowRequest } from '../../../lib/server/rate-limit'
import { itemsService } from '../../../lib/server/singletons'

export async function GET(request: Request) {
  const limit = allowRequest('items')
  if (!limit.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } })
  try {
    const result = await itemsService.getItems()
    return NextResponse.json(result.ids, { headers: { 'X-Cache': result.cache } })
  } catch {
    return NextResponse.json({ error: 'Upstream failure' }, { status: 502 })
  }
}
