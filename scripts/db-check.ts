import { createClient } from '@libsql/client'

// Verificação do scaffold (T01): abre o banco configurado e roda SELECT 1.
// Uso: npm run db:check
const url = process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

const client = createClient({ url, authToken })
const result = await client.execute('SELECT 1 AS ok')

console.log(`banco: ${url}`)
console.log(`SELECT 1 => ${JSON.stringify(result.rows[0])}`)
process.exit(result.rows[0]?.ok === 1 ? 0 : 1)
