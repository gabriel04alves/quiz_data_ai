# T11 — Deploy

**Depende de:** T09, T10
**Referência:** `SPEC.md` §2, §8.1, §10, §12

## Objetivo

Aplicação no ar na Vercel, conectada ao Turso de produção, com o material real indexado.

## Escopo

1. Remover a página `/estilo` criada em T02.
2. Configurar o projeto na Vercel com as variáveis de `SPEC.md` §12, incluindo `GAME_TIMEZONE`.
3. Confirmar que o build do Nitro roda no preset da Vercel e que o timeout de função comporta a chamada ao LLM (§6.6) — o free tier tem limite; verificar e ajustar o timeout do gerador se necessário.
4. Rodar `npm run index:content` contra o banco de produção, com o material real.
5. Confirmar que há chunks suficientes por tópico: **mínimo de 7**, e idealmente 30+ para que a anti-repetição de 7 dias funcione.
6. Favicon e meta tags com o wordmark textual — **sem o logo da Selbetti** (`SPEC.md` §8.1).
7. Rodar uma rodada real em produção e conferir a latência da tela de preparação.
8. Passar a checklist completa de `SPEC.md` §10 no ambiente de produção.
9. `README.md` curto: o que é, como rodar local, como adicionar tópico novo (subpasta em `content/` + `npm run index:content`).

## Aceite

- [ ] Aplicação acessível na URL da Vercel
- [ ] Entrada, rodada completa, trava diária, ranking e histórico funcionam em produção
- [ ] Chamada ao LLM conclui dentro do timeout de função da Vercel
- [ ] Tela de preparação leva menos de 20s numa rodada real
- [ ] Cada tópico tem no mínimo 7 chunks
- [ ] `/estilo` não existe mais
- [ ] Nenhum logo da Selbetti no build de produção
- [ ] Checklist de `SPEC.md` §10 verificada e reportada
- [ ] `README.md` presente
