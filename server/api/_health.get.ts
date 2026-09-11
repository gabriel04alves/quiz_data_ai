import { client } from '~~/server/db'

// Rota de diagnóstico do scaffold (T01): confirma que server/db/index.ts abre o
// banco e executa uma query trivial. Só existe em desenvolvimento.
export default defineEventHandler(async () => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Não encontrado' })
  }

  const result = await client.execute('SELECT 1 AS ok')
  return {
    ok: result.rows[0]?.ok === 1,
    driver: '@libsql/client',
  }
})
