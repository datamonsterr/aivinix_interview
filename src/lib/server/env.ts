import { z } from 'zod'

const envSchema = z.object({
  POKEAPI_BASE_URL: z.string().url().default('https://pokeapi.co/api/v2'),
  CACHE_TTL_MS: z.coerce.number().int().positive().default(300000),
  CACHE_STALE_MS: z.coerce.number().int().positive().default(86400000),
  EXTERNAL_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  RETRY_ATTEMPTS: z.coerce.number().int().positive().default(3),
  RETRY_BASE_MS: z.coerce.number().int().nonnegative().default(100),
  RETRY_MAX_MS: z.coerce.number().int().positive().default(1000),
  RATE_LIMIT_RPM: z.coerce.number().int().positive().default(60),
})

export const env = envSchema.parse({
  POKEAPI_BASE_URL: process.env.POKEAPI_BASE_URL,
  CACHE_TTL_MS: process.env.CACHE_TTL_MS,
  CACHE_STALE_MS: process.env.CACHE_STALE_MS,
  EXTERNAL_TIMEOUT_MS: process.env.EXTERNAL_TIMEOUT_MS,
  RETRY_ATTEMPTS: process.env.RETRY_ATTEMPTS,
  RETRY_BASE_MS: process.env.RETRY_BASE_MS,
  RETRY_MAX_MS: process.env.RETRY_MAX_MS,
  RATE_LIMIT_RPM: process.env.RATE_LIMIT_RPM,
})
