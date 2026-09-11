# T05 — Sorteio e gerador de perguntas

**Depende de:** T04
**Referência:** `SPEC.md` §5.2 a §5.6

## Objetivo

Serviço que, dado um usuário e um tópico opcional, devolve 7 perguntas válidas com dificuldade crescente — com sorteio próprio, uma chamada ao LLM e fallback que nunca queima a tentativa do jogador.

**Esta é a tarefa de maior risco do projeto.** Implemente e teste fora da UI, via script de invocação direta, antes de integrar em T07.

## Escopo

### `server/services/chunk-sampler.ts` (§5.2)

1. Universo: todos os chunks, ou os do tópico escolhido.
2. Excluir chunks em `seen_chunks` do usuário nos últimos 7 dias.
3. Se restarem menos de 7, relaxar para 3 dias; se ainda faltar, ignorar o filtro **e logar**.
4. Sortear 7 distintos, com peso inversamente proporcional a `times_used`.
5. Atribuir dificuldade por posição: 1–2 `facil`, 3–5 `medio`, 6–7 `dificil`.
6. Incrementar `times_used` e gravar `seen_chunks`.
7. Menos de 7 chunks no universo → erro tipado "material insuficiente".

### `server/services/question-generator.ts` (§5.3–5.6)

8. Montar **uma única** chamada ao LLM com os 7 chunks e as dificuldades-alvo, structured output no schema de §5.3.
9. O prompt deve conter todas as instruções obrigatórias de §5.3, incluindo a proibição explícita de pegadinhas de leitura, e a escala de §5.4.
10. Validação de §5.5. Falha em qualquer pergunta → rodada inteira rejeitada, dispara fallback.
11. Timeout de 20s na chamada.
12. **Fallback (§5.6):** montar a rodada com perguntas já persistidas em `questions`, respeitando tópico, distribuição de dificuldade e `active = 1`, preferindo `chunk_id` não visto pelo usuário.
13. Se o fallback também não conseguir 7 perguntas, lançar erro tipado que sinaliza a T07/T08 para **reverter a rodada e não consumir a tentativa do dia**.
14. Logar em cada execução: caminho usado (LLM ou fallback), latência, perguntas rejeitadas e motivo.

## Regras duras

- Exatamente uma chamada ao LLM por execução (`AGENTS.md` regra 1).
- O sorteio é do código; o modelo só redige (`AGENTS.md` regra 1b).
- Nenhuma dependência de UI neste serviço — deve ser invocável por script.

## Aceite

- [ ] Invocação direta do serviço devolve 7 perguntas válidas
- [ ] Os 7 chunks são distintos
- [ ] Chunk visto nos últimos 7 dias não é sorteado, havendo alternativa
- [ ] Ao longo de várias execuções, chunks com `times_used` menor aparecem mais
- [ ] Distribuição de dificuldade é 2/3/2 nas posições corretas
- [ ] Exatamente uma chamada ao LLM por execução, verificável no log
- [ ] Resposta do LLM forjada com opção duplicada dispara o fallback
- [ ] Resposta do LLM forjada com 6 perguntas dispara o fallback
- [ ] Timeout simulado dispara o fallback
- [ ] Fallback sem perguntas suficientes lança o erro tipado de "não consumir tentativa"
- [ ] Tópico com menos de 7 chunks retorna o erro de material insuficiente
