<script setup lang="ts">
const { clear } = useUserSession()

async function signOut(): Promise<void> {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-surface-muted font-brand text-ink antialiased">
    <header class="relative border-b border-border bg-surface">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <AppPixelCluster
            tone="accent"
            :cell="3"
          />
          <span class="text-heading text-primary-strong">Quiz Data &amp; AI</span>
        </NuxtLink>
        <AuthState v-slot="{ loggedIn }">
          <div
            v-if="loggedIn"
            class="flex items-center gap-1 rounded-xl border border-border bg-surface p-1"
          >
            <AppButton
              variant="ghost"
              size="md"
              @click="navigateTo('/historico')"
            >
              Histórico
            </AppButton>
            <AppButton
              variant="ghost"
              size="md"
              @click="signOut"
            >
              Sair
            </AppButton>
          </div>
        </AuthState>
      </div>
      <div
        class="h-[3px] bg-gradient-to-r from-primary via-accent to-primary"
        aria-hidden="true"
      />
    </header>

    <main class="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <slot />
    </main>
  </div>
</template>
