# T13 — Materiais de estudo

**Depende de:** T12
**Referência:** `SPEC.md` §5.0, §8 e `AGENTS.md` regras 4, 5 e 7

## Objetivo

Disponibilizar publicamente as apostilas Markdown usadas pelo quiz em um catálogo com leitor
responsivo, sem expor acesso arbitrário ao filesystem e sem alterar o banco de dados.

## Escopo

1. Empacotar `content/<topico>/*.md` no storage privado do servidor Nitro.
2. Expor um endpoint de catálogo e um endpoint de detalhe por slug derivado da origem.
3. Renderizar Markdown com suporte a títulos, listas, citações, tabelas, links e blocos de código.
4. Criar `/materiais` com o catálogo e `/materiais/[slug]` com o leitor e sumário por seções.
5. Exibir “Materiais” na navegação para visitantes e usuários autenticados.

## Regras

- O acervo é público e somente leitura.
- HTML bruto presente no Markdown não é executado.
- Apenas arquivos `.md` com exatamente um nível de subpasta entram no catálogo.
- O cliente nunca informa um caminho de arquivo; o servidor resolve apenas slugs presentes no catálogo.
- A primeira ocorrência de `#` vira o título da página e não é repetida no corpo.
- Nenhuma nova cor ou família tipográfica é introduzida.

## Aceite

- [ ] O catálogo lista todas as apostilas válidas com título, tópico e tempo estimado.
- [ ] O catálogo e o leitor abrem sem sessão.
- [ ] Cada leitor renderiza tabelas e código com rolagem horizontal em telas pequenas.
- [ ] O sumário leva aos títulos do documento e permanece acessível por teclado.
- [ ] Links externos abrem em nova aba com `noopener noreferrer`.
- [ ] Slug desconhecido retorna `404` com mensagem em português.
- [ ] Os materiais são incluídos e continuam legíveis no build de produção.
