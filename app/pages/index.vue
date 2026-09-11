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
          class="grid w-full max-w-5xl gap-8"
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
                <AppIcon
                  name="play_arrow"
                  :size="20"
                />
                Jogar
              </AppButton>
            </template>
          </AppCard>

          <div class="grid gap-6 lg:grid-cols-[1fr_300px]">
            <RankingOverview :user-id="sessionUser.id" />
            <GameRulesCard />
          </div>

          <ScoringPreview />
        </div>

        <div
          v-else
          class="relative isolate w-full max-w-5xl"
        >
          <div
            class="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(theme(colors.primary)_1.75px,transparent_1.75px),radial-gradient(theme(colors.accent)_1.75px,transparent_1.75px)] [background-position:0_0,11px_11px] [background-size:22px_22px]"
            aria-hidden="true"
          />

          <div class="grid gap-10">
            <section class="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10 sm:py-14">
              <div
                class="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-primary/10"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute -bottom-8 -right-6 size-20 rotate-12 rounded-2xl bg-accent/15"
                aria-hidden="true"
              />
              <AppPixelCluster
                class="absolute right-6 top-6"
                tone="primary"
                :cell="4"
              />
              <p class="relative text-label uppercase text-primary">Quiz Data &amp; AI</p>
              <h1 class="relative mx-auto mt-3 max-w-xl text-title text-ink">
                Conhecimento em movimento, um desafio por vez.
              </h1>
              <p class="relative mx-auto mt-4 max-w-lg text-body text-ink/70">
                Sete perguntas geradas na hora a partir do material de estudo da equipe. Jogue
                quantas rodadas quiser e dispute o ranking geral acumulado.
              </p>
            </section>

            <div class="grid gap-6 lg:grid-cols-[1fr_300px]">
              <AppCard class="w-full">
                <p class="flex items-center gap-2 text-label uppercase text-primary">
                  <AppIcon
                    name="mail"
                    :size="16"
                  />
                  Comece agora
                </p>
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
                    <AppIcon
                      name="login"
                      :size="20"
                    />
                    Entrar e jogar
                  </AppButton>
                </form>
              </AppCard>

              <GameRulesCard />
            </div>

            <ScoringPreview />
          </div>
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
