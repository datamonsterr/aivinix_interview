import { describe, expect, it } from 'vitest'
import { rateLimitConfig } from '../../src/config/app.config'

describe('rate limit config', () => {
  it('comes from ts config file', () => {
    expect(rateLimitConfig.capacity).toBe(60)
    expect(rateLimitConfig.windowMs).toBe(60000)
    expect(rateLimitConfig.retryAfterSec).toBe(60)
  })
})
