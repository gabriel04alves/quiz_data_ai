# T04 — Indexação do conteúdo

**Depende de:** T03
**Referência:** `SPEC.md` §5.0, §5.1

## Objetivo

`npm run index:content` lê o material em `content/`, fatia em chunks e popula a tabela `chunks`. **Não usa LLM.**

## Escopo

1. Implementar `scripts/index-content.ts`.
2. **Descoberta de arquivos** conforme `SPEC.md` §5.0: exatamente um nível de subpastas; nome da subpasta vira `topic`; `source_file` é o caminho relativo a partir de `content/`. Arquivo solto na raiz e subpasta aninhada mais profunda são ignorados **com aviso no log**.
3. **Chunking:** por heading de nível 2 (`##`), com fallback para blocos de ~800 tokens quando o heading gerar chunk maior que ~1500 tokens. Preservar o texto do heading no campo `heading`.
4. **Descarte:** chunks com menos de 200 caracteres não entram.
5. **Idempotência:** `content_hash` (SHA-256 do texto normalizado) com `ON CONFLICT DO NOTHING`. Chunk inalterado entre execuções **preserva `times_used`** — isso é requisito, não detalhe.
6. **Limpeza:** chunk cujo `source_file` ainda existe mas cujo hash sumiu do arquivo é marcado como removido.
7. **Log por tópico:** arquivos lidos, chunks criados, mantidos, descartados e motivo.

## Regras duras

- Zero chamadas a LLM neste script.
- Sem embeddings, sem vector store (`SPEC.md` §9).

## Aceite

- [ ] `npm run index:content` popula `chunks` a partir de `content/<topico>/*.md`
- [ ] `chunks.topic` corresponde ao nome da subpasta
- [ ] `.md` solto em `content/` é ignorado com aviso no log
- [ ] Chunk com menos de 200 caracteres é descartado e aparece no log
- [ ] Rodar duas vezes não duplica chunks
- [ ] `times_used` de um chunk inalterado sobrevive a uma reindexação
- [ ] Editar um `.md` e reindexar reflete a mudança
