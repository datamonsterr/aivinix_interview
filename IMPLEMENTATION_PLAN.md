# Public API Cache Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js TypeScript service exposing cached PokéAPI-backed item list/detail endpoints with docs, tests, local tooling, and senior-level operational features.

**Architecture:** Use App Router route handlers as HTTP API surface. Keep business logic in small server-side modules: env, TS config, upstream client, cache, rate limit, metrics, logging, mappers, benchmark, OpenAPI. Cache list IDs in-memory with stale-while-revalidate plus single-flight refresh to prevent stampede.

**Tech Stack:** Next.js, TypeScript, pnpm, mise, Vitest, Playwright, Docker Compose, GitHub Actions, opencode config

---

## File map
- `src/app/api/items/route.ts` → list endpoint
- `src/app/api/items/[id]/route.ts` → detail endpoint
- `src/app/api/openapi/route.ts` → OpenAPI JSON
- `src/app/api/cache/route.ts` → cache inspection
- `src/app/api/metrics/route.ts` → metrics endpoint
- `src/app/docs/page.tsx` → simple docs page
- `src/config/app.config.ts` → TS runtime config for benchmark/rate-limit knobs
- `src/bench/cache-hit-rate.ts` → cache hit benchmark helper
- `src/lib/server/*.ts` → env/client/cache/service/rate-limit/metrics/logging
- `tests/unit/*.test.ts` → unit tests
- `tests/integration/*.test.ts` → route integration tests
- `tests/e2e/*.spec.ts` → browser/http e2e
- `.github/workflows/ci.yml` → CI
- `.opencode/*` → local agent config
- `AI_USAGE.md` → AI usage disclosure

## Tasks
- [x] Scaffold app + config
- [x] Write failing unit tests for cache/service/mapper
- [x] Implement server modules to pass unit tests
- [x] Write failing integration tests for route handlers
- [x] Implement routes + openapi/docs
- [x] Write failing e2e tests
- [x] Add Docker + local scripts
- [x] Add retry/backoff, structured logs, metrics, rate limit, CI
- [x] Add cache-hit benchmark and TS config module
- [x] Update README, ARCHITECTURE, SPEC, AI usage docs
- [x] Run lint, typecheck, unit, integration, e2e, coverage, build
