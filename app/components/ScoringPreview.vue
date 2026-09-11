<script setup lang="ts">
// Prévia/lembrete da pontuação por dificuldade (SPEC.md §6.1) — mesma lista usada na landing
// e na home do usuário logado.
const steps = [
  { difficulty: 'facil' as const, referenceTime: '25s', basePoints: 100 },
  { difficulty: 'medio' as const, referenceTime: '35s', basePoints: 200 },
  { difficulty: 'dificil' as const, referenceTime: '45s', basePoints: 300 },
]
</script>

<template>
  <section aria-labelledby="formato-heading">
    <h2
      id="formato-heading"
      class="flex items-center gap-2 text-heading text-ink"
    >
      <AppIcon
        name="track_changes"
        :size="20"
        class="text-primary"
      />
      Como funciona uma rodada
    </h2>
    <p class="mt-2 text-small text-ink/70">
      A dificuldade — e a pontuação — sobem ao longo das 7 perguntas. Responder rápido
      rende bônus de agilidade.
    </p>
    <ol class="mt-5 grid gap-3 sm:grid-cols-3">
      <li
        v-for="step in steps"
        :key="step.difficulty"
        class="rounded-xl border border-border bg-surface px-4 py-4"
      >
        <DifficultyBadge :difficulty="step.difficulty" />
        <p class="mt-3 text-title text-primary-strong">{{ step.basePoints }}</p>
        <p class="flex items-center gap-1 text-small text-ink/60">
          <AppIcon
            name="schedule"
            :size="14"
          />
          pontos base · até {{ step.referenceTime }}
        </p>
      </li>
    </ol>
  </section>
</template>
