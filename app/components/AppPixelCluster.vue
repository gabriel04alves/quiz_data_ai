<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'primary' | 'accent' | 'ink'

interface Props {
  tone?: Tone
  cell?: number
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'primary',
  cell: 6,
})

// Blob abstrato em formato de losango — motivo geométrico (SPEC.md §8.1: "círculos/quadrados"
// do brand), nunca um mascote ou personagem. 5x5, 1 = pixel aceso.
const pattern = [
  0, 0, 1, 0, 0,
  0, 1, 1, 1, 0,
  1, 1, 1, 1, 1,
  0, 1, 1, 1, 0,
  0, 0, 1, 0, 0,
]

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  ink: 'bg-ink',
}

const cellClass = computed(() => toneClasses[props.tone])
const cellStyle = computed(() => ({ width: `${props.cell}px`, height: `${props.cell}px` }))
const gridStyle = computed(() => ({ gridTemplateColumns: `repeat(5, ${props.cell}px)`, gap: `${Math.max(1, Math.round(props.cell / 3))}px` }))
</script>

<template>
  <div
    class="grid"
    :style="gridStyle"
    aria-hidden="true"
  >
    <span
      v-for="(on, index) in pattern"
      :key="index"
      class="rounded-[1px]"
      :class="on ? cellClass : 'bg-transparent'"
      :style="cellStyle"
    />
  </div>
</template>
