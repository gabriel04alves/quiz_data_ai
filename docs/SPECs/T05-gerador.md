# T05 — Sorteio e gerador de perguntas

**Depende de:** T04
**Referência:** `SPEC.md` §5.2 a §5.6

## Objetivo

Serviço que, dado um usuário e um tópico opcional, devolve 7 perguntas válidas com dificuldade crescente — com sorteio próprio, uma chamada ao LLM e fallback que nunca deixa rodada quebrada para o jogador.

**Esta é a tarefa de maior risco do projeto.** Implemente e teste fora da UI, via script de invocação direta, antes de integrar em T07.

## Escopo

### `server/services/chunk-sampler.ts` (§5.2)

1. Universo: todos os chunks ativos, ou os do tópico escolhido.
2. Excluir chunks em `seen_chunks` do usuário nos últimos 7 dias.
3. Se restarem menos de 7, relaxar para 3 dias; se ainda faltar, ignorar o filtro **e logar**.
4. Sortear 7 distintos, com peso inversamente proporcional a `times_used`.
5. Atribuir dificuldade por posição: 1–2 `facil`, 3–5 `medio`, 6–7 `dificil`.
6. Registrar `times_used` e `seen_chunks` somente após sucesso, para os chunks efetivamente usados, via função separada que recebe a transação de confirmação da rodada. Não registrar o sorteio inicial se o fallback entregar outros chunks.
7. Menos de 7 chunks no universo → erro tipado "material insuficiente".

### `server/services/question-generator.ts` (§5.3–5.6)

8. Montar **uma única** chamada ao Google AI Studio (`gemini-3.1-flash-lite`, configurável por `LLM_MODEL`) com os 7 chunks e as dificuldades-alvo, structured output no schema de §5.3. Usar REST com `fetch` nativo, sem retries.
9. O prompt deve conter todas as instruções obrigatórias de §5.3, incluindo a proibição explícita de pegadinhas de leitura, e a escala de §5.4.
10. Validação de §5.5. Falha em qualquer pergunta → rodada inteira rejeitada, dispara fallback.
11. Timeout de 20s na chamada.
12. **Fallback (§5.6):** montar a rodada com perguntas válidas já persistidas em `questions`, respeitando tópico, distribuição de dificuldade e `active = 1` na pergunta e no chunk. Exigir 7 chunks distintos, maximizar chunks nunca vistos pelo usuário e sortear empates; procurar uma combinação completa, sem seleção gulosa que descarte soluções válidas.
13. Se o fallback também não conseguir 7 perguntas, lançar erro tipado que sinaliza a T07/T08 para **reverter a rodada criada**, sem deixar registro no histórico nem no ranking.
14. Logar em cada execução: caminho usado (LLM ou fallback), latência, perguntas rejeitadas e motivo.

## Regras duras

- Exatamente uma chamada ao LLM por execução (`AGENTS.md` regra 1).
- O sorteio é do código; o modelo só redige (`AGENTS.md` regra 1b).
- Nenhuma dependência de UI neste serviço — deve ser invocável por script.

## Aceite

- [x] Invocação direta do serviço devolve 7 perguntas válidas (transporte simulado)
- [x] Os 7 chunks são distintos
- [x] Chunk visto nos últimos 7 dias não é sorteado, havendo alternativa
- [x] Ao longo de várias execuções, chunks com `times_used` menor aparecem mais
- [x] Distribuição de dificuldade é 2/3/2 nas posições corretas
- [x] Exatamente uma chamada ao LLM por execução normal, verificável no log (pré-condições inválidas não chamam o modelo)
- [x] Resposta do LLM forjada com opção duplicada dispara o fallback
- [x] Resposta do LLM forjada com 6 perguntas dispara o fallback
- [x] Timeout simulado dispara o fallback
- [x] Fallback sem perguntas suficientes lança o erro tipado de "reverter rodada"
- [x] Tópico com menos de 7 chunks retorna o erro de material insuficiente

## Verificação da implementação — 11/09/2026

- `npm run questions:check`: 24 cenários em SQLite em memória, incluindo opções e posições inválidas, timeout de transporte e leitura do corpo, combinação de fallback 2/3/2, priorização de inéditos, chunks removidos e rollback.
- Banco local sincronizado com o schema existente; `content/mdm/` indexado com 113 chunks ativos. Duas reindexações em cópia isolada preservaram todos os registros e um contador `times_used = 17`.
- Build Nuxt/Nitro concluído com acesso de leitura fora do sandbox (o rastreamento de diretórios falhava com `EPERM` no sandbox).
- Uma chamada real ao `gemini-3.1-flash-lite` atingiu o timeout de 20 segundos. O fallback vazio retornou `PREPARATION_UNAVAILABLE`; nenhum histórico foi registrado. Consulta de metadados do modelo retornou HTTP 200 com a chave configurada. Não houve nova chamada de geração.
- Pendente: obter um lote real dentro de 20 segundos e revisar sua aderência aos trechos. A verificação estrutural com respostas simuladas não comprova qualidade semântica do modelo.
- A reversão completa da rodada depende da integração transacional de T07/T08. A T05 devolve o erro tipado e não cria rodadas.
- Verificação estática de tipos não executada: o projeto não tem o compilador TypeScript instalado. O build e os scripts transpilaram os arquivos executados; não foi adicionada dependência nova.
