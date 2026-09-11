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
