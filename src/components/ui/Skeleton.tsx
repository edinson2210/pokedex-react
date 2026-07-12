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
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      {number !== undefined && (
        <span className="self-start text-xs font-semibold text-slate-300 dark:text-slate-600">
          #{String(number).padStart(3, '0')}
        </span>
      )}
      <Skeleton className="h-24 w-24" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  )
}
