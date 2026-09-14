<script setup lang="ts">
import type { StudyMaterialDetail } from '#shared/types/study-material'

interface Props {
  material: StudyMaterialDetail
}

const props = defineProps<Props>()

const formattedWordCount = computed(() => props.material.wordCount.toLocaleString('pt-BR'))
</script>

<template>
  <div class="grid gap-7">
    <header
      class="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-7 sm:px-9 sm:py-9"
      data-aos="fade-up"
    >
      <div
        class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary via-primary to-accent"
        aria-hidden="true"
      />
      <AppPixelCluster
        class="absolute right-6 top-6"
        tone="accent"
        :cell="4"
      />
      <NuxtLink
        to="/materiais"
        class="inline-flex items-center gap-1.5 rounded-md text-small font-semibold text-primary outline-none hover:text-primary-strong focus-visible:ring-2 focus-visible:ring-primary/25"
      >
        <AppIcon
          name="arrow_back"
          :size="17"
        />
        Voltar ao acervo
      </NuxtLink>
      <p class="mt-6 text-label uppercase text-primary">{{ material.topic }}</p>
      <h1 class="mt-3 max-w-4xl pr-12 text-title text-ink">
        {{ material.title }}
      </h1>
      <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-small text-ink/65">
        <span class="inline-flex items-center gap-1.5">
          <AppIcon
            name="notes"
            :size="17"
          />
          {{ formattedWordCount }} palavras
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon
            name="schedule"
            :size="17"
          />
          Cerca de {{ material.readingMinutes }} min de leitura
        </span>
      </div>
    </header>

    <details
      v-if="material.toc.length"
      class="rounded-xl border border-border bg-surface px-5 py-4 lg:hidden"
    >
      <summary class="cursor-pointer font-semibold text-primary-strong outline-none focus-visible:ring-2 focus-visible:ring-primary/25">
        Ver sumário
      </summary>
      <div class="mt-4 border-t border-border pt-4">
        <StudyMaterialToc :items="material.toc" />
      </div>
    </details>

    <div class="grid items-start gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside
        v-if="material.toc.length"
        class="sticky top-6 hidden rounded-2xl border border-border bg-surface px-5 py-5 lg:block"
      >
        <StudyMaterialToc :items="material.toc" />
      </aside>

      <article
        class="min-w-0 rounded-2xl border border-border bg-surface px-5 py-7 text-body leading-7 text-ink shadow-sm sm:px-9 sm:py-10 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-surface-muted [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-ink/80 [&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:mb-4 [&_h1]:mt-12 [&_h1]:scroll-mt-24 [&_h1]:text-title [&_h1]:text-ink [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-3 [&_h2]:text-heading [&_h2]:text-primary-strong [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-[1.125rem] [&_h3]:font-bold [&_h3]:text-ink [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-bold [&_li]:my-1.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-ink [&_pre]:p-5 [&_pre]:text-surface [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_th]:border [&_th]:border-border [&_th]:bg-surface-muted [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
        data-aos="fade-up"
        data-aos-delay="50"
        v-html="material.html"
      />
    </div>
  </div>
</template>
