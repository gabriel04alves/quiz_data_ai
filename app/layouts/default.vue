<template>
  <div class="min-h-screen bg-surface-muted font-brand text-ink antialiased">
    <header class="relative overflow-hidden border-b border-border bg-surface">
      <div
        class="pointer-events-none absolute -right-7 -top-8 size-24 rounded-full bg-accent/25"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute right-12 top-10 size-7 rotate-12 rounded-md bg-primary/15"
        aria-hidden="true"
      />
      <div class="relative mx-auto flex max-w-6xl items-center px-5 py-5 sm:px-8">
        <NuxtLink
          to="/"
          class="text-heading text-primary-strong outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Gincana Data &amp; AI
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <slot />
    </main>
  </div>
</template>
