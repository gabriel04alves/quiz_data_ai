import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

// Fonte única de verdade para animações orientadas por JS (T12) — as puramente CSS usam o
// variant `motion-reduce:` do Tailwind diretamente na classe.
export function usePrefersReducedMotion() {
  const prefersReducedMotion = shallowRef(false)

  let mediaQuery: MediaQueryList | undefined

  function handleChange(event: MediaQueryListEvent): void {
    prefersReducedMotion.value = event.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    mediaQuery.addEventListener('change', handleChange)
  })

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleChange)
  })

  return prefersReducedMotion
}
