import { describe, expect, it, vi } from 'vitest'
import { getItemsService } from '../../src/lib/server/items-service'

describe('items service', () => {
  it('dedupes empty-cache refreshes', async () => {
    const fetchPage = vi.fn(async () => ({ ids: [1], next: null }))
    const service = getItemsService({ fetchPage, now: () => 0 })

    const [a, b] = await Promise.all([service.getItems(), service.getItems()])

    expect(a.ids).toEqual([1])
    expect(b.ids).toEqual([1])
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it('returns stale cache immediately and refreshes in background', async () => {
    let currentTime = 0
    const fetchPage = vi.fn(async () => ({ ids: [2] }))
    const service = getItemsService({ fetchPage, now: () => currentTime })

    await service.getItems()
    currentTime = 300001

    const stale = await service.getItems()

    expect(stale).toEqual({ ids: [2], cache: 'STALE' })
    expect(fetchPage).toHaveBeenCalledTimes(2)
  })
})
