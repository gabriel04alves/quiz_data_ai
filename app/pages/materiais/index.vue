<script setup lang="ts">
import type { StudyMaterialsResponse } from '#shared/types/study-material'

const { data, error } = await useFetch<StudyMaterialsResponse>('/api/materiais')

useSeoMeta({
  title: 'Materiais de estudo',
  description: 'Acesse as apostilas usadas para criar os desafios do Quiz Data & AI.',
})
</script>

<template>
  <section class="mx-auto grid w-full max-w-5xl gap-8">
    <header
      class="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-9 sm:px-10 sm:py-12"
      data-aos="fade-up"
    >
      <div
        class="pointer-events-none absolute -right-12 -top-14 size-40 rounded-full bg-primary/10"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-8 right-20 size-20 rotate-12 rounded-2xl bg-accent/15"
        aria-hidden="true"
      />
      <AppPixelCluster
        class="absolute right-7 top-7"
        tone="primary"
        :cell="4"
      />
      <p class="relative flex items-center gap-2 text-label uppercase text-primary">
        <AppIcon
          name="local_library"
          :size="17"
        />
        Acervo Data &amp; AI
      </p>
      <h1 class="relative mt-3 max-w-2xl pr-10 text-title text-ink">
        Estude no seu ritmo.
      </h1>
      <p class="relative mt-4 max-w-2xl text-body text-ink/70">
        Consulte as apostilas que dão origem às perguntas, aprofunde os assuntos e volte ao
        desafio quando estiver pronto.
      </p>
    </header>

    <AppCard v-if="error">
      <div class="flex gap-3">
        <AppIcon
          name="error"
          :size="22"
          class="mt-0.5 shrink-0 text-incorrect"
        />
        <div>
          <h2 class="text-heading text-ink">Não foi possível carregar o acervo</h2>
          <p class="mt-2 text-body text-ink/70">
            {{ apiErrorMessage(error, 'tente novamente em alguns instantes') }}
          </p>
        </div>
      </div>
    </AppCard>

    <MaterialsCatalog
      v-else
      :materials="data?.materiais ?? []"
    />
  </section>
</template>
