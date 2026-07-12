export interface NamedAPIResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedAPIResource[]
}

export interface PokemonTypeSlot {
  slot: number
  type: NamedAPIResource
}

export interface PokemonAbilitySlot {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  back_default: string | null
  back_shiny: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
      front_shiny?: string | null
    }
    home?: {
      front_default: string | null
      front_shiny: string | null
    }
  }
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  order: number
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  stats: PokemonStat[]
  sprites: PokemonSprites
  species: NamedAPIResource
}

export interface PokemonSpeciesFlavorTextEntry {
  flavor_text: string
  language: NamedAPIResource
  version: NamedAPIResource
}

export interface PokemonSpeciesGenus {
  genus: string
  language: NamedAPIResource
}

export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: PokemonSpeciesFlavorTextEntry[]
  genera: PokemonSpeciesGenus[]
  evolution_chain: { url: string }
  color: NamedAPIResource
}

export interface EvolutionDetail {
  min_level: number | null
  trigger: NamedAPIResource
  item: NamedAPIResource | null
}

export interface EvolutionChainLink {
  species: NamedAPIResource
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface PokemonType {
  id: number
  name: string
  pokemon: { pokemon: NamedAPIResource; slot: number }[]
}

export class PokeApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PokeApiError'
    this.status = status
  }
}
