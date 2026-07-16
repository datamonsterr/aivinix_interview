import { beforeEach, describe, expect, it, vi } from 'vitest'

const mock = vi.hoisted(() => ({ fetchPokemonDetail: vi.fn() }))

vi.mock('../../src/lib/server/pokeapi', () => ({
  fetchPokemonDetail: mock.fetchPokemonDetail,
}))

import { GET } from '../../src/app/api/items/[id]/route'

describe('GET /api/items/:id', () => {
  beforeEach(() => {
    mock.fetchPokemonDetail.mockReset()
  })

  it('returns selected detail fields', async () => {
    mock.fetchPokemonDetail.mockResolvedValue({ id: 1, name: 'bulbasaur', description: 'seed pokemon' })

    const response = await GET(new Request('http://localhost/api/items/1'), { params: Promise.resolve({ id: '1' }) })

    expect(await response.json()).toEqual({ id: 1, name: 'bulbasaur', description: 'seed pokemon' })
  })

  it('returns 400 for invalid ids', async () => {
    const response = await GET(new Request('http://localhost/api/items/nope'), { params: Promise.resolve({ id: 'nope' }) })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid item id' })
  })

  it('returns 404 when upstream item is missing', async () => {
    mock.fetchPokemonDetail.mockRejectedValue(new Error('upstream:404'))

    const response = await GET(new Request('http://localhost/api/items/99999'), { params: Promise.resolve({ id: '99999' }) })

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({ error: 'Item not found' })
  })

  it('returns 502 on upstream failure', async () => {
    mock.fetchPokemonDetail.mockRejectedValue(new Error('timeout'))

    const response = await GET(new Request('http://localhost/api/items/1'), { params: Promise.resolve({ id: '1' }) })

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: 'Upstream failure' })
  })
})
