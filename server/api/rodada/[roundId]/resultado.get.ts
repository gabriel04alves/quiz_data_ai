import { asc, eq } from 'drizzle-orm'
import { db } from '../../../db'
import { questions, roundQuestions } from '../../../db/schema'
import { TOTAL_POSITIONS, type RoundDifficulty, type RoundResultResponse } from '../../../../shared/types/round'

export default defineEventHandler(async (event): Promise<RoundResultResponse> => {
  const round = await requireOwnedRound(event)

  // Gabarito só depois do encerramento — antes disso seria vazamento.
  if (round.playedAt === null) {
    throw createError({ statusCode: 409, statusMessage: 'esta rodada ainda está em andamento' })
  }

  const rows = await db
    .select({ roundQuestion: roundQuestions, question: questions })
    .from(roundQuestions)
    .innerJoin(questions, eq(roundQuestions.questionId, questions.id))
    .where(eq(roundQuestions.roundId, round.id))
    .orderBy(asc(roundQuestions.position))

  return {
    round_id: round.id,
    topic: round.topic,
    score: round.score,
    correct_count: round.correctCount,
    total_positions: TOTAL_POSITIONS,
    questions: rows.map(({ roundQuestion, question }) => ({
      position: roundQuestion.position,
      difficulty: question.difficulty as RoundDifficulty,
      stem: question.stem,
      options: JSON.parse(question.options) as string[],
      chosen_index: roundQuestion.chosenIndex,
      correct_index: question.correctIndex,
      explanation: question.explanation,
      is_correct: roundQuestion.isCorrect === 1,
      points: roundQuestion.points ?? 0,
    })),
  }
})
