# SPEC

## Setup
- [x] Initialize Next.js App Router app with TypeScript, pnpm, mise
- [x] Configure `.opencode/opencode.json` with allow permissions
- [x] Add subagents: `read-online-docs`, `write-test`
- [x] Add project skills/references/rules to read `REQUIREMENTS.md` and `SYSTEM_DESIGN.md`

## API
- [x] Implement `GET /items`
- [x] Implement pagination against PokéAPI
- [x] Add stale-while-revalidate in-memory cache
- [x] Add single-flight dedupe for cold cache
- [x] Add `X-Cache` response header
- [x] Implement `GET /items/[id]`
- [x] Return selected fields only
- [x] Handle invalid ID, not found, upstream timeout/error
- [x] Add cache inspection endpoint
- [x] Add metrics endpoint

## Docs
- [x] Write `README.md`
- [x] Write `ARCHITECTURE.md`
- [x] Write `SYSTEM_DESIGN.md`
- [x] Add OpenAPI spec + UI endpoint
- [x] Include AI Usage section
- [x] Add dedicated `AI_USAGE.md`
- [x] Document agent setup + repo workflow
- [x] Document benchmark + TS config usage

## Tests
- [x] Unit tests for cache/service/mapper
- [x] Integration tests for route handlers
- [x] E2E tests for HTTP endpoints
- [x] Coverage run
- [x] Add retry/backoff tests
- [x] Add rate-limit tests
- [x] Add benchmark tests

## Ops
- [x] Add Dockerfile
- [x] Add docker-compose.yml
- [x] Add localhost API test helper script
- [x] Add cache inspection endpoint/tooling
- [x] Add structured JSON logging
- [x] Add metrics for cache hit/miss
- [x] Add request timeout and retry/backoff
- [x] Add rate-limit protection
- [x] Add CI workflow
- [x] Add production deployment notes
- [x] Move requested runtime knobs to TypeScript config file(s)
