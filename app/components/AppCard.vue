<script setup lang="ts">
import { computed } from 'vue'

type CardTone = 'default' | 'highlight'

interface Props {
  tone?: CardTone
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'default',
})

defineSlots<{
  header?(): unknown
  default?(): unknown
  footer?(): unknown
}>()

const cardClasses = computed(() => ({
  'border-border bg-surface': props.tone === 'default',
  'border-primary/30 bg-surface-muted': props.tone === 'highlight',
}))
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border"
    :class="cardClasses"
  >
    <header
      v-if="$slots.header"
      class="border-b border-border px-5 py-4 sm:px-6"
    >
      <slot name="header" />
    </header>
    <div
      v-if="$slots.default"
      class="px-5 py-5 sm:px-6 sm:py-6"
    >
      <slot />
    </div>
    <footer
      v-if="$slots.footer"
      class="border-t border-border px-5 py-4 sm:px-6"
    >
      <slot name="footer" />
    </footer>
  </article>
</template>
