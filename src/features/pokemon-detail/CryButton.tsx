import { useRef, useState } from 'react'

interface CryButtonProps {
  pokemonId: number
}

export function CryButton({ pokemonId }: CryButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  function handlePlay() {
    if (!audioRef.current || unavailable) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => setUnavailable(true))
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setUnavailable(true)}
        preload="none"
      />
      <button
        type="button"
        onClick={handlePlay}
        disabled={unavailable}
        aria-label="Reproducir sonido del Pokémon"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span aria-hidden>{isPlaying ? '🔊' : '🔈'}</span>
        {unavailable ? 'Sonido no disponible' : 'Reproducir grito'}
      </button>
    </>
  )
}
