# T03 — Schema e migrations

**Depende de:** T01
**Referência:** `SPEC.md` §3

## Objetivo

Todas as tabelas e índices da spec criados no Turso via Drizzle, com migrations versionadas.

## Escopo

1. Implementar `server/db/schema.ts` com as seis tabelas de `SPEC.md` §3.1: `users`, `chunks`, `questions`, `rounds`, `round_questions`, `seen_chunks`.
2. Respeitar exatamente os tipos indicados — booleanos como `integer` (0/1), timestamps como `integer`, `options` como `text` contendo JSON, `game_date` como `text` no formato `YYYY-MM-DD`.
3. **Não** criar constraint UNIQUE em `rounds(user_id, game_date)` — tentativas são ilimitadas (`SPEC.md` §6.3). Criar apenas o índice **não único** `rounds(user_id, game_date)`, usado por histórico e contagem de dias jogados.
4. Criar `UNIQUE` em `chunks(content_hash)` — base da idempotência da indexação.
5. Criar os demais índices de `SPEC.md` §3.2.
6. Gerar migration com `npm run db:generate` e aplicar com `npm run db:push`.
7. Exportar tipos inferidos (`InferSelectModel` / `InferInsertModel`) para uso nos serviços e endpoints.

## Fora do escopo

Qualquer seed ou população de dados — isso é T04.

## Aceite

- [ ] Migration gerada e commitada
- [ ] As seis tabelas existem no Turso com os campos e tipos da spec
- [ ] Duas rodadas do mesmo usuário com o mesmo `game_date` são aceitas pelo banco
- [ ] Insert duplicado em `chunks(content_hash)` é rejeitado pelo banco
- [ ] Os demais índices de §3.2 existem
- [ ] Tipos TypeScript exportados e usáveis
