<script setup lang="ts">
interface Rule {
  icon: string
  text: string
}

// Regras do jogo (SPEC.md §6) — cardzinho reutilizado na landing e na home do usuário logado.
const rules: Rule[] = [
  { icon: 'quiz', text: 'Sete perguntas por rodada, com dificuldade e pontuação crescentes.' },
  { icon: 'bolt', text: 'Sem tempo máximo para responder — mas responder rápido rende bônus de agilidade.' },
  { icon: 'all_inclusive', text: 'Tentativas ilimitadas: jogue quantas rodadas quiser, a qualquer momento.' },
  { icon: 'pause_circle', text: 'Só uma rodada em andamento por vez — comece outra e a anterior é encerrada.' },
  { icon: 'exit_to_app', text: 'Sair no meio encerra a rodada com os pontos já feitos e ela entra no ranking.' },
  { icon: 'leaderboard', text: 'O ranking geral é acumulado: soma de todas as rodadas concluídas.' },
]
</script>

<template>
  <AppCard
    tone="highlight"
    class="relative overflow-hidden"
  >
    <AppPixelCluster
      class="absolute -right-1 -top-1"
      tone="accent"
      :cell="3"
    />
    <template #header>
      <p class="flex items-center gap-2 text-label uppercase text-primary">
        <AppIcon
          name="rule"
          :size="16"
        />
        Regras do jogo
      </p>
    </template>
    <ul class="grid gap-3">
      <li
        v-for="rule in rules"
        :key="rule.text"
        class="flex gap-2.5 text-small text-ink/80"
      >
        <AppIcon
          :name="rule.icon"
          :size="18"
          class="mt-0.5 shrink-0 text-primary"
        />
        {{ rule.text }}
      </li>
    </ul>
  </AppCard>
</template>
