import { useCallback, useEffect, useRef, useState } from 'react'
import { extractIdFromUrl, getPokemonList } from '../api/client'
import { PokeApiError } from '../api/types'

export interface PokemonListItem {
  id: number
  name: string
}

const PAGE_SIZE = 24
const MAX_POKEMON_ID = 1025

export function usePokemonList() {
  const [items, setItems] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const offsetRef = useRef(0)
  // Se incrementa cada vez que el efecto de carga inicial (re)arranca. En
  // desarrollo, React StrictMode ejecuta ese efecto dos veces a propósito; sin
  // esta guarda, la primera invocación (obsoleta) resuelve más tarde y pisa el
  // `offsetRef`/`items` que ya avanzó la segunda, generando un hueco de página
  // (se salta un rango de Pokémon) y un reset violento del scroll.
  const generationRef = useRef(0)

  const loadPage = useCallback(async (isInitial: boolean) => {
    const generation = generationRef.current

    if (isInitial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const data = await getPokemonList(PAGE_SIZE, offsetRef.current)
      if (generation !== generationRef.current) return

      const mapped = data.results
        .map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))
        .filter((p) => p.id <= MAX_POKEMON_ID)
      setItems((prev) => (isInitial ? mapped : [...prev, ...mapped]))
      const reachedEnd = offsetRef.current + PAGE_SIZE >= MAX_POKEMON_ID
      offsetRef.current += PAGE_SIZE
      setHasMore(Boolean(data.next) && !reachedEnd)
    } catch (err) {
      if (generation !== generationRef.current) return
      const message =
        err instanceof PokeApiError ? err.message : 'No se pudo cargar la lista de Pokémon.'
      setError(message)
    } finally {
      if (generation === generationRef.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    generationRef.current += 1
    offsetRef.current = 0
    void loadPage(true)
  }, [loadPage])

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return
    void loadPage(false)
  }, [hasMore, loadPage, loading, loadingMore])

  return { items, loading, loadingMore, error, hasMore, loadMore }
}
