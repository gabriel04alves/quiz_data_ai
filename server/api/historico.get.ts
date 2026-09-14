import { and, desc, eq, isNotNull } from 'drizzle-orm'
import { db } from '../db'
import { rounds } from '../db/schema'
import type { HistoryResponse } from '../../shared/types/ranking'
import { parseTopicSelection, primaryTopic } from '../../shared/utils/topic-selection'

// Só rodadas concluídas: uma em andamento não é histórico ainda (SPEC.md §7).
export default defineEventHandler(async (event): Promise<HistoryResponse> => {
  const user = await requireCurrentUser(event)

  const rows = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.userId, user.id), isNotNull(rounds.playedAt)))
    .orderBy(desc(rounds.playedAt))

  return {
    rodadas: rows.map(round => {
      const topics = parseTopicSelection(round.topic)
      return {
        round_id: round.id,
        game_date: round.gameDate,
        topic: primaryTopic(topics),
        topics,
        score: round.score,
        correct_count: round.correctCount,
        played_at: round.playedAt!,
      }
    }),
  }
})
