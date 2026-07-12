import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { getTypeTheme } from '../../lib/pokemonTypes'

interface PokemonCardProps {
  id: number
  name: string
  types: string[]
}

function dreamWorldSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
}

function homeSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
}

export function PokemonCard({ id, name, types }: PokemonCardProps) {
  const [spriteSrc, setSpriteSrc] = useState(() => dreamWorldSprite(id))

  const mainType = types[0] ?? 'normal'
  const theme = getTypeTheme(mainType)

  return (
    <Link to={`/pokemon/${name}`} aria-label={`Ver detalle de ${name}`}>
      <Card gradient={theme.gradient} glowColor={theme.color} className="h-72 p-5">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-3 right-1 select-none font-display text-6xl font-black leading-none opacity-15 dark:opacity-20"
          style={{ color: theme.color }}
        >
          #{String(id).padStart(3, '0')}
        </span>
        {/*
          Alto fijo + distribución justify-between: VirtuosoGrid estima el
          tamaño de fila a partir del alto de los items ya montados. Si la
          altura varía según la cantidad de badges de tipo, esa estimación
          cambia en cada tanda cargada y el scroll "salta". Todas las cards
          deben medir exactamente lo mismo.
        */}
        <div className="relative flex h-full flex-col items-center justify-between gap-2 text-center">
          <motion.img
            layoutId={`pokemon-sprite-${id}`}
            src={spriteSrc}
            onError={() => setSpriteSrc((current) => (current === homeSprite(id) ? current : homeSprite(id)))}
            alt={`Sprite de ${name}`}
            loading="lazy"
            className="h-24 w-24 shrink-0 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-110"
          />
          <h3 className="line-clamp-1 w-full font-display text-sm font-bold capitalize tracking-wide text-slate-900 dark:text-slate-100">
            {name}
          </h3>
          <div className="flex h-8 flex-wrap items-center justify-center gap-2 overflow-hidden">
            {types.map((t) => (
              <Badge key={t} type={t} />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
