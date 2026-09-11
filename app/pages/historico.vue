<script setup lang="ts">
import type { HistoryResponse } from '#shared/types/ranking'

const { data, error } = await useFetch<HistoryResponse>('/api/historico')

// Rótulo exibido: hífens viram espaços, primeira letra maiúscula (SPEC.md §5.0).
function topicLabel(topic: string | null): string {
  if (!topic) return 'Todos os tópicos'
  const text = topic.replace(/-/g, ' ')
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}
</script>

<template>
  <section class="mx-auto grid w-full max-w-3xl gap-6">
    <AppCard>
      <template #header>
        <h1 class="text-heading text-ink">Seu histórico</h1>
      </template>

      <p
        v-if="error"
        class="text-body text-ink"
      >
        {{ apiErrorMessage(error, 'não foi possível carregar seu histórico') }}
      </p>

      <p
        v-else-if="data && data.rodadas.length === 0"
        class="text-body text-ink/70"
      >
        Você ainda não concluiu nenhuma rodada.
      </p>

      <ol
        v-else-if="data"
        class="grid gap-4"
      >
        <li
          v-for="rodada in data.rodadas"
          :key="rodada.round_id"
          class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
        >
          <div>
            <p class="text-small font-semibold text-ink">{{ rodada.game_date }}</p>
            <p class="text-small text-ink/70">{{ topicLabel(rodada.topic) }}</p>
          </div>
          <div class="text-right">
            <p class="text-body font-semibold text-primary-strong">{{ rodada.score }} pts</p>
            <p class="text-small text-ink/70">{{ rodada.correct_count }} de 7 acertos</p>
          </div>
        </li>
      </ol>
    </AppCard>
  </section>
</template>
