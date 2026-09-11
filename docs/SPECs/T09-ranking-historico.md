# T09 — Ranking e histórico

**Depende de:** T08
**Referência:** `SPEC.md` §7, §8

## Objetivo

Ranking geral acumulado na home, com todos os usuários e a pontuação do usuário logado sempre visível, mais o histórico pessoal de rodadas.

## Escopo

1. `GET /api/ranking` — `SUM(score)` por usuário sobre todas as rodadas com `played_at` não nulo. Sem recorte de período e sem reset.
   - Retorna **todos** os usuários com ao menos uma rodada concluída, ordenados por pontos desc, paginados por `?limit`/`?offset` (padrão 50). Sem corte em top 10.
   - Cada linha: `posicao`, `user_id`, `display_name`, `pontos`, `dias_jogados` (`COUNT(DISTINCT game_date)`), `rodadas_jogadas` (`COUNT(*)`).
   - Retorna também um bloco `me` com `{ posicao, pontos, dias_jogados, rodadas_jogadas, melhor_rodada }` do usuário da sessão, sempre — mesmo que ele não esteja na página carregada.
   - Usuário sem rodada concluída: `me` com `pontos: 0` e `posicao: null`.
2. Desempate conforme `SPEC.md` §7: mais pontos; empatando, menos dias jogados; persistindo, menos rodadas jogadas; persistindo, primeira rodada mais antiga. A ordem precisa ser estável entre requisições (inclusive entre páginas).
3. `GET /api/historico` — rodadas do usuário: data, tópico, score, acertos, ordenado por `played_at` desc.
4. Home `/` com sessão: card do usuário logado (pontos, posição, dias e rodadas jogadas) + tabela do ranking geral com "carregar mais", e a linha do próprio usuário destacada quando visível.
5. `/historico` com a lista das rodadas.
6. Posição no ranking exibida na tela de resultado, junto do botão "Jogar de novo".

## Regras duras

- Ranking soma o histórico inteiro; nada de filtro de semana nem job de limpeza.
- Rodada sem `played_at` não entra no ranking.
- Paginação no servidor — nunca carregar a tabela inteira no cliente de uma vez.

## Fora do escopo

Ranking por tópico, ranking com recorte de período, badges (`SPEC.md` §9).

## Aceite

- [ ] Ranking soma todas as rodadas com `played_at` não nulo, sem recorte de período
- [ ] Todos os usuários com rodada concluída aparecem, paginados, sem corte em top 10
- [ ] Duas rodadas do mesmo usuário no mesmo dia somam pontos e contam como 1 dia jogado e 2 rodadas
- [ ] Dias jogados e rodadas jogadas exibidos ao lado dos pontos
- [ ] Usuário logado vê sempre a própria pontuação e posição, mesmo fora da página carregada
- [ ] Usuário sem rodada concluída vê pontos 0 e a mensagem de primeira rodada
- [ ] Rodada em andamento (sem `played_at`) não entra no ranking
- [ ] Desempate segue o critério da spec e é estável entre requisições e páginas
- [ ] Histórico mostra apenas as rodadas do próprio usuário
