# T06 — Entrada e sessão

**Depende de:** T03, T02
**Referência:** `SPEC.md` §4

## Objetivo

Usuário informa o e-mail corporativo, é registrado e permanece logado por cookie de sessão.

## Escopo

1. `POST /api/entrar` implementando `SPEC.md` §4.1:
   - Normalizar (trim + lowercase) antes de validar.
   - Regex `^[a-z0-9._%+-]+@selbetti\.com\.br$`.
   - Inválido → HTTP 422, `statusMessage`: "use seu e-mail @selbetti.com.br".
   - `display_name` derivado da parte local (`gabriel.silva` → "Gabriel Silva").
   - `INSERT ... ON CONFLICT (email) DO NOTHING`, depois `SELECT` para obter o `id`.
   - `setUserSession` com `{ id, email, display_name }`.
2. Página `/` com o formulário quando não houver sessão, usando os componentes de T02.
3. Middleware protegendo `/jogar`, `/resultado/*` e `/historico` — redireciona para `/` sem sessão.
4. Ação de sair.

## Regras duras

- Sem envio de e-mail, sem código de confirmação, sem OAuth (`AGENTS.md` regra 6).
- Validação sempre no servidor; no cliente é só UX.

## Aceite

- [ ] E-mail fora do domínio é rejeitado com a mensagem em português
- [ ] E-mail com maiúsculas e espaços nas pontas é aceito e persistido normalizado
- [ ] Mesmo e-mail reutilizado não cria usuário duplicado
- [ ] Sessão persiste após reload
- [ ] Acessar `/jogar` sem sessão redireciona para `/`
- [ ] Sair limpa a sessão
