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

        <AppCard
          v-else
          class="w-full max-w-xl"
        >
          <p class="text-label uppercase text-primary">Data &amp; AI</p>
          <h1 class="mt-3 text-title text-ink">Conhecimento em movimento.</h1>
          <p class="mt-4 text-body text-ink/70">
            Entre com seu e-mail corporativo para começar o desafio da equipe.
          </p>

          <form
            class="mt-7 grid gap-5"
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
      </template>

      <template #placeholder>
        <AppCard class="w-full max-w-xl">
          <p class="text-body text-ink/70">Carregando sua sessão...</p>
        </AppCard>
      </template>
    </AuthState>
  </section>
</template>
