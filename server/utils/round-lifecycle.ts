import { and, eq, isNull } from 'drizzle-orm'
import { rounds, type Round } from '../db/schema'
import type { QuestionDatabase } from '../services/question-types'

// Rodada aberta há mais tempo que isso, sem played_at, é considerada
// abandonada: a próxima leitura relevante a encerra sozinha, sem cron
// (SPEC.md §6.3). Independente do bônus de agilidade por pergunta (T07,
// até 45s) — este é o relógio da rodada inteira, a partir de started_at.
export const ROUND_IN_PROGRESS_WINDOW_MS = 10 * 60 * 1000

// Se a rodada está em andamento e passou da janela, encerra com o score
// parcial que já tiver. Idempotente: chamar sobre uma rodada já finalizada
// (ou dentro da janela) apenas devolve a mesma linha, sem escrever no banco.
export async function finalizeIfStale(db: QuestionDatabase, round: Round, now = Date.now()): Promise<Round> {
  if (round.playedAt !== null) return round
  if (now - round.startedAt < ROUND_IN_PROGRESS_WINDOW_MS) return round

  const [finalized] = await db
    .update(rounds)
    .set({ playedAt: now })
    // isNull evita sobrescrever played_at de uma corrida concorrente que já finalizou.
    .where(and(eq(rounds.id, round.id), isNull(rounds.playedAt)))
    .returning()

  return finalized ?? round
}

// Rodada em andamento do usuário, com finalizeIfStale já aplicado. Retorna
// null se não houver nenhuma, ou se a que havia acabou de ser encerrada por
// estar expirada.
export async function findActiveRound(db: QuestionDatabase, userId: string, now = Date.now()): Promise<Round | null> {
  const round = await db.query.rounds.findFirst({
    where: and(eq(rounds.userId, userId), isNull(rounds.playedAt)),
  })

  if (!round) return null

  const current = await finalizeIfStale(db, round, now)

  return current.playedAt === null ? current : null
}
