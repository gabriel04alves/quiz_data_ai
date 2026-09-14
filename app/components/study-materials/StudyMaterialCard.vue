<script setup lang="ts">
import type { StudyMaterialSummary } from '#shared/types/study-material'

interface Props {
  material: StudyMaterialSummary
}

const props = defineProps<Props>()

const formattedWordCount = computed(() => props.material.wordCount.toLocaleString('pt-BR'))
</script>

<template>
  <article class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 motion-reduce:transform-none motion-reduce:transition-none">
    <div
      class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary to-accent"
      aria-hidden="true"
    />
    <div class="flex flex-1 flex-col px-6 py-6 pl-7">
      <div class="flex items-start justify-between gap-4">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-small font-semibold text-primary-strong">
          <AppIcon
            name="folder_open"
            :size="16"
          />
          {{ material.topic }}
        </span>
        <AppPixelCluster
          tone="accent"
          :cell="3"
        />
      </div>

      <h2 class="mt-5 text-heading text-ink">
        {{ material.title }}
      </h2>

      <dl class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small text-ink/65">
        <div class="flex items-center gap-1.5">
          <dt class="sr-only">Quantidade de palavras</dt>
          <AppIcon
            name="notes"
            :size="17"
          />
          <dd>{{ formattedWordCount }} palavras</dd>
        </div>
        <div class="flex items-center gap-1.5">
          <dt class="sr-only">Tempo estimado de leitura</dt>
          <AppIcon
            name="schedule"
            :size="17"
          />
          <dd>{{ material.readingMinutes }} min</dd>
        </div>
      </dl>

      <NuxtLink
        :to="`/materiais/${material.slug}`"
        class="mt-7 inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5 font-semibold text-primary outline-none transition group-hover:border-primary group-hover:bg-primary group-hover:text-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        Abrir material
        <AppIcon
          name="arrow_forward"
          :size="19"
          class="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
        />
      </NuxtLink>
    </div>
  </article>
</template>
