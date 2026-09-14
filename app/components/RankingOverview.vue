<script setup lang="ts">
import { computed } from 'vue'
import type { RankingResponse } from '#shared/types/ranking'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const TOP_SIZE = 3

// A chave inclui o usuário e o cache só é reaproveitado na hidratação: sem
// isso, voltar para a home após jogar (ou trocar de sessão) reexibia uma
// resposta antiga com `posicao: null` — o "Fora do ranking" indevido.
const { data, error } = await useFetch<RankingResponse>('/api/ranking', {
  key: `ranking-overview-${props.userId}`,
  query: { limit: TOP_SIZE, offset: 0 },
  getCachedData: (key, nuxtApp) => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : undefined,
})

const me = computed(() => data.value?.me)
const topEntries = computed(() => data.value?.ranking ?? [])
const total = computed(() => data.value?.total ?? 0)
const animatedPoints = useCountUp(() => me.value?.pontos ?? 0)
</script>

<template>
  <div class="grid gap-6">
    <AppCard v-if="me">
      <p class="flex items-center gap-2 text-label uppercase text-primary">
        <AppIcon
          name="military_tech"
          :size="16"
        />
        Sua posição
      </p>
      <div class="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 class="text-title text-ink">
          {{ me.posicao === null ? 'Fora do ranking' : `${me.posicao}º lugar` }}
        </h2>
        <p
          v-if="me.posicao !== null"
          class="text-heading tabular-nums text-primary-strong"
          aria-label="Pontuação total"
        >
          {{ animatedPoints }} pts
        </p>
      </div>
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
        {{ me.dias_jogados }} dias jogados · {{ me.rodadas_jogadas }} rodadas jogadas
      </p>
    </AppCard>

    <AppCard v-else-if="error">
      <p class="text-body text-ink">
        {{ apiErrorMessage(error, 'não foi possível carregar sua pontuação') }}
      </p>
    </AppCard>

    <div>
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 class="flex items-center gap-2 text-heading text-ink">
          <AppIcon
            name="leaderboard"
            :size="20"
            class="text-primary"
          />
          Top {{ TOP_SIZE }}
        </h2>
        <NuxtLink
          to="/ranking"
          class="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-body font-semibold text-primary outline-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary"
        >
          Ver ranking completo{{ total > TOP_SIZE ? ` (${total})` : '' }}
          <AppIcon
            name="arrow_forward"
            :size="18"
          />
        </NuxtLink>
      </div>
      <RankingTable
        :entries="topEntries"
        :highlight-user-id="props.userId"
      />
    </div>
  </div>
</template>
