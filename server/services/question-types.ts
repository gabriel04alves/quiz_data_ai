import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type * as schema from '../db/schema'

export type QuestionDatabase = LibSQLDatabase<typeof schema>
export type QuestionTransaction = Parameters<Parameters<QuestionDatabase['transaction']>[0]>[0]
export const DIFFICULTIES = ['facil', 'facil', 'medio', 'medio', 'medio', 'dificil', 'dificil'] as const
export type Difficulty = typeof DIFFICULTIES[number]
export interface PreparationInput { userId: string, topics?: string[] }
export type PreparationLogger = (event: string, details: Record<string, unknown>) => void
export const logPreparation: PreparationLogger = (event, details) => console.info(`[gerador:${event}] ${JSON.stringify(details)}`)

export class PreparationError extends Error {
  readonly consumeAttempt = false
  constructor(readonly code: 'INSUFFICIENT_MATERIAL' | 'PREPARATION_UNAVAILABLE') {
    super(code === 'INSUFFICIENT_MATERIAL'
      ? 'material insuficiente para uma rodada, escolha outro tópico'
      : 'não conseguimos preparar seu desafio agora, tente em alguns minutos')
    this.name = 'PreparationError'
  }
}

export interface QuestionDraft {
  position: number
  difficulty: Difficulty
  stem: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
}
export interface PreparedQuestion extends QuestionDraft {
  id: string
  chunkId: string
  topic: string
  sourceFile: string
}
// Contrato interno do servidor; contém gabaritos e nunca deve virar payload de API.
export interface PreparedQuestions {
  source: 'llm' | 'fallback'
  userId: string
  questions: PreparedQuestion[]
}
