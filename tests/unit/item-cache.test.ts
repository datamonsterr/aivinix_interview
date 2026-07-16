import { describe, expect, it, vi } from 'vitest'
import { createItemCache } from '../../src/lib/server/item-cache'

describe('item cache', () => {
  it('serves fresh data as hit', () => {
    const cache = createItemCache(1000, 5000)
    cache.set([1, 2], 0)

    const result = cache.get(500)

    expect(result?.state).toBe('fresh')
    expect(result?.ids).toEqual([1, 2])
  })

  it('serves stale data and marks refresh needed', () => {
    const cache = createItemCache(1000, 5000)
    cache.set([1], 0)

    const result = cache.get(1500)

    expect(result?.state).toBe('stale')
    expect(result?.refreshNeeded).toBe(true)
  })
})
