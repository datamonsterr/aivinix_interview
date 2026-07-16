# Architecture

## 1. Overall application structure
- Next.js App Router exposes HTTP endpoints.
- `src/app/api/*` contains route handlers for items, detail, cache inspection, metrics, health, and OpenAPI.
- `src/lib/server/*` holds env parsing, PokéAPI client, cache, metrics, logger, rate limit, mappers, service wiring.
- `src/config/app.config.ts` stores requested TypeScript-based runtime knobs for rate limiting and benchmark defaults.
- `src/bench/cache-hit-rate.ts` provides a benchmark helper for cache-hit measurements.
- Test pyramid: `tests/unit`, `tests/integration`, `tests/e2e`.

## 2. Data flow from external API to API response
- `GET /api/items` -> rate limit -> items service -> cache lookup -> PokéAPI pagination on miss/refresh -> ID list -> JSON response + `X-Cache`.
- `GET /api/items/:id` -> rate limit -> validate ID -> PokéAPI `/pokemon/:id` + `/pokemon-species/:id` -> mapper -> selected fields.
- `GET /api/metrics` -> in-memory counters -> Prometheus-style text response.
- `GET /api/cache` -> in-memory cache snapshot -> JSON for inspection.

## 3. Caching strategy
- In-memory cache stores only ID lists.
- Fresh cache => `HIT`.
- Stale cache => `STALE`, return stale data immediately, refresh in background.
- Empty cache => `MISS`, one fetch populates cache.
- Benchmark helper measures effective hit ratio after warmup.

## 4. Cache expiration / refresh strategy
- TTL controls fresh lifetime.
- Stale window allows serving old data while revalidating.
- On refresh failure with stale cache, stale data remains available.
- Cold-cache concurrent callers share one refresh promise.

## 5. How new external records are discovered
- New PokéAPI records appear when the next refresh repaginates the list endpoint.
- Because the list endpoint does not permanently pin IDs, refreshed pages eventually discover added upstream records.

## 6. How external API failures are handled
- Per-attempt timeout via `AbortController`.
- Retry/backoff for 408, 429, 5xx, and network failures.
- 404 upstream detail maps to 404 client response.
- Timeout/other upstream failures map to 502.
- Refresh failures are logged and counted in upstream error metrics.

## 7. How simultaneous requests are handled when cache is empty
- Single-flight promise dedupes concurrent cold-cache requests.
- Only one refresh runs; others await same promise.
- This prevents cache stampede inside one process.

## 8. Multi-instance changes needed
- Current cache, metrics, and rate limit are process-local.
- For multiple instances: move cache + counters + rate limit state to Redis, add distributed locking for refresh.
- Current TS config file remains useful, but process-local state would no longer be sufficient.

## 9. Production monitoring
- Structured JSON logs to stdout.
- Metrics endpoint `/api/metrics` exposes cache hit/stale/miss and upstream counters.
- Cache inspection endpoint `/api/cache` helps local debugging.
- Key signals: cache ratio, upstream latency, retry count, 429 rate, 5xx rate.

## 10. What I would improve with more time
- Redis-backed shared cache/rate limit.
- Better Prometheus histogram buckets.
- Swagger UI instead of simple docs page.
- Per-client rate-limit keys from trusted proxy headers.
- CI matrix + container publish + deployment manifests.
- Persisted benchmark history instead of single-run helper output.

## Deployment notes
- Local/prod entrypoints use `pnpm start` or Docker.
- Required runtime env is documented in `.env.example`.
- TS config knobs live in `src/config/app.config.ts`.
- Health endpoint: `/api/health`.
- Metrics endpoint: `/api/metrics`.
- Container port: `8080`.
