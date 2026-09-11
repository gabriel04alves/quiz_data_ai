import { asc, eq } from 'drizzle-orm'
import { db } from '../db'
import { chunks } from '../db/schema'

export interface TopicOption {
  slug: string
  label: string
}

// Rótulo exibido: hífens viram espaços, primeira letra maiúscula (SPEC.md §5.0).
function toLabel(slug: string): string {
  const text = slug.replace(/-/g, ' ')

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

export default defineEventHandler(async (event): Promise<{ topicos: TopicOption[] }> => {
  await requireUserSession(event)

  // Fonte de verdade é o banco; a UI nunca lê o filesystem (AGENTS.md regra 5).
  const rows = await db
    .selectDistinct({ topic: chunks.topic })
    .from(chunks)
    .where(eq(chunks.active, 1))
    .orderBy(asc(chunks.topic))

  return { topicos: rows.map(row => ({ slug: row.topic, label: toLabel(row.topic) })) }
})
