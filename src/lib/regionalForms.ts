// Formas regionales (Alola, Galar, Hisui, Paldea): la cadena evolutiva de la
// especie siempre viene con los nombres base (ej. Geodude→Graveler→Golem),
// aunque estés viendo "golem-alola". Estas variantes regionales SÍ existen
// como Pokémon propios en la API con su propio sprite — no es una cadena
// distinta, solo hay que resolver cada etapa a su equivalente regional.
const REGIONAL_SUFFIXES = ['alola', 'galar', 'hisui', 'paldea']

export function detectRegionalSuffix(name: string): string | null {
  return REGIONAL_SUFFIXES.find((suffix) => name.endsWith(`-${suffix}`)) ?? null
}
