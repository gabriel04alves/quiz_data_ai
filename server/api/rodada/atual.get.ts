import { db } from '../../db'
import { findActiveRound } from '../../utils/round-lifecycle'
import type { StartRoundResponse } from '../../../shared/types/round'

export type CurrentRoundResponse = StartRoundResponse | { round: null }

// Usado por /jogar para retomar uma rodada em andamento em vez de mostrar o
// formulário de início de novo (SPEC.md §6.3, item 6).
export default defineEventHandler(async (event): Promise<CurrentRoundResponse> => {
  const { user } = await requireUserSession(event)
  const activeRound = await findActiveRound(db, user.id)

  if (!activeRound) return { round: null }

  const question = await serveNextQuestion(db, activeRound.id)

  if (!question) return { round: null }

  return { round_id: activeRound.id, question }
})
