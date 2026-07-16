export type PokeListPage = { results: Array<{ url: string }>; next: string | null }
export type PokeDetail = { id: number; name: string; species: { url: string }; flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }> }

export const parsePokemonId = (url: string) => Number(url.split('/').filter(Boolean).pop())

export const mapPokemonDetail = (input: PokeDetail) => {
  const description = input.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text.replaceAll('\n', ' ') ?? ''
  return { id: input.id, name: input.name, description }
}
