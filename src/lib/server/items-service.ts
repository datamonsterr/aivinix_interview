import { createItemCache } from './item-cache'
import { log } from './log'
import { metrics } from './metrics'

export const getItemsService = ({ fetchPage, now }: { fetchPage: () => Promise<{ ids: number[] }> ; now: () => number }) => {
  const cache = createItemCache(300000, 86400000)
  let refreshing: Promise<{ ids: number[] }> | null = null

  const refresh = async () => {
    try {
      const result = await fetchPage()
      cache.set(result.ids, now())
      return result
    } catch (error) {
      log.error('refresh_fail', { error: error instanceof Error ? error.message : 'unknown' })
      throw error
    }
  }

  return {
    async getItems() {
      const hit = cache.get(now())
      if (hit?.state === 'fresh') {
        metrics.recordCache('HIT')
        log.info('cache_hit')
        return { ids: hit.ids, cache: 'HIT' as const }
      }
      if (hit?.state === 'stale') {
        metrics.recordCache('STALE')
        log.info('cache_stale')
        refreshing ||= refresh().finally(() => { refreshing = null })
        return { ids: hit.ids, cache: 'STALE' as const }
      }
      metrics.recordCache('MISS')
      log.info('cache_miss')
      refreshing ||= refresh().finally(() => { refreshing = null })
      return { ...(await refreshing), cache: 'MISS' as const }
    },
    cache,
  }
}
