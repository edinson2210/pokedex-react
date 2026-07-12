import { useEffect, useState } from 'react'
import { extractIdFromUrl, getPokemonList } from '../api/client'

export interface PokemonNameEntry {
  id: number
  name: string
}

let cache: PokemonNameEntry[] | null = null

export function usePokemonNames() {
  const [names, setNames] = useState<PokemonNameEntry[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return

    let cancelled = false
    getPokemonList(2000, 0)
      .then((data) => {
        if (cancelled) return
        const mapped = data.results.map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))
        cache = mapped
        setNames(mapped)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { names, loading }
}
