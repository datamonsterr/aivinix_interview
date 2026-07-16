import { NextResponse } from 'next/server'
import { allowRequest } from '../../../../lib/server/rate-limit'
import { fetchPokemonDetail } from '../../../../lib/server/pokeapi'

const badRequest = () => NextResponse.json({ error: 'Invalid item id' }, { status: 400 })

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const limit = allowRequest('item-detail')
  if (!limit.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } })
  const { id } = await context.params
  const parsed = Number(id)
  if (!Number.isInteger(parsed) || parsed <= 0) return badRequest()

  try {
    return NextResponse.json(await fetchPokemonDetail(parsed))
  } catch (error) {
    if (error instanceof Error && error.message === 'upstream:404') return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    return NextResponse.json({ error: 'Upstream failure' }, { status: 502 })
  }
}
