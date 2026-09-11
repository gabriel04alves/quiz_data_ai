import { db } from '../../../db'
import type { ServedQuestion } from '../../../../shared/types/round'

export default defineEventHandler(async (event): Promise<ServedQuestion> => {
  const round = await requireOwnedRound(event)

  if (round.playedAt !== null) {
    throw createError({ statusCode: 409, statusMessage: 'esta rodada já foi encerrada' })
  }

  const question = await serveNextQuestion(db, round.id)

  if (!question) {
    throw createError({ statusCode: 409, statusMessage: 'todas as perguntas foram respondidas, encerre a rodada' })
  }

  return question
})
