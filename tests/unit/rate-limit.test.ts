import { beforeEach, describe, expect, it, vi } from 'vitest'
import { allowRequest } from '../../src/lib/server/rate-limit'

describe('rate limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })

  it('blocks request after capacity is exhausted and re-allows after window refill', () => {
    for (let i = 0; i < 60; i++) expect(allowRequest('bench-ip')).toEqual({ allowed: true })

    expect(allowRequest('bench-ip')).toEqual({ allowed: false, retryAfterSec: 60 })

    vi.advanceTimersByTime(60000)

    expect(allowRequest('bench-ip')).toEqual({ allowed: true })
  })
})
