# T10 — Reportar pergunta

**Depende de:** T07
**Referência:** `SPEC.md` §5.7

## Objetivo

Moderação distribuída: perguntas ruins saem do pool de reaproveitamento automaticamente, sem curadoria humana.

## Escopo

1. `POST /api/perguntas/:id/reportar` — incrementa `questions.reports`.
2. Na mesma transação: se `reports >= 3`, setar `active = 0`.
3. Botão "reportar pergunta" na tela de pergunta, visível **após** a resposta — antes seria pista de que algo está errado com a alternativa.
4. Feedback visual de confirmação.
5. Impedir report duplicado do mesmo usuário na mesma pergunta (checagem via `round_questions`).
6. Validar que a pergunta pertence a uma rodada do usuário da sessão.

## Regras duras

- Sem interface de auditoria em v1 — inspeção via query direta no banco (SQLite local em dev, Turso em produção).
- Trigger de aplicação, não trigger de banco.
- O report afeta o pool de fallback de `SPEC.md` §5.6; perguntas geradas ao vivo não são impactadas retroativamente.

## Aceite

- [ ] 3 reports na mesma pergunta a tornam inativa
- [ ] Pergunta inativa não é reaproveitada no fallback
- [ ] Botão só aparece após a resposta
- [ ] Report duplicado é rejeitado
- [ ] Reportar pergunta de rodada alheia retorna 403
