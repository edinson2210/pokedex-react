interface ShinyToggleProps {
  isShiny: boolean
  onToggle: () => void
}

export function ShinyToggle({ isShiny, onToggle }: ShinyToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isShiny}
      aria-label={isShiny ? 'Mostrar forma normal' : 'Mostrar forma shiny'}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        isShiny
          ? 'border-amber-400 bg-amber-400/20 text-amber-600 dark:text-amber-300'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      <span aria-hidden>{isShiny ? '✨' : '⭐'}</span>
      {isShiny ? 'Shiny' : 'Normal'}
    </button>
  )
}
