# T09 — Ranking e histórico

**Depende de:** T08
**Referência:** `SPEC.md` §7, §8

## Objetivo

Ranking semanal na home, com dias jogados, e histórico pessoal de rodadas.

## Escopo

1. `GET /api/ranking` — `SUM(score)` por usuário das rodadas com `played_at` na semana ISO corrente (segunda a domingo), top 10 desc. Retornar também `dias_jogados` (contagem de `game_date` distintos) e a posição do usuário da sessão, mesmo fora do top 10.
2. Desempate conforme `SPEC.md` §7: maior score em menos dias jogados; persistindo, rodada mais antiga primeiro.
3. `GET /api/historico` — rodadas do usuário: data, tópico, score, acertos, ordenado por `played_at` desc.
4. Home `/` com sessão: ranking semanal + estado da tentativa do dia (integrado com T08).
5. `/historico` com a lista das rodadas.
6. Posição no ranking exibida na tela de resultado.

## Regras duras

- Reset semanal é filtro por data na query, não job de limpeza.
- Semana começa na segunda-feira, no fuso de `GAME_TIMEZONE`.

## Fora do escopo

Ranking all-time, ranking por tópico, badges (`SPEC.md` §9).

## Aceite

- [ ] Ranking reflete apenas rodadas com `played_at` na semana corrente
- [ ] Rodada da semana anterior não aparece
- [ ] Dias jogados exibido ao lado do score
- [ ] Usuário fora do top 10 vê a própria posição
- [ ] Desempate segue o critério da spec e é estável entre requisições
- [ ] Rodada em andamento (sem `played_at`) não entra no ranking
- [ ] Histórico mostra apenas as rodadas do próprio usuário
