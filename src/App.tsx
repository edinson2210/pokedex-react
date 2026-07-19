import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/Header'
import { PokemonListPage } from './features/pokemon-list/PokemonListPage'
import { PokemonDetailPage } from './features/pokemon-detail/PokemonDetailPage'
import { ErrorState } from './components/ui/ErrorState'
import { ScrollToTopButton } from './components/ui/ScrollToTopButton'
import { useTypeIndex } from './hooks/useTypeIndex'

function App() {
  // Precalienta el índice de tipos (cache module-level) apenas monta la app,
  // para que esté listo o casi listo cuando la grilla lo necesite.
  useTypeIndex()

  return (
    <ThemeProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<PokemonListPage />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-4xl px-4 py-16">
                <ErrorState message="Esta página no existe." />
              </div>
            }
          />
        </Routes>
      </main>
      <ScrollToTopButton />
    </ThemeProvider>
  )
}

export default App
