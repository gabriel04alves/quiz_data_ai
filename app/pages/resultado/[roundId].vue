<script setup lang="ts">
import { computed } from 'vue'
import type { RoundResultResponse } from '#shared/types/round'

const route = useRoute()
const roundId = computed(() => String(route.params.roundId))

const { data, error } = await useFetch<RoundResultResponse>(() => `/api/rodada/${roundId.value}/resultado`)

const letters = ['A', 'B', 'C', 'D']
const animatedScore = useCountUp(() => data.value?.score ?? 0, { durationMs: 1000 })
</script>

<template>
  <section class="mx-auto grid w-full max-w-2xl gap-6">
    <AppCard
      v-if="data"
      tone="highlight"
      class="relative overflow-hidden"
    >
      <AppPixelCluster
        class="absolute right-6 top-6"
        tone="primary"
        :cell="4"
      />
      <p class="text-label uppercase text-primary">Rodada encerrada</p>
      <h1
        class="mt-3 text-display tabular-nums text-primary-strong animate-arcade-pop motion-reduce:animate-none"
        aria-label="Pontuação final"
      >
        {{ animatedScore }}
      </h1>
      <p class="mt-2 text-body text-ink/70">pontos</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <span class="inline-flex items-center rounded-full border border-border bg-surface-muted px-3.5 py-1.5 text-small font-semibold text-ink">
          {{ data.correct_count }} de {{ data.total_positions }} acertos
        </span>
        <span class="inline-flex items-center rounded-full border border-border bg-surface-muted px-3.5 py-1.5 text-small font-semibold text-ink">
          {{ data.ranking_position === null ? 'Ainda fora do ranking geral' : `${data.ranking_position}º lugar no ranking geral` }}
        </span>
      </div>
      <template #footer>
        <div class="flex flex-wrap gap-3">
          <AppButton
            size="lg"
            @click="navigateTo('/jogar')"
          >
            Jogar de novo
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            @click="navigateTo('/')"
          >
            Ver ranking
          </AppButton>
        </div>
      </template>
    </AppCard>

    <AppCard v-else>
      <p class="text-body text-ink">
        {{ apiErrorMessage(error, 'não foi possível carregar este resultado') }}
      </p>
      <template #footer>
        <AppButton
          variant="secondary"
          @click="navigateTo('/jogar')"
        >
          Voltar para /jogar
        </AppButton>
      </template>
    </AppCard>

    <AppCard v-if="data">
      <template #header>
        <h2 class="text-heading text-ink">Quebra por pergunta</h2>
      </template>

      <ol class="grid gap-5">
        <li
          v-for="item in data.questions"
          :key="item.position"
          class="border-b border-border pb-5 last:border-b-0 last:pb-0"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-label uppercase text-primary">
              Pergunta {{ item.position }}
            </p>
            <div class="flex items-center gap-3">
              <DifficultyBadge :difficulty="item.difficulty" />
              <span
                class="text-small font-semibold"
                :class="item.is_correct ? 'text-correct' : 'text-incorrect'"
              >
                {{ item.points }} pts
              </span>
            </div>
          </div>

          <p class="mt-3 text-body text-ink">{{ item.stem }}</p>

          <p class="mt-3 text-small text-ink/80">
            <span class="font-semibold">Correta:</span>
            {{ letters[item.correct_index] }}. {{ item.options[item.correct_index] }}
          </p>
          <p
            v-if="!item.is_correct"
            class="mt-1 text-small text-ink/70"
          >
            <span class="font-semibold">Sua resposta:</span>
            <template v-if="item.chosen_index !== null">
              {{ letters[item.chosen_index] }}. {{ item.options[item.chosen_index] }}
            </template>
            <template v-else>não respondida</template>
          </p>
          <p class="mt-2 text-small text-ink/70">{{ item.explanation }}</p>
        </li>
      </ol>
    </AppCard>
  </section>
</template>
