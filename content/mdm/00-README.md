# Roteiro de Gravação — Treinamento MD2 Master Data Management

Roteiro falado para gravação em áudio/vídeo, baseado na *Apostila Treinamento MD2 Master Data Management* (181 slides, instrutor Gustavo Santos). Técnica de estudo: **ensinar para aprender (Feynman)** — o texto é escrito para ser lido em voz alta, não em silêncio.

**Tempo total de gravação:** ~2h45min de fala contínua (soma das estimativas por módulo; ≈24.400 palavras de prosa a 150 palavras/minuto). Na prática, some tempo de pausa e de auto-teste.

---

## Ordem de gravação

| # | Arquivo | Módulo | Slides | Tempo |
|---|---|---|---|---|
| 1 | [01-conceitos.md](01-conceitos.md) | Conceitos de Master Data Management | 4–25 | ~22 min |
| 2 | [02-arquitetura.md](02-arquitetura.md) | Arquitetura do Hub de Dados | 27–45 | ~18 min |
| 3 | [03-modelo-de-dados.md](03-modelo-de-dados.md) | Modelo de Dados do HUB MDM | 47–60 | ~21 min |
| 4 | [04-ingestao.md](04-ingestao.md) | Camada de Ingestão | 62–88 | ~22 min |
| 5 | [05-higienizacao.md](05-higienizacao.md) | Processos de Higienização | 90–109 | ~20 min |
| 6 | [06-unificacao.md](06-unificacao.md) | Processos de Unificação | 111–140 | ~30 min |
| 7 | [07-sobrevivencia.md](07-sobrevivencia.md) | Regras de Sobrevivência | 142–149 | ~12 min |
| 8 | [08-curadoria.md](08-curadoria.md) | Gestão de dados Mestres e Curadoria | 151–180 | ~20 min |

**Grave na ordem.** Cada módulo termina com uma transição que abre o seguinte, e a dependência é real — o pipeline é uma cascata.

---

## Como usar

1. Leia o segmento em voz alta, gravando. Não decore — leia com intenção de explicar.
2. Ao chegar no bloco **AUTO-TESTE**, **pare a gravação**.
3. Responda as 2–4 perguntas em voz alta, **sem olhar o texto**.
4. Só siga pro próximo módulo depois de responder. Se travar numa pergunta, releia só a parte correspondente.
5. Os blocos `[⚠️ CONFERIR NA APOSTILA: ...]` **não são para ler em voz alta** — são anotações de trabalho. Abra o PDF nesses pontos.

---

## Mapa do pipeline (a cascata que atravessa os 8 módulos)

```
FONTES  →  [SIF]  →  STG + TRILHA + HIST      (Mód. 4 — Ingestão)
                          ↓
                        BIP                    (Mód. 5 — Higienização)
                     ↙        ↘
                   BCR         BQA ─────────┐  (inválidos)
                          ↓                 │
              MATCH (qsMatchSetID)          │  (Mód. 6 — Unificação)
                          ↓                 │
                        BQA ────────────────┤  (duvidosos / clerical)
                          ↓                 │
               SURVIVE → GOLDEN RECORD      │  (Mód. 7 — Sobrevivência)
                          ↓                 │
                   BUP + BUP TRILHA          │
                          ↓                 ↓
                   PUBLICAÇÃO         MD2 QUALITY MANAGER
                                        (Mód. 8 — Curadoria)
                                             │
                                             └──→ volta pro fluxo
```

Camadas transversais: **CTR** (controle de execução, todas as etapas) e **WDR** (enquadramento legal LGPD, ao fim da carga diária).

---

## Glossário rápido de siglas

| Sigla | Significado | Módulo onde entra |
|---|---|---|
| **SIF** | Standard Input Format — contrato de entrada em formato de view | 2, 4 |
| **STG** | Staging — espelho AS-IS do legado, tudo VARCHAR(255) | 3, 4 |
| **HIST** | Histórico — versões anteriores dos registros | 3, 4 |
| **BIP** | Camada do dado qualificado (padronizado, validado, enriquecido) | 3, 5 |
| **BCR** | Base Corporativa de Referência — domínios e "traduções" | 3, 5 |
| **BQA** | Base de Quality Assurance — inválidos e duvidosos | 3, 5, 6, 8 |
| **BUP** | Camada do dado unificado — o Golden Record | 3, 6, 7 |
| **BHH** | ⚠️ não definida na apostila — provavelmente Base House Holding | 2, 8 |
| **CTR** | Controle — orquestração e estatísticas de carga | 3, 4, 8 |
| **WDR** | Workflow Data Rules — enquadramento legal LGPD | 3, 6 |
| **DNE** | Diretório Nacional de Endereços (Correios) | 2, 5 |
| **IIS** | IBM Information Server — a suíte (não o servidor web da Microsoft) | 2, 8 |
| **IGC** | IBM Information Governance Catalog — documentação das regras | 2, 5 |
| **QM** | MD2 Quality Manager — a interface de curadoria | 2, 4, 5, 6, 8 |
| **CRUD** | Create, Read, Update, Delete | 1, 4 |
| **LGPD** | Lei Geral de Proteção de Dados Pessoais | 1, 2, 6, 8 |

---

## Lacunas conhecidas da apostila

Pontos marcados com `[⚠️ CONFERIR NA APOSTILA]` no roteiro. Vale levar essa lista para o instrutor:

**Definições que faltam**
- **BHH** aparece no diagrama de arquitetura e nunca é definida (Mód. 2, 8).
- **BIP** e **BUP** nunca têm as siglas expandidas (Mód. 3).
- O slide "Padrão de Nomenclatura" (dicionário de prefixos `COD_`, `NOM_`, `STA_`, `SEQ_`, `DAT_`) é imagem sem texto (Mód. 3).
- O **"ranqueamento"** citado na definição da WDR nunca é explicado (Mód. 3, 6).
- **Enriquecimento com bases internas** é listado como técnica mas não tem exemplo (Mód. 5).
- As **técnicas de sobrevivência** do estágio SURVIVE não são nomeadas em texto (Mód. 7).
- A apostila não declara **em qual dos 4 modos** (Registry/Consolidation/Transactional/Co-Existence) a solução MD2 se enquadra (Mód. 1).

**Trechos corrompidos ou ambíguos na extração**
- Tabela das 18 views SIF: pareamento nome↔descrição desalinhado (Mód. 4).
- Slide "Determinístico vs Probabilístico": texto dos dois algoritmos embaralhado e ilegível (Mód. 6) — **o mais crítico**.
- Definição da nota de corte **Duplicates**: redação circular, falta o termo de comparação (Mód. 6).

**Operações descritas conceitualmente, mas sem o "como"**
- Como o curador **dispara um split ou merge** (Mód. 6).
- Quais **ações** existem na tela de Tratamento de Duvidosos, e se a decisão é persistida entre cargas (Mód. 8).
- O que o curador **faz com um inválido** (Mód. 8).
- **Compartilhamentos** no Enquadramento Legal aparece só no Mód. 8, sem contraparte no Mód. 6.

**Blocos que existem só como imagem** (vale abrir o PDF)
- Mód. 1: diagramas dos 4 modos de implementação; slide "Visão orientada às pessoas".
- Mód. 4: telas de CRUD no Quality Manager; jobs de extração.
- Mód. 5: as 4 telas de "Exemplo de Regras" (nome PF, nome PF crítica, telefone, e-mail) — **conteúdo mais prático do módulo**.
- Mód. 6: campos de blocagem dos passos 1, 2 e 3; fluxogramas de enquadramento.
- Mód. 7: 3 slides de configuração do SURVIVE — quase metade do módulo.
- Mód. 8: ~15 slides de telas do Quality Manager e dashboards.

---

## Exercícios

Cada módulo da apostila fecha com um slide apontando para o **Caderno de Exercícios Treinamento MD2 Master Data Management** (arquivo irmão, na pasta acima). Os itens do caderno seguem os mesmos 8 títulos. Sugestão: faça o exercício do módulo logo depois de gravar e responder o auto-teste correspondente.
