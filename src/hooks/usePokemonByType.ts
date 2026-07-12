import { useEffect, useState } from 'react'
import { extractIdFromUrl, getType } from '../api/client'
import { PokeApiError } from '../api/types'

export interface PokemonNameEntry {
  id: number
  name: string
}

export function usePokemonByType(type: string | null) {
  const [pokemons, setPokemons] = useState<PokemonNameEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!type) {
      setPokemons([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getType(type)
      .then((data) => {
        if (cancelled) return
        const mapped = data.pokemon.map(({ pokemon }) => ({
          id: extractIdFromUrl(pokemon.url),
          name: pokemon.name,
        }))
        setPokemons(mapped)
      })
      .catch((err) => {
        if (cancelled) return
        const message = err instanceof PokeApiError ? err.message : 'No se pudo filtrar por tipo.'
        setError(message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [type])

  return { pokemons, loading, error }
}
