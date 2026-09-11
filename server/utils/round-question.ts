import { and, asc, eq, isNull } from 'drizzle-orm'
import { questions, roundQuestions } from '../db/schema'
import type { QuestionDatabase } from '../services/question-types'
import { TOTAL_POSITIONS, type RoundDifficulty, type ServedQuestion } from '../../shared/types/round'

function parseOptions(raw: string): string[] {
  const parsed: unknown = JSON.parse(raw)

  if (!Array.isArray(parsed) || parsed.some(option => typeof option !== 'string')) {
    throw createError({ statusCode: 500, statusMessage: 'pergunta corrompida, encerre a rodada' })
  }

  return parsed as string[]
}

// Entrega a próxima pergunta não respondida e congela served_at na primeira entrega.
// Retorna null quando as 7 já foram respondidas — cabe ao chamador finalizar.
export async function serveNextQuestion(db: QuestionDatabase, roundId: string): Promise<ServedQuestion | null> {
  const [next] = await db
    .select({ roundQuestion: roundQuestions, question: questions })
    .from(roundQuestions)
    .innerJoin(questions, eq(roundQuestions.questionId, questions.id))
    .where(and(eq(roundQuestions.roundId, roundId), isNull(roundQuestions.answeredAt)))
    .orderBy(asc(roundQuestions.position))
    .limit(1)

  if (!next) return null

  const servedAt = next.roundQuestion.servedAt ?? Date.now()

  if (next.roundQuestion.servedAt === null) {
    await db
      .update(roundQuestions)
      .set({ servedAt })
      .where(and(eq(roundQuestions.id, next.roundQuestion.id), isNull(roundQuestions.servedAt)))
  }

  return {
    question_id: next.question.id,
    position: next.roundQuestion.position,
    difficulty: next.question.difficulty as RoundDifficulty,
    stem: next.question.stem,
    options: parseOptions(next.question.options),
    time_limit_ms: next.roundQuestion.timeLimitMs,
    total_positions: TOTAL_POSITIONS,
  }
}
