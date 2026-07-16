export const rateLimitConfig = {
  capacity: 60,
  windowMs: 60000,
  retryAfterSec: 60,
} as const

export const benchmarkConfig = {
  warmRequests: 1,
  measuredRequests: 5,
} as const
