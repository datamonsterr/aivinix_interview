import { describe, expect, it, vi } from 'vitest'

const mock = vi.hoisted(() => ({
  snapshot: vi.fn(() => ({ ids: [1, 2], refreshedAt: 123 })),
}))

vi.mock('@/lib/server/singletons', () => ({
  itemsService: { cache: { snapshot: mock.snapshot } },
}))

import { GET } from '../../src/app/api/cache/route'

describe('GET /api/cache', () => {
  it('returns cache snapshot', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ids: [1, 2], refreshedAt: 123 })
  })
})
