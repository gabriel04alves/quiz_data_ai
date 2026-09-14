---
titulo: "Inteligência Artificial como auxiliar no dia a dia da Engenharia de Dados"
topico: "ia-engenharia-de-dados"
nivel: "intermediário a avançado"
idioma: "pt-BR"
versao: "1.0"
atualizado_em: "2026-09-14"
uso: "Material de estudo para geração automática de perguntas de múltipla escolha"
---

# Inteligência Artificial como auxiliar no dia a dia da Engenharia de Dados

> **Apostila completa** — do funcionamento interno dos modelos até a aplicação prática em pipelines, SQL, revisão de código e operação de dados.

---

## Como usar este material (instruções para o gerador de perguntas)

Este documento foi escrito para ser consumido por um modelo de IA que gera perguntas de múltipla escolha com uma única alternativa correta.

| Elemento | Como usar |
|---|---|
| Seções numeradas (`## 1.`, `## 2.` …) | Unidade temática. Cada uma é autossuficiente e pode ser sorteada isoladamente. |
| Blocos **Fatos-chave** | Afirmações objetivas e verificáveis. São a matéria-prima preferencial para gerar enunciados e a alternativa correta. |
| Tabelas comparativas | Excelentes para perguntas do tipo "qual a diferença entre X e Y". |
| Seção **Mitos e erros comuns** (§28) | Fonte de **distratores plausíveis** — alternativas incorretas que parecem certas. |
| Seção **Glossário** (§27) | Perguntas de definição direta (fáceis) e de associação termo↔conceito. |
| Seção **Panorama de modelos** (§26) | ⚠️ **NÃO GERAR PERGUNTAS A PARTIR DESTA SEÇÃO.** Contém informação de mercado volátil, que envelhece em semanas. Serve apenas como contexto de leitura. |

**Calibragem de dificuldade sugerida:**

| Nível | Origem do conteúdo |
|---|---|
| Fácil | Glossário, definições diretas, siglas, §1–§2 |
| Médio | Tabelas comparativas, §3–§13, §20–§22 |
| Difícil | Trade-offs, causas de falha, §14–§19, §23–§25, mitos invertidos |

**Regras de qualidade para as perguntas:** evitar enunciados que dependam de números de benchmark, nomes de versão de modelos ou preços; priorizar compreensão conceitual, relação causa-efeito e escolha de ferramenta adequada ao problema.

---

## Sumário

**Parte I — Como os modelos de IA funcionam**
1. Hierarquia de conceitos: IA, ML, Deep Learning e IA Generativa
2. Tipos de aprendizado de máquina
3. Anatomia de um LLM: tokens, embeddings e Transformer
4. Como o modelo gera texto: decodificação e amostragem
5. Ciclo de vida de um modelo: pré-treino, alinhamento e otimização
6. Janela de contexto, custo e latência
7. Modelos de raciocínio e computação em tempo de inferência
8. LLM, SLM e a taxonomia de tamanho
9. Modalidades: multimodal, embeddings e rerankers

**Parte II — Sistemas construídos sobre os modelos**
10. Engenharia de prompt
11. Engenharia de contexto
12. RAG — Geração Aumentada por Recuperação
13. Fine-tuning, LoRA e a decisão entre prompt, RAG e treino
14. Tool use e function calling
15. Agentes de IA
16. Harness — a infraestrutura que transforma modelo em agente
17. Protocolos de interoperabilidade: MCP, A2A e afins
18. Avaliação, evals e observabilidade
19. Riscos, falhas e segurança

**Parte III — IA no dia a dia da Engenharia de Dados**
20. Mapa de tarefas: onde a IA ajuda de verdade
21. Auxiliares de código: da autocompletar ao agente autônomo
22. Casos práticos em pipelines de dados
23. Text-to-SQL e a camada semântica
24. Uso responsável em ambiente corporativo
25. Antipadrões e limites

**Parte IV — Referência**
26. Panorama de modelos (contexto volátil)
27. Glossário
28. Mitos e erros comuns
29. Fontes e leitura adicional

---
# Parte I — Como os modelos de IA funcionam

---

## 1. Hierarquia de conceitos: IA, ML, Deep Learning e IA Generativa

Os quatro termos são frequentemente usados como sinônimos no dia a dia, mas descrevem círculos concêntricos — cada um contido no anterior.

**Inteligência Artificial (IA)** é o campo mais amplo: qualquer sistema computacional que executa tarefas que normalmente exigiriam inteligência humana. Isso inclui abordagens que não aprendem nada, como sistemas especialistas baseados em regras `if/else` escritas por humanos, buscas heurísticas e algoritmos de planejamento clássico. Um motor de regras fiscais que decide se uma nota entra na EFD-Reinf é IA no sentido clássico, mesmo sem uma linha de estatística.

**Aprendizado de Máquina (Machine Learning, ML)** é o subconjunto da IA em que o comportamento não é programado explicitamente, mas **inferido a partir de dados**. O programador define a estrutura do modelo e o algoritmo de otimização; os parâmetros são ajustados pelos dados. Regressão logística, árvores de decisão, Random Forest, XGBoost e k-means são ML — e continuam sendo a escolha certa para a maioria dos problemas tabulares corporativos.

**Aprendizado Profundo (Deep Learning, DL)** é o subconjunto do ML que usa redes neurais com muitas camadas. O diferencial é o **aprendizado de representações**: em vez de o engenheiro construir features manualmente (feature engineering), a própria rede descobre representações intermediárias úteis. Isso é o que permite lidar com dados não estruturados — texto, imagem, áudio.

**IA Generativa (GenAI)** é o subconjunto do DL cujos modelos **produzem conteúdo novo** (texto, imagem, código, áudio) em vez de apenas classificar ou prever um número. LLMs, modelos de difusão e VAEs pertencem a essa família.

```
┌──────────────────────────────────────────────────┐
│ Inteligência Artificial                          │
│  ┌────────────────────────────────────────────┐  │
│  │ Machine Learning                           │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │ Deep Learning                        │  │  │
│  │  │  ┌────────────────────────────────┐  │  │  │
│  │  │  │ IA Generativa (LLMs, difusão)  │  │  │  │
│  │  │  └────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**Modelo discriminativo vs. generativo.** Um modelo discriminativo aprende a fronteira entre classes — responde "esta transação é fraude?", modelando `P(y|x)`. Um modelo generativo aprende a distribuição dos próprios dados, `P(x)` ou `P(x,y)`, e por isso consegue **amostrar** novos exemplos dela. Um LLM é generativo: ele modela a probabilidade da próxima unidade de texto dado tudo que veio antes.

**Modelo de fundação (foundation model).** Termo cunhado em 2021 para descrever modelos de larga escala treinados em dados amplos e genéricos, projetados para serem **adaptados** a muitas tarefas distintas em vez de resolver uma só. Um LLM é um tipo de modelo de fundação; nem todo modelo de fundação é um LLM (há modelos de fundação para visão, séries temporais e até para dados tabulares).

### Fatos-chave §1

- IA é o campo mais amplo; ML é subconjunto de IA; Deep Learning é subconjunto de ML; IA Generativa é subconjunto de Deep Learning.
- Sistemas baseados em regras escritas por humanos são IA, mas **não** são Machine Learning, porque não aprendem a partir de dados.
- A característica que define ML é derivar o comportamento dos dados em vez de programá-lo explicitamente.
- O diferencial do Deep Learning é o aprendizado automático de representações, dispensando feature engineering manual para dados não estruturados.
- Modelos discriminativos modelam `P(y|x)` (fronteira entre classes); modelos generativos modelam a distribuição dos dados e conseguem amostrar novos exemplos.
- "Modelo de fundação" designa um modelo treinado em dados amplos e genéricos, projetado para ser adaptado a múltiplas tarefas.
- Para problemas tabulares corporativos clássicos (previsão, classificação, scoring), modelos de ML tradicionais como gradient boosting costumam superar LLMs em custo, latência e acurácia.

---

## 2. Tipos de aprendizado de máquina

A pergunta que separa os paradigmas é: **de onde vem o sinal que diz ao modelo se ele acertou?**

### 2.1 Aprendizado supervisionado

O conjunto de treino contém pares entrada→rótulo (`x`, `y`) fornecidos por humanos ou por um processo confiável. O modelo aprende a mapear `x` em `y` minimizando o erro em relação ao rótulo. Subdivide-se em **classificação** (saída categórica: fraude/não-fraude) e **regressão** (saída contínua: valor previsto de faturamento).

Custo característico: **rotulagem**. É o gargalo — rotular milhões de exemplos é caro e lento.

### 2.2 Aprendizado não supervisionado

Não há rótulos. O modelo busca estrutura latente nos próprios dados. Tarefas típicas: **clustering** (k-means, DBSCAN), **redução de dimensionalidade** (PCA, UMAP), **detecção de anomalias** e **regras de associação**. Em engenharia de dados, aparece em perfilamento de dados, deduplicação e detecção de outliers em métricas de pipeline.

### 2.3 Aprendizado auto-supervisionado (self-supervised)

É o paradigma que **viabilizou os LLMs**. Não há rótulos humanos, mas o sinal de treino é extraído automaticamente da estrutura do próprio dado: esconde-se parte da entrada e pede-se ao modelo que a reconstrua.

| Objetivo | Descrição | Usado em |
|---|---|---|
| **Causal Language Modeling** (next-token prediction) | Prever o próximo token dada a sequência anterior | Modelos decoder-only (família GPT, Claude, Llama) |
| **Masked Language Modeling** | Mascarar tokens no meio da frase e prever os ocultos | BERT e derivados (encoder-only) |
| **Contrastive learning** | Aproximar pares relacionados e afastar não relacionados no espaço vetorial | Modelos de embedding, CLIP |

Formalmente é um caso particular de aprendizado supervisionado — há um alvo e uma função de perda — mas o rótulo é **gerado automaticamente a partir do dado bruto**, o que permite treinar em trilhões de tokens da internet sem anotação humana.

### 2.4 Aprendizado semi-supervisionado

Combina uma pequena quantidade de dados rotulados com um grande volume de dados não rotulados. Técnicas como *pseudo-labeling* usam o modelo treinado no subconjunto rotulado para rotular o restante e realimentar o treino.

### 2.5 Aprendizado por reforço (Reinforcement Learning, RL)

Um **agente** interage com um **ambiente**, escolhe **ações** a partir de um **estado**, e recebe **recompensas**. Não existe rótulo de "resposta certa"; existe um sinal de recompensa, frequentemente esparso e atrasado. O objetivo é aprender uma **política** que maximize a recompensa acumulada. Conceitos centrais: exploração vs. explotação, função de valor, desconto temporal.

**RLHF (Reinforcement Learning from Human Feedback)** é a aplicação de RL ao alinhamento de LLMs: humanos comparam pares de respostas, treina-se um **modelo de recompensa** que aprende a prever a preferência humana, e o LLM é otimizado contra esse modelo de recompensa. **RLAIF** substitui o avaliador humano por um modelo de IA guiado por princípios escritos (abordagem associada à ideia de "IA constitucional"). **DPO (Direct Preference Optimization)** atinge objetivo semelhante otimizando diretamente sobre os pares de preferência, sem treinar um modelo de recompensa separado — é mais simples e barato.

**RLVR (Reinforcement Learning with Verifiable Rewards)** é a variante que ganhou centralidade com os modelos de raciocínio: em domínios onde a resposta pode ser verificada automaticamente (matemática, código que passa em testes, SQL que retorna o resultado esperado), a recompensa vem do verificador, não de um julgamento subjetivo.

### 2.6 Transfer learning

Reaproveitar o conhecimento de um modelo treinado em uma tarefa/domínio para outra. É o que torna o fine-tuning viável: em vez de treinar do zero, parte-se de um modelo pré-treinado e ajusta-se com poucos dados do domínio alvo.

### 2.7 Aprendizado em contexto (in-context learning)

Habilidade emergente dos LLMs de **aprender a tarefa a partir de exemplos colocados no prompt**, sem qualquer atualização de pesos. É a base do zero-shot, one-shot e few-shot prompting.

> ⚠️ Distinção crítica e fonte frequente de confusão: **in-context learning não altera os pesos do modelo**. O "aprendizado" existe apenas dentro daquela janela de contexto e desaparece quando a conversa termina. Fine-tuning, ao contrário, altera os pesos permanentemente.

### 2.8 Batch vs. online learning

**Batch (offline)**: o modelo é treinado uma vez sobre o dataset completo e implantado congelado. **Online (incremental)**: o modelo atualiza seus parâmetros continuamente à medida que novos dados chegam. LLMs comerciais são treinados em batch — eles **não aprendem com as suas conversas em tempo real**.

### Fatos-chave §2

- O aprendizado supervisionado exige pares entrada–rótulo; seu principal gargalo é o custo de rotulagem.
- O aprendizado não supervisionado busca estrutura latente sem rótulos: clustering, redução de dimensionalidade e detecção de anomalias.
- O aprendizado auto-supervisionado gera o rótulo automaticamente a partir da estrutura do próprio dado e é o paradigma que viabilizou o pré-treino dos LLMs em escala.
- Previsão do próximo token (causal language modeling) é o objetivo auto-supervisionado dos modelos decoder-only; masked language modeling é o objetivo do BERT.
- No aprendizado por reforço o sinal de treino é uma recompensa, frequentemente esparsa e atrasada, e o objetivo é aprender uma política que maximize a recompensa acumulada.
- RLHF treina um modelo de recompensa a partir de comparações humanas entre respostas e otimiza o LLM contra ele.
- DPO dispensa o modelo de recompensa separado, otimizando diretamente sobre pares de preferência.
- RLVR usa recompensas verificáveis automaticamente (testes que passam, resultado matemático correto) e é central no treino de modelos de raciocínio.
- Transfer learning é reaproveitar conhecimento de um modelo pré-treinado em outra tarefa, e é o que torna o fine-tuning barato.
- In-context learning (zero/one/few-shot) **não** atualiza os pesos do modelo; o efeito existe apenas dentro da janela de contexto.
- LLMs comerciais são treinados em batch e não aprendem com as conversas dos usuários em tempo real.

---

## 3. Anatomia de um LLM: tokens, embeddings e Transformer

### 3.1 Token e tokenizer

O modelo não enxerga letras nem palavras: enxerga **tokens**, unidades de subpalavra produzidas por um **tokenizer**. Algoritmos comuns: BPE (Byte-Pair Encoding), WordPiece e SentencePiece. O tokenizer é treinado junto do modelo e converte texto em uma sequência de inteiros (IDs).

Consequências práticas que aparecem no dia a dia:

- Em inglês, a regra de bolso é **~4 caracteres ≈ 1 token**, ou ~750 palavras por 1.000 tokens. Em português a taxa é pior (mais tokens para o mesmo texto), porque os tokenizers são majoritariamente otimizados para inglês — o mesmo conteúdo custa mais caro.
- Identificadores longos, JSON verboso, UUIDs e dados tabulares consomem muitos tokens.
- Modelos têm dificuldade histórica com tarefas em nível de caractere (contar letras, inverter strings) justamente porque não veem caracteres.
- Cobrança de API e limites de contexto são medidos em tokens, não em caracteres.

### 3.2 Embedding e espaço vetorial

Cada token é mapeado para um **vetor denso** de centenas ou milhares de dimensões — o **embedding**. A propriedade fundamental é que **proximidade geométrica no espaço vetorial corresponde a proximidade semântica**: "fatura" e "nota fiscal" ficam próximos; "fatura" e "girafa" ficam distantes.

A métrica de similaridade mais usada é a **similaridade de cosseno**, que mede o ângulo entre vetores e ignora a magnitude. Também aparecem distância euclidiana e produto interno (dot product).

Distinção importante: o embedding **de token** dentro do modelo é diferente do embedding **de sentença/documento** produzido por um *embedding model* dedicado — este último gera um vetor único que representa um trecho inteiro e é o que alimenta bancos vetoriais em RAG (§12).

### 3.3 A arquitetura Transformer

Proposta em 2017 no artigo *"Attention Is All You Need"*, substituiu redes recorrentes (RNN/LSTM) como arquitetura dominante para sequências. Duas vantagens decisivas: processa todos os tokens da sequência **em paralelo** (RNNs processavam sequencialmente) e captura dependências entre tokens distantes sem degradação.

Componentes de um bloco Transformer:

| Componente | Função |
|---|---|
| **Self-attention** | Cada token calcula quanto deve "prestar atenção" a cada outro token da sequência, produzindo uma representação contextualizada |
| **Multi-head attention** | Várias cabeças de atenção em paralelo, cada uma capturando um tipo diferente de relação (sintática, correferência, semântica) |
| **Feed-forward network (FFN/MLP)** | Camada densa aplicada a cada posição, onde reside boa parte dos parâmetros e do "conhecimento" armazenado |
| **Positional encoding** | Injeta informação de ordem, já que a atenção por si só é invariante à posição. Implementações modernas usam RoPE (rotary position embeddings) |
| **Layer normalization** e **conexões residuais** | Estabilizam o treino de redes muito profundas |

O mecanismo de atenção opera com três projeções de cada token: **Query (Q)**, **Key (K)** e **Value (V)**. Intuitivamente: o Query de um token é a "pergunta" que ele faz; os Keys dos demais tokens são as "etiquetas" que respondem a ela; o peso resultante determina quanto do Value de cada token entra na representação final.

Custo característico: a atenção clássica é **quadrática** no comprimento da sequência — dobrar o contexto quadruplica o custo do cálculo de atenção. É a razão pela qual contextos muito longos são caros, e o motivo de linhas de pesquisa em atenção esparsa, atenção linear e arquiteturas híbridas com espaços de estado (Mamba).

### 3.4 Famílias arquiteturais

| Arquitetura | Estrutura | Uso típico | Exemplos |
|---|---|---|---|
| **Encoder-only** | Atenção bidirecional | Classificação, NER, embeddings | BERT, RoBERTa |
| **Decoder-only** | Atenção causal (só olha para trás) | Geração de texto | GPT, Claude, Llama, Gemini |
| **Encoder-decoder** | Encoder + decoder acoplados | Tradução, sumarização estruturada | T5, BART |

A esmagadora maioria dos LLMs generativos modernos é **decoder-only** com atenção causal — cada token só pode atender aos tokens anteriores, nunca aos futuros. Isso é o que permite treinar prevendo o próximo token em toda a sequência de uma vez.

### 3.5 Parâmetros e Mixture-of-Experts

**Parâmetros** são os pesos aprendidos. Um modelo "de 70B" tem 70 bilhões de parâmetros. A contagem de parâmetros correlaciona com capacidade, mas **não é medida direta de qualidade**: dados, receita de treino e alinhamento pesam tanto quanto.

**Mixture-of-Experts (MoE)** é a arquitetura que separa **parâmetros totais** de **parâmetros ativos**. O modelo contém muitos "especialistas" (sub-redes FFN) e uma rede de roteamento (*router*) que ativa apenas alguns por token. Um modelo pode ter 400B de parâmetros totais mas ativar só 30B por token — capacidade de um modelo grande com custo de inferência de um modelo médio. É por isso que "tamanho do modelo" virou uma métrica ambígua: é preciso perguntar se o número citado é total ou ativo.

### Fatos-chave §3

- O modelo processa tokens (unidades de subpalavra), não caracteres nem palavras; o tokenizer converte texto em IDs inteiros.
- Regra de bolso em inglês: ~4 caracteres ≈ 1 token; textos em português consomem mais tokens para o mesmo conteúdo.
- Limites de contexto e cobrança de API são medidos em tokens.
- Embedding é a representação vetorial densa em que proximidade geométrica corresponde a proximidade semântica.
- Similaridade de cosseno mede o ângulo entre vetores e ignora a magnitude; é a métrica mais usada em busca vetorial.
- A arquitetura Transformer foi apresentada em 2017 no artigo "Attention Is All You Need".
- A vantagem decisiva do Transformer sobre RNN/LSTM é processar a sequência em paralelo e capturar dependências de longa distância.
- Self-attention opera com três projeções por token: Query, Key e Value.
- Multi-head attention executa várias cabeças em paralelo, cada uma capturando um tipo diferente de relação.
- Positional encoding é necessário porque o mecanismo de atenção, sozinho, é invariante à ordem dos tokens.
- O custo da atenção clássica cresce de forma quadrática com o comprimento da sequência.
- Encoder-only (BERT) serve para classificação e embeddings; decoder-only (GPT, Claude, Llama) serve para geração; encoder-decoder (T5) para transformações sequência-a-sequência.
- LLMs generativos modernos são predominantemente decoder-only com atenção causal (cada token só atende aos anteriores).
- Em arquiteturas Mixture-of-Experts, um roteador ativa apenas um subconjunto de especialistas por token, separando parâmetros totais de parâmetros ativos.
- Contagem de parâmetros não é medida direta de qualidade do modelo.

---

## 4. Como o modelo gera texto: decodificação e amostragem

Um LLM é **autorregressivo**: gera um token por vez e realimenta o token gerado como entrada para o próximo passo. O processo se repete até atingir um token de parada (*stop token* / EOS) ou o limite de tokens de saída.

Em cada passo, a última camada produz **logits** — um número para cada token do vocabulário. A função **softmax** converte os logits em uma distribuição de probabilidade sobre todo o vocabulário. O que acontece a seguir é a **estratégia de decodificação**.

| Parâmetro | O que faz | Efeito prático |
|---|---|---|
| **Temperatura** | Escala os logits antes do softmax | `0` → determinístico, sempre o token mais provável. Valores altos (>1) achatam a distribuição e aumentam a diversidade e o risco de incoerência |
| **Top-k** | Restringe a amostragem aos `k` tokens mais prováveis | Corta a cauda longa de tokens absurdos |
| **Top-p (nucleus sampling)** | Restringe ao menor conjunto de tokens cuja probabilidade acumulada atinge `p` | Adapta-se dinamicamente: em contextos previsíveis considera poucos tokens; em contextos ambíguos, muitos |
| **Frequency / presence penalty** | Penaliza tokens já emitidos | Reduz repetição e loops |
| **max_tokens** | Teto de tokens gerados | Corta a resposta, podendo truncá-la no meio |
| **stop sequences** | Strings que encerram a geração | Controle de formato |

**Greedy decoding** é escolher sempre o token de maior probabilidade (equivale a temperatura 0). **Beam search** mantém várias sequências candidatas em paralelo e escolhe a de maior probabilidade conjunta — comum em tradução, raro em chat.

> **Determinismo.** Temperatura 0 aproxima o comportamento do determinístico, mas **não garante** reprodutibilidade bit a bit em serviços de produção: paralelismo de GPU, ordem de operações de ponto flutuante, batching dinâmico e atualizações silenciosas do modelo introduzem variação. Para engenharia de dados isso é uma restrição de projeto: **nunca coloque uma chamada de LLM no caminho crítico de um cálculo que precise ser determinístico e auditável** sem uma camada de validação ou cache.

**Prefill vs. decode.** A inferência tem duas fases com perfis de custo distintos. O **prefill** processa todo o prompt de entrada de uma vez (paralelo, limitado por capacidade de cálculo); o **decode** gera token a token (sequencial, limitado por banda de memória). Isso explica por que a latência até o primeiro token (TTFT) depende do tamanho do prompt, enquanto a velocidade de geração (tokens/segundo) depende pouco dele.

**KV cache.** Como o modelo é autorregressivo e a atenção é causal, os Keys e Values dos tokens já processados não mudam. Guardá-los em cache evita recalcular a atenção de toda a sequência a cada novo token. O KV cache é o que torna a geração viável — e é também o principal consumidor de memória de GPU em contextos longos.

### Fatos-chave §4

- LLMs são autorregressivos: geram um token por vez e realimentam a saída como entrada.
- Logits são as pontuações brutas por token do vocabulário; a softmax os converte em distribuição de probabilidade.
- Temperatura 0 corresponde à decodificação gulosa (sempre o token mais provável); temperaturas altas aumentam diversidade e risco de incoerência.
- Top-k limita a amostragem a um número fixo de tokens; top-p (nucleus) limita ao menor conjunto cuja probabilidade acumulada atinge o limiar, adaptando-se ao contexto.
- Temperatura 0 não garante reprodutibilidade bit a bit em produção por causa de paralelismo de GPU, ponto flutuante e batching.
- A geração termina por token de parada (EOS), por stop sequence configurada ou por atingir max_tokens.
- O prefill processa o prompt inteiro em paralelo e determina o tempo até o primeiro token; o decode gera sequencialmente e determina os tokens por segundo.
- O KV cache armazena Keys e Values já calculados para evitar recomputar a atenção a cada token, e é o principal consumidor de memória de GPU em contextos longos.

---

## 5. Ciclo de vida de um modelo: pré-treino, alinhamento e otimização

### 5.1 As fases

**1. Pré-treino (pre-training).** Treino auto-supervisionado sobre um corpus massivo (trilhões de tokens) com objetivo de previsão do próximo token. É a fase que consome praticamente todo o custo computacional — dezenas de milhões de dólares e meses de GPU. O resultado é um **modelo base**: sabe muito sobre linguagem e mundo, mas não sabe seguir instruções nem conversar; tende a apenas continuar o texto.

**2. Ajuste supervisionado por instruções (SFT / instruction tuning).** Fine-tuning supervisionado sobre pares instrução→resposta de alta qualidade. É o que transforma um modelo base em um **modelo instruído**, capaz de obedecer a comandos e responder em formato de diálogo.

**3. Alinhamento por preferência.** RLHF, RLAIF ou DPO ajustam o modelo para ser útil, honesto e inofensivo, refletindo preferências humanas sobre *como* responder.

**4. Treino de raciocínio (opcional).** RL com recompensas verificáveis para desenvolver cadeias de raciocínio longas (§7).

**5. Pós-treino contínuo e otimização para deployment.** Destilação, quantização, poda.

**Conhecimento paramétrico e data cutoff.** Tudo que o modelo "sabe" de fábrica está codificado nos pesos e congelado na data de corte do treino (*knowledge cutoff*). O modelo não tem acesso nativo a nada posterior a essa data, nem a dados internos da sua empresa. Superar isso é exatamente o papel de RAG (§12) e tool use (§14).

### 5.2 Técnicas de otimização

| Técnica | O que é | Trade-off |
|---|---|---|
| **Destilação (distillation)** | Um modelo grande ("professor") gera saídas usadas para treinar um modelo menor ("aluno"), que aprende a imitar seu comportamento | Modelo muito menor com boa parte da qualidade, restrita ao domínio destilado |
| **Quantização** | Reduz a precisão numérica dos pesos (FP16 → INT8 → INT4) | Menos memória e mais velocidade; perda de qualidade que cresce conforme a precisão cai |
| **Poda (pruning)** | Remove pesos ou estruturas de pouca importância | Menor tamanho; risco de degradação irregular |
| **Speculative decoding** | Um modelo pequeno propõe vários tokens e o grande os verifica em bloco | Acelera a inferência sem alterar a distribuição de saída |

### 5.3 Leis de escala (scaling laws)

Trabalhos empíricos mostraram que a qualidade de um LLM melhora de forma previsível conforme crescem, juntos, **parâmetros, volume de dados e computação**. O resultado de Chinchilla (2022) corrigiu uma distorção da época: os modelos eram grandes demais para a quantidade de dados usada. A conclusão prática — treinar modelos menores com muito mais dados — reorientou a indústria e é parte da explicação do desempenho dos modelos compactos atuais.

Uma segunda dimensão de escala apareceu depois: escalar a **computação em tempo de inferência** (deixar o modelo "pensar" mais antes de responder), tratada em §7.

### Fatos-chave §5

- O pré-treino é auto-supervisionado, consome a maior parte do custo computacional e gera um modelo base que não sabe seguir instruções.
- O SFT (instruction tuning) é o que transforma o modelo base em um modelo capaz de obedecer a instruções e dialogar.
- O alinhamento por preferência (RLHF/RLAIF/DPO) ajusta o modelo às preferências humanas sobre a forma de responder.
- Knowledge cutoff é a data de corte dos dados de treino; o modelo não conhece nativamente nada posterior a ela nem dados internos da empresa.
- Destilação treina um modelo pequeno ("aluno") a imitar as saídas de um modelo grande ("professor").
- Quantização reduz a precisão numérica dos pesos, diminuindo memória e aumentando velocidade ao custo de alguma qualidade.
- Speculative decoding usa um modelo pequeno para propor tokens que o modelo grande verifica em bloco, acelerando a inferência.
- As leis de escala descrevem melhoria previsível da qualidade conforme crescem parâmetros, dados e computação em conjunto.
- O resultado de Chinchilla mostrou que os modelos da época eram grandes demais para a quantidade de dados usada, favorecendo modelos menores treinados com mais dados.

---

## 6. Janela de contexto, custo e latência

A **janela de contexto** é o número máximo de tokens que o modelo consegue considerar de uma vez. Ela é compartilhada por **tudo**: system prompt, histórico da conversa, documentos recuperados, definições de ferramentas, saídas de ferramentas e a resposta que está sendo gerada.

**Não é memória.** O modelo é *stateless* entre chamadas: a cada requisição, o histórico inteiro é reenviado. A ilusão de memória em um chat vem do cliente reenviando a conversa. Memória persistente de verdade exige um sistema externo (§11).

**Context rot / lost in the middle.** Janelas maiores não são gratuitas em qualidade. Há degradação documentada de desempenho conforme o contexto cresce, e uma tendência de o modelo recuperar melhor informações no **início e no fim** do contexto do que no **meio**. Encher a janela porque ela é grande é um erro clássico: **contexto é orçamento, não depósito**.

**Custo e latência.** Tokens de entrada e de saída costumam ter preços diferentes (saída é tipicamente mais cara). A latência tem dois componentes: TTFT (tempo até o primeiro token, dominado pelo prefill) e throughput de geração (tokens/s, dominado pelo decode).

**Prompt caching** permite reaproveitar o processamento de um prefixo estável do prompt entre chamadas, reduzindo latência e custo. Implica uma regra de projeto: **coloque o conteúdo estável no começo do prompt** (instruções, esquema do banco, documentação) e o conteúdo variável no fim.

**Contagem de tokens de raciocínio.** Em modelos de raciocínio, os tokens de pensamento são cobrados como tokens de saída mesmo quando não são exibidos.

### Fatos-chave §6

- A janela de contexto é compartilhada por system prompt, histórico, documentos, definições e resultados de ferramentas e pela própria resposta.
- LLMs são stateless entre chamadas; a sensação de memória vem do cliente reenviando o histórico a cada requisição.
- "Context rot" e o efeito "lost in the middle" descrevem a degradação de desempenho em contextos longos e a menor recuperação de informação posicionada no meio do contexto.
- Tokens de saída costumam ser mais caros que tokens de entrada.
- TTFT (tempo até o primeiro token) é dominado pela fase de prefill; a taxa de geração é dominada pela fase de decode.
- Prompt caching reaproveita o prefixo estável do prompt, o que recomenda colocar conteúdo estável no início e variável no fim.
- Aumentar a janela de contexto não resolve por si só problemas de qualidade; contexto deve ser tratado como orçamento a ser curado.

---

## 7. Modelos de raciocínio e computação em tempo de inferência

Uma família de modelos passou a **gastar computação extra antes de responder**, gerando uma cadeia de raciocínio interna (*chain of thought*, também chamada de *extended thinking* ou *reasoning tokens*) que explora o problema, testa hipóteses e verifica passos antes de emitir a resposta final.

A diferença em relação ao antigo truque de prompt "pense passo a passo" é que esses modelos foram **treinados com RL para raciocinar**, tipicamente com recompensas verificáveis (§2.5). O raciocínio não é um estilo de escrita induzido pelo prompt; é um comportamento otimizado.

**Test-time compute scaling** é o nome do fenômeno: a qualidade melhora ao se investir mais computação **na inferência**, não só no treino. É a segunda curva de escala da área.

| Aspecto | Modelo padrão | Modelo de raciocínio |
|---|---|---|
| Latência | Baixa | Alta (segundos a minutos) |
| Custo por resposta | Menor | Maior (tokens de pensamento são cobrados) |
| Força | Tarefas diretas, extração, formatação, conversa | Matemática, depuração complexa, planejamento, lógica multi-etapa, migração de código |
| Risco | Erro por falta de deliberação | Overthinking em tarefas triviais |

**Quando usar em engenharia de dados:** depurar um pipeline com falha intermitente, planejar a migração de um job legado, otimizar uma consulta SQL complexa, revisar uma modelagem dimensional. **Quando não usar:** classificar 10 milhões de registros, extrair campos de um formulário, gerar um resumo simples — ali o custo e a latência não se pagam.

> Muitos modelos atuais são **híbridos**: um único modelo que opera em modo rápido ou em modo estendido conforme o parâmetro de esforço/orçamento de raciocínio configurado na chamada.

### Fatos-chave §7

- Modelos de raciocínio geram tokens de pensamento antes da resposta final, gastando computação extra em tempo de inferência.
- Esses modelos foram treinados por RL para raciocinar, frequentemente com recompensas verificáveis — não apenas instruídos por prompt a "pensar passo a passo".
- Test-time compute scaling é a melhoria de qualidade obtida investindo mais computação na inferência, complementando a escala de treino.
- Tokens de raciocínio são cobrados como tokens de saída mesmo quando não são exibidos ao usuário.
- Modelos de raciocínio são vantajosos em depuração complexa, planejamento e matemática, e desvantajosos em tarefas de alto volume, simples e sensíveis a latência.
- Overthinking em tarefas triviais é um risco típico dos modelos de raciocínio.

---

## 8. LLM, SLM e a taxonomia de tamanho

**LLM (Large Language Model)** e **SLM (Small Language Model)** não têm fronteira formal. A convenção prática usa a contagem de parâmetros e, principalmente, **onde o modelo consegue rodar**.

| Categoria | Faixa aproximada | Onde roda | Uso típico |
|---|---|---|---|
| **Tiny / micro** | < 1B | Celular, navegador, microcontrolador | Autocompletar, classificação simples, wake word |
| **SLM** | ~1B – 15B | Uma GPU comum, notebook, servidor de borda | Classificação, extração, roteamento, tarefas de domínio após fine-tuning |
| **LLM** | ~15B – 100B+ | Cluster de GPUs / API | Raciocínio geral, código, agentes |
| **Frontier** | Centenas de bilhões (ou MoE equivalente) | Datacenter / API | Estado da arte em raciocínio e capacidades agênticas |

**Por que SLMs importam.** A melhoria dos SLMs veio de melhores dados (destilação a partir de modelos grandes, dados sintéticos curados) e de técnicas de compressão. O resultado é que, **em tarefas estreitas e bem definidas**, um SLM ajustado pode igualar ou superar um modelo de fronteira genérico — com uma fração do custo e da latência.

Vantagens de SLM que pesam em contexto corporativo:

- **Soberania do dado**: rodam on-premise ou na borda; o dado não sai do perímetro (relevante para LGPD e para dados de clientes).
- **Custo e latência**: ordens de magnitude menores, viabilizando processamento de alto volume.
- **Previsibilidade**: menor superfície de comportamento inesperado.
- **Fine-tuning barato**: ajustar um modelo de 7B é acessível; ajustar um de fronteira, não.

Limitações: raciocínio multi-etapa fraco, menor conhecimento de mundo, pior desempenho em tarefas abertas e em uso agêntico com muitas ferramentas.

**Padrão de roteamento em cascata (model routing).** Arquitetura madura e econômica: um modelo pequeno e barato atende a maioria das requisições e **escala para um modelo maior** apenas quando detecta complexidade, baixa confiança ou falha de validação. É o equivalente, em IA, a usar cache antes de bater no banco.

### Fatos-chave §8

- Não existe fronteira formal de parâmetros entre LLM e SLM; a convenção usa faixas aproximadas e a capacidade de rodar em hardware modesto.
- SLMs costumam ficar na faixa de ~1B a ~15B de parâmetros e conseguem rodar em uma GPU comum, notebook ou dispositivo de borda.
- Em tarefas estreitas e bem definidas, um SLM ajustado pode igualar ou superar um modelo de fronteira genérico, com custo e latência muito menores.
- A qualidade dos SLMs modernos vem principalmente de melhores dados (destilação, dados sintéticos curados) e de técnicas de compressão como quantização.
- A principal vantagem regulatória do SLM on-premise é que o dado não sai do perímetro da organização.
- As principais limitações dos SLMs são raciocínio multi-etapa, conhecimento de mundo e uso agêntico com muitas ferramentas.
- Roteamento em cascata usa um modelo pequeno para a maioria das requisições e escala para um maior apenas em casos complexos ou de baixa confiança.

---

## 9. Modalidades: multimodal, embeddings e rerankers

Nem todo modelo de IA generativa é um modelo de texto, e nem todo modelo usado em um sistema de IA é generativo.

**Modelos multimodais** aceitam e/ou produzem mais de um tipo de dado. Um **VLM (Vision-Language Model)** processa imagem e texto no mesmo espaço de representação — é o que permite enviar o print de um dashboard, o diagrama de um pipeline ou a foto de um erro no terminal e obter uma análise. Modalidades comuns: texto, imagem, áudio, vídeo.

**Modelos de difusão** são a família por trás da geração de imagens: partem de ruído e o removem iterativamente, condicionados por um texto. Arquitetura e princípio são distintos dos LLMs.

**Modelos de embedding** não geram texto: convertem um trecho em um único vetor. São a base da busca semântica e do RAG. Dimensões típicas vão de 384 a 3072. Fatos operacionais importantes: embeddings de modelos diferentes **não são comparáveis entre si**, e trocar o modelo de embedding obriga a **reindexar toda a base**.

**Rerankers (cross-encoders)** recebem o par (consulta, documento) **junto** e devolvem uma pontuação de relevância. São muito mais precisos que a comparação de vetores — que codifica consulta e documento separadamente — e muito mais caros. O padrão de produção é: recuperar 50–100 candidatos com busca vetorial rápida e reordenar os 10 melhores com um reranker.

**Modelos de fala**: ASR (áudio→texto, ex.: Whisper) e TTS (texto→áudio).

**OCR e extração de documentos**: VLMs modernos absorveram boa parte do OCR clássico, com ganho grande em documentos com layout complexo (notas fiscais, extratos, formulários) — caso de uso direto em ingestão de dados não estruturados.

### Fatos-chave §9

- Modelos multimodais processam mais de um tipo de dado; VLMs combinam visão e linguagem no mesmo espaço de representação.
- Modelos de difusão geram imagens removendo ruído iterativamente e têm arquitetura distinta dos LLMs.
- Modelos de embedding não geram texto: produzem um vetor que representa o trecho, base da busca semântica.
- Embeddings gerados por modelos diferentes não são comparáveis; trocar o modelo de embedding exige reindexar toda a base vetorial.
- Rerankers (cross-encoders) avaliam consulta e documento em conjunto, sendo mais precisos e mais caros que a busca vetorial pura.
- O padrão de produção em recuperação é recuperar muitos candidatos com busca vetorial e reordenar os melhores com um reranker.
- VLMs modernos substituem boa parte do OCR clássico em documentos de layout complexo, como notas fiscais e formulários.

---
# Parte II — Sistemas construídos sobre os modelos

> Um modelo sozinho é apenas uma função: texto entra, texto sai. Tudo que torna a IA útil no trabalho real — memória, acesso a dados, execução de ações, verificação — é **engenharia ao redor do modelo**. Esta parte descreve essas camadas, da mais simples à mais complexa.

```
                        ┌─────────────────────────┐
     mais autonomia  ▲  │  Agente + Harness (§15-16)│
                     │  ├─────────────────────────┤
                     │  │  Tool use / MCP (§14,17) │
                     │  ├─────────────────────────┤
                     │  │  RAG (§12)               │
                     │  ├─────────────────────────┤
                     │  │  Engenharia de contexto  │
                     │  ├─────────────────────────┤
     mais simples    │  │  Prompt (§10)            │
                     │  ├─────────────────────────┤
                     │  │  Modelo (Parte I)        │
                        └─────────────────────────┘
```

---

## 10. Engenharia de prompt

Engenharia de prompt é a prática de **estruturar a instrução** para obter saída confiável. Deixou de ser a habilidade central (foi absorvida pela engenharia de contexto e pelo harness), mas continua sendo a base.

### 10.1 Anatomia de um bom prompt

| Elemento | Função |
|---|---|
| **Papel/persona** | Define o ponto de vista ("Você é um engenheiro de dados sênior especialista em Spark") |
| **Tarefa** | O que fazer, em imperativo e sem ambiguidade |
| **Contexto** | Esquema de tabelas, convenções do time, restrições do ambiente |
| **Exemplos (few-shot)** | Demonstrações de entrada→saída no formato desejado |
| **Formato de saída** | Estrutura exigida (JSON, tabela, apenas o SQL) |
| **Restrições e critérios** | O que não fazer, como tratar casos ambíguos |

### 10.2 Técnicas

- **Zero-shot**: só a instrução. Suficiente para a maioria das tarefas em modelos modernos.
- **Few-shot**: 2–5 exemplos. É a forma mais eficaz de fixar formato, estilo e convenções internas do time.
- **Chain-of-Thought (CoT)**: pedir raciocínio explícito antes da resposta. Ganho grande em modelos antigos; em modelos de raciocínio é redundante e pode até atrapalhar.
- **Self-consistency**: gerar várias respostas com temperatura > 0 e escolher a mais frequente.
- **Decomposição / prompt chaining**: quebrar a tarefa em etapas encadeadas, cada uma com um prompt próprio. Mais confiável que um prompt gigante.
- **Structured output / JSON mode**: forçar a saída a obedecer a um JSON Schema. Tecnicamente implementado por **decodificação restrita** (*constrained decoding*), que zera a probabilidade de tokens que violariam a gramática. É a técnica que torna a saída do LLM segura para consumo programático.
- **Delimitadores**: separar instrução de dado (com tags XML, cercas de código ou marcadores) reduz confusão e é a primeira linha de defesa contra injeção de prompt.

### 10.3 System prompt vs. user prompt

O **system prompt** define comportamento persistente, papel e regras; o **user prompt** traz a requisição específica. O system prompt tem precedência maior no treino de alinhamento, mas **não é um mecanismo de segurança**: nunca coloque segredos nele assumindo que o usuário não vai extraí-los.

### Fatos-chave §10

- Few-shot prompting é a forma mais eficaz de fixar formato de saída e convenções internas sem treinar o modelo.
- Chain-of-Thought traz ganho em modelos padrão, mas é redundante — e pode atrapalhar — em modelos de raciocínio, que já raciocinam nativamente.
- Self-consistency gera múltiplas respostas e escolhe a mais frequente, aumentando robustez ao custo de mais chamadas.
- Structured output é implementado por decodificação restrita, que impede a emissão de tokens que violem o schema exigido.
- Usar delimitadores para separar instrução de dado é a primeira linha de defesa contra injeção de prompt.
- O system prompt define comportamento persistente, mas não é mecanismo de segurança e não deve conter segredos.
- Decompor uma tarefa complexa em etapas encadeadas é mais confiável do que escrever um único prompt muito longo.

---

## 11. Engenharia de contexto

**Engenharia de contexto** é a disciplina de decidir **quais informações entram na janela de contexto, em que forma e em que momento**. A diferença de enquadramento em relação à engenharia de prompt é direta: prompt engineering trata de *como falamos* com o modelo; context engineering trata de *que informação ele recebe*.

Motivação: o contexto é um recurso finito e degradável (§6). Mais contexto não é melhor contexto. A meta é manter na janela o **menor conjunto de tokens de alto sinal** que permita resolver a tarefa.

### 11.1 As quatro operações fundamentais

| Operação | O que faz | Exemplos |
|---|---|---|
| **Write** (escrever) | Persistir informação fora da janela para uso posterior | Scratchpad, arquivo de notas, memória de longo prazo, estado em banco |
| **Select** (selecionar) | Trazer para a janela apenas o que é relevante agora | RAG, busca em código, leitura de arquivo sob demanda |
| **Compress** (comprimir) | Reduzir o que já está na janela sem perder o essencial | Sumarização do histórico, compactação, poda de resultados de ferramentas |
| **Isolate** (isolar) | Separar contextos que não devem se misturar | Sub-agentes com janelas próprias, sandboxes, separação por tarefa |

### 11.2 Padrões de produção

- **Compactação (compaction)**: quando a conversa se aproxima do limite, sumarizar o histórico antigo preservando decisões, restrições e estado, e recomeçar com o resumo. É lossy por definição — o que se perde é escolha de projeto.
- **Just-in-time retrieval**: em vez de despejar toda a documentação no prompt inicial, dar ao modelo **ferramentas de busca** e deixá-lo puxar o que precisa quando precisa. Padrão dominante em assistentes de código sobre repositórios grandes.
- **Sub-agentes**: delegar uma subtarefa a um agente com contexto próprio, que devolve apenas o resultado condensado. Preserva a janela do agente principal — o "contexto sujo" da exploração fica isolado.
- **Memória externa estruturada**: arquivos de convenções do projeto (`CLAUDE.md`, `AGENTS.md`), bases de decisões, ADRs. Informação durável fica em disco e é lida sob demanda, não reenviada a cada turno.
- **Poda de saída de ferramentas**: um `SELECT *` que devolve 10 mil linhas destrói a janela. Truncar, agregar e resumir antes de devolver ao modelo é obrigatório em ferramentas de dados.

### 11.3 Os modos de falha do contexto longo

| Falha | Descrição |
|---|---|
| **Context poisoning** | Uma alucinação ou erro entra no contexto e passa a ser tratado como fato nas etapas seguintes |
| **Context distraction** | Excesso de histórico faz o modelo repetir ações passadas em vez de raciocinar sobre o estado atual |
| **Context confusion** | Informação irrelevante (ferramentas demais, documentos demais) degrada a escolha de ação |
| **Context clash** | Partes do contexto se contradizem (documentação desatualizada vs. código atual) |

### Fatos-chave §11

- Engenharia de contexto trata de qual informação entra na janela; engenharia de prompt trata de como a instrução é formulada.
- As quatro operações fundamentais da engenharia de contexto são escrever (write), selecionar (select), comprimir (compress) e isolar (isolate).
- Compactação é a sumarização do histórico antigo quando o contexto se aproxima do limite, e é inerentemente lossy.
- Just-in-time retrieval dá ao modelo ferramentas de busca em vez de pré-carregar toda a documentação no prompt.
- Sub-agentes isolam o contexto de uma subtarefa e devolvem apenas o resultado condensado, preservando a janela do agente principal.
- Context poisoning é quando um erro ou alucinação entra no contexto e passa a ser tratado como fato nas etapas seguintes.
- Context distraction ocorre quando o excesso de histórico leva o modelo a repetir ações passadas em vez de raciocinar sobre o estado atual.
- Truncar ou agregar a saída de ferramentas antes de devolvê-la ao modelo é obrigatório ao expor consultas a bancos de dados.

---

## 12. RAG — Geração Aumentada por Recuperação

**RAG (Retrieval-Augmented Generation)** é o padrão que injeta, no prompt, trechos recuperados de uma base externa, para que o modelo responda **fundamentado em dados que não estão em seus pesos**. Resolve três problemas de uma vez: conhecimento após o data cutoff, dados privados da organização e rastreabilidade da resposta (citação da fonte).

### 12.1 O pipeline em duas fases

**Fase 1 — Indexação (offline)**

1. **Ingestão**: coletar documentos (wikis, PDFs, código, catálogos de dados, tickets).
2. **Parsing e limpeza**: extrair texto preservando estrutura (títulos, tabelas). Etapa mais subestimada — PDF mal extraído envenena todo o resto.
3. **Chunking**: dividir em trechos. Estratégias: tamanho fixo com sobreposição (*overlap*), por estrutura (título/seção), semântica (quebra onde o assunto muda) e *late chunking*.
4. **Embedding**: vetorizar cada trecho.
5. **Indexação**: armazenar vetores + metadados em um banco vetorial (pgvector, Qdrant, Weaviate, Pinecone, Elasticsearch, LanceDB) usando índice aproximado, tipicamente HNSW ou IVF.

**Fase 2 — Consulta (online)**

1. **Transformação da consulta**: reescrita, expansão, geração de múltiplas consultas, HyDE (gerar uma resposta hipotética e buscar por ela).
2. **Recuperação**: busca vetorial (ANN) e/ou busca lexical.
3. **Reranking**: reordenar candidatos com um cross-encoder (§9).
4. **Montagem do contexto**: inserir os melhores trechos no prompt com suas fontes.
5. **Geração com citação**: instruir o modelo a responder apenas com base no contexto e a citar a origem, ou declarar que não sabe.

### 12.2 Busca híbrida

Busca **vetorial** (densa) captura significado mas erra em termos exatos: códigos, siglas internas, nomes de tabela, números de norma. Busca **lexical** (esparsa, tipo BM25) acerta o termo exato mas não entende sinônimos. **Busca híbrida** executa as duas e funde os resultados — comumente por **RRF (Reciprocal Rank Fusion)**. Em bases técnicas corporativas, cheias de identificadores como `TBL_NFE_ITEM` ou `EFD-Reinf R-2010`, a busca híbrida é praticamente obrigatória.

### 12.3 Variantes

| Variante | Ideia |
|---|---|
| **Naive RAG** | Buscar top-k e concatenar no prompt |
| **RAG com reranking** | Recuperação ampla + cross-encoder para precisão |
| **GraphRAG** | Construir um grafo de entidades e relações; permite responder perguntas globais ("quais temas atravessam toda a base?") que a busca por trechos não responde |
| **Agentic RAG** | O modelo decide *se* busca, *o que* busca, avalia a qualidade do que voltou e **busca de novo** se necessário — recuperação como ferramenta dentro de um loop de agente |
| **Self-RAG / CRAG** | Autoavaliação da relevância dos trechos e correção do curso da recuperação |
| **Contextual retrieval** | Prefixar cada chunk com um resumo do documento de origem antes de vetorizar, reduzindo perda de contexto na fragmentação |

### 12.4 Avaliação de RAG

Avalia-se **recuperação** e **geração** separadamente, porque as causas de falha são diferentes.

| Dimensão | Métrica | Pergunta que responde |
|---|---|---|
| Recuperação | Recall@k, Precision@k, MRR, NDCG | O trecho certo chegou a ser recuperado? |
| Geração | **Faithfulness / groundedness** | A resposta é sustentada pelo contexto recuperado? |
| Geração | **Answer relevance** | A resposta atende à pergunta feita? |
| Fim a fim | Correção, taxa de citação válida | O usuário obteve a resposta certa e verificável? |

> **Regra diagnóstica:** se a informação certa **não** foi recuperada, o problema é de chunking, embedding ou busca — não adianta trocar o LLM. Se foi recuperada e a resposta ainda está errada, o problema é de prompt ou do modelo gerador.

### 12.5 Modos de falha frequentes

- Chunk pequeno demais (perde contexto) ou grande demais (dilui o sinal).
- Tabelas destruídas na extração de PDF.
- Base desatualizada sem processo de reindexação — RAG herda a dívida de qualidade da fonte.
- Ausência de filtro por metadados (permissão, data, sistema de origem), levando a vazamento entre domínios.
- Confiança cega no top-k: se nada relevante existe na base, o modelo ainda recebe *k* trechos irrelevantes e tende a responder mesmo assim. Um **limiar de similaridade mínima** é defesa essencial.

### Fatos-chave §12

- RAG injeta trechos recuperados de uma base externa no prompt para fundamentar a resposta em dados fora dos pesos do modelo.
- O pipeline de RAG tem uma fase offline (ingestão, parsing, chunking, embedding, indexação) e uma fase online (transformação da consulta, recuperação, reranking, montagem do contexto, geração).
- Busca vetorial captura significado mas falha em termos exatos; busca lexical (BM25) acerta termos exatos mas não entende sinônimos; busca híbrida combina as duas.
- Reciprocal Rank Fusion (RRF) é o método comum de fundir os rankings de busca densa e esparsa.
- Bancos vetoriais usam índices aproximados como HNSW ou IVF para busca em larga escala.
- GraphRAG constrói um grafo de entidades e relações, permitindo responder perguntas globais sobre a base que a recuperação por trechos não responde.
- Agentic RAG coloca a recuperação como ferramenta dentro do loop do agente, que decide se, o que e quantas vezes buscar.
- Faithfulness (groundedness) mede se a resposta é sustentada pelo contexto recuperado; answer relevance mede se ela responde à pergunta.
- Se o trecho correto não foi recuperado, o problema está em chunking, embedding ou busca — trocar o LLM não resolve.
- Sem limiar mínimo de similaridade, o sistema entrega os k trechos mais próximos mesmo quando nenhum é relevante.
- Filtros por metadados (permissão, data, origem) são necessários para impedir vazamento entre domínios em bases corporativas.

---

## 13. Fine-tuning, LoRA e a decisão entre prompt, RAG e treino

### 13.1 O que fine-tuning resolve — e o que não resolve

Fine-tuning é continuar o treino de um modelo pré-treinado com dados próprios, **alterando seus pesos**. Ele é eficaz para ensinar **comportamento, formato e estilo**: adotar o padrão de SQL do time, responder sempre em um layout específico, dominar o jargão de um domínio, classificar segundo uma taxonomia interna.

É **ineficaz e caro** como forma de injetar conhecimento factual volátil. Fatos que mudam (o catálogo de tabelas, a regra fiscal deste mês, o estado do pipeline) pertencem ao RAG ou a uma ferramenta, não aos pesos. Fine-tuning para conhecimento tende a produzir alucinações confiantes e exige retreino a cada mudança.

> **Heurística:** fine-tuning ensina **forma**; RAG fornece **fato**; ferramentas dão **ação** e **verdade em tempo real**.

### 13.2 Fine-tuning completo vs. PEFT

| Abordagem | Como funciona | Custo |
|---|---|---|
| **Full fine-tuning** | Atualiza todos os parâmetros | Alto: exige memória para pesos, gradientes e estados do otimizador |
| **PEFT (Parameter-Efficient Fine-Tuning)** | Congela o modelo e treina um pequeno conjunto de parâmetros novos | Baixo |
| **LoRA (Low-Rank Adaptation)** | Insere matrizes de baixo posto (*rank*) adjacentes aos pesos congelados; só elas são treinadas | Ordens de magnitude mais barato; gera adaptadores de poucos MB |
| **QLoRA** | LoRA sobre um modelo base quantizado (ex.: 4 bits) | Permite ajustar modelos grandes em uma única GPU de consumo |

Vantagem operacional do LoRA: os adaptadores são pequenos e **intercambiáveis** — um mesmo modelo base servido em memória pode atender vários adaptadores de domínios diferentes.

**Catastrophic forgetting** é o risco clássico: ao ajustar demais para um domínio estreito, o modelo perde capacidades gerais.

### 13.3 Árvore de decisão

```
O modelo erra a tarefa?
├─ Falta INSTRUÇÃO clara ou formato? ........... Prompt / few-shot / structured output
├─ Falta INFORMAÇÃO específica ou atual? ....... RAG ou tool use
├─ Falta EXECUTAR algo no mundo real? .......... Tool use / agente
├─ Falta COMPORTAMENTO/estilo consistente
│  mesmo com bons prompts? ..................... Fine-tuning (SFT / LoRA)
└─ Falta CAPACIDADE de raciocínio? ............. Modelo maior ou de raciocínio
```

A ordem importa: **sempre esgote prompt e contexto antes de considerar treino.** Fine-tuning cria dívida de manutenção permanente (dataset, versionamento, reavaliação a cada novo modelo base) que raramente se justifica em problemas corporativos comuns.

### Fatos-chave §13

- Fine-tuning altera os pesos do modelo e é eficaz para ensinar comportamento, formato, estilo e jargão de domínio.
- Fine-tuning é a ferramenta errada para injetar conhecimento factual volátil; esse papel cabe a RAG ou a ferramentas.
- LoRA treina matrizes de baixo posto adjacentes aos pesos congelados, produzindo adaptadores pequenos e intercambiáveis.
- QLoRA combina LoRA com um modelo base quantizado, permitindo ajuste de modelos grandes em uma única GPU.
- PEFT designa o conjunto de técnicas que congelam o modelo e treinam apenas um pequeno número de parâmetros adicionais.
- Catastrophic forgetting é a perda de capacidades gerais ao ajustar excessivamente o modelo para um domínio estreito.
- A ordem recomendada de intervenção é prompt → contexto/RAG → ferramentas → fine-tuning → modelo maior.
- Fine-tuning gera dívida de manutenção permanente: dataset versionado e reavaliação a cada novo modelo base.

---

## 14. Tool use e function calling

**Tool use** (uso de ferramentas), também chamado de **function calling**, é o mecanismo pelo qual um modelo deixa de apenas escrever texto e passa a **solicitar a execução de código externo**.

### 14.1 Como funciona, passo a passo

1. A aplicação envia ao modelo, junto do prompt, uma lista de ferramentas disponíveis — cada uma com **nome, descrição em linguagem natural e schema JSON dos parâmetros**.
2. O modelo decide que precisa de uma ferramenta e, em vez de texto final, emite uma **solicitação estruturada** com o nome da ferramenta e os argumentos.
3. **Quem executa é a aplicação, não o modelo.** O modelo apenas pede.
4. O resultado da execução é devolvido ao modelo como uma nova mensagem no contexto.
5. O modelo continua: pode chamar outra ferramenta, ou produzir a resposta final.

> Este é o ponto conceitual mais importante e mais confundido da área: **o LLM nunca executa nada**. Ele emite uma intenção estruturada; a execução, a autorização e o sandbox são responsabilidade do sistema ao redor. É exatamente aí que moram os controles de segurança.

### 14.2 O que torna uma ferramenta boa

- **Descrição clara**: é o único material que o modelo tem para decidir quando usá-la. Descrição ruim → ferramenta usada na hora errada.
- **Schema restritivo**: enums em vez de texto livre, tipos explícitos, campos obrigatórios.
- **Poucas e bem separadas**: dezenas de ferramentas sobrepostas causam *context confusion* e queda de acurácia na escolha.
- **Saída compacta**: devolver o mínimo necessário (§11.2).
- **Erros informativos**: uma mensagem de erro que explique o que corrigir permite ao modelo se recuperar sozinho; um stack trace cru, não.
- **Idempotência e reversibilidade**: ferramentas que escrevem devem ser seguras de repetir e, idealmente, reversíveis.

### 14.3 Padrões

**Chamadas paralelas**: modelos modernos podem solicitar várias ferramentas independentes no mesmo turno. **Chamadas encadeadas**: a saída de uma alimenta a próxima — é o embrião do loop de agente. **Human-in-the-loop**: ferramentas classificadas por risco, exigindo aprovação explícita para as destrutivas (`DROP`, `DELETE`, deploy, envio de e-mail).

### Fatos-chave §14

- Em tool use, a aplicação fornece ao modelo nome, descrição e schema JSON de cada ferramenta disponível.
- O modelo não executa a ferramenta: ele emite uma solicitação estruturada com nome e argumentos, e a aplicação a executa.
- O resultado da execução volta ao contexto como nova mensagem, e o modelo decide o próximo passo.
- A descrição da ferramenta é o principal insumo para o modelo decidir quando usá-la.
- Expor muitas ferramentas sobrepostas degrada a acurácia de seleção e consome contexto.
- Mensagens de erro descritivas permitem que o modelo se recupere sozinho; stack traces crus não.
- Modelos modernos conseguem solicitar múltiplas ferramentas independentes em paralelo no mesmo turno.
- Ferramentas destrutivas devem exigir aprovação humana explícita (human-in-the-loop).

---

## 15. Agentes de IA

### 15.1 Definição

Um **agente de IA** é um sistema em que um modelo de linguagem **decide autonomamente a sequência de ações** para atingir um objetivo, usando ferramentas e observando os resultados, em um **loop**, até concluir a tarefa ou atingir um limite.

A definição operacional mais útil: **o modelo controla o fluxo de execução**. É isso que separa agente de automação com IA dentro.

### 15.2 Workflow vs. agente

| | **Workflow** | **Agente** |
|---|---|---|
| Fluxo | Fixo, escrito por humanos | Decidido pelo modelo em tempo de execução |
| Previsibilidade | Alta | Baixa |
| Custo | Previsível | Variável |
| Depuração | Simples | Difícil |
| Bom para | Processos repetitivos e bem definidos | Tarefas abertas com caminho desconhecido |

> **Princípio de projeto amplamente aceito: use o sistema mais simples que resolve.** A maioria dos problemas corporativos é melhor atendida por um workflow determinístico com uma ou duas chamadas de LLM em pontos específicos do que por um agente autônomo. Agentes valem o custo e a imprevisibilidade quando o caminho da solução **não pode ser enumerado de antemão**.

### 15.3 O loop do agente

```
   ┌──────────────────────────────────────────┐
   │                                          │
   ▼                                          │
Percepção → Raciocínio → Ação (ferramenta) → Observação
  (estado)   (o que fazer)   (executa)       (resultado)
                                                │
                     objetivo atingido? ────────┘
                            │ sim
                            ▼
                        Resposta
```

**ReAct (Reason + Act)** é o padrão canônico: alternar explicitamente Thought → Action → Observation a cada iteração.

Outros padrões: **Plan-and-Execute** (planejar tudo primeiro, depois executar), **Reflexion / self-critique** (o agente critica o próprio resultado e refaz), **Tree of Thoughts** (explorar ramos alternativos).

### 15.4 Componentes de um agente

| Componente | Papel |
|---|---|
| **Modelo** | O motor de decisão |
| **Instruções** | Objetivo, políticas, limites |
| **Ferramentas** | Braços e olhos: ler, escrever, executar, consultar |
| **Memória** | Curto prazo (contexto) e longo prazo (externa, §11) |
| **Loop de controle** | Quando continuar, quando parar, quando pedir ajuda |
| **Harness** | Toda a infraestrutura ao redor (§16) |

### 15.5 Sistemas multiagente

| Topologia | Descrição | Risco |
|---|---|---|
| **Orquestrador-trabalhadores** | Um agente coordenador delega subtarefas a especialistas | Gargalo no coordenador |
| **Sequencial (pipeline)** | Saída de um é entrada do próximo | Propagação de erro |
| **Debate / crítico-executor** | Um produz, outro critica | Custo multiplicado |
| **Swarm / handoff** | Agentes transferem o controle entre si | Loops e perda de rastreabilidade |

Multiagente custa caro: multiplica tokens, latência e superfície de falha. Só se justifica quando há **paralelismo real** (várias buscas independentes) ou **necessidade de isolar contextos** (§11.2). Um agente único com boas ferramentas costuma vencer três agentes mal coordenados.

### 15.6 Níveis de autonomia

| Nível | Descrição | Exemplo em dados |
|---|---|---|
| 0 | Sugestão passiva | Autocompletar de código |
| 1 | Copiloto — humano aprova cada passo | Chat que propõe um SQL para você revisar |
| 2 | Agente supervisionado — executa, humano aprova pontos críticos | Agente que escreve e roda testes, mas pede aprovação para abrir PR |
| 3 | Agente autônomo em sandbox — executa fim a fim, humano revisa o resultado | Agente que corrige um job quebrado em ambiente de desenvolvimento |
| 4 | Autônomo em produção — sem revisão prévia | Raro e arriscado; exige guardrails fortes |

### Fatos-chave §15

- Um agente de IA é definido por o modelo controlar o fluxo de execução, decidindo a sequência de ações em um loop.
- Em um workflow, o fluxo é fixo e definido por humanos; em um agente, é decidido pelo modelo em tempo de execução.
- O princípio de projeto recomendado é usar o sistema mais simples que resolve; agentes se justificam quando o caminho da solução não pode ser enumerado de antemão.
- ReAct é o padrão que alterna explicitamente Thought (raciocínio), Action (ação) e Observation (observação) a cada iteração.
- Reflexion é o padrão em que o agente critica o próprio resultado e refaz o trabalho.
- Plan-and-Execute separa a fase de planejamento completo da fase de execução.
- Os componentes de um agente são modelo, instruções, ferramentas, memória, loop de controle e harness.
- Sistemas multiagente multiplicam custo, latência e superfície de falha, e só se justificam com paralelismo real ou necessidade de isolar contextos.
- Na topologia orquestrador-trabalhadores, um agente coordenador delega subtarefas a agentes especialistas.
- Os níveis de autonomia vão de sugestão passiva a execução autônoma em produção, com o grau de aprovação humana decrescendo.

---

## 16. Harness — a infraestrutura que transforma modelo em agente

### 16.1 Definição

> **Agente = Modelo + Harness.**

O **harness** (ou *agent harness*) é a camada de software que envolve o modelo e o converte em um agente confiável: ela controla **como o modelo pode agir, o que ele enxerga, o que é permitido e como o trabalho é verificado**. O termo vem por analogia com "arreio/cinto de segurança" e com o conceito de *test harness* em engenharia de software — a estrutura em torno da coisa testada que fornece entradas, captura saídas e impõe limites.

Dois modelos idênticos com harnesses diferentes produzem resultados radicalmente diferentes. Na prática atual, **grande parte da diferença de qualidade entre ferramentas agênticas vem do harness, não do modelo**.

### 16.2 A progressão das disciplinas

| Disciplina | Pergunta central |
|---|---|
| **Prompt engineering** | *Como* nos comunicamos com o modelo |
| **Context engineering** | *Que informação* o modelo recebe |
| **Harness engineering** | *Como o modelo pode agir* e como o trabalho é verificado |

### 16.3 Os cinco componentes de um harness

**1. Orquestração de ferramentas.** Quais ferramentas existem, como são descritas, como são encadeadas, como erros de execução são tratados e como o agente se recupera deles.

**2. Loops de verificação.** Etapas automáticas de controle de qualidade **durante** a execução: rodar testes, compilar, validar schema, rodar linter, o agente criticar a própria saída. O objetivo é **falhar cedo** e impedir que um erro se propague pelas etapas seguintes. Em engenharia de dados, o equivalente direto é rodar `dbt test`, validar contagem de linhas e conferir o plano de execução antes de aceitar uma alteração.

**3. Contexto e memória.** Indexação da base de código e dos artefatos, persistência do histórico de sessão, arquivos de convenções do projeto — para que o agente não precise redescobrir a arquitetura a cada execução.

**4. Guardrails.** Limites rígidos: escopo de arquivos e diretórios, sandbox de execução, permissões por ferramenta, teto de custo e de iterações, listas de comandos proibidos e portões de aprovação humana para operações sensíveis.

**5. Observabilidade.** Telemetria e log de auditoria capturando entradas, saídas e estado exatos de cada passo — *tracing* — para depuração, análise de custo e detecção de regressão. Sem isso, um agente é uma caixa-preta impossível de melhorar.

### 16.4 Por que o harness domina o resultado

- Um modelo excelente com ferramentas mal descritas escolhe a ação errada.
- Um modelo excelente sem loop de verificação entrega código que não compila.
- Um modelo excelente sem guardrails pode rodar `DROP TABLE` em produção.
- Um modelo excelente sem observabilidade produz falhas que ninguém consegue diagnosticar.

### 16.5 Manifestações concretas do harness no dia a dia

| Elemento | O que é na prática |
|---|---|
| Arquivo de convenções (`CLAUDE.md`, `AGENTS.md`) | Memória de projeto lida automaticamente pelo agente |
| Permissões e allowlist de comandos | Guardrail de execução |
| Execução em container / worktree isolado | Sandbox |
| Hooks pré e pós-ação | Verificação automática (lint, formatação, testes) |
| Limite de iterações e de custo | Guardrail econômico |
| Traces e logs de sessão | Observabilidade |
| Sub-agentes com contexto próprio | Isolamento de contexto |

### Fatos-chave §16

- Harness é a camada de infraestrutura que envolve o modelo e o transforma em agente confiável; a equação usual é "Agente = Modelo + Harness".
- Os cinco componentes de um harness são orquestração de ferramentas, loops de verificação, contexto e memória, guardrails e observabilidade.
- Harness engineering trata de como o modelo pode agir e de como o trabalho é verificado, enquanto prompt engineering trata da comunicação e context engineering da informação fornecida.
- Loops de verificação existem para falhar cedo e impedir a propagação de erros entre etapas.
- Guardrails incluem limites de escopo, sandbox, permissões por ferramenta, tetos de custo e iteração e portões de aprovação humana.
- Observabilidade em um harness significa registrar entradas, saídas e estado de cada passo para depuração e detecção de regressão.
- Dois agentes com o mesmo modelo podem ter desempenho muito diferente por causa do harness.
- Arquivos de convenções de projeto lidos automaticamente pelo agente são a manifestação prática do componente de memória do harness.

---

## 17. Protocolos de interoperabilidade: MCP, A2A e afins

Antes dos protocolos, cada integração agente↔ferramenta era um conector sob medida: *N* agentes × *M* ferramentas = *N×M* integrações. Padrões convertem isso em *N + M*.

### 17.1 MCP — Model Context Protocol

Padrão aberto, introduzido pela Anthropic no fim de 2024, que define **como um agente acessa ferramentas, dados e prompts externos** por meio de uma interface universal. Tecnicamente baseia-se em **JSON-RPC**, com transporte local (stdio) ou remoto (HTTP com streaming).

Arquitetura cliente-servidor:

| Papel | Descrição |
|---|---|
| **Host / cliente MCP** | A aplicação de IA (IDE, assistente, agente) que consome capacidades |
| **Servidor MCP** | Processo que expõe capacidades de um sistema (banco, Git, Jira, data warehouse, sistema de arquivos) |

Primitivas expostas por um servidor MCP:

- **Tools** — funções executáveis (consultar uma tabela, abrir um ticket).
- **Resources** — dados legíveis endereçados por URI (um arquivo, um schema).
- **Prompts** — modelos de instrução reutilizáveis oferecidos pelo servidor.

O valor prático: escrever **um** servidor MCP para o seu data warehouse e qualquer agente compatível passa a poder consultá-lo, sem integração específica.

### 17.2 A2A — Agent-to-Agent

Protocolo lançado pelo Google em 2025 e posteriormente doado à Linux Foundation, voltado à **comunicação entre agentes** (peer-to-peer), não entre agente e ferramenta. Usa **Agent Cards** para descoberta de capacidades e padroniza o "envelope" da delegação de tarefas entre agentes de fornecedores diferentes.

> **Distinção que cai em prova:** **MCP conecta agentes a ferramentas; A2A conecta agentes a outros agentes.**

### 17.3 Outros protocolos do ecossistema

| Protocolo | Camada |
|---|---|
| **WebMCP** | Permite que sites declarem capacidades consumíveis por agentes, em vez de forçar scraping da página |
| **ACP / ANP** | Variantes de comunicação e descoberta entre agentes |
| **OSI (Open Semantic Interchange)** | Camada **semântica**: padroniza definições de métricas, dimensões e entidades para que agentes usem a mesma lógica de negócio entre plataformas — diretamente relevante para engenharia de dados |

### Fatos-chave §17

- Protocolos de interoperabilidade convertem o problema de N×M integrações em N+M.
- MCP (Model Context Protocol) é um padrão aberto introduzido pela Anthropic no fim de 2024 para conectar agentes a ferramentas e dados.
- MCP usa arquitetura cliente-servidor sobre JSON-RPC, com transporte local (stdio) ou remoto (HTTP com streaming).
- As primitivas de um servidor MCP são tools (funções executáveis), resources (dados endereçados por URI) e prompts (modelos reutilizáveis).
- A2A foi lançado pelo Google em 2025, doado à Linux Foundation, e padroniza a comunicação entre agentes usando Agent Cards para descoberta.
- MCP conecta agentes a ferramentas; A2A conecta agentes a outros agentes.
- WebMCP permite que sites declarem capacidades para agentes em vez de serem raspados.
- OSI (Open Semantic Interchange) padroniza definições semânticas de métricas e dimensões para uso consistente por agentes entre plataformas.

---

## 18. Avaliação, evals e observabilidade

Sistemas de IA são **não determinísticos e sem fronteira clara entre certo e errado**, o que quebra o modelo tradicional de testes. Avaliação passa a ser uma disciplina contínua, não um portão único de deploy.

### 18.1 Benchmarks públicos vs. evals internos

**Benchmarks** (MMLU, GPQA, SWE-bench, HumanEval, LMArena) comparam modelos entre si em tarefas padronizadas. Servem para triagem inicial de modelos, e **não** para prever desempenho no seu caso de uso. São vulneráveis a **contaminação de dados** (o benchmark estar no corpus de treino) e a otimização dirigida ao teste.

**Evals internos** são conjuntos de casos representativos **do seu problema**, com critérios de aceitação próprios. São o único indicador confiável. Uma suíte de 50 a 200 casos reais bem escolhidos vale mais do que qualquer leaderboard.

### 18.2 Métodos de avaliação

| Método | Quando usar |
|---|---|
| **Correspondência exata / regex** | Saída determinística (classificação, extração de campo) |
| **Verificação por execução** | Código que compila e passa nos testes; SQL cujo resultado bate com o esperado — o padrão-ouro em engenharia de dados |
| **Métricas de similaridade** (BLEU, ROUGE, similaridade de embedding) | Tarefas de texto com referência |
| **LLM-as-a-judge** | Qualidade subjetiva em escala, com rubrica explícita |
| **Avaliação humana** | Verdade fundamental; cara e lenta, usada para calibrar o juiz automático |

**LLM-as-a-judge** tem vieses conhecidos que precisam ser controlados: preferência por respostas mais longas, viés de posição (favorecer a primeira ou a última alternativa apresentada) e tendência a favorecer texto gerado por modelos da mesma família. Mitigações: rubrica detalhada, alternância da ordem de apresentação, e calibração periódica contra julgamento humano.

### 18.3 Observabilidade de sistemas de IA

O que instrumentar: **traces** completos (prompt, contexto recuperado, chamadas de ferramenta, saídas intermediárias, resposta final), tokens e custo por requisição, latência por etapa, taxa de erro de ferramentas, número de iterações do agente, e sinais de qualidade (feedback do usuário, taxa de aceitação de sugestões).

**Drift** é a degradação silenciosa ao longo do tempo: o provedor atualiza o modelo, os dados mudam, a base de RAG envelhece, os usuários mudam o padrão de perguntas. Sem eval contínuo rodando em cima de casos fixos, a queda só aparece via reclamação.

### Fatos-chave §18

- Benchmarks públicos servem para triagem inicial de modelos e não preveem desempenho no caso de uso específico.
- Contaminação de dados é o risco de o conteúdo do benchmark estar presente no corpus de treino do modelo.
- Evals internos com casos representativos do problema real são o único indicador confiável de qualidade.
- Verificação por execução (código que passa nos testes, SQL cujo resultado bate) é o método de avaliação mais forte em tarefas de engenharia de dados.
- LLM-as-a-judge permite avaliar qualidade subjetiva em escala, mas sofre de viés de comprimento, viés de posição e preferência por modelos da mesma família.
- Traces devem registrar prompt, contexto recuperado, chamadas de ferramenta, saídas intermediárias e resposta final.
- Drift é a degradação silenciosa da qualidade causada por mudanças no modelo, nos dados ou no padrão de uso, e só é detectada com avaliação contínua.

---

## 19. Riscos, falhas e segurança

### 19.1 Alucinação

**Alucinação** (ou confabulação) é a produção de conteúdo plausível, fluente e **factualmente incorreto**, apresentado com o mesmo tom de confiança de uma resposta correta.

Causa raiz: o modelo é otimizado para gerar a **continuação mais provável**, não para dizer a verdade. Quando não há sinal suficiente nos pesos nem no contexto, a continuação mais provável ainda é uma sequência bem formada — e ela sai. Um fator adicional é que as receitas de treino historicamente recompensam responder mais do que admitir desconhecimento.

Manifestações típicas em engenharia de dados: inventar nomes de colunas e tabelas, funções que não existem no dialeto SQL usado, parâmetros inexistentes de bibliotecas, citações de documentação fabricadas.

Mitigações, em ordem de eficácia: **verificação por execução** (rode o SQL, rode o teste), aterramento por RAG com citação obrigatória, restrição da resposta a um schema, instrução explícita para declarar incerteza, e revisão humana.

> **Ponto importante:** alucinação **não é um bug que será eliminado por um modelo melhor**. É consequência do funcionamento probabilístico do modelo. Modelos melhores reduzem a taxa; a arquitetura do sistema é que a torna gerenciável.

### 19.2 Injeção de prompt (prompt injection)

Ataque em que instruções maliciosas são inseridas em conteúdo que o modelo processa, fazendo-o desviar do objetivo. **Injeção direta**: o usuário escreve a instrução maliciosa. **Injeção indireta**: a instrução está em um dado que o agente vai ler — um comentário de código, uma célula de planilha, a descrição de um ticket, uma página web, um campo de texto em uma tabela.

A injeção indireta é o risco estrutural dos agentes, porque **o modelo não distingue confiavelmente instrução de dado** — ambos chegam como tokens no mesmo contexto.

A combinação perigosa, conhecida como **trifeta letal**: acesso a **dados privados** + exposição a **conteúdo não confiável** + capacidade de **comunicação externa**. Com os três, um atacante pode fazer o agente ler um segredo e exfiltrá-lo. Remover qualquer um dos três quebra o ataque.

Mitigações: tratar toda saída de ferramenta como não confiável, princípio do menor privilégio nas credenciais do agente, separação clara entre instrução e dado, allowlist de destinos de rede, aprovação humana para ações irreversíveis, e **nunca** conceder ao agente permissões maiores que as do usuário que o acionou.

### 19.3 Outros riscos

| Risco | Descrição | Mitigação |
|---|---|---|
| **Vazamento de dados** | Dados sensíveis enviados a APIs de terceiros ou usados em treino | Política de uso, mascaramento/anonimização, endpoints sem retenção, modelos on-premise |
| **Jailbreak** | Contornar as políticas de segurança do modelo | Guardrails em camada separada, filtros de entrada e saída |
| **Viés** | Reprodução de vieses do corpus de treino | Avaliação por subgrupo, revisão humana em decisões sensíveis |
| **Excesso de confiança (automation bias)** | Humano aprovar sem revisar porque a saída parece boa | Revisão obrigatória, testes automatizados, PRs pequenos |
| **Propriedade intelectual e licenças** | Código sugerido semelhante a código licenciado | Filtros de similaridade, política corporativa |
| **LGPD / dados pessoais** | Envio de dado pessoal a processador não autorizado | Base legal, DPA com o fornecedor, minimização, anonimização |
| **Dependência de fornecedor** | Acoplamento a uma API específica | Camada de abstração, evals que permitam trocar de modelo |
| **Custo descontrolado** | Agente em loop consumindo tokens | Teto de iterações, teto de gasto, alertas |
| **Erosão de competência** | Time perde capacidade de revisar o que a IA produz | Rotação, revisão obrigatória, formação continuada |

### 19.4 Regulação

O ecossistema regulatório amadureceu em torno de abordagens baseadas em risco: o **AI Act europeu** classifica sistemas por nível de risco e impõe obrigações proporcionais; o **NIST AI Risk Management Framework** oferece um arcabouço voluntário de governança; a **ISO/IEC 42001** define requisitos para um sistema de gestão de IA, auditável e certificável — um paralelo direto com o que a ISO 27001 é para segurança da informação. No Brasil, o tratamento de dados pessoais em sistemas de IA permanece regido pela **LGPD**, com atenção especial a base legal, minimização e transferência internacional.

### Fatos-chave §19

- Alucinação é a geração de conteúdo plausível e factualmente incorreto, apresentado com tom de confiança.
- A causa raiz da alucinação é o modelo otimizar a continuação mais provável, não a veracidade; ela não será eliminada apenas por modelos melhores.
- A mitigação mais eficaz de alucinação em tarefas técnicas é a verificação por execução: rodar o código, o teste ou a consulta.
- Injeção indireta de prompt ocorre quando a instrução maliciosa está em um dado que o agente lê, como um comentário de código, um ticket ou uma página web.
- O risco estrutural da injeção de prompt vem de o modelo não distinguir confiavelmente instrução de dado, pois ambos chegam como tokens no mesmo contexto.
- A "trifeta letal" combina acesso a dados privados, exposição a conteúdo não confiável e capacidade de comunicação externa; remover qualquer um dos três quebra o ataque.
- Um agente nunca deve ter permissões maiores do que as do usuário que o acionou.
- Automation bias é a tendência humana de aprovar saídas de IA sem revisá-las adequadamente.
- A ISO/IEC 42001 define requisitos para um sistema de gestão de IA auditável, análogo ao papel da ISO 27001 em segurança da informação.
- O AI Act europeu classifica sistemas de IA por nível de risco e impõe obrigações proporcionais.

---
# Parte III — IA no dia a dia da Engenharia de Dados

---

## 20. Mapa de tarefas: onde a IA ajuda de verdade

A regra estruturante: **a IA generativa é excelente onde a verificação é barata e o erro é reversível; é perigosa onde a verificação é cara e o erro é silencioso.**

| Tarefa | Ganho | Risco | Verificação disponível |
|---|---|---|---|
| Escrever SQL de análise exploratória | Alto | Baixo | Rodar e conferir o resultado |
| Documentar tabelas e pipelines existentes | Muito alto | Baixo | Revisão humana rápida |
| Escrever testes de qualidade de dados | Muito alto | Baixo | Os testes rodam |
| Gerar boilerplate (DAG, job, config, DDL) | Alto | Baixo | Lint + execução |
| Traduzir entre dialetos SQL / linguagens | Alto | Médio | Comparação de resultados |
| Explicar código legado desconhecido | Muito alto | Baixo | Leitura comparada |
| Revisar PR (code review assistido) | Alto | Baixo | É sugestão, não decisão |
| Depurar erro de pipeline | Alto | Médio | Reproduzir a falha |
| Otimizar consulta pesada | Médio-alto | Médio | Plano de execução + tempo medido |
| Classificar/enriquecer texto não estruturado em escala | Alto | Médio | Amostragem + eval |
| Extrair campos de documentos (NF, contratos) | Alto | Médio | Validação por regra + amostragem |
| Propor modelagem dimensional | Médio | Médio | Revisão de arquiteto |
| **Decidir regra de negócio** | — | **Alto** | Não verificável automaticamente |
| **Cálculo determinístico no caminho crítico** | — | **Alto** | Não determinístico por natureza |
| **Aprovar mudança em produção sem revisão** | — | **Alto** | — |

**O deslocamento de gargalo.** Com IA, escrever código deixa de ser o gargalo; **revisar, validar e integrar** passa a ser. Times que não ajustam a capacidade de revisão simplesmente movem a fila de lugar — e acumulam código que ninguém entende. Essa é a razão pela qual PRs pequenos, testes automatizados e verificação por execução ganham importância proporcional ao uso de IA.

### Fatos-chave §20

- A IA generativa rende mais onde a verificação é barata e o erro é reversível, e é arriscada onde a verificação é cara e o erro é silencioso.
- Documentação de pipelines existentes, geração de testes de qualidade e explicação de código legado estão entre as tarefas de maior ganho e menor risco.
- Decisões de regra de negócio e cálculos determinísticos no caminho crítico não devem ser delegados a um LLM.
- Com o uso de IA, o gargalo se desloca de escrever código para revisar, validar e integrar código.

---

## 21. Auxiliares de código: da autocompletar ao agente autônomo

### 21.1 As gerações de ferramentas

| Geração | Modo de interação | Unidade de trabalho |
|---|---|---|
| **1. Autocompletar** | Sugestão inline enquanto se digita | Linha / bloco |
| **2. Chat com contexto** | Conversa dentro da IDE, com acesso ao arquivo aberto | Função / arquivo |
| **3. Edição multiarquivo** | Instrução em linguagem natural aplica diffs em vários arquivos | Alteração coerente no repositório |
| **4. Agente com terminal** | Lê, escreve, executa comandos, roda testes, itera até resolver | Tarefa completa |
| **5. Agente assíncrono / remoto** | Recebe uma issue, trabalha em ambiente isolado, abre um PR | Ticket |

A progressão é de **autonomia** e de **unidade de trabalho**, e cada degrau aumenta a exigência sobre o harness (§16): quanto mais autônomo, mais críticos são guardrails, verificação e observabilidade.

### 21.2 Categorias de ferramenta

| Categoria | Exemplos |
|---|---|
| Autocompletar e chat integrados à IDE | GitHub Copilot, Codeium/Windsurf, Amazon Q Developer, Tabnine |
| IDEs com IA no centro | Cursor, Windsurf, Zed |
| Agentes de terminal (CLI) | Claude Code, Gemini CLI, OpenAI Codex CLI, Aider |
| Agentes assíncronos / de plataforma | Agentes que atuam sobre issues e PRs no repositório |
| Assistentes nativos de plataformas de dados | Databricks Assistant, Snowflake Copilot, BigQuery/Gemini, dbt Copilot |
| Revisão de código automatizada | CodeRabbit, Greptile e recursos nativos das forjas |

### 21.3 O que separa uso amador de uso profissional

**1. Arquivo de convenções do projeto.** Um `CLAUDE.md` / `AGENTS.md` na raiz do repositório com padrões de código, convenções de nomenclatura, comandos de build e teste, estrutura de pastas e regras do time. É memória de projeto: o agente lê automaticamente e para de reinventar padrões a cada sessão. **É a intervenção de maior retorno sobre esforço em uso profissional de agentes de código.**

**2. Contexto explícito.** Apontar arquivos, schemas e exemplos relevantes em vez de esperar que o agente adivinhe.

**3. Desenvolvimento orientado a especificação (spec-driven development, SDD).** Escrever antes uma especificação do que deve ser construído, e usá-la como fonte da verdade para o agente executar em etapas. Transforma "vibe coding" em processo auditável. Padrão emergente: um `SPEC.md` acompanhado de tarefas numeradas.

**4. Verificação automatizada como contrato.** Testes, linters, type checking e hooks que rodam a cada alteração dão ao agente um sinal objetivo de sucesso — o loop de verificação do harness.

**5. Tarefas pequenas e revisáveis.** Um PR grande gerado por IA é, na prática, não revisável — e é assim que erros entram.

**6. Ceticismo calibrado.** Tratar a saída como proposta de um colega competente porém não confiável em detalhes: plausível, frequentemente certa, ocasionalmente errada com total confiança.

### 21.4 Vibe coding

Termo popularizado em 2025 para a prática de descrever o resultado desejado em linguagem natural e aceitar o código gerado sem revisá-lo em profundidade. É legítimo para protótipos descartáveis, provas de conceito e scripts pessoais. É inadequado para código que vai para produção, para pipelines que alimentam decisões de negócio e para qualquer coisa que outra pessoa terá de manter.

### Fatos-chave §21

- A evolução dos auxiliares de código vai de autocompletar inline a chat na IDE, edição multiarquivo, agentes com acesso a terminal e agentes assíncronos que abrem PRs.
- Cada degrau de autonomia aumenta a exigência sobre guardrails, verificação e observabilidade do harness.
- Um arquivo de convenções do projeto (CLAUDE.md / AGENTS.md) funciona como memória de projeto lida automaticamente pelo agente e é a intervenção de maior retorno em uso profissional.
- Desenvolvimento orientado a especificação (SDD) usa uma especificação escrita como fonte da verdade para o agente executar em etapas auditáveis.
- Testes e linters automatizados funcionam como sinal objetivo de sucesso para o loop de verificação do agente.
- PRs grandes gerados por IA são, na prática, não revisáveis, e é por onde os erros entram.
- Vibe coding é aceitar código gerado sem revisão profunda; é adequado a protótipos descartáveis e inadequado a código de produção.

---

## 22. Casos práticos em pipelines de dados

### 22.1 Escrita e otimização de SQL

O uso mais comum e o de maior retorno imediato. Boas práticas:

- Fornecer o **DDL das tabelas relevantes** (ou o catálogo) no contexto — sem schema, o modelo inventa colunas.
- Declarar o **dialeto** explicitamente (Spark SQL, Oracle, T-SQL, BigQuery, DuckDB). Funções de data e janela divergem muito entre eles e são a fonte número um de erro.
- Pedir a consulta e depois pedir a **explicação do plano de execução**.
- Para otimização, fornecer o `EXPLAIN` real, o volume das tabelas e a estratégia de particionamento. Sem esses dados o modelo dá conselhos genéricos.
- Sempre executar contra uma amostra antes de confiar. **Uma consulta que roda não é uma consulta correta.**

### 22.2 Documentação e catálogo

Onde a relação esforço/benefício é mais favorável. Casos: gerar descrições de colunas a partir de DDL e de amostras de dados, escrever o `schema.yml` do dbt, produzir README de repositórios de pipeline, resumir a lógica de um job legado, gerar dicionário de dados e sugerir classificação de sensibilidade (PII/LGPD) para revisão humana.

Essa é a dívida que todo time de dados tem e nunca paga. A IA reduz o custo marginal de pagá-la a quase zero — desde que um humano revise, porque descrição errada em catálogo é pior que ausência de descrição.

### 22.3 Qualidade de dados e testes

Gerar testes a partir do schema e do perfil dos dados: unicidade, não nulo, integridade referencial, domínio de valores, faixas esperadas, distribuição. Traduzir regras de negócio escritas em prosa para asserções executáveis (dbt tests, Great Expectations, Soda). Sugerir expectativas a partir do perfilamento estatístico de uma tabela. Redigir a explicação em linguagem natural de por que um teste falhou, para o time de negócio.

### 22.4 Orquestração e infraestrutura

Gerar esqueletos de DAG (Airflow, Dagster, Prefect), configurar retries, SLAs e alertas, escrever Terraform e configuração de cluster, converter jobs entre orquestradores. É trabalho de boilerplate de alto volume e baixa ambiguidade — território ideal.

### 22.5 Depuração e troubleshooting

Colar um stack trace de Spark e obter hipóteses ordenadas por probabilidade economiza muito tempo. Casos típicos: diagnosticar *data skew* e OOM, interpretar planos de execução, correlacionar falha com mudança recente, explicar erro obscuro de driver ou de biblioteca. Um agente com acesso a logs e à capacidade de executar comandos pode ir além e testar as hipóteses.

### 22.6 Revisão de código

Revisão assistida pega bem: anti-padrões de Spark (`collect()` em volume, `withColumn` em laço, shuffle desnecessário), problemas de idempotência, falta de tratamento de late-arriving data, SQL com risco de produto cartesiano, credenciais hardcoded e violações de convenção do time. Não substitui o revisor humano em decisões de arquitetura e de contexto de negócio.

### 22.7 Migração e modernização de legado

Caso de uso de altíssimo valor: traduzir procedures de um SGBD para outro, converter jobs de ferramentas ETL gráficas (DataStage, Informatica, SSIS, Pentaho) para código (PySpark, dbt, SQL), modernizar código sem documentação, e — a etapa mais valiosa — **primeiro extrair a lógica de negócio em prosa** a partir do artefato legado, para revisão humana, antes de reescrever.

Padrão recomendado para migração: `entender → documentar a regra em linguagem natural → validar a regra com quem conhece o negócio → reescrever → comparar resultados dos dois caminhos com o mesmo insumo (paridade de saída)`. A comparação de resultados é a única prova real de equivalência.

### 22.8 Modelagem e arquitetura

Propor modelos dimensionais a partir de requisitos, sugerir chaves e granularidade, gerar diagramas (Mermaid, PlantUML) a partir de DDL, redigir ADRs, apontar normalização inadequada. A IA é boa em produzir o primeiro rascunho e em listar alternativas; a decisão continua sendo de arquitetura humana.

### 22.9 Dados não estruturados no pipeline

Aqui o LLM entra **dentro** do pipeline, não ao lado dele: classificar tickets, extrair entidades de contratos, ler notas fiscais com VLM, padronizar endereços, categorizar descrições de produto, gerar embeddings para busca semântica. Requisitos de projeto: processar em lote, usar o menor modelo que resolve, validar com schema, ter fallback para revisão humana, e medir com eval fixo — porque é um componente de software com taxa de erro, e essa taxa precisa ser conhecida.

### 22.10 Linhagem e impacto

Inferir linhagem em nível de coluna a partir do SQL, responder "o que quebra se eu remover esta coluna?", mapear dependências entre jobs, gerar análise de impacto para uma mudança de schema. Vale notar que o **parsing determinístico de SQL** (sqlglot, sqlparse, ferramentas nativas de catálogo) é mais confiável que o LLM para extrair linhagem; o melhor uso é o híbrido — parser extrai o grafo, LLM explica, resume e responde perguntas sobre ele.

### Fatos-chave §22

- Sem o DDL das tabelas no contexto, o modelo inventa nomes de colunas — fornecer schema é requisito, não opcional.
- Declarar o dialeto SQL explicitamente evita a principal fonte de erro em geração de consultas: funções de data e de janela divergentes entre dialetos.
- Uma consulta que executa sem erro não é necessariamente uma consulta correta; validação contra amostra é obrigatória.
- Para otimização de consultas, é preciso fornecer o plano de execução real, volumes e particionamento — sem isso a resposta é genérica.
- Documentação de catálogo e geração de testes de qualidade são os usos de melhor relação esforço/benefício em times de dados.
- Descrição incorreta em catálogo de dados é pior do que ausência de descrição, o que torna a revisão humana obrigatória.
- Em migração de legado, a etapa de maior valor é extrair a regra de negócio em linguagem natural para validação humana antes de reescrever.
- A única prova real de equivalência em uma migração é a comparação de resultados (paridade de saída) entre o caminho antigo e o novo com o mesmo insumo.
- Para extração de linhagem, parsers determinísticos de SQL são mais confiáveis que LLMs; o padrão recomendado é híbrido.
- Ao usar LLM dentro do pipeline em escala, aplicam-se as regras de menor modelo suficiente, validação por schema, processamento em lote e eval fixo com taxa de erro conhecida.

---

## 23. Text-to-SQL e a camada semântica

Converter pergunta em linguagem natural para SQL parece resolvido em demonstrações e falha em produção. Entender por quê é entender o limite da IA em dados.

### 23.1 Por que é difícil

| Obstáculo | Descrição |
|---|---|
| **Ambiguidade de negócio** | "Faturamento" pode ser bruto, líquido, com ou sem devolução, por competência ou por caixa. O modelo não pode adivinhar — e vai escolher uma. |
| **Escala do schema** | Centenas ou milhares de tabelas não cabem no contexto; é preciso recuperar apenas as relevantes (RAG sobre o catálogo) |
| **Convenções opacas** | `FLG_ST_02`, `DT_REF`, `VL_TOT_LIQ` não se explicam sozinhos |
| **Joins e granularidade** | Escolher a chave errada produz duplicação silenciosa que não gera erro algum |
| **Regras implícitas** | Filtros que todo analista aplica sem pensar (`WHERE STATUS <> 'CANCELADO'`, excluir a filial de teste) |
| **Falha silenciosa** | Uma consulta errada retorna um número. Ninguém vê exceção. |

> **O modo de falha característico de text-to-SQL não é o erro de sintaxe — é o número errado com aparência de certo.**

### 23.2 A camada semântica como solução estrutural

Uma **camada semântica** (semantic layer / métricas governadas) define, em um artefato versionado, o que é cada métrica, qual a granularidade, quais os filtros padrão e quais dimensões se aplicam. Implementações: dbt Semantic Layer, Cube, LookML, métricas do Databricks Unity Catalog, modelos semânticos do Power BI.

Quando existe camada semântica, o problema muda de natureza: o modelo não precisa mais escrever SQL a partir do schema físico — precisa apenas **escolher a métrica e as dimensões corretas** e delegar a geração do SQL à camada. A superfície de erro cai drasticamente e a consistência é garantida por construção. É por isso que padrões semânticos entre plataformas (como o OSI, §17.3) ganharam relevância junto com os agentes.

### 23.3 Padrão de implementação responsável

1. Restringir o acesso a **views curadas** e documentadas, não ao schema bruto.
2. Recuperar o subconjunto de tabelas relevante por RAG sobre o catálogo.
3. Fornecer consultas de exemplo validadas (few-shot com SQL real do time).
4. Gerar a consulta, **executá-la com `LIMIT` em ambiente somente leitura**.
5. Exibir ao usuário **a consulta gerada**, não apenas o resultado — transparência é o principal controle.
6. Registrar tudo e transformar perguntas frequentes em métricas oficiais.

### Fatos-chave §23

- O modo de falha característico de text-to-SQL é retornar um número errado sem gerar nenhum erro, não falhar por sintaxe.
- A ambiguidade de definição de métricas de negócio é o principal obstáculo do text-to-SQL, acima da capacidade técnica do modelo.
- Schemas corporativos grandes não cabem na janela de contexto, exigindo recuperação das tabelas relevantes por RAG sobre o catálogo.
- Uma camada semântica define métricas, granularidade e filtros padrão em artefato versionado, reduzindo o problema a escolher métrica e dimensões.
- Text-to-SQL responsável deve executar em ambiente somente leitura, com LIMIT, sobre views curadas em vez do schema bruto.
- Exibir a consulta gerada ao usuário, e não apenas o resultado, é o principal mecanismo de transparência e controle.

---

## 24. Uso responsável em ambiente corporativo

### 24.1 Classificação do dado antes da ferramenta

A primeira pergunta nunca é "qual modelo usar", e sim **"que dado vou expor?"**.

| Classe | Exemplo | Uso aceitável |
|---|---|---|
| Público / sintético | Documentação aberta, dados fictícios | Qualquer ferramenta |
| Interno não sensível | Código sem segredo, DDL genérico | Ferramenta corporativa aprovada |
| Confidencial | Dados de cliente, financeiro, regras proprietárias | Só ambiente contratado com DPA, sem retenção nem treino |
| Dado pessoal / sensível (LGPD) | CPF, dados de saúde, biometria | Anonimização ou modelo no perímetro; base legal definida |
| Segredos | Credenciais, chaves, tokens | **Nunca** |

### 24.2 Controles mínimos

- Conta corporativa com **zero data retention** e cláusula de não uso para treino.
- Segredos fora de prompts, de repositórios e de arquivos de contexto.
- Princípio do menor privilégio para credenciais de agentes; ambiente **somente leitura** por padrão em bancos.
- Sandbox de execução para agentes.
- Aprovação humana obrigatória para operações irreversíveis (DDL, DELETE, deploy, e-mail externo).
- Log e auditoria de uso de IA em fluxos que afetam produção.
- Política escrita e treinamento do time — a maior parte dos incidentes vem de uso bem-intencionado sem regra clara.

### 24.3 Governança de código gerado

Tratar código gerado por IA como código escrito por terceiro: passa por PR, revisão, testes e mesmos padrões de qualidade. Vale definir se e como sinalizar autoria assistida — para efeito de auditoria e de calibração da revisão, não para constranger quem usa.

### Fatos-chave §24

- A primeira decisão no uso corporativo de IA é a classificação do dado que será exposto, não a escolha do modelo.
- Credenciais, chaves e tokens nunca devem ser colocados em prompts, repositórios ou arquivos de contexto.
- Contas corporativas devem ter retenção zero de dados e cláusula de não uso do conteúdo para treino.
- Agentes que acessam bancos devem operar com credenciais somente leitura por padrão e princípio do menor privilégio.
- Operações irreversíveis exigem aprovação humana explícita, independentemente do nível de autonomia do agente.
- Código gerado por IA deve passar pelo mesmo processo de PR, revisão e testes que qualquer outro código.

---

## 25. Antipadrões e limites

| Antipadrão | Por que falha | O que fazer |
|---|---|---|
| **Agente para tudo** | Imprevisibilidade e custo onde um script resolveria | Workflow determinístico com IA só nos pontos de ambiguidade |
| **"O contexto é grande, vou colocar tudo"** | Context rot, custo, queda de precisão | Curadoria de contexto (§11) |
| **Fine-tuning como primeira opção** | Caro, lento, dívida permanente, não resolve conhecimento volátil | Prompt → RAG → ferramentas → só então treino |
| **RAG sobre base suja** | Recupera lixo com alta similaridade | Tratar a qualidade da fonte antes de vetorizar |
| **Confiar no top-k sem limiar** | Entrega trechos irrelevantes como se fossem relevantes | Limiar de similaridade + instrução para admitir ausência |
| **LLM no caminho crítico de cálculo determinístico** | Não determinismo em número auditável | Código determinístico; LLM só gera o código, não o número |
| **PR gigante gerado por agente** | Não revisável na prática | Tarefas pequenas, commits atômicos |
| **Aceitar SQL sem rodar** | Consulta válida com resultado errado | Executar contra amostra e comparar |
| **Ferramentas demais expostas ao agente** | Context confusion, escolha errada de ação | Conjunto mínimo e bem descrito |
| **Sem eval, só "parece bom"** | Regressão invisível e drift | Suíte fixa de casos reais rodando continuamente |
| **Agente com credencial de administrador** | Superfície de ataque máxima | Menor privilégio, somente leitura por padrão |
| **Tratar saída de ferramenta como confiável** | Vetor de injeção indireta | Toda saída externa é dado não confiável |
| **Medir produtividade por linhas geradas** | Incentiva volume, não valor; ignora custo de revisão | Medir tempo de ciclo, defeitos em produção, retrabalho |

### Limites reais, hoje

- **Não há garantia de correção.** Nenhum prompt elimina a possibilidade de erro; apenas a verificação externa reduz o risco.
- **Contexto organizacional tácito não está no modelo.** Por que aquela filial é excluída do relatório, quem depende daquele campo, qual acordo informal existe com o time de negócio — nada disso está em lugar nenhum que o modelo possa ler.
- **Raciocínio causal e responsabilidade continuam humanos.** O modelo correlaciona padrões; a responsabilidade por uma decisão de dados não é delegável.
- **Sistemas muito grandes ainda excedem a capacidade de contexto.** Agentes operam bem em recortes, não sobre um monolito inteiro de uma vez.
- **Avaliação continua sendo o gargalo da área.** Saber se o sistema de IA ficou melhor ou pior é mais difícil do que construí-lo.

### Fatos-chave §25

- Usar um agente autônomo onde um workflow determinístico resolveria é o antipadrão mais comum e mais caro.
- Colocar um LLM no caminho crítico de um cálculo determinístico quebra auditabilidade; o correto é a IA gerar o código e o código produzir o número.
- RAG sobre uma base de qualidade ruim recupera conteúdo ruim com alta pontuação de similaridade.
- Expor ferramentas em excesso a um agente causa confusão de contexto e escolha errada de ação.
- Medir produtividade de IA por linhas de código geradas ignora o custo de revisão e incentiva volume em vez de valor.
- O contexto organizacional tácito não está disponível ao modelo e precisa ser explicitado por humanos.
- A avaliação de sistemas de IA é hoje mais difícil do que a construção deles.

---
# Parte IV — Referência

---

## 26. Panorama de modelos (contexto volátil)

> ⚠️ **NÃO GERAR PERGUNTAS DE QUIZ A PARTIR DESTA SEÇÃO.**
> Nomes de versão, janelas de contexto, preços e posições em ranking mudam em semanas. Esta seção existe apenas para dar noção de mercado ao leitor, não para ser cobrada. Perguntas de quiz devem sair das seções conceituais e do glossário.

**Como ler o mercado, em vez de decorá-lo:**

- Há **três ou quatro famílias de fronteira** de fornecedores ocidentais (Anthropic, OpenAI, Google, xAI) e um bloco crescente de modelos de **pesos abertos** competitivos, boa parte de origem chinesa (DeepSeek, Qwen, GLM, MiniMax) e da Meta/NVIDIA.
- A distância entre o melhor modelo fechado e o melhor modelo de pesos abertos tem oscilado em meses, não em anos.
- **Janelas de contexto** convergiram para a faixa de centenas de milhares a **1 milhão de tokens** na maior parte da fronteira.
- **MoE** e arquiteturas híbridas (Transformer combinado com espaços de estado, como Mamba) tornaram-se comuns para reduzir custo de inferência.
- **Modo de raciocínio configurável** (esforço/orçamento de pensamento por chamada) virou padrão em vez de linha de produto separada.
- Preço por token caiu de forma acentuada e continuada; o custo dominante em sistemas agênticos migrou do preço unitário para o **volume de tokens consumido pelo loop**.

**Pesos abertos vs. open source.** "Open weights" significa que os pesos podem ser baixados e executados; não implica que dados de treino, código e receita sejam abertos, nem que a licença seja de fato OSI-aprovada. Muitas licenças ditas abertas contêm restrições de uso ou de porte da empresa. Rigorosamente, poucos modelos são *open source* completos.

**Critérios de escolha que envelhecem menos que rankings:** qualidade medida no **seu** eval; custo por tarefa concluída (não por token); latência aceitável para o caso; janela de contexto necessária; qualidade de tool use e comportamento agêntico; disponibilidade regional e residência de dados; política de retenção e de treino; e possibilidade de trocar de fornecedor sem reescrever o sistema.

---

## 27. Glossário

| Termo | Definição |
|---|---|
| **A2A (Agent-to-Agent)** | Protocolo de comunicação entre agentes, lançado pelo Google e doado à Linux Foundation; usa Agent Cards para descoberta |
| **Agente** | Sistema em que o LLM decide autonomamente a sequência de ações, usando ferramentas em um loop, até atingir um objetivo |
| **Agentic RAG** | RAG em que o agente decide se, o que e quantas vezes buscar, avaliando a qualidade do que recuperou |
| **Alinhamento** | Processo de ajustar o modelo a preferências e valores humanos (RLHF, RLAIF, DPO) |
| **Alucinação** | Geração de conteúdo plausível e fluente, porém factualmente incorreto, com tom de confiança |
| **ANN (Approximate Nearest Neighbor)** | Busca aproximada de vizinhos mais próximos em espaço vetorial; base dos índices HNSW e IVF |
| **Atenção (attention)** | Mecanismo que pondera a relevância de cada token em relação aos demais, com Query, Key e Value |
| **Autorregressivo** | Modelo que gera um token por vez, realimentando a própria saída |
| **Benchmark** | Teste padronizado para comparar modelos (MMLU, GPQA, SWE-bench, HumanEval) |
| **BM25** | Algoritmo clássico de busca lexical por relevância de termos |
| **Chain-of-Thought (CoT)** | Raciocínio explícito passo a passo antes da resposta final |
| **Chunking** | Divisão de documentos em trechos para indexação em RAG |
| **Compactação (compaction)** | Sumarização do histórico antigo ao se aproximar do limite de contexto |
| **Context engineering** | Disciplina de decidir qual informação entra na janela de contexto, em que forma e quando |
| **Context rot** | Degradação de desempenho conforme o contexto cresce |
| **Context poisoning** | Erro ou alucinação que entra no contexto e passa a ser tratado como fato |
| **Cross-encoder** | Modelo que avalia consulta e documento juntos; base dos rerankers |
| **Data cutoff / knowledge cutoff** | Data limite dos dados de treino do modelo |
| **Deep Learning** | Subconjunto do ML baseado em redes neurais profundas, com aprendizado de representações |
| **Decoder-only** | Arquitetura com atenção causal, usada pela maioria dos LLMs generativos |
| **Destilação** | Treinar um modelo pequeno ("aluno") para imitar as saídas de um grande ("professor") |
| **Difusão** | Família de modelos que gera imagens removendo ruído iterativamente |
| **Drift** | Degradação silenciosa da qualidade ao longo do tempo |
| **DPO (Direct Preference Optimization)** | Alinhamento otimizado diretamente sobre pares de preferência, sem modelo de recompensa separado |
| **Embedding** | Representação vetorial densa em que proximidade geométrica equivale a proximidade semântica |
| **Eval** | Conjunto de casos de teste representativos do problema real, com critérios de aceitação |
| **Few-shot** | Prompting com alguns exemplos de entrada→saída |
| **Fine-tuning** | Continuação do treino de um modelo pré-treinado com dados próprios, alterando seus pesos |
| **Function calling / tool use** | Mecanismo pelo qual o modelo solicita a execução de funções externas em formato estruturado |
| **Foundation model** | Modelo treinado em dados amplos e genéricos, projetado para adaptação a múltiplas tarefas |
| **GraphRAG** | RAG apoiado em grafo de entidades e relações, capaz de responder perguntas globais sobre a base |
| **Guardrail** | Limite rígido imposto ao agente: escopo, sandbox, permissões, teto de custo, aprovação humana |
| **Harness** | Infraestrutura de software que transforma um modelo em agente confiável: ferramentas, verificação, contexto, guardrails e observabilidade |
| **HNSW** | Índice de grafo hierárquico para busca vetorial aproximada |
| **Human-in-the-loop** | Exigência de aprovação humana em pontos definidos do fluxo |
| **In-context learning** | Aprender a tarefa a partir de exemplos no prompt, sem alterar os pesos |
| **Injeção de prompt** | Ataque que insere instruções maliciosas no conteúdo processado pelo modelo |
| **Janela de contexto** | Número máximo de tokens que o modelo considera de uma vez |
| **Jailbreak** | Contorno das políticas de segurança do modelo |
| **KV cache** | Cache de Keys e Values já calculados, que evita recomputar a atenção a cada novo token |
| **LLM** | Modelo de linguagem de grande porte, tipicamente decoder-only, treinado por previsão do próximo token |
| **LLM-as-a-judge** | Uso de um LLM para avaliar saídas de outro modelo segundo uma rubrica |
| **Logits** | Pontuações brutas por token do vocabulário, convertidas em probabilidade pela softmax |
| **LoRA** | Fine-tuning eficiente que treina matrizes de baixo posto adjacentes aos pesos congelados |
| **Lost in the middle** | Tendência do modelo a recuperar pior informações posicionadas no meio do contexto |
| **MCP (Model Context Protocol)** | Padrão aberto que conecta agentes a ferramentas, dados e prompts via JSON-RPC |
| **MoE (Mixture-of-Experts)** | Arquitetura em que um roteador ativa apenas alguns especialistas por token |
| **Multimodal** | Modelo que processa mais de um tipo de dado (texto, imagem, áudio, vídeo) |
| **Multiagente** | Sistema com vários agentes cooperando (orquestrador-trabalhadores, pipeline, debate, swarm) |
| **Observabilidade** | Telemetria e tracing de entradas, saídas e estado de cada passo do sistema de IA |
| **Parâmetros** | Pesos aprendidos do modelo; em MoE distinguem-se totais e ativos |
| **PEFT** | Conjunto de técnicas de fine-tuning que treinam poucos parâmetros adicionais com o modelo congelado |
| **Pesos abertos (open weights)** | Pesos disponíveis para download e execução, sem implicar abertura de dados, código ou licença OSI |
| **Prefill / decode** | Fases da inferência: processamento paralelo do prompt e geração sequencial de tokens |
| **Prompt caching** | Reaproveitamento do processamento de um prefixo estável do prompt entre chamadas |
| **Prompt engineering** | Prática de estruturar a instrução para obter saída confiável |
| **Quantização** | Redução da precisão numérica dos pesos para economizar memória e ganhar velocidade |
| **RAG** | Geração aumentada por recuperação: injeta trechos recuperados de uma base externa no prompt |
| **ReAct** | Padrão de agente que alterna Thought, Action e Observation |
| **Reasoning model** | Modelo treinado para gerar cadeias de raciocínio antes da resposta, gastando computação em inferência |
| **Reflexion** | Padrão em que o agente critica a própria saída e refaz o trabalho |
| **Reranker** | Modelo que reordena candidatos recuperados avaliando consulta e documento em conjunto |
| **RLHF** | Aprendizado por reforço a partir de feedback humano, via modelo de recompensa |
| **RLVR** | Aprendizado por reforço com recompensas verificáveis automaticamente |
| **RRF (Reciprocal Rank Fusion)** | Método de fusão de rankings de busca densa e esparsa |
| **Sandbox** | Ambiente isolado de execução para o agente |
| **Scaling laws** | Relação empírica entre parâmetros, dados, computação e qualidade do modelo |
| **Self-attention** | Atenção de uma sequência sobre si mesma |
| **Self-supervised** | Aprendizado em que o rótulo é gerado automaticamente da estrutura do dado |
| **SFT (Supervised Fine-Tuning)** | Ajuste supervisionado com pares instrução→resposta; transforma modelo base em modelo instruído |
| **SLM** | Modelo de linguagem pequeno (~1B–15B), executável em hardware modesto |
| **Softmax** | Função que converte logits em distribuição de probabilidade |
| **Speculative decoding** | Aceleração em que um modelo pequeno propõe tokens verificados em bloco pelo grande |
| **Structured output** | Saída forçada a obedecer a um schema, via decodificação restrita |
| **Sub-agente** | Agente com contexto próprio ao qual se delega uma subtarefa, devolvendo resultado condensado |
| **System prompt** | Instrução persistente que define papel, comportamento e regras |
| **Temperatura** | Parâmetro que escala os logits, controlando aleatoriedade da geração |
| **Test-time compute** | Computação gasta durante a inferência para melhorar a qualidade da resposta |
| **Text-to-SQL** | Conversão de pergunta em linguagem natural para consulta SQL |
| **Token** | Unidade de subpalavra processada pelo modelo; base da contagem de contexto e de cobrança |
| **Tokenizer** | Componente que converte texto em tokens (BPE, WordPiece, SentencePiece) |
| **Top-k / Top-p** | Estratégias de amostragem que restringem o conjunto de tokens candidatos |
| **Transfer learning** | Reaproveitamento de conhecimento de um modelo pré-treinado em outra tarefa |
| **Transformer** | Arquitetura baseada em atenção, apresentada em 2017 em "Attention Is All You Need" |
| **Trifeta letal** | Combinação de dados privados, conteúdo não confiável e comunicação externa em um mesmo agente |
| **VLM** | Modelo que combina visão e linguagem |
| **Vibe coding** | Prática de aceitar código gerado por IA sem revisão profunda |
| **Workflow** | Fluxo fixo definido por humanos, com chamadas de LLM em pontos específicos |
| **Zero-shot** | Prompting sem exemplos, apenas com a instrução |

---

## 28. Mitos e erros comuns

> Esta seção é a fonte preferencial de **distratores** (alternativas incorretas plausíveis). Cada item traz o erro e a correção.

**1. "O ChatGPT/Claude aprende com as minhas conversas em tempo real."**
Falso. LLMs comerciais são treinados em batch. O que parece aprendizado dentro da conversa é in-context learning, limitado à janela de contexto e descartado ao fim da sessão. Recursos de "memória" em produtos são armazenamento externo reinserido no prompt, não atualização de pesos.

**2. "Modelo maior é sempre melhor."**
Falso. Qualidade depende de dados, receita de treino e alinhamento tanto quanto de tamanho. Em tarefas estreitas, um SLM ajustado supera um modelo de fronteira genérico em custo, latência e frequentemente em acurácia. Além disso, em MoE a contagem de parâmetros totais não indica o custo real de inferência.

**3. "Alucinação é um bug que será corrigido na próxima versão."**
Falso. É consequência do funcionamento probabilístico: o modelo produz a continuação mais provável, não a verdadeira. Modelos melhores reduzem a taxa; a arquitetura do sistema (verificação, aterramento, citação) é o que a torna gerenciável.

**4. "Temperatura 0 garante a mesma resposta sempre."**
Falso. Aproxima o determinismo na escolha do token, mas paralelismo de GPU, ordem de operações de ponto flutuante, batching dinâmico e atualizações do modelo em produção introduzem variação.

**5. "Janela de contexto de 1 milhão de tokens significa que posso jogar tudo dentro."**
Falso. Há degradação documentada em contextos longos (context rot, lost in the middle), além de custo e latência crescentes. Contexto é orçamento a ser curado, não depósito.

**6. "RAG e fine-tuning são alternativas para o mesmo problema."**
Falso. RAG fornece **fatos** atualizáveis e rastreáveis; fine-tuning ensina **forma**, estilo e comportamento. Usar fine-tuning para injetar conhecimento volátil produz alucinação confiante e retreino permanente.

**7. "O LLM executa as ferramentas que eu dou a ele."**
Falso. O modelo apenas emite uma solicitação estruturada com nome e argumentos. Quem executa, autoriza e isola é a aplicação. É exatamente por isso que os controles de segurança ficam do lado da aplicação.

**8. "Agente é qualquer aplicação que usa IA."**
Falso. Agente exige que o **modelo controle o fluxo de execução**. Um fluxo fixo escrito por humanos, com chamadas de LLM em pontos específicos, é um workflow — e costuma ser a escolha certa.

**9. "Mais agentes trabalhando juntos dão sempre um resultado melhor."**
Falso. Multiagente multiplica tokens, latência e superfície de falha. Só compensa com paralelismo real ou necessidade de isolar contextos. Um agente bem instrumentado costuma vencer três mal coordenados.

**10. "Harness é só um nome bonito para o prompt do sistema."**
Falso. Harness é a camada de infraestrutura: orquestração de ferramentas, loops de verificação, contexto e memória, guardrails e observabilidade. Prompt é uma parte pequena disso.

**11. "MCP e A2A resolvem o mesmo problema."**
Falso. MCP conecta agentes a **ferramentas e dados**; A2A conecta agentes a **outros agentes**.

**12. "Benchmark alto significa que o modelo vai funcionar bem no meu caso."**
Falso. Benchmarks são triagem inicial, sujeitos a contaminação de dados e a otimização dirigida ao teste. Só um eval interno com casos reais prevê desempenho no seu problema.

**13. "Se o SQL executou sem erro, está correto."**
Falso — e é o modo de falha mais perigoso em dados. A consulta errada retorna um número, sem exceção alguma. Joins de granularidade errada duplicam silenciosamente.

**14. "Chunks menores sempre melhoram a recuperação."**
Falso. Chunk pequeno demais perde contexto e gera trechos ininteligíveis isoladamente; grande demais dilui o sinal do embedding. É um trade-off a ser calibrado com eval.

**15. "Posso trocar o modelo de embedding e manter o índice."**
Falso. Embeddings de modelos diferentes vivem em espaços vetoriais distintos e não são comparáveis. Trocar o modelo obriga a reindexar toda a base.

**16. "Se o RAG não recuperou a informação certa, preciso de um LLM melhor."**
Falso. Se o trecho correto não foi recuperado, o problema está em chunking, embedding, busca ou na qualidade da fonte. Trocar o gerador não corrige a recuperação.

**17. "Injeção de prompt só acontece se o usuário for malicioso."**
Falso. A injeção **indireta** vem de dados que o agente lê: comentário de código, descrição de ticket, célula de planilha, página web, campo de texto de uma tabela. O usuário pode ser inteiramente bem-intencionado.

**18. "IA generativa substitui modelos de ML tradicionais."**
Falso. Para previsão e classificação sobre dados tabulares, gradient boosting e afins continuam superiores em acurácia, custo, latência e explicabilidade. GenAI é a ferramenta para dados não estruturados, geração e interface em linguagem natural.

**19. "In-context learning é um tipo de treinamento."**
Falso. Não há atualização de pesos. O efeito é inteiramente dependente do que está na janela de contexto naquele momento.

**20. "Modelo de raciocínio é sempre a escolha mais segura."**
Falso. Em tarefas simples e de alto volume, custa mais, demora mais e pode piorar o resultado por overthinking. Escolher o modelo é uma decisão de custo-benefício por tarefa.

**21. "Open weights é a mesma coisa que open source."**
Falso. Pesos disponíveis para download não implicam abertura de dados de treino, código ou licença aprovada pela OSI; muitas licenças ditas abertas têm restrições de uso.

**22. "Mais ferramentas disponíveis tornam o agente mais capaz."**
Falso. Ferramentas em excesso ou sobrepostas causam confusão de contexto e degradam a acurácia de seleção. Conjunto mínimo e bem descrito vence.

**23. "O ganho de produtividade com IA se mede em linhas de código geradas."**
Falso. Essa métrica ignora o custo de revisão e o retrabalho. O gargalo se deslocou para a revisão e a integração; as métricas úteis são tempo de ciclo, defeitos em produção e retrabalho.

**24. "Um agente com acesso de administrador é mais útil."**
Falso e perigoso. O princípio do menor privilégio vale integralmente: um agente nunca deve ter permissões maiores que as do usuário que o acionou, e ambientes de dados devem ser somente leitura por padrão.

**25. "Fine-tuning é o caminho natural quando o modelo erra."**
Falso na maioria dos casos. A ordem recomendada é prompt e formato → contexto e RAG → ferramentas → só então fine-tuning → e, por último, modelo maior.

---

## 29. Fontes e leitura adicional

Material de fundamentação consultado na elaboração desta apostila:

- [Harness Engineering: A Guide to AI Coding Agents — Faros AI](https://www.faros.ai/blog/harness-engineering)
- [Harness Engineering for Agentic AI Coding Tools: An Exploratory Study — arXiv](https://arxiv.org/html/2602.14690v5)
- [Awesome Harness Engineering — GitHub](https://github.com/ai-boost/awesome-harness-engineering)
- [The State of Agentic AI Standards in 2026: MCP, A2A, WebMCP, OSI](https://datalakehousehub.com/blog/state-of-agentic-ai-standards-2026/)
- [A Survey of Agent Interoperability Protocols (MCP, ACP, A2A, ANP) — arXiv](https://arxiv.org/html/2505.02279v1)
- [Context Engineering: A Practical Guide for AI Agents — Sourcegraph](https://sourcegraph.com/blog/context-engineering)
- [Context engineering for AI agents: write, select, compress, isolate — Reactify Solutions](https://www.reactify-solutions.com/articles/context-engineering-ai-agents-2026)
- [Advanced RAG Patterns: failure modes, hybrid search, reranking, GraphRAG, Agentic RAG](https://www.teacherandtask.com/blog/advanced-rag-patterns-2026-production-engineering-guide)
- [20 Advanced RAG Types to Know — Turing Post](https://www.turingpost.com/p/ragtypes)
- [Introduction to Small Language Models: The Complete Guide — Machine Learning Mastery](https://machinelearningmastery.com/introduction-to-small-language-models-the-complete-guide-for-2026/)
- [Small Language Models & On-Device AI](https://techjacksolutions.com/ai-knowledge-hub/small-language-models/)
- [AI Agents for Data Engineering: Reliability Guide — Atlan](https://atlan.com/know/ai-agents-for-data-engineering/)
- [Data Engineering Trends for AI-Driven Enterprises — Trigyn](https://www.trigyn.com/insights/data-engineering-trends-2026-building-foundation-ai-driven-enterprises)
- [Top Large Language Models — Shakudo](https://www.shakudo.io/blog/top-9-large-language-models)
- [AI Leaderboard — llm-stats](https://llm-stats.com/)

Leituras clássicas recomendadas: *Attention Is All You Need* (Vaswani et al., 2017), o artigo de escala Chinchilla (Hoffmann et al., 2022), o artigo original de RAG (Lewis et al., 2020) e o artigo de ReAct (Yao et al., 2022).

---

**Fim da apostila.**

*Documento preparado como material de estudo para geração automática de perguntas. Seções 1 a 25, 27 e 28 são elegíveis para o quiz; a seção 26 é somente leitura de contexto.*
