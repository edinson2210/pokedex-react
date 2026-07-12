import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <span className="text-6xl" role="img" aria-label="Pokébola rota">
        🔴
      </span>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">¡Vaya! Se escapó</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </motion.div>
  )
}
