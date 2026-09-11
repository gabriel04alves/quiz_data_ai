<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { RankingEntry, RankingResponse } from '#shared/types/ranking'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const PAGE_SIZE = 50

const { data, error } = await useFetch<RankingResponse>('/api/ranking', {
  query: { limit: PAGE_SIZE, offset: 0 },
})

const entries = shallowRef<RankingEntry[]>(data.value?.ranking ?? [])
const total = shallowRef(data.value?.total ?? 0)
const isLoadingMore = shallowRef(false)
const loadMoreError = shallowRef<string | null>(null)

const me = computed(() => data.value?.me)
const hasMore = computed(() => entries.value.length < total.value)

async function loadMore(): Promise<void> {
  loadMoreError.value = null
  isLoadingMore.value = true

  try {
    const page = await $fetch<RankingResponse>('/api/ranking', {
      query: { limit: PAGE_SIZE, offset: entries.value.length },
    })
    entries.value = [...entries.value, ...page.ranking]
    total.value = page.total
  } catch (fetchError: unknown) {
    loadMoreError.value = apiErrorMessage(fetchError, 'não foi possível carregar mais jogadores')
  } finally {
    isLoadingMore.value = false
  }
}
</script>

<template>
  <div class="grid gap-6">
    <AppCard v-if="me">
      <p class="text-label uppercase text-primary">Sua posição</p>
      <h2 class="mt-3 text-title text-ink">
        {{ me.posicao === null ? 'Fora do ranking' : `${me.posicao}º lugar` }}
      </h2>
      <p
        v-if="me.posicao === null"
        class="mt-2 text-body text-ink/70"
      >
        Jogue sua primeira rodada para entrar no ranking.
      </p>
      <p
        v-else
        class="mt-2 text-body text-ink/70"
      >
        {{ me.pontos }} pontos · {{ me.dias_jogados }} dias jogados · {{ me.rodadas_jogadas }} rodadas jogadas
      </p>
    </AppCard>

    <AppCard v-else-if="error">
      <p class="text-body text-ink">
        {{ apiErrorMessage(error, 'não foi possível carregar sua pontuação') }}
      </p>
    </AppCard>

    <div>
      <h2 class="mb-3 text-heading text-ink">Ranking geral</h2>
      <RankingTable
        :entries="entries"
        :highlight-user-id="props.userId"
        :has-more="hasMore"
        :is-loading-more="isLoadingMore"
        @load-more="loadMore"
      />
      <p
        v-if="loadMoreError"
        class="mt-3 text-small font-semibold text-ink"
      >
        <span
          class="mr-1 text-incorrect"
          aria-hidden="true"
        >●</span>
        {{ loadMoreError }}
      </p>
    </div>
  </div>
</template>
