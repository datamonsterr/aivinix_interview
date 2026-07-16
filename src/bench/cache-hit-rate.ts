import { itemsService } from '../lib/server/singletons'
import { benchmarkConfig } from '../config/app.config'

export const runCacheHitBenchmark = async ({ warmRequests = benchmarkConfig.warmRequests, measuredRequests = benchmarkConfig.measuredRequests } = {}) => {
  let hits = 0
  let totalRequests = 0
  for (let i = 0; i < warmRequests; i++) {
    totalRequests++
    await itemsService.getItems()
  }
  for (let i = 0; i < measuredRequests; i++) {
    totalRequests++
    const result = await itemsService.getItems()
    if (result.cache === 'HIT') hits++
  }
  return { totalRequests, hits, hitRate: totalRequests ? hits / totalRequests : 0 }
}
