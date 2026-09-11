const protectedRoutePrefixes = ['/jogar', '/resultado', '/historico']

export default defineNuxtRouteMiddleware(async to => {
  const isProtectedRoute = protectedRoutePrefixes.some(prefix =>
    to.path === prefix || to.path.startsWith(`${prefix}/`),
  )

  if (!isProtectedRoute) return

  const { loggedIn, ready, fetch } = useUserSession()

  if (!ready.value) await fetch()

  if (!loggedIn.value) return navigateTo('/')
})
