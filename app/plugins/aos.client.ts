import AOS from 'aos'
import { isReducedMotionPreferred } from '~/composables/usePrefersReducedMotion'

export default defineNuxtPlugin((nuxtApp) => {
  let isInitialized = false

  function refreshAos(): void {
    if (!isInitialized) return

    requestAnimationFrame(() => AOS.refreshHard())
  }

  nuxtApp.hook('app:mounted', () => {
    AOS.init({
      disable: isReducedMotionPreferred,
      duration: 450,
      easing: 'ease-out-cubic',
      offset: 40,
      once: true,
      mirror: false,
    })
    isInitialized = true
    refreshAos()
  })

  nuxtApp.hook('page:finish', refreshAos)
})
