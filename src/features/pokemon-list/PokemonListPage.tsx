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
import { useTypeIndex } from '../../hooks/useTypeIndex'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

const GRID_CLASSNAME = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

// Virtualización nativa: el navegador se salta el render/layout de las cards
// fuera de pantalla. contain-intrinsic-size reserva el alto de la card (h-72 =
// 288px) para que la barra de scroll no baile. A diferencia de una librería de
// virtualización JS, nada toca window.scroll — no puede haber saltos de scroll.
const GRID_ITEM_CLASSNAME = '[content-visibility:auto] [contain-intrinsic-size:auto_288px]'

export function PokemonListPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | null>(null)

  const { items, loading, loadingMore, error, hasMore, loadMore } = usePokemonList()
  const { names } = usePokemonNames()
  const { pokemons: typeResults, loading: typeLoading, error: typeError } = usePokemonByType(type)
  const { typeIndex } = useTypeIndex()

  const isFiltering = Boolean(search) || Boolean(type)

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onIntersect: loadMore,
    enabled: hasMore && !loading && !isFiltering,
  })

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

      <div className={GRID_CLASSNAME}>
        {(loading && visibleItems.length === 0) || (isFiltering && typeLoading)
          ? Array.from({ length: 12 }).map((_, i) => <PokemonCardSkeleton key={i} />)
          : visibleItems.map((p) => {
              const types = typeIndex.get(p.name)
              return (
                <div key={p.id} className={GRID_ITEM_CLASSNAME}>
                  {types ? (
                    <PokemonCard id={p.id} name={p.name} types={types} />
                  ) : (
                    <PokemonCardSkeleton number={p.id} />
                  )}
                </div>
              )
            })}
        {!isFiltering &&
          loadingMore &&
          Array.from({ length: 6 }).map((_, i) => <PokemonCardSkeleton key={`more-${i}`} />)}
      </div>

      {!isFiltering && <div ref={sentinelRef} className="h-4 w-full" aria-hidden />}
    </div>
  )
}
