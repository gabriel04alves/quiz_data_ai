import { defineConfig } from 'drizzle-kit'

// Banco: SQLite local em dev (file:./.data/dev.db), Turso em produção. Mesmo dialect.
export default defineConfig({
  dialect: 'turso',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  },
})
