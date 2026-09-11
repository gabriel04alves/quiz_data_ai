<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import type { AnswerResponse, FinishRoundResponse, ServedQuestion } from '#shared/types/round'

import type { ReportQuestionResponse } from '#shared/types/round'
const route = useRoute()
const roundId = computed(() => String(route.params.roundId))

const question = shallowRef<ServedQuestion | null>(null)
const feedback = shallowRef<AnswerResponse | null>(null)
const chosenIndex = shallowRef<number | null>(null)
const isSubmitting = shallowRef(false)
const isLoading = shallowRef(true)
const errorMessage = shallowRef<string | null>(null)

const isReporting = shallowRef(false)
const isReported = shallowRef(false)
const bootstrap = useRoundBootstrap()

const isLastQuestion = computed(() =>
  question.value !== null && question.value.position >= question.value.total_positions)

async function loadQuestion(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null

  try {
    question.value = await $fetch<ServedQuestion>(`/api/rodada/${roundId.value}/pergunta`)
  } catch (error: unknown) {
    errorMessage.value = apiErrorMessage(error, 'não foi possível carregar a pergunta')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Vindo de /jogar a primeira pergunta já veio no corpo de iniciar.
  const prepared = bootstrap.value

  if (prepared && prepared.round_id === roundId.value) {
    question.value = prepared.question
    bootstrap.value = null
    isLoading.value = false
    return
  }

  await loadQuestion()
})

async function answer(index: number): Promise<void> {
  if (!question.value || feedback.value || isSubmitting.value) return

  isSubmitting.value = true
  chosenIndex.value = index
  errorMessage.value = null

  try {
    feedback.value = await $fetch<AnswerResponse>(`/api/rodada/${roundId.value}/responder`, {
      method: 'POST',
      body: {
        question_id: question.value.question_id,
        chosen_index: index,
        // Apenas telemetria de UX: a pontuação usa o tempo do servidor.
        client_elapsed_ms: 0,
      },
    })
  } catch (error: unknown) {
    chosenIndex.value = null
    errorMessage.value = apiErrorMessage(error, 'não foi possível registrar sua resposta')
  } finally {
    isSubmitting.value = false
  }
}

async function goNext(): Promise<void> {
  feedback.value = null
  chosenIndex.value = null
  isReporting.value = false
  isReported.value = false
  await loadQuestion()
}

async function reportQuestion(): Promise<void> {
  if (!question.value || !feedback.value || isReporting.value || isReported.value) return

  isReporting.value = true
  errorMessage.value = null

  try {
    await $fetch<ReportQuestionResponse>(`/api/perguntas/${question.value.question_id}/reportar`, {
      method: 'POST',
    })
    isReported.value = true
  } catch (error: unknown) {
    errorMessage.value = apiErrorMessage(error, 'n\u00e3o foi poss\u00edvel reportar a pergunta')
  } finally {
    isReporting.value = false
  }
}

async function finishRound(): Promise<void> {
  isSubmitting.value = true

  try {
    await $fetch<FinishRoundResponse>(`/api/rodada/${roundId.value}/finalizar`, { method: 'POST' })
    await navigateTo(`/resultado/${roundId.value}`)
  } catch (error: unknown) {
    errorMessage.value = apiErrorMessage(error, 'não foi possível encerrar a rodada')
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-2xl">
    <QuestionCard
      v-if="question"
      :question="question"
      :feedback="feedback"
      :chosen-index="chosenIndex"
      :is-submitting="isSubmitting"
      @select="answer"
      :is-reporting="isReporting"
      :is-reported="isReported"
      @report="reportQuestion"
    >
      <template #footer>
        <div class="grid gap-4">
          <RoundTimer
            :time-limit-ms="question.time_limit_ms"
            :running="feedback === null"
            :reset-key="question.question_id"
          />
          <div
            v-if="feedback"
            class="flex justify-end"
          >
            <AppButton
              v-if="isLastQuestion"
              size="lg"
              :is-loading="isSubmitting"
              @click="finishRound"
            >
              Ver resultado
            </AppButton>
            <AppButton
              v-else
              size="lg"
              :is-loading="isLoading"
              @click="goNext"
            >
              Próxima pergunta
            </AppButton>
          </div>
        </div>
      </template>
    </QuestionCard>

    <AppCard v-else-if="isLoading">
      <p class="text-body text-ink/70">Carregando sua pergunta...</p>
    </AppCard>

    <AppCard v-else>
      <p class="text-body text-ink">{{ errorMessage ?? 'rodada indisponível' }}</p>
      <template #footer>
        <AppButton
          variant="secondary"
          @click="navigateTo('/jogar')"
        >
          Voltar para /jogar
        </AppButton>
      </template>
    </AppCard>

    <p
      v-if="errorMessage && question"
      class="mt-4 text-small font-semibold text-ink"
    >
      <span
        class="mr-1 text-incorrect"
        aria-hidden="true"
      >●</span>
      {{ errorMessage }}
    </p>
  </section>
</template>
