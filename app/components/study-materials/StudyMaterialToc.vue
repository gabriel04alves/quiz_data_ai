<script setup lang="ts">
import type { StudyMaterialTocItem } from '#shared/types/study-material'

interface Props {
  items: StudyMaterialTocItem[]
}

defineProps<Props>()

const levelClasses: Record<StudyMaterialTocItem['level'], string> = {
  1: 'font-semibold text-ink',
  2: 'pl-3 text-ink/80',
  3: 'pl-6 text-ink/65',
}
</script>

<template>
  <nav
    v-if="items.length"
    aria-label="Sumário do material"
  >
    <p class="flex items-center gap-2 text-label uppercase text-primary">
      <AppIcon
        name="format_list_bulleted"
        :size="17"
      />
      Nesta apostila
    </p>
    <ol class="mt-4 grid max-h-[calc(100vh-11rem)] gap-1.5 overflow-y-auto pr-2 text-small">
      <li
        v-for="item in items"
        :key="item.id"
      >
        <a
          :href="`#${item.id}`"
          class="block rounded-md border-l-2 border-transparent py-1.5 pr-2 outline-none transition hover:border-accent hover:bg-surface-muted hover:text-primary-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
          :class="levelClasses[item.level]"
        >
          {{ item.label }}
        </a>
      </li>
    </ol>
  </nav>
</template>
