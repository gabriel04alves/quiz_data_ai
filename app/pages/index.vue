<script setup lang="ts">
import { shallowRef } from 'vue'

interface LoginResponse {
  user: {
    id: string
    email: string
    display_name: string
  }
}

interface ApiError {
  statusMessage?: unknown
  data?: {
    statusMessage?: unknown
  }
}

const email = shallowRef('')
const errorMessage = shallowRef<string | null>(null)
const isSubmitting = shallowRef(false)
const { fetch } = useUserSession()

// Prévia estática do formato (SPEC.md §6.1) — ilustrativa, sem dado real de jogador.
const formatPreview = [
  { difficulty: 'facil' as const, referenceTime: '25s', basePoints: 100 },
  { difficulty: 'medio' as const, referenceTime: '35s', basePoints: 200 },
  { difficulty: 'dificil' as const, referenceTime: '45s', basePoints: 300 },
]

function getErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'não foi possível iniciar sua sessão, tente novamente'
  }

  const apiError = error as ApiError
  const message = apiError.data?.statusMessage ?? apiError.statusMessage

  return typeof message === 'string'
    ? message
    : 'não foi possível iniciar sua sessão, tente novamente'
}

async function submitLogin(): Promise<void> {
  errorMessage.value = null
  isSubmitting.value = true

  try {
    await $fetch<LoginResponse>('/api/entrar', {
      method: 'POST',
      body: { email: email.value },
    })
    await fetch()
    await navigateTo('/jogar')
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="grid min-h-[60vh] place-items-center">
    <AuthState>
      <template #default="{ loggedIn: sessionLoggedIn, user: sessionUser }">
        <div
          v-if="sessionLoggedIn && sessionUser"
          class="grid w-full max-w-3xl gap-6"
        >
          <AppCard tone="highlight">
            <p class="text-label uppercase text-primary">Sessão ativa</p>
            <h1 class="mt-3 text-title text-ink">
              Olá, {{ sessionUser.display_name }}.
            </h1>
            <p class="mt-4 text-body text-ink/70">
              Seu acesso está pronto. Escolha um tópico e comece seu desafio.
            </p>
            <template #footer>
              <AppButton
                size="lg"
                @click="navigateTo('/jogar')"
              >
                Jogar
              </AppButton>
            </template>
          </AppCard>

          <RankingOverview :user-id="sessionUser.id" />
        </div>

        <div
          v-else
          class="grid w-full max-w-3xl gap-10"
        >
          <section class="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10 sm:py-14">
            <div
              class="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-primary/10"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-8 -right-6 size-20 rotate-12 rounded-2xl bg-accent/15"
              aria-hidden="true"
            />
            <p class="relative text-label uppercase text-primary">Gincana Data &amp; AI</p>
            <h1 class="relative mx-auto mt-3 max-w-xl text-title text-ink">
              Conhecimento em movimento, um desafio por vez.
            </h1>
            <p class="relative mx-auto mt-4 max-w-lg text-body text-ink/70">
              Sete perguntas geradas na hora a partir do material de estudo da equipe. Jogue
              quantas rodadas quiser e dispute o ranking geral acumulado.
            </p>
          </section>

          <section aria-labelledby="formato-heading">
            <h2
              id="formato-heading"
              class="text-heading text-ink"
            >
              Como funciona uma rodada
            </h2>
            <p class="mt-2 text-small text-ink/70">
              A dificuldade — e a pontuação — sobem ao longo das 7 perguntas. Responder rápido
              rende bônus de agilidade.
            </p>
            <ol class="mt-5 grid gap-3 sm:grid-cols-3">
              <li
                v-for="step in formatPreview"
                :key="step.difficulty"
                class="rounded-xl border border-border bg-surface px-4 py-4"
              >
                <DifficultyBadge :difficulty="step.difficulty" />
                <p class="mt-3 text-title text-primary-strong">{{ step.basePoints }}</p>
                <p class="text-small text-ink/60">pontos base · até {{ step.referenceTime }}</p>
              </li>
            </ol>
          </section>

          <AppCard class="w-full">
            <p class="text-label uppercase text-primary">Comece agora</p>
            <h2 class="mt-3 text-heading text-ink">Entre com seu e-mail corporativo</h2>

            <form
              class="mt-6 grid gap-5"
              @submit.prevent="submitLogin"
            >
              <AppInput
                v-model="email"
                label="E-mail corporativo"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="nome@selbetti.com.br"
                hint="Use seu e-mail @selbetti.com.br"
                :error="errorMessage ?? undefined"
                :disabled="isSubmitting"
                required
              />
              <AppButton
                type="submit"
                size="lg"
                :is-loading="isSubmitting"
              >
                Entrar e jogar
              </AppButton>
            </form>
          </AppCard>
        </div>
      </template>

      <template #placeholder>
        <AppCard class="w-full max-w-xl">
          <p class="text-body text-ink/70">Carregando sua sessão...</p>
        </AppCard>
      </template>
    </AuthState>
  </section>
</template>
