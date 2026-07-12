import { forwardRef, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { VirtuosoGrid } from 'react-virtuoso'
import { PokemonCard } from './PokemonCard'
import { SearchBar } from './SearchBar'
import { TypeFilter } from './TypeFilter'
import { PokemonCardSkeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { usePokemonList } from '../../hooks/usePokemonList'
import { usePokemonNames } from '../../hooks/usePokemonNames'
import { usePokemonByType } from '../../hooks/usePokemonByType'
import { useTypeIndex } from '../../hooks/useTypeIndex'

const GRID_CLASSNAME = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

const GridList = forwardRef<
  HTMLDivElement,
  { style?: CSSProperties; children?: ReactNode; className?: string }
>(({ style, children, className: _ignoredDefaultClassName, ...rest }, ref) => (
  <div ref={ref} style={style} className={GRID_CLASSNAME} {...rest}>
    {children}
  </div>
))
GridList.displayName = 'GridList'

const GridItem = forwardRef<
  HTMLDivElement,
  { children?: ReactNode; className?: string; style?: CSSProperties }
>(({ children, className: _ignoredDefaultClassName, ...rest }, ref) => (
  <div ref={ref} {...rest}>
    {children}
  </div>
))
GridItem.displayName = 'GridItem'

export function PokemonListPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | null>(null)

  const { items, loading, loadingMore, error, hasMore, loadMore } = usePokemonList()
  const { names } = usePokemonNames()
  const { pokemons: typeResults, loading: typeLoading, error: typeError } = usePokemonByType(type)
  const { typeIndex } = useTypeIndex()

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

      {isFiltering ? (
        <div className={GRID_CLASSNAME}>
          {typeLoading
            ? Array.from({ length: 12 }).map((_, i) => <PokemonCardSkeleton key={i} />)
            : visibleItems.map((p) => {
                const types = typeIndex.get(p.name)
                return types ? (
                  <PokemonCard key={p.id} id={p.id} name={p.name} types={types} />
                ) : (
                  <PokemonCardSkeleton key={p.id} number={p.id} />
                )
              })}
        </div>
      ) : loading && visibleItems.length === 0 ? (
        <div className={GRID_CLASSNAME}>
          {Array.from({ length: 12 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <VirtuosoGrid
            useWindowScroll
            data={visibleItems}
            endReached={() => {
              if (hasMore) loadMore()
            }}
            overscan={200}
            components={{ List: GridList, Item: GridItem }}
            itemContent={(_, item) => {
              const types = typeIndex.get(item.name)
              return types ? (
                <PokemonCard id={item.id} name={item.name} types={types} />
              ) : (
                <PokemonCardSkeleton number={item.id} />
              )
            }}
          />
          {loadingMore && (
            <div className={`mt-4 ${GRID_CLASSNAME}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <PokemonCardSkeleton key={`more-${i}`} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
