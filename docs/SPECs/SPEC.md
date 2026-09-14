# SPEC — Gincana de Conhecimento Data & AI

---

## 1. Visão geral

**Nome do projeto:** Gincana Data & AI
**Tipo:** Aplicação web single-tenant, uso interno, sem requisitos corporativos formais
**Objetivo:** Desafio de múltipla escolha para a equipe de Data & AI da Selbetti treinar conhecimentos técnicos. Cada jogador pode jogar quantas rodadas quiser, a qualquer momento, com perguntas geradas por IA na hora a partir do material de estudo em markdown, e disputa um ranking geral acumulado.

**Não-objetivos explícitos:**
- Não é uma plataforma multi-tenant nem multi-empresa.
- Não requer autenticação verificada (sem magic link, sem OAuth).
- Não terá painel de curadoria humana sobre perguntas.
- Não é instrumento de avaliação objetiva (ver §6.7 sobre limites de justiça).

---

## 2. Stack técnica (fixada — não renegociar durante implementação)

| Camada | Tecnologia | Observação |
|---|---|---|
| Framework | Nuxt 4 | SSR + API routes (Nitro) no mesmo projeto |
| Linguagem | TypeScript | Estrito em `server/` |
| Estilo | Tailwind CSS | via `@nuxtjs/tailwindcss` |
| Banco | Turso (libSQL) | Free tier em produção; SQLite local (`file:`) em desenvolvimento, mesmo driver libSQL |
| ORM | Drizzle ORM | Driver `@libsql/client` |
| Sessão | `nuxt-auth-utils` | Cookie httpOnly assinado, sem provider externo |
| LLM | Google AI Studio — `gemini-3.1-flash-lite` | Chamado uma única vez por rodada, na tela de preparação; modelo configurável por `LLM_MODEL` |
| Deploy | Vercel (free tier) | Alternativas compatíveis: Netlify, Cloudflare Pages |
| Gerenciador de pacotes | npm | — |

**Restrição dura:** exatamente **uma** chamada a LLM por rodada, disparada no endpoint de início de rodada. Nunca uma chamada entre perguntas.

---

## 3. Modelo de dados

### 3.1 Schema Drizzle (referência para `server/db/schema.ts`)

```
users
  id            text primary key (uuid)
  email         text unique not null
  display_name  text not null
  created_at    integer not null (timestamp)

chunks                              -- índice do material, populado por script offline
  id            text primary key (uuid)
  topic         text not null       -- nome da subpasta em content/
  source_file   text not null       -- caminho relativo a partir de content/
  heading       text                -- heading de nível 2 de origem, se houver
  content       text not null       -- texto do chunk
  content_hash  text unique not null
  times_used    integer not null default 0
  created_at    integer not null

questions                           -- perguntas geradas em runtime, persistidas para auditoria/report
  id              text primary key (uuid)
  chunk_id        text not null references chunks(id)
  topic           text not null
  difficulty      text not null      -- 'facil' | 'medio' | 'dificil'
  stem            text not null
  options         text not null      -- JSON.stringify(string[4])
  correct_index   integer not null   -- 0-3
  explanation     text not null
  source_file     text not null
  reports         integer not null default 0
  active          integer not null default 1
  created_at      integer not null

rounds
  id              text primary key (uuid)
  user_id         text not null references users(id)
  topic           text                -- null = todos os tópicos
  game_date       text not null       -- 'YYYY-MM-DD' em America/Sao_Paulo, usado para histórico e contagem de dias jogados
  started_at      integer not null
  played_at       integer             -- null enquanto em andamento
  score           integer not null default 0
  correct_count   integer not null default 0

round_questions
  id              text primary key (uuid)
  round_id        text not null references rounds(id)
  question_id     text not null references questions(id)
  position        integer not null    -- 1 a 7, define a ordem e a dificuldade
  time_limit_ms   integer not null    -- congelado no início da rodada
  served_at       integer             -- null até a pergunta ser entregue ao cliente
  chosen_index    integer
  is_correct      integer
  points          integer
  answered_at     integer

seen_chunks
  id              text primary key (uuid)
  user_id         text not null references users(id)
  chunk_id        text not null references chunks(id)
  seen_at         integer not null
```

### 3.2 Índices e constraints obrigatórios

- `rounds(user_id, game_date)` — índice **não único**. Um usuário pode ter quantas rodadas quiser no mesmo dia; o índice só acelera histórico e contagem de dias jogados.
- `rounds(user_id, played_at)` — histórico pessoal e agregação do ranking
- `rounds(played_at)` — cálculo do ranking
- `chunks(topic, times_used)` — sorteio ponderado
- `seen_chunks(user_id, seen_at)` — filtro de anti-repetição
- `questions(active)` — pool de fallback

---

## 4. Fluxo de autenticação (sem verificação real)

### 4.1 Regra de negócio

1. Usuário acessa `/` e vê um campo de e-mail.
2. Submissão dispara `POST /api/entrar` com `{ email }`.
3. Servidor normaliza (trim + lowercase) e valida com regex: `^[a-z0-9._%+-]+@selbetti\.com\.br$`.
4. Se inválido → HTTP 422, mensagem "use seu e-mail @selbetti.com.br".
5. Se válido:
   - `display_name` derivado da parte local: separada por `.`, capitalizada (`gabriel.silva` → `Gabriel Silva`).
   - `INSERT INTO users ... ON CONFLICT (email) DO NOTHING`, depois `SELECT` para obter o `id`.
   - `setUserSession({ user: { id, email, display_name } })`.
6. Redirect para `/jogar`.

### 4.2 Explicitamente fora de escopo

- Verificação de posse do e-mail (não há envio de código/link).
- Qualquer usuário pode digitar e-mail de outra pessoa — risco aceito e documentado, não é bug.
- Sem "esqueci minha sessão" — a chave é o e-mail, reentrar restaura o histórico.

---

## 5. Material e geração de perguntas

### 5.0 Organização do material fonte (regra estrutural)

Todo o material de estudo vive em uma **pasta base única**: `/content`.

Dentro dela, os arquivos `.md` são obrigatoriamente organizados em **subpastas por tópico**. O nome da subpasta é a fonte de verdade do tópico — não há frontmatter nem configuração paralela definindo tópicos.

```
content/
  engenharia-de-dados/
    modelagem-dimensional.md
    orquestracao.md
  machine-learning/
    metricas-de-avaliacao.md
  cloud/
    fundamentos-aws.md
```

| Regra | Definição |
|---|---|
| Slug do tópico | Nome literal da subpasta (kebab-case, sem acento) |
| Rótulo exibido | Derivado do slug: hífens viram espaços, primeira letra maiúscula |
| Profundidade | Exatamente um nível de subpasta. Mais fundo é ignorado, com aviso no log |
| Arquivo solto | `.md` direto em `/content` é ignorado, com aviso no log |
| Lista de tópicos na UI | `SELECT DISTINCT topic FROM chunks` — nunca lida do filesystem em runtime |
| Adicionar tópico | Criar subpasta + `.md` + rodar `npm run index:content`. Sem alteração de código |

### 5.1 Indexação (script offline)

Script `scripts/index-content.ts`, rodado via `npm run index:content` sempre que o material mudar. **Não chama LLM** — apenas lê, fatia e grava.

Passos:
1. Percorrer as subpastas de `/content` conforme §5.0.
2. Chunking por heading de nível 2 (`##`), com fallback para blocos de ~800 tokens quando um heading gerar chunk maior que ~1500 tokens.
3. Descartar chunks com menos de 200 caracteres — não sustentam uma pergunta.
4. Calcular `content_hash` (SHA-256 do texto normalizado) e gravar com `ON CONFLICT (content_hash) DO NOTHING`. Isso preserva `times_used` de chunks inalterados entre execuções.
5. Marcar como removidos os chunks cujo `source_file` ainda existe mas cujo hash sumiu do arquivo.
6. Logar por tópico: arquivos lidos, chunks criados, mantidos, descartados e motivo.

### 5.2 Sorteio do material (server-side, antes do LLM)

O sorteio é responsabilidade do código, **não do modelo**. Modelo tende a gravitar para os mesmos conceitos; sorteio próprio é determinístico e auditável.

Ao iniciar uma rodada, selecionar 7 chunks:

1. Universo: todos os chunks ativos (ou os do tópico escolhido). `chunks.active = 0` representa material removido pela indexação.
2. Excluir chunks presentes em `seen_chunks` do usuário nos últimos 7 dias.
3. Se após a exclusão restarem menos de 7, relaxar a janela para 3 dias; se ainda faltar, ignorar o filtro (e logar).
4. Sortear 7 distintos, com peso inversamente proporcional a `times_used` — espalha o uso do material.
5. Atribuir dificuldade por posição: posições 1–2 `facil`, 3–5 `medio`, 6–7 `dificil`.
6. Após a preparação bem-sucedida, incrementar `times_used` e gravar em `seen_chunks` somente os 7 chunks efetivamente usados. No fallback, registrar os chunks das perguntas reaproveitadas, não os do sorteio inicial. Fazer isso na transação que confirma a rodada; falha total não altera o histórico. Não manter transação aberta durante a chamada ao LLM.

Se o universo tiver menos de 7 chunks, retornar erro amigável: "material insuficiente para uma rodada, escolha outro tópico".

### 5.3 Chamada ao LLM (uma por rodada)

Uma única chamada, com os 7 chunks e as dificuldades-alvo, retornando 7 perguntas em structured output:

```json
{
  "questions": [
    {
      "position": 1,
      "difficulty": "facil",
      "stem": "string, mínimo 20 caracteres",
      "options": ["string", "string", "string", "string"],
      "correct_index": 0,
      "explanation": "string, deve referenciar o conceito do trecho de origem"
    }
  ]
}
```

Instruções obrigatórias no prompt:
- Cada pergunta deve derivar **exclusivamente** do chunk correspondente à sua posição.
- Não repetir o enunciado como alternativa; sem "todas as anteriores" / "nenhuma das anteriores".
- Distratores plausíveis, não absurdos.
- **Sem pegadinhas de leitura** — nada de negação escondida ou diferença de uma palavra. Dificuldade vem do conceito, não da desatenção.
- Explicação cita o conceito do trecho de origem.
- Escala de dificuldade conforme §5.4.

### 5.4 Escala de dificuldade

| Nível | Instrução ao modelo |
|---|---|
| `facil` | Definição ou conceito direto, explicitamente presente no trecho |
| `medio` | Aplicação do conceito, ou distinção entre dois conceitos próximos do trecho |
| `dificil` | Cenário prático, trade-off ou consequência — exige raciocínio sobre o trecho, não recuperação literal |

### 5.5 Validação programática

Rejeita a rodada inteira e dispara o fallback (§5.6) se qualquer condição falhar em qualquer pergunta:

- Retornaram exatamente 7 perguntas, uma por posição
- `options.length === 4`
- `correct_index` entre 0 e 3
- Nenhuma opção duplicada (case-insensitive, trim)
- `stem.length >= 20` e `explanation.length >= 20`
- `difficulty` bate com a atribuída à posição

### 5.6 Fallback obrigatório

Se a chamada ao LLM falhar, estourar 20 segundos ou não passar na validação:

1. Montar a rodada com perguntas válidas de `questions` já persistidas (rodadas anteriores), respeitando tópico, distribuição de dificuldade e `active = 1` tanto na pergunta quanto no chunk. Exigir 7 chunks distintos, maximizar a quantidade de chunks nunca vistos pelo usuário (histórico completo de `seen_chunks`) e sortear os empates. Buscar uma combinação completa 2/3/2; uma escolha inicial não pode impedir o uso de outra combinação válida.
2. Se o banco não tiver perguntas suficientes, **reverter a criação da `round`** (sem deixar registro no histórico nem no ranking) e mostrar "não conseguimos preparar seu desafio agora, tente em alguns minutos".

O jogador nunca fica com uma rodada quebrada no histórico por erro de infraestrutura.

### 5.7 Moderação distribuída (substitui curadoria humana)

- Botão "reportar pergunta" exibido **após** a resposta (antes seria pista).
- `POST /api/perguntas/:id/reportar` incrementa `reports`; na mesma transação, se `reports >= 3`, seta `active = 0`.
- Sem interface de auditoria em v1 — inspeção via query direta no Turso.
- Reflete apenas no pool de fallback (§5.6): pergunta inativa não é reaproveitada.

---

## 6. Mecânica do jogo

### 6.1 Formato da rodada

7 perguntas de múltipla escolha, 4 alternativas, exatamente uma correta. Orçamento total de ~5 minutos:

| Posição | Dificuldade | Tempo de referência | Pontos base |
|---|---|---|---|
| 1–2 | Fácil | 25s | 100 |
| 3–5 | Médio | 35s | 200 |
| 6–7 | Difícil | 45s | 300 |

**O tempo não encerra a pergunta.** Não há limite duro: o jogador responde quando quiser e a
pergunta continua respondível depois do tempo de referência. Esse tempo define apenas até
quando existe bônus de agilidade (§6.2). Jogando no ritmo de referência a rodada fecha em
torno de 278s, contando o feedback pós-resposta (~5s por pergunta).

O tempo de referência sobe junto com a dificuldade por decisão de design: tempo fixo
penalizaria a pergunta difícil e tornaria o bônus de velocidade uma loteria.

### 6.2 Pontuação

```
fator_velocidade = max(0, (tempo_limite_ms - decorrido_ms) / tempo_limite_ms)   // 0 a 1
pontos = acerto ? round( base(dificuldade) × (1 + fator_velocidade) ) : 0
```

Erro: 0 pontos. Acerto depois do tempo de referência: base cheia, sem bônus — o `max(0, …)`
zera o fator, nunca a pontuação. Máximo teórico da rodada: 2.520; mínimo de uma rodada toda
correta sem bônus: 1.260.

Exemplos de referência para teste:

| Situação | Cálculo | Pontos |
|---|---|---|
| Difícil, 9s usados de 45s | 300 × (1 + 0,80) | 540 |
| Difícil, 40s usados de 45s | 300 × (1 + 0,11) | 333 |
| Fácil, 5s usados de 25s | 100 × (1 + 0,80) | 180 |
| Difícil, 90s usados de 45s | 300 × (1 + 0) | 300 |
| Qualquer erro | — | 0 |

**Sem bônus de streak.** Com 7 perguntas e dificuldade crescente, streak concentraria prêmio em quem pegou uma leva favorável; o fator de velocidade já cria variação suficiente.

### 6.3 Tentativas ilimitadas

- **Não há limite de rodadas por usuário**, nem por dia nem por semana. Não existe trava diária, nem constraint de unicidade em `rounds`, nem contagem regressiva para a próxima tentativa.
- `game_date` continua sendo gravado (dia-calendário em `America/Sao_Paulo`, formato `YYYY-MM-DD`) apenas como dado de histórico e para contar **dias jogados** no ranking — não é mais chave de trava.
- **Uma rodada em andamento por vez.** Enquanto existir uma `rounds` do usuário com `played_at` nulo e `started_at` há menos de 10 minutos, `POST /api/rodada/iniciar` não cria outra: retorna a rodada existente e o jogador volta à pergunta atual. Isso impede abrir várias rodadas em paralelo e ficar com a melhor.
- Rodada com `played_at` nulo e `started_at` há mais de 10 minutos é finalizada automaticamente com o score parcial, na próxima leitura relevante (lazy, sem cron). A partir daí o usuário pode iniciar outra.
- Consequência aceita: abandonar uma rodada ruim e começar outra é permitido, mas a rodada abandonada é encerrada com o score parcial e **conta no ranking**. Isso precisa estar explícito em `/jogar` antes de começar: "se você sair no meio, a rodada é encerrada com os pontos que já fez e entra no ranking".
- Home mostra o estado atual: pontos totais do usuário, posição no ranking e botão para jogar — sem mensagem de espera.

### 6.4 Fluxo de endpoints

1. `POST /api/rodada/iniciar` com `{ topico? }`
   - Verifica se já existe rodada em andamento do usuário (§6.3); havendo, retorna ela em vez de criar outra.
   - Sorteia os 7 chunks (§5.2).
   - Chama o LLM (§5.3), valida (§5.5), com fallback (§5.6).
   - Persiste `questions`, cria `rounds` e as 7 linhas de `round_questions` com `position` e `time_limit_ms`.
   - Retorna `round_id` e a **primeira** pergunta apenas.

2. `GET /api/rodada/:roundId/pergunta`
   - Retorna a próxima pergunta não respondida: `position`, `difficulty`, `stem`, `options`, `time_limit_ms`.
   - Grava `served_at` no momento da entrega, se ainda nulo.
   - **Nunca** retorna `correct_index` nem `explanation`.

3. `POST /api/rodada/:roundId/responder` com `{ question_id, chosen_index, client_elapsed_ms }`
   - Calcula `elapsed_server = now - served_at`. Ignora `client_elapsed_ms` para pontuar.
   - `elapsed_server > time_limit_ms` não invalida a resposta: só zera o bônus de agilidade.
   - Aplica a fórmula de §6.2, atualiza `round_questions` e soma em `rounds`.
   - Retorna `{ is_correct, correct_index, explanation, points_earned, position, total_positions }`.

4. `POST /api/rodada/:roundId/finalizar`
   - Seta `played_at`, retorna score final, acertos e posição no ranking geral.

### 6.5 Entrega das perguntas ao cliente

O cliente recebe uma pergunta por vez (endpoint 2), não o lote inteiro. As 7 já existem no banco desde o início — a entrega fatiada é o que impede que `correct_index` ou o enunciado das próximas fiquem disponíveis no payload.

### 6.6 Tela de preparação

Entre o clique em "Começar" e a primeira pergunta há a chamada ao LLM (~8–12s). Essa espera precisa de tela própria, com indicação de progresso e texto explicando que as perguntas estão sendo sorteadas e escritas para aquele jogador. Timeout visual em 20s, sincronizado com o fallback de §5.6.

O `roundId` só existe depois que `POST /api/rodada/iniciar` retorna — é ele quem chama o LLM e pode reverter a rodada. Por isso a preparação é um **estado da própria `/jogar`**, não uma rota anterior à rodada; `/jogar/[roundId]/preparando` existe apenas como redirect para a rodada já criada (reload/bookmark).

### 6.7 Limites de justiça (documentar, não resolver)

Perguntas geradas por jogador nunca serão perfeitamente equivalentes: dois "difícil" podem ter dificuldade real distinta. O que o sistema garante é justiça **estrutural** — mesma quantidade, mesma distribuição de níveis, mesmos tempos, sorteio uniforme e ponderado do material, sem repetição de chunk.

Isso basta para uma gincana interna. O sistema não deve ser apresentado como avaliação objetiva de conhecimento.

---

## 7. Ranking

Ranking **geral acumulado**, visível para todos os usuários logados.

- **Agregação:** `SUM(score)` por usuário sobre todas as rodadas com `played_at` não nulo. Sem recorte de semana e sem reset.
- **Escopo da listagem:** **todos** os usuários que já concluíram ao menos uma rodada, ordenados por pontos desc. Sem corte em top 10.
  - Paginação em blocos de 50 (`?limit` / `?offset`, padrão 50). A UI carrega o primeiro bloco e oferece "carregar mais".
- **Colunas:** posição, nome do usuário, pontos totais, **dias jogados** (`COUNT(DISTINCT game_date)`) e **rodadas jogadas** (`COUNT(*)`). Com tentativas ilimitadas, essas duas colunas separam quem pontua alto de quem apenas joga muito.
- **Usuário logado:** a resposta sempre traz um bloco `me` com `{ posicao, pontos, dias_jogados, rodadas_jogadas, melhor_rodada }`, mesmo que ele não esteja na página carregada. Na UI esse bloco fica fixo no topo da tabela, e a linha correspondente é destacada quando aparece na lista.
- **Usuário sem rodada concluída:** `me` vem com pontos 0 e `posicao: null`; a UI mostra "jogue sua primeira rodada para entrar no ranking".
- **Desempate:** maior pontuação primeiro; empatando, menos dias jogados; persistindo, menos rodadas jogadas; persistindo, `played_at` da primeira rodada mais antigo. Determinístico e estável entre requisições.

## 8. Telas

| Rota | Conteúdo |
|---|---|
| `/` | Sem sessão: form de e-mail. Com sessão: ranking geral (todos os usuários) + card com a pontuação e a posição do usuário logado + botão "Jogar" |
| `/jogar` | Seletor de tópico, aviso de que sair no meio encerra a rodada com o score parcial, botão "Começar" |
| `/jogar/[roundId]/preparando` | Redirect para `/jogar/[roundId]`: a preparação acontece dentro de `/jogar`, onde a rodada ainda não tem id (§6.6) |
| `/jogar/[roundId]` | Pergunta atual, indicador de dificuldade, timer, alternativas, feedback pós-resposta |
| `/resultado/[roundId]` | Score final, acertos, quebra por pergunta, posição no ranking, botão "Jogar de novo" |
| `/historico` | Rodadas anteriores do usuário: data, tópico, score, acertos |
| `/materiais` | Catálogo público das apostilas Markdown usadas pelo quiz |
| `/materiais/[slug]` | Leitor público da apostila, com sumário e conteúdo renderizado |

## 8.1 Identidade visual

A aplicação deve seguir o **brand da Selbetti**. O guia de marca está em `/docs/brand` — ler antes de qualquer decisão visual.

| Regra | Definição |
|---|---|
| Fonte de verdade | `/docs/brand` — nunca inferir cores ou tipografia de memória, nem inventar paleta |
| Logo | **Não usar o logo da Selbetti** em nenhuma tela, favicon, header, footer ou meta imagem |
| Identidade da aplicação | Wordmark textual próprio ("Gincana Data & AI") na tipografia do brand |
| Tokens | Cores e tipografia traduzidas em tokens no `tailwind.config` — sem hex solto em componentes |
| Tom | O guia orienta a linguagem da UI; contexto lúdico, tom descontraído dentro do que o brand permite |

Casos não cobertos pelo guia (cor de acerto, erro, tempo esgotado, indicador de dificuldade) devem derivar da paleta existente, com a escolha documentada em comentário no `tailwind.config`. Sem introduzir família de cor nova.

---

## 9. Fora de escopo (v1 — não implementar sem revisão explícita)

- Autenticação verificada (magic link, OAuth)
- Painel de curadoria/admin
- Embeddings / busca semântica sobre o material
- Modo duelo 1v1 ou multiplayer síncrono
- Badges, conquistas, gamificação além de pontos e ranking
- Formatos de pergunta além de múltipla escolha com uma correta
- Ranking por tópico
- Ranking com recorte semanal ou por período
- Limite de tentativas por dia ou por período

---

## 10. Critérios de aceite

**Entrada/cadastro**
- [ ] E-mail fora do domínio é rejeitado com mensagem clara
- [ ] E-mail com maiúsculas/espaços é aceito e persistido normalizado
- [ ] Mesmo e-mail reutilizado não cria usuário duplicado
- [ ] Sessão persiste após reload

**Material e indexação**
- [ ] `npm run index:content` popula `chunks` a partir de `content/<topico>/*.md`
- [ ] `chunks.topic` corresponde ao nome da subpasta
- [ ] `.md` solto em `content/` é ignorado com aviso no log
- [ ] Rodar duas vezes não duplica chunks e preserva `times_used`
- [ ] Chunk com menos de 200 caracteres é descartado

**Sorteio e geração**
- [ ] Rodada usa 7 chunks distintos
- [ ] Chunk visto pelo usuário nos últimos 7 dias não é sorteado, havendo alternativa
- [ ] Chunks com `times_used` menor são sorteados com mais frequência ao longo de várias rodadas
- [ ] Exatamente uma chamada ao LLM por rodada (verificável por log)
- [ ] Resposta do LLM com pergunta malformada dispara o fallback, não quebra a rodada
- [ ] Falha total de LLM e banco sem perguntas suficientes **reverte** a rodada, sem deixar registro
- [ ] Tópico com menos de 7 chunks retorna erro amigável

**Jogo**
- [ ] Rodada de 7 perguntas completa, com dificuldade e tempo subindo conforme §6.1
- [ ] Payload inspecionado na aba Network nunca contém `correct_index` nem perguntas futuras
- [ ] Resposta após o tempo de referência vale a base cheia, sem bônus, mesmo com `client_elapsed_ms` menor
- [ ] Resposta rápida em pergunta difícil pontua mais que resposta lenta em pergunta difícil
- [ ] Os três exemplos de cálculo de §6.2 batem com a implementação
- [ ] Responder duas vezes a mesma pergunta é rejeitado
- [ ] `roundId` de outro usuário retorna 403

**Tentativas ilimitadas**
- [ ] Jogar duas ou mais rodadas no mesmo dia é permitido, sem bloqueio nem contagem regressiva
- [ ] Não existe constraint UNIQUE em `rounds(user_id, game_date)`
- [ ] Com rodada em andamento dentro de 10 minutos, `iniciar` retoma a rodada existente em vez de criar outra
- [ ] Rodada abandonada há mais de 10 minutos é finalizada com score parcial e entra no ranking
- [ ] O aviso sobre sair no meio aparece antes de começar

**Ranking e histórico**
- [ ] Ranking soma todas as rodadas com `played_at` não nulo, sem recorte de período
- [ ] Todos os usuários com rodada concluída aparecem, com paginação, sem corte em top 10
- [ ] Dias jogados e rodadas jogadas exibidos ao lado dos pontos
- [ ] Usuário logado vê sempre a própria pontuação e posição, mesmo fora da página carregada
- [ ] Usuário sem rodada concluída vê pontos 0 e a mensagem de primeira rodada
- [ ] Rodada em andamento (sem `played_at`) não entra no ranking
- [ ] Empates seguem o critério de desempate e a ordem é estável entre requisições
- [ ] Histórico mostra apenas as rodadas do próprio usuário

**Moderação**
- [ ] Botão de reportar só aparece após a resposta
- [ ] 3 reports tornam a pergunta inativa
- [ ] Pergunta inativa não é reaproveitada no fallback

**Brand**
- [ ] Nenhuma ocorrência do logo da Selbetti no repositório ou no build
- [ ] Nenhum hex solto em `app/components/` ou `app/pages/`

**Materiais de estudo**
- [ ] Catálogo e leitor são acessíveis sem sessão
- [ ] Todos os `content/<topico>/*.md` válidos aparecem no catálogo
- [ ] Títulos, tabelas, listas, citações, links e blocos de código renderizam corretamente
- [ ] Sumário, âncoras e leitura responsiva funcionam com teclado e em telas pequenas
- [ ] Slug desconhecido retorna 404 sem permitir acesso arbitrário a arquivos

---

## 11. Estrutura de pastas esperada

```
app/
  pages/
    index.vue
    jogar/
      index.vue
      [roundId]/
        index.vue
        preparando.vue
    resultado/
      [roundId].vue
    historico.vue
    materiais/
      index.vue
      [slug].vue
  components/
    QuestionCard.vue
    Timer.vue
    DifficultyBadge.vue
    RankingTable.vue
server/
  api/
    entrar.post.ts
    rodada/
      iniciar.post.ts
      [roundId]/
        pergunta.get.ts
        responder.post.ts
        finalizar.post.ts
    perguntas/
      [id]/
        reportar.post.ts
    ranking.get.ts
    historico.get.ts
  services/
    chunk-sampler.ts        -- sorteio ponderado (§5.2)
    question-generator.ts   -- prompt, chamada, validação, fallback (§5.3-5.6)
    scoring.ts              -- fórmula de pontuação (§6.2)
  db/
    schema.ts
    index.ts
content/
  <topico-slug>/
    *.md
docs/
  brand/                    -- guia de marca (fornecido, não gerado)
scripts/
  index-content.ts
```

---

## 12. Variáveis de ambiente

```
# Desenvolvimento: SQLite local — TURSO_DATABASE_URL=file:./.data/dev.db e TURSO_AUTH_TOKEN vazio.
# Produção: TURSO_DATABASE_URL=libsql://<db>.turso.io e TURSO_AUTH_TOKEN=<token>.
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
LLM_API_KEY=
LLM_MODEL=gemini-3.1-flash-lite
SESSION_SECRET=
GAME_TIMEZONE=America/Sao_Paulo
```

O driver é `@libsql/client` nos dois casos; só a URL/token muda entre dev e produção.
