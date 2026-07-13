import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  enabled: boolean
}

export function useInfiniteScroll<T extends HTMLElement>({
  onIntersect,
  enabled,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T | null>(null)
  const onIntersectRef = useRef(onIntersect)

  useEffect(() => {
    onIntersectRef.current = onIntersect
  })

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current()
        }
      },
      // Precarga antes de que el sentinel entre en pantalla, para que el
      // usuario no llegue a ver el borde del contenido al scrollear rápido.
      { rootMargin: '600px 0px' },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [enabled])

  return sentinelRef
}
