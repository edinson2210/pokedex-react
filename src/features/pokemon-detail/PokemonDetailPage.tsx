import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { StatBar } from './StatBar'
import { EvolutionChainView } from './EvolutionChainView'
import { ShinyToggle } from './ShinyToggle'
import { CryButton } from './CryButton'
import { getTypeTheme } from '../../lib/pokemonTypes'

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { pokemon, species, evolutionChain, loading, error } = usePokemonDetail(name)
  const [isShiny, setIsShiny] = useState(false)

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <ErrorState message={error} />
      </div>
    )
  }

  if (loading || !pokemon) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-48 w-48 rounded-full" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    )
  }

  const mainType = pokemon.types[0]?.type.name ?? 'normal'
  const theme = getTypeTheme(mainType)
  const sprite = isShiny
    ? (pokemon.sprites.other?.['official-artwork']?.front_shiny ?? pokemon.sprites.front_shiny)
    : (pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default)

  const flavorText = species?.flavor_text_entries
    .find((entry) => entry.language.name === 'es')
    ?.flavor_text.replace(/\f|\n/g, ' ')

  const genus = species?.genera.find((g) => g.language.name === 'es')?.genus

  return (
    <div className={`min-h-[calc(100svh-64px)] bg-gradient-to-b ${theme.gradient} bg-opacity-20`}>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-700/80 hover:text-slate-900 dark:text-slate-200/80 dark:hover:text-white"
        >
          ← Volver
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 sm:p-10"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              #{String(pokemon.id).padStart(3, '0')}
            </span>

            <AnimatePresence mode="wait">
              {sprite && (
                <motion.img
                  key={sprite}
                  layoutId={`pokemon-sprite-${pokemon.id}`}
                  src={sprite}
                  alt={`Sprite ${isShiny ? 'shiny' : 'normal'} de ${pokemon.name}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="h-48 w-48 object-contain drop-shadow-2xl"
                />
              )}
            </AnimatePresence>

            <h1 className="text-3xl font-extrabold capitalize text-slate-900 dark:text-slate-100">
              {pokemon.name}
            </h1>
            {genus && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{genus}</p>
            )}

            <div className="flex gap-2">
              {pokemon.types.map((t) => (
                <Badge key={t.type.name} type={t.type.name} />
              ))}
            </div>

            {flavorText && (
              <p className="max-w-lg text-sm text-slate-600 dark:text-slate-300">{flavorText}</p>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <ShinyToggle isShiny={isShiny} onToggle={() => setIsShiny((prev) => !prev)} />
              <CryButton pokemonId={pokemon.id} />
            </div>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Estadísticas
              </h2>
              <div className="flex flex-col gap-3">
                {pokemon.stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    name={stat.stat.name}
                    value={stat.base_stat}
                    color={theme.color}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Detalles
              </h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400 dark:text-slate-500">Altura</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">
                    {pokemon.height / 10} m
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 dark:text-slate-500">Peso</dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-200">
                    {pokemon.weight / 10} kg
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400 dark:text-slate-500">Habilidades</dt>
                  <dd className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {pokemon.abilities.map((a) => a.ability.name).join(', ')}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {evolutionChain && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Cadena evolutiva
              </h2>
              <EvolutionChainView chain={evolutionChain} currentName={pokemon.name} />
            </section>
          )}
        </motion.div>
      </div>
    </div>
  )
}
