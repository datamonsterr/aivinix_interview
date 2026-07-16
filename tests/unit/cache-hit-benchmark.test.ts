import { describe, expect, it, vi } from 'vitest'

const mock = vi.hoisted(() => ({ getItems: vi.fn() }))

vi.mock('../../src/lib/server/singletons', () => ({
  itemsService: { getItems: mock.getItems },
}))

import { runCacheHitBenchmark } from '../../src/bench/cache-hit-rate'

describe('cache hit benchmark', () => {
  it('counts HIT responses across measured requests', async () => {
    mock.getItems
      .mockResolvedValueOnce({ ids: [1], cache: 'MISS' })
      .mockResolvedValueOnce({ ids: [1], cache: 'HIT' })
      .mockResolvedValueOnce({ ids: [1], cache: 'HIT' })
      .mockResolvedValueOnce({ ids: [1], cache: 'HIT' })
      .mockResolvedValueOnce({ ids: [1], cache: 'HIT' })
      .mockResolvedValueOnce({ ids: [1], cache: 'HIT' })

    const result = await runCacheHitBenchmark({ warmRequests: 1, measuredRequests: 5 })

    expect(result.totalRequests).toBe(6)
    expect(result.hits).toBe(5)
    expect(result.hitRate).toBe(5 / 6)
  })
})
