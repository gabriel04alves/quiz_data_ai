# T02 — Design system a partir do brand

**Depende de:** T01
**Referência:** `SPEC.md` §8.1, `CLAUDE.md` regra 7

## Objetivo

Traduzir o guia de marca da Selbetti em tokens Tailwind e componentes base reutilizáveis, sem usar o logo.

## Pré-requisito obrigatório

**Leia `/docs/brand` antes de qualquer decisão visual.** Não inferir cores, tipografia ou espaçamento de memória. Se o guia estiver ausente ou ilegível, pare e avise — não improvise uma paleta.

## Escopo

1. Ler `/docs/brand` e produzir um resumo curto das decisões extraídas (cores, tipografia, escala, tom) para aprovação antes de codar.
2. Configurar `tailwind.config` com as cores e a tipografia do guia como tokens nomeados semanticamente (ex: `primary`, `surface`, `muted`) — não nomes de cor crua.
3. Carregar as fontes do brand (self-hosted ou via `@nuxt/fonts`, o que o guia permitir).
4. Definir tokens derivados para estados do quiz (acerto, erro, tempo esgotado) e para os três níveis de dificuldade, a partir da paleta existente. Documentar cada derivação em comentário no `tailwind.config`.
5. Criar componentes base: `AppButton`, `AppInput`, `AppCard`, `DifficultyBadge`.
6. Criar o layout padrão com header contendo o wordmark textual "Gincana Data & AI" na tipografia do brand.
7. Criar uma página `/estilo` (temporária, removida em T11) exibindo a paleta, a escala tipográfica e os componentes base para revisão visual.

## Regras duras

- **Nenhum uso do logo da Selbetti** — nem em header, favicon, meta imagem, tela de carregamento ou qualquer outro lugar.
- Nenhum valor hex fora do `tailwind.config`.
- Nenhuma família de cor que não derive da paleta do guia.

## Fora do escopo

Telas reais do jogo, animações, modo escuro.

## Aceite

- [ ] O resumo do brand foi apresentado e aprovado antes da implementação
- [ ] Nenhuma ocorrência do logo da Selbetti no repositório ou no build
- [ ] `grep` por hex (`#`) em `app/components/` e `app/pages/` não retorna cor solta
- [ ] Tipografia do brand carrega corretamente
- [ ] `/estilo` renderiza paleta, tipografia, os componentes base e os três estados de dificuldade
