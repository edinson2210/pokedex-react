import { getTypeTheme } from '../../lib/pokemonTypes'

interface BadgeProps {
  type: string
  suffix?: string
  className?: string
}

export function Badge({ type, suffix, className = '' }: BadgeProps) {
  const theme = getTypeTheme(type)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm ${className}`}
      style={{
        backgroundColor: theme.color,
        boxShadow: `0 4px 12px -2px ${theme.color}80`,
      }}
    >
      {theme.label}
      {suffix && <span className="font-black opacity-90">{suffix}</span>}
    </span>
  )
}
