export interface RankingEntry {
  posicao: number
  user_id: string
  display_name: string
  pontos: number
  dias_jogados: number
  rodadas_jogadas: number
}

export interface RankingMe {
  posicao: number | null
  pontos: number
  dias_jogados: number
  rodadas_jogadas: number
  melhor_rodada: number
}

export interface RankingResponse {
  ranking: RankingEntry[]
  total: number
  me: RankingMe
}

export interface HistoryEntry {
  round_id: string
  game_date: string
  topic: string | null
  topics: string[] | null
  score: number
  correct_count: number
  played_at: number
}

export interface HistoryResponse {
  rodadas: HistoryEntry[]
}
