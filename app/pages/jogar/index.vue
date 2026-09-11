<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import type { StartRoundResponse } from '#shared/types/round'
import type { CurrentRoundResponse } from '~~/server/api/rodada/atual.get'
import type { TopicOption } from '~~/server/api/topicos.get'

const bootstrap = useRoundBootstrap()

// Rodada em andamento leva direto para a pergunta atual, sem passar pelo
// formulário de novo (SPEC.md §6.3, item 6).
const { data: currentRound } = await useFetch<CurrentRoundResponse>('/api/rodada/atual')

if (currentRound.value && 'round_id' in currentRound.value) {
  bootstrap.value = currentRound.value
  await navigateTo(`/jogar/${currentRound.value.round_id}`)
}

const { data: topicsData } = await useFetch<{ topicos: TopicOption[] }>('/api/topicos')

const selectedTopic = shallowRef('')
const isPreparing = shallowRef(false)
const isSlow = shallowRef(false)
const errorMessage = shallowRef<string | null>(null)

let slowTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => clearTimeout(slowTimer))

async function startRound(): Promise<void> {
  errorMessage.value = null
  isPreparing.value = true
  isSlow.value = false
  // 20s é o mesmo teto do gerador: passando disso, o fallback já está em curso.
  slowTimer = setTimeout(() => { isSlow.value = true }, 20_000)

  try {
    const response = await $fetch<StartRoundResponse>('/api/rodada/iniciar', {
      method: 'POST',
      body: { topico: selectedTopic.value || undefined },
    })

    // Evita um GET redundante logo após a preparação.
    bootstrap.value = response
    await navigateTo(`/jogar/${response.round_id}`)
  } catch (error: unknown) {
    errorMessage.value = apiErrorMessage(error, 'não conseguimos preparar seu desafio agora, tente em alguns minutos')
    isPreparing.value = false
  } finally {
    clearTimeout(slowTimer)
  }
}
</script>

<template>
  <section class="grid place-items-center">
    <AppCard
      v-if="isPreparing"
      tone="highlight"
      class="relative w-full max-w-xl overflow-hidden"
    >
      <AppPixelCluster
        class="absolute right-6 top-6"
        tone="primary"
        :cell="4"
      />
      <p class="text-label uppercase text-primary">Preparando</p>
      <h1 class="mt-3 text-title text-ink">Sorteando seus trechos.</h1>
      <p class="mt-4 text-body text-ink/70">
        Estamos escolhendo sete trechos do material e escrevendo perguntas inéditas para
        esta rodada. Isso costuma levar poucos segundos.
      </p>
      <p
        v-if="isSlow"
        class="mt-3 text-small text-ink/70"
      >
        Está demorando mais que o normal — já estamos montando sua rodada com perguntas do acervo.
      </p>
      <div
        class="relative mt-6 h-2.5 overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-label="Preparando sua rodada"
      >
        <div
          class="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-primary to-accent motion-reduce:animate-none motion-reduce:w-full motion-reduce:from-primary motion-reduce:to-primary animate-arcade-loading"
        />
      </div>
    </AppCard>

    <AppCard
      v-else
      class="relative w-full max-w-xl overflow-hidden"
    >
      <AppPixelCluster
        class="absolute right-6 top-6"
        tone="accent"
        :cell="4"
      />
      <p class="text-label uppercase text-primary">Nova rodada</p>
      <h1 class="mt-3 text-title text-ink">Sete perguntas, um tópico.</h1>
      <p class="mt-4 text-body text-ink/70">
        A dificuldade sobe ao longo da rodada. Responder rápido rende bônus de agilidade,
        mas não há tempo máximo para responder.
      </p>

      <div class="mt-7 grid gap-2">
        <label
          for="topico"
          class="flex items-center gap-1.5 text-small font-semibold text-ink"
        >
          <AppIcon
            name="topic"
            :size="16"
          />
          Tópico
        </label>
        <select
          id="topico"
          v-model="selectedTopic"
          class="min-h-11 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-body text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
        >
          <option value="">Todos os tópicos</option>
          <option
            v-for="topico in topicsData?.topicos ?? []"
            :key="topico.slug"
            :value="topico.slug"
          >
            {{ topico.label }}
          </option>
        </select>
      </div>

      <p class="mt-6 flex gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3.5 text-small text-ink/80">
        <AppIcon
          name="info"
          :size="18"
          class="mt-0.5 shrink-0 text-ink/50"
        />
        Se você sair no meio, a rodada é encerrada com os pontos que já fez e entra no ranking.
      </p>

      <p
        v-if="errorMessage"
        class="mt-4 text-small font-semibold text-ink"
      >
        <AppIcon
          name="error"
          :size="16"
          class="mr-1 -mt-0.5 text-incorrect"
        />
        {{ errorMessage }}
      </p>

      <template #footer>
        <AppButton
          size="lg"
          @click="startRound"
        >
          <AppIcon
            name="play_arrow"
            :size="20"
          />
          Começar
        </AppButton>
      </template>
    </AppCard>
  </section>
</template>
