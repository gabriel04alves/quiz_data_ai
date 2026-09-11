import type { Difficulty } from './question-types'

// Pontos base por dificuldade (SPEC.md §6.1).
export const BASE_POINTS: Record<Difficulty, number> = {
  facil: 100,
  medio: 200,
  dificil: 300,
}

// Tempo de referência do bônus de agilidade, congelado em round_questions no
// início da rodada. Não encerra a pergunta: só define até quando há bônus.
export const TIME_LIMITS_MS: Record<Difficulty, number> = {
  facil: 25_000,
  medio: 35_000,
  dificil: 45_000,
}

export interface ScoreInput {
  difficulty: Difficulty
  isCorrect: boolean
  elapsedMs: number
  timeLimitMs: number
}

// pontos = acerto ? round( base × (1 + fator) ) : 0
// fator = max(0, (limite - decorrido) / limite) — responder depois do tempo de
// referência vale a base cheia, nunca zero. Sem bônus de streak, por design.
export function scoreAnswer({ difficulty, isCorrect, elapsedMs, timeLimitMs }: ScoreInput): number {
  if (!isCorrect) return 0

  const elapsed = Number.isFinite(elapsedMs) ? Math.max(0, elapsedMs) : timeLimitMs
  const factor = timeLimitMs > 0 ? Math.max(0, (timeLimitMs - elapsed) / timeLimitMs) : 0

  return Math.round(BASE_POINTS[difficulty] * (1 + factor))
}
