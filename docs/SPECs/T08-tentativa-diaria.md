# T08 — Tentativa diária

**Depende de:** T07
**Referência:** `SPEC.md` §6.3, §5.6

## Objetivo

Cada usuário joga uma vez por dia, com a tentativa consumida no início — e sem que falha de infraestrutura queime essa tentativa.

## Escopo

1. Calcular `game_date` (`YYYY-MM-DD`) no fuso de `GAME_TIMEZONE` (`America/Sao_Paulo`), não no fuso do servidor.
2. Trava via índice **UNIQUE** `rounds(user_id, game_date)` — o banco garante; a aplicação apenas traduz a violação em erro amigável. Checagem prévia por `SELECT` é otimização de UX, nunca a única barreira.
3. `POST /api/rodada/iniciar`: criar a `rounds` **antes** de chamar o LLM, para consumir a tentativa no início.
4. **Reversão:** se o gerador de T05 lançar o erro tipado de "não foi possível montar a rodada" (LLM falhou e o fallback não juntou 7 perguntas), deletar a `rounds` criada na mesma transação e retornar "não conseguimos preparar seu desafio agora, tente em alguns minutos". A tentativa **não** é consumida.
5. **Finalização preguiçosa:** rodada com `played_at` nulo e `started_at` há mais de 10 minutos é finalizada automaticamente com o score parcial, na próxima leitura relevante. Sem cron.
6. Retomada: entrar em `/jogar` com uma rodada do dia em andamento e ainda dentro dos 10 minutos leva de volta à pergunta atual, não a uma rodada nova.
7. Home: estado do dia — "Você já jogou hoje. Próxima tentativa em Xh Ymin", com o score do dia e link para o resultado.
8. Aviso **antes** de começar, em `/jogar`: uma tentativa por dia, sair no meio consome a tentativa.

## Regras duras

- A trava é constraint de banco (`CLAUDE.md` regra 3b).
- Falha de LLM ou de infraestrutura nunca consome a tentativa.

## Aceite

- [ ] Segunda tentativa no mesmo dia é bloqueada, com contagem até a próxima
- [ ] Abandonar e voltar não gera nova tentativa
- [ ] Voltar dentro de 10 minutos retoma a rodada na pergunta correta
- [ ] Rodada abandonada há mais de 10 minutos é finalizada com score parcial
- [ ] Duas requisições simultâneas de `iniciar` resultam em uma única rodada (constraint, não race condition)
- [ ] Falha forçada do gerador reverte a rodada e mantém a tentativa disponível
- [ ] Virada de dia às 00:00 em `America/Sao_Paulo` libera nova tentativa
- [ ] O aviso da tentativa única aparece antes do botão "Começar"
