import { createClient } from '@libsql/client'

// Re-sincroniza display_name com o local-part literal do e-mail (sem capitalizar),
// para usuários cadastrados antes dessa regra mudar. Uso: npm run db:backfill-names
const url = process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

const client = createClient({ url, authToken })
const { rows } = await client.execute('SELECT id, email, display_name FROM users')

let updated = 0

for (const row of rows) {
  const email = String(row.email)
  const localPart = email.split('@')[0]!

  if (row.display_name !== localPart) {
    await client.execute({
      sql: 'UPDATE users SET display_name = ? WHERE id = ?',
      args: [localPart, String(row.id)],
    })
    updated += 1
  }
}

console.log(`usuários verificados: ${rows.length}, atualizados: ${updated}`)
