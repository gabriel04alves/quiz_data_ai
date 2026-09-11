import { eq, isNotNull, sql } from 'drizzle-orm'
import { rounds, users } from '../db/schema'
import type { QuestionDatabase } from './question-types'
import type { RankingEntry, RankingMe } from '../../shared/types/ranking'

interface UserTotals {
  userId: string
  displayName: string
  pontos: number
  diasJogados: number
  rodadasJogadas: number
  primeiraRodada: number
  melhorRodada: number
}

// Desempate de SPEC.md §7: mais pontos; empatando, menos dias jogados;
// persistindo, menos rodadas jogadas; persistindo, primeira rodada mais
// antiga. Determinístico e estável entre requisições e páginas.
function compareTotals(a: UserTotals, b: UserTotals): number {
  if (a.pontos !== b.pontos) return b.pontos - a.pontos
  if (a.diasJogados !== b.diasJogados) return a.diasJogados - b.diasJogados
  if (a.rodadasJogadas !== b.rodadasJogadas) return a.rodadasJogadas - b.rodadasJogadas
  return a.primeiraRodada - b.primeiraRodada
}

// Recalcula o ranking inteiro a cada chamada: escala pensada para uma equipe
// interna (SPEC.md §7), não para milhares de usuários. A agregação em si é
// feita no banco; só o desempate final roda em memória.
async function loadRankedTotals(db: QuestionDatabase): Promise<UserTotals[]> {
  const rows = await db
    .select({
      userId: rounds.userId,
      displayName: users.displayName,
      pontos: sql<number>`sum(${rounds.score})`,
      diasJogados: sql<number>`count(distinct ${rounds.gameDate})`,
      rodadasJogadas: sql<number>`count(*)`,
      primeiraRodada: sql<number>`min(${rounds.playedAt})`,
      melhorRodada: sql<number>`max(${rounds.score})`,
    })
    .from(rounds)
    .innerJoin(users, eq(users.id, rounds.userId))
    .where(isNotNull(rounds.playedAt))
    .groupBy(rounds.userId, users.displayName)

  return rows.slice().sort(compareTotals)
}

export interface RankingResult {
  entries: RankingEntry[]
  total: number
  me: RankingMe
}

export async function getRanking(db: QuestionDatabase, userId: string, limit: number, offset: number): Promise<RankingResult> {
  const totals = await loadRankedTotals(db)

  const entries: RankingEntry[] = totals.slice(offset, offset + limit).map((entry, index) => ({
    posicao: offset + index + 1,
    user_id: entry.userId,
    display_name: entry.displayName,
    pontos: entry.pontos,
    dias_jogados: entry.diasJogados,
    rodadas_jogadas: entry.rodadasJogadas,
  }))

  const meIndex = totals.findIndex(entry => entry.userId === userId)
  const me: RankingMe = meIndex === -1
    ? { posicao: null, pontos: 0, dias_jogados: 0, rodadas_jogadas: 0, melhor_rodada: 0 }
    : {
        posicao: meIndex + 1,
        pontos: totals[meIndex]!.pontos,
        dias_jogados: totals[meIndex]!.diasJogados,
        rodadas_jogadas: totals[meIndex]!.rodadasJogadas,
        melhor_rodada: totals[meIndex]!.melhorRodada,
      }

  return { entries, total: totals.length, me }
}

// Usado pela tela de resultado (SPEC.md §8), que não precisa da página inteira.
export async function getUserRankingPosition(db: QuestionDatabase, userId: string): Promise<number | null> {
  const totals = await loadRankedTotals(db)
  const index = totals.findIndex(entry => entry.userId === userId)

  return index === -1 ? null : index + 1
}
