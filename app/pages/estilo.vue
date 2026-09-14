<script setup lang="ts">
import { shallowRef } from 'vue'

const email = shallowRef('gabriel.alves@selbetti.com.br')
const invalidEmail = shallowRef('gabriel@exemplo.com')

const palette = [
  { name: 'Primária', token: 'primary', classes: 'bg-primary text-surface' },
  { name: 'Primária forte', token: 'primary-strong', classes: 'bg-primary-strong text-surface' },
  { name: 'Destaque', token: 'accent', classes: 'bg-accent text-ink' },
  { name: 'Texto', token: 'ink', classes: 'bg-ink text-surface' },
  { name: 'Superfície', token: 'surface', classes: 'border border-border bg-surface text-ink' },
  { name: 'Superfície suave', token: 'surface-muted', classes: 'bg-surface-muted text-ink' },
]

const states = [
  { name: 'Resposta correta', detail: 'Acerto', classes: 'border-correct bg-correct text-surface' },
  { name: 'Resposta incorreta', detail: 'Erro', classes: 'border-incorrect bg-incorrect text-ink' },
  { name: 'Tempo esgotado', detail: 'Tempo', classes: 'border-timeout bg-timeout text-surface' },
]
</script>

<template>
  <div class="grid gap-12">
    <section
      class="max-w-3xl"
      data-aos="fade-up"
    >
      <p class="mb-3 text-label uppercase text-primary">Referência temporária · T02</p>
      <h1 class="text-display text-ink">Sistema visual</h1>
      <p class="mt-5 text-body text-ink/70">
        Uma base clara, confiável e direta para transformar cada rodada em uma experiência reconhecível.
      </p>
    </section>

    <AppCard data-aos="fade-up">
      <template #header>
        <h2 class="text-title text-ink">Paleta semântica</h2>
      </template>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="color in palette"
          :key="color.token"
          class="flex min-h-32 flex-col justify-end rounded-xl p-4"
          :class="color.classes"
        >
          <strong class="text-body">{{ color.name }}</strong>
          <span class="text-small opacity-75">{{ color.token }}</span>
        </div>
      </div>
    </AppCard>

    <AppCard
      tone="highlight"
      data-aos="fade-up"
    >
      <template #header>
        <h2 class="text-title text-ink">Estados do quiz</h2>
      </template>
      <div class="grid gap-4 md:grid-cols-3">
        <div
          v-for="state in states"
          :key="state.detail"
          class="rounded-xl border p-5"
          :class="state.classes"
        >
          <span class="text-label uppercase opacity-75">{{ state.detail }}</span>
          <p class="mt-2 text-heading">{{ state.name }}</p>
        </div>
      </div>
    </AppCard>

    <AppCard data-aos="fade-up">
      <template #header>
        <h2 class="text-title text-ink">Escala tipográfica</h2>
      </template>
      <div class="grid gap-8">
        <div class="border-b border-border pb-6">
          <span class="text-label uppercase text-primary">Display</span>
          <p class="mt-2 text-display">Conhecimento</p>
        </div>
        <div class="border-b border-border pb-6">
          <span class="text-label uppercase text-primary">Título</span>
          <p class="mt-2 text-title">Seu desafio diário</p>
        </div>
        <div class="border-b border-border pb-6">
          <span class="text-label uppercase text-primary">Heading</span>
          <p class="mt-2 text-heading">Pergunta 4 de 7</p>
        </div>
        <div>
          <span class="text-label uppercase text-primary">Corpo e apoio</span>
          <p class="mt-2 text-body">Leia com atenção e escolha uma alternativa.</p>
          <p class="mt-1 text-small text-ink/70">Você tem 35 segundos para responder.</p>
        </div>
      </div>
    </AppCard>

    <AppCard data-aos="fade-up">
      <template #header>
        <h2 class="text-title text-ink">Componentes</h2>
      </template>
      <div class="grid gap-10">
        <section>
          <h3 class="mb-4 text-heading">Botões</h3>
          <div class="flex flex-wrap items-center gap-3">
            <AppButton>Começar desafio</AppButton>
            <AppButton variant="secondary">Ver histórico</AppButton>
            <AppButton variant="ghost">Agora não</AppButton>
            <AppButton size="lg">Próxima pergunta</AppButton>
            <AppButton is-loading>Preparando…</AppButton>
            <AppButton disabled>Indisponível</AppButton>
          </div>
        </section>

        <section class="grid gap-5 md:grid-cols-2">
          <AppInput
            v-model="email"
            label="E-mail corporativo"
            type="email"
            hint="Use seu e-mail @selbetti.com.br."
          />
          <AppInput
            v-model="invalidEmail"
            label="E-mail com erro"
            type="email"
            error="Use seu e-mail @selbetti.com.br."
          />
          <AppInput
            label="Campo desabilitado"
            model-value="Sem edição"
            disabled
          />
        </section>

        <section>
          <h3 class="mb-4 text-heading">Dificuldade</h3>
          <div class="flex flex-wrap gap-3">
            <DifficultyBadge difficulty="facil" />
            <DifficultyBadge difficulty="medio" />
            <DifficultyBadge difficulty="dificil" />
          </div>
        </section>
      </div>
      <template #footer>
        <p class="text-small text-ink/70">
          Os rótulos acompanham as cores para que o significado nunca dependa apenas da percepção visual.
        </p>
      </template>
    </AppCard>
  </div>
</template>
