# T07 — Fluxo de rodada

**Depende de:** T05, T06
**Referência:** `SPEC.md` §6.1, §6.2, §6.4, §6.5, §6.6

## Objetivo

Rodada de 7 perguntas jogável de ponta a ponta, com dificuldade e tempo crescentes, timer autoritativo no servidor e pontuação por velocidade.

## Escopo

### `server/services/scoring.ts`

1. Implementar a fórmula de `SPEC.md` §6.2:
   `pontos = round( base(dificuldade) × (1 + tempo_restante_ms / tempo_limite_ms) )`
   Bases: fácil 100, médio 200, difícil 300. Erro ou estouro de tempo: 0.
   **Sem bônus de streak** — decisão de design, não omissão.

### Endpoints (§6.4)

2. `POST /api/rodada/iniciar` — chama o serviço de T05, persiste `questions`, cria `rounds` e as 7 `round_questions` com `position` e `time_limit_ms` (25s/35s/45s conforme §6.1). Retorna `round_id` e **apenas a primeira pergunta**. A trava diária entra em T08.
3. `GET /api/rodada/:roundId/pergunta` — devolve a próxima não respondida: `position`, `difficulty`, `stem`, `options`, `time_limit_ms`. Grava `served_at` na entrega, se nulo. **Nunca** `correct_index` nem `explanation`.
4. `POST /api/rodada/:roundId/responder` — calcula `elapsed_server = now - served_at`, ignora `client_elapsed_ms` para pontuar, aplica tolerância de rede de 1500ms, pontua, atualiza `round_questions` e `rounds`. Retorna `{ is_correct, correct_index, explanation, points_earned, position, total_positions }`.
5. `POST /api/rodada/:roundId/finalizar` — seta `played_at`, retorna score final e acertos.

### Telas

6. `/jogar` — seletor de tópico (de `SELECT DISTINCT topic FROM chunks`, **nunca do filesystem**), aviso da tentativa única, botão "Começar".
7. `/jogar/[roundId]/preparando` — tela de preparação durante a chamada ao LLM (§6.6), com progresso, texto explicando o sorteio e timeout visual em 20s sincronizado com o fallback.
8. `/jogar/[roundId]` — pergunta atual, indicador de dificuldade, timer visual, 4 alternativas, feedback imediato com explicação, avanço.
9. `/resultado/[roundId]` — score final, acertos, quebra por pergunta, botão para o ranking.

## Regras duras

- Uma pergunta por vez ao cliente (§6.5). Enviar o lote inteiro é bug de segurança, não otimização.
- `correct_index` nunca antes da resposta (`CLAUDE.md` regra 2).
- Timer autoritativo é o servidor (`CLAUDE.md` regra 3).
- Todos os endpoints validam que o `roundId` pertence ao usuário da sessão.
- Reenvio de resposta para pergunta já respondida é rejeitado.

## Aceite

- [ ] Rodada de 7 perguntas completa sem erro
- [ ] Dificuldade e tempo seguem 2×25s / 3×35s / 2×45s
- [ ] Payload de `pergunta` na aba Network não contém `correct_index`, `explanation` nem perguntas futuras
- [ ] Resposta após o limite real conta 0, mesmo com `client_elapsed_ms` menor
- [ ] Os três exemplos de cálculo de `SPEC.md` §6.2 batem com a implementação
- [ ] Resposta rápida em difícil pontua mais que resposta lenta em difícil
- [ ] Responder duas vezes a mesma pergunta é rejeitado
- [ ] `roundId` de outro usuário retorna 403
- [ ] Tela de preparação aparece e transiciona sozinha para a primeira pergunta
