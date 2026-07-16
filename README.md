# Public API Cache Service

PokéAPI-backed cache service for item IDs + selected item details.

## What this project does
This repository implements the original `REQUIREMENTS.md` assessment: a Node.js/TypeScript API that fetches data from a public external API, caches selected data, exposes clean endpoints, documents the API, and includes automated tests.

Implemented extras beyond the base requirement:
- stale-while-revalidate cache
- single-flight cold-cache dedupe
- upstream timeout + retry/backoff
- structured JSON logs
- in-memory metrics at `/api/metrics`
- in-memory rate limiting
- cache inspection endpoint `/api/cache`
- cache hit benchmark
- Docker + GitHub Actions CI

## Specs
- runtime: Node.js + TypeScript + Next.js App Router
- package manager: pnpm
- external API: PokéAPI
- cache: in-memory stale-while-revalidate
- tests: Vitest + Playwright
- docs: OpenAPI JSON + `/docs`

## Selected API
PokéAPI. No auth required.

## Prerequisites
- Node.js 22+
- pnpm 10+

## Installation
```bash
pnpm install
```

## How to run
```bash
pnpm dev
```
Open: `http://localhost:8080`

## How to read this project
1. `REQUIREMENTS.md` — original assessment requirements
2. `README.md` — runbook + verification summary
3. `ARCHITECTURE.md` — design decisions and tradeoffs
4. `SPEC.md` — completed implementation checklist
5. `AI_USAGE.md` — explicit AI disclosure requested by the assessment
6. `src/app/api/*` and `src/lib/server/*` — routes and server logic

## Environment
Copy `.env.example` if needed. PokéAPI does not require secrets.

Environment-driven values:
- `POKEAPI_BASE_URL`
- `CACHE_TTL_MS`
- `CACHE_STALE_MS`
- `EXTERNAL_TIMEOUT_MS`
- `RETRY_ATTEMPTS`
- `RETRY_BASE_MS`
- `RETRY_MAX_MS`

TypeScript-configured runtime knobs:
- `src/config/app.config.ts` → rate limit config
- `src/config/app.config.ts` → benchmark config

## API endpoints
- `GET /api/items`
- `GET /api/items/:id`
- `GET /api/openapi`
- `GET /api/health`
- `GET /api/cache`
- `GET /api/metrics`
- docs UI: `/docs`

## Manual checks
```bash
curl -i http://localhost:8080/api/items
curl -i http://localhost:8080/api/items/1
curl -i http://localhost:8080/api/items/nope
curl -i http://localhost:8080/api/openapi
curl -i http://localhost:8080/api/cache
curl -i http://localhost:8080/api/metrics
```

## Tests and verification
```bash
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm coverage
pnpm bench:cache-hit
pnpm lint
pnpm typecheck
pnpm build
```

## Verification results
| Check | Result | Notes |
| --- | --- | --- |
| `pnpm test:unit` | pass | 9 files, 14 tests, 982ms |
| `pnpm test:integration` | pass | 6 files, 10 tests, 951ms |
| `pnpm test:e2e` | pass | 3 tests, 2.4s |
| `pnpm coverage` | pass | stmts 88.95%, branches 74.64%, funcs 88.23%, lines 89.72% |
| `pnpm lint` | pass | `tsc --noEmit` |
| `pnpm typecheck` | pass | `tsc --noEmit` |
| `pnpm build` | pass | Next.js production build succeeded |

## Benchmark result
| Benchmark | Result | Notes |
| --- | --- | --- |
| `pnpm bench:cache-hit` | pass | 1 test, 629ms |
| cache-hit benchmark scenario | hit rate `5/6 = 83.33%` | 1 warm request, 5 measured requests |

## Swagger / OpenAPI
- JSON: `/api/openapi`
- simple docs page: `/docs`

## Agent setup
- AI-assisted workflow used OpenCode for repo navigation, testing loops, and documentation updates
- Repo agent config: `opencode.json`, `.opencode/`
- Project instructions consumed by the agent: `REQUIREMENTS.md`, `SYSTEM_DESIGN.md`, `SPEC.md`
- Working style: read requirements -> write failing tests -> implement minimal code -> verify with lint/typecheck/unit/integration/e2e/coverage/build
- If continuing with OpenCode, use `/help` for CLI help.

## Assumptions
- IDs come from PokéAPI `/pokemon` pagination.
- Cache/rate limit/metrics are process-local only.
- Stale data may be served while refresh runs.
- Multi-instance deployment would require shared state such as Redis.

## AI Usage
Summary lives here for quick review. Full disclosure lives in `AI_USAGE.md`.
- Did I use AI tools? Yes.
- Which AI tools? OpenAI GPT 5.4, opencode-go DeepSeek v4 Pro, and multiple models routed through 9router depending on task complexity and subagent configuration.
- Which parts did AI help with? Scaffolding, test-first iteration, docs outline, verification flow.
- Which parts did I manually review or modify? Cache behavior, error mapping, retry logic, rate limiting, final docs.
- Which part of the code am I most confident about? Cache/service flow and route error handling.
- Which part of the code am I least confident about? Process-local rate limiting in multi-instance deployment.
