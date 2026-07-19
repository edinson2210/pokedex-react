import type { RarityKind } from '../../lib/legendaryPokemon'

const RARITY_STYLE: Record<RarityKind, { label: string; className: string }> = {
  legendary: {
    label: 'Legendario',
    className: 'from-amber-400 to-yellow-500 text-amber-950',
  },
  mythical: {
    label: 'Mítico',
    className: 'from-fuchsia-400 to-purple-500 text-purple-950',
  },
}

interface RarityBadgeProps {
  kind: RarityKind
  className?: string
}

export function RarityBadge({ kind, className = '' }: RarityBadgeProps) {
  const style = RARITY_STYLE[kind]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-br px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${style.className} ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0" aria-hidden>
        <path d="M10 1.5l2.472 5.008 5.528.803-4 3.899.944 5.507L10 14.5l-4.944 2.217.944-5.507-4-3.899 5.528-.803z" />
      </svg>
      {style.label}
    </span>
  )
}
