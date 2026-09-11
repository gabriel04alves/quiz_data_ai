# T01 — Setup do projeto e infraestrutura

**Depende de:** nada
**Referência:** `SPEC.md` §2, §11, §12

## Objetivo

Projeto Nuxt inicializado, com Tailwind, Drizzle e conexão ao Turso funcionando, na estrutura de pastas definida na spec.

## Escopo

1. Inicializar projeto Nuxt 4 com TypeScript e npm.
2. Instalar e configurar `@nuxtjs/tailwindcss`.
3. Instalar `drizzle-orm`, `@libsql/client`, `drizzle-kit`.
4. Instalar e configurar `nuxt-auth-utils` (sem implementar login ainda — só a config e o `SESSION_SECRET`).
5. Criar `server/db/index.ts` com o client libSQL lendo `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` do runtime config. Em desenvolvimento a URL aponta para um SQLite local (`file:./.data/dev.db`) e o token fica vazio; o driver `@libsql/client` é o mesmo para dev e produção.
6. Criar `drizzle.config.ts` apontando para `server/db/schema.ts`.
7. Criar `.env.example` com todas as variáveis de `SPEC.md` §12, e `.gitignore` cobrindo `.env`.
8. Criar a árvore de pastas vazia de `SPEC.md` §11 (com `.gitkeep` onde necessário).
9. Criar `content/` com duas subpastas de exemplo e um `.md` curto em cada, seguindo `SPEC.md` §5.0.
10. Adicionar os scripts do `AGENTS.md` ao `package.json` (`dev`, `build`, `index:content`, `db:generate`, `db:push`).

## Fora do escopo

Schema de tabelas (T03), indexação (T04), qualquer página, endpoint ou estilo além do Tailwind base.

## Aceite

- [ ] `npm run dev` sobe sem erro e serve uma página em branco
- [ ] `npm run build` conclui sem erro
- [ ] Uma query trivial (ex: `SELECT 1`) executa com sucesso a partir de `server/db/index.ts` contra o SQLite local (`.data/dev.db`). Conexão real ao Turso fica adiada — a interface já está pronta, basta trocar as variáveis de ambiente.
- [ ] `.env` está no `.gitignore` e `.env.example` lista todas as variáveis
- [ ] `content/` tem dois tópicos de exemplo, cada um com um `.md`
