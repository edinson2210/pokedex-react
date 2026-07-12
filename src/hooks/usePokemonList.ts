import { useCallback, useEffect, useRef, useState } from 'react'
import { extractIdFromUrl, getPokemonList } from '../api/client'
import { PokeApiError } from '../api/types'

export interface PokemonListItem {
  id: number
  name: string
}

const PAGE_SIZE = 24

export function usePokemonList() {
  const [items, setItems] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)

  const loadPage = useCallback(async (isInitial: boolean) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const data = await getPokemonList(PAGE_SIZE, offsetRef.current)
      const mapped = data.results.map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))
      setItems((prev) => (isInitial ? mapped : [...prev, ...mapped]))
      offsetRef.current += PAGE_SIZE
      setHasMore(Boolean(data.next))
    } catch (err) {
      const message =
        err instanceof PokeApiError ? err.message : 'No se pudo cargar la lista de Pokémon.'
      setError(message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    offsetRef.current = 0
    void loadPage(true)
  }, [loadPage])

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return
    void loadPage(false)
  }, [hasMore, loadPage, loading, loadingMore])

  return { items, loading, loadingMore, error, hasMore, loadMore }
}
