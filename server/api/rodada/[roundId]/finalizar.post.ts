import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { rounds } from '../../../db/schema'
import { TOTAL_POSITIONS, type FinishRoundResponse } from '../../../../shared/types/round'

export default defineEventHandler(async (event): Promise<FinishRoundResponse> => {
  const round = await requireOwnedRound(event)

  // Idempotente: reenvio devolve o estado atual em vez de mover played_at.
  if (round.playedAt === null) {
    await db.update(rounds).set({ playedAt: Date.now() }).where(eq(rounds.id, round.id))
  }

  const finished = await db.query.rounds.findFirst({ where: eq(rounds.id, round.id) })

  if (!finished) {
    throw createError({ statusCode: 404, statusMessage: 'rodada não encontrada' })
  }

  return {
    round_id: finished.id,
    score: finished.score,
    correct_count: finished.correctCount,
    total_positions: TOTAL_POSITIONS,
  }
})
