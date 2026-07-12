import { TYPE_ORDER, getTypeTheme } from '../../lib/pokemonTypes'

interface TypeFilterProps {
  selected: string | null
  onSelect: (type: string | null) => void
}

export function TypeFilter({ selected, onSelect }: TypeFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2 sm:max-w-xl"
      role="group"
      aria-label="Filtrar por tipo de Pokémon"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
          selected === null
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        Todos
      </button>
      {TYPE_ORDER.map((type) => {
        const theme = getTypeTheme(type)
        const isActive = selected === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(isActive ? null : type)}
            aria-pressed={isActive}
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition"
            style={{
              backgroundColor: theme.color,
              opacity: isActive ? 1 : 0.55,
            }}
          >
            {theme.label}
          </button>
        )
      })}
    </div>
  )
}
