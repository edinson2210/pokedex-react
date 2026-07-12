import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { PokemonCardSkeleton } from '../../components/ui/Skeleton'
import { getPokemonByName } from '../../api/client'
import { getTypeTheme } from '../../lib/pokemonTypes'
import type { Pokemon } from '../../api/types'

interface PokemonCardProps {
  id: number
  name: string
}

export function PokemonCard({ id, name }: PokemonCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)

  useEffect(() => {
    let cancelled = false
    getPokemonByName(name)
      .then((data) => {
        if (!cancelled) setPokemon(data)
      })
      .catch(() => {
        if (!cancelled) setPokemon(null)
      })
    return () => {
      cancelled = true
    }
  }, [name])

  if (!pokemon) {
    return <PokemonCardSkeleton number={id} />
  }

  const mainType = pokemon.types[0]?.type.name ?? 'normal'
  const theme = getTypeTheme(mainType)
  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default

  return (
    <Link to={`/pokemon/${pokemon.name}`} aria-label={`Ver detalle de ${pokemon.name}`}>
      <Card gradient={theme.gradient} className="h-full p-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="self-start text-xs font-semibold text-slate-400 dark:text-slate-500">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          {sprite && (
            <motion.img
              layoutId={`pokemon-sprite-${pokemon.id}`}
              src={sprite}
              alt={`Sprite de ${pokemon.name}`}
              loading="lazy"
              className="h-24 w-24 object-contain drop-shadow-md"
            />
          )}
          <h3 className="text-base font-bold capitalize text-slate-900 dark:text-slate-100">
            {pokemon.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((t) => (
              <Badge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
