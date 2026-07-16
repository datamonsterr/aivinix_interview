type Metrics = {
  cache_hits_total: number
  cache_stale_total: number
  cache_miss_total: number
  upstream_ok_total: number
  upstream_error_total: number
  upstream_latency_sum: number
  upstream_latency_count: number
}

const state: Metrics = { cache_hits_total: 0, cache_stale_total: 0, cache_miss_total: 0, upstream_ok_total: 0, upstream_error_total: 0, upstream_latency_sum: 0, upstream_latency_count: 0 }

export const metrics = {
  reset() {
    Object.assign(state, { cache_hits_total: 0, cache_stale_total: 0, cache_miss_total: 0, upstream_ok_total: 0, upstream_error_total: 0, upstream_latency_sum: 0, upstream_latency_count: 0 })
  },
  recordCache(cache: 'HIT' | 'STALE' | 'MISS') {
    if (cache === 'HIT') state.cache_hits_total++
    if (cache === 'STALE') state.cache_stale_total++
    if (cache === 'MISS') state.cache_miss_total++
  },
  recordUpstream(outcome: 'ok' | 'error', latencyMs: number) {
    if (outcome === 'ok') state.upstream_ok_total++
    if (outcome === 'error') state.upstream_error_total++
    state.upstream_latency_sum += latencyMs
    state.upstream_latency_count++
  },
  render() {
    const avg = state.upstream_latency_count ? Math.round(state.upstream_latency_sum / state.upstream_latency_count) : 0
    return [
      `cache_hits_total ${state.cache_hits_total}`,
      `cache_stale_total ${state.cache_stale_total}`,
      `cache_miss_total ${state.cache_miss_total}`,
      `upstream_requests_total{outcome="ok"} ${state.upstream_ok_total}`,
      `upstream_requests_total{outcome="error"} ${state.upstream_error_total}`,
      `upstream_latency_ms_avg ${avg}`,
    ].join('\n')
  },
}
