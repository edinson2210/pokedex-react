import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PokemonCard } from './PokemonCard'
import { SearchBar } from './SearchBar'
import { TypeFilter } from './TypeFilter'
import { PokemonCardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { usePokemonList } from '../../hooks/usePokemonList'
import { usePokemonNames } from '../../hooks/usePokemonNames'
import { usePokemonByType } from '../../hooks/usePokemonByType'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

export function PokemonListPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | null>(null)

  const { items, loading, loadingMore, error, hasMore, loadMore } = usePokemonList()
  const { names } = usePokemonNames()
  const { pokemons: typeResults, loading: typeLoading, error: typeError } = usePokemonByType(type)

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: loadMore,
    enabled: hasMore && !loading && !search && !type,
  })

  const isFiltering = Boolean(search) || Boolean(type)

  const filteredResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    let base = type ? typeResults : names
    if (normalizedSearch) {
      base = base.filter((p) => p.name.includes(normalizedSearch))
    }
    return base.slice(0, 60)
  }, [names, search, type, typeResults])

  const visibleItems = isFiltering ? filteredResults : items

  if (error && !isFiltering) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter selected={type} onSelect={setType} />
      </motion.div>

      {typeError && isFiltering && (
        <div className="mb-6">
          <ErrorState message={typeError} />
        </div>
      )}

      {isFiltering && !typeError && visibleItems.length === 0 && !typeLoading && (
        <p className="py-16 text-center text-slate-500 dark:text-slate-400">
          No encontramos Pokémon que coincidan con tu búsqueda.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {(loading && visibleItems.length === 0) || (isFiltering && typeLoading)
          ? Array.from({ length: 12 }).map((_, i) => <PokemonCardSkeleton key={i} />)
          : visibleItems.map((p) => <PokemonCard key={p.id} id={p.id} name={p.name} />)}
        {!isFiltering &&
          loadingMore &&
          Array.from({ length: 6 }).map((_, i) => <PokemonCardSkeleton key={`more-${i}`} />)}
      </div>

      {!isFiltering && <div ref={sentinelRef} className="h-4 w-full" aria-hidden />}
    </div>
  )
}
