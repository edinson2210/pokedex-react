import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      className={`rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

interface PokemonCardSkeletonProps {
  number?: number
}

export function PokemonCardSkeleton({ number }: PokemonCardSkeletonProps = {}) {
  return (
    <div className="flex h-72 flex-col items-center justify-between gap-2 rounded-3xl border border-white/40 bg-white/50 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      {number !== undefined && (
        <span className="self-start text-xs font-semibold text-slate-300 dark:text-slate-600">
          #{String(number).padStart(3, '0')}
        </span>
      )}
      <Skeleton className="h-24 w-24 shrink-0" />
      <Skeleton className="h-4 w-16" />
      <div className="flex h-8 items-center gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  )
}
