import { onBeforeUnmount, shallowRef, watch } from 'vue'

interface Options {
  durationMs?: number
}

// Contagem incremental para pontuação (T12 "placar de arcade"). Pula direto para o valor final
// quando o usuário prefere menos movimento — a informação nunca depende da animação.
export function useCountUp(target: () => number, options: Options = {}) {
  const durationMs = options.durationMs ?? 700
  const prefersReducedMotion = usePrefersReducedMotion()
  const value = shallowRef(target())
  let isFirstRun = true

  let frame: number | undefined

  function stop(): void {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
  }

  function animateTo(finalValue: number): void {
    stop()

    // A primeira renderização só pula direto pro valor — animar aqui produziria um
    // mismatch de hidratação (servidor já manda o valor final, cliente começaria do zero).
    const skipAnimation = isFirstRun || !import.meta.client || prefersReducedMotion.value || durationMs <= 0
    isFirstRun = false

    if (skipAnimation) {
      value.value = finalValue
      return
    }

    const startedAt = performance.now()
    const startValue = value.value

    function tick(now: number): void {
      const progress = Math.min(1, (now - startedAt) / durationMs)
      value.value = Math.round(startValue + (finalValue - startValue) * progress)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        value.value = finalValue
      }
    }

    frame = requestAnimationFrame(tick)
  }

  watch(target, animateTo, { immediate: true })
  onBeforeUnmount(stop)

  return value
}
