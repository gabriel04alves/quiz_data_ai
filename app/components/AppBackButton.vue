<script setup lang="ts">
interface Props {
  // Destino quando não há página anterior no histórico (acesso direto pelo link).
  fallback?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '/',
  label: 'Voltar',
})

const router = useRouter()

function goBack(): void {
  if (import.meta.client && window.history.state?.back) {
    router.back()
    return
  }
  navigateTo(props.fallback)
}
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-body font-semibold text-primary outline-none hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary"
    @click="goBack"
  >
    <AppIcon
      name="arrow_back"
      :size="18"
    />
    {{ props.label }}
  </button>
</template>
