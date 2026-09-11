import { and, eq, isNull, sql } from 'drizzle-orm'
import { questions, roundQuestions, rounds } from '../../../db/schema'
import { db } from '../../../db'
import { scoreAnswer } from '../../../services/scoring'
import { TOTAL_POSITIONS, type AnswerResponse } from '../../../../shared/types/round'

interface AnswerBody {
  question_id: string
  chosen_index: number
}

function parseBody(body: unknown): AnswerBody {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw createError({ statusCode: 422, statusMessage: 'resposta inválida' })
  }

  const payload = body as { question_id?: unknown, chosen_index?: unknown }

  if (typeof payload.question_id !== 'string' || !payload.question_id.trim()) {
    throw createError({ statusCode: 422, statusMessage: 'pergunta não informada' })
  }

  if (
    typeof payload.chosen_index !== 'number'
    || !Number.isInteger(payload.chosen_index)
    || payload.chosen_index < 0
    || payload.chosen_index > 3
  ) {
    throw createError({ statusCode: 422, statusMessage: 'alternativa inválida' })
  }

  // client_elapsed_ms é aceito no corpo e deliberadamente ignorado: o tempo que
  // pontua é o do servidor (AGENTS.md regra 3).
  return { question_id: payload.question_id, chosen_index: payload.chosen_index }
}

export default defineEventHandler(async (event): Promise<AnswerResponse> => {
  const round = await requireOwnedRound(event)

  if (round.playedAt !== null) {
    throw createError({ statusCode: 409, statusMessage: 'esta rodada já foi encerrada' })
  }

  const { question_id: questionId, chosen_index: chosenIndex } = parseBody(await readBody(event))

  const [row] = await db
    .select({ roundQuestion: roundQuestions, question: questions })
    .from(roundQuestions)
    .innerJoin(questions, eq(roundQuestions.questionId, questions.id))
    .where(and(eq(roundQuestions.roundId, round.id), eq(roundQuestions.questionId, questionId)))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'pergunta não pertence a esta rodada' })
  }

  if (row.roundQuestion.answeredAt !== null) {
    throw createError({ statusCode: 409, statusMessage: 'esta pergunta já foi respondida' })
  }

  if (row.roundQuestion.servedAt === null) {
    throw createError({ statusCode: 409, statusMessage: 'esta pergunta ainda não foi entregue' })
  }

  const answeredAt = Date.now()
  const isCorrect = chosenIndex === row.question.correctIndex
  const points = scoreAnswer({
    difficulty: row.question.difficulty,
    isCorrect,
    elapsedMs: answeredAt - row.roundQuestion.servedAt,
    timeLimitMs: row.roundQuestion.timeLimitMs,
  })

  await db.transaction(async transaction => {
    const updated = await transaction
      .update(roundQuestions)
      .set({ chosenIndex, isCorrect: isCorrect ? 1 : 0, points, answeredAt })
      // A condição de corrida do duplo envio morre aqui, não na leitura acima.
      .where(and(eq(roundQuestions.id, row.roundQuestion.id), isNull(roundQuestions.answeredAt)))
      .returning({ id: roundQuestions.id })

    if (updated.length !== 1) {
      throw createError({ statusCode: 409, statusMessage: 'esta pergunta já foi respondida' })
    }

    await transaction
      .update(rounds)
      .set({
        score: sql`${rounds.score} + ${points}`,
        correctCount: sql`${rounds.correctCount} + ${isCorrect ? 1 : 0}`,
      })
      .where(eq(rounds.id, round.id))
  })

  return {
    is_correct: isCorrect,
    correct_index: row.question.correctIndex,
    explanation: row.question.explanation,
    points_earned: points,
    position: row.roundQuestion.position,
    total_positions: TOTAL_POSITIONS,
  }
})
