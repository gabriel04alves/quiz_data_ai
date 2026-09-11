import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

const corporateEmailPattern = /^[a-z0-9._%+-]+@selbetti\.com\.br$/

function deriveDisplayName(email: string): string {
  return email.split('@')[0]!
}

export default defineEventHandler(async event => {
  const body: unknown = await readBody(event)

  if (
    typeof body !== 'object'
    || body === null
    || !('email' in body)
    || typeof body.email !== 'string'
  ) {
    throw createError({
      statusCode: 422,
      statusMessage: 'use seu e-mail @selbetti.com.br',
    })
  }

  const email = body.email.trim().toLowerCase()

  if (!corporateEmailPattern.test(email)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'use seu e-mail @selbetti.com.br',
    })
  }

  const displayName = deriveDisplayName(email)

  await db.insert(users).values({
    id: randomUUID(),
    email,
    displayName,
    createdAt: Date.now(),
  }).onConflictDoNothing({ target: users.email })

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'não foi possível iniciar sua sessão',
    })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      display_name: user.displayName,
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      display_name: user.displayName,
    },
  }
})
