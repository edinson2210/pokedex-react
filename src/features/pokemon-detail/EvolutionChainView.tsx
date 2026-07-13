import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPokemonByName } from '../../api/client'
import type { EvolutionChain, EvolutionChainLink } from '../../api/types'

interface EvolutionStage {
  name: string
  id: number
}

function extractId(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

function flattenChain(link: EvolutionChainLink): EvolutionStage[][] {
  const stages: EvolutionStage[][] = [
    [{ name: link.species.name, id: extractId(link.species.url) }],
  ]

  let current = link.evolves_to
  while (current.length > 0) {
    stages.push(current.map((c) => ({ name: c.species.name, id: extractId(c.species.url) })))
    current = current.flatMap((c) => c.evolves_to)
  }

  return stages
}

function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

function formatDisplayName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

interface EvolutionChainViewProps {
  chain: EvolutionChain
  currentName: string
  regionalSuffix?: string | null
}

export function EvolutionChainView({ chain, currentName, regionalSuffix }: EvolutionChainViewProps) {
  const baseStages = flattenChain(chain.chain)
  const [stages, setStages] = useState(baseStages)

  useEffect(() => {
    setStages(flattenChain(chain.chain))

    if (!regionalSuffix) return

    let cancelled = false

    async function resolveRegionalStages() {
      const resolved = await Promise.all(
        baseStages.map((group) =>
          Promise.all(
            group.map(async (stage) => {
              try {
                const regional = await getPokemonByName(`${stage.name}-${regionalSuffix}`)
                return { name: regional.name, id: regional.id }
              } catch {
                // Esta etapa no tiene forma regional (ej. algunas líneas solo
                // regionalizan un tramo) — se mantiene la especie base.
                return stage
              }
            }),
          ),
        ),
      )
      if (!cancelled) setStages(resolved)
    }

    void resolveRegionalStages()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, regionalSuffix])

  if (stages.length <= 1) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Este Pokémon no tiene evoluciones conocidas.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {stages.map((stage, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            {stage.map((pokemon) => (
              <Link
                key={pokemon.name}
                to={`/pokemon/${pokemon.name}`}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition hover:scale-105 hover:shadow-md ${
                  pokemon.name === currentName
                    ? 'border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-slate-800'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <img
                  src={spriteUrl(pokemon.id)}
                  alt={`Sprite de ${pokemon.name}`}
                  loading="lazy"
                  className="h-16 w-16 object-contain"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {formatDisplayName(pokemon.name)}
                </span>
              </Link>
            ))}
          </div>
          {index < stages.length - 1 && (
            <span className="text-2xl text-slate-400 dark:text-slate-600" aria-hidden>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
