# Tarefas — Gincana Data & AI

Decomposição da `SPEC.md` em tarefas sequenciais para desenvolvimento orientado por spec.

## Como usar

Cada arquivo é uma unidade de trabalho autocontida. No agente, abra uma sessão por tarefa:

```
Leia AGENTS.md, SPEC.md e tasks/T01-setup.md. Execute a tarefa T01.
```

**Regras de execução:**
- Tarefas são sequenciais. Não inicie uma sem a anterior aprovada.
- Cada tarefa começa com um plano apresentado ao Gabriel e só avança após aprovação.
- Cada tarefa termina com a checklist de aceite verificada manualmente e reportada.
- Se um requisito da spec estiver ambíguo, perguntar — não decidir em silêncio.

## Ordem

| # | Tarefa | Depende de | Entrega |
|---|---|---|---|
| T01 | Setup do projeto e infraestrutura | — | Projeto Nuxt rodando, conectado ao Turso |
| T02 | Design system a partir do brand | T01 | Tokens Tailwind + componentes base |
| T03 | Schema e migrations | T01 | Tabelas e constraints criadas no Turso |
| T04 | Indexação do conteúdo | T03 | `chunks` populada a partir de `content/` |
| T05 | Sorteio e gerador de perguntas | T04 | Serviço que devolve 7 perguntas válidas, com fallback |
| T06 | Entrada e sessão | T03, T02 | Usuário entra por e-mail e permanece logado |
| T07 | Fluxo de rodada | T05, T06 | Rodada de 7 perguntas jogável de ponta a ponta |
| T08 | Tentativa diária | T07 | Trava de uma rodada por dia, à prova de abandono |
| T09 | Ranking e histórico | T08 | Ranking semanal com dias jogados, histórico pessoal |
| T10 | Reportar pergunta | T07 | Moderação distribuída ativa |
| T11 | Deploy | T09, T10 | Aplicação no ar na Vercel |

T05 é a tarefa de maior risco técnico — é onde moram o sorteio, o prompt, a validação e o fallback. Vale isolá-la e testá-la fora da UI antes de T07.

## Executar e verificar a T05

O material MDM foi copiado de `base/mdm/` para `content/mdm/`. Prepare o SQLite local com `npm run db:push` e `npm run index:content`. Os serviços não leem arquivos de conteúdo em runtime.

```sh
npm run questions:check          # 24 cenários simulados, banco em memória, sem consumo de LLM
npm run questions:check -- --live # uma chamada real; requer LLM_API_KEY e material MDM indexado
npm run build
```

No PowerShell com scripts desabilitados, use `npm.cmd`. Nenhum framework de testes ou SDK de LLM foi adicionado.

O modo `--live` lê os chunks do banco configurado, copia-os para SQLite em memória e registra o uso apenas nessa cópia. Se houver sucesso, salva perguntas e trechos para revisão em `.data/t05-live-review.json` (ignorado pelo Git). Não popula o pool de perguntas da aplicação. O timeout continua sendo 20 segundos e não há nova tentativa automática.

### Contrato para T07/T08

`prepareQuestions({ userId, topic? }, dependencies)` recebe o banco Drizzle e `apiKey`; opcionalmente aceita `model`, `transport`, `now`, `random` e `log`. Os serviços usam imports explícitos e não dependem de `useRuntimeConfig`. No endpoint, passar `db`, `config.llmApiKey` e `config.llmModel`; nos scripts, passar variáveis de ambiente.

O retorno contém `source: 'llm' | 'fallback'`, `userId` e sete perguntas ordenadas com `id`, `position`, `difficulty`, `stem`, `options`, `correctIndex`, `explanation`, `chunkId`, `topic` e `sourceFile`. É um contrato interno com gabaritos: nunca enviar o lote diretamente ao cliente. IDs novos são gerados no caminho LLM; o fallback preserva os IDs persistidos.

Preparar faz apenas leituras no banco. Depois do sucesso, T07 deve persistir as perguntas novas (serializando `options`), reutilizar as existentes no fallback e chamar `recordPreparedUsage(transaction, prepared)` exatamente uma vez na mesma transação que confirma a rodada e suas sete associações. A função de registro não é idempotente isoladamente: a trava e a transação da rodada são responsabilidade de T07/T08. Qualquer erro deve abortar a transação inteira.

`PreparationError` tem `consumeAttempt = false` e código `INSUFFICIENT_MATERIAL` ou `PREPARATION_UNAVAILABLE`. T07/T08 devem traduzir a mensagem para a API e desfazer qualquer reserva da tentativa diária. A T05 não cria nem remove rodadas. Não manter uma transação aberta durante a chamada ao modelo.

Sem material suficiente, a preparação termina antes de chamar o modelo. Sem chave configurada, tenta somente o fallback e registra zero chamadas. Em uma execução normal há uma chamada, inclusive quando a resposta é rejeitada; nunca há retries. Relógio, aleatoriedade e transporte podem ser injetados para testar falhas sem consumo de cota. `timeoutMs` é exclusivo para simulação de timeout; produção deve usar o padrão de 20.000 ms.
