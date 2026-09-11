# T08 — Tentativas ilimitadas e rodada em andamento

**Depende de:** T07
**Referência:** `SPEC.md` §6.3, §5.6

## Objetivo

O usuário joga quantas rodadas quiser, sem limite diário — com uma única rodada em andamento por vez e sem que falha de infraestrutura crie rodada fantasma.

## Escopo

1. **Sem trava diária.** Não existe limite de rodadas por dia, nem constraint UNIQUE em `rounds(user_id, game_date)`, nem contagem regressiva na UI. O índice `rounds(user_id, game_date)` é não único.
2. `game_date` (`YYYY-MM-DD`) continua calculado no fuso de `GAME_TIMEZONE` (`America/Sao_Paulo`), não no fuso do servidor — agora só como dado de histórico e base da contagem de **dias jogados** do ranking.
3. **Uma rodada em andamento por vez:** em `POST /api/rodada/iniciar`, antes de sortear ou chamar o LLM, buscar rodada do usuário com `played_at` nulo e `started_at` há menos de 10 minutos. Havendo, retornar essa rodada (e a pergunta atual) em vez de criar outra.
4. **Reversão:** se o gerador de T05 lançar o erro tipado de "não foi possível montar a rodada" (LLM falhou e o fallback não juntou 7 perguntas), deletar a `rounds` criada na mesma transação e retornar "não conseguimos preparar seu desafio agora, tente em alguns minutos". Nenhuma rodada vazia fica no histórico nem no ranking.
5. **Finalização preguiçosa:** rodada com `played_at` nulo e `started_at` há mais de 10 minutos é finalizada automaticamente com o score parcial, na próxima leitura relevante. Sem cron. Depois disso o usuário pode iniciar outra.
6. Retomada: entrar em `/jogar` com uma rodada em andamento dentro dos 10 minutos leva de volta à pergunta atual, não a uma rodada nova.
7. Home: pontos totais do usuário, posição no ranking e botão "Jogar" — sem mensagem de espera ou de tentativa consumida.
8. Aviso **antes** de começar, em `/jogar`: sair no meio encerra a rodada com o score parcial, que entra no ranking.

## Regras duras

- Nenhuma barreira de quantidade de rodadas, em aplicação ou banco.
- Falha de LLM ou de infraestrutura nunca deixa rodada pela metade persistida.
- A checagem de rodada em andamento é por `played_at` nulo + janela de 10 minutos, nunca por `game_date`.

## Aceite

- [ ] Jogar duas ou mais rodadas seguidas no mesmo dia é permitido
- [ ] Não existe constraint UNIQUE em `rounds(user_id, game_date)`
- [ ] Com rodada em andamento dentro de 10 minutos, `iniciar` retoma a existente e não cria outra
- [ ] Duas requisições simultâneas de `iniciar` não deixam duas rodadas em andamento
- [ ] Rodada abandonada há mais de 10 minutos é finalizada com score parcial e entra no ranking
- [ ] Falha forçada do gerador reverte a rodada e não deixa registro no histórico
- [ ] `game_date` é gravado no fuso de `GAME_TIMEZONE`
- [ ] O aviso sobre sair no meio aparece antes do botão "Começar"
