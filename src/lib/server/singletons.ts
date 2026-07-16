import { env } from './env'
import { fetchAllPokemonIds } from './pokeapi'
import { getItemsService } from './items-service'

export const itemsService = getItemsService({
  fetchPage: fetchAllPokemonIds,
  now: () => Date.now(),
})

export const cacheConfig = env
