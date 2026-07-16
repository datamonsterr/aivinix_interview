import { describe, expect, it } from 'vitest'
import { metrics } from '../../src/lib/server/metrics'

describe('metrics', () => {
  it('tracks cache counters and renders prometheus text', () => {
    metrics.reset()

    metrics.recordCache('HIT')
    metrics.recordCache('STALE')
    metrics.recordCache('MISS')
    metrics.recordUpstream('ok', 120)
    metrics.recordUpstream('error', 50)

    const text = metrics.render()

    expect(text).toContain('cache_hits_total 1')
    expect(text).toContain('cache_stale_total 1')
    expect(text).toContain('cache_miss_total 1')
    expect(text).toContain('upstream_requests_total{outcome="ok"} 1')
    expect(text).toContain('upstream_requests_total{outcome="error"} 1')
    expect(text).toContain('upstream_latency_ms_avg 85')
  })
})
