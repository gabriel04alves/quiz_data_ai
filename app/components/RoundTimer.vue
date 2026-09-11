<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

interface Props {
  timeLimitMs: number
  // Congela a contagem quando a pergunta já foi respondida.
  running?: boolean
  // Muda para reiniciar a contagem a cada pergunta.
  resetKey?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  running: true,
  resetKey: 0,
})

const elapsedMs = shallowRef(0)
let startedAt = 0
let frame: number | undefined

function tick(): void {
  elapsedMs.value = performance.now() - startedAt
  frame = requestAnimationFrame(tick)
}

function stop(): void {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
}

function start(): void {
  stop()
  startedAt = performance.now()
  elapsedMs.value = 0
  if (props.running) frame = requestAnimationFrame(tick)
}

onMounted(start)
onBeforeUnmount(stop)

watch(() => props.resetKey, start)
watch(() => props.running, isRunning => {
  if (isRunning) frame = requestAnimationFrame(tick)
  else stop()
})

const seconds = computed(() => Math.floor(elapsedMs.value / 1000))
const bonusRatio = computed(() => Math.max(0, (props.timeLimitMs - elapsedMs.value) / props.timeLimitMs))
const hasBonus = computed(() => bonusRatio.value > 0)
</script>

<template>
  <div class="grid gap-2">
    <div class="flex items-baseline justify-between gap-3">
      <span
        class="text-heading tabular-nums text-ink"
        aria-live="off"
      >
        {{ seconds }}s
      </span>
      <span
        class="text-small"
        :class="hasBonus ? 'text-primary' : 'text-ink/60'"
      >
        {{ hasBonus ? `Bônus de agilidade: ${Math.round(bonusRatio * 100)}%` : 'Sem bônus de tempo — responda com calma' }}
      </span>
    </div>
    <div class="h-2 overflow-hidden rounded-full bg-surface-muted">
      <div
        class="h-full rounded-full bg-primary transition-[width] duration-150 ease-linear"
        :style="{ width: `${bonusRatio * 100}%` }"
      />
    </div>
  </div>
</template>
