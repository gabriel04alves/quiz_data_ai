<script setup lang="ts">
import type { StudyMaterialSummary } from '#shared/types/study-material'

interface Props {
  materials: StudyMaterialSummary[]
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="materials.length"
    class="grid gap-5 md:grid-cols-2"
  >
    <StudyMaterialCard
      v-for="(material, index) in materials"
      :key="material.slug"
      :material="material"
      data-aos="fade-up"
      :data-aos-delay="Math.min(index * 50, 150)"
    />
  </div>

  <AppCard
    v-else
    class="text-center"
  >
    <AppIcon
      name="library_books"
      :size="32"
      class="text-primary"
    />
    <h2 class="mt-3 text-heading text-ink">Nenhum material disponível</h2>
    <p class="mt-2 text-body text-ink/70">
      Os materiais aparecerão aqui quando forem adicionados ao acervo.
    </p>
  </AppCard>
</template>
