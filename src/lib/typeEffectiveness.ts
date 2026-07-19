import type { NamedAPIResource, PokemonType } from '../api/types'

export interface TypeEffectivenessEntry {
  type: string
  multiplier: number
}

export interface TypeEffectivenessResult {
  weak: TypeEffectivenessEntry[]
  resistant: TypeEffectivenessEntry[]
  immune: string[]
}

// Combina damage_relations de 1-2 tipos: cada tipo atacante empieza en x1 y se
// multiplica por cada relación que aplique (x2 débil, x0.5 resiste, x0 inmune).
// Un Pokémon dual-tipo puede terminar en x4 o x0.25 si ambos tipos coinciden.
export function computeTypeEffectiveness(types: PokemonType[]): TypeEffectivenessResult {
  const multipliers = new Map<string, number>()

  function apply(list: NamedAPIResource[], factor: number) {
    for (const { name } of list) {
      multipliers.set(name, (multipliers.get(name) ?? 1) * factor)
    }
  }

  for (const type of types) {
    apply(type.damage_relations.double_damage_from, 2)
    apply(type.damage_relations.half_damage_from, 0.5)
    apply(type.damage_relations.no_damage_from, 0)
  }

  const weak: TypeEffectivenessEntry[] = []
  const resistant: TypeEffectivenessEntry[] = []
  const immune: string[] = []

  for (const [type, multiplier] of multipliers) {
    if (multiplier === 1) continue
    if (multiplier === 0) immune.push(type)
    else if (multiplier > 1) weak.push({ type, multiplier })
    else resistant.push({ type, multiplier })
  }

  weak.sort((a, b) => b.multiplier - a.multiplier)
  resistant.sort((a, b) => a.multiplier - b.multiplier)

  return { weak, resistant, immune }
}
