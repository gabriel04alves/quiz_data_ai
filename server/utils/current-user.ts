import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

export interface CurrentUser {
  id: string
  email: string
  display_name: string
}

// O cookie de sessão pode guardar um id antigo (ex.: banco recriado ou troca
// de SQLite local para Turso). O e-mail é a identidade estável: relemos o
// usuário no banco e, se o id mudou, regravamos a sessão. Sem isso o ranking
// não encontrava o jogador e exibia "Fora do ranking".
export async function requireCurrentUser(event: H3Event): Promise<CurrentUser> {
  const { user } = await requireUserSession(event)

  const row = await db.query.users.findFirst({ where: eq(users.email, user.email) })

  if (!row) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: 'sessão expirada, entre novamente' })
  }

  const current: CurrentUser = { id: row.id, email: row.email, display_name: row.displayName }

  if (user.id !== current.id || user.display_name !== current.display_name) {
    await replaceUserSession(event, { user: current })
  }

  return current
}
