<script setup lang="ts">
import type { StudyMaterialResponse } from '#shared/types/study-material'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { data, error } = await useFetch<StudyMaterialResponse>(() => `/api/materiais/${encodeURIComponent(slug.value)}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: error.value?.statusCode ?? 500,
    statusMessage: apiErrorMessage(error.value, 'não foi possível carregar este material'),
  })
}

const material = computed(() => data.value!.material)

useSeoMeta({
  title: () => material.value.title,
  description: () => `Material de estudo sobre ${material.value.topic} usado no Quiz Data & AI.`,
})
</script>

<template>
  <section class="mx-auto w-full max-w-6xl">
    <StudyMaterialReader :material="material" />
  </section>
</template>
