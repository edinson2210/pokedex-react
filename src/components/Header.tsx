import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

function PokeballIcon() {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      className="h-8 w-8 drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
      whileHover={{ rotate: 180 }}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      aria-hidden
    >
      <circle cx="20" cy="20" r="18" fill="#ef4444" />
      <path d="M2 20a18 18 0 0 1 36 0Z" fill="#ef4444" />
      <path d="M2 20a18 18 0 0 0 36 0Z" fill="#f8fafc" />
      <rect x="2" y="18" width="36" height="4" fill="#0f172a" />
      <circle cx="20" cy="20" r="7" fill="#0f172a" />
      <circle cx="20" cy="20" r="4.5" fill="#f8fafc" />
    </motion.svg>
  )
}

export function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <PokeballIcon />
          <span className="font-display text-xl font-extrabold tracking-wider text-slate-900 dark:text-slate-100">
            POKÉDEX
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="relative inline-flex h-9 w-16 items-center rounded-full border border-white/40 bg-slate-200/70 px-1 shadow-inner transition-colors dark:border-white/10 dark:bg-slate-800/70"
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow-md dark:bg-slate-900"
            style={{ marginLeft: isDark ? 'auto' : 0 }}
          >
            <span aria-hidden>{isDark ? '🌙' : '☀️'}</span>
          </motion.span>
        </button>
      </div>
    </header>
  )
}
