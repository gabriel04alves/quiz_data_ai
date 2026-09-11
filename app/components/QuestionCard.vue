<script setup lang="ts">
import { computed } from 'vue'
import type { AnswerResponse, ServedQuestion } from '#shared/types/round'

interface Props {
  question: ServedQuestion
  feedback?: AnswerResponse | null
  chosenIndex?: number | null
  isSubmitting?: boolean
  isReporting?: boolean
  isReported?: boolean

}
const props = withDefaults(defineProps<Props>(), {
  feedback: null,
  chosenIndex: null,
  isSubmitting: false,
  isReporting: false,
  isReported: false,

})
const emit = defineEmits<{
  select: [index: number]
  report: []

}>()
const letters = ['A', 'B', 'C', 'D']
const isAnswered = computed(() => props.feedback !== null)

function optionClasses(index: number): string {
  if (!props.feedback) {
    return props.chosenIndex === index
      ? 'border-primary bg-surface-muted text-ink'
      : 'border-border bg-surface text-ink hover:border-primary hover:bg-surface-muted'
  }

  if (index === props.feedback.correct_index) return 'border-correct bg-correct/10 text-ink'
  if (index === props.chosenIndex) return 'border-incorrect bg-incorrect/10 text-ink'

  return 'border-border bg-surface text-ink/60'
}
</script>

<template>
  <AppCard>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-label uppercase text-primary">
          Pergunta {{ question.position }} de {{ question.total_positions }}
        </p>
        <DifficultyBadge :difficulty="question.difficulty" />
      </div>
    </template>

    <h1 class="text-heading text-ink">{{ question.stem }}</h1>

    <ul class="mt-6 grid gap-3">
      <li
        v-for="(option, index) in question.options"
        :key="index"
      >
        <button
          type="button"
          class="flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-body outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed"
          :class="optionClasses(index)"
          :disabled="isAnswered || isSubmitting"
          @click="emit('select', index)"
        >
          <span class="text-label mt-0.5 text-primary">{{ letters[index] }}</span>
          <span>{{ option }}</span>
        </button>
      </li>
    </ul>

    <div
      v-if="feedback"
      class="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-4"
    >
      <p
        class="text-label uppercase"
        :class="feedback.is_correct ? 'text-correct' : 'text-incorrect'"
      >
        {{ feedback.is_correct ? 'Acertou' : 'Errou' }} · {{ feedback.points_earned }} pontos
      </p>
      <p class="mt-2 text-body text-ink/80">{{ feedback.explanation }}</p>
      <div class="mt-4 flex items-center gap-3">
        <AppButton
          v-if="!isReported"
          variant="ghost"
          :is-loading="isReporting"
          @click="emit('report')"
        >
          Reportar pergunta
        </AppButton>
        <p
          v-else
          class="text-small font-semibold text-primary"
          role="status"
        >
          Pergunta reportada
        </p>
      </div>

    </div>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </AppCard>
</template>
