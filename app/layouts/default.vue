<script setup lang="ts">
const { clear } = useUserSession()

async function signOut(): Promise<void> {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-surface-muted font-brand text-ink antialiased">
    <header
      class="relative border-b border-border bg-surface"
      data-aos="fade-down"
      data-aos-duration="350"
      data-aos-offset="0"
    >
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
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
        <nav
          class="flex w-full items-center justify-end gap-1 sm:w-auto"
          aria-label="Navegação principal"
        >
          <NuxtLink
            to="/materiais"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-body font-semibold text-primary outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            active-class="bg-primary/10 text-primary-strong"
          >
            <AppIcon
              name="local_library"
              :size="18"
            />
            Materiais
          </NuxtLink>
          <AuthState v-slot="{ loggedIn }">
            <div
              v-if="loggedIn"
              class="flex items-center gap-1 rounded-xl border border-border bg-surface p-1"
            >
              <AppButton
                variant="ghost"
                size="md"
                @click="navigateTo('/ranking')"
              >
                <AppIcon
                  name="leaderboard"
                  :size="18"
                />
                Ranking
              </AppButton>
              <AppButton
                variant="ghost"
                size="md"
                @click="navigateTo('/historico')"
              >
                <AppIcon
                  name="history"
                  :size="18"
                />
                Histórico
              </AppButton>
              <AppButton
                variant="ghost"
                size="md"
                @click="signOut"
              >
                <AppIcon
                  name="logout"
                  :size="18"
                />
                Sair
              </AppButton>
            </div>
          </AuthState>
        </nav>
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
