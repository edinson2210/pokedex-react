import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  layoutId?: string
}

export function Card({ children, className = '', gradient, layoutId }: CardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {gradient && (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-15 dark:opacity-25 ${gradient}`}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}
