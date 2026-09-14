<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type { RankingEntry, RankingResponse } from '#shared/types/ranking'

useHead({ title: 'Ranking' })

const PAGE_SIZE = 50

const { user } = useUserSession()

const { data, error } = await useFetch<RankingResponse>('/api/ranking', {
  key: `ranking-full-${user.value?.id ?? 'anon'}`,
  query: { limit: PAGE_SIZE, offset: 0 },
  getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined,
})

const entries = shallowRef<RankingEntry[]>([])
const total = shallowRef(0)
const isLoadingMore = shallowRef(false)
const loadMoreError = shallowRef<string | null>(null)

// Reinicia a lista sempre que a primeira página chega, para não ficar presa
// ao valor lido no setup.
watch(data, (page) => {
  entries.value = page?.ranking ?? []
  total.value = page?.total ?? 0
}, { immediate: true })

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
  <section class="mx-auto grid w-full max-w-4xl gap-6">
    <AppBackButton />
    <div
      class="flex flex-wrap items-end justify-between gap-3"
      data-aos="fade-up"
    >
      <h1 class="flex items-center gap-2 text-title text-ink">
        <AppIcon
          name="leaderboard"
          :size="28"
          class="text-primary"
        />
        Ranking geral
      </h1>
      <p
        v-if="me && me.posicao !== null"
        class="text-body text-ink/70"
      >
        Você está em <strong class="text-primary-strong">{{ me.posicao }}º lugar</strong>
        de {{ total }} com {{ me.pontos }} pts
      </p>
    </div>

    <AppCard v-if="error">
      <p class="text-body text-ink">
        {{ apiErrorMessage(error, 'não foi possível carregar o ranking') }}
      </p>
    </AppCard>

    <div
      v-else
      data-aos="fade-up"
      data-aos-delay="50"
    >
      <RankingTable
        :entries="entries"
        :highlight-user-id="user?.id"
        :has-more="hasMore"
        :is-loading-more="isLoadingMore"
        @load-more="loadMore"
      />
      <p
        v-if="loadMoreError"
        class="mt-3 text-small font-semibold text-ink"
      >
        <AppIcon
          name="error"
          :size="16"
          class="mr-1 -mt-0.5 text-incorrect"
        />
        {{ loadMoreError }}
      </p>
    </div>
  </section>
</template>
