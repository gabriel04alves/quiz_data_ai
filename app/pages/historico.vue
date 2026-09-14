<script setup lang="ts">
import type { HistoryResponse } from '#shared/types/ranking'

const { data, error } = await useFetch<HistoryResponse>('/api/historico')

// Rótulo exibido: hífens viram espaços, primeira letra maiúscula (SPEC.md §5.0).
function topicLabel(topic: string): string {
  const text = topic.replace(/-/g, ' ')
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

function topicsLabel(topics: string[] | null): string {
  if (!topics) return 'Todos os tópicos'
  return topics.map(topicLabel).join(', ')
}
</script>

<template>
  <section class="mx-auto grid w-full max-w-3xl gap-6">
    <AppBackButton />
    <AppCard
      class="relative overflow-hidden"
      data-aos="fade-up"
    >
      <AppPixelCluster
        class="absolute right-6 top-6"
        tone="accent"
        :cell="4"
      />
      <template #header>
        <h1 class="flex items-center gap-2 text-heading text-ink">
          <AppIcon
            name="history"
            :size="20"
            class="text-primary"
          />
          Seu histórico
        </h1>
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
            <p class="flex items-center gap-1.5 text-small font-semibold text-ink">
              <AppIcon
                name="calendar_month"
                :size="16"
                class="text-ink/50"
              />
              {{ rodada.game_date }}
            </p>
            <p class="text-small text-ink/70">{{ topicsLabel(rodada.topics) }}</p>
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
