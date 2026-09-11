import type { StartRoundResponse } from '#shared/types/round'

// Carrega a primeira pergunta de /jogar para /jogar/[roundId] sem um GET extra.
export function useRoundBootstrap() {
  return useState<StartRoundResponse | null>('round-bootstrap', () => null)
}
