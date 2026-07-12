import { useEffect, useState } from 'react'
import { getAbility } from '../api/client'
import type { PokemonAbilitySlot } from '../api/types'

export interface TranslatedAbility {
  name: string
  translatedName: string
  isHidden: boolean
}

const translationCache = new Map<string, string>()

export function usePokemonAbilities(abilitySlots: PokemonAbilitySlot[]) {
  const abilitiesKey = abilitySlots.map((s) => s.ability.name).join(',')

  const [abilities, setAbilities] = useState<TranslatedAbility[]>(
    abilitySlots.map((slot) => ({
      name: slot.ability.name,
      translatedName: translationCache.get(slot.ability.name) ?? slot.ability.name,
      isHidden: slot.is_hidden,
    })),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setAbilities(
      abilitySlots.map((slot) => ({
        name: slot.ability.name,
        translatedName: translationCache.get(slot.ability.name) ?? slot.ability.name,
        isHidden: slot.is_hidden,
      })),
    )

    Promise.all(
      abilitySlots.map(async (slot) => {
        const cached = translationCache.get(slot.ability.name)
        if (cached) {
          return { name: slot.ability.name, translatedName: cached, isHidden: slot.is_hidden }
        }

        try {
          const detail = await getAbility(slot.ability.url)
          const translated =
            detail.names.find((n) => n.language.name === 'es')?.name ?? slot.ability.name
          translationCache.set(slot.ability.name, translated)
          return { name: slot.ability.name, translatedName: translated, isHidden: slot.is_hidden }
        } catch {
          return {
            name: slot.ability.name,
            translatedName: slot.ability.name,
            isHidden: slot.is_hidden,
          }
        }
      }),
    ).then((resolved) => {
      if (!cancelled) {
        setAbilities(resolved)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abilitiesKey])

  return { abilities, loading }
}
