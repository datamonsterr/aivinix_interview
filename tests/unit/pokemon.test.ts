import { describe, expect, it } from 'vitest'
import { mapPokemonDetail, parsePokemonId } from '../../src/lib/server/pokemon'

describe('pokemon mapper', () => {
  it('parses numeric pokemon id', () => {
    expect(parsePokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('maps detail to selected fields', () => {
    expect(mapPokemonDetail({ id: 7, name: 'squirtle', species: { url: 'https://pokeapi.co/api/v2/pokemon-species/7/' }, flavor_text_entries: [{ flavor_text: 'shell\ntext', language: { name: 'en' } }] })).toEqual({ id: 7, name: 'squirtle', description: 'shell text' })
  })
})
