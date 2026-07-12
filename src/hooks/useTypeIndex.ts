import { useEffect, useState } from 'react'
import { getType, getTypes } from '../api/client'
import { TYPE_ORDER } from '../lib/pokemonTypes'

let cache: Map<string, string[]> | null = null
let inFlight: Promise<Map<string, string[]>> | null = null

async function buildTypeIndex(): Promise<Map<string, string[]>> {
  const { results } = await getTypes()
  const types = await Promise.all(results.map((t) => getType(t.name)))

  const index = new Map<string, string[]>()
  for (const type of types) {
    for (const { pokemon } of type.pokemon) {
      const existing = index.get(pokemon.name)
      if (existing) {
        existing.push(type.name)
      } else {
        index.set(pokemon.name, [type.name])
      }
    }
  }

  // La API devuelve los tipos en el orden en que se recorrieron los 18 endpoints
  // (por id interno), no el orden real primario/secundario del Pokémon. Se
  // reordena según TYPE_ORDER para que el acento de color y los badges sean
  // consistentes con el resto de la app (ej. Bulbasaur siempre "planta" antes
  // que "veneno").
  for (const [name, pokemonTypes] of index) {
    pokemonTypes.sort((a, b) => TYPE_ORDER.indexOf(a as never) - TYPE_ORDER.indexOf(b as never))
    index.set(name, pokemonTypes)
  }

  return index
}

export function useTypeIndex() {
  const [typeIndex, setTypeIndex] = useState<Map<string, string[]>>(cache ?? new Map())
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return

    if (!inFlight) {
      inFlight = buildTypeIndex()
    }

    let cancelled = false
    inFlight
      .then((index) => {
        cache = index
        if (!cancelled) setTypeIndex(index)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { typeIndex, loading }
}
