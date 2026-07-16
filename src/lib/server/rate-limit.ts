import { rateLimitConfig } from '../../config/app.config'

export type RateLimitDecision = { allowed: true } | { allowed: false; retryAfterSec: number }

type Bucket = { tokens: number; last: number }
const buckets = new Map<string, Bucket>()

export const allowRequest = (key: string): RateLimitDecision => {
  const now = Date.now()
  const bucket = buckets.get(key) ?? { tokens: rateLimitConfig.capacity, last: now }
  const elapsed = now - bucket.last
  bucket.tokens = Math.min(rateLimitConfig.capacity, bucket.tokens + elapsed * (rateLimitConfig.capacity / rateLimitConfig.windowMs))
  bucket.last = now
  if (bucket.tokens < 1) {
    buckets.set(key, bucket)
    return { allowed: false, retryAfterSec: rateLimitConfig.retryAfterSec }
  }
  bucket.tokens -= 1
  buckets.set(key, bucket)
  return { allowed: true }
}
