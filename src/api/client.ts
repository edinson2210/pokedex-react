import { PokeApiError } from './types'
import type {
  EvolutionChain,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  PokemonType,
} from './types'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchJson<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new PokeApiError('No se pudo conectar con la PokeAPI. Verifica tu conexión.', 0)
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new PokeApiError('No encontramos ese Pokémon.', 404)
    }
    throw new PokeApiError(`Error de la PokeAPI (${response.status}).`, response.status)
  }

  return (await response.json()) as T
}

export function getPokemonList(limit = 24, offset = 0): Promise<PokemonListResponse> {
  return fetchJson<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
}

export function getPokemonByName(nameOrId: string | number): Promise<Pokemon> {
  return fetchJson<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`)
}

export function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return fetchJson<PokemonSpecies>(`${BASE_URL}/pokemon-species/${nameOrId}`)
}

export function getEvolutionChain(urlOrId: string | number): Promise<EvolutionChain> {
  const url =
    typeof urlOrId === 'string' && urlOrId.startsWith('http')
      ? urlOrId
      : `${BASE_URL}/evolution-chain/${urlOrId}`
  return fetchJson<EvolutionChain>(url)
}

export function getTypes(): Promise<{ results: { name: string; url: string }[] }> {
  return fetchJson(`${BASE_URL}/type`)
}

export function getType(name: string): Promise<PokemonType> {
  return fetchJson<PokemonType>(`${BASE_URL}/type/${name}`)
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}
