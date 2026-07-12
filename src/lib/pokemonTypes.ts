export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

interface TypeTheme {
  label: string
  color: string
  gradient: string
}

export const TYPE_THEME: Record<PokemonTypeName, TypeTheme> = {
  normal: {
    label: 'Normal',
    color: '#A8A77A',
    gradient: 'from-[#A8A77A] to-[#c6c6a7]',
  },
  fire: {
    label: 'Fuego',
    color: '#EE8130',
    gradient: 'from-[#EE8130] to-[#f5ac78]',
  },
  water: {
    label: 'Agua',
    color: '#6390F0',
    gradient: 'from-[#6390F0] to-[#98d8d8]',
  },
  electric: {
    label: 'Eléctrico',
    color: '#F7D02C',
    gradient: 'from-[#F7D02C] to-[#fae078]',
  },
  grass: {
    label: 'Planta',
    color: '#7AC74C',
    gradient: 'from-[#7AC74C] to-[#a7db8d]',
  },
  ice: {
    label: 'Hielo',
    color: '#96D9D6',
    gradient: 'from-[#96D9D6] to-[#bce6e6]',
  },
  fighting: {
    label: 'Lucha',
    color: '#C22E28',
    gradient: 'from-[#C22E28] to-[#d67873]',
  },
  poison: {
    label: 'Veneno',
    color: '#A33EA1',
    gradient: 'from-[#A33EA1] to-[#c183c1]',
  },
  ground: {
    label: 'Tierra',
    color: '#E2BF65',
    gradient: 'from-[#E2BF65] to-[#ebd69d]',
  },
  flying: {
    label: 'Volador',
    color: '#A98FF3',
    gradient: 'from-[#A98FF3] to-[#c6b7f5]',
  },
  psychic: {
    label: 'Psíquico',
    color: '#F95587',
    gradient: 'from-[#F95587] to-[#fa92b2]',
  },
  bug: {
    label: 'Bicho',
    color: '#A6B91A',
    gradient: 'from-[#A6B91A] to-[#c6d16e]',
  },
  rock: {
    label: 'Roca',
    color: '#B6A136',
    gradient: 'from-[#B6A136] to-[#d1c17d]',
  },
  ghost: {
    label: 'Fantasma',
    color: '#735797',
    gradient: 'from-[#735797] to-[#a292bc]',
  },
  dragon: {
    label: 'Dragón',
    color: '#6F35FC',
    gradient: 'from-[#6F35FC] to-[#a27dfa]',
  },
  dark: {
    label: 'Siniestro',
    color: '#705746',
    gradient: 'from-[#705746] to-[#a29288]',
  },
  steel: {
    label: 'Acero',
    color: '#B7B7CE',
    gradient: 'from-[#B7B7CE] to-[#d1d1e0]',
  },
  fairy: {
    label: 'Hada',
    color: '#D685AD',
    gradient: 'from-[#D685AD] to-[#f4bdc9]',
  },
}

export const TYPE_ORDER = Object.keys(TYPE_THEME) as PokemonTypeName[]

export function getTypeTheme(type: string): TypeTheme {
  return TYPE_THEME[type as PokemonTypeName] ?? TYPE_THEME.normal
}
