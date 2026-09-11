import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { rounds, type Round } from '../db/schema'
import { finalizeIfStale } from './round-lifecycle'

// Toda rota de rodada passa por aqui: sessão obrigatória e posse do roundId.
export async function requireOwnedRound(event: H3Event): Promise<Round> {
  const { user } = await requireUserSession(event)
  const roundId = getRouterParam(event, 'roundId')

  if (!roundId) {
    throw createError({ statusCode: 400, statusMessage: 'rodada não informada' })
  }

  const round = await db.query.rounds.findFirst({ where: eq(rounds.id, roundId) })

  if (!round) {
    throw createError({ statusCode: 404, statusMessage: 'rodada não encontrada' })
  }

  if (round.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'esta rodada é de outro jogador' })
  }

  // Rodada abandonada há mais de 10 minutos é encerrada aqui, antes de
  // qualquer operação enxergar o estado (SPEC.md §6.3).
  return finalizeIfStale(db, round)
}
