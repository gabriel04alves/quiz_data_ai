<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  label: undefined,
})

const isDecorative = computed(() => !props.label)
</script>

<template>
  <span
    class="material-symbols-outlined align-middle"
    :style="{ fontSize: `${size}px` }"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :role="isDecorative ? undefined : 'img'"
    :aria-label="isDecorative ? undefined : label"
  >{{ name }}</span>
</template>
