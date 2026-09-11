// Mensagens de erro da API já vêm em português e prontas para exibição.
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null) return fallback

  const payload = error as { statusMessage?: unknown, data?: { statusMessage?: unknown, message?: unknown } }
  const message = payload.data?.statusMessage ?? payload.statusMessage ?? payload.data?.message

  return typeof message === 'string' && message.trim() ? message : fallback
}
