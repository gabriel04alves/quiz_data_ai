<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  disabled?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  isLoading: false,
})

defineSlots<{
  default(): unknown
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-surface hover:bg-primary-strong',
  secondary: 'border border-primary bg-surface text-primary hover:bg-surface-muted',
  ghost: 'bg-transparent text-primary hover:bg-surface-muted',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 py-2.5 text-body',
  lg: 'min-h-12 px-6 py-3 text-heading',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50',
  variantClasses[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    :aria-busy="isLoading || undefined"
  >
    <span
      v-if="isLoading"
      class="size-2.5 rounded-full bg-current"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
