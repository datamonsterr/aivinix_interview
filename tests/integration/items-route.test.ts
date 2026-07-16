import { beforeEach, describe, expect, it, vi } from 'vitest'

const mock = vi.hoisted(() => ({ getItems: vi.fn(), allow: vi.fn(() => ({ allowed: true })) }))

vi.mock('../../src/lib/server/rate-limit', () => ({
  allowRequest: mock.allow,
}))

vi.mock('../../src/lib/server/singletons', () => ({
  itemsService: { getItems: mock.getItems },
}))

import { GET } from '../../src/app/api/items/route'

describe('GET /api/items', () => {
  beforeEach(() => {
    mock.getItems.mockReset()
  })

  it('returns ids and cache header', async () => {
    mock.getItems.mockResolvedValue({ ids: [1, 2], cache: 'HIT' })

    const response = await GET(new Request('http://localhost:8080/api/items'))

    expect(await response.json()).toEqual([1, 2])
    expect(response.headers.get('X-Cache')).toBe('HIT')
  })

  it('returns 502 on upstream failure', async () => {
    mock.getItems.mockRejectedValue(new Error('boom'))

    const response = await GET(new Request('http://localhost:8080/api/items'))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: 'Upstream failure' })
  })
})
