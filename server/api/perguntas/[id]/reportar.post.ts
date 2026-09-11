import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '../../../db'
import { questions, roundQuestions, rounds } from '../../../db/schema'
import type { ReportQuestionResponse } from '../../../../shared/types/round'

export default defineEventHandler(async (event): Promise<ReportQuestionResponse> => {
  const { user } = await requireUserSession(event)
  const questionId = getRouterParam(event, 'id')

  if (!questionId) {
    throw createError({ statusCode: 400, statusMessage: 'pergunta n\u00e3o informada' })
  }

  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1)

  if (!question) {
    throw createError({ statusCode: 404, statusMessage: 'pergunta n\u00e3o encontrada' })
  }

  const ownedQuestionRows = await db
    .select({ id: roundQuestions.id, answeredAt: roundQuestions.answeredAt, reportedAt: roundQuestions.reportedAt })
    .from(roundQuestions)
    .innerJoin(rounds, eq(roundQuestions.roundId, rounds.id))
    .where(and(eq(roundQuestions.questionId, questionId), eq(rounds.userId, user.id)))
    .orderBy(asc(roundQuestions.id))

  if (!ownedQuestionRows.length) {
    throw createError({ statusCode: 403, statusMessage: 'esta pergunta \u00e9 de outro jogador' })
  }

  if (ownedQuestionRows.some(row => row.reportedAt !== null)) {
    throw createError({ statusCode: 409, statusMessage: 'esta pergunta j\u00e1 foi reportada por voc\u00ea' })
  }

  const answeredRoundQuestion = ownedQuestionRows.find(row => row.answeredAt !== null)

  if (!answeredRoundQuestion) {
    throw createError({ statusCode: 409, statusMessage: 'responda a pergunta antes de report\u00e1-la' })
  }

  await db.transaction(async transaction => {
    const reported = await transaction
      .update(roundQuestions)
      .set({ reportedAt: Date.now() })
      .where(and(eq(roundQuestions.id, answeredRoundQuestion.id), isNull(roundQuestions.reportedAt)))
      .returning({ id: roundQuestions.id })

    if (reported.length !== 1) {
      throw createError({ statusCode: 409, statusMessage: 'esta pergunta j\u00e1 foi reportada por voc\u00ea' })
    }

    await transaction
      .update(questions)
      .set({
        reports: sql`${questions.reports} + 1`,
        active: sql`case when ${questions.reports} + 1 >= 3 then 0 else ${questions.active} end`,
      })
      .where(eq(questions.id, questionId))
  })

  return { reported: true }
})
