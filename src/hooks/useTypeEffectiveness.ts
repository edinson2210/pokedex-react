import { useEffect, useState } from 'react'
import { getType } from '../api/client'
import { computeTypeEffectiveness } from '../lib/typeEffectiveness'
import type { TypeEffectivenessResult } from '../lib/typeEffectiveness'
import type { PokemonType } from '../api/types'

// damage_relations es estático por tipo (no cambia por Pokémon), así que se
// cachea a nivel de módulo — Charizard e Ivysaur no vuelven a pedir "fuego" o
// "planta" si ya se resolvieron en otra ficha.
const typeCache = new Map<string, PokemonType>()

async function getCachedType(name: string): Promise<PokemonType> {
  const cached = typeCache.get(name)
  if (cached) return cached
  const type = await getType(name)
  typeCache.set(name, type)
  return type
}

export function useTypeEffectiveness(typeNames: string[]) {
  const [result, setResult] = useState<TypeEffectivenessResult | null>(null)
  const key = typeNames.join(',')

  useEffect(() => {
    let cancelled = false
    setResult(null)

    Promise.all(typeNames.map(getCachedType)).then((types) => {
      if (!cancelled) setResult(computeTypeEffectiveness(types))
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return result
}
