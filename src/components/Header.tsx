import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🔴
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Pokedex
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg transition hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <span aria-hidden>{isDark ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  )
}
