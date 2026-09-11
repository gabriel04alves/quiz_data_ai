<script setup lang="ts">
import type { RankingEntry } from '#shared/types/ranking'

interface Props {
  entries: RankingEntry[]
  highlightUserId?: string
  hasMore?: boolean
  isLoadingMore?: boolean
}

withDefaults(defineProps<Props>(), {
  highlightUserId: undefined,
  hasMore: false,
  isLoadingMore: false,
})

defineEmits<{ (e: 'load-more'): void }>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border bg-surface">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr class="border-b border-border bg-surface-muted text-label uppercase text-ink/60">
            <th class="px-4 py-3 sm:px-6">#</th>
            <th class="px-4 py-3 sm:px-6">Jogador</th>
            <th class="px-4 py-3 text-right sm:px-6">Pontos</th>
            <th class="px-4 py-3 text-right sm:px-6">Dias</th>
            <th class="px-4 py-3 text-right sm:px-6">Rodadas</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in entries"
            :key="entry.user_id"
            class="border-b border-border text-body last:border-b-0"
            :class="entry.user_id === highlightUserId ? 'bg-primary/10' : undefined"
          >
            <td class="px-4 py-3 font-semibold text-ink sm:px-6">{{ entry.posicao }}</td>
            <td class="px-4 py-3 text-ink sm:px-6">{{ entry.display_name }}</td>
            <td class="px-4 py-3 text-right font-semibold text-primary-strong sm:px-6">{{ entry.pontos }}</td>
            <td class="px-4 py-3 text-right text-ink/70 sm:px-6">{{ entry.dias_jogados }}</td>
            <td class="px-4 py-3 text-right text-ink/70 sm:px-6">{{ entry.rodadas_jogadas }}</td>
          </tr>
          <tr v-if="entries.length === 0">
            <td
              colspan="5"
              class="px-4 py-6 text-center text-body text-ink/70 sm:px-6"
            >
              Ninguém pontuou ainda. Seja o primeiro a jogar.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="hasMore"
      class="border-t border-border px-4 py-4 text-center sm:px-6"
    >
      <AppButton
        variant="secondary"
        :is-loading="isLoadingMore"
        @click="$emit('load-more')"
      >
        Carregar mais
      </AppButton>
    </div>
  </div>
</template>
