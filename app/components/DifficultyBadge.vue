<script setup lang="ts">
import { computed } from 'vue'

type Difficulty = 'facil' | 'medio' | 'dificil'

interface Props {
  difficulty: Difficulty
}

const props = defineProps<Props>()

const difficultyOptions: Record<Difficulty, { label: string, classes: string }> = {
  facil: {
    label: 'Fácil',
    classes: 'bg-difficulty-easy text-surface',
  },
  medio: {
    label: 'Médio',
    classes: 'bg-difficulty-medium text-ink',
  },
  dificil: {
    label: 'Difícil',
    classes: 'bg-difficulty-hard text-surface',
  },
}

const option = computed(() => difficultyOptions[props.difficulty])
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-label uppercase"
    :class="option.classes"
  >
    {{ option.label }}
  </span>
</template>
