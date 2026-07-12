import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/Header'
import { PokemonListPage } from './features/pokemon-list/PokemonListPage'
import { PokemonDetailPage } from './features/pokemon-detail/PokemonDetailPage'
import { ErrorState } from './components/ui/ErrorState'

function App() {
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
    </ThemeProvider>
  )
}

export default App
