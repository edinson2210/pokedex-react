import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function Button({ children, variant = 'primary', className = '', ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'

  const variants: Record<string, string> = {
    primary:
      'bg-slate-900 text-white shadow-md hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
    ghost:
      'bg-slate-200/70 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
