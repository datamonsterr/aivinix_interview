import { describe, expect, it } from 'vitest'
import { GET } from '../../src/app/api/metrics/route'
import { metrics } from '../../src/lib/server/metrics'

describe('GET /api/metrics', () => {
  it('returns prometheus metrics', async () => {
    metrics.reset()
    metrics.recordCache('HIT')

    const response = await GET()
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/plain')
    expect(body).toContain('cache_hits_total 1')
  })
})
