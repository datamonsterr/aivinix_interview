# SYSTEM DESIGN

## Source of truth
- Product requirements: `REQUIREMENTS.md`
- Task tracking: `SPEC.md`
- Architecture notes: `ARCHITECTURE.md`

## Mandatory implementation rules
- Read `REQUIREMENTS.md`, `SPEC.md`, `SYSTEM_DESIGN.md` before implementation.
- Update `SPEC.md` checklist while implementing.
- Update `SYSTEM_DESIGN.md` when technical decisions change.
- Prefer minimal code, stdlib, platform features.
- Use TDD for behavior changes.

## Technical decisions
- Runtime: Node.js via Next.js route handlers
- Framework: Next.js App Router
- Language: TypeScript strict mode
- Package manager: pnpm
- Toolchain pinning: `mise.toml`
- External API: PokéAPI
- Cache: in-memory stale-while-revalidate + single-flight refresh dedupe
- Validation: `zod`
- Unit/integration tests: Vitest
- E2E tests: Playwright
- Docs: OpenAPI JSON served by app
- Container: Docker + Docker Compose

## Cache strategy
- `GET /items` caches item IDs only.
- Fresh window: return cache `HIT`.
- Stale window: return stale cache `STALE`, trigger background refresh.
- Empty/expired cache: one request refreshes; concurrent requests await same promise.
- Refresh failure with stale cache: keep stale data.
- Refresh failure with empty cache: return upstream error.

## Multi-instance note
- Current cache is process-local only.
- For horizontal scale, move cache + lock to Redis.
