import { itemsService } from '../lib/server/singletons'

const sizes = [10, 100, 1000] as const
const modes = ['seq', 'burst'] as const

export type BenchmarkMode = (typeof modes)[number]
export type BenchmarkSummary = {
  requests: number
  mode: BenchmarkMode
  totalRequests: number
  hits: number
  misses: number
  stales: number
  hitRate: number
  avgMs: number
  p95Ms: number
}

const percentile = (values: number[], target: number) => {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.ceil((target / 100) * sorted.length) - 1)
  return sorted[index]
}

const measure = async () => {
  const started = performance.now()
  const result = await itemsService.getItems()
  return { cache: result.cache, ms: performance.now() - started }
}

const runSequential = async (requests: number) => {
  const latencies: number[] = []
  let hits = 0
  let misses = 0
  let stales = 0
  for (let i = 0; i < requests; i++) {
    const result = await measure()
    latencies.push(result.ms)
    if (result.cache === 'HIT') hits++
    if (result.cache === 'MISS') misses++
    if (result.cache === 'STALE') stales++
  }
  return { latencies, hits, misses, stales }
}

const runBurst = async (requests: number) => {
  const results = await Promise.all(Array.from({ length: requests }, () => measure()))
  const latencies = results.map((result) => result.ms)
  return {
    latencies,
    hits: results.filter((result) => result.cache === 'HIT').length,
    misses: results.filter((result) => result.cache === 'MISS').length,
    stales: results.filter((result) => result.cache === 'STALE').length,
  }
}

const summarize = (requests: number, mode: BenchmarkMode, latencies: number[], hits: number, misses: number, stales: number): BenchmarkSummary => {
  const totalRequests = hits + misses + stales
  return {
    requests,
    mode,
    totalRequests,
    hits,
    misses,
    stales,
    hitRate: totalRequests ? hits / totalRequests : 0,
    avgMs: totalRequests ? latencies.reduce((sum, value) => sum + value, 0) / totalRequests : 0,
    p95Ms: percentile(latencies, 95),
  }
}

export const runCacheHitBenchmark = async () => {
  const summaries: BenchmarkSummary[] = []
  for (const requests of sizes) {
    const seq = await runSequential(requests)
    summaries.push(summarize(requests, 'seq', seq.latencies, seq.hits, seq.misses, seq.stales))
    const burst = await runBurst(requests)
    summaries.push(summarize(requests, 'burst', burst.latencies, burst.hits, burst.misses, burst.stales))
  }
  return summaries
}
