import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { usePokemonAbilities } from '../../hooks/usePokemonAbilities'
import { useTypeEffectiveness } from '../../hooks/useTypeEffectiveness'
import { Badge } from '../../components/ui/Badge'
import { RarityBadge } from '../../components/ui/RarityBadge'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { StatBar } from './StatBar'
import { EvolutionChainView } from './EvolutionChainView'
import { detectRegionalSuffix } from '../../lib/regionalForms'
import { ShinyToggle } from './ShinyToggle'
import { CryButton } from './CryButton'
import { getTypeTheme } from '../../lib/pokemonTypes'

function parseVarietyLabel(varietyName: string, baseName: string): string {
  const suffix = varietyName.startsWith(`${baseName}-`)
    ? varietyName.slice(baseName.length + 1)
    : varietyName

  return suffix
    .split('-')
    .map((part) => (part === 'gmax' ? 'Gigamax' : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
}

export function PokemonDetailPage() {
  const { name } = useParams<{ name: string }>()
  const { pokemon, species, evolutionChain, loading, error } = usePokemonDetail(name)
  const [isShiny, setIsShiny] = useState(false)
  const { abilities } = usePokemonAbilities(pokemon?.abilities ?? [])
  const effectiveness = useTypeEffectiveness(pokemon?.types.map((t) => t.type.name) ?? [])

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
    ? (pokemon.sprites.other?.home?.front_shiny ?? pokemon.sprites.front_shiny)
    : (pokemon.sprites.other?.home?.front_default ?? pokemon.sprites.front_default)

  const flavorText = species?.flavor_text_entries
    .find((entry) => entry.language.name === 'es')
    ?.flavor_text.replace(/\f|\n/g, ' ')

  const genus = species?.genera.find((g) => g.language.name === 'es')?.genus

  const varieties = species && species.varieties.length > 1 ? species.varieties : []
  const isAlternateForm = Boolean(species && pokemon.name !== species.name)

  return (
    <div className="relative min-h-[calc(100svh-64px)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% -10%, ${theme.color}33, transparent 55%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-8">
        <Link
          to={isAlternateForm ? `/pokemon/${species!.name}` : '/'}
          className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-700/80 hover:text-slate-900 dark:text-slate-200/80 dark:hover:text-white"
        >
          ← Volver{isAlternateForm ? ` a ${species!.name}` : ''}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ boxShadow: `0 30px 60px -25px ${theme.color}80` }}
          className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 right-2 select-none font-display text-8xl font-black leading-none opacity-10 sm:text-9xl"
            style={{ color: theme.color }}
          >
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <div className="relative flex flex-col items-center gap-4 text-center">

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

            <h1 className="font-display text-3xl font-extrabold capitalize tracking-wide text-slate-900 dark:text-slate-100">
              {pokemon.name}
            </h1>
            {genus && (
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{genus}</p>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {pokemon.types.map((t) => (
                <Badge key={t.type.name} type={t.type.name} />
              ))}
              {species?.is_mythical && <RarityBadge kind="mythical" />}
              {!species?.is_mythical && species?.is_legendary && <RarityBadge kind="legendary" />}
            </div>

            {flavorText && (
              <p className="max-w-lg text-sm text-slate-600 dark:text-slate-300">{flavorText}</p>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <ShinyToggle isShiny={isShiny} onToggle={() => setIsShiny((prev) => !prev)} />
              <CryButton pokemonId={pokemon.id} />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:col-span-2 lg:row-span-2">
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

            <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
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
              </dl>
            </section>

            <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-x-2 gap-y-2 text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
                {abilities.map((a) => (
                  <span key={a.name}>
                    {a.translatedName}
                    {a.isHidden && (
                      <span
                        className="ml-1 rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[0.6rem] font-semibold normal-case text-slate-500 dark:bg-slate-700/70 dark:text-slate-400"
                        title="Habilidad oculta"
                      >
                        oculta
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </section>

            {effectiveness &&
              (effectiveness.weak.length > 0 ||
                effectiveness.resistant.length > 0 ||
                effectiveness.immune.length > 0) && (
                <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:col-span-2 lg:col-span-3">
                  <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                    Debilidades y resistencias
                  </h2>
                  <div className="flex flex-col gap-3">
                    {effectiveness.weak.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Débil contra
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {effectiveness.weak.map(({ type, multiplier }) => (
                            <Badge key={type} type={type} suffix={`×${multiplier}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    {effectiveness.resistant.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Resiste
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {effectiveness.resistant.map(({ type, multiplier }) => (
                            <Badge key={type} type={type} suffix={`×${multiplier}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    {effectiveness.immune.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Inmune a
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {effectiveness.immune.map((type) => (
                            <Badge key={type} type={type} suffix="×0" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

            {varieties.length > 0 && (
              <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:col-span-2 lg:col-span-3">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  Formas alternativas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {varieties.map((variety) => {
                    const isActive = variety.pokemon.name === pokemon.name
                    const label = variety.is_default
                      ? 'Original'
                      : parseVarietyLabel(variety.pokemon.name, pokemon.species.name)

                    if (isActive) {
                      return (
                        <span
                          key={variety.pokemon.name}
                          aria-current="true"
                          title="Forma seleccionada"
                          style={{ boxShadow: `0 0 0 2px ${theme.color}99` }}
                          className="cursor-default rounded-full border border-white/60 bg-white/80 px-4 py-1.5 text-sm font-semibold capitalize text-slate-900 dark:border-white/20 dark:bg-white/20 dark:text-white"
                        >
                          {label}
                        </span>
                      )
                    }

                    return (
                      <Link
                        key={variety.pokemon.name}
                        to={`/pokemon/${variety.pokemon.name}`}
                        className="rounded-full border border-white/40 bg-white/60 px-4 py-1.5 text-sm font-semibold capitalize text-slate-800 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {evolutionChain && (
              <section className="rounded-2xl border border-white/40 bg-white/40 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:col-span-2 lg:col-span-3">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  Cadena evolutiva
                </h2>
                <EvolutionChainView
                  chain={evolutionChain}
                  currentName={pokemon.name}
                  regionalSuffix={detectRegionalSuffix(pokemon.name)}
                />
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
