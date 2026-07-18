import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isExpanded = isFocused || Boolean(value)

  function handleContainerClick() {
    if (!isExpanded) {
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative w-full sm:w-auto" onClick={handleContainerClick}>
      <label htmlFor="pokemon-search" className="sr-only">
        Buscar Pokémon por nombre
      </label>
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? '100%' : 40 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        aria-expanded={isExpanded}
        className="flex h-10 w-10 items-center overflow-hidden rounded-full border border-white/40 bg-white/50 shadow-inner backdrop-blur-xl focus-within:border-red-400/60 focus-within:ring-2 focus-within:ring-red-300/50 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-red-500/40 sm:w-10 sm:max-w-xs"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="ml-2 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          id="pokemon-search"
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar por nombre..."
          className="w-full min-w-0 bg-transparent px-2 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </motion.div>
    </div>
  )
}
