import { beforeEach, describe, expect, it, vi } from 'vitest'

const mock = vi.hoisted(() => ({ getItems: vi.fn() }))

vi.mock('../../src/lib/server/singletons', () => ({
  itemsService: { getItems: mock.getItems },
}))

import { runCacheHitBenchmark } from '../../src/bench/cache-hit-rate'

describe('cache hit benchmark', () => {
  beforeEach(() => {
    mock.getItems.mockReset()
  })

  it('reports seq + burst metrics for 10/100/1000 request sizes', async () => {
    const responses = [
      ...Array.from({ length: 10 }, (_, index) => ({ ids: [1], cache: index === 0 ? 'MISS' : 'HIT' as const })),
      ...Array.from({ length: 10 }, (_, index) => ({ ids: [1], cache: index < 2 ? 'MISS' : 'HIT' as const })),
      ...Array.from({ length: 100 }, (_, index) => ({ ids: [1], cache: index === 0 ? 'MISS' : 'HIT' as const })),
      ...Array.from({ length: 100 }, (_, index) => ({ ids: [1], cache: index < 2 ? 'MISS' : 'HIT' as const })),
      ...Array.from({ length: 1000 }, (_, index) => ({ ids: [1], cache: index === 0 ? 'MISS' : 'HIT' as const })),
      ...Array.from({ length: 1000 }, (_, index) => ({ ids: [1], cache: index < 2 ? 'MISS' : 'HIT' as const })),
    ]

    mock.getItems.mockImplementation(async () => {
      await Promise.resolve()
      return responses.shift() ?? { ids: [1], cache: 'HIT' as const }
    })

    const result = await runCacheHitBenchmark()

    console.table(result)

    expect(result).toHaveLength(6)
    expect(result).toEqual([
      expect.objectContaining({ requests: 10, mode: 'seq', totalRequests: 10, misses: 1, hits: 9, stales: 0, hitRate: 0.9 }),
      expect.objectContaining({ requests: 10, mode: 'burst', totalRequests: 10, misses: 2, hits: 8, stales: 0, hitRate: 0.8 }),
      expect.objectContaining({ requests: 100, mode: 'seq', totalRequests: 100, misses: 1, hits: 99, stales: 0, hitRate: 0.99 }),
      expect.objectContaining({ requests: 100, mode: 'burst', totalRequests: 100, misses: 2, hits: 98, stales: 0, hitRate: 0.98 }),
      expect.objectContaining({ requests: 1000, mode: 'seq', totalRequests: 1000, misses: 1, hits: 999, stales: 0, hitRate: 0.999 }),
      expect.objectContaining({ requests: 1000, mode: 'burst', totalRequests: 1000, misses: 2, hits: 998, stales: 0, hitRate: 0.998 }),
    ])
    for (const summary of result) {
      expect(summary.avgMs).toBeGreaterThanOrEqual(0)
      expect(summary.p95Ms).toBeGreaterThanOrEqual(0)
    }
  })
})
