import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  enabled: boolean
}

export function useInfiniteScroll<T extends HTMLElement>({
  onIntersect,
  enabled,
}: UseInfiniteScrollOptions) {
  const targetRef = useRef<T | null>(null)

  useEffect(() => {
    const node = targetRef.current
    if (!node || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, onIntersect])

  return targetRef
}
