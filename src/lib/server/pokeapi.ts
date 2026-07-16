import { env } from './env'
import { log } from './log'
import { metrics } from './metrics'
import { sleep } from './sleep'
import { mapPokemonDetail, parsePokemonId, type PokeDetail, type PokeListPage } from './pokemon'

const retryable = (status: number) => status === 408 || status === 429 || status >= 500

const fetchJson = async <T>(url: string) => {
  for (let attempt = 1; attempt <= env.RETRY_ATTEMPTS; attempt++) {
    const started = Date.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), env.EXTERNAL_TIMEOUT_MS)
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
      if (!response.ok) {
        metrics.recordUpstream('error', Date.now() - started)
        if (attempt < env.RETRY_ATTEMPTS && retryable(response.status)) {
          log.warn('upstream_retry', { url, attempt, status: response.status })
          const after = Number(response.headers.get('retry-after'))
          await sleep(Number.isFinite(after) ? after * 1000 : Math.min(env.RETRY_MAX_MS, env.RETRY_BASE_MS * attempt))
          continue
        }
        throw new Error(`upstream:${response.status}`)
      }
      metrics.recordUpstream('ok', Date.now() - started)
      return await response.json() as T
    } catch (error) {
      metrics.recordUpstream('error', Date.now() - started)
      if (error instanceof Error && error.name === 'AbortError') throw new Error('upstream:timeout')
      if (attempt < env.RETRY_ATTEMPTS) {
        log.warn('upstream_retry', { url, attempt })
        await sleep(Math.min(env.RETRY_MAX_MS, env.RETRY_BASE_MS * attempt))
        continue
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }
  throw new Error('unreachable')
}

export const fetchAllPokemonIds = async () => {
  let cursor: string | null = `${env.POKEAPI_BASE_URL}/pokemon?limit=200&offset=0`
  const ids: number[] = []
  while (cursor) {
    const page: PokeListPage = await fetchJson(cursor)
    ids.push(...page.results.map((item: { url: string }) => parsePokemonId(item.url)))
    cursor = page.next
  }
  return { ids }
}

export const fetchPokemonDetail = async (id: number) => {
  try {
    const pokemon = await fetchJson<{ id: number; name: string; species: { url: string } }>(`${env.POKEAPI_BASE_URL}/pokemon/${id}`)
    const species = await fetchJson<Pick<PokeDetail, 'flavor_text_entries'>>(`${env.POKEAPI_BASE_URL}/pokemon-species/${id}`)
    return mapPokemonDetail({ ...pokemon, flavor_text_entries: species.flavor_text_entries })
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) throw new Error('upstream:404')
    throw error
  }
}
