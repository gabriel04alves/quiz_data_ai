export type RoundDifficulty = 'facil' | 'medio' | 'dificil'

export const TOTAL_POSITIONS = 7

// Payload servido ao cliente: enunciado e alternativas apenas. Nunca gabarito.
export interface ServedQuestion {
  question_id: string
  position: number
  difficulty: RoundDifficulty
  stem: string
  options: string[]
  time_limit_ms: number
  total_positions: number
}

export interface StartRoundResponse {
  round_id: string
  question: ServedQuestion
}

export interface AnswerResponse {
  is_correct: boolean
  correct_index: number
  explanation: string
  points_earned: number
  position: number
  total_positions: number
}

export interface ReportQuestionResponse {
  reported: true
}

export interface FinishRoundResponse {
  round_id: string
  score: number
  correct_count: number
  total_positions: number
}

export interface RoundResultQuestion {
  position: number
  difficulty: RoundDifficulty
  stem: string
  options: string[]
  chosen_index: number | null
  correct_index: number
  explanation: string
  is_correct: boolean
  points: number
}

export interface RoundResultResponse {
  round_id: string
  topic: string | null
  topics: string[] | null
  score: number
  correct_count: number
  total_positions: number
  ranking_position: number | null
  questions: RoundResultQuestion[]
}
