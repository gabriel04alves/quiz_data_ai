import { randomUUID } from 'node:crypto'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { chunks, seenChunks, type Chunk } from '../db/schema'
import {
  DIFFICULTIES, PreparationError, logPreparation,
  type Difficulty, type PreparationInput, type PreparationLogger,
  type PreparedQuestions, type QuestionDatabase, type QuestionTransaction,
} from './question-types'

export interface SampledChunk { chunk: Chunk, position: number, difficulty: Difficulty }
export interface SamplerDependencies {
  db: QuestionDatabase
  now?: () => number
  random?: () => number
  log?: PreparationLogger
}

export async function sampleChunks(input: PreparationInput, dependencies: SamplerDependencies): Promise<SampledChunk[]> {
  const { db, now = Date.now, random = Math.random, log = logPreparation } = dependencies
  const universe = await db.select().from(chunks).where(and(
    eq(chunks.active, 1), input.topics === undefined ? undefined : inArray(chunks.topic, input.topics),
  )).orderBy(chunks.id)
  if (universe.length < 7) throw new PreparationError('INSUFFICIENT_MATERIAL')
  const history = await db.select().from(seenChunks).where(eq(seenChunks.userId, input.userId))
  const timestamp = now()
  let eligible: Chunk[] = []
  for (const days of [7, 3, 0]) {
    const excluded = new Set(history.filter(row => row.seenAt >= timestamp - days * 86_400_000).map(row => row.chunkId))
    eligible = days === 0 ? universe : universe.filter(chunk => !excluded.has(chunk.id))
    if (days !== 7) log('janela_relaxada', { days, available: eligible.length })
    if (eligible.length >= 7) break
  }
  const result: SampledChunk[] = []
  for (const [index, difficulty] of DIFFICULTIES.entries()) {
    const weights = eligible.map(chunk => 1 / (1 + chunk.timesUsed))
    let target = random() * weights.reduce((sum, weight) => sum + weight, 0)
    let selected = eligible.length - 1
    for (let i = 0; i < weights.length; i++) {
      target -= weights[i]!
      if (target < 0) { selected = i; break }
    }
    const [chunk] = eligible.splice(selected, 1)
    result.push({ chunk: chunk!, position: index + 1, difficulty })
  }
  return result
}

// Chamar uma única vez, na transação que confirma a rodada. Preparar não registra uso.
export async function recordPreparedUsage(transaction: QuestionTransaction, prepared: PreparedQuestions, now = Date.now()): Promise<void> {
  const ids = prepared.questions.map(question => question.chunkId)
  if (ids.length !== 7 || new Set(ids).size !== 7) throw new PreparationError('PREPARATION_UNAVAILABLE')
  const updated = await transaction.update(chunks).set({ timesUsed: sql`${chunks.timesUsed} + 1` })
    .where(and(inArray(chunks.id, ids), eq(chunks.active, 1))).returning({ id: chunks.id })
  if (updated.length !== 7) throw new PreparationError('PREPARATION_UNAVAILABLE')
  await transaction.insert(seenChunks).values(ids.map(chunkId => ({
    id: randomUUID(), userId: prepared.userId, chunkId, seenAt: now,
  })))
}
