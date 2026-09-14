import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

// Corrige sessões com id de usuário desatualizado antes de qualquer página ou
// API ler o cookie, para que o `user.id` visto no cliente (destaque no ranking,
// chaves de cache) seja o mesmo do banco. Ver também utils/current-user.ts.
export default defineEventHandler(async (event) => {
  const path = event.path
  if (path.startsWith('/_nuxt') || path.startsWith('/__nuxt') || /\.[a-z0-9]+$/i.test(path.split('?')[0]!)) return

  const session = await getUserSession(event)
  const user = session.user
  if (!user?.email) return

  const row = await db.query.users.findFirst({ where: eq(users.email, user.email) })

  if (!row) {
    await clearUserSession(event)
    return
  }

  if (row.id !== user.id || row.displayName !== user.display_name) {
    await replaceUserSession(event, {
      user: { id: row.id, email: row.email, display_name: row.displayName },
    })
  }
})
