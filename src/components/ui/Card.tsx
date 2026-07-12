import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  gradient?: string
  glowColor?: string
  layoutId?: string
}

export function Card({ children, className = '', gradient, glowColor, layoutId }: CardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={
        glowColor
          ? {
              boxShadow: `0 18px 40px -18px ${glowColor}99, 0 4px 14px -6px ${glowColor}66`,
            }
          : undefined
      }
      className={`group relative overflow-hidden rounded-3xl border border-white/40 bg-white/50 shadow-lg backdrop-blur-xl transition-shadow duration-300 dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      {gradient && (
        <>
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30 dark:opacity-40 ${gradient}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-black/30" />
        </>
      )}
      {glowColor && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-2 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${glowColor}55`, ['--tw-ring-color' as string]: `${glowColor}80` }}
        />
      )}
      {/* Highlight especular "liquid glass": refracción diagonal sutil, sin competir con el gradiente por tipo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-40 mix-blend-overlay dark:from-white/25 dark:opacity-30"
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
