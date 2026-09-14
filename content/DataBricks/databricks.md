# Databricks — Apostila Completa da Plataforma, Metodologias e Boas Práticas

> **Propósito deste documento.** Material de estudo consolidado sobre a plataforma Databricks, destinado a alimentar a geração automática de perguntas de múltipla escolha. Cada seção traz conceitos, comparações em tabela, números/defaults verificáveis e um bloco final de **Fatos verificáveis** — afirmações curtas, autocontidas e não ambíguas, ideais para virar questão.
>
> **Data de referência do conteúdo:** setembro de 2026. A Databricks renomeia produtos com frequência; sempre que houver nome antigo relevante, ele aparece entre parênteses como *(ex-…)*.
>
> **Escopo:** plataforma (arquitetura, compute, governança), engenharia de dados (Delta, ingestão, pipelines, orquestração), analytics (Databricks SQL), IA/ML (MLflow, Mosaic AI), engenharia de software (notebooks, Git, bundles, CI/CD), segurança, performance e custos.

---

## Índice

1. [Visão geral: o que é Databricks e o que é um Lakehouse](#1-visão-geral-o-que-é-databricks-e-o-que-é-um-lakehouse)
2. [Arquitetura da plataforma](#2-arquitetura-da-plataforma)
3. [Compute: clusters, serverless e SQL warehouses](#3-compute-clusters-serverless-e-sql-warehouses)
4. [Apache Spark no Databricks](#4-apache-spark-no-databricks)
5. [Delta Lake](#5-delta-lake)
6. [Unity Catalog: governança e modelo de objetos](#6-unity-catalog-governança-e-modelo-de-objetos)
7. [Ingestão de dados](#7-ingestão-de-dados)
8. [Lakeflow Declarative Pipelines (ex-Delta Live Tables)](#8-lakeflow-declarative-pipelines-ex-delta-live-tables)
9. [Arquitetura Medallion e modelagem do Lakehouse](#9-arquitetura-medallion-e-modelagem-do-lakehouse)
10. [Orquestração: Lakeflow Jobs (ex-Workflows)](#10-orquestração-lakeflow-jobs-ex-workflows)
11. [Databricks SQL, AI/BI e Genie](#11-databricks-sql-aibi-e-genie)
12. [Machine Learning e IA Generativa](#12-machine-learning-e-ia-generativa)
13. [Desenvolvimento, Git e CI/CD](#13-desenvolvimento-git-e-cicd)
14. [Segurança, identidade e compliance](#14-segurança-identidade-e-compliance)
15. [Performance: otimização de consultas e layout de dados](#15-performance-otimização-de-consultas-e-layout-de-dados)
16. [Gestão de custos (FinOps no Databricks)](#16-gestão-de-custos-finops-no-databricks)
17. [Boas práticas consolidadas por área](#17-boas-práticas-consolidadas-por-área)
18. [Certificações, comparativos e glossário](#18-certificações-comparativos-e-glossário)

---

## 1. Visão geral: o que é Databricks e o que é um Lakehouse

### 1.1 Origem e posicionamento

A Databricks foi fundada pelos criadores do Apache Spark, projeto nascido no AMPLab da UC Berkeley. A empresa comercializa uma plataforma unificada de dados e IA, executada como serviço gerenciado sobre as três grandes nuvens públicas: **AWS, Microsoft Azure e Google Cloud**. No Azure, o produto é ofertado como serviço de primeira parte da Microsoft, chamado **Azure Databricks**.

Além do Spark, a Databricks criou ou doou à Linux Foundation vários projetos open source que sustentam a plataforma: **Delta Lake** (camada de armazenamento transacional), **MLflow** (ciclo de vida de ML e IA), **Unity Catalog** (governança, hoje também open source no GitHub), **Delta Sharing / OpenSharing** (protocolo aberto de compartilhamento) e **Spark Declarative Pipelines** (base declarativa de pipelines doada ao Apache Spark).

O posicionamento comercial atual é o de **Data Intelligence Platform**: a plataforma Lakehouse acrescida de uma camada de inteligência (modelos de IA que entendem a semântica dos dados da organização) que alimenta recursos como o assistente de código, a busca em linguagem natural e a otimização automática.

### 1.2 O problema que o Lakehouse resolve

| Arquitetura | Pontos fortes | Limitações históricas |
|---|---|---|
| **Data Warehouse** | BI maduro, SQL performático, dados limpos e governados, transações ACID | Formatos proprietários, custo alto, suporte fraco a dados não estruturados e a ML, acoplamento entre storage e compute |
| **Data Lake** | Armazenamento barato e escalável, formatos abertos, qualquer tipo de dado, bom para ML | Sem transações ACID, sem enforcement de schema, qualidade duvidosa ("data swamp"), BI lento e pouco confiável |
| **Data Lakehouse** | Formatos abertos sobre object storage + transações ACID + governança unificada + BI e ML sobre **uma única cópia** dos dados | Exige camada de metadados e transação (Delta/Iceberg) e catálogo unificado |

A definição da documentação é direta: o lakehouse *"combina os benefícios de data lakes e data warehouses"*, oferecendo *"acesso aberto e direto aos dados armazenados em formatos padrão"* junto de *"baixa latência de consulta e alta confiabilidade para BI e analytics avançado"*.

### 1.3 Como o Databricks implementa o Lakehouse

Três peças sustentam a implementação:

1. **Apache Spark** — motor de processamento distribuído que executa nos clusters e nos SQL warehouses.
2. **Delta Lake** — camada de armazenamento otimizada que adiciona ACID, versionamento e enforcement de schema sobre arquivos Parquet no object storage.
3. **Unity Catalog** — camada de governança unificada com controle de acesso fino, linhagem, auditoria e descoberta para dados **e** ativos de IA.

Um quarto elemento cada vez mais relevante é o **Photon**, motor vetorizado escrito em C++ que executa SQL e operações de DataFrame com desempenho muito superior ao do runtime JVM padrão, sem exigir mudança de código.

### 1.4 Mapa dos produtos da plataforma

| Área | Produto | Para que serve |
|---|---|---|
| Engenharia de dados | **Lakeflow** (guarda-chuva) | Ingestão, transformação e orquestração |
| — Ingestão | Lakeflow Connect, Auto Loader, COPY INTO | Trazer dados de SaaS, bancos, filas e object storage |
| — Transformação | Lakeflow Declarative Pipelines *(ex-Delta Live Tables / DLT)* | Pipelines declarativos em SQL/Python |
| — Orquestração | Lakeflow Jobs *(ex-Workflows / Jobs)* | Agendamento, DAG de tarefas, triggers |
| Armazenamento | Delta Lake, Apache Iceberg (managed), UniForm | Tabelas transacionais em formato aberto |
| Governança | Unity Catalog, OpenSharing *(Delta Sharing)*, Clean Rooms, Marketplace | Permissões, linhagem, auditoria, compartilhamento |
| Analytics | Databricks SQL, AI/BI Dashboards, AI/BI Genie, Alerts | SQL, dashboards e perguntas em linguagem natural |
| IA/ML | Mosaic AI (Model Serving, Vector Search/AI Search, Agent Framework), MLflow, AutoML, Feature Store | Ciclo completo de ML e GenAI |
| Aplicações | Databricks Apps, Lakebase | Hospedar apps de dados; banco transacional Postgres gerenciado |
| Desenvolvimento | Notebooks, Git folders, CLI, SDKs, Bundles, Databricks Connect | Engenharia de software sobre a plataforma |

> **Atenção à nomenclatura (frequente em prova).** *Delta Live Tables* virou **Lakeflow Declarative Pipelines**; *Workflows/Jobs* virou **Lakeflow Jobs**; *Databricks Asset Bundles (DABs)* aparece na documentação recente como **Declarative Automation Bundles**; *Repos* virou **Git folders**; *Delta Sharing* aparece como **OpenSharing**; *Mosaic AI Vector Search* aparece como **AI Search**. Os nomes antigos ainda circulam amplamente na comunidade e em materiais de certificação.

### 1.5 Fatos verificáveis — Seção 1

- Databricks foi criada pelos autores do Apache Spark, originado no AMPLab da UC Berkeley.
- A plataforma está disponível em AWS, Azure e Google Cloud; no Azure é um serviço de primeira parte chamado Azure Databricks.
- Delta Lake, MLflow, Unity Catalog e Delta Sharing são projetos open source criados pela Databricks.
- Os três pilares técnicos do lakehouse no Databricks são Apache Spark (processamento), Delta Lake (armazenamento) e Unity Catalog (governança).
- Photon é o motor de consulta vetorizado nativo, escrito em C++, e não exige alteração de código para ser usado.
- O nome comercial atual da oferta é "Data Intelligence Platform".
- Delta Live Tables passou a se chamar Lakeflow Declarative Pipelines.
- Databricks Repos passou a se chamar Databricks Git folders.

---

## 2. Arquitetura da plataforma

### 2.1 Control plane e compute plane

A arquitetura se divide em dois planos, e entender essa separação é pré-requisito para tudo o mais (rede, segurança, custo).

| Plano | Onde fica | O que contém |
|---|---|---|
| **Control plane** | Conta da **Databricks** | Aplicação web (UI), APIs REST, gerenciamento e agendamento de jobs, serviço de notebooks, configuração de compute, controle de acesso, catálogo de metadados |
| **Compute plane clássico** | Conta de nuvem do **cliente** | Clusters e SQL warehouses clássicos rodando na VPC/VNet do cliente; dados são processados aqui |
| **Compute plane serverless** | Conta da **Databricks** | Compute efêmero gerenciado, provisionado sob demanda em rede isolada por cliente |

Os **dados do cliente sempre residem na conta de nuvem do cliente** (buckets S3/ADLS/GCS), independentemente do plano de compute — o control plane guarda metadados, não os dados das tabelas.

### 2.2 Conta, workspace e metastore

```
Account (conta Databricks, por nuvem)
 ├── Identidades: usuários, grupos, service principals (SCIM, SSO)
 ├── Metastore do Unity Catalog (normalmente 1 por região)
 │    └── Catalog → Schema → Table / View / Volume / Function / Model
 └── Workspaces (N, por região)
      ├── Notebooks, queries, dashboards, Git folders, jobs, pipelines
      └── Compute: clusters, SQL warehouses, pools
```

- **Account (conta)**: nível mais alto. Administra identidades, criação de workspaces, metastores do Unity Catalog, faturamento e compliance. Administradores desse nível são os *account admins*.
- **Workspace**: ambiente colaborativo onde o trabalho acontece — *"onde usuários executam cargas de compute como ingestão, exploração interativa, jobs agendados e treinamento de ML"*. É uma unidade de isolamento e está vinculado a uma região.
- **Metastore do Unity Catalog**: contêiner de governança de nível superior. Um metastore pode ser compartilhado por vários workspaces da mesma região, o que permite descoberta e permissão consistentes entre ambientes.

### 2.3 Namespace de três níveis

Todo objeto de dados no Unity Catalog é endereçado por três partes:

```
<catalog>.<schema>.<objeto>
-- exemplo
SELECT * FROM prod.vendas.pedidos;
```

Esse é um dos contrastes mais cobrados em relação ao **Hive metastore** legado, que usava apenas dois níveis (`schema.tabela`, com o catálogo implícito `hive_metastore`).

### 2.4 Armazenamento do workspace

O workspace guarda duas categorias de artefatos:

| Categoria | Conteúdo |
|---|---|
| **Workspace file system data** | Notebooks, queries, dashboards, Git folders, bibliotecas, arquivos de workspace |
| **Workspace system data** | Resultados de consultas, histórico de execuções de jobs, logs de cluster |

Historicamente havia também o **DBFS (Databricks File System)** com o *DBFS root* e *mounts*. A orientação atual é **evitar DBFS e mounts** e usar **Volumes do Unity Catalog** para dados não tabulares, porque mounts não respeitam a governança do UC.

### 2.5 Regiões, planos e habilitação

- O Unity Catalog é **habilitado automaticamente em workspaces criados após 8 de novembro de 2023**.
- Recursos como predictive optimization e compute serverless dependem de **plano Premium ou superior** e de região suportada.
- Há perfis de compliance específicos (HIPAA, PCI-DSS, FedRAMP) e suporte a **AWS GovCloud (FedRAMP High)**.

### 2.6 Fatos verificáveis — Seção 2

- O control plane roda na conta da Databricks; o compute plane clássico roda na conta de nuvem do cliente.
- Compute serverless roda na conta da Databricks, em ambiente gerenciado e isolado por cliente.
- Dados de tabelas residem sempre no object storage da conta do cliente.
- O nível "account" gerencia identidades, workspaces, metastores e faturamento.
- Um workspace é uma unidade regional de colaboração; um metastore do Unity Catalog é tipicamente um por região e pode servir vários workspaces.
- O namespace do Unity Catalog tem três níveis: `catalog.schema.objeto`.
- O Hive metastore legado usa dois níveis e é acessível pelo catálogo `hive_metastore`.
- Unity Catalog é habilitado automaticamente para workspaces criados após 8 de novembro de 2023.
- Databricks recomenda Volumes do Unity Catalog em vez de mounts do DBFS.

---

## 3. Compute: clusters, serverless e SQL warehouses

### 3.1 Panorama dos tipos de compute

| Tipo | Uso típico | Quem provisiona | Observação de custo |
|---|---|---|---|
| **All-purpose compute** (interativo) | Notebooks, exploração, desenvolvimento colaborativo | Usuário, persistente até auto-termination | SKU mais caro por DBU |
| **Jobs compute** (job cluster) | Execução agendada/automatizada de jobs | Criado pelo job, destruído ao final | SKU significativamente mais barato |
| **Serverless compute** (notebooks, jobs, pipelines) | Qualquer um dos acima, sem gerenciar infraestrutura | Databricks | Sem tempo ocioso pago; startup quase instantâneo |
| **SQL warehouse** | SQL, BI, dashboards | Usuário/admin | Serverless, Pro ou Classic |
| **Instance pool** | Reduzir tempo de partida de clusters | Admin | Instâncias ociosas no pool **não** cobram DBU |

> **Boa prática clássica e muito cobrada:** *nunca* rode jobs de produção em all-purpose compute. Jobs compute custa menos e isola execuções. A documentação afirma que *"cargas não interativas custarão significativamente menos em jobs compute do que em all-purpose compute"*.

### 3.2 Anatomia de um cluster clássico

- Um cluster é composto por **um driver node** e **zero ou mais worker nodes**.
- O **driver** mantém o estado do notebook, o `SparkContext`/`SparkSession`, interpreta comandos e distribui tarefas.
- Os **workers** hospedam os executores Spark que efetivamente processam as partições.
- Cada worker recebe **dois endereços IP privados**: um para tráfego da Databricks e outro para comunicação Spark.
- **Single node**: cria driver sem workers; o Spark roda localmente com *"uma thread de executor por core lógico, menos 1 core para o driver"*. Um cluster single node **não pode ser convertido em multi-node** depois de criado.

### 3.3 Modos de acesso (access modes)

A nomenclatura mudou; conheça as duas gerações:

| Nome atual | Nome anterior | Características |
|---|---|---|
| **Standard** | Shared | Multiusuário com isolamento de dados entre usuários (protegido pelo **Lakeguard**). Suporta Python, SQL e Scala. |
| **Dedicated** | Single user | Atribuído a **um usuário ou um grupo**. Suporta Python, SQL, Scala e **R**. Necessário para ML Runtime, GPU e recursos como RDDs. |
| No isolation shared / None | — | Legado, sem Unity Catalog; desencorajado |

A opção **"Auto"** seleciona Standard, exceto quando se escolhe ML Runtime, GPU ou DBR anterior à 14.3, casos em que cai para Dedicated.

### 3.4 Autoscaling

- Exige definir **mínimo e máximo de workers**.
- Workspaces **Premium** usam *optimized autoscaling*, que escala *"de min a max em no máximo 2 eventos de escala"*; workspaces do plano Standard usam escala exponencial.
- **Não** habilite o Dynamic Allocation do Spark junto com o autoscaling do Databricks: decisões conflitantes causam *executor churn* e erros `NODES_LOST`.
- Autoscaling reduz custo porque remove workers ociosos nas fases leves do job.

### 3.5 Auto-termination, pools e políticas

- **Auto-termination**: encerra o cluster após N minutos de inatividade. Recomendação de custo: no mínimo ~1 hora para clusters interativos, valores menores em dev.
- **Instance pools**: conjunto de instâncias pré-aquecidas e ociosas que reduzem o tempo de partida e de escala. **Instâncias ociosas no pool não geram cobrança de DBU** (mas geram custo de VM na nuvem).
- **Compute policies (políticas de cluster)**: restringem opções de configuração por usuário/grupo — forçam auto-termination, limitam tipos de VM caros, obrigam tags, impõem política de spot. É o principal instrumento de governança de custo em compute.

### 3.6 Spot instances e tags

- Spot reduz custo aproveitando capacidade ociosa da nuvem, ao preço do risco de revogação.
- **A primeira instância é sempre on-demand — o driver nunca vai para spot.** Perder o driver mataria o cluster inteiro.
- **Tags** aplicadas ao cluster propagam para os recursos de nuvem e para os logs de uso, viabilizando chargeback.

### 3.7 Databricks Runtime (DBR)

O DBR é a imagem que roda nos nós: Spark + Delta + bibliotecas + otimizações proprietárias.

| Versão | LTS? | Apache Spark | Lançamento | Fim de suporte |
|---|---|---|---|---|
| 19 | Não | 4.2.0 | jun/2026 | definido na transição para LTS |
| 18 | **Sim** | 4.1.0 | jun/2026 | jun/2029 |
| 17.3 | **Sim** | 4.0.0 | out/2025 | out/2028 |
| 16.4 | **Sim** | 3.5.2 | mai/2025 | mai/2028 |
| 15.4 | **Sim** | 3.5.0 | ago/2024 | ago/2027 |
| 14.3 | **Sim** | 3.5.0 | fev/2024 | fev/2027 |

- Versões **LTS (Long Term Support)** recebem suporte por aproximadamente **3 anos**.
- Variantes: **DBR padrão**, **DBR for Machine Learning** (traz MLflow, Feature Engineering, scikit-learn, XGBoost, PyTorch, TensorFlow) e imagens com **Photon**.
- Recomendação oficial: versão **atual** para all-purpose/desenvolvimento; versão **LTS** para jobs de produção; **ML Runtime** para ciência de dados.
- **Photon está habilitado por padrão em DBR 9.1 LTS e superior** (nos contextos em que se aplica).

### 3.8 SQL Warehouses

Compute otimizado para SQL, BI e dashboards. Existem três tipos:

| Recurso | Serverless | Pro | Classic |
|---|:--:|:--:|:--:|
| Photon | ✅ | ✅ | ✅ |
| Predictive I/O | ✅ | ✅ | ❌ |
| Intelligent Workload Management | ✅ | ❌ | ❌ |
| Onde roda o compute | Conta Databricks | Conta do cliente | Conta do cliente |
| Tempo de partida típico | **2 a 6 segundos** | ~4 minutos | ~4 minutos |
| Elasticidade | Rápida para cima e para baixo | Menor | Menor |

**Configuração de um SQL warehouse:**

| Parâmetro | Valor |
|---|---|
| Tamanho do cluster | T-shirt sizes de **2X-Small** a **4X-Large**; padrão **X-Large** |
| Auto stop — Serverless | Padrão **10 minutos**; mínimo 5 minutos pela UI |
| Auto stop — Pro/Classic | Padrão **45 minutos**; mínimo 10 minutos |
| Scaling | Mínimo e máximo de clusters; padrão **1 e 1** |
| Regra de dimensionamento | *"Um cluster para cada 10 consultas simultâneas"* |
| Channel | **Current** (estável) ou **Preview** (testar novidades) |
| Unity Catalog | Se o workspace tem UC habilitado, é o padrão para novos warehouses |
| Tags | Para monitoramento de custo |

**Quando usar cada tipo:** serverless para a maioria dos casos (ETL, BI, exploração com demanda variável); Pro quando serverless não está disponível na região ou há necessidade de rede customizada/federação; Classic como opção de entrada para exploração interativa.

### 3.9 Portas reservadas no driver

O driver reserva 16 portas que não podem ser usadas por serviços customizados: 1023, 6059–6062, 7071, 7077, 10000, 15001–15002, 36423, 38841, 39909, 40000–40001, 41063.

### 3.10 Fatos verificáveis — Seção 3

- Jobs compute custa significativamente menos que all-purpose compute para cargas não interativas.
- Um cluster tem um driver e zero ou mais workers; single node roda executores no próprio driver.
- Um cluster single node não pode ser convertido em multi-node após a criação.
- O modo de acesso "Standard" substituiu "Shared"; "Dedicated" substituiu "Single user".
- Apenas o modo Dedicated suporta R; o modo Standard suporta Python, SQL e Scala.
- Lakeguard é o mecanismo que provê isolamento entre usuários no modo Standard.
- Não se deve habilitar o Dynamic Allocation do Spark junto com o autoscaling do Databricks (risco de `NODES_LOST`).
- Optimized autoscaling (Premium) escala de mínimo a máximo em no máximo 2 eventos.
- O driver nunca é provisionado como instância spot; a primeira instância é sempre on-demand.
- Instâncias ociosas em um instance pool não geram cobrança de DBU.
- Versões LTS do Databricks Runtime têm suporte por cerca de 3 anos.
- DBR 15.4 LTS traz Apache Spark 3.5.0; DBR 17.3 LTS traz Apache Spark 4.0.0.
- Photon é habilitado por padrão a partir do DBR 9.1 LTS.
- SQL warehouse serverless inicia em 2 a 6 segundos; Pro e Classic levam cerca de 4 minutos.
- Intelligent Workload Management existe apenas no SQL warehouse serverless.
- Predictive I/O existe em Serverless e Pro, mas não em Classic.
- Auto stop padrão: 10 minutos no serverless, 45 minutos em Pro/Classic.
- O tamanho padrão de um SQL warehouse é X-Large e a escala padrão é 1 cluster mínimo e 1 máximo.
- A recomendação é um cluster de SQL warehouse para cada 10 consultas concorrentes.
- Compute policies são o instrumento para forçar auto-termination, tags e limites de VM.

---

## 4. Apache Spark no Databricks

### 4.1 Relação entre Spark e Databricks

*"Apache Spark é a tecnologia que alimenta os clusters de compute e os SQL warehouses no Databricks."* A plataforma acrescenta ao Spark open source: Photon, disk cache, Predictive I/O, otimizações de Delta, gerenciamento de cluster, Spark UI integrada, governança via UC e o ambiente colaborativo.

### 4.2 APIs e linguagens

| API | Linguagem | Observação |
|---|---|---|
| PySpark | Python | API mais usada na plataforma |
| Spark SQL | SQL | Interface declarativa; mesma engine |
| Scala | Scala | API nativa do Spark |
| SparkR / sparklyr | R | Requer modo de acesso Dedicated |
| Pandas API on Spark | Python | Sintaxe pandas distribuída |
| MLlib | Python/Scala | ML distribuído |
| Structured Streaming | Todas | Processamento quase em tempo real |

**Spark Connect** é a arquitetura cliente-servidor desacoplada (base do Databricks Connect e do compute serverless). Ele tem diferenças de comportamento em relação ao Spark clássico, especialmente em **execução e análise** — por exemplo, o plano é analisado no servidor e algumas APIs internas (como acesso direto a `SparkContext` e RDDs) não estão disponíveis.

### 4.3 Conceitos fundamentais

**Abstrações de dados, em ordem histórica:**

| Abstração | Tipagem | Otimizada pelo Catalyst | Situação |
|---|---|---|---|
| **RDD** (Resilient Distributed Dataset) | Sem schema | Não | API de baixo nível, legada; evitar |
| **DataFrame** | Schema, não tipado em compile-time | **Sim** | API recomendada |
| **Dataset** | Tipado (JVM: Scala/Java) | Sim | Não existe em Python |

**Avaliação preguiçosa (lazy evaluation).** Transformações constroem um plano lógico e **não executam nada**; só uma **ação** dispara a execução. Isso permite que o otimizador (Catalyst) reorganize o plano inteiro antes de rodar.

| Categoria | Exemplos | Dispara execução? |
|---|---|---|
| **Transformações narrow** | `select`, `filter`, `withColumn`, `drop`, `union` | Não — sem shuffle |
| **Transformações wide** | `groupBy`, `join`, `distinct`, `orderBy`, `repartition` | Não — mas exigem **shuffle** |
| **Ações** | `count`, `collect`, `show`, `take`, `write`, `save`, `foreach` | **Sim** |

**Hierarquia de execução:**

```
Application → Job (1 por ação) → Stage (fronteira = shuffle) → Task (1 por partição)
```

Uma **task** é a menor unidade de trabalho e processa **uma partição** em **um core**. O número de tasks em paralelo é limitado pelo total de cores dos executores.

**Shuffle** é a redistribuição de dados entre executores, exigida por operações wide. É a operação mais cara (rede + disco) e a principal causa de lentidão. Reduzir shuffle é o objetivo central da maior parte das otimizações.

**Data skew** ocorre quando poucas partições concentram muitos registros: a stage termina no ritmo da task mais lenta. Mitigações: AQE (skew join optimization), salting da chave, broadcast join.

**Broadcast join**: quando um dos lados do join é pequeno o suficiente, o Spark envia uma cópia integral dele para todos os executores e elimina o shuffle. O limite é controlado por `spark.sql.autoBroadcastJoinThreshold` (padrão 10 MB no Spark OSS); pode-se forçar com a dica `/*+ BROADCAST(t) */`.

### 4.4 UDFs — e por que evitá-las

A documentação recomenda **usar operações nativas do Spark em vez de UDFs em Python ou Scala**, porque UDFs impõem overhead de serialização e são opacas ao Catalyst (não sofrem pushdown nem otimização). Quando uma função customizada é inevitável, prefira **Pandas UDFs (vectorized UDFs)**, que usam Apache Arrow para transferência em lote e são substancialmente mais rápidas que UDFs linha a linha.

Ordem de preferência: **função nativa SQL/DataFrame → higher-order function → Pandas UDF → UDF Python**.

### 4.5 Fatos verificáveis — Seção 4

- Spark é o motor por trás dos clusters e SQL warehouses do Databricks.
- Transformações são preguiçosas; apenas ações disparam a execução.
- `count`, `collect`, `show`, `take` e `write` são ações; `select`, `filter` e `groupBy` são transformações.
- Transformações narrow não exigem shuffle; transformações wide exigem.
- Um job Spark é criado por ação; stages são separados por fronteiras de shuffle; uma task processa uma partição.
- Datasets tipados não existem na API Python.
- DataFrames são otimizados pelo Catalyst; RDDs não são.
- Shuffle é a operação mais cara e deve ser minimizada.
- Broadcast join elimina o shuffle ao replicar a tabela menor em todos os executores.
- Databricks recomenda evitar UDFs Python/Scala e preferir funções nativas ou Pandas UDFs.
- Pandas UDFs usam Apache Arrow para transferência eficiente de dados.
- Spark Connect tem diferenças de execução e análise em relação ao Spark clássico.
---

## 5. Delta Lake

### 5.1 O que é

Delta Lake é *"a camada de armazenamento otimizada que fornece a fundação para tabelas em um lakehouse no Databricks"*. Ele *"estende arquivos de dados Parquet com um log de transações baseado em arquivos, para transações ACID e tratamento escalável de metadados"*.

**Fato central:** no Databricks, **todas as tabelas são Delta Lake por padrão** — não é preciso configuração especial. Um `CREATE TABLE` sem cláusula `USING` cria uma tabela Delta.

### 5.2 Anatomia física de uma tabela Delta

```
/caminho/da/tabela/
├── part-0000-....snappy.parquet      ← dados (Parquet)
├── part-0001-....snappy.parquet
└── _delta_log/                        ← transaction log
    ├── 00000000000000000000.json      ← commit 0
    ├── 00000000000000000001.json      ← commit 1
    ├── ...
    ├── 00000000000000000010.checkpoint.parquet   ← checkpoint a cada 10 commits
    └── _last_checkpoint
```

O **transaction log (`_delta_log`)** é a fonte única da verdade: cada commit é um arquivo JSON com as ações atômicas (add file, remove file, metadata, protocol). A cada 10 commits o Delta escreve um **checkpoint** em Parquet, para que leitores não precisem reprocessar todo o histórico. A concorrência usa **controle otimista** (optimistic concurrency control): escritores leem a versão atual, escrevem e tentam commitar; em conflito, tentam de novo.

### 5.3 Garantias ACID

| Propriedade | Como o Delta entrega |
|---|---|
| **Atomicidade** | O commit no log é atômico: ou o arquivo JSON aparece inteiro, ou não aparece |
| **Consistência** | Schema enforcement e constraints validam a escrita |
| **Isolamento** | Snapshot isolation via versionamento; escritores usam concorrência otimista |
| **Durabilidade** | Dados e log persistidos em object storage |

Leitores nunca veem escritas parciais: uma consulta sempre lê um **snapshot consistente** de uma versão específica.

### 5.4 Time travel

O versionamento permite consultar o passado:

```sql
-- por versão
SELECT * FROM vendas VERSION AS OF 42;
SELECT * FROM vendas@v42;

-- por timestamp
SELECT * FROM vendas TIMESTAMP AS OF '2026-09-01T00:00:00';

-- histórico de modificações
DESCRIBE HISTORY vendas;

-- reverter
RESTORE TABLE vendas TO VERSION AS OF 42;
```

Casos de uso: auditoria, reprodutibilidade de experimentos de ML, rollback após carga errada, comparação entre versões. **Limitação importante:** a capacidade de consultar versões antigas depende da retenção de arquivos — após `VACUUM`, versões anteriores ao período de retenção deixam de ser consultáveis.

### 5.5 Schema enforcement e schema evolution

- **Schema enforcement (schema on write)**: o Delta rejeita escritas cujo schema não bate com o da tabela. É o que impede a degradação silenciosa da qualidade.
- **Schema evolution**: permite *"atualizar o schema da tabela sem reescrever os dados"*. Ativa-se por opção na escrita (`.option("mergeSchema", "true")`) ou por configuração da sessão; em `MERGE`, usa-se `withSchemaEvolution()` / `spark.databricks.delta.schema.autoMerge.enabled`.
- **Column mapping**: permite **renomear ou excluir colunas sem reescrever os dados**, mapeando nomes lógicos para IDs físicos no Parquet.
- **Constraints**: `NOT NULL` e `CHECK` são validadas na escrita; chaves primárias/estrangeiras existem como **constraints informativas** (não impostas pelo motor, mas úteis ao otimizador e às ferramentas de BI).

```sql
ALTER TABLE pedidos ADD CONSTRAINT valor_positivo CHECK (valor > 0);
```

### 5.6 DML e MERGE

Delta suporta `INSERT`, `UPDATE`, `DELETE` e `MERGE INTO` — algo que o Parquet puro não oferece. O `MERGE` é o padrão de **upsert** e de aplicação de CDC:

```sql
MERGE INTO alvo t
USING fonte s
ON t.id = s.id
WHEN MATCHED AND s.op = 'D' THEN DELETE
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
WHEN NOT MATCHED BY SOURCE THEN DELETE;
```

**Low shuffle merge** (padrão a partir do DBR 10.4 LTS) *"reduz o número de arquivos reescritos por operações MERGE e diminui a necessidade de re-executar OPTIMIZE após merges"*.

### 5.7 Otimização de layout de arquivos

#### OPTIMIZE

Compacta arquivos pequenos em arquivos maiores (~1 GB alvo), reduzindo o *small files problem*.

```sql
OPTIMIZE vendas;
OPTIMIZE vendas WHERE data >= '2026-01-01';
```

#### Z-ORDER (legado para novas tabelas)

Técnica de colocalização multidimensional que agrupa fisicamente linhas com valores semelhantes nas colunas escolhidas, potencializando o data skipping.

```sql
OPTIMIZE vendas ZORDER BY (cliente_id, produto_id);
```

#### Liquid Clustering (recomendado hoje)

*"Técnica de otimização de layout de dados que substitui o particionamento de tabela e o ZORDER."*

| Aspecto | Detalhe |
|---|---|
| Sintaxe | `CLUSTER BY (col1, col2)`, `CLUSTER BY AUTO`, `CLUSTER BY NONE` |
| Limite de chaves | **até 4 colunas de clustering** |
| Redefinição de chaves | Pode ser alterada **sem reescrever os dados existentes** |
| Tipos suportados | Date, Timestamp, TimestampNTZ, String, inteiros, Float, Double, Decimal; campos aninhados por notação de ponto |
| Tipos não suportados | `StructType`, `MapType`, `ArrayType` como chave |
| Como acionar | `OPTIMIZE tabela` (incremental) ou `OPTIMIZE tabela FULL` (reclusterização completa) |
| Disponibilidade | GA em **DBR 15.4 LTS+** para Delta; leitura/escrita requer DBR 13.3 LTS+ |
| Compatibilidade | **Incompatível com particionamento e com ZORDER** na mesma tabela |
| Gatilho automático | Clustering dispara em escritas acima de limiares de 64 MB a 1 GB, conforme o nº de colunas |

`CLUSTER BY AUTO` (tabelas managed do UC, requer predictive optimization) analisa a carga de consultas e **escolhe as chaves de clustering automaticamente**, adaptando-se à mudança de padrões de acesso.

**Quando liquid clustering ganha:** colunas de alta cardinalidade nos filtros, dados enviesados (skew), tabelas de crescimento rápido, escritas concorrentes, padrões de acesso variados, e quando as chaves de partição geram partições demais ou de menos.

Observação para tabelas < 10 TB: usar muitas chaves pode degradar filtros de coluna única; a diferença se dilui conforme a tabela cresce.

#### Particionamento (Hive-style)

Regras práticas oficiais:
- **Só particione tabelas acima de ~1 TB.**
- Cada partição deve ter **pelo menos 1 GB** de dados.
- Evite particionar por colunas de alta cardinalidade (ex.: `user_id`) — gera milhares de diretórios com arquivos minúsculos.
- Para tabelas novas, prefira **liquid clustering**.

#### Optimized writes e Auto compact

- **Optimized writes**: melhora o tamanho dos arquivos já na escrita.
- **Auto compact**: após a escrita, coalesce automaticamente arquivos pequenos.

### 5.8 VACUUM

Remove arquivos de dados obsoletos (não mais referenciados pelo log), reduzindo custo de armazenamento e purgando fisicamente registros apagados.

| Item | Valor/regra |
|---|---|
| Retenção padrão | **7 dias** |
| Recomendação | Manter **pelo menos 7 dias** de retenção |
| Verificação de segurança | `spark.databricks.delta.retentionDurationCheck.enabled` (desabilitar só com plena consciência) |
| Modo FULL (padrão) | Lista todos os arquivos do diretório da tabela |
| Modo LITE | Usa o transaction log; preview a partir do **DBR 16.4+**; **não apaga arquivos não referenciados no log** |
| Efeito colateral | *"A capacidade de consultar versões da tabela mais antigas que o período de retenção é perdida após executar VACUUM"* |
| Cluster sugerido | Autoscaling de 1 a 4 workers com 8 cores; driver de 8 a 32 cores |
| Alternativa moderna | **Predictive optimization** executa VACUUM automaticamente em tabelas managed do UC |

Para purgar fisicamente dados marcados por deletion vectors:

```sql
REORG TABLE vendas APPLY (PURGE);
-- depois, após o período de retenção:
VACUUM vendas;
```

### 5.9 Deletion vectors

Em vez de reescrever arquivos Parquet inteiros a cada `DELETE`/`UPDATE`/`MERGE`, o Delta grava um **vetor de deleção** (metadado) indicando quais linhas foram removidas — estratégia de *soft delete*. Isso torna DML muito mais rápido. Os arquivos são efetivamente reescritos depois, em manutenção (`OPTIMIZE`/`REORG`). Para conformidade com LGPD/GDPR (direito ao esquecimento), é preciso `REORG ... APPLY (PURGE)` + `VACUUM`.

### 5.10 Change Data Feed (CDF)

Registra as mudanças em nível de linha entre versões da tabela, permitindo consumir apenas o delta a jusante.

```sql
ALTER TABLE vendas SET TBLPROPERTIES (delta.enableChangeDataFeed = true);

SELECT * FROM table_changes('vendas', 10, 20);
```

O CDF adiciona colunas `_change_type` (`insert`, `update_preimage`, `update_postimage`, `delete`), `_commit_version` e `_commit_timestamp`. É requisito, por exemplo, para índices de vector search sincronizados.

### 5.11 Delta UniForm e Iceberg

**UniForm (Universal Format)** faz uma tabela Delta gerar também metadados **Apache Iceberg** (e historicamente Hudi), permitindo que engines externas leiam a mesma tabela como Iceberg sem cópia dos dados. Além disso, o Unity Catalog suporta **tabelas managed no formato Apache Iceberg** (`USING iceberg`); sem essa cláusula, o padrão continua sendo Delta.

### 5.12 Data skipping e estatísticas

O Delta coleta estatísticas de mínimo/máximo, contagem de nulos e número de registros por arquivo. Por padrão, as estatísticas são coletadas para as **primeiras 32 colunas** da tabela — motivo pelo qual colunas usadas em filtros devem estar no início do schema (ou o limite deve ser ajustado via `delta.dataSkippingNumIndexedCols`).

`ANALYZE TABLE ... COMPUTE STATISTICS` alimenta o otimizador baseado em custo (CBO).

### 5.13 Fatos verificáveis — Seção 5

- Delta Lake estende arquivos Parquet com um transaction log baseado em arquivos.
- Todas as tabelas criadas no Databricks são Delta Lake por padrão.
- O transaction log fica no diretório `_delta_log` e recebe um checkpoint Parquet a cada 10 commits.
- Delta usa controle de concorrência otimista.
- `DESCRIBE HISTORY` mostra o histórico de versões de uma tabela Delta.
- Time travel aceita `VERSION AS OF` e `TIMESTAMP AS OF`; `RESTORE TABLE` reverte a tabela.
- A retenção padrão do VACUUM é de 7 dias.
- Após rodar VACUUM, versões mais antigas que o período de retenção deixam de ser consultáveis.
- `VACUUM` em modo LITE usa o transaction log e não remove arquivos não referenciados nele; é preview a partir do DBR 16.4.
- `spark.databricks.delta.retentionDurationCheck.enabled` é a configuração que protege contra retenções muito curtas.
- Liquid clustering aceita no máximo 4 colunas de clustering.
- Liquid clustering substitui particionamento e ZORDER, e é incompatível com ambos na mesma tabela.
- Chaves de liquid clustering podem ser redefinidas sem reescrever os dados.
- `CLUSTER BY AUTO` requer predictive optimization e escolhe as chaves automaticamente.
- Liquid clustering é GA a partir do DBR 15.4 LTS.
- `OPTIMIZE tabela FULL` faz reclusterização completa.
- Só se deve particionar tabelas maiores que 1 TB, com pelo menos 1 GB por partição.
- Deletion vectors implementam soft delete, evitando reescrita imediata de arquivos.
- `REORG TABLE ... APPLY (PURGE)` seguido de `VACUUM` purga fisicamente dados com deletion vectors.
- Change Data Feed é habilitado pela propriedade `delta.enableChangeDataFeed` e lido por `table_changes()`.
- Column mapping permite renomear e excluir colunas sem reescrever dados.
- Chaves primárias e estrangeiras no Databricks são constraints informativas, não impostas.
- Estatísticas de data skipping são coletadas para as primeiras 32 colunas por padrão.
- UniForm permite que uma tabela Delta seja lida como Apache Iceberg sem cópia dos dados.
- Low shuffle merge é habilitado por padrão a partir do DBR 10.4 LTS.

---

## 6. Unity Catalog: governança e modelo de objetos

### 6.1 O que é

Unity Catalog é a solução unificada de governança para **dados e ativos de IA**. Ele centraliza controle de acesso, auditoria, linhagem e descoberta entre workspaces. Está disponível também como **software open source no GitHub** e é habilitado automaticamente em workspaces criados **após 8 de novembro de 2023**.

### 6.2 Hierarquia de objetos

```
Metastore
├── Catalog
│   └── Schema (database)
│       ├── Table (managed | external | foreign)
│       ├── View / Materialized View / Streaming Table
│       ├── Volume (managed | external)
│       ├── Function (UDF, incl. Python)
│       ├── Registered Model (MLflow)
│       └── Service / Vector Search index
├── Storage Credential
├── External Location
├── Connection (Lakehouse Federation)
├── Share / Recipient / Provider (OpenSharing)
└── Clean Room
```

Objetos de dados e IA seguem o namespace de **três níveis** (`catalog.schema.objeto`). Objetos como storage credentials, external locations, connections e shares ficam **diretamente sob o metastore**, fora do namespace de três níveis.

Um **securable object** é *"um objeto sobre o qual você pode conceder permissões a usuários, service principals ou grupos"*.

### 6.3 Storage credentials e external locations

| Objeto | O que representa |
|---|---|
| **Storage credential** | A credencial de nuvem (IAM role na AWS, managed identity no Azure, service account no GCP) que o UC usa para acessar o storage |
| **External location** | A combinação de **um caminho de storage + uma storage credential**; é sobre a external location que se concedem `READ FILES` / `WRITE FILES` |

Esse par substitui os antigos mounts do DBFS e instance profiles diretamente no cluster.

### 6.4 Tabelas managed vs. external

| Aspecto | **Managed** | **External** |
|---|---|---|
| Quem controla o storage | Unity Catalog (local do schema/catálogo) | O cliente, em local arbitrário registrado |
| Governança | UC | UC (só metadados) |
| `DROP TABLE` | Arquivos deletados após período de recuperação — **padrão 7 dias** (configurável de 0 h a 30 dias); dá para recuperar com `UNDROP` | Só remove o registro; **arquivos permanecem** e devem ser apagados manualmente |
| Predictive optimization | **Sim** (padrão em contas criadas a partir de 11/11/2024) | **Não** |
| Formatos | Delta (padrão) e **Apache Iceberg** (`USING iceberg`) | Delta, Parquet, CSV, JSON, Iceberg etc. |
| Recomendação | **Padrão recomendado** — *"custam menos para armazenar e consultar, e se mantêm e otimizam automaticamente"* | Quando sistemas externos precisam acessar os arquivos diretamente |

### 6.5 Volumes

Volumes governam **dados não tabulares** (estruturados, semiestruturados ou não estruturados): imagens, áudio, vídeo, PDFs, logs, checkpoints, arquivos de staging.

| Aspecto | Managed volume | External volume |
|---|---|---|
| Storage | Gerenciado pelo UC | Local de object storage existente |
| Ao dropar | Dados retidos **7 dias** antes da exclusão definitiva | Dados permanecem no storage |
| Uso ideal | Cargas exclusivamente Databricks | Quando sistemas externos também acessam |

**Caminho de acesso:** `/Volumes/<catalog>/<schema>/<volume>/<caminho>/<arquivo>` (ou `dbfs:/Volumes/...`).

**Requisitos e limitações:** exige SQL warehouse ou DBR **13.3 LTS+**; arquivos em volume **não podem ser registrados como tabelas do UC**; `dbutils.fs` não funciona nos executores; UDFs não acessam caminhos de volume; não é possível listar caminhos parciais (é preciso o nome completo do volume).

### 6.6 Modelo de privilégios

**Privilégios principais:**

| Grupo | Privilégios |
|---|---|
| Acesso a dados | `SELECT`, `MODIFY`, `INSERT`, `UPDATE`, `DELETE`, `EXECUTE` |
| Criação | `CREATE CATALOG`, `CREATE SCHEMA`, `CREATE TABLE`, `CREATE VOLUME`, `CREATE FUNCTION`, `CREATE MODEL` |
| Uso/navegação | `USE CATALOG`, `USE SCHEMA`, `USE CONNECTION`, `USE SHARE`, `BROWSE` |
| Arquivos | `READ FILES`, `WRITE FILES`, `READ VOLUME`, `WRITE VOLUME` |
| Metadados | `READ METADATA`, `APPLY TAG` |
| Administração | `MANAGE`, `MANAGE ALLOWLIST`, `MANAGE ACCESS CONTROL`, `ALL PRIVILEGES` |
| Compartilhamento | `CREATE SHARE`, `SET SHARE PERMISSION`, `USE PROVIDER`, `USE RECIPIENT`, `USE MARKETPLACE ASSETS` |

**Regra de ouro (muito cobrada):** para **ler uma tabela**, o usuário precisa de **três** privilégios simultâneos:

1. `SELECT` na tabela
2. `USE CATALOG` no catálogo pai
3. `USE SCHEMA` no schema pai

```sql
GRANT USE CATALOG ON CATALOG prod TO `analistas`;
GRANT USE SCHEMA  ON SCHEMA prod.vendas TO `analistas`;
GRANT SELECT      ON TABLE  prod.vendas.pedidos TO `analistas`;

SHOW GRANTS ON TABLE prod.vendas.pedidos;
REVOKE SELECT ON TABLE prod.vendas.pedidos FROM `analistas`;
```

**Herança:** privilégios concedidos em um contêiner descem para os filhos — *"conceder SELECT em um schema concede automaticamente SELECT em todas as tabelas e views atuais e futuras do schema"*. O mesmo vale do catálogo para baixo.

**`ALL PRIVILEGES`** concede tudo que se aplica ao objeto, **exceto** `EXTERNAL USE SCHEMA`, `EXTERNAL USE LOCATION`, `MANAGE` e `READ METADATA` — um desenho deliberado para evitar escalada acidental de privilégio.

**`MANAGE` vs. ownership:** `MANAGE` *"permite gerenciar privilégios, transferir a propriedade e excluir um objeto sem ser o dono"*. Quem tem `MANAGE` não ganha automaticamente `SELECT`, mas **pode conceder o privilégio a si mesmo**.

**`USE CATALOG` e `USE SCHEMA` são fronteiras de controle de acesso:** donos de catálogo e schema mantêm o controle do acesso independentemente de permissões concedidas em níveis inferiores.

### 6.7 Papéis administrativos

| Papel | Escopo | Poderes típicos |
|---|---|---|
| **Account admin** | Conta | Criar workspaces e metastores, gerenciar identidades e faturamento, atribuir metastore admin |
| **Metastore admin** | Metastore | Criar catálogos, gerenciar privilégios de topo, transferir ownership |
| **Workspace admin** | Workspace | Gerenciar compute, jobs, políticas, membros do workspace |
| **Owner** | Objeto | Todos os privilégios sobre o objeto e seus filhos; pode transferir ownership |

Boa prática: **atribuir a propriedade de objetos a grupos**, não a indivíduos, para evitar objetos órfãos quando alguém sai da empresa.

### 6.8 Controle de acesso fino

- **Row filters (filtros de linha)**: função SQL associada à tabela que restringe as linhas visíveis por usuário/grupo.
- **Column masks (máscaras de coluna)**: função aplicada a uma coluna que mascara ou transforma o valor conforme quem consulta (ex.: mostrar só os 4 últimos dígitos).
- **Dynamic views**: views que usam `current_user()`, `is_account_group_member()`, `is_member()` para filtrar dinamicamente.
- **Attribute-Based Access Control (ABAC)**: políticas baseadas em tags/atributos, aplicáveis em escala.
- **Workspace bindings (catalog binding)**: restringe um catálogo a workspaces específicos — mecanismo típico para isolar `prod` do workspace de desenvolvimento.

```sql
-- exemplo de dynamic view
CREATE VIEW vendas_regional AS
SELECT * FROM prod.vendas.pedidos
WHERE is_account_group_member('regiao_' || regiao);
```

### 6.9 Linhagem, descoberta e auditoria

- **Data lineage**: capturada automaticamente em nível de tabela **e de coluna**, cobrindo notebooks, jobs, pipelines e dashboards. Abrange também ativos de IA (modelos, features).
- **Catalog Explorer**: interface de descoberta; também via SQL, CLI e REST API.
- **Tags**: metadados chave-valor para classificação (ex.: `pii=true`), base do ABAC.
- **System tables**: schemas somente leitura no catálogo `system` com dados operacionais da conta. Principais: `system.billing.usage`, `system.billing.list_prices`, `system.access.audit`, `system.access.table_lineage`, `system.access.column_lineage`, `system.compute.clusters`, `system.query.history`, `system.lakeflow.jobs`.
- **Classificação automática** de dados sensíveis e **monitoramento de qualidade** com profiling e detecção de anomalias (Lakehouse Monitoring).

### 6.10 OpenSharing (Delta Sharing)

*"Protocolo aberto desenvolvido pela Databricks para compartilhamento seguro de dados com outras organizações"*, independente de plataforma de computação.

| Modelo | Como funciona |
|---|---|
| **Databricks-to-Databricks** | Entre workspaces com Unity Catalog. Permite compartilhar notebooks, volumes e modelos; governança embutida; **não exige tokens** |
| **Databricks-to-Open** | Para qualquer plataforma, via **bearer token** ou federação **OIDC** |

**Participantes:** *Provider* (quem compartilha; precisa de ao menos um workspace com UC), *Recipient* (quem recebe; pode não usar Databricks) e *Share* (coleção somente leitura de ativos).

**O que pode ser compartilhado:** tabelas (Delta/Iceberg), streaming tables, views (inclusive dynamic views com filtros de linha/coluna), volumes do UC, modelos de IA e notebooks (apenas D2D).

**Derivados:** **Databricks Marketplace** (troca de dados e ativos de IA) e **Clean Rooms** (colaboração multipartes sobre dados sensíveis sem expor os dados brutos).

### 6.11 Lakehouse Federation

*"Plataforma de federação de consultas do Databricks. Fornece acesso governado e somente leitura a dados externos por meio de foreign catalogs do Unity Catalog, com pushdown automático de consultas e controle de acesso fino em nível de tabela."*

Dois sabores:

| Tipo | O que faz | Fontes suportadas |
|---|---|---|
| **Query federation** | Envia consultas via JDBC a bancos relacionais externos | MySQL, PostgreSQL, Teradata, Oracle, Amazon Redshift, Salesforce Data 360, Snowflake, SQL Server, Azure Synapse, Google BigQuery, Databricks |
| **Catalog federation** | Acessa dados em object storage a partir de catálogos externos | Hive metastore legado do Databricks, Hive metastore externo, AWS Glue, Salesforce Data 360, Snowflake, Palantir Foundry |

Objetos envolvidos: **Connection** (credencial + endpoint) → **Foreign catalog** (espelha o banco externo no namespace do UC).

**Quando usar:** relatórios ad hoc, BI e provas de conceito sobre bancos operacionais, quando minimizar movimentação de dados importa; e migração incremental para o UC. **Ambos os modos são somente leitura (não há escrita).**

### 6.12 Fatos verificáveis — Seção 6

- Unity Catalog governa dados e ativos de IA, e é open source no GitHub.
- É habilitado automaticamente para workspaces criados após 8 de novembro de 2023.
- Storage credentials e external locations ficam diretamente sob o metastore, fora do namespace de três níveis.
- Uma external location combina um caminho de storage com uma storage credential.
- Para ler uma tabela é preciso SELECT na tabela, USE CATALOG no catálogo e USE SCHEMA no schema.
- Privilégios são herdados de cima para baixo na hierarquia.
- `ALL PRIVILEGES` não inclui MANAGE, READ METADATA, EXTERNAL USE SCHEMA nem EXTERNAL USE LOCATION.
- `MANAGE` permite gerenciar privilégios e transferir ownership sem ser dono, e quem o possui pode se autoconceder privilégios.
- Ao dropar uma tabela managed, os arquivos são deletados após um período de recuperação padrão de 7 dias (configurável de 0 h a 30 dias); `UNDROP` recupera nesse intervalo.
- Ao dropar uma tabela external, os arquivos permanecem no storage.
- Predictive optimization funciona apenas em tabelas managed do Unity Catalog.
- Tabelas managed suportam Delta (padrão) e Apache Iceberg (com `USING iceberg`).
- Volumes armazenam dados não tabulares e usam o caminho `/Volumes/catalog/schema/volume/...`.
- Volumes exigem SQL warehouse ou DBR 13.3 LTS ou superior.
- Managed volumes retêm dados por 7 dias após serem dropados.
- Linhagem é capturada automaticamente em nível de tabela e de coluna.
- System tables ficam no catálogo `system`; `system.billing.usage` traz uso faturável e `system.access.audit` traz auditoria.
- Row filters e column masks implementam controle de acesso fino no Unity Catalog.
- Workspace bindings restringem um catálogo a workspaces específicos.
- Delta Sharing/OpenSharing entre Databricks não exige tokens; para plataformas externas usa bearer token ou OIDC.
- Notebooks só podem ser compartilhados no modo Databricks-to-Databricks.
- Lakehouse Federation é somente leitura e usa foreign catalogs com pushdown de consulta.
- Databricks Marketplace e Clean Rooms são construídos sobre o protocolo de compartilhamento aberto.

---

## 7. Ingestão de dados

### 7.1 Panorama das opções

| Opção | Tipo de fonte | Quando usar |
|---|---|---|
| **Auto Loader** (`cloudFiles`) | Arquivos em object storage | Ingestão incremental contínua de grande volume de arquivos — **padrão recomendado** |
| **COPY INTO** | Arquivos em object storage | Cargas SQL idempotentes de volume moderado |
| **Streaming tables** | Arquivos, filas | Experiência declarativa recomendada para usuários SQL |
| **Lakeflow Connect** | SaaS e bancos (Salesforce, Workday, SQL Server, ServiceNow, Google Analytics…) | Conectores gerenciados, sem código |
| **Structured Streaming** | Kafka, Kinesis, Pub/Sub, Event Hubs, Pulsar | Streaming de filas de mensagens |
| **Lakehouse Federation** | Bancos relacionais | Consultar sem ingerir |
| **Upload de arquivo / Add data UI** | CSV, Excel etc. | Cargas pontuais e pequenas |
| **Parceiros (Fivetran, dbt, Qlik…)** | Diversos | Via Partner Connect |

### 7.2 Auto Loader

Auto Loader usa a fonte de Structured Streaming **`cloudFiles`** para *"processar de forma incremental e eficiente novos arquivos de dados conforme eles chegam ao cloud storage"*.

**Fontes suportadas:** S3 (`s3://`), ADLS (`abfss://`), GCS (`gs://`), Volumes do UC (`/Volumes/`), Azure Blob (`wasbs://`).

**Formatos:** JSON, CSV, XML, PARQUET, AVRO, ORC, TEXT e BINARYFILE, inclusive comprimidos.

**Dois modos de detecção de arquivos:**

| Modo | Como funciona | Quando usar |
|---|---|---|
| **Directory listing** (padrão) | Lista o diretório para descobrir novos arquivos | Volumes menores; sem necessidade de configurar recursos de nuvem |
| **File notification** | Assina eventos de notificação da nuvem (SNS/SQS, Event Grid, Pub/Sub) | **Recomendado para a maioria das cargas**; escala para milhões de arquivos e reduz custo de API |

**Gerenciamento de estado:** o Auto Loader mantém metadados dos arquivos em um **key-value store RocksDB no checkpoint location**, o que garante processamento **exactly-once** e tolerância a falhas sem gestão manual de estado.

**Vantagens declaradas:** lida com bilhões de arquivos; o custo de descoberta escala com o número de arquivos ingeridos, não com o número de diretórios; usa APIs nativas da nuvem; o modo de notificação reduz ainda mais o custo.

**Schema:** o Auto Loader *"detecta schema drift, notifica quando há mudanças de schema e resgata dados que seriam ignorados ou perdidos"*.

| Opção de schema evolution (`cloudFiles.schemaEvolutionMode`) | Comportamento |
|---|---|
| `addNewColumns` (padrão com schema inference) | Falha o stream e adiciona as novas colunas ao schema; ao reiniciar, prossegue |
| `rescue` | Não evolui o schema; colunas novas vão para a **rescued data column** |
| `failOnNewColumns` | Falha o stream e exige intervenção manual |
| `none` | Ignora colunas novas |

A **`_rescued_data`** é a coluna que captura dados que não se encaixaram no schema (tipo incompatível, coluna desconhecida, diferença de caixa) — mecanismo essencial para não perder dados na camada Bronze.

**Opções frequentes:**

```python
(spark.readStream
   .format("cloudFiles")
   .option("cloudFiles.format", "json")
   .option("cloudFiles.schemaLocation", "/Volumes/prod/bronze/_schemas/pedidos")
   .option("cloudFiles.schemaEvolutionMode", "addNewColumns")
   .option("cloudFiles.useNotifications", "true")
   .option("cloudFiles.maxFilesPerTrigger", 1000)
   .option("cloudFiles.includeExistingFiles", "true")
   .load("/Volumes/prod/landing/pedidos/")
 .writeStream
   .option("checkpointLocation", "/Volumes/prod/bronze/_ckpt/pedidos")
   .trigger(availableNow=True)
   .toTable("prod.bronze.pedidos"))
```

### 7.3 COPY INTO

Comando SQL para carregar arquivos em uma tabela Delta. É *"retriável e idempotente — arquivos na origem que já foram carregados são pulados em execuções subsequentes"*, garantindo **processamento exactly-once por padrão**.

```sql
COPY INTO prod.bronze.pedidos
FROM '/Volumes/prod/landing/pedidos/'
FILEFORMAT = JSON
FORMAT_OPTIONS ('inferSchema' = 'true', 'mergeSchema' = 'true')
COPY_OPTIONS ('mergeSchema' = 'true');
```

Suporta inferência, mapeamento, merge e evolução de schema no destino, e criação de tabelas Delta vazias/sem schema para preencher na carga.

**Auto Loader vs. COPY INTO:**

| Critério | Auto Loader | COPY INTO |
|---|---|---|
| Escala de arquivos | Milhões/bilhões | Milhares (volume moderado) |
| Modelo | Structured Streaming | Comando SQL em lote |
| Estado | Checkpoint + RocksDB | Registro de arquivos carregados na tabela |
| Evolução de schema | Rica (4 modos + rescued data) | Suportada, mais simples |
| Notificação de eventos de nuvem | Sim | Não |
| Interface | Python/Scala/SQL (via pipelines) | SQL puro |

A orientação atual da documentação é que **usuários SQL prefiram streaming tables**, descritas como *"experiência de ingestão de arquivos mais escalável e robusta"*.

### 7.4 Lakeflow Connect

Conectores gerenciados de ingestão, com pipelines sem código para aplicações SaaS e bancos de dados (Salesforce, Workday, ServiceNow, Google Analytics, SQL Server, PostgreSQL, Oracle, entre outros). Gera pipelines gerenciados que aterrissam os dados no Unity Catalog, com suporte a CDC quando a fonte permite.

### 7.5 Structured Streaming

Motor de processamento quase em tempo real com *"tolerância a falhas fim a fim e garantias de processamento exactly-once usando APIs Spark familiares"*.

**Conceitos:**

| Conceito | Descrição |
|---|---|
| **Micro-batch** | O stream é executado como uma sequência de pequenos jobs em lote |
| **Checkpoint** | Diretório que guarda offsets e estado; é o que garante tolerância a falhas e exactly-once. **Um checkpoint por query — nunca compartilhe.** |
| **Output mode** | `append` (só linhas novas), `update` (linhas alteradas), `complete` (tabela de resultado inteira) |
| **Watermark** | Define quanto tempo esperar por dados atrasados em operações stateful; permite descartar estado antigo |
| **Stateless vs. stateful** | Stateless processa linha a linha; stateful mantém estado para agregações, joins e deduplicação |
| **State store** | Armazenamento do estado; **RocksDB** é o backend recomendado para estados grandes |

**Triggers:**

| Trigger | Comportamento |
|---|---|
| `processingTime="30 seconds"` | Micro-batches em intervalo fixo |
| `availableNow=True` | Processa **todo o dado disponível** em múltiplos micro-batches e **encerra** — ideal para cargas incrementais agendadas |
| `once=True` | Depreciado em favor de `availableNow` |
| default (sem trigger) | Micro-batches encadeados o mais rápido possível |

**Padrão de custo (muito cobrado):** para cargas incrementais **sem requisito de baixa latência**, use `Trigger.AvailableNow` em um job agendado em vez de um stream contínuo 24/7 — a economia costuma ser grande.

**`foreachBatch`** permite aplicar lógica em lote (por exemplo, `MERGE INTO`) a cada micro-batch, e é o padrão para upsert em streaming.

**Monitoramento:** `StreamingQueryListener` e a Spark UI acompanham progresso e métricas.

### 7.6 Fatos verificáveis — Seção 7

- Auto Loader usa a fonte de streaming `cloudFiles`.
- Os dois modos de detecção do Auto Loader são directory listing (padrão) e file notification (recomendado para a maioria das cargas).
- O Auto Loader mantém o estado de arquivos processados em um RocksDB no checkpoint location.
- O Auto Loader garante processamento exactly-once.
- Formatos suportados pelo Auto Loader: JSON, CSV, XML, Parquet, Avro, ORC, TEXT e BINARYFILE.
- A coluna `_rescued_data` captura dados que não se encaixaram no schema esperado.
- `cloudFiles.schemaEvolutionMode` aceita addNewColumns (padrão), rescue, failOnNewColumns e none.
- `cloudFiles.schemaLocation` define onde o schema inferido é armazenado.
- COPY INTO é idempotente e pula arquivos já carregados.
- COPY INTO é adequado para milhares de arquivos; Auto Loader escala para milhões ou bilhões.
- Databricks recomenda que usuários SQL usem streaming tables para ingestão de arquivos.
- Em Structured Streaming, cada query precisa do seu próprio checkpoint location.
- Os output modes do Structured Streaming são append, update e complete.
- Watermarks definem o tempo de espera por dados atrasados em operações stateful.
- `Trigger.AvailableNow` processa todos os dados disponíveis e encerra a query.
- `Trigger.Once` está depreciado em favor de `Trigger.AvailableNow`.
- `foreachBatch` permite aplicar operações em lote, como MERGE, dentro de um stream.
- RocksDB é o state store recomendado para estados grandes.

---

## 8. Lakeflow Declarative Pipelines (ex-Delta Live Tables)

### 8.1 O que é

*"Framework declarativo para construir pipelines de dados em batch e streaming em SQL e Python."* Você declara **o que** cada dataset deve ser; o framework resolve dependências, ordem de execução, paralelismo, retries e gestão de infraestrutura. É interoperável com o **Spark Declarative Pipelines** (versão doada ao Apache Spark) e roda sobre o Databricks Runtime.

Benefícios declarados: *"orquestração automática"* com paralelismo máximo e retries progressivos, *"processamento declarativo"* que reduz substancialmente o código manual, e um motor de *"processamento incremental"* que mantém materialized views de forma eficiente.

### 8.2 Tipos de dataset

| Dataset | Semântica | Quando usar |
|---|---|---|
| **Streaming table** | Processa **cada registro exatamente uma vez** a partir de fontes append-only | Ingestão e processamento incremental de dados que crescem continuamente (tipicamente **Bronze**) |
| **Materialized view** | Resultado recomputado conforme necessário para refletir o estado atual dos dados; **incremental quando possível** | Transformações, agregações e pré-cálculos consumidos por vários datasets a jusante (**Silver/Gold**) |
| **View** (temporária/privada) | Avaliada sob demanda, **não persistida** | Transformações intermediárias e verificações que não devem ser publicadas no catálogo |
| **Sink** | Destino de streaming externo | Delta, **Apache Kafka**, **Azure Event Hubs**, fontes Python customizadas |

### 8.3 Flows

| Flow | Função |
|---|---|
| **Append flow** | Flow de streaming que processa registros incrementalmente (`@append_flow` para múltiplas fontes em uma mesma streaming table) |
| **Auto CDC flow** | Trata eventos CDC fora de ordem; suporta SCD Type 1 e Type 2 |
| **Materialized view flow** | Flow em lote que processa apenas dados novos e mudanças na fonte quando possível |

### 8.4 Sintaxe

**Python:**

```python
from pyspark import pipelines as dp
from pyspark.sql.functions import col

@dp.table(comment="Pedidos brutos")
def bronze_pedidos():
    return (spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "json")
            .load("/Volumes/prod/landing/pedidos"))

@dp.materialized_view
@dp.expect_or_drop("valor_valido", "valor > 0")
def silver_pedidos():
    return dp.read("bronze_pedidos").filter(col("status").isNotNull())
```

**SQL:**

```sql
CREATE OR REFRESH STREAMING TABLE bronze_pedidos
AS SELECT * FROM STREAM read_files('/Volumes/prod/landing/pedidos', format => 'json');

CREATE OR REFRESH MATERIALIZED VIEW silver_pedidos (
  CONSTRAINT valor_valido EXPECT (valor > 0) ON VIOLATION DROP ROW
)
AS SELECT * FROM bronze_pedidos WHERE status IS NOT NULL;
```

### 8.5 Expectations (qualidade de dados)

Expectations são *"cláusulas opcionais em declarações de criação de materialized view, streaming table ou view de pipeline que aplicam verificações de qualidade a cada registro"*. Usam expressões booleanas SQL.

| Ação | SQL | Python | Comportamento |
|---|---|---|---|
| **Warn (padrão)** | `EXPECT (cond)` | `@dp.expect` | Registro inválido **é gravado** no destino; métricas são coletadas |
| **Drop** | `EXPECT (cond) ON VIOLATION DROP ROW` | `@dp.expect_or_drop` | Registro inválido é **excluído** do destino |
| **Fail** | `EXPECT (cond) ON VIOLATION FAIL UPDATE` | `@dp.expect_or_fail` | Pipeline **para**; ocorre rollback atômico |

Versões coletivas em Python, que recebem dicionários nome→condição: `@dp.expect_all`, `@dp.expect_all_or_drop`, `@dp.expect_all_or_fail`.

**Restrições:** devem ser SQL válido; **não** podem conter funções Python customizadas, chamadas externas ou subqueries. Funções SQL padrão (`CASE`, `BETWEEN`, funções de data) são permitidas.

**Métricas:** taxas de aprovação/reprovação aparecem na aba **"Data quality"** da UI do pipeline. Nomes de expectations devem ser únicos por dataset, mas são *"portáveis e reutilizáveis"* entre datasets.

### 8.6 AUTO CDC (ex-APPLY CHANGES INTO)

Aplica feeds de mudança a tabelas de destino tratando **eventos fora de ordem** automaticamente.

| Parâmetro | Função |
|---|---|
| `keys` | Colunas que identificam unicamente o registro |
| `sequence_by` | Coluna (ou STRUCT de colunas) que ordena as mudanças; com STRUCT, ordena pelo primeiro campo e desempata pelo segundo |
| `apply_as_deletes` | Condição que identifica registros de exclusão |
| `apply_as_truncates` | Condição que identifica operações de truncate |
| `except_column_list` | Colunas excluídas do destino (ex.: código de operação, número de sequência) |
| `track_history_except_column_list` | **Só SCD Type 2**: colunas excluídas do rastreamento de histórico (atualizadas in-place) |
| `stored_as_scd_type` | `1` ou `2` |

| SCD | Comportamento |
|---|---|
| **Type 1** | *"Atualiza registros diretamente. Histórico não é retido para registros atualizados."* |
| **Type 2** | *"Retém histórico de registros, em todas as atualizações ou em atualizações de um conjunto específico de colunas."* Cria colunas `__START_AT` e `__END_AT` |

**APIs:** em Python, `create_auto_cdc_flow()` para feeds de mudança e `create_auto_cdc_from_snapshot_flow()` para snapshots; em SQL, `AUTO CDC INTO` para feeds — **não há suporte SQL para processamento baseado em snapshot**.

**Fora de ordem:** mudanças são processadas por valor de sequência; atualizações que chegam depois com número de sequência menor são **descartadas** do destino.

```sql
CREATE OR REFRESH STREAMING TABLE clientes;

AUTO CDC INTO clientes
FROM STREAM(cdc_clientes)
KEYS (cliente_id)
APPLY AS DELETE WHEN operacao = 'DELETE'
SEQUENCE BY seq_num
COLUMNS * EXCEPT (operacao, seq_num)
STORED AS SCD TYPE 2;
```

### 8.7 Execução do pipeline

| Dimensão | Opções |
|---|---|
| **Modo de update** | **Triggered** (atualiza os dados disponíveis e para) vs. **Continuous** (mantém as tabelas atualizadas conforme dados chegam) |
| **Modo de ambiente** | **Development** (reutiliza o cluster entre execuções e não faz retry automático — itera mais rápido) vs. **Production** (novo cluster a cada execução e retry automático de falhas) |
| **Full refresh** | Reprocessa tudo do zero, truncando e recarregando os destinos |
| **Compute** | Serverless (recomendado, com autoscaling e Photon) ou clusters clássicos configuráveis |
| **Publicação** | Catálogo e schema de destino no Unity Catalog |

### 8.8 Boas práticas de pipelines

- Use **streaming tables para ingestão** (Bronze) e **materialized views para transformações** (Silver/Gold).
- Coloque expectations **o mais cedo possível**, mas prefira `DROP`/`WARN` no Bronze e `FAIL` apenas em invariantes críticas — falhar o pipeline inteiro por um registro ruim costuma custar caro.
- Mantenha **um pipeline por domínio/produto de dados**, não um pipeline monolítico.
- Prefira **serverless** para pipelines: elimina tuning de cluster e reduz custo ocioso.
- Use **development mode** ao iterar e **production mode** para execuções agendadas.
- Evite lógica imperativa: deixe o framework resolver a ordem — declare dependências lendo os datasets (`dp.read`, `STREAM(...)`), não com orquestração manual.

### 8.9 Fatos verificáveis — Seção 8

- Delta Live Tables foi renomeado para Lakeflow Declarative Pipelines.
- Streaming tables processam cada registro exatamente uma vez a partir de fontes append-only.
- Materialized views recomputam resultados e podem ser mantidas incrementalmente.
- Views em pipelines não são persistidas e são avaliadas sob demanda.
- Sinks suportados incluem Delta, Apache Kafka, Azure Event Hubs e fontes Python customizadas.
- A ação padrão de uma expectation é warn: o registro inválido é gravado e a métrica registrada.
- `ON VIOLATION DROP ROW` descarta o registro; `ON VIOLATION FAIL UPDATE` interrompe o pipeline com rollback atômico.
- Os decorators Python de expectation são `@dp.expect`, `@dp.expect_or_drop` e `@dp.expect_or_fail`, mais as variantes `expect_all`.
- Expectations não podem conter funções Python customizadas nem subqueries.
- Métricas de qualidade aparecem na aba "Data quality" da UI do pipeline.
- SCD Type 1 não retém histórico; SCD Type 2 cria as colunas `__START_AT` e `__END_AT`.
- `sequence_by` define a ordenação das mudanças e aceita STRUCT para desempate.
- `apply_as_deletes` identifica registros que representam exclusões.
- `track_history_except_column_list` só se aplica a SCD Type 2.
- Não há suporte SQL para AUTO CDC a partir de snapshots; apenas Python (`create_auto_cdc_from_snapshot_flow`).
- Atualizações fora de ordem com número de sequência menor são descartadas.
- Modo triggered atualiza e encerra; modo continuous mantém o pipeline rodando.
- Development mode reutiliza o cluster e não faz retry automático; production mode cria cluster novo e faz retry.
---

## 9. Arquitetura Medallion e modelagem do Lakehouse

### 9.1 Definição

A arquitetura medallion é *"uma série de camadas de dados que denotam a qualidade dos dados armazenados no lakehouse"*, progredindo por bronze, silver e gold. Ela garante propriedades ACID conforme os dados passam por múltiplos estágios de validação e transformação.

Também chamada de arquitetura "multi-hop". **Não é obrigatória** — a documentação diz que segui-la é *recomendado, mas não mandatório*.

### 9.2 As três camadas

| Camada | Nome | Conteúdo | Público |
|---|---|---|---|
| 🥉 **Bronze** | Raw | Dados não validados, em formato original, vindos de cloud storage, Kafka e outras fontes. Mantém fidelidade sem limpeza ou validação. Campos guardados como **string, VARIANT ou binário** para evitar perda por mudança de schema. **Fonte única da verdade para reprocessamento e auditoria.** | Engenheiros de dados |
| 🥈 **Silver** | Validated / Cleansed | *"Limpeza e validação de dados"*, com deduplicação e normalização. Contém **pelo menos uma representação não agregada de cada registro**. Aplica schema, trata nulos, resolve dados que chegam atrasados e faz cast de tipos. | Engenheiros, analistas e cientistas de dados |
| 🥇 **Gold** | Enriched / Curated | *"Visões altamente refinadas dos dados que alimentam analytics, dashboards, ML e aplicações downstream."* Datasets agregados e alinhados ao negócio, otimizados para relatório. Usa **modelagem dimensional** e **materialized views** para métricas frequentes. | Analistas de negócio, desenvolvedores de BI, executivos, times operacionais |

### 9.3 Recomendações operacionais

- **Não escreva diretamente na camada Silver a partir da ingestão** — isso causa falhas e perde a capacidade de reprocessar.
- Configure a **maioria das leituras a partir do Bronze como leituras de streaming**; use leitura em lote apenas para datasets pequenos.
- **Otimize as tabelas Gold** (clustering, materialized views), porque são as mais consultadas.
- **Ajuste a frequência de ingestão** para equilibrar custo, latência e requisitos de negócio.
- Adicione **metadados de linhagem técnica** no Bronze (nome do arquivo de origem, timestamp de ingestão) — essencial para auditoria e debugging.
- Capture colunas de controle: `_rescued_data`, `_ingest_timestamp`, `_source_file`.

### 9.4 Padrões de modelagem no Gold

| Padrão | Uso |
|---|---|
| **Star schema** (fato + dimensões) | Padrão dominante para BI; funciona bem com o otimizador e com ferramentas de BI |
| **SCD Type 1 / Type 2** | Dimensões sem/com histórico (Type 2 via AUTO CDC) |
| **Materialized views** | Métricas pré-agregadas atualizadas incrementalmente |
| **Data Vault** | Alternativa para ambientes muito regulados/integrados; mais custosa em joins |
| **One Big Table (OBT)** | Tabelas desnormalizadas amplas; reduz joins, útil com liquid clustering |

### 9.5 Organização de catálogos e schemas

Padrões comuns de organização no Unity Catalog:

| Estratégia | Estrutura | Vantagem |
|---|---|---|
| **Por ambiente** | `dev.vendas.pedidos`, `prod.vendas.pedidos` | Isolamento claro; usa workspace bindings |
| **Por domínio** (data mesh) | `vendas.bronze.pedidos`, `vendas.gold.receita` | Ownership por domínio de negócio |
| **Por camada** | `bronze.vendas.pedidos`, `silver.vendas.pedidos` | Simples, mas mistura domínios |

A prática mais recomendada em ambientes maduros combina **catálogo = ambiente ou domínio** e **schema = camada medallion**, com ownership atribuído a **grupos**.

### 9.6 Fatos verificáveis — Seção 9

- A arquitetura medallion tem três camadas: bronze (raw), silver (validada) e gold (enriquecida).
- A camada Bronze mantém os dados em formato original, sem limpeza, e serve como fonte única da verdade para reprocessamento.
- Campos na Bronze podem ser guardados como string, VARIANT ou binário para evitar perda por mudança de schema.
- A camada Silver contém pelo menos uma representação não agregada de cada registro.
- A camada Gold usa modelagem dimensional e materialized views e é otimizada para consulta.
- Databricks recomenda não escrever diretamente na Silver a partir da ingestão.
- A maioria das leituras a partir da Bronze deve ser configurada como leitura de streaming.
- Seguir a arquitetura medallion é recomendado, mas não obrigatório.

---

## 10. Orquestração: Lakeflow Jobs (ex-Workflows)

### 10.1 Conceito

Um **job** é a unidade de orquestração: um conjunto de **tasks** organizadas como um **DAG (grafo acíclico dirigido)**, com dependências, condições e gatilhos.

### 10.2 Tipos de task

| Task | O que executa |
|---|---|
| Notebook | Um notebook do workspace ou de um Git folder |
| Python script / Python wheel | Arquivo `.py` ou pacote wheel |
| SQL | Query, dashboard, alerta ou arquivo SQL |
| Pipeline | Um Lakeflow Declarative Pipeline |
| JAR / Spark Submit | Aplicação Scala/Java |
| dbt | Projeto dbt Core |
| Run job | Outro job (composição de jobs) |
| **If/else condition** | Ramificação condicional |
| **For each** | Itera uma task sobre uma lista de valores |
| Model Serving / Clean Rooms / Power BI etc. | Tasks especializadas |

### 10.3 Controle de fluxo

- Tasks declaram **dependências** (`depends_on`) formando o DAG.
- **`run_if`** define a condição de execução conforme o estado das dependências: `ALL_SUCCESS` (padrão), `AT_LEAST_ONE_SUCCESS`, `NONE_FAILED`, `ALL_DONE`, `AT_LEAST_ONE_FAILED`, `ALL_FAILED`.
- **If/else** e **For each** dão branching e looping nativos.
- **`dbutils.jobs.taskValues.set/get`** passa valores entre tasks.

### 10.4 Gatilhos (triggers)

| Trigger | Descrição |
|---|---|
| **Scheduled (cron)** | Horário fixo; usa expressão cron com timezone |
| **File arrival** | Dispara quando novos arquivos chegam a uma external location/volume |
| **Continuous** | Mantém o job sempre rodando (reinicia ao terminar) |
| **Table update** | Dispara quando uma tabela do UC é atualizada |
| **Manual / API** | Execução sob demanda |

### 10.5 Confiabilidade

- **Retries**: política por task (número máximo de tentativas, intervalo mínimo entre elas).
- **Timeouts**: por task e por job.
- **Repair run**: re-executa **apenas as tasks que falharam** e suas dependentes, reaproveitando o resultado das que passaram — recurso importante de eficiência.
- **Notificações**: e-mail, Slack, webhooks customizados e outros destinos, em eventos de start, success, failure e duration warning.
- **Max concurrent runs**: controla quantas execuções simultâneas do mesmo job são permitidas.
- **Queueing**: enfileira execuções quando o limite de concorrência é atingido.

### 10.6 Limites do workspace

| Limite | Valor |
|---|---|
| Tasks por job | **1.000** |
| Execuções de task concorrentes por workspace | **2.000** |
| Jobs criados por hora | **10.000** |
| Jobs salvos por workspace | **12.000** |
| Tamanho de parâmetros de job com valores dinâmicos | **10.000 caracteres** |

### 10.7 Parâmetros e valores dinâmicos

Jobs suportam **parâmetros em tempo de execução propagados automaticamente às tasks**. Valores dinâmicos comuns: `{{job.id}}`, `{{job.run_id}}`, `{{job.start_time.iso_date}}`, `{{task.name}}`. Em notebooks, os parâmetros chegam por **widgets** (`dbutils.widgets.get`).

### 10.8 Boas práticas de orquestração

- Rode jobs em **job compute** ou **serverless**, nunca em all-purpose.
- Use **`Trigger.AvailableNow`** em jobs agendados no lugar de streams contínuos quando a latência permitir.
- Configure **notificação de falha desde o primeiro job** — job silencioso que falha é dívida operacional.
- Defina **timeouts**: sem timeout, um job travado consome compute indefinidamente.
- Use **repair run** em vez de re-executar o job inteiro.
- Parametrize ambiente (catálogo dev/prod) em vez de duplicar jobs.
- Versione a definição do job em **Asset Bundles**, não na UI.

### 10.9 Fatos verificáveis — Seção 10

- Um job Lakeflow organiza tasks como um DAG.
- Um job pode conter até 1.000 tasks.
- Um workspace suporta até 2.000 execuções de task concorrentes.
- Um workspace permite criar no máximo 10.000 jobs por hora e armazenar até 12.000 jobs.
- Parâmetros de job com valores dinâmicos são limitados a 10.000 caracteres.
- `run_if` define condições como ALL_SUCCESS, AT_LEAST_ONE_SUCCESS, NONE_FAILED e ALL_DONE.
- Tasks de if/else e for each fornecem branching e looping nativos.
- Triggers disponíveis incluem agendamento por cron, chegada de arquivo, atualização de tabela e modo contínuo.
- "Repair run" re-executa apenas as tasks que falharam e suas dependentes.
- `dbutils.jobs.taskValues` passa valores entre tasks de um job.
- Notificações podem ser enviadas por e-mail, Slack e webhooks customizados.

---

## 11. Databricks SQL, AI/BI e Genie

### 11.1 Componentes

| Componente | Função |
|---|---|
| **SQL Editor** | Escrever e executar SQL com assistência de IA, comentários no código e histórico de versões |
| **Queries** | Consultas salvas, parametrizáveis, com agendamento |
| **AI/BI Dashboards** | Dashboards interativos com autoria assistida por IA e compartilhamento |
| **Alerts** | Monitoram resultados de consulta, avaliam condições e disparam notificações |
| **Query History** | Execuções passadas, tempos e uso de recursos por warehouse |
| **Query Profile** | Plano de execução detalhado para achar gargalos |
| **Performance insights** | Recomendações automáticas quando consultas rodam de forma ineficiente |
| **Materialized views / Streaming tables** | ETL incremental declarado diretamente no DBSQL |
| **REST API** | Automação e gestão de objetos do Databricks SQL |

### 11.2 Query Profile

Ferramenta central de diagnóstico. Mostra a árvore de operadores com tempo gasto, linhas lidas/escritas, bytes trafegados em shuffle, arquivos e partições podados. Sinais típicos a procurar:

| Sintoma no profile | Causa provável | Ação |
|---|---|---|
| Muitos arquivos lidos, poucos aproveitados | Data skipping ruim | Liquid clustering nas colunas de filtro |
| Tempo dominante em "Shuffle" | Join grande sem broadcast / skew | AQE, broadcast hint, revisar chaves |
| Poucas tasks longas, muitas curtas | Skew | AQE skew join, salting |
| Spill to disk | Memória insuficiente por partição | Aumentar cluster ou reparticionar |
| Tempo alto em "Scan" com filtro | Predicado não empurrado (pushdown) | Evitar UDF no filtro, revisar tipos |

### 11.3 AI/BI Dashboards

Sucessores dos "legacy dashboards". Trazem datasets reutilizáveis, filtros cruzados, autoria assistida por IA, publicação com credenciais embutidas e agendamento de e-mails. Dashboards publicados podem ser compartilhados com usuários sem licença de workspace, dependendo da configuração.

### 11.4 AI/BI Genie

Genie é *"a experiência de IA da Databricks para usuários"*, que permite *"fazer perguntas sobre dados em linguagem natural e obter respostas fundamentadas nos dados da organização"*, governadas pelo Unity Catalog. Traduz pergunta em SQL, executa e devolve resultado com o SQL gerado visível.

**Como se curate um espaço Genie:**

| Elemento | Papel |
|---|---|
| **Datasets/tabelas** | O escopo de dados do espaço — quanto menor e mais curado, melhor |
| **Instructions** | Regras de negócio, definições de métricas e convenções em linguagem natural |
| **Sample queries / SQL examples** | Exemplos que ensinam padrões de junção e filtro corretos |
| **Trusted assets / verified answers** | Consultas e funções verificadas que o Genie deve reusar em vez de inventar SQL |
| **Benchmarks** | Conjunto de perguntas com resposta esperada para medir a qualidade do espaço |

**Boas práticas:** use poucas tabelas bem modeladas (preferencialmente Gold); escreva **comentários descritivos em tabelas e colunas** (o Genie os usa como contexto); defina métricas ambíguas nas instruções ("receita líquida = ..."); adicione respostas verificadas para as perguntas mais frequentes; e avalie com benchmarks antes de liberar para o negócio.

**Requisitos:** Unity Catalog e, na prática, SQL warehouse (serverless recomendado).

### 11.5 Databricks Assistant

Assistente de IA integrado a notebooks, editor SQL e arquivos: gera e explica código, corrige erros, sugere transformações, e é sensível ao contexto do Unity Catalog (conhece os schemas das tabelas). Também aparece como agente capaz de orquestrar etapas múltiplas a partir de um único prompt.

### 11.6 Conectividade e parceiros

- **Drivers**: JDBC e ODBC do Databricks; conector SQL para Python; SQL Execution API (REST).
- **Ferramentas de BI**: Power BI, Tableau, Looker, Qlik, Sigma — com publicação direta a partir do Catalog Explorer para Power BI/Tableau.
- **Partner Connect**: integração guiada com parceiros de ingestão, BI e governança (Fivetran, dbt, Qlik, Matillion etc.).

### 11.7 Fatos verificáveis — Seção 11

- Query Profile mostra o plano de execução e ajuda a identificar gargalos de consulta.
- Query History registra execuções, tempos e uso de recursos por SQL warehouse.
- Alerts monitoram resultados de consulta e disparam notificações quando uma condição é atendida.
- AI/BI Dashboards permitem autoria assistida por IA e compartilhamento na organização.
- Genie responde perguntas em linguagem natural sobre dados governados pelo Unity Catalog.
- Trusted assets/verified answers permitem que o Genie reutilize SQL verificado em vez de gerar uma consulta nova.
- Comentários em tabelas e colunas melhoram a qualidade das respostas do Genie.
- Databricks SQL permite criar materialized views e streaming tables para ETL incremental.
- Partner Connect facilita a integração com ferramentas parceiras de ingestão e BI.

---

## 12. Machine Learning e IA Generativa

### 12.1 MLflow

MLflow é descrito como *"a maior plataforma open source de engenharia de IA para agentes, LLMs e modelos de ML"*, com mais de 30 milhões de downloads mensais. SDKs nativos para **Python, TypeScript/JavaScript, Java e R**.

**Componentes:**

| Componente | Função |
|---|---|
| **Tracking** | Registra parâmetros, métricas, artefatos e versões de código durante o desenvolvimento; organiza em **experiments** e **runs** |
| **Models** | Formato padronizado que empacota modelos de ML e agentes de IA |
| **Model Registry (em Unity Catalog)** | Governança centralizada, acesso entre workspaces, linhagem e descoberta de modelos |
| **Evaluation** | Avaliação de modelos e de agentes |
| **Tracing** | Registra entradas, saídas e metadados de **cada etapa intermediária** de uma aplicação GenAI |
| **Prompt Registry** | Versionamento e iteração de templates de prompt |
| **Deployment Jobs** (MLflow 3) | Fluxos de avaliação, aprovação e deploy |
| **Logged Models** (MLflow 3) | Acompanham a progressão do modelo pelo ciclo de vida |

**Autologging:** `mlflow.autolog()` captura automaticamente parâmetros, métricas e artefatos de bibliotecas suportadas (scikit-learn, XGBoost, LightGBM, PyTorch, TensorFlow, Spark MLlib).

**Modelos em Unity Catalog vs. Workspace Registry:** a abordagem recomendada é registrar modelos no **Unity Catalog** (`catalog.schema.modelo`), que usa **aliases** (ex.: `@champion`, `@challenger`) em lugar dos antigos **stages** (`Staging`, `Production`, `Archived`) do workspace registry. Aliases são mutáveis e apontam para versões específicas.

```python
import mlflow
mlflow.set_registry_uri("databricks-uc")
mlflow.autolog()

with mlflow.start_run():
    modelo.fit(X, y)
    mlflow.log_metric("f1", f1)

mlflow.register_model("runs:/<run_id>/model", "prod.ml.churn")
```

**Vantagens do MLflow gerenciado no Databricks** sobre o open source: segurança corporativa, disaster recovery, criptografia com chaves gerenciadas pelo cliente e integração com o Unity Catalog em todos os recursos.

### 12.2 Databricks Runtime for ML

*"Clusters pré-configurados com scikit-learn, XGBoost, MLflow e outras bibliotecas de ML, além de suporte a frameworks de deep learning."* Evita a instalação manual de dependências. Requer modo de acesso **Dedicated**.

### 12.3 Feature Engineering / Feature Store em Unity Catalog

Permite *"fazer engenharia de features, gerenciar features no Unity Catalog e servir features em produção"*. Qualquer tabela Delta do UC com chave primária pode funcionar como feature table. Benefícios: reuso entre modelos, **linhagem entre feature e modelo**, e resolução do **training-serving skew** — o mesmo cálculo de feature usado no treino é aplicado na inferência, inclusive em endpoints online.

### 12.4 AutoML

Gera automaticamente baselines para classificação, regressão e forecasting. Diferencial: produz **notebooks editáveis com o código de cada experimento** ("glass box"), em vez de um modelo opaco, permitindo que o cientista de dados parta de um ponto pronto e refine.

### 12.5 Mosaic AI Model Serving

Expõe modelos como **endpoints REST** com escala automática.

| Tipo de endpoint | Descrição |
|---|---|
| **Custom models** | *"Modelos Python empacotados no formato MLflow"*: scikit-learn, XGBoost, PyTorch, Hugging Face transformers |
| **Foundation Model APIs — pay-per-token** | Modelos base hospedados pela Databricks (ex.: família Llama, Mistral), cobrados por token |
| **Foundation Model APIs — provisioned throughput** | Para cargas que exigem garantia de performance e para variantes fine-tuned |
| **External models** | Roteamento governado para provedores terceiros (OpenAI, Anthropic, etc.) |

**Performance declarada:** mais de **25 mil consultas por segundo** com overhead de latência **inferior a 50 ms**.

Recursos operacionais típicos: **scale-to-zero** para endpoints de baixo uso, **inference tables** (log automático de requisições/respostas em tabela Delta para auditoria e monitoramento), **divisão de tráfego** entre versões (A/B), suporte a CPU e GPU.

### 12.6 AI Gateway

Camada de governança sobre endpoints: *"rastrear e definir limites de uso e monitorar a qualidade de todos os tipos de modelos"*. Funções típicas: rate limiting por usuário/endpoint, **payload logging**, controle de permissões, fallback entre provedores e guardrails de segurança.

### 12.7 Mosaic AI Vector Search (AI Search)

Banco vetorial gerenciado e integrado ao Unity Catalog.

**Tipos de índice:**

| Tipo | Como funciona |
|---|---|
| **Delta Sync com embeddings gerenciados** | A Databricks calcula os embeddings usando o modelo que você especifica e mantém o índice sincronizado com a tabela Delta |
| **Delta Sync com embeddings auto-gerenciados** | Você fornece os embeddings já calculados na tabela Delta; a sincronização é automática. **Não é possível converter um índice self-managed em managed** |
| **Direct Vector Access** | Atualização manual via API; sem sincronização automática |

**Tipos de endpoint:**

| Endpoint | Capacidade |
|---|---|
| **Standard** | ~320 milhões de vetores a 768 dimensões; alto QPS; sync **contínuo ou triggered** |
| **Storage-optimized** | Mais de 1 bilhão de vetores; indexação 10–20× mais rápida; latência de consulta ~250 ms maior; **apenas sync triggered** |

**Algoritmo:** HNSW (Hierarchical Navigable Small World) para busca aproximada de vizinhos mais próximos (ANN), com métrica de distância **L2**.

**Busca:** similaridade vetorial, **busca híbrida keyword + vetorial**, full-text com **Okapi BM25**, filtros de metadados e reranking.

**Requisitos:** workspace com Unity Catalog, compute **serverless** habilitado, **Change Data Feed habilitado** na tabela fonte (endpoints standard) e privilégio `CREATE TABLE` para criar o índice.

### 12.8 Mosaic AI Agent Framework e Agent Evaluation

- **Agent Framework**: biblioteca para construir agentes (RAG, tool-calling, multiagente) empacotados como modelos MLflow e servidos via Model Serving, com tracing automático.
- **Agent Evaluation**: avaliação com juízes de LLM e métricas de qualidade (relevância, fundamentação/groundedness, segurança), além de coleta de feedback humano via app de revisão.
- Padrão recomendado de RAG no Databricks: documentos em **Volumes** → parsing e chunking → embeddings → **Vector Search index** → agente com **Agent Framework** → avaliação com **Agent Evaluation** → deploy no **Model Serving** com **AI Gateway** → monitoramento por **inference tables**.

### 12.9 AI Functions (SQL)

Funções SQL que trazem IA para dentro da consulta, sem sair do warehouse.

| Categoria | Funções |
|---|---|
| Uso geral | **`ai_query`** — prompt customizado e escolha do modelo |
| Documentos | `ai_parse_document`, `ai_extract`, `ai_classify`, `ai_prep_search`, `ai_search`, `ai_enrich` |
| Transformação de texto | `ai_fix_grammar`, `ai_translate`, `ai_summarize`, `ai_mask` |
| Análise de texto | `ai_analyze_sentiment`, `ai_similarity` |
| Geração | `ai_gen` |
| Séries temporais | `ai_forecast` |
| Métricas | `ai_top_drivers` |
| Busca vetorial | `vector_search` |

```sql
SELECT id,
       ai_analyze_sentiment(comentario) AS sentimento,
       ai_summarize(comentario, 20)     AS resumo
FROM prod.gold.avaliacoes;
```

**Requisitos e custo:** **não disponíveis em SQL warehouse Classic**; exigem **DBR 15.4 LTS ou superior**. Funções task-specific rodam em infraestrutura **serverless GPU gerenciada** e geram custo de Model Serving além do compute. Para inferência em lote, a orientação é *"submeter o dataset completo em uma única consulta em vez de dividir manualmente em pequenos lotes"*. No faturamento, `ai_parse_document`, `ai_extract` e `ai_classify` aparecem sob o produto `AI_FUNCTIONS`; as demais sob `MODEL_SERVING`.

### 12.10 Lakehouse Monitoring

Monitora qualidade de dados e de modelos ao longo do tempo, gerando tabelas de métricas e um dashboard automático. Três tipos de perfil: **snapshot** (estado atual da tabela), **time series** (métricas por janela temporal) e **inference** (qualidade de modelo, com drift de features e de previsões, e métricas de acurácia quando há ground truth).

### 12.11 Fatos verificáveis — Seção 12

- MLflow organiza o rastreamento em experiments e runs.
- `mlflow.autolog()` registra automaticamente parâmetros, métricas e artefatos.
- Modelos registrados no Unity Catalog usam aliases (como @champion) em vez dos stages do workspace registry.
- Modelos no Unity Catalog seguem o namespace de três níveis `catalog.schema.modelo`.
- MLflow Tracing registra entradas, saídas e metadados de cada etapa intermediária de uma aplicação GenAI.
- O Databricks Runtime for ML já inclui scikit-learn, XGBoost, MLflow e frameworks de deep learning.
- AutoML gera notebooks editáveis com o código dos experimentos (abordagem "glass box").
- Feature Store no Unity Catalog ajuda a evitar training-serving skew.
- Model Serving oferece endpoints para modelos customizados, Foundation Model APIs (pay-per-token e provisioned throughput) e modelos externos.
- Model Serving suporta mais de 25 mil consultas por segundo com overhead de latência inferior a 50 ms.
- Inference tables registram automaticamente requisições e respostas dos endpoints.
- AI Gateway provê rate limiting, logging de payload e monitoramento de qualidade dos endpoints.
- Vector Search oferece três tipos de índice: Delta Sync com embeddings gerenciados, Delta Sync com embeddings auto-gerenciados e Direct Vector Access.
- Não é possível converter um índice de embeddings auto-gerenciados em gerenciado pela Databricks.
- Endpoints standard do Vector Search suportam cerca de 320 milhões de vetores a 768 dimensões; storage-optimized, mais de 1 bilhão.
- Endpoints storage-optimized suportam apenas sincronização triggered.
- Vector Search usa o algoritmo HNSW e a métrica de distância L2.
- Vector Search exige Change Data Feed habilitado na tabela fonte para endpoints standard.
- Vector Search suporta busca híbrida keyword-vetorial com pontuação Okapi BM25.
- `ai_query` é a função de uso geral; `ai_analyze_sentiment`, `ai_translate`, `ai_summarize`, `ai_mask`, `ai_forecast` e `ai_parse_document` são task-specific.
- AI Functions não estão disponíveis em SQL warehouses Classic e exigem DBR 15.4 LTS ou superior.
- Lakehouse Monitoring oferece perfis snapshot, time series e inference.

---

## 13. Desenvolvimento, Git e CI/CD

### 13.1 Notebooks

**Linguagens suportadas:** Python, SQL, Scala e R, com syntax highlighting e autocomplete.

**Magic commands (comandos mágicos):**

| Comando | Função |
|---|---|
| `%python`, `%sql`, `%scala`, `%r` | Troca a linguagem de uma célula específica |
| `%md` | Célula de markdown |
| `%sh` | Shell no **driver** (não nos workers) |
| `%fs` | Atalho para `dbutils.fs` |
| `%pip` | Instala biblioteca no escopo do notebook (reinicia o interpretador Python) |
| `%run ./outro_notebook` | **Executa outro notebook no mesmo contexto**, compartilhando variáveis e funções |

**`%run` vs. `dbutils.notebook.run()`** — distinção clássica de prova:

| | `%run` | `dbutils.notebook.run()` |
|---|---|---|
| Contexto | **Mesmo** contexto/sessão | Contexto **separado** (novo job) |
| Variáveis | Compartilhadas com o chamador | Isoladas; retorno só por `dbutils.notebook.exit()` |
| Parâmetros | Não aceita | Aceita dicionário de parâmetros e timeout |
| Uso típico | Reuso de funções e configs | Orquestração simples entre notebooks |

**Recursos adicionais:** coautoria em tempo real, comentários, histórico de versões, debugger interativo, visualizações nativas, dashboards a partir dos resultados, exportação/importação, widgets e o Databricks Assistant.

### 13.2 dbutils (Databricks Utilities)

| Módulo | Comandos principais |
|---|---|
| `dbutils.fs` | `ls`, `cp`, `mv`, `rm`, `mkdirs`, `mount`, `head`, `put` |
| `dbutils.secrets` | `get`, `list`, `listScopes` |
| `dbutils.widgets` | `text`, `dropdown`, `combobox`, `multiselect`, `get`, `remove`, `removeAll` |
| `dbutils.notebook` | `run`, `exit` |
| `dbutils.jobs.taskValues` | `get`, `set` |
| `dbutils.data` | `summarize` (preview) |
| `dbutils.library` | Depreciado (use `%pip`) |
| `dbutils.credentials` | Gerenciamento de roles IAM |

**Segredos:** *"Administradores, criadores do segredo e usuários com permissão podem ler segredos do Databricks."* Valores aparecem como **`[REDACTED]`** em notebooks — mas a redação é uma proteção contra exibição acidental, **não** contra exfiltração deliberada por quem tem permissão de leitura.

**Limitações:** `dbutils` só está disponível em ambientes com DBFS habilitado, e **chamar `dbutils` dentro dos executores gera erro** (ele é uma API do driver). Em Python, as palavras-chave usam `snake_case`.

**Widgets** parametrizam notebooks e são o mecanismo pelo qual parâmetros de job chegam ao código:

```python
dbutils.widgets.text("data_ref", "2026-09-01")
data_ref = dbutils.widgets.get("data_ref")
```

### 13.3 Databricks Git folders (ex-Repos)

*"Um cliente Git visual e uma API que integra repositórios Git ao workspace."* Provedores suportados incluem GitHub, GitHub Enterprise, GitLab, Bitbucket, Azure DevOps e AWS CodeCommit.

Operações disponíveis pela UI: clone, criar branch, commit, push, pull, merge, rebase e reset. Suporta **sparse checkout** para repositórios grandes e é a base dos fluxos de CI/CD junto com service principals e Terraform.

Boa prática: **jobs de produção devem apontar para um Git folder em uma branch/tag específica** (ou ser implantados por bundle), nunca para notebooks soltos no workspace.

### 13.4 Databricks Asset Bundles / Declarative Automation Bundles

Bundles descrevem **recursos do Databricks como arquivos-fonte versionados**, permitindo source control, code review, testes e CI/CD.

**Conteúdo de um bundle:** configurações de infraestrutura e workspace, arquivos-fonte (notebooks, `.py`), definições de recursos e testes.

**Recursos suportados:** Lakeflow Jobs, Lakeflow pipelines, dashboards, endpoints de Model Serving, MLflow experiments e modelos registrados.

**Arquivo principal:** `databricks.yml`, acompanhado de arquivos de recursos.

```yaml
bundle:
  name: pipeline_vendas

targets:
  dev:
    mode: development
    default: true
    workspace:
      host: https://<workspace>.cloud.databricks.com
  prod:
    mode: production
    workspace:
      host: https://<workspace>.cloud.databricks.com
    run_as:
      service_principal_name: sp-etl-prod

resources:
  jobs:
    etl_vendas:
      name: etl_vendas_${bundle.target}
      tasks:
        - task_key: bronze
          notebook_task:
            notebook_path: ./src/bronze.py
```

**Comandos do CLI:**

```bash
databricks bundle init        # cria a partir de template, com setup guiado
databricks bundle validate    # valida a configuração
databricks bundle deploy -t prod
databricks bundle run etl_vendas -t prod
databricks bundle destroy -t dev
```

**Pré-requisitos:** Databricks CLI **v0.218.0 ou superior**, workspace files habilitados (padrão a partir do DBR 11.3 LTS) e autenticação **OAuth U2M** recomendada.

**Casos de uso ideais:** desenvolvimento em equipe de projetos de dados/analytics/ML, iteração mais rápida de ML com recursos prontos para produção, padronização organizacional via templates customizados e rastreabilidade de infraestrutura para conformidade regulatória.

### 13.5 Ferramentas de desenvolvimento

| Ferramenta | Uso |
|---|---|
| **Databricks CLI** | Interação por linha de comando; base dos bundles |
| **SDKs** | Python, Java, Go, JavaScript, R |
| **REST API** | Automação completa da plataforma |
| **Databricks Connect** | Conectar IDE/aplicação local a um cluster remoto (baseado em Spark Connect) |
| **Extensões de IDE** | Visual Studio Code, Cursor, PyCharm/IntelliJ |
| **Terraform provider** | Infraestrutura como código (workspaces, clusters, permissões, UC) |
| **Drivers SQL** | JDBC, ODBC, conector SQL para Python, SQL Execution API |
| **SSH tunnel / Sandbox** | Cenários de desenvolvimento avançado |
| **dbx** | Ferramenta antiga de deploy — **substituída por Asset Bundles** |

### 13.6 Padrão de CI/CD

Fluxo de referência:

1. Desenvolvedor trabalha em um **Git folder** ou em IDE com **Databricks Connect**.
2. Commit e pull request no provedor Git; testes unitários rodam no CI (pytest sobre funções puras, `databricks bundle validate`).
3. Pipeline de CI executa **`databricks bundle deploy -t dev`** e roda testes de integração em um workspace de dev.
4. Aprovação do PR → **`databricks bundle deploy -t prod`** executado por um **service principal** (não por um usuário).
5. Ambientes separados por **catálogos do UC** (`dev`, `staging`, `prod`) com **workspace bindings**.

Boas práticas: promova **código**, não dados; jobs de produção rodam como **service principal**; segredos em **secret scopes** (ou Databricks-backed/KeyVault-backed), nunca em notebooks; parametrize o catálogo por target do bundle.

### 13.7 Fatos verificáveis — Seção 13

- Notebooks Databricks suportam Python, SQL, Scala e R.
- `%run` executa outro notebook no mesmo contexto, compartilhando variáveis; `dbutils.notebook.run()` executa em contexto separado e aceita parâmetros.
- `%sh` executa comandos shell no nó driver.
- `%pip` instala bibliotecas no escopo do notebook.
- `dbutils.widgets` cria widgets do tipo text, dropdown, combobox e multiselect.
- `dbutils.secrets.get` recupera segredos, exibidos como `[REDACTED]` nos notebooks.
- `dbutils.notebook.exit()` devolve um valor ao notebook chamador.
- `dbutils.jobs.taskValues` compartilha valores entre tasks de um job.
- Chamar `dbutils` dentro dos executores gera erro.
- `dbutils.library` está depreciado em favor de `%pip`.
- Databricks Repos foi renomeado para Git folders e suporta clone, commit, push, pull, branch, merge, rebase e reset.
- Git folders suportam sparse checkout para repositórios grandes.
- Asset Bundles usam o arquivo `databricks.yml` e gerenciam jobs, pipelines, dashboards, endpoints de serving, experimentos e modelos.
- Os comandos principais de bundle são init, validate, deploy, run e destroy.
- Asset Bundles exigem Databricks CLI v0.218.0 ou superior.
- Bundles têm targets (por exemplo dev e prod) com modos development e production.
- dbx foi substituído pelos Asset Bundles.
- Databricks Connect permite conectar uma IDE local a compute remoto e é baseado em Spark Connect.
- Jobs de produção devem rodar como service principal, não como usuário nominal.
---

## 14. Segurança, identidade e compliance

### 14.1 Identidade

| Entidade | Descrição |
|---|---|
| **User** | Pessoa física, identificada por e-mail |
| **Group** | Agrupamento de usuários, service principals e outros grupos; **unidade recomendada para conceder permissões** |
| **Service principal** | Identidade não humana para automação, jobs de produção e CI/CD |

- **SCIM** provisiona e desprovisiona usuários e grupos automaticamente a partir do provedor de identidade (Entra ID, Okta, OneLogin…).
- **SSO** via SAML/OIDC, com suporte a **MFA**; integrações citadas na documentação: Microsoft Entra ID, Okta e AWS IAM Identity Center.
- **Identity federation**: identidades são gerenciadas no **nível da conta** e atribuídas aos workspaces, em vez de duplicadas por workspace.
- **Grupos de conta vs. grupos de workspace**: grupos de conta podem receber permissões no Unity Catalog; grupos locais de workspace, não.

### 14.2 Autenticação programática

| Método | Uso |
|---|---|
| **OAuth U2M** (user-to-machine) | Desenvolvimento local, CLI, IDE — **recomendado** |
| **OAuth M2M** (machine-to-machine) | Service principals em CI/CD e automação — **recomendado** |
| **Personal Access Token (PAT)** | Legado; ainda comum, porém menos seguro (token longo, difícil de rotacionar) |

### 14.3 Segredos

- **Secret scopes** agrupam segredos. Dois tipos: **Databricks-backed** e **backed por cofre externo** (Azure Key Vault).
- Acesso via `dbutils.secrets.get(scope, key)` ou referência em configuração Spark/variável de ambiente (`{{secrets/escopo/chave}}`).
- **Credential redaction**: a plataforma redige automaticamente credenciais de logs e saídas.
- Regra de ouro: **nunca** escreva credenciais em notebooks, parâmetros de job ou código versionado.

### 14.4 Rede

| Controle | Função |
|---|---|
| **Customer-managed VPC/VNet** | Deploy do compute plane clássico na rede do cliente, com controle de sub-redes e security groups |
| **Private Link / Private endpoints** | Conectividade privada entre usuários e workspace, e entre workspace e control plane, sem trafegar pela internet pública |
| **IP access lists** | Restringem de quais IPs se pode acessar o workspace |
| **Serverless egress control / firewall** | Políticas de saída e regras de firewall para o compute serverless |
| **Encryption in transit entre nós** | Criptografia do tráfego entre nós do cluster |

### 14.5 Criptografia

- Dados em repouso no object storage com criptografia da nuvem por padrão.
- **Customer-managed keys (CMK)**: chaves do próprio cliente para dados gerenciados e para o storage do workspace.
- **Local disk encryption**: gera chave única por nó; a documentação alerta que as cargas *"podem rodar mais lentamente por causa do impacto de performance"*.

### 14.6 Auditoria e compliance

- **Audit logs** cobrem ações no workspace e na conta; disponíveis em `system.access.audit`.
- **Compliance security profile**: perfis endurecidos para HIPAA, PCI-DSS, FedRAMP; inclui restrições de imagem, patching acelerado e monitoramento.
- **Enhanced Security Monitoring**: *"capacidades avançadas de monitoramento para detectar anomalias e ameaças de segurança"*.
- **AWS GovCloud (FedRAMP High)** é suportado.

### 14.7 Boas práticas de segurança

- Conceda permissões a **grupos**, nunca a usuários individuais.
- Atribua **ownership de objetos do UC a grupos**.
- Use **catálogos separados por ambiente** com **workspace bindings** para impedir que dev alcance prod.
- Rode produção com **service principals** e OAuth M2M.
- Aplique **column masks** e **row filters** para PII em vez de criar cópias filtradas das tabelas.
- Marque dados sensíveis com **tags** e use **ABAC** para políticas em escala.
- Prefira **external locations + storage credentials** a mounts do DBFS.
- Habilite **audit logs** e monitore as system tables desde o início.
- Aplique o princípio do **menor privilégio**: lembre-se de que `USE CATALOG`/`USE SCHEMA` são fronteiras — negar `USE SCHEMA` bloqueia o acesso mesmo com `SELECT` concedido.

### 14.8 Fatos verificáveis — Seção 14

- SCIM provisiona usuários e grupos automaticamente a partir do provedor de identidade.
- Identity federation gerencia identidades no nível da conta e as atribui a workspaces.
- Apenas grupos de conta (não grupos locais de workspace) podem receber permissões no Unity Catalog.
- OAuth U2M é recomendado para desenvolvimento local e OAuth M2M para automação.
- Personal Access Tokens são o método legado de autenticação.
- Secret scopes podem ser Databricks-backed ou respaldados por um cofre externo como o Azure Key Vault.
- Valores de segredos são exibidos como `[REDACTED]` e a plataforma redige credenciais de logs automaticamente.
- IP access lists restringem os endereços que podem acessar o workspace.
- Private Link permite conectividade privada sem passar pela internet pública.
- Local disk encryption pode reduzir o desempenho das cargas.
- Audit logs estão disponíveis na system table `system.access.audit`.
- O compliance security profile oferece perfis para HIPAA, PCI-DSS e FedRAMP.
- Permissões devem ser concedidas a grupos, e o ownership de objetos do UC deve ficar com grupos.

---

## 15. Performance: otimização de consultas e layout de dados

### 15.1 Otimizações habilitadas por padrão (DBR 10.4 LTS+)

| Otimização | O que faz |
|---|---|
| **Disk cache** (ex-Delta cache) | *"Acelera leituras repetidas contra arquivos Parquet carregando dados em volumes de disco (SSD) anexados aos clusters"* |
| **Dynamic file pruning (DFP)** | *"Melhora a performance pulando diretórios/arquivos que não contêm dados correspondentes aos predicados"*, inclusive em joins |
| **Low shuffle merge** | Reduz o número de arquivos reescritos por `MERGE` e a necessidade de reexecutar `OPTIMIZE` depois |
| **Adaptive Query Execution (AQE)** | Recurso do Spark 3.0 que re-otimiza o plano **em tempo de execução** com estatísticas reais |

**O que o AQE faz:** coalesce dinâmico de partições pós-shuffle, troca de estratégia de join (para broadcast) quando o tamanho real é menor que o estimado, e **otimização de skew join** (divide partições enviesadas).

### 15.2 Camadas de cache

| Cache | Escopo | Recomendação |
|---|---|---|
| **Disk cache** | Por cluster, em SSD local | Ativo por padrão; muito eficaz |
| **Query result cache** | Resultados de consultas determinísticas com dados Delta inalterados | Aproveite; invalidado quando a tabela muda |
| **SQL UI result cache** | Por usuário, na interface do Databricks SQL | Automático |
| **Spark cache (`.cache()` / `.persist()`)** | Memória do executor | **Evitar** — *"minimize o uso de `.persist()`, pois pode consumir memória e deixar consultas mais lentas"* |

### 15.3 Otimizações recomendadas (não automáticas)

- **Cost-Based Optimizer (CBO)**: acelera consultas usando estatísticas de tabela; alimente com `ANALYZE TABLE ... COMPUTE STATISTICS`.
- **Range join optimization**: dicas manuais para joins por intervalo (`/*+ RANGE_JOIN(t, 100) */`).
- **Higher-order functions**: *"performance otimizada para operações que não têm operador Spark comum"*, com vantagem sobre UDFs.
- **Predictive optimization**: manutenção automática (ver 15.5).
- **Bloom filter indexes**: **depreciados**, em favor de Predictive I/O ou liquid clustering.

### 15.4 Layout de dados

Ordem de decisão recomendada para uma tabela nova:

1. **Liquid clustering** nas colunas mais usadas em filtros e joins (até 4) — ou `CLUSTER BY AUTO`.
2. **Não particionar** se a tabela tem menos de ~1 TB.
3. Se particionar, garantir **≥ 1 GB por partição** e baixa cardinalidade da chave.
4. Habilitar **optimized writes** e **auto compact**.
5. Garantir que colunas de filtro estejam entre as **primeiras 32 colunas** (limite padrão de estatísticas de data skipping) ou ajustar `delta.dataSkippingNumIndexedCols`.
6. Rodar `ANALYZE TABLE` para o CBO.

### 15.5 Predictive optimization

Executa automaticamente três operações de manutenção em **tabelas managed do Unity Catalog** (Delta e Iceberg):

| Operação | Efeito |
|---|---|
| `OPTIMIZE` | Compacta arquivos e faz **clustering incremental** nas tabelas habilitadas |
| `VACUUM` | Remove *"arquivos de dados não mais referenciados pela tabela"* |
| `ANALYZE` | Coleta estatísticas para melhorar a performance das consultas |

- **Não suporta** tabelas external nem tabelas recebidas via compartilhamento.
- **Habilitado por padrão em contas criadas a partir de 11 de novembro de 2024**; rollout gradual para contas existentes até agosto de 2026.
- Configurável por herança nos níveis conta → catálogo → schema → tabela (`ALTER ... ENABLE/DISABLE PREDICTIVE OPTIMIZATION`).
- Executa em **compute serverless**, faturado no SKU de serverless jobs; requer plano **Premium ou superior** e região suportada.
- Benefício declarado: *"elimina execuções de manutenção desnecessárias e o ônus de rastrear e resolver performance manualmente"*.

### 15.6 Photon

Motor nativo vetorizado que entrega *"performance de consulta rápida a baixo custo"* sem alteração de código. Acelera SQL e operações de DataFrame; é onde a maior parte do ganho de Delta/Parquet acontece. Nem toda operação é "fotonizada" — quando uma parte do plano não é suportada, ela cai para o motor Spark tradicional (visível no query profile). Photon custa mais DBU por hora, mas costuma reduzir o custo total ao encurtar a execução.

### 15.7 Escalabilidade

| Conceito | Definição |
|---|---|
| **Vertical scaling** | Adicionar recursos a uma única máquina (nó maior) |
| **Horizontal scaling** | Adicionar nós ao sistema distribuído |
| **Linear scalability** | Ganho de throughput proporcional aos recursos adicionados |

Regra prática: cargas com muito shuffle e memória escassa se beneficiam de **nós maiores** (vertical); cargas embaraçosamente paralelas se beneficiam de **mais nós** (horizontal).

### 15.8 Teste e monitoramento de performance

- Teste com dados **representativos de produção** em volume, layout de arquivos e skew.
- Use **prewarming** com pools e consultas de aquecimento de cache para eliminar o efeito de cold start nas primeiras consultas.
- Diagnostique com **query profile**, **Spark UI**, **system tables** (utilização de cluster, histórico de consulta) e **live metrics** do SQL warehouse.
- Para streaming, acompanhe via Spark UI e `StreamingQueryListener`.

### 15.9 Checklist de tuning (ordem prática)

1. A consulta está em um SQL warehouse **serverless/pro com Photon**?
2. A tabela é **managed do UC** com **predictive optimization** ativa?
3. O layout usa **liquid clustering** nas colunas de filtro?
4. Existem **arquivos pequenos demais**? (`OPTIMIZE`, auto compact, optimized writes)
5. Há **UDFs Python** no caminho crítico? Substitua por funções nativas.
6. O **query profile** mostra shuffle dominante? Avalie broadcast e revisão de joins.
7. Há **skew**? AQE está ligado? Considere salting.
8. As **estatísticas** estão atualizadas (`ANALYZE TABLE`)?
9. O cluster está **superdimensionado ou subdimensionado** para o volume real?
10. Há `.cache()`/`.persist()` desnecessário consumindo memória?

### 15.10 Fatos verificáveis — Seção 15

- Disk cache, dynamic file pruning, low shuffle merge e Adaptive Query Execution são habilitados por padrão a partir do DBR 10.4 LTS.
- AQE re-otimiza o plano em tempo de execução, faz coalesce de partições, converte joins em broadcast e trata skew.
- Databricks recomenda evitar `.persist()` e `.cache()` do Spark, preferindo o disk cache.
- Bloom filter indexes estão depreciados em favor de Predictive I/O e liquid clustering.
- Predictive optimization executa OPTIMIZE, VACUUM e ANALYZE automaticamente.
- Predictive optimization só funciona em tabelas managed do Unity Catalog e roda em compute serverless.
- Predictive optimization é habilitada por padrão em contas criadas a partir de 11 de novembro de 2024.
- Predictive optimization requer plano Premium ou superior.
- Photon acelera SQL e DataFrame sem exigir mudança de código.
- Estatísticas de data skipping cobrem as primeiras 32 colunas por padrão.
- `ANALYZE TABLE ... COMPUTE STATISTICS` alimenta o otimizador baseado em custo.
- Higher-order functions são preferíveis a UDFs para operações sem operador Spark nativo.
- Prewarming com pools e cache elimina o impacto do cold start nos testes de performance.

---

## 16. Gestão de custos (FinOps no Databricks)

### 16.1 Modelo de cobrança

O custo tem **duas componentes independentes**:

1. **DBU (Databricks Unit)** — unidade de consumo de processamento por hora, faturada pela Databricks. O preço por DBU varia conforme o **SKU** (all-purpose, jobs, DLT/pipelines, SQL, serving) e o **plano** (Standard, Premium, Enterprise).
2. **Infraestrutura de nuvem** — VMs, storage, rede, faturadas pelo provedor (AWS/Azure/GCP). No serverless, essa parte é embutida no preço da Databricks.

Consequência prática: um cluster ocioso e ligado custa VM (nuvem) **e** DBU. Um pool ocioso custa VM, mas **não** DBU.

### 16.2 Escolher recursos ótimos

- **Use Delta Lake** em vez de Parquet/ORC/JSON — acelera as cargas *"significativamente"* e reduz o tempo de compute.
- **Use jobs compute** para cargas não interativas: *"custarão significativamente menos do que em all-purpose compute"*.
- **Use SQL warehouses serverless** para SQL interativo: disponibilidade instantânea, terminação por ociosidade e escala em segundos, não minutos.
- **Mantenha o DBR atualizado**: versões novas trazem *"melhorias de performance entre releases maiores"* que viram economia.
- **GPU só quando há bibliotecas aceleradas por GPU** — instâncias GPU são substancialmente mais caras.
- **Escolha famílias de instância adequadas**: memória otimizada para ML, compute otimizado para streaming; gerações mais novas (ex.: Graviton na AWS) têm melhor preço-performance.
- **Photon** costuma gerar *"economia significativa"* em jobs que rodam com regularidade.

**Dimensionamento sugerido pela documentação:**

| Cenário | Workers |
|---|---|
| Ambiente de desenvolvimento | 2 a 4 |
| ETL em lote | 8 a 16 |
| Streaming | 4 a 8 |

### 16.3 Alocar recursos dinamicamente

- **Autoscaling**: adiciona workers nas fases pesadas e remove depois.
- **Auto-termination**: desligar após ociosidade (recomendação de no mínimo ~1 hora para interativo); processos agendados podem religar o compute no horário comercial.
- **Cluster pools**: reduzem o tempo de partida e de escala; **sem cobrança de DBU enquanto ociosos**.
- **Compute policies**: forçam autoscaling e auto-termination, restringem VMs caras e aplicam estratégias de spot em toda a organização.

### 16.4 Monitorar e controlar

- **Tagging desde o dia 1**, com tags mínimas para **Business Unit**, **Project** e **Environment** (dev/QA/prod).
- **Budget alerts**: notificação por e-mail ao atingir o orçamento mensal.
- **Ferramentas**: dashboards de custo da Databricks, **system tables** (`system.billing.usage`, `system.billing.list_prices`) e REST APIs para acompanhar serverless, jobs e model serving.
- O **usage dashboard** (versão 2.0) inclui **previsão de custo** e drill-down por objeto; permite filtrar por produto, nome de SKU e **tags customizadas**.
- Para importar os dashboards de uso é preciso `SELECT` em `system.billing.usage` e `system.billing.list_prices`.
- **Auditorias periódicas**: revisar recursos ativos, relatórios mensais e educar os times sobre impacto de custo.

```sql
-- custo aproximado por tag de projeto nos últimos 30 dias
SELECT u.custom_tags['Project'] AS projeto,
       SUM(u.usage_quantity * p.pricing.default) AS custo_estimado
FROM system.billing.usage u
JOIN system.billing.list_prices p
  ON u.sku_name = p.sku_name
WHERE u.usage_date >= current_date() - INTERVAL 30 DAYS
GROUP BY 1
ORDER BY 2 DESC;
```

### 16.5 Desenhar cargas econômicas

- **Streaming**: use *"Structured Streaming com o trigger `AvailableNow` para cargas incrementais que não têm requisitos de baixa latência"*, reduzindo compute 24/7.
- **Spot instances**: aproveite capacidade excedente para cargas tolerantes a interrupção; **mantenha o driver em on-demand**; considere *fleet instance types* para otimização automática de preço.
- **Frequência de ingestão**: cada aumento de frequência multiplica o custo — ajuste ao requisito real de negócio.
- **Serverless para pipelines e jobs curtos**: elimina o custo de startup ocioso e o tempo de espera.

### 16.6 Fatos verificáveis — Seção 16

- DBU (Databricks Unit) é a unidade de consumo faturada pela Databricks, separada do custo de infraestrutura da nuvem.
- O preço por DBU varia conforme o SKU e o plano contratado.
- Jobs compute custa significativamente menos que all-purpose compute.
- Pools não cobram DBU enquanto as instâncias estão ociosas.
- A documentação sugere 2 a 4 workers para desenvolvimento, 8 a 16 para ETL em lote e 4 a 8 para streaming.
- Recomenda-se auto-termination de pelo menos cerca de 1 hora para clusters interativos.
- Tags mínimas recomendadas: Business Unit, Project e Environment.
- `system.billing.usage` e `system.billing.list_prices` são as system tables de faturamento.
- O usage dashboard 2.0 inclui previsão de custo e drill-down por objeto.
- Usar `Trigger.AvailableNow` em vez de streaming contínuo reduz custo quando não há requisito de baixa latência.
- O driver deve permanecer em instância on-demand mesmo quando os workers usam spot.
- Manter o Databricks Runtime atualizado reduz custo por causa das melhorias de performance entre releases.

---

## 17. Boas práticas consolidadas por área

### 17.1 Pilares do Well-Architected Lakehouse

A Databricks organiza suas recomendações em sete pilares:

| Pilar | Foco |
|---|---|
| **Data governance** | Unity Catalog, menor privilégio, linhagem, auditoria |
| **Interoperability & usability** | Formatos abertos, padrões, descoberta |
| **Operational excellence** | Automação, CI/CD, observabilidade, IaC |
| **Security, privacy & compliance** | Identidade, rede, criptografia, conformidade |
| **Reliability** | Recuperação de falhas, testes, DR, qualidade de dados |
| **Performance efficiency** | Layout, cache, motor, dimensionamento |
| **Cost optimization** | Recurso certo, elasticidade, monitoramento, design |

### 17.2 Governança

- Um metastore por região; catálogos por ambiente e/ou domínio.
- Permissões **sempre a grupos**; ownership a grupos.
- **Workspace bindings** para isolar produção.
- Row filters e column masks em vez de cópias filtradas.
- Tags de classificação + ABAC para políticas em escala.
- Ative e consulte **system tables** desde o começo (auditoria, linhagem, custo).
- Documente tabelas e colunas com `COMMENT` — melhora descoberta, Assistant e Genie.

### 17.3 Engenharia de dados

- Medallion como padrão: Bronze imutável e fiel, Silver validada e deduplicada, Gold modelada para consumo.
- Ingestão por **Auto Loader** (arquivos) ou **Lakeflow Connect** (SaaS/bancos); `Trigger.AvailableNow` para incremental agendado.
- **Idempotência** em tudo: `MERGE` por chave, checkpoints por query, COPY INTO idempotente.
- Expectations desde a entrada; métricas de qualidade monitoradas.
- **Tabelas managed** por padrão + **predictive optimization**.
- **Liquid clustering** em vez de particionamento para tabelas novas.
- Reprocessamento possível a partir do Bronze — nunca dependa da fonte externa para reprocessar.
- Separe pipelines por domínio; evite o pipeline monolítico.

### 17.4 Desenvolvimento e operação

- Código em Git; jobs definidos em **Asset Bundles**; deploy por CI/CD com **service principal**.
- Notebooks para exploração; módulos `.py` testáveis para lógica de produção.
- Parametrização por widgets/job parameters, com catálogo variável por ambiente.
- Timeouts, retries e notificação de falha em todos os jobs.
- **Repair run** em vez de rerun completo.
- Ambientes dev/staging/prod isolados por catálogo e workspace.

### 17.5 Performance e custo

- Serverless por padrão quando disponível; jobs compute para o resto.
- Photon ligado; DBR LTS recente em produção.
- Autoscaling + auto-termination + policies obrigatórios.
- Arquivos grandes (~1 GB), poucos arquivos pequenos.
- Evitar UDFs Python; preferir SQL nativo, higher-order functions ou Pandas UDFs.
- Tagging e monitoramento de custo desde o primeiro dia.

### 17.6 IA/ML

- Experimentos com MLflow tracking e autolog; modelos no **Unity Catalog** com **aliases**.
- Features no **Feature Store do UC** para eliminar training-serving skew.
- Deploy via **Model Serving** com **inference tables** e **AI Gateway**.
- Monitoramento com **Lakehouse Monitoring** (perfil inference) para drift.
- Para RAG: documentos em Volumes, índice no Vector Search, agente com Agent Framework, avaliação com Agent Evaluation.

### 17.7 Antipadrões frequentes (o que **não** fazer)

| Antipadrão | Por quê |
|---|---|
| Rodar jobs de produção em all-purpose compute | Custo muito maior e falta de isolamento |
| Particionar tabelas pequenas por coluna de alta cardinalidade | Explosão de arquivos pequenos e perda de performance |
| Usar mounts do DBFS em vez de Volumes/external locations | Ignora a governança do Unity Catalog |
| Conceder permissões a usuários individuais | Ingovernável e frágil na rotatividade |
| Compartilhar um checkpoint entre streams | Corrompe estado e quebra as garantias de exactly-once |
| Desligar `retentionDurationCheck` para rodar VACUUM agressivo | Pode apagar arquivos em uso por leitores/jobs em andamento |
| UDF Python dentro de filtro em tabela grande | Impede pushdown e data skipping |
| `collect()` em DataFrame grande | Traz tudo para o driver e causa OOM |
| Escrever direto na Silver a partir da ingestão | Impede reprocessamento e gera falhas |
| Segredos hardcoded em notebooks | Vazamento garantido no Git |
| Ligar `ZORDER` e liquid clustering na mesma tabela | São incompatíveis |
| Depender de stages do workspace model registry | Modelo legado; use aliases no UC |

### 17.8 Fatos verificáveis — Seção 17

- O Well-Architected Lakehouse da Databricks tem sete pilares, incluindo governança de dados, confiabilidade, eficiência de performance e otimização de custo.
- Tabelas managed com predictive optimization são a recomendação padrão.
- Compartilhar um checkpoint entre queries de streaming quebra as garantias de exactly-once.
- Mounts do DBFS não respeitam a governança do Unity Catalog.
- `collect()` em DataFrames grandes traz os dados ao driver e pode causar erro de memória.

---

## 18. Certificações, comparativos e glossário

### 18.1 Certificações Databricks

**Certificações baseadas em papel (role-based):**

| Trilha | Níveis |
|---|---|
| Data Analyst | Associate |
| **Data Engineer** | **Associate** e **Professional** |
| **Machine Learning Engineer** | **Associate** e **Professional** |
| Generative AI Engineer | Associate |
| Context Engineer | Associate |
| Apache Spark Developer | Associate |

**Certificações de arquitetura e plataforma:** AWS Platform Architect, Azure Platform Architect, GCP Platform Architect e Platform Administrator.

**Badges gratuitos (fundamentos):** Lakehouse Fundamentals, Generative AI Fundamentals e AI Agent Fundamentals.

Descrições oficiais: o **Data Engineer Associate** *"avalia a capacidade de usar a Databricks Data + AI Platform para completar tarefas introdutórias de engenharia de dados"*; o **Professional**, *"tarefas avançadas de engenharia de dados"*. O **ML Engineer Associate** cobre *"tarefas básicas de machine learning"* e o **Professional**, *"machine learning avançado em produção"*.

Temas que dominam o exame de **Data Engineer Associate**: Lakehouse e arquitetura da plataforma, Delta Lake (time travel, OPTIMIZE, VACUUM, MERGE), ELT com Spark SQL e Python, arquitetura medallion, Auto Loader e COPY INTO, Lakeflow Declarative Pipelines (streaming tables, materialized views, expectations), Lakeflow Jobs e governança com Unity Catalog.

### 18.2 Comparativo com plataformas concorrentes

| Dimensão | **Databricks** | **Snowflake** | **Microsoft Fabric** | **Amazon EMR / Athena** |
|---|---|---|---|---|
| Origem | Spark / lakehouse | Data warehouse cloud-native | Suíte SaaS unificada da Microsoft | Serviço gerenciado de Hadoop/Spark |
| Formato de armazenamento | Delta Lake / Iceberg (abertos) | Formato interno + Iceberg | Delta Lake (OneLake) | Arquivos abertos em S3 |
| Compute | Spark + Photon, clusters e serverless | Virtual warehouses | Capacidades (CU) compartilhadas | Clusters EMR / Athena serverless |
| Governança | Unity Catalog | Horizon / RBAC do Snowflake | Purview + OneLake | Glue Data Catalog + Lake Formation |
| ML/IA nativo | Muito forte (MLflow, Mosaic AI) | Crescente (Snowpark, Cortex) | Integrado ao ecossistema Microsoft | Via SageMaker |
| Ponto forte | Engenharia de dados, ML e GenAI em escala; formatos abertos | SQL e simplicidade operacional | Integração com Power BI e Microsoft 365 | Flexibilidade e custo em cargas Spark puras |
| Trade-off típico | Curva de aprendizado maior; muitas opções de configuração | Menos flexível para ML e dados não estruturados | Menos maduro em engenharia avançada | Gestão de infraestrutura por conta do cliente |

### 18.3 Glossário

| Termo | Definição em uma linha |
|---|---|
| **ACID** | Atomicidade, Consistência, Isolamento e Durabilidade — garantias transacionais do Delta Lake |
| **AI Gateway** | Camada de governança de endpoints de modelos: rate limiting, logging e monitoramento |
| **AQE** | Adaptive Query Execution: re-otimização do plano Spark em tempo de execução |
| **Auto Loader** | Fonte `cloudFiles` para ingestão incremental de arquivos de object storage |
| **AutoML** | Geração automática de modelos baseline com notebooks editáveis |
| **Bronze / Silver / Gold** | Camadas da arquitetura medallion: raw, validada e curada |
| **Catalog** | Primeiro nível do namespace do Unity Catalog |
| **CDF (Change Data Feed)** | Registro de mudanças em nível de linha entre versões de uma tabela Delta |
| **Checkpoint (streaming)** | Diretório com offsets e estado que garante tolerância a falhas e exactly-once |
| **Checkpoint (Delta log)** | Snapshot Parquet do transaction log escrito a cada 10 commits |
| **Cluster policy** | Regra que restringe a configuração de compute por usuário ou grupo |
| **Compute plane** | Onde os dados são processados (clássico na conta do cliente, serverless na Databricks) |
| **Control plane** | Serviços de backend gerenciados pela Databricks |
| **DAB / Declarative Automation Bundle** | Definição versionada de recursos Databricks em YAML |
| **DBU** | Databricks Unit: unidade de consumo de processamento faturada por hora |
| **DBR** | Databricks Runtime: imagem com Spark, Delta e otimizações |
| **Deletion vector** | Metadado de soft delete que evita reescrever arquivos Parquet em DML |
| **Delta Lake** | Camada de armazenamento transacional sobre Parquet com transaction log |
| **Delta Sharing / OpenSharing** | Protocolo aberto de compartilhamento de dados entre organizações |
| **Disk cache** | Cache automático de dados Parquet em SSD local do cluster |
| **Expectation** | Regra de qualidade de dados declarada em um pipeline (warn, drop ou fail) |
| **External location** | Caminho de storage + storage credential registrados no Unity Catalog |
| **Feature Store** | Repositório governado de features com linhagem e serving |
| **Genie** | Experiência de perguntas em linguagem natural sobre dados governados |
| **Git folder** | Repositório Git integrado ao workspace (ex-Repos) |
| **HNSW** | Algoritmo de busca aproximada de vizinhos usado pelo Vector Search |
| **Instance pool** | Conjunto de instâncias pré-aquecidas que reduz o tempo de partida do cluster |
| **Lakeflow** | Guarda-chuva de ingestão, transformação e orquestração |
| **Lakeguard** | Mecanismo de isolamento entre usuários no modo de acesso Standard |
| **Lakehouse** | Arquitetura que une o baixo custo e a abertura do data lake com as garantias do data warehouse |
| **Liquid clustering** | Layout adaptativo que substitui particionamento e ZORDER (até 4 chaves) |
| **Materialized view** | Resultado de consulta persistido e mantido incrementalmente |
| **Medallion** | Arquitetura de camadas de qualidade (bronze, silver, gold) |
| **MERGE** | Comando de upsert do Delta Lake |
| **Metastore** | Contêiner de topo do Unity Catalog, tipicamente um por região |
| **MLflow** | Plataforma open source para o ciclo de vida de ML e IA |
| **OPTIMIZE** | Comando que compacta arquivos pequenos e aciona clustering |
| **Photon** | Motor de consulta vetorizado nativo em C++ |
| **Predictive optimization** | Manutenção automática (OPTIMIZE, VACUUM, ANALYZE) de tabelas managed do UC |
| **Query profile** | Visualização detalhada do plano e da execução de uma consulta |
| **Rescued data column** | Coluna `_rescued_data` que captura dados fora do schema esperado |
| **SCD Type 1 / Type 2** | Dimensão que sobrescreve vs. dimensão que mantém histórico |
| **Schema (UC)** | Segundo nível do namespace; equivalente a database |
| **Schema enforcement** | Rejeição de escritas incompatíveis com o schema da tabela |
| **Service principal** | Identidade não humana para automação e produção |
| **Shuffle** | Redistribuição de dados entre executores, exigida por transformações wide |
| **SQL warehouse** | Compute otimizado para SQL (serverless, pro ou classic) |
| **Streaming table** | Tabela que processa registros de fontes append-only exatamente uma vez |
| **System tables** | Tabelas operacionais somente leitura no catálogo `system` |
| **Time travel** | Consulta a versões anteriores de uma tabela Delta |
| **Transaction log** | Diretório `_delta_log` com o histórico de commits da tabela |
| **Trigger.AvailableNow** | Trigger que processa todo o dado disponível e encerra a query |
| **UniForm** | Recurso que expõe uma tabela Delta também como Apache Iceberg |
| **Unity Catalog** | Camada unificada de governança de dados e IA |
| **VACUUM** | Comando que remove arquivos obsoletos (retenção padrão de 7 dias) |
| **Volume** | Objeto do UC que governa dados não tabulares em `/Volumes/...` |
| **Widget** | Parâmetro interativo de notebook |
| **Workspace** | Ambiente regional de colaboração e execução |
| **Z-ORDER** | Técnica de colocalização multidimensional, substituída por liquid clustering |

### 18.4 Fatos verificáveis — Seção 18

- As certificações Data Engineer e Machine Learning Engineer têm níveis Associate e Professional.
- Generative AI Engineer, Data Analyst, Context Engineer e Apache Spark Developer têm nível Associate.
- Existem certificações de Platform Architect para AWS, Azure e GCP, além de Platform Administrator.
- Lakehouse Fundamentals, Generative AI Fundamentals e AI Agent Fundamentals são badges gratuitos.
- Databricks armazena dados em formatos abertos (Delta Lake e Apache Iceberg), diferentemente do formato interno proprietário de data warehouses tradicionais.

---

## Fontes

- Databricks Documentation — portal geral: <https://www.databricks.com/databricks-documentation>
- Databricks on AWS — documentação: <https://docs.databricks.com/aws/en/>
- Visão geral da plataforma e arquitetura: <https://docs.databricks.com/aws/en/getting-started/overview>
- O que é um data lakehouse: <https://docs.databricks.com/aws/en/lakehouse/>
- Compute (visão geral e configuração): <https://docs.databricks.com/aws/en/compute/> · <https://docs.databricks.com/aws/en/compute/configure>
- SQL warehouses (tipos e criação): <https://docs.databricks.com/aws/en/compute/sql-warehouse/warehouse-types> · <https://docs.databricks.com/aws/en/compute/sql-warehouse/create>
- Databricks Runtime — release notes: <https://docs.databricks.com/aws/en/release-notes/runtime/>
- Apache Spark no Databricks: <https://docs.databricks.com/aws/en/spark/>
- Delta Lake: <https://docs.databricks.com/aws/en/delta/> · VACUUM: <https://docs.databricks.com/aws/en/delta/vacuum> · Liquid clustering: <https://docs.databricks.com/aws/en/delta/clustering>
- Unity Catalog: <https://docs.databricks.com/aws/en/data-governance/unity-catalog/> · Privilégios: <https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges>
- Tabelas managed: <https://docs.databricks.com/aws/en/tables/managed> · Volumes: <https://docs.databricks.com/aws/en/volumes/>
- Delta Sharing / OpenSharing: <https://docs.databricks.com/aws/en/delta-sharing/> · Lakehouse Federation: <https://docs.databricks.com/aws/en/query-federation/>
- Auto Loader: <https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/> · COPY INTO: <https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/copy-into/>
- Structured Streaming: <https://docs.databricks.com/aws/en/structured-streaming/>
- Lakeflow Declarative Pipelines: <https://docs.databricks.com/aws/en/ldp/> · Conceitos: <https://docs.databricks.com/aws/en/ldp/concepts> · Expectations: <https://docs.databricks.com/aws/en/ldp/expectations> · AUTO CDC: <https://docs.databricks.com/aws/en/ldp/cdc>
- Arquitetura medallion: <https://docs.databricks.com/aws/en/lakehouse/medallion>
- Lakeflow Jobs: <https://docs.databricks.com/aws/en/jobs/>
- Databricks SQL: <https://docs.databricks.com/aws/en/sql/> · Genie: <https://docs.databricks.com/aws/en/genie/>
- Notebooks: <https://docs.databricks.com/aws/en/notebooks/> · dbutils: <https://docs.databricks.com/aws/en/dev-tools/databricks-utils>
- Machine learning: <https://docs.databricks.com/aws/en/machine-learning/> · MLflow: <https://docs.databricks.com/aws/en/mlflow/> · Model Serving: <https://docs.databricks.com/aws/en/machine-learning/model-serving/>
- Vector Search: <https://docs.databricks.com/aws/en/generative-ai/vector-search> · AI Functions: <https://docs.databricks.com/aws/en/large-language-models/ai-functions>
- Ferramentas de desenvolvimento: <https://docs.databricks.com/aws/en/dev-tools/> · Bundles: <https://docs.databricks.com/aws/en/dev-tools/bundles/> · Git folders: <https://docs.databricks.com/aws/en/repos/>
- Segurança: <https://docs.databricks.com/aws/en/security/>
- Otimizações: <https://docs.databricks.com/aws/en/optimizations/> · Predictive optimization: <https://docs.databricks.com/aws/en/optimizations/predictive-optimization>
- Well-Architected Lakehouse — performance: <https://docs.databricks.com/aws/en/lakehouse-architecture/performance-efficiency/best-practices> · custo: <https://docs.databricks.com/aws/en/lakehouse-architecture/cost-optimization/best-practices>
- Gestão de uso e custo: <https://docs.databricks.com/aws/en/admin/account-settings/usage>
- Certificações: <https://www.databricks.com/learn/certification>
