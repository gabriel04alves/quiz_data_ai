<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  label: string
  id?: string
  type?: 'text' | 'email' | 'password'
  hint?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  type: 'text',
  hint: undefined,
  error: undefined,
  disabled: false,
})

const model = defineModel<string>({ default: '' })
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const supportId = computed(() => `${inputId.value}-support`)
const supportText = computed(() => props.error ?? props.hint)
</script>

<template>
  <div class="grid gap-2">
    <label
      :for="inputId"
      class="text-small font-semibold text-ink"
    >
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :id="inputId"
      v-model="model"
      :type="type"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="supportText ? supportId : undefined"
      class="min-h-11 w-full rounded-lg border bg-surface px-3.5 py-2.5 text-body text-ink outline-none placeholder:text-ink/50 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-70"
      :class="error ? 'border-incorrect' : 'border-border'"
    >
    <p
      v-if="supportText"
      :id="supportId"
      class="text-small"
      :class="error ? 'font-semibold text-ink' : 'text-ink/70'"
    >
      <span
        v-if="error"
        class="mr-1 text-incorrect"
        aria-hidden="true"
      >●</span>
      {{ supportText }}
    </p>
  </div>
</template>
