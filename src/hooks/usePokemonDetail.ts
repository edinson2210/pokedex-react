import { useEffect, useState } from 'react'
import { getEvolutionChain, getPokemonByName, getPokemonSpecies } from '../api/client'
import { PokeApiError } from '../api/types'
import type { EvolutionChain, Pokemon, PokemonSpecies } from '../api/types'

interface PokemonDetailState {
  pokemon: Pokemon | null
  species: PokemonSpecies | null
  evolutionChain: EvolutionChain | null
  loading: boolean
  error: string | null
}

export function usePokemonDetail(nameOrId: string | undefined) {
  const [state, setState] = useState<PokemonDetailState>({
    pokemon: null,
    species: null,
    evolutionChain: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!nameOrId) return
    let cancelled = false

    async function load() {
      setState({ pokemon: null, species: null, evolutionChain: null, loading: true, error: null })

      try {
        const pokemon = await getPokemonByName(nameOrId as string)
        const species = await getPokemonSpecies(pokemon.species.name)
        const evolutionChain = await getEvolutionChain(species.evolution_chain.url)

        if (!cancelled) {
          setState({ pokemon, species, evolutionChain, loading: false, error: null })
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof PokeApiError ? err.message : 'No se pudo cargar este Pokémon.'
          setState({
            pokemon: null,
            species: null,
            evolutionChain: null,
            loading: false,
            error: message,
          })
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [nameOrId])

  return state
}
