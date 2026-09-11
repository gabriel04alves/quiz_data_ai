# AGENTS.md

Instruções operacionais para agentes de código trabalhando neste repositório.

## O que é este projeto

Quiz web em formato de gincana para a equipe de Data & AI da Selbetti. Perguntas de múltipla escolha geradas por IA a partir de material de estudo em markdown, com pontuação e ranking semanal.

**A especificação completa está em `SPEC.md`. Leia antes de escrever qualquer código.** Este arquivo cobre apenas como trabalhar no repositório; `SPEC.md` cobre o que construir.

## Idioma

- **Código** (variáveis, funções, tipos, nomes de arquivo): inglês.
- **Rotas de página, textos de UI e mensagens de erro para o usuário**: português brasileiro.
- **Comentários e commits**: português brasileiro.
- **Conversa comigo**: português brasileiro.

Nomes de rota já definidos em `SPEC.md` (`/jogar`, `/historico`, `/api/entrar`) são em português por decisão — não "corrigir" para inglês.

## Stack — fixada, não substituir

Nuxt 4 · TypeScript · Tailwind · Turso (libSQL) · Drizzle ORM · nuxt-auth-utils · npm · deploy Vercel.

Em desenvolvimento o banco é um SQLite local (`file:./.data/dev.db`) acessado pelo mesmo driver `@libsql/client`; Turso é só produção. Trocar entre os dois é trocar `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`, nada de código.

Se durante a implementação uma dessas escolhas parecer inadequada, **pare e me avise antes de trocar**. Não introduza dependência nova sem perguntar — em especial: nenhum Redis, nenhum vector store, nenhum provider de auth, nenhuma biblioteca de componentes pesada.

## Regras invariantes (violá-las é bug, não preferência)

1. **Exatamente uma chamada a LLM por rodada.** Ela acontece em `POST /api/rodada/iniciar`, durante a tela de preparação. Nunca entre perguntas, nunca em qualquer outro endpoint. Se você se pegar chamando o modelo em `responder`, `pergunta` ou `finalizar`, algo está errado.
1b. **O sorteio do material é do código, não do modelo.** `chunk-sampler.ts` escolhe os 7 chunks; o LLM só redige as perguntas sobre eles. Nunca peça ao modelo para escolher sobre o que perguntar.
2. **`correct_index` nunca vai para o cliente antes da resposta, e perguntas futuras nunca vão junto.** O cliente recebe uma pergunta por vez via `pergunta.get.ts`, com enunciado e alternativas apenas. A resposta correta só aparece no retorno de `responder.post.ts`, depois que o usuário já escolheu.
3. **O timer autoritativo é o servidor.** O cliente manda `client_elapsed_ms` só para UX; a pontuação usa `now - served_at` calculado no servidor. Nunca confie no tempo reportado pelo cliente para pontuar.
3b. **Uma tentativa por dia, consumida no início.** A trava é o índice UNIQUE `rounds(user_id, game_date)` — garantia no banco, não checagem na aplicação. E falha de LLM ou infraestrutura nunca pode queimar a tentativa do jogador (`SPEC.md` §5.6).
4. **`content/` tem exatamente um nível de subpastas**, e o nome da subpasta é o tópico. Não invente frontmatter, arquivo de config de tópicos, nem leitura recursiva profunda. Ver `SPEC.md` §5.0.
5. **A UI nunca lê o filesystem.** A lista de tópicos vem de `SELECT DISTINCT topic FROM chunks`.
6. **Sem autenticação verificada.** Validação de domínio por regex é o escopo inteiro. Não adicione envio de e-mail, código de confirmação ou OAuth "para melhorar a segurança" — é uma decisão consciente documentada em `SPEC.md` §4.2.
7. **Brand da Selbetti, sem o logo.** O guia está em `/docs/brand` e é a fonte de verdade para cores e tipografia — leia antes de decidir qualquer coisa visual, nunca infira a paleta de memória. O logo da Selbetti não entra em nenhuma tela, favicon ou meta imagem. Cores viram tokens no `tailwind.config`; sem hex solto em componente. Ver `SPEC.md` §8.1.

## Escopo

`SPEC.md` §9 lista o que está explicitamente fora do v1. Não implemente nada dessa lista, mesmo que pareça uma melhoria óbvia ou barata. Se achar que algo de lá deveria entrar, argumente antes — não construa e me mostre depois.

Da mesma forma: não adicione features que não estão na spec. Sem badges, sem modo escuro, sem animações elaboradas, sem sons, sem analytics.

## Como trabalhar

- **Planeje antes de codar.** Para qualquer tarefa que toque mais de um arquivo, me mostre o plano primeiro e espere aprovação.
- **Trabalhe em fatias verticais.** Prefira "entrada/cadastro funcionando de ponta a ponta" a "todos os endpoints, sem UI". Cada fatia deve ser executável e testável manualmente.
- **Entregue código completo e rodável**, não trechos ilustrativos com `// implementar aqui`.
- **Uma mudança de schema por vez**, com migration Drizzle gerada e commitada junto.
- Se um requisito da spec estiver ambíguo, **pergunte em vez de escolher por mim**. Ambiguidade resolvida em silêncio é retrabalho.

## Ordem de implementação sugerida

Ver `tasks/README.md` para a decomposição completa. Resumo: T01 setup, T02 design system, T03 schema, T04 indexação de conteúdo, T05 sorteio + gerador de perguntas, T06 entrada e sessão, T07 fluxo de rodada, T08 tentativa diária, T09 ranking e histórico, T10 reportar, T11 deploy.

Não avance para o próximo item sem o anterior funcionando.

## Comandos

```
npm install
npm run dev              # servidor de desenvolvimento
npm run index:content    # indexa content/ em chunks — não usa LLM, pode rodar à vontade
npm run db:generate      # gera migration Drizzle a partir do schema
npm run db:push          # aplica no banco (SQLite local em dev, Turso em produção)
npm run build
```

**Cada rodada iniciada consome cota de LLM.** Ao testar o fluxo de jogo repetidamente, use um modo de desenvolvimento que force o caminho de fallback (`SPEC.md` §5.6) ou um stub do gerador — não queime cota em teste de UI. `npm run index:content` não usa LLM e pode rodar livremente.

## Variáveis de ambiente

Ver `SPEC.md` §12. Nunca commite `.env`. Mantenha `.env.example` atualizado quando adicionar variável.

## Convenções de código

- Server-side: TypeScript estrito. Sem `any` em `server/`.
- Validação de payload de API: valide explicitamente na entrada de cada handler; não confie no shape do body.
- Erros de API: retorne `createError` do Nitro com status apropriado e `statusMessage` em português, apto a ser exibido ao usuário.
- Componentes Vue: Composition API com `<script setup>`. Sem Options API.
- Sem CSS solto — Tailwind apenas.

## Testes

Sem framework de teste em v1. Os critérios de aceite em `SPEC.md` §10 são a checklist de verificação manual. Quando terminar uma fatia, rode a checklist correspondente e me diga o que passou e o que não passou.
