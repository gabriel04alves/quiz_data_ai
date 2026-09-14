import { db } from '../db'
import { getRanking } from '../services/ranking'
import type { RankingResponse } from '../../shared/types/ranking'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 50

function parsePagination(query: Record<string, unknown>): { limit: number, offset: number } {
  let limit = DEFAULT_LIMIT
  if (query.limit !== undefined) {
    const parsed = Number(query.limit)
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw createError({ statusCode: 422, statusMessage: 'limit inválido' })
    }
    limit = Math.min(parsed, MAX_LIMIT)
  }

  let offset = 0
  if (query.offset !== undefined) {
    const parsed = Number(query.offset)
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw createError({ statusCode: 422, statusMessage: 'offset inválido' })
    }
    offset = parsed
  }

  return { limit, offset }
}

// Ranking geral acumulado, sem recorte de período (SPEC.md §7). A resposta
// sempre traz o bloco `me` do usuário da sessão, mesmo fora da página pedida.
export default defineEventHandler(async (event): Promise<RankingResponse> => {
  const user = await requireCurrentUser(event)
  const { limit, offset } = parsePagination(getQuery(event))

  return getRanking(db, user.id, limit, offset)
})
