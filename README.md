# Quiz Data & AI

Gincana de conhecimento para a equipe de Data & AI da Selbetti: cada jogador dispara rodadas de 7
perguntas de múltipla escolha, geradas na hora por IA a partir do material de estudo em Markdown,
e disputa um ranking geral acumulado. Aplicação web single-tenant, uso interno, sem autenticação
verificada — ver `docs/SPECs/SPEC.md` para a especificação completa do produto.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Nuxt 4 (SSR + API routes via Nitro no mesmo projeto) |
| Linguagem | TypeScript (estrito em `server/`) |
| Estilo | Tailwind CSS (`@nuxtjs/tailwindcss`) |
| Banco | Turso (libSQL) em produção; SQLite local (`file:`) em desenvolvimento, mesmo driver |
| ORM | Drizzle ORM (driver `@libsql/client`) |
| Sessão | `nuxt-auth-utils` (cookie httpOnly assinado, sem provider externo) |
| LLM | Google AI Studio — `gemini-3.1-flash-lite` (uma chamada por rodada) |
| Deploy | Vercel |
| Gerenciador de pacotes | npm |

A stack é fixada — ver `.agents/AGENTS.md` antes de propor qualquer troca.

## Pré-requisitos

- Node.js 20+ e npm
- Uma chave da API do Google AI Studio (`LLM_API_KEY`) para gerar perguntas — opcional em dev
  graças ao fallback (ver [Gerador de perguntas](#gerador-de-perguntas)), mas necessária para
  testar o caminho principal
- Não é necessário instalar nada do Turso para desenvolver: o banco local é um arquivo SQLite

## Instalação

```sh
git clone <url-do-repositorio>
cd quiz_data_ai
npm install
cp .env.example .env
```

Preencha o `.env` gerado:

```sh
# Desenvolvimento: SQLite local — já vem pronto no .env.example.
TURSO_DATABASE_URL=file:./.data/dev.db
TURSO_AUTH_TOKEN=

# Chave do Google AI Studio (server/services/question-generator.ts).
LLM_API_KEY=
LLM_MODEL=gemini-3.1-flash-lite

# Segredo do cookie de sessão (nuxt-auth-utils) — mínimo 32 caracteres.
SESSION_SECRET=

GAME_TIMEZONE=America/Sao_Paulo
```

Gere o `SESSION_SECRET`:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No PowerShell com scripts desabilitados, use `npm.cmd` no lugar de `npm` em todos os comandos
abaixo.

## Banco de dados

O driver é sempre `@libsql/client` — só a URL/token mudam entre dev (arquivo local) e produção
(Turso). Aplique o schema atual ao banco local:

```sh
npm run db:push
```

Use `npm run db:generate` para gerar uma nova migration Drizzle sempre que `server/db/schema.ts`
mudar (uma alteração de schema por vez, com a migration commitada — ver `.agents/AGENTS.md`).
`npm run db:check` só confirma que a conexão configurada em `TURSO_DATABASE_URL` está de pé.

## Conteúdo e indexação

O material de estudo vive em `content/<topico>/*.md` — o nome da subpasta é a fonte de verdade do
tópico (sem frontmatter nem configuração paralela). Depois de adicionar ou editar material, rode:

```sh
npm run index:content
```

O script fatia os arquivos em chunks, calcula hash de conteúdo e grava em `chunks` — ele nunca
chama o LLM, só lê e indexa. Rodar duas vezes não duplica chunks nem reseta `times_used`. Detalhes
do algoritmo de chunking e do sorteio ponderado estão em `SPEC.md` §5.

## Rodando em desenvolvimento

```sh
npm run dev
```

Acesse `http://localhost:3000`. A tela inicial pede um e-mail `@selbetti.com.br` — qualquer e-mail
válido nesse domínio cria uma sessão (não há verificação de posse, ver `SPEC.md` §4).

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Nuxt + Nitro) |
| `npm run build` | Build de produção em `.output/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run index:content` | Indexa `content/**/*.md` em `chunks` (offline, sem LLM) |
| `npm run db:generate` | Gera uma migration Drizzle a partir do schema |
| `npm run db:push` | Aplica o schema atual diretamente ao banco configurado |
| `npm run db:check` | Testa a conexão com o banco (`SELECT 1`) |
| `npm run db:backfill-names` | Resincroniza `display_name` com o local-part literal do e-mail para usuários já cadastrados |
| `npm run questions:check` | Roda 24 cenários simulados do gerador de perguntas, sem consumir LLM |
| `npm run questions:check -- --live` | Roda 1 cenário real contra o LLM (requer `LLM_API_KEY` e material indexado) |

## Gerador de perguntas

Cada rodada dispara **exatamente uma** chamada ao LLM, no endpoint de início de rodada — nunca
entre perguntas (`SPEC.md` §2, restrição dura). Se a chamada falhar, estourar 20s ou a resposta não
passar na validação programática, o sistema cai automaticamente para um fallback que reaproveita
perguntas já persistidas de rodadas anteriores; se nem isso houver material suficiente, a rodada é
revertida sem deixar registro. Para testar esse caminho sem custo de API:

```sh
npm run questions:check
```

Para uma verificação real, ponta a ponta, contra o modelo configurado:

```sh
npm run questions:check -- --live
```

## Estrutura do projeto

```
app/
  pages/            # rotas (/, /jogar, /resultado/[roundId], /historico, ...)
  components/       # AppButton, AppCard, QuestionCard, RankingTable, ...
  composables/      # useCountUp, usePrefersReducedMotion, ...
  layouts/          # layout padrão (header, wordmark, navegação)
server/
  api/              # endpoints Nitro (entrar, rodada/*, ranking, historico, ...)
  services/         # sorteio de chunks, gerador de perguntas, pontuação, ranking
  db/               # schema Drizzle e migrations
content/
  <topico-slug>/    # material de estudo em Markdown, por tópico
docs/
  SPECs/            # SPEC.md (spec do produto) + uma tarefa por arquivo (T01..T12)
  brand/            # guia de marca da Selbetti (fonte de verdade visual)
scripts/            # tarefas offline: indexação, checks de banco, backfills
```

## Documentação

- `docs/SPECs/SPEC.md` — especificação funcional completa (modelo de dados, fluxo de auth, regras
  do jogo, pontuação, ranking, telas, critérios de aceite).
- `docs/SPECs/T01-setup.md` a `T12-landing-arcade.md` — a spec decomposta em tarefas sequenciais,
  na ordem em que foram implementadas.
- `.agents/AGENTS.md` — regras invariantes do projeto (stack fixada, convenções de código,
  identidade visual, o que está fora de escopo).
- `docs/brand/` — guia de marca da Selbetti; única fonte de verdade para cores e tipografia da UI
  (nunca inferir paleta de memória, e o logo da Selbetti não é usado em nenhuma tela).

## Deploy

Alvo de produção é a Vercel (compatível com Netlify e Cloudflare Pages). Configure as mesmas
variáveis de ambiente do `.env`, trocando `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` para o banco
Turso de produção. Detalhes em `docs/SPECs/T11-deploy.md`.
