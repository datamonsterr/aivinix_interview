import { beforeEach, describe, expect, it, vi } from 'vitest'

const allow = vi.hoisted(() => vi.fn())
const getItems = vi.hoisted(() => vi.fn())

vi.mock('../../src/lib/server/rate-limit', () => ({
  allowRequest: allow,
}))

vi.mock('../../src/lib/server/singletons', () => ({
  itemsService: { getItems },
}))

import { GET as listGet } from '../../src/app/api/items/route'

describe('rate limit', () => {
  beforeEach(() => {
    allow.mockReset()
    getItems.mockReset()
  })

  it('returns 429 when limit exceeded', async () => {
    allow.mockReturnValue({ allowed: false, retryAfterSec: 60 })

    const response = await listGet(new Request('http://localhost:8080/api/items'))

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('60')
    await expect(response.json()).resolves.toEqual({ error: 'Rate limit exceeded' })
  })
})
