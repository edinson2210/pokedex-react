import { motion } from 'framer-motion'

const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

const MAX_STAT = 255

interface StatBarProps {
  name: string
  value: number
  color: string
}

export function StatBar({ name, value, color }: StatBarProps) {
  const label = STAT_LABELS[name] ?? name
  const percentage = Math.min(100, (value / MAX_STAT) * 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="w-8 shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">
        {value}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
