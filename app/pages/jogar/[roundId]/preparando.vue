<script setup lang="ts">
// A preparação acontece dentro de /jogar, onde a rodada ainda nem tem id.
// Esta rota existe só para reload/bookmark de uma rodada já criada.
const route = useRoute()

await navigateTo(`/jogar/${String(route.params.roundId)}`, { replace: true })
</script>

<template>
  <AppCard class="mx-auto w-full max-w-xl">
    <p class="text-body text-ink/70">Abrindo sua rodada...</p>
  </AppCard>
</template>
