import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sleep = vi.hoisted(() => vi.fn(async () => {}))
const log = vi.hoisted(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }))
const metrics = vi.hoisted(() => ({ recordUpstream: vi.fn() }))

vi.mock('../../src/lib/server/sleep', () => ({ sleep }))
vi.mock('../../src/lib/server/log', () => ({ log }))
vi.mock('../../src/lib/server/metrics', () => ({ metrics }))

let fetchAllPokemonIds: typeof import('../../src/lib/server/pokeapi').fetchAllPokemonIds
let fetchPokemonDetail: typeof import('../../src/lib/server/pokeapi').fetchPokemonDetail

const jsonResponse = (body: unknown, init?: ResponseInit) => new Response(JSON.stringify(body), {
  status: init?.status ?? 200,
  headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
})

describe('pokeapi retry', () => {
  const originalFetch = global.fetch

  beforeEach(async () => {
    vi.resetModules()
    process.env.EXTERNAL_TIMEOUT_MS = '100'
    process.env.RETRY_ATTEMPTS = '3'
    process.env.RETRY_BASE_MS = '10'
    process.env.RETRY_MAX_MS = '20'
    ;({ fetchAllPokemonIds, fetchPokemonDetail } = await import('../../src/lib/server/pokeapi'))
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.clearAllMocks()
    delete process.env.EXTERNAL_TIMEOUT_MS
    delete process.env.RETRY_ATTEMPTS
    delete process.env.RETRY_BASE_MS
    delete process.env.RETRY_MAX_MS
  })

  it('retries paginated list fetch on upstream 500 and succeeds', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({}, { status: 500 }))
      .mockResolvedValueOnce(jsonResponse({ results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null })) as typeof fetch

    await expect(fetchAllPokemonIds()).resolves.toEqual({ ids: [1] })
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(log.warn).toHaveBeenCalled()
  })

  it('retries detail fetch on 429 with retry-after and then succeeds', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 429, headers: { 'retry-after': '1', 'content-type': 'application/json' } }))
      .mockResolvedValueOnce(jsonResponse({ id: 25, name: 'pikachu', species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' } }))
      .mockResolvedValueOnce(jsonResponse({ flavor_text_entries: [{ flavor_text: 'zap', language: { name: 'en' } }] })) as typeof fetch

    await expect(fetchPokemonDetail(25)).resolves.toEqual({ id: 25, name: 'pikachu', description: 'zap' })
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })

  it('gives up after configured attempts', async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse({}, { status: 503 })) as typeof fetch

    await expect(fetchAllPokemonIds()).rejects.toThrow('upstream:503')
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })
})
