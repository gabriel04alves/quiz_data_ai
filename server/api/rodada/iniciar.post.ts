import { randomUUID } from 'node:crypto'
import { LibsqlError } from '@libsql/client'
import { db } from '../../db'
import { questions, roundQuestions, rounds } from '../../db/schema'
import { recordPreparedUsage } from '../../services/chunk-sampler'
import { prepareQuestions } from '../../services/question-generator'
import { PreparationError } from '../../services/question-types'
import { TIME_LIMITS_MS } from '../../services/scoring'
import { findActiveRound } from '../../utils/round-lifecycle'
import type { StartRoundResponse } from '../../../shared/types/round'

// Dia-calendário do fuso do jogo ('YYYY-MM-DD'). Histórico e contagem de dias
// jogados; não é trava de tentativa (SPEC.md §6.3).
function gameDateIn(timeZone: string, now: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof LibsqlError && error.code === 'SQLITE_CONSTRAINT'
}

async function resumeActiveRound(activeRound: { id: string }): Promise<StartRoundResponse> {
  const question = await serveNextQuestion(db, activeRound.id)

  if (!question) {
    throw createError({ statusCode: 500, statusMessage: 'não foi possível retomar sua rodada' })
  }

  return { round_id: activeRound.id, question }
}

export default defineEventHandler(async (event): Promise<StartRoundResponse> => {
  const { user } = await requireUserSession(event)

  // Uma rodada em andamento por vez (SPEC.md §6.3): retoma em vez de criar
  // outra, sem sortear nem chamar o LLM.
  const activeRound = await findActiveRound(db, user.id)
  if (activeRound) return resumeActiveRound(activeRound)

  const body: unknown = await readBody(event)
  let topic: string | undefined

  if (body !== undefined && body !== null) {
    if (typeof body !== 'object' || Array.isArray(body)) {
      throw createError({ statusCode: 422, statusMessage: 'tópico inválido' })
    }

    const raw = 'topico' in body ? (body as { topico?: unknown }).topico : undefined

    if (raw !== undefined && raw !== null && raw !== '') {
      if (typeof raw !== 'string') {
        throw createError({ statusCode: 422, statusMessage: 'tópico inválido' })
      }

      topic = raw.trim() || undefined
    }
  }

  const config = useRuntimeConfig()

  // Única chamada a LLM da rodada (AGENTS.md regra 1), fora de qualquer transação.
  let prepared
  try {
    prepared = await prepareQuestions(
      { userId: user.id, topic },
      { db, apiKey: config.llmApiKey, model: config.llmModel },
    )
  } catch (error: unknown) {
    if (error instanceof PreparationError) {
      throw createError({
        statusCode: error.code === 'INSUFFICIENT_MATERIAL' ? 422 : 503,
        statusMessage: error.message,
      })
    }

    throw error
  }

  const now = Date.now()
  const roundId = randomUUID()

  // Tudo ou nada: falha aqui não deixa rodada pela metade no histórico.
  try {
    await db.transaction(async transaction => {
      for (const question of prepared.questions) {
        await transaction
          .insert(questions)
          .values({
            id: question.id,
            chunkId: question.chunkId,
            topic: question.topic,
            difficulty: question.difficulty,
            stem: question.stem,
            options: JSON.stringify(question.options),
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            sourceFile: question.sourceFile,
            createdAt: now,
          })
          // No fallback as perguntas vêm do banco e já existem.
          .onConflictDoNothing({ target: questions.id })
      }

      // Índice único parcial em rounds(user_id) WHERE played_at IS NULL: se
      // outra requisição concorrente já criou a rodada em andamento deste
      // usuário, este insert falha por constraint em vez de duplicar.
      await transaction.insert(rounds).values({
        id: roundId,
        userId: user.id,
        topic: topic ?? null,
        gameDate: gameDateIn(config.gameTimezone, now),
        startedAt: now,
      })

      await transaction.insert(roundQuestions).values(prepared.questions.map(question => ({
        id: randomUUID(),
        roundId,
        questionId: question.id,
        position: question.position,
        timeLimitMs: TIME_LIMITS_MS[question.difficulty],
      })))

      await recordPreparedUsage(transaction, prepared, now)
    })
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error)) throw error

    // Perdeu a corrida: a rodada que venceu já existe, devolve ela.
    const winner = await findActiveRound(db, user.id)
    if (!winner) throw error

    return resumeActiveRound(winner)
  }

  const question = await serveNextQuestion(db, roundId)

  if (!question) {
    throw createError({ statusCode: 500, statusMessage: 'não foi possível abrir sua rodada' })
  }

  return { round_id: roundId, question }
})
