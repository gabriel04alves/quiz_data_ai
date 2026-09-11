# T12 — Landing page e revitalização visual arcade

**Depende de:** T02, T09
**Deve concluir antes de:** T11 (deploy) — T11 mexe em favicon/meta e remove `/estilo`; precisa do visual final.
**Referência:** `SPEC.md` §8, §8.1, `AGENTS.md` regra 7, `/docs/brand`

## Objetivo

Duas coisas distintas, na mesma leva de trabalho:

1. Uma **landing page real** em `/` para quem ainda não tem sessão — hoje é só um formulário de
   e-mail; vira a porta de entrada que vende a gincana antes de pedir o e-mail.
2. **Revitalizar o visual do jogo** com sensibilidade de **arcade** — contadores de pontos,
   feedback de acerto/erro mais expressivo, tela de preparação com cara de "loading de fliperama"
   — nas telas que já existem (`/jogar`, `/jogar/[roundId]`, `/resultado/[roundId]`, `/historico`,
   ranking em `/`).

## ⚠️ Tensão com regras atuais — resolver antes de codar

"Arcade" esbarra em três regras hoje em vigor, e nenhuma delas deve ser furada em silêncio:

- **`AGENTS.md` regra 7 / `SPEC.md` §8.1:** paleta e tipografia vêm do guia em `/docs/brand`
  (verde/laranja Selbetti, tom "sério e profissional, conservador com toques de modernidade").
  Um arcade clássico pede neon, contraste alto, fonte pixelada — isso é uma paleta/tipografia
  nova, o que a regra 7 proíbe sem aprovação explícita.
- **`AGENTS.md` "Escopo":** hoje diz explicitamente "sem animações elaboradas, sem sons". Um
  game-feel de arcade tipicamente inclui as duas coisas.
- **`SPEC.md` §6.7:** o sistema não deve ser apresentado como avaliação objetiva — um visual
  chamativo demais não pode migrar a leitura de "gincana interna" para "produto de jogo".

**Antes de implementar**, apresentar ao responsável do projeto uma proposta curta (prints/mock)
mostrando como o "arcade" se encaixa dentro dessas restrições — por exemplo: geometria/tipografia
mais lúdica e motion contido, cores 100% derivadas da paleta existente (sem introduzir família
nova), sem som, sem pixel-art. Se a intenção for um arcade mais literal (neon, pixel font, som),
isso é uma revisão explícita de `AGENTS.md` regra 7 e do item "sem sons/animações elaboradas" —
não decidir isso sozinho durante a implementação; voltar e perguntar, como qualquer outra troca de
uma decisão fixada (`AGENTS.md` "Stack — fixada").

## Escopo

### Landing (`/` sem sessão)

1. Substituir o card único de e-mail por uma landing curta: proposta de valor da gincana (times
   de Data & AI, perguntas geradas na hora, ranking acumulado), uma prévia visual do formato
   (7 perguntas, dificuldade e tempo subindo, bônus de agilidade) e o formulário de e-mail como
   CTA principal — não como a página inteira.
2. Nenhum dado real precisa aparecer na prévia (não é dashboard) — pode ser estático/ilustrativo.
3. `/` com sessão continua mostrando o estado do jogador (pontos, posição, botão "Jogar") — isso
   já existe e não muda de comportamento, só de tratamento visual junto com o resto do escopo.

### Revitalização arcade (telas existentes)

4. Tela de preparação (`/jogar`, estado de preparo) — progresso com cara de "carregando fase",
   mantendo o texto explicativo e o timeout de 20s já implementados (T07).
5. Cartão de pergunta e `RoundTimer` — reforçar a leitura de dificuldade/pontuação (ex.: contador
   de pontos com efeito de incremento) sem comprometer a legibilidade nem o contraste.
6. Feedback pós-resposta (acerto/erro) mais expressivo que o card atual, reaproveitando os tokens
   `correct`/`incorrect`/`timeout` já definidos em T02 — não cores novas.
7. Tela de resultado — quebra por pergunta com leitura mais "placar de arcade" (pontuação total
   em destaque, posição no ranking).
8. Ranking (`/`, `/historico`) — mantém as regras de paginação e desempate de T09; só o
   tratamento visual muda.

## Regras duras

- Nenhuma cor fora da paleta já tokenizada em `tailwind.config` (T02) — se o visual pedir um tom
  que não existe, isso é decisão de brand, não de CSS solto: parar e perguntar.
- Nenhum uso do logo da Selbetti, sob nenhuma forma (regra já vigente, reforçada aqui porque
  "revitalização visual" é exatamente o tipo de tarefa onde um logo entra por engano).
- Motion com `prefers-reduced-motion` respeitado — nenhuma animação, por mais "arcade" que seja,
  pode ser a única forma de perceber o resultado de uma resposta.
- Sem som, a menos que a exceção da regra 7 seja explicitamente aprovada (ver seção acima).
- Sem introduzir mascote, ilustração de personagem ou qualquer elemento gráfico novo não coberto
  pelo guia de marca sem aprovação.

## Fora do escopo

- Qualquer mudança de mecânica de jogo, pontuação ou endpoints (T07/T08 já fecharam isso).
- Modo escuro (`SPEC.md` §9 / `AGENTS.md`).
- Landing multi-idioma ou com CMS — conteúdo estático no próprio componente Vue.

## Aceite

- [ ] Proposta visual (mock/print) apresentada e aprovada antes da implementação, com a tensão
      da seção acima resolvida explicitamente (o que fica dentro da paleta do brand, o que não)
- [ ] `/` sem sessão mostra landing com proposta de valor + prévia do formato + CTA de e-mail,
      não só o formulário isolado
- [ ] `/` com sessão, `/jogar`, `/jogar/[roundId]`, `/resultado/[roundId]`, `/historico` e o
      ranking recebem o tratamento visual novo sem mudar nenhum contrato de API
- [ ] `grep` por hex (`#`) em `app/components/` e `app/pages/` não retorna cor solta
- [ ] Nenhuma ocorrência do logo da Selbetti no repositório ou no build
- [ ] Toda animação nova respeita `prefers-reduced-motion`
- [ ] Nenhum som foi adicionado, salvo exceção aprovada por escrito
- [ ] Checklist de acessibilidade básica: contraste dos novos estados de acerto/erro/tempo ainda
      passa (mesmo critério do guia de marca usado em T02)
