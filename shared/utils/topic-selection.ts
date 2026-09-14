export function serializeTopicSelection(topics: string[] | undefined): string | null {
  if (!topics?.length) return null
  return topics.length === 1 ? topics[0]! : JSON.stringify(topics)
}

export function parseTopicSelection(value: string | null): string[] | null {
  if (value === null) return null

  try {
    const parsed: unknown = JSON.parse(value)
    if (
      Array.isArray(parsed)
      && parsed.length > 0
      && parsed.every(topic => typeof topic === 'string' && topic.length > 0)
    ) {
      return parsed
    }
  } catch {
    // Rodadas antigas e seleções de um assunto armazenam o slug diretamente.
  }

  return [value]
}

export function primaryTopic(topics: string[] | null): string | null {
  return topics?.length === 1 ? topics[0]! : null
}
