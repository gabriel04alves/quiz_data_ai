# Apostila Completa — IBM InfoSphere DataStage & QualityStage

> **Propósito deste documento.** Base de conhecimento única e autocontida sobre a ferramenta IBM InfoSphere DataStage (e o módulo QualityStage), suas metodologias de uso e boas práticas. Foi escrita para servir de **fonte de verdade para geração automática de perguntas de quiz**: cada capítulo termina com um bloco `Fatos testáveis`, contendo afirmações curtas, verificáveis e não ambíguas.
>
> **Versão de referência:** IBM InfoSphere Information Server 11.7 (documentação oficial: `https://www.ibm.com/docs/pt-br/iis/11.7.0`). Onde o comportamento varia entre versões, isso está indicado.
>
> **Convenções:**
> - Termos da interface aparecem em inglês (como na ferramenta) com tradução na primeira ocorrência.
> - `Propriedade = Valor` indica configuração literal de um estágio.
> - Valores **default** (padrão) estão sempre explicitados quando existem.
> - "Estágio" e "stage" são usados como sinônimos; "job" e "tarefa" também.

---

## Índice

**Parte I — Fundamentos e arquitetura**
1. IBM InfoSphere Information Server e o DataStage
2. Componentes e módulos clientes
3. Arquitetura de processamento paralelo
4. Arquivo de configuração (APT_CONFIG_FILE)

**Parte II — Construção de jobs**
5. Metadados e Table Definitions
6. Ciclo de desenvolvimento de um Parallel Job
7. Parâmetros, variáveis de ambiente e Parameter Sets
8. Particionamento e coleta de dados

**Parte III — Catálogo de estágios**
9. Estágios de arquivo: Sequential File, File Pattern, Data Set, File Set
10. Estágios de desenvolvimento e depuração
11. Estágio Transformer
12. Copy, Filter, Switch e Modify
13. Sort e Remove Duplicates
14. Aggregator
15. Combinação de dados: Join, Lookup, Merge e Funnel
16. Dados relacionais: Connectors e SQL Builder

**Parte IV — Orquestração, repositório e operação**
17. Job Sequence
18. Funções do repositório
19. Execução, monitoramento e linha de comando

**Parte V — QualityStage**
20. Qualidade de dados e o ciclo QualityStage
21. Estágio Investigate
22. Estágio Standardize
23. Match: Match Frequency, One-source e Two-source
24. Estágio Survive

**Parte VI — Prática, boas práticas e referência**
25. Boas práticas de desenvolvimento
26. Armadilhas, erros silenciosos e troubleshooting
27. Catálogo de exercícios práticos
28. Glossário PT/EN
29. Tabela-resumo de estágios

---

# Parte I — Fundamentos e arquitetura

## 1. IBM InfoSphere Information Server e o DataStage

### 1.1. O que é o IBM InfoSphere Information Server (IIS)

O **IBM InfoSphere Information Server (IIS)** é uma *suíte* (conjunto de aplicativos integrados) para integração e governança de dados. Todos os aplicativos da suíte compartilham:

- um **repositório de metadados comum** (metadata repository);
- um **conjunto de serviços comuns**, fornecidos pelo componente de servidor de metadados.

Esses serviços comuns incluem:

| Serviço | Função |
|---|---|
| Segurança | Autenticação, autorização, papéis (roles) e credenciais |
| Repositório | Armazenamento e versionamento dos objetos de projeto |
| Criação de log e relatório | Logging centralizado e geração de relatórios |
| Gerenciamento de metadados | Linhagem, impact analysis, glossário |

Por padrão, a camada de serviços é hospedada por uma instância do **IBM WebSphere Application Server (WAS)** e é administrada pelo cliente **Information Server Web Console** (console da web).

### 1.2. O que é o IBM InfoSphere DataStage

O **DataStage** é o componente de **ETL/ELT** (extração, transformação e carga) da suíte IIS. Suas atribuições:

- **Projetar jobs** de transformação de dados, com extração e carga;
- **Importar, exportar, criar e gerenciar metadados** para uso dentro dos jobs;
- **Compilar, executar e monitorar** jobs;
- **Criar jobs de controle em lote** (Job Sequences).

O **QualityStage** não é um produto separado na prática do desenvolvedor: ele é um conjunto de estágios adicionais (paleta **Data Quality**) que aparece dentro do mesmo DataStage Designer, usando os mesmos jobs paralelos, os mesmos links e o mesmo repositório.

### 1.3. Arquitetura em três camadas

O IIS é organizado em camadas (tiers):

| Camada | Conteúdo |
|---|---|
| **Client tier** | Clientes Windows: Administrator, Designer, Director; e clientes web: Flow Designer, Operations Console, Web Console |
| **Services tier** | WebSphere Application Server + serviços comuns (segurança, log, metadados) |
| **Engine tier** | Mecanismos de execução: **Parallel Engine** e **Server Engine**; também é onde ficam os arquivos físicos (Datasets, Filesets, Seq, Scratch) |
| **Metadata repository tier** | Banco de dados relacional (XMETA) com os metadados de projetos, jobs e table definitions |

### 1.4. Os dois mecanismos (engines) do DataStage

| Mecanismo | Característica |
|---|---|
| **Parallel Engine** | Executa processos paralelos (pipeline + particionamento). É o mecanismo dos **Parallel Jobs** |
| **Server Engine** | Executa processos **uniprocessados** (sequenciais). É o mecanismo dos **Server Jobs** e também executa as **Job Sequences** |

> Ponto frequentemente cobrado: **Job Sequences rodam no Server Engine**, mesmo quando orquestram Parallel Jobs.

### 1.5. Tipos de job no DataStage

| Tipo de job | Descrição |
|---|---|
| **Parallel Job** | Job de integração executado pelo Parallel Engine; compila para OSH. É o tipo padrão de desenvolvimento moderno |
| **Server Job** | Job de execução sequencial, legado, executado pelo Server Engine; usa a linguagem DataStage BASIC |
| **Job Sequence** | Job de controle: orquestra a execução de outros jobs, comandos e notificações |
| **Mainframe Job** | Gera COBOL/JCL para execução em mainframe (legado, raramente usado) |

### Fatos testáveis — Capítulo 1

- O DataStage é parte da suíte **IBM InfoSphere Information Server (IIS)**.
- Os aplicativos do IIS compartilham **repositório** e **serviços comuns** fornecidos pelo servidor de metadados.
- Por padrão a camada de serviços é hospedada pelo **IBM WebSphere Application Server (WAS)**.
- Os serviços comuns do IIS incluem: segurança, repositório, criação de log/relatório e gerenciamento de metadados.
- O IIS é gerenciado pelo cliente **Information Server Web Console**.
- O DataStage possui **dois mecanismos**: o **paralelo (Parallel Engine)** e o **Server**.
- O mecanismo **Server** executa processos uniprocessados **e** as **Job Sequences**.
- O repositório de metadados do IIS é chamado **XMETA**.
- O QualityStage usa a mesma interface (Designer) e a mesma estrutura de jobs paralelos do DataStage; seus estágios ficam na paleta **Data Quality**.

---

## 2. Componentes e módulos clientes

### 2.1. DataStage and QualityStage Administrator

Cliente usado para **criar e administrar projetos**.

Funções principais:

- Criar, excluir e proteger **projetos**;
- Definir **propriedades de projeto** (Properties);
- Definir **variáveis de ambiente** do projeto, incluindo os **parâmetros de projeto** (aba `User Defined` dentro de `Properties > Environment`);
- Configurar permissões, *Auto-purge* de logs, *Runtime Column Propagation* (RCP), tracing e NLS;
- Gerenciar licenças e comandos de manutenção.

Para criar parâmetros em nível de projeto é **obrigatório ter o privilégio de Administrador do DataStage**.

### 2.2. DataStage and QualityStage Designer

Cliente usado para **desenvolver, compilar e executar** jobs. É a ferramenta central do desenvolvedor.

Áreas da interface:

| Área | Função |
|---|---|
| **Canvas** (área de trabalho) | Onde os estágios são posicionados e ligados por links |
| **Palette** (paleta / barra de estágios) | Catálogo de estágios, agrupado por categoria (File, Database, Processing, Development/Debug, Data Quality, Real Time, Restructure, Sequence) |
| **Repository** (repositório) | Árvore de objetos do projeto: Jobs, Table Definitions, Parameter Sets, Routines, Shared Containers, Data Connections, Match Specifications, Rule Sets |
| **Job Log** | Painel de log de execução, aberto por `View > Job Log` (atalho `Ctrl+L`) |
| **Menus e barra de ferramentas** | Ações de arquivo, edição, importação/exportação e compilação |

Botões essenciais da barra de tarefas:

| Botão | Descrição |
|---|---|
| **New** | Cria um novo Job |
| **Open** | Abre um Job existente |
| **Save Job** | Grava as informações do Job |
| **Job Properties** | Abre a janela de propriedades do Job (`Ctrl+J`) |
| **Compile** | Compila o Job |
| **Zoom Out / Zoom In** | Altera a visualização |
| **Grid Lines** | Oculta/exibe linhas de grade |
| **Snap to Grid** | Alinha os objetos de acordo com a grade |

Ferramentas acessíveis pelo menu `Tools`:

- `Tools > Configurations` — visualizar, editar, validar e criar **arquivos de configuração** (.apt);
- `Tools > Data Set Management` — gerenciar arquivos **Data Set** (.ds);
- `Tools > Run Director` — abrir o Director a partir do Designer;
- `Tools > Message Handler Management` — tratar mensagens de log (promover/demover warnings).

### 2.3. DataStage and QualityStage Director

Cliente usado para **executar, agendar e monitorar** jobs criados no Designer.

Possui **três modos de visualização**:

| Modo | Função |
|---|---|
| **Status** | Monitora o status dos jobs (Compiled, Running, Finished, Finished (see log), Aborted, Has been Reset, Not Compiled) |
| **Schedule** | Visualiza os jobs agendados |
| **Log** | Monitora a execução passo a passo de cada job |

Recursos relevantes:

- **Job Log** com detalhe de evento (`Event Detail`), abrindo por duplo clique na mensagem;
- **Monitor** (`Tools > New Monitor`), que mostra linhas processadas por link e por estágio, com a opção **Show Instances** para ver a distribuição **por partição**;
- **Reset**: quando um job termina com status **Aborted**, ele precisa de um **Reset** antes de ser executado de novo (ou recompilação no Designer). Após o reset, o status passa a **"Has been Reset"**;
- Em ambiente de produção, a compilação normalmente cabe a um usuário de **implantação**, não a um usuário de **operação** — motivo pelo qual o Reset pelo Director é a via operacional.

### 2.4. Flow Designer (interface web)

Interface **web** para o DataStage, introduzida nas versões mais recentes do IIS 11.x.

Características:

- **Não necessita instalação de cliente** (roda no navegador);
- Possui **busca interativa** de fácil acesso;
- É possível **carregar jobs do DataStage ou do GitHub**;
- Permite usar a **engine do Spark** no InfoSphere DataStage;
- Expõe no painel: projetos disponíveis, lista de conexões às origens, Table Definitions, Parameter Sets e Jobs.

### 2.5. Operations Console e Web Console

- **Operations Console**: console web de monitoramento operacional — jobs em execução, uso de recursos do engine, histórico de execuções.
- **Information Server Web Console**: administração de segurança (usuários, grupos, papéis), relatórios e configuração da camada de serviços.

### Fatos testáveis — Capítulo 2

- O **Administrator** cria e administra **projetos** e define **parâmetros/variáveis de ambiente de projeto**.
- Parâmetros de projeto são definidos na aba **User Defined**, dentro de `Properties > Environment` do Administrator.
- Criar parâmetro de projeto exige **privilégio de Administrador do DataStage**.
- O **Designer** desenvolve, compila e executa jobs.
- O atalho para **Job Properties** é `Ctrl+J`; para abrir o **Job Log** no Designer, `Ctrl+L`.
- O **Director** executa, agenda e monitora jobs, e tem três modos: **Status**, **Schedule** e **Log**.
- Um job com status **Aborted** precisa de **Reset** (ou recompilação) antes de nova execução; após o reset o status é **"Has been Reset"**.
- A opção **Show Instances** do Job Monitor mostra a distribuição de registros **entre as partições**.
- Arquivos de configuração são manipulados em `Tools > Configurations`.
- Data Sets são gerenciados em `Tools > Data Set Management`.
- O **Flow Designer** é a interface **web**, dispensa instalação de cliente, permite carregar jobs do **GitHub** e usar a engine do **Spark**.

---

## 3. Arquitetura de processamento paralelo

### 3.1. Os dois tipos de paralelismo

O DataStage obtém desempenho por meio de **dois mecanismos combinados**:

| Tipo | O que faz | Usado por |
|---|---|---|
| **Pipeline parallelism** (processamento pipeline) | Permite a **execução simultânea de estágios**: um estágio começa a processar registros antes de o estágio anterior terminar | DataStage Server **e** Enterprise (Parallel) |
| **Partition parallelism** (processamento particionado) | Divide os dados em subconjuntos e **executa o job em múltiplas CPUs** | Apenas DataStage Enterprise (Parallel) |

Somados a isso, a **arquitetura escalável** permite adicionar recursos de hardware (CPUs, memória, discos) para melhorar o desempenho **sem reinstalação, sem programação avançada e sem retrabalho no desenho do job**.

> **Fórmula-síntese do treinamento:** `DataStage = Particionamento + Pipelining`.

### 3.2. A analogia "lavar, secar e dobrar"

Três operações (lavar, secar, dobrar), 3 cestos de roupa, meia hora por operação:

| Modo | Tempo total | Como |
|---|---|---|
| **Sequencial** | **4h30** | Lavar-secar-dobrar o cesto 1; depois o 2; depois o 3 |
| **Pipeline** | **2h30** | Ao terminar de lavar o cesto 1, ele vai para a secadora enquanto o cesto 2 é lavado, e assim por diante |
| **Particionado** | **1h30** | Dividir a roupa em 3 cargas (brancas, escuras, linho) e processá-las em 3 máquinas de lavar, 3 secadoras e 3 pessoas dobrando, em paralelo |

Desdobramento do pipeline (3 cestos, 30 min por etapa):

```
0:30  lavando cesto 1
1:00  lavando cesto 2 | secando cesto 1
1:30  lavando cesto 3 | secando cesto 2 | dobrando cesto 1
2:00                  | secando cesto 3 | dobrando cesto 2
2:30                                    | dobrando cesto 3
```

### 3.3. Execução sem pipelining

- Os dados, enquanto são lidos, **também são escritos em disco**;
- O início de um processo `p1` que depende de `p0` fica **em espera** enquanto `p0` ainda processa;
- Resultado: latência alta e I/O de disco desnecessário.

### 3.4. Execução com pipelining

- O pipeline **elimina a escrita em disco durante o processamento** — crítico para grandes volumes;
- Faz uso efetivo dos processadores, mantendo-os ocupados;
- Ainda possui **limites de escalabilidade**, resolvidos pelo particionamento;
- Analogia da esteira de bagagens do aeroporto: as bagagens são os **blocos** e o conteúdo do bloco são os **registros** (exemplo do treinamento: 8 blocos de 1.000 registros cada).

Internamente, os dados trafegam entre estágios por meio de **Data Sets virtuais** (buffers em memória), e não por arquivos intermediários.

### 3.5. Particionamento de dados

- Distribui grandes volumes de dados em **partições**;
- Executa **uma partição em cada processador/node**;
- Escalabilidade aproximadamente linear: 4 nodes → ~4× mais rápido; 100 nodes → ~100× mais rápido;
- O **algoritmo de particionamento é definido por estágio**, o que significa que o particionamento pode ser **mudado em tempo de processamento** (reparticionamento);
- O **reparticionamento ocorre automaticamente**, sem intervenção manual, ao adicionar processadores ou alterar a arquitetura.

Exemplo clássico de reparticionamento em cadeia:

```
Origem → particiona por Sobrenome do Cliente
       → reparticiona por CEP do Cliente
       → reparticiona por Número do Cartão de Crédito
```

### 3.6. Grau de paralelismo e instâncias

- A **execução do job pode ser sequencial ou paralela**;
- O **grau de paralelismo** (número de partições) é determinado pelo **arquivo de configuração**, e não pelo desenho do job;
- Um mesmo job desenhado uma única vez pode rodar com 1, 4 ou 128 partições, apenas trocando o arquivo de configuração;
- **Job Multiple Instance**: o DataStage pode executar **várias instâncias simultâneas** de um mesmo job, no mesmo servidor (se houver recursos) ou em servidores físicos diferentes. A opção é habilitada em `Job Properties > General > Allow Multiple Instance`, e cada execução recebe um **Invocation ID**.

### 3.7. Data Sets — arquivos binários paralelos

O **Data Set** é o formato de arquivo nativo do Parallel Engine:

- Consiste em um **arquivo de dados binários particionados**, gerenciado por **esquemas de controle (arquivos descritores)**;
- **O que você vê**: um único arquivo persistente com extensão `.ds` (o descritor);
- **O que é de fato processado**: diversas porções do arquivo, uma por partição, armazenadas no `resource disk` de cada node;
- **Mantém o particionamento** nas mais diversas situações, redistribuindo os dados conforme a necessidade — por isso é recurso de **alto desempenho**;
- A complexidade de manipulação e controle dos dados fica "na retaguarda" (tecnologia embutida de distribuição e controle entre partições).

### Fatos testáveis — Capítulo 3

- O DataStage usa **pipelining** e **particionamento de dados** para obter paralelismo.
- **Pipeline parallelism** é usado tanto pelo DataStage **Server** quanto pelo **Enterprise (Parallel)**; **partition parallelism** é **exclusivo do Enterprise/Parallel**.
- O pipeline **elimina a escrita em disco** durante o processamento.
- O pipeline ainda tem limite de escalabilidade; quem resolve isso é o **particionamento**.
- Na analogia da lavanderia: sequencial = **4h30**, pipeline = **2h30**, particionado = **1h30**.
- O **algoritmo de particionamento é definido por estágio** e pode mudar em tempo de execução.
- O **reparticionamento é automático**, sem intervenção manual.
- O **número de partições é determinado pelo arquivo de configuração**, não pelo desenho do job.
- Um **Data Set** é um arquivo binário particionado, formado por um **arquivo descritor** (`.ds`) e vários arquivos de dados.
- **Job Multiple Instance** permite executar várias instâncias do mesmo job simultaneamente.

---

## 4. Arquivo de configuração (APT_CONFIG_FILE)

### 4.1. O que é

O **arquivo de configuração** é um **arquivo texto** que contém as informações de recursos que serão utilizadas pelo **Parallel Engine Framework**.

- Fica **localizado no servidor** (engine tier);
- **Pode ser visualizado e editado** (pelo Designer, em `Tools > Configurations`, ou diretamente no sistema operacional);
- Seu nome e localização são encontrados na **variável de ambiente `APT_CONFIG_FILE`**;
- **Separa a configuração (hardware/software) do desenho do job** — princípio central da escalabilidade do DataStage;
- Em uma instalação padrão, o DataStage cria o arquivo **`default.apt`** no diretório de configurações (tipicamente `/opt/IBM/InformationServer/Server/Configurations/`).

Regras de uso:

- É possível utilizar **vários arquivos de configuração** em uma carga, mas **somente um por job** (por execução);
- A quantidade de recursos definida **não precisa ser equivalente à quantidade física de CPUs**;
- A validação do arquivo pode ser feita pelo botão de verificação da janela `Tools > Configurations`, que retorna o resultado da checagem.

### 4.2. Componentes do arquivo de configuração

| Componente | Descrição |
|---|---|
| **node** | Nome **lógico** de um node de processamento utilizado pelo DSEE (DataStage Enterprise Edition) |
| **fastname** | Nome de rede do servidor referenciado pelo nodename; geralmente obtido pelo comando Unix `uname -n` |
| **pool** | Nome dos pools a que um node é atribuído; usado para definir um **grupo lógico de nodes** |
| **resource disk** | Local onde os **arquivos de dados** dos Data Sets, File Sets e Lookup File Sets são armazenados |
| **resource scratchdisk** | Local onde os **arquivos temporários** (Data Sets virtuais, área de sort) são criados |

### 4.3. Exemplo — configuração MPP (4 nodes)

```
{
    node "n1" {
        fastname "s1"
        pool "" "n1" "s1" "app2" "sort"
        resource disk "/orch/n1/d1" {}
        resource disk "/orch/n1/d2" {"bigdata"}
        resource scratchdisk "/temp" {"sort"}
    }
    node "n2" {
        fastname "s2"
        pool "" "n2" "s2" "app1"
        resource disk "/orch/n2/d1" {}
        resource disk "/orch/n2/d2" {"bigdata"}
        resource scratchdisk "/temp" {}
    }
    node "n3" {
        fastname "s3"
        pool "" "n3" "s3" "app1"
        resource disk "/orch/n3/d1" {}
        resource scratchdisk "/temp" {}
    }
    node "n4" {
        fastname "s4"
        pool "" "n4" "s4" "app1"
        resource disk "/orch/n4/d1" {}
        resource scratchdisk "/temp" {}
    }
}
```

Observações sobre o exemplo:

- O pool `""` (aspas vazias) é o **pool default**: todo node que o contém participa da execução padrão;
- Pools nomeados (`"sort"`, `"bigdata"`, `"app1"`) permitem **direcionar estágios específicos a subconjuntos de nodes**;
- Um node **SMP** típico tem vários nodes lógicos com o **mesmo fastname**; um ambiente **MPP** tem fastnames diferentes (máquinas distintas).

### 4.4. Exemplo — configuração SMP de 2 nodes (ambiente de treinamento)

```
{
    node "node1"
    {
        fastname "iistreinamento.md2.local"
        pools ""
        resource disk "/datastage/Datasets" {pools ""}
        resource scratchdisk "/datastage/Scratch" {pools ""}
    }
    node "node2"
    {
        fastname "iistreinamento.md2.local"
        pools ""
        resource disk "/datastage/Datasets" {pools ""}
        resource scratchdisk "/datastage/Scratch" {pools ""}
    }
}
```

Como os dois nodes têm o **mesmo fastname**, trata-se de uma máquina única (SMP) com grau de paralelismo 2.

### 4.5. Desenvolvimento × execução

O desenvolvedor cria o job (fluxo) no Designer **sem saber quantos nodes existirão**. No momento da execução, o grau de paralelismo é informado pelo arquivo de configuração: 1 node, 2 nodes, N nodes. Essa separação é o que permite promover o mesmo job de desenvolvimento para produção sem alterações.

### Fatos testáveis — Capítulo 4

- O arquivo que define o **grau de paralelismo** de um job é o **arquivo de configuração**, apontado pela variável **`APT_CONFIG_FILE`**.
- O arquivo de configuração é um **arquivo texto**, armazenado **no servidor**, e pode ser visualizado/editado.
- O arquivo default de uma instalação padrão chama-se **`default.apt`**.
- É possível usar vários arquivos de configuração em uma carga, mas **apenas um por job**.
- A quantidade de nodes **não precisa** corresponder à quantidade física de CPUs.
- Componentes do arquivo: **node, fastname, pool(s), resource disk, resource scratchdisk**.
- **`resource disk`** guarda os arquivos de dados de **Data Sets, File Sets e Lookup File Sets**.
- **`resource scratchdisk`** guarda os **arquivos temporários** (Data Sets virtuais).
- O **fastname** geralmente é obtido com o comando Unix **`uname -n`**.
- O arquivo de configuração **separa a configuração de hardware/software do desenho do job**.
- Arquivos de configuração são criados, editados e validados em `Tools > Configurations` no Designer.

---

# Parte II — Construção de jobs

## 5. Metadados e Table Definitions

### 5.1. Metadados de origem e destino

- Os **metadados descrevem o formato dos dados** — dados de origem ou de destino;
- Para ler linhas de uma origem, o DataStage **precisa receber os metadados** que descrevem o que ele deve ler;
- O DataStage armazena esses metadados como **"Table Definitions"** (definições de tabela);
- Table Definitions podem ser **carregadas em estágios do job** (botão `Load` na aba `Columns`).

### 5.2. Origens suportadas para importação

É possível importar Table Definitions a partir de:

- **Arquivos sequenciais** (`Import > Table Definitions > Sequential File Definitions`);
- **Tabelas relacionais** via **ODBC** (`Import > Table Definitions > ODBC Table Definitions`);
- **Orchestrate Schema Definitions** (`Import > Table Definitions > Orchestrate Schema Definitions`);
- **Arquivos COBOL** (copybooks);
- Muitos outros tipos de origem (XML, plug-ins, assets).

Diferença importante:

| Método | Quantas tabelas por vez |
|---|---|
| **Orchestrate Schema Definitions** | Apenas **uma** tabela por vez |
| **ODBC Table Definitions** | **Várias** tabelas por vez |

### 5.3. Importação de arquivo sequencial — passos

1. `Import > Table Definitions > Sequential File Definitions`;
2. **Selecionar o diretório** no servidor (ex.: `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/Seq`);
3. Selecionar o **tipo de arquivo** (ex.: `CSV`) e clicar em **Refresh**;
4. **Selecionar o arquivo de entrada** e o **diretório destino no repositório** ("To folder");
5. Definir o **NLS map** quando necessário (ex.: `ISO8859-10`, para evitar conflitos de leitura com acentuação);
6. Marcar se a **primeira linha contém nomes de coluna**;
7. Informar o **delimitador** de campo;
8. Na aba **Define**, editar nomes, tipos, tamanhos e propriedades das colunas;
9. **Visualizar dados** (`View Data`) e concluir a importação.

Boas práticas nessa etapa:

- Usar **Unicode** (Extended = Unicode) nos campos de texto para evitar conflitos com acentuação e caracteres especiais;
- Para campos de data, adicionar a propriedade **`Format String`** na categoria `Date Type` com a máscara adequada, por exemplo `%dd/%mm/%yyyy`;
- Evitar **acentuação nos nomes de objetos** do DataStage/QualityStage.

### 5.4. Estrutura de uma Table Definition

Uma Table Definition no repositório contém:

- **General**: nome, origem (data source type/name), descrição;
- **Columns**: nome da coluna, key flag, SQL type, Length, Scale, Nullable, Display, Data element, Extended (Unicode);
- **Format**: características do arquivo (delimitador, quote, terminador de registro, formatos de data/hora);
- **Relationships / Parallel**: propriedades estendidas do parallel engine.

### 5.5. Importação e exportação de objetos (.dsx / .isx)

Qualquer objeto — ou conjunto de objetos — do repositório do projeto **pode ser exportado para um arquivo**.

- É possível exportar **projetos inteiros ou jobs individuais**;
- Caminho: `Export > DataStage Components`;
- Importação: `Import > DataStage Components` (ou `Import > DataStage Components (XML)`);
- Formatos: **`.dsx`** (formato texto do DataStage) e **`.isx`** (pacote do Information Server / istool);
- Na importação é possível **importar todos os objetos do arquivo** ou **selecionar objetos individualmente**.

**Usos da exportação:**

- **Backup**;
- **Controle de versão**;
- **Mover objetos do DataStage de um projeto para outro**;
- **Compartilhar jobs e projetos com outros desenvolvedores**.

> **Dica de desempenho:** para importações grandes, é útil **desativar `Perform impact analysis`**, pois essa opção adiciona sobrecarga ao processo de importação.

### 5.6. Runtime Column Propagation (RCP)

Recurso que permite que colunas **não declaradas** explicitamente em um estágio sejam propagadas em tempo de execução.

- Habilitado no Administrator (nível de projeto) e/ou em `Job Properties > General > Runtime column propagation`;
- Útil para jobs genéricos e reutilizáveis;
- **Risco:** com RCP ligado, erros de metadados deixam de ser detectados em tempo de compilação, aparecendo apenas em execução.

### Fatos testáveis — Capítulo 5

- O DataStage armazena metadados como **Table Definitions**.
- Table Definitions podem ser importadas de arquivos sequenciais, tabelas relacionais, arquivos COBOL e outras origens.
- Com **Orchestrate Schema Definitions** importa-se **uma tabela por vez**; com **ODBC**, **várias**.
- A importação de definição de arquivo sequencial é feita em `Import > Table Definitions > Sequential File Definitions`.
- Exportação de objetos: `Export > DataStage Components`; o formato texto nativo é **`.dsx`**.
- Usos da exportação: **backup, controle de versão, mover objetos entre projetos e compartilhar com outros desenvolvedores**.
- Em importações grandes é recomendável **desativar `Perform impact analysis`** para reduzir sobrecarga.
- É uma boa prática **evitar acentuação** na nomenclatura de objetos.
- Campos de texto devem usar **Unicode** para evitar problemas com acentuação.
- A máscara de data é definida pela propriedade **`Format String`**, ex.: `%dd/%mm/%yyyy`.
- **RCP (Runtime Column Propagation)** propaga colunas não declaradas em tempo de execução.

---

## 6. Ciclo de desenvolvimento de um Parallel Job

### 6.1. O que é um Parallel Job

- É um **programa DataStage executável**;
- É **criado no DataStage Designer**;
- É **construído usando componentes do DataStage**, especialmente **estágios e links**;
- É construído por **interface gráfica**;
- **Compila para uma linguagem de script chamada OSH** (Orchestrate Shell);
- É **executado pelo mecanismo paralelo** do DataStage.

### 6.2. Passos gerais de desenvolvimento

1. **Importe metadados** definindo origens e destinos (processo de importação no Designer);
2. **Inclua estágios** definindo extrações de dados e cargas;
3. **Inclua estágios de processamento** para definir transformações;
4. **Inclua links** definindo o fluxo de dados de um estágio para outro;
5. **Salve e compile o job** — criando a versão executável (OSH);
6. **Execute e monitore** o log do job (pelo Designer ou pelo Director).

### 6.3. Estágios e links — conceitos

| Conceito | Definição |
|---|---|
| **Stage (estágio)** | Componente que executa uma operação sobre os dados (ler, transformar, combinar, gravar) |
| **Link** | Caminho por onde os registros trafegam entre estágios; carrega os **metadados** (colunas) |
| **Estágio passivo** | Lê ou grava dados, mas não os transforma (ex.: Sequential File, Data Set) |
| **Estágio ativo** | Processa/transforma os dados (ex.: Transformer, Sort, Aggregator, Join) |
| **Link de saída (output)** | Leva registros para o próximo estágio |
| **Link de referência (reference)** | Entrada secundária de um Lookup; desenhado perpendicularmente por convenção |
| **Link de rejeição (reject)** | Captura registros que falharam em alguma regra (mostrado tracejado) |

### 6.4. Compilação

- `Compile` gera o **OSH** (script Orchestrate) e valida o desenho;
- **Erros de compilação** típicos: coluna referenciada e inexistente, derivação inválida no Transformer, estágio sem metadados, propriedade obrigatória vazia;
- **Erros de runtime** típicos: arquivo inexistente no caminho parametrizado, falha de conexão ao banco, violação de chave, lookup failure;
- Distinguir compile-time × runtime é fundamental: o DataStage **compila com sucesso** jobs logicamente errados (join sem sort, dedup pela chave errada). Ver Capítulo 26.

### 6.5. Execução e monitoramento

- `Run` executa o job; a caixa **Job Run Options** permite informar valores de parâmetros e escolher o **value file** de um Parameter Set;
- `Show performance statistics` (botão direito no canvas) exibe, sobre cada link, a contagem de linhas e a taxa;
- O log pode ser lido no Designer (`Ctrl+L`) ou no Director;
- Mensagens do estágio **Peek** aparecem no log com a etiqueta do nome do estágio.

### Fatos testáveis — Capítulo 6

- Um Parallel Job **compila para OSH** (Orchestrate Shell).
- Um Parallel Job é construído com **estágios e links**.
- A compilação cria a **versão executável** do job.
- O job pode ser executado e monitorado **tanto pelo Designer quanto pelo Director**.
- **Estágio passivo** lê/grava dados; **estágio ativo** transforma dados.
- **Sequential File** e **Data Set** são estágios **passivos**; **Transformer**, **Sort** e **Remove Duplicates** são **ativos**.
- O link de referência de um Lookup, por convenção de boa prática, é desenhado **perpendicular (90°)** ao fluxo principal.

---

## 7. Parâmetros, variáveis de ambiente e Parameter Sets

### 7.1. Por que parametrizar

- Torna o job **flexível** e promovível entre ambientes (DEV → HOM → PRD);
- Parâmetros podem ser usados **em qualquer lugar em que se possa especificar um valor**:
  - nomes de arquivo e de caminho;
  - valores de propriedades de estágio;
  - **restrições (constraints) e derivações** em um estágio Transformer;
- Os **valores dos parâmetros são especificados em tempo de execução**;
- Quando usados em nomes de arquivos/diretórios e valores de propriedade, ficam **entre cerquilhas (`#`)**, o que distingue o parâmetro de um valor codificado manualmente;
- **Variáveis de ambiente do DataStage** podem ser incluídas como parâmetros do job (botão `Add Environment Variable`).

### 7.2. As três formas de trabalhar com parâmetros

| Forma | Onde se define | Escopo |
|---|---|---|
| **Parâmetro de projeto** (variável de ambiente User Defined) | DataStage **Administrator** → `Properties > Environment > User Defined` | Todo o projeto; precisa ser importado no job |
| **Parâmetro local (do job)** | Designer → `Job Properties > Parameters` | Apenas aquele job (um Job Sequence pode repassá-lo aos jobs "filhos") |
| **Parameter Set** | Designer → `New > Other > Parameter Set` | Objeto de repositório reutilizável em vários jobs e projetos |

### 7.3. Parâmetros de projeto e o `$PROJDEF`

Ao criar um parâmetro de projeto informam-se:

| Campo | Significado |
|---|---|
| **Name** | Nome do parâmetro, como ele será referenciado |
| **Type** | `String` ou `Encrypted` (usado para senhas) |
| **Prompt** | Texto exibido quando o parâmetro for solicitado; use linguagem de alto nível e descritiva |
| **Value** | Valor de fato do parâmetro (ex.: caminho de diretório no servidor) |

Exemplo do ambiente de treinamento:

| Nome do parâmetro | Valor padrão |
|---|---|
| `paramDirDataSet` | `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/DataSets` |
| `paramDirFileSet` | `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/FileSets` |
| `paramDirHash` | `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/Hash` |
| `paramDirSeq` | `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/Seq` |

**O problema de promoção de ambiente:** o caminho aponta para a estrutura criada no servidor. Em Homologação ou Produção esse caminho pode ser diferente, e a importação do job falharia.

**A boa prática — `$PROJDEF`:** o Administrador define **a mesma variável de ambiente, com o mesmo nome, nos três ambientes**, cada um com o caminho adequado. O desenvolvedor, ao usar o parâmetro no job, define o **Default Value como `$PROJDEF`** — uma variável dinâmica que faz o DataStage **resolver, em tempo de execução, o valor cadastrado no projeto corrente**.

Na interface, `$PROJDEF` é obtido **clicando quatro vezes no campo `Default Value`** (o campo cicla entre valor literal, `$PROJDEF`, `$ENV` e `$UNSET`).

| Valor especial | Significado |
|---|---|
| **`$PROJDEF`** | Usa o valor definido no **projeto** (Administrator) |
| **`$ENV`** | Usa o valor da **variável de ambiente do sistema operacional** do processo |
| **`$UNSET`** | Trata a variável como **não definida** |

### 7.4. Parâmetro local do job

Em `Job Properties > Parameters`, informe **nome, prompt, tipo e valor padrão**. Tipos disponíveis incluem `String`, `Encrypted`, `Integer`, `Float`, `Pathname`, `List`, `Date`, `Time`.

Exemplo de uso: parâmetro `NumRows`, tipo `Integer`, default `10`, aplicado à propriedade `Number of Records` de um Row Generator.

### 7.5. Parameter Set

Um **Parameter Set** armazena uma **coleção de parâmetros** como um **objeto de repositório nomeado**.

Características:

- Pode ser **importado e exportado como qualquer outro objeto de repositório**;
- **Um ou mais arquivos de valor (value files)** podem ser vinculados ao Parameter Set;
- Os **value files** são implementados como **arquivos de texto armazenados no diretório do projeto**;
- No momento da execução, o usuário **seleciona qual value file usar**.

**Usos:**

- Armazenar **conjuntos padrão de parâmetros para reutilização**;
- Usar value files para armazenar **conjuntos comuns de valores** (ex.: `LowGen` com `NumRows=10`; `HighGen` com `NumRows=10000`).

**Como criar:** clique com o botão direito na pasta do repositório → `New > Other > Parameter Set`. Na aba `General`, nome e comentários (sem acentuação). Na aba `Parameters`, adicione parâmetros de projeto existentes ou crie novos. Na aba `Values`, crie os value files.

**Como usar em um job:** `Job Properties > Parameters > Add Parameter Set`.

**Sintaxe de referência:**

```
#NomeDoParameterSet.NomeDoParametro#
```

Exemplos reais:

```
#Diretorios.$paramDirSeq#/ArquivoExemplo.csv
#Diretorios.$paramDirDataSet#/ArquivoUnificado.ds
#Diretorios.$paramDirSeq#/Seq_Hash.txt
```

> Note o `$` antes do nome quando o parâmetro do set é, na origem, uma **variável de ambiente de projeto** (`User Defined`): o nome cadastrado no Administrator recebe o prefixo `$` ao ser referenciado.

Uma forma segura de evitar erro de digitação é usar a função **"Insert Job Parameter"** disponível nos campos de propriedade dos estágios.

### 7.6. Variáveis de ambiente úteis

| Variável | Efeito |
|---|---|
| `APT_CONFIG_FILE` | Define o arquivo de configuração (grau de paralelismo) usado pelo job |
| `APT_RECORD_COUNTS` | Insere no log a **contagem de registros por partição**, à medida que cada estágio/node é finalizado |
| `APT_DUMP_SCORE` | Publica no log o **score** do job: operadores, partições, inserções automáticas de sort/partitioner |
| `APT_DISABLE_COMBINATION` | Desabilita a combinação de operadores; útil para depurar qual estágio realmente consome tempo |
| `APT_STRING_PADCHAR` | Caractere usado para preencher strings de tamanho fixo |
| `APT_PM_PLAYER_TIMING` | Registra tempo de CPU por operador e por partição |
| `OSH_PRINT_SCHEMAS` | Imprime os schemas usados em cada estágio no log |

### Fatos testáveis — Capítulo 7

- Parâmetros são definidos na janela **Job Properties**, aba **Parameters**.
- Valores de parâmetro são especificados **em tempo de execução**.
- Parâmetros usados em nomes de arquivo/diretório e valores de propriedade ficam **entre cerquilhas (`#`)**.
- Existem **três formas** de trabalhar com parâmetros: **parâmetro de projeto, parâmetro local do job e Parameter Set**.
- O tipo **`Encrypted`** é usado para senhas.
- **`$PROJDEF`** faz o job usar o valor cadastrado no **projeto**, permitindo promoção entre ambientes sem alteração manual.
- `$PROJDEF` é obtido clicando **quatro vezes** no campo `Default Value`.
- **`$ENV`** usa o valor da variável de ambiente do SO; **`$UNSET`** trata a variável como não definida.
- Um **Parameter Set** pode ter **um ou mais value files**, implementados como **arquivos de texto no diretório do projeto**.
- A sintaxe de referência a um parâmetro de um set é **`#NomeParameterSet.Parametro#`**.
- A variável **`$APT_RECORD_COUNTS`** insere no log a contagem de registros **por partição**.
- **`APT_DUMP_SCORE`** exibe no log o plano de execução (score) do job.
- Um parâmetro local só vale para aquele job, mas em um **Job Sequence** pode ser repassado aos jobs filhos.

---

## 8. Particionamento e coleta de dados

### 8.1. Paralelismo de partição — conceito

- Divide o fluxo de entrada de dados em **subconjuntos** processados separadamente por um estágio/operação;
- Os nós são chamados de **partições**;
- Cada partição de dados é processada **pelo mesmo estágio** — se for um Transformer, cada partição é processada por uma **instância** desse Transformer;
- **O número de partições é determinado pelo arquivo de configuração**;
- **O particionamento ocorre no nível do estágio**: no **link de entrada** de um estágio que está particionando é determinado o algoritmo que será usado.

Onde configurar: **aba `Input > Partitioning`** do estágio paralelo.

### 8.2. Partitioners e Collectors

| Conceito | Definição |
|---|---|
| **Partitioner** | Distribui as linhas de um link em segmentos menores para serem processados em paralelo. Executado **somente na entrada de estágios que podem ser executados em paralelo** |
| **Collector** | Reúne os dados que foram particionados em um **único fluxo** para um estágio sequencial. Executado **somente na entrada de estágios que podem ser executados sequencialmente** |

**Ícones no canvas:**

- O ícone do **Partitioner** tem forma de **"fan-out"** (abertura em leque);
- O ícone do **Collector** tem forma de **"fan-in"** (afunilamento);
- Ambos são **sempre desenhados da esquerda para a direita**;
- Quando o método de particionamento muda de um estágio paralelo para outro, aparece o ícone de **reparticionamento**;
- Quando o método `Same` é usado, aparece o ícone **SAME**;
- Quando uma ordenação é feita dentro do link, aparece o ícone de **sort** antes do estágio.

### 8.3. Métodos de particionamento — keyless × keyed

Os métodos do DataStage se dividem em duas modalidades:

| Modalidade | Definição | Métodos |
|---|---|---|
| **Keyless** (sem chave) | Os registros são distribuídos **independentemente dos valores** dos campos | Round Robin, Random, Entire, Same |
| **Keyed** (com chave) | Os registros são distribuídos **com base nos valores** do(s) campo(s) definido(s) como chave de particionamento | Hash, Modulus, Range, DB2 |

### 8.4. Catálogo completo dos métodos de particionamento

| Método | Modalidade | Requer chave? | Comportamento | Quando usar |
|---|---|---|---|---|
| **Auto** | — | Não | **Método padrão do DataStage.** Insere métodos de particionamento à medida do necessário para garantir resultados adequados | Default; adequado na maioria dos casos simples |
| **Round Robin** | Keyless | Não | Distribui as linhas **ciclicamente**, uma para cada partição, em ordem de chegada ("carteado"). Com 2 partições, separa ímpares de pares | Balanceamento perfeito quando a lógica não depende de chave; ideal logo após leitura sequencial |
| **Random** | Keyless | Não | Distribui aleatoriamente. **O resultado muda de execução para execução** | Balanceamento estatístico; raramente preferível ao Round Robin |
| **Entire** | Keyless | Não | **Envia todas as linhas para todas as partições** (cada partição recebe uma cópia completa) | Links de referência de Lookup; tabelas pequenas replicadas |
| **Same** | Keyless | Não | **Preserva o particionamento existente**; nenhum dado é movido entre partições | Manter ordenação/agrupamento já estabelecido; evitar reparticionamento desnecessário |
| **Hash** | Keyed | **Sim** | Determina a partição aplicando uma função hash sobre o valor da chave. **Todas as linhas com o mesmo valor de chave caem sempre na mesma partição** | Join, Merge, Aggregator, Remove Duplicates — sempre que registros relacionados precisam estar juntos |
| **Modulus** | Keyed | **Sim** (numérica) | Partição = valor da chave **módulo** número de partições. A chave deve ser de **tipo numérico** | Alternativa ao Hash quando a chave é inteira e bem distribuída (mais barato que hash) |
| **Range** | Keyed | **Sim** | Distribui por **faixas de valores** contíguas, usando um arquivo de range map. Produz partições balanceadas **e** ordenadas globalmente | Quando é preciso ordenação global ou distribuição equilibrada em chaves enviesadas |
| **DB2** | Keyed | **Sim** | Usa **o mesmo mapa de particionamento da tabela DB2 de destino** | Carga em DB2 particionado: evita movimentação de dados no banco |

Exemplos numéricos (12 registros, 4 partições):

```
Round Robin:  P1={1,5,9}  P2={2,6,10}  P3={3,7,11}  P4={4,8,12}
Entire:       P1={1,2,3,4} P2={1,2,3,4} P3={1,2,3,4} P4={1,2,3,4}
Hash (chave): todas as linhas com chave "1" na mesma partição, idem "2", "3", "4"
Modulus:      chave numérica mod nº partições → mesmo efeito de agrupamento do Hash
```

Exemplo de **Same** com dados já agrupados por UF: as partições que chegavam com `MG|SP|RJ|SC` continuam exatamente iguais depois do estágio.

### 8.5. O comportamento do método Auto

O `Auto` é o método padrão e **insere métodos de particionamento à medida do necessário** para garantir os resultados adequados:

- Geralmente escolhe **Round Robin** ou **Same**;
- Insere **Hash** em estágios que necessitam de valores de coluna-chave semelhantes na mesma partição (ex.: **Join**, **Remove Duplicates**, **Aggregator**);
- Insere **Entire** na opção **Normal** (não Sparse) nos **links de referência do Lookup**.

> Importante: `Auto` é conveniente, mas **opaco**. Em jobs de produção com requisitos claros de agrupamento, declarar o método explicitamente é considerado boa prática (ver Capítulo 25).

### 8.6. Algoritmos de coleta (Collecting)

A **coleta** retorna dados particionados de volta para um **único fluxo**.

- A coleta **reduz o desempenho**, mas:
  - às vezes é **necessária para um propósito de desenvolvimento** (ex.: gravar os dados em um único arquivo sequencial);
  - às vezes é **requerida pelo próprio estágio** — alguns estágios, principalmente os mais antigos, executam **apenas em modo sequencial**;
  - às vezes o estágio roda sequencialmente para obter um determinado resultado, por exemplo uma **contagem global de todos os registros**.

| Método de coleta | Comportamento |
|---|---|
| **Auto** | **Padrão.** O DataStage escolhe; na prática lê de qualquer partição que tenha registro disponível — a ordem **varia entre execuções** |
| **Round Robin** | Lê uma linha de cada partição, ciclicamente, na ordem das partições |
| **Ordered** | Lê **todos** os registros da primeira partição, depois todos da segunda, e assim por diante. Preserva a ordem dentro de cada partição |
| **Sort Merge** | Lê **por chave**; **presume que os dados estão classificados pela chave de coleção em cada partição** e produz uma saída globalmente ordenada |

Exemplo (12 registros, 4 partições com `{1,5,9} {2,6,10} {3,7,11} {4,8,12}`):

```
Round Robin → 1,2,3,4,5,6,7,8,9,10,11,12 (intercalado por posição)
Ordered     → 1,5,9,2,6,10,3,7,11,4,8,12
Sort Merge  → 1,2,3,4,5,6,7,8,9,10,11,12 (ordenado pela chave)
Auto        → ordem não determinística; muda entre execuções
```

Onde configurar: **aba `Input > Partitioning` do estágio sequencial** (o mesmo local; quando o estágio roda sequencialmente, a aba oferece métodos de **coleta** em vez de particionamento).

### 8.7. Como escolher o método de particionamento — 3 etapas

**Etapa 1 — Equilíbrio.**
Escolher um método que retorne **aproximadamente o mesmo número de registros em cada partição**, pois tamanhos de partição muito diferentes fazem o tempo de processamento aumentar.

Ferramentas de diagnóstico:

- Habilitar a opção **`Show Instances`** no **Job Monitor do Director** para visualizar a distribuição dos registros entre as partições;
- Usar a variável de ambiente **`$APT_RECORD_COUNTS`**, que insere no log a contagem de registros por partição à medida que cada estágio/node é finalizado.

**Etapa 2 — Aderência à lógica do estágio.**
O método de particionamento **DEVE se encaixar à lógica do estágio**, enviando registros relacionados à mesma partição quando necessário (Join, Merge, Aggregator, Remove Duplicates).

**Etapa 3 — Simplicidade.**
O método não deve ser muito complexo, mas deve atender às etapas 1 e 2.

- **Deve-se evitar o reparticionamento**;
- Quando for necessário fazer a ligação entre dois jobs, **utilize o estágio Data Set para manter o particionamento**.

### 8.8. Exemplo de requisito de particionamento

Cenário: usar o estágio **Aggregator** para somar vendas por CPF de cliente.

- Se houver 10 clientes, o resultado deveria ser **10 registros**;
- Porém, se registros com os **mesmos números de cliente estiverem distribuídos entre partições**, isso produzirá **mais de 10 grupos de registros** — um por partição em que o cliente apareceu;
- **Solução:** usar o algoritmo de particionamento **Hash** pela chave de agrupamento.

### 8.9. Desequilíbrio de partições

**Desequilíbrios de partição podem fazer um job paralelo se comportar como server (sequencial):** se todos os registros estiverem percorrendo apenas um dos nodes, a tarefa estará, na verdade, sendo executada sequencialmente.

Exemplo do treinamento (Hash pela coluna `Marca`, 2 partições):

| Origem | | Partição 0 | Partição 1 |
|---|---|---|---|
| 7 registros (5 Fiat, 2 VW) | → | 5 registros Fiat | 2 registros VW |

O Hash garantiu a correção (mesmo valor na mesma partição), mas gerou **desbalanceamento** por causa da distribuição dos dados (**data skew**).

### 8.10. Chave de particionamento × chave de ordenação

São conceitos distintos e **geralmente diferentes**:

| Conceito | Função |
|---|---|
| **Chave de particionamento** (ex.: Hash) | Agrupar registros com o mesmo valor de chave em uma **mesma partição** |
| **Chave(s) de ordenação** | Estabelecer uma **ordem dentro de cada partição** |

### Fatos testáveis — Capítulo 8

- O particionamento é configurado na aba **`Input > Partitioning`** do estágio, ou seja, **no link de entrada**.
- O método de particionamento **padrão** é **`Auto`**; o método de coleta padrão também é **`Auto`**.
- Métodos **keyless**: **Round Robin, Random, Entire, Same**.
- Métodos **keyed**: **Hash, Modulus, Range, DB2**.
- **Hash** e **Modulus** particionam **com base em valores de chave**; Modulus exige chave **numérica**.
- **Entire** envia **todas as linhas para todas as partições**.
- **Same** **preserva** o particionamento existente.
- **Round Robin** e **Random** produzem **distribuições uniformes** de dados nas partições.
- O **Random** produz resultado **diferente a cada execução**.
- O método **`Auto`** geralmente escolhe **Round Robin ou Same**, insere **Hash** em estágios como Join e Remove Duplicates, e insere **Entire** em links de referência de Lookup **Normal** (não Sparse).
- Os quatro algoritmos de **coleta** são: **Auto, Round Robin, Ordered e Sort Merge**.
- **Sort Merge** **presume que os dados já estão classificados** pela chave de coleção em cada partição.
- **Ordered** lê todos os registros da primeira partição, depois da segunda, e assim por diante.
- A coleta **reduz o desempenho**.
- **Partitioners** só executam na entrada de estágios que **podem rodar em paralelo**; **Collectors** só na entrada de estágios que rodam **sequencialmente**.
- O ícone do Partitioner é um **"fan-out"**; o do Collector é um **"fan-in"**; ambos desenhados da **esquerda para a direita**.
- Para manter o particionamento entre dois jobs, use o estágio **Data Set**.
- **`Show Instances`** (Job Monitor do Director) e **`$APT_RECORD_COUNTS`** diagnosticam a distribuição entre partições.
- Um job paralelo com todos os registros em um único node **se comporta como um job server (sequencial)**.
- Para um Aggregator agrupando por cliente, o particionamento correto é **Hash pela chave de agrupamento**.

---

# Parte III — Catálogo de estágios

## 9. Estágios de arquivo: Sequential File, File Pattern, Data Set e File Set

### 9.1. Estágio Sequential File

**Características:**

- É um **estágio passivo**;
- Apresenta **um link de entrada OU um link de saída**, mais **um link para os registros rejeitados** (reject);
- **Executa em modo sequencial** quando a leitura é realizada a partir de **um único arquivo com um único Reader**;
- **Permite execução em paralelo** se configurado com **mais de um Reader** (`Readers Per Node`) ou se estiver **lendo mais de um arquivo ao mesmo tempo**.

**Regras do estágio:** um único link de entrada **ou** um único link de saída, e um único link de rejeição.

#### 9.1.1. Abas do estágio como ORIGEM

| Aba | Conteúdo |
|---|---|
| **Properties** | `File` (caminho do arquivo), `Read Method` (Specific File(s) / File Pattern), `First Line is Column Names`, `Readers Per Node`, `Missing File Mode`, `Keep File Partitions`, `Reject Mode` |
| **Format** | Características físicas do arquivo (ver abaixo) |
| **Columns** | Metadados das colunas; botões `Load` (carregar Table Definition) e `Save` |

#### 9.1.2. Abas do estágio como DESTINO

| Aba | Conteúdo |
|---|---|
| **Properties** | `File`, `File Update Mode` (Append / Create / Overwrite), `Cleanup On Failure`, `Reject Mode` |
| **Format** | Mesmo conjunto de propriedades de formatação |
| **Columns** | Metadados de saída |
| **Partitioning** | Método de particionamento/coleta e opções de sort do link de entrada |

#### 9.1.3. Propriedades da aba Format

Organizadas em quatro níveis:

| Nível | Propriedades relevantes |
|---|---|
| **Record level** | `Final delimiter` (ex.: `end`), `Record delimiter` / `Record delimiter string` (ex.: **`DOS format`** para arquivos com CRLF), `Record length`, `Record prefix` |
| **Field defaults** | `Delimiter` (ex.: `;` ou `,`), `Quote` (ex.: `double`), `Null field value`, `Print field`, `Delimiter string` |
| **Type defaults — General** | `Character set` (ASCII/EBCDIC), `Data format`, `Field max width`, `Pad char` |
| **Type defaults — Date/Time/Decimal/Numeric** | `Format string` (ex.: `%dd/%mm/%yyyy`), `Days since`, `Allow all zeros`, separador decimal |

Configuração típica de um CSV brasileiro:

```
Final delimiter        = end
Delimiter              = ;
Quote                  = double
Record delimiter string= DOS format
Date > Format string   = %dd/%mm/%yyyy
First Line is Column Names = True
```

#### 9.1.4. Link de rejeição do Sequential File

Captura registros que não puderam ser lidos/gravados conforme os metadados — por exemplo, linhas com número de colunas diferente do esperado, ou valores incompatíveis com o tipo declarado. A propriedade `Reject Mode` aceita:

| Valor | Efeito |
|---|---|
| **Continue** | Descarta a linha problemática e prossegue (gera warning) |
| **Fail** | Aborta o job |
| **Output** | Envia a linha para o **link de rejeição** |

#### 9.1.5. Tratamento de nulos em arquivo sequencial

Na aba `Format`, a propriedade **`Null field value`** define o texto que representa nulo no arquivo. Efeito colateral conhecido: o `View Data` pode exibir `NULL` enquanto o arquivo físico contém o valor configurado — conferir o arquivo no sistema operacional quando houver dúvida.

### 9.2. Leitura por File Pattern

Permite ler **diversos arquivos sequenciais diferentes**, desde que tenham a **mesma estrutura** e **nomenclatura similar**.

Configuração: no estágio Sequential File, mudar o **`Read Method`** de `Specific File(s)` para **`File Pattern`** e informar o padrão:

```
#Diretorios.$paramDirSeq#/Seq*.txt
```

Esse padrão lê todos os arquivos que começam com `Seq` e têm extensão `.txt`.

**Alternativa ao File Pattern:** no mesmo estágio, adicionar a propriedade **`File` várias vezes**, uma para cada arquivo — útil quando os nomes não seguem um padrão.

> Consequência prática: o Sequential File com múltiplos arquivos (por pattern ou por múltiplas propriedades `File`) **executa em paralelo**, pois há mais de um arquivo a ler.

### 9.3. Estágio Data Set

**Características:**

- É um **estágio passivo**;
- Apresenta **um link de entrada OU um link de saída**;
- **Executa em modo sequencial ou paralelo**;
- É **mais performático** por armazenar os dados gravados no **formato interno do DataStage**, **não exigindo operações de import ou export** dos dados;
- Os **dados não são acessíveis por aplicações externas**.

**Estrutura física:**

```
ArquivoUnificado.ds   ← Descriptor File (cabeçalho / metadados / mapa de partições)
   ├─ partição 0 → arquivo de dados em resource disk do node1
   ├─ partição 1 → arquivo de dados em resource disk do node2
   └─ ...
```

**Gerenciamento — `Tools > Data Set Management`:**

Nessa janela é possível:

- Localizar o diretório de Data Sets e abrir um `.ds`;
- Ver **quantos nodes/partições** o arquivo utilizou;
- **Show Data Window** — visualizar os dados;
- **Criar uma cópia** do Data Set;
- **Excluir o descritor e seus respectivos arquivos de dados**;
- **Visualizar a descrição dos metadados** (schema) do arquivo.

> **Regra crítica:** **não é possível ir ao sistema operacional e simplesmente excluir o arquivo `.ds`**, pois ele é apenas um cabeçalho/descritor para os arquivos de dados. Fazer isso deixa arquivos órfãos ocupando o `resource disk`. Use sempre o **Data Set Management** (ou o utilitário de linha de comando **`orchadmin`** no servidor).

Comandos `orchadmin` úteis no servidor:

| Comando | Função |
|---|---|
| `orchadmin ll arquivo.ds` | Lista informações detalhadas do Data Set |
| `orchadmin dump arquivo.ds` | Exibe os registros |
| `orchadmin delete arquivo.ds` | Remove descritor **e** arquivos de dados |
| `orchadmin describe arquivo.ds` | Mostra o schema |
| `orchadmin copy origem.ds destino.ds` | Copia o Data Set |

**Data Set virtual × persistente:**

| Tipo | Descrição |
|---|---|
| **Virtual** | Criado automaticamente entre estágios durante a execução; vive no `scratchdisk`/memória e desaparece ao fim do job |
| **Persistente** | Criado pelo estágio Data Set; sobrevive ao job, com descritor `.ds` |

### 9.4. Estágio File Set

O **File Set** é um meio-termo entre Sequential File e Data Set:

| Aspecto | Data Set (.ds) | File Set (.fs) | Sequential File (.txt/.csv) |
|---|---|---|---|
| Formato dos dados | **Binário** interno do DataStage | **Texto** distribuído em vários arquivos | Texto, arquivo único |
| Preserva particionamento | **Sim** | Sim (um arquivo por partição) | Não |
| Legível por aplicações externas | **Não** | **Sim** | **Sim** |
| Descritor separado | Sim (`.ds`) | Sim (`.fs`) | Não |
| Desempenho | **Melhor** (sem import/export) | Intermediário | Pior (import/export a cada leitura) |
| Uso típico | Persistência entre jobs | Entrega de dados em texto particionado | Integração com sistemas externos |

**Lookup File Set:** variante especializada, pré-processada para servir como **tabela de referência de Lookup**. É construída uma vez (num job) e reutilizada por vários Lookups, evitando reconstruir a tabela em memória a cada execução.

### Fatos testáveis — Capítulo 9

- O **Sequential File** é um estágio **passivo**, com um link de entrada **ou** de saída, mais um link de **rejeição**.
- O Sequential File executa **sequencialmente** ao ler um único arquivo com um único Reader, e **em paralelo** com múltiplos Readers ou múltiplos arquivos.
- A propriedade que define múltiplos leitores por node é **`Readers Per Node`**.
- A leitura de vários arquivos por padrão de nome usa o **Read Method = `File Pattern`**.
- O **Data Set** é passivo, tem um link de entrada **ou** de saída, e roda em modo **sequencial ou paralelo**.
- O Data Set é mais performático por gravar no **formato interno** do DataStage, **sem import/export**.
- Os dados de um Data Set **não são acessíveis por aplicações externas**.
- Um Data Set é composto por um **Descriptor File** e **arquivos de dados por partição**.
- **Nunca** excluir um `.ds` pelo sistema operacional; usar **`Tools > Data Set Management`** ou **`orchadmin delete`**.
- O **File Set** (`.fs`) armazena os dados em **texto distribuído**, sendo legível externamente; o Data Set, não.
- Na aba `Format`, `Record delimiter string = DOS format` trata arquivos com fim de linha CRLF.
- A propriedade **`Null field value`** define a representação de nulo em arquivo sequencial.

---

## 10. Estágios de desenvolvimento e depuração (Development/Debug)

### 10.1. Row Generator

- **Produz dados mock (fictícios)** para as colunas especificadas;
- **Não há link de entrada; apenas link de saída**;
- Na aba **`Properties`**, especifica-se o **número de linhas** (`Number of Records`);
- Na aba **`Columns`**, carregam-se ou especificam-se as definições de coluna;
- A janela **`Extended Properties`** (duplo clique na coluna) permite especificar os **algoritmos usados para gerar os dados**;
- **Os algoritmos disponíveis dependem do tipo de dados da coluna.**

| Tipo de coluna | Algoritmos | Parâmetros |
|---|---|---|
| **Inteiro (number)** | `Random` | valor inicial (seed), limite (limit) |
| | `Cycle` | valor inicial (initial value), incremento (increment) |
| **String** | `Cycle`, `Alphabet` | lista de valores / string de alfabeto |
| **Date** | `Random`, `Cycle` | epoch, incremento, limite |

### 10.2. Peek

- Estágio de **debug** que **imprime nos logs amostras de dados** para validação em tempo de desenvolvimento;
- Propriedade principal: **`Number of Records (Per Partition)`** — quantos registros por partição serão impressos (default 10);
- Outras propriedades: `Peek Records Output Mode` (Job Log / Output), `All Records (After Skip)`, `Columns to Peek`;
- No log, as mensagens aparecem com a **etiqueta do nome do estágio**; o **Monitor do Director** permite ver as partições de execução do Peek;
- Pode ter link de saída opcional (modo `Output`), atuando então como pass-through.

> **Resposta clássica:** *"Qual estágio pode ser usado para exibir os dados de saída no log da tarefa?"* → **Peek**.

### 10.3. Annotation e Description Annotation

- Estágio usado para **documentar o job na própria tela (canvas)**;
- **Annotation**: caixa de texto livre posicionada no canvas;
- **Description Annotation**: exibe automaticamente a descrição preenchida em `Job Properties > Short/Full description`;
- Não afeta a execução — é puramente documental, mas é considerado **boa prática obrigatória** em jobs de produção.

> **Resposta clássica:** *"Qual estágio é usado para documentar sua tarefa na tela de tarefa?"* → **Annotation**.

### 10.4. Outros estágios de Development/Debug

| Estágio | Função |
|---|---|
| **Column Generator** | Adiciona colunas com valores gerados a um fluxo existente (diferente do Row Generator, que cria o fluxo do zero) |
| **Head** | Copia as **primeiras N linhas** de cada partição para a saída |
| **Tail** | Copia as **últimas N linhas** de cada partição |
| **Sample** | Extrai uma **amostra** dos dados (percentual ou período fixo), podendo gerar múltiplas saídas |
| **Write Range Map** | Gera o arquivo de range map usado pelo particionamento **Range** |

### Fatos testáveis — Capítulo 10

- O **Row Generator** produz dados mock, **não tem link de entrada**, apenas link de saída.
- No Row Generator, o número de linhas é definido pela propriedade **`Number of Records`** na aba `Properties`.
- Os **algoritmos de geração dependem do tipo de dados da coluna**; para inteiros existem **Random** (valor inicial, limite) e **Cycle** (valor inicial, incremento).
- Para string, os algoritmos são **Cycle** e **Alphabet**; para data, **Random** e **Cycle**.
- O estágio que **exibe dados no log do job** é o **Peek**.
- A propriedade principal do Peek é **`Number of Records (Per Partition)`**.
- O estágio usado para **documentar o job no canvas** é o **Annotation**.
- **Head** retorna as primeiras N linhas por partição; **Tail**, as últimas.
- **Column Generator** adiciona colunas a um fluxo existente; **Row Generator** cria o fluxo.

---

## 11. Estágio Transformer

### 11.1. Características

O **Transformer** é o estágio de transformação de propósito geral. É um **estágio ativo**.

- Apresenta **um link de entrada** e **um ou vários links de saída**;
- É possível **não efetuar nenhuma ou quantas modificações forem necessárias** antes de passar para um link de saída;
- **Pode ter link de dados rejeitados**;
- **Pode criar ou deletar colunas**;
- **Pode definir filtros (constraints) para a manipulação dos dados**;
- Permite **editar colunas de metadados**;
- Permite **especificar a ordem de processamento dos links**;
- Permite **definir variáveis de estágio locais (Stage Variables)**.

> Nota técnica: no Parallel Job, o Transformer é **compilado em C++** no momento do `Compile` — por isso a compilação de jobs com Transformer é mais lenta e exige compilador C++ instalado no servidor.

### 11.2. Anatomia da interface

| Área | Conteúdo |
|---|---|
| **Painel superior esquerdo** | **Links de entrada** e suas colunas |
| **Painel superior direito** | **Links de saída, derivações (Derivation)** e **constraints** |
| **Stage Variables** | Área no canto superior direito com as variáveis de estágio |
| **Loop Variables** (11.x) | Variáveis usadas com `LoopCondition` para gerar múltiplas linhas por linha de entrada |
| **Painel inferior** | **Metadados dos links de entrada e saída** (nome da coluna, tipo, tamanho, nullable) |

### 11.3. Derivações (Derivation)

Uma derivação é a **expressão que produz o valor de uma coluna de saída**. Pode ser:

- Uma referência direta a uma coluna de entrada: `LnkLeDs.DESC`;
- Uma função: `UpCase(LnkLeDs.DESC)`;
- Um literal: `'F'`;
- Uma concatenação: `Trim(vStreetType:' ':vStreetNamePrefix:' ':vStreetName)`;
- Uma expressão condicional: `IF MOD(LnkLeDs.COD,2) = 0 THEN 'M' ELSE 'F'`.

Uma derivação **em vermelho** indica que a coluna ainda não recebeu regra, função ou valor — o job não compila nesse estado.

**Derivation Substitution:** selecionando **várias linhas de derivação**, botão direito → **`Derivation Substitution...`**, é possível **encapsular todas de uma vez** com uma função, usando `$1` como referência ao valor que já existia. Equivale a um "Substituir" do Office.

```
Exemplo: UpCase($1)   → aplica UpCase em todas as derivações selecionadas
Exemplo: Trim($1)     → aplica Trim em todas
```

### 11.4. Stage Variables (variáveis de estágio)

- Funcionam **como variáveis declaradas em uma linguagem de programação**, **restritas àquele estágio Transformer**;
- Cada variável tem **nome, valor inicial (Initial Value), tipo (SQL Type), tamanho e escala**;
- São avaliadas **de cima para baixo**, uma vez por linha de entrada;
- **Persistem entre linhas** — é isso que permite implementar contadores e comparações com a linha anterior.

**Padrão do contador:**

1. Criar uma Stage Variable com **valor inicial 0**;
2. Na derivação da variável, colocar **o próprio nome da Stage Variable + 1**.

```
svContador  = svContador + 1
```

**Padrão "linha anterior"** (detecção de mudança de grupo):

```
svMudou      = IF svChaveAnterior <> Link.CHAVE THEN 1 ELSE 0   (declarada ANTES)
svChaveAnterior = Link.CHAVE                                     (declarada DEPOIS)
```

A ordem importa: a variável que guarda o valor anterior deve ser atualizada **depois** da que o compara.

### 11.5. Ordem de execução do Transformer

O Transformer segue esta ordem:

1. **São lidos todos os comandos dentro de `Stage Variables`.** Essa execução é realizada **de cima para baixo**;
2. **`Constraints` são realizadas antes de `Derivations`**;
3. **As colunas em `Derivation` mais acima são realizadas primeiro** que as que estão abaixo delas.

> Consequência prática: uma Stage Variable pode ser usada em uma constraint e em derivações; uma coluna de saída **não** pode ser usada como insumo de outra coluna de saída — para isso, use Stage Variables.

### 11.6. Constraints

**Constraints** são **expressões booleanas** que filtram quais registros seguem por cada link de saída — "assim como na linguagem SQL, são uma forma de realizar uma operação condicional ou lógica e por consequência filtrar os dados de saída de cada link".

Como definir:

1. Selecione um link de saída e clique no botão **`Constraints`**;
2. Dê duplo clique no campo de entrada da constraint (ou escolha `Constraints` no menu de atalho);
3. Escreva a expressão.

Exemplos:

```
Mod(LnkLeDs.COD,2)=0      → apenas registros pares
Mod(LnkLeDs.COD,2)=1      → apenas registros ímpares
LnkFiltra.QTD > 1         → apenas registros com quantidade maior que 1
```

Um mesmo registro **pode sair por vários links** se satisfizer mais de uma constraint — o Transformer não é mutuamente exclusivo por padrão (diferente do estágio Switch).

### 11.7. Link de rejeição (Reject)

- Definido marcando um determinado link de saída como link de rejeição na janela de Constraints;
- **As linhas são mandadas para o link de rejeitados se foi utilizado o `Nullable` em alguma coluna ou se a derivação retornou um valor nulo**;
- É boa prática ter um link de rejeição gravando em arquivo/tabela para auditoria.

### 11.8. Link Otherwise

- O **link Otherwise** recebe os dados **que não possuem vínculo anterior** — isto é, os registros que **não satisfizeram nenhuma constraint** dos links anteriores;
- **É necessário que venha depois de todas as constraints** (na ordem de execução dos links);
- **Um warning é colocado no log** se alguma linha for para o link Otherwise;
- **Pode-se definir se o job aborta após um certo número de warnings** (`Job Properties > General > Warning limit`, ou pelo Director).

### 11.9. Ordem de execução dos links de saída

Para alterar:

1. Clicar no botão **`Output link execution order`** na barra de ferramentas do estágio Transformer;
2. Escolher **`Output link reorder`** no menu de atalho;
3. Utilizar os botões para indicar a ordem de execução dos links requerida.

A ordem importa quando há link Otherwise ou quando um link "captura" registros antes de outro.

### 11.10. Tratamento de nulos

Dentro das funções existe a categoria **`Null Handling`**:

| Função | Efeito |
|---|---|
| **`IsNull(coluna)`** | Verifica se a coluna **é nula** |
| **`IsNotNull(coluna)`** | Verifica se a coluna **não é nula** |
| **`NullToValue(coluna, valor)`** | Transforma o valor nulo da coluna **para o valor especificado** |
| **`SetNull()`** | Usado para **atribuir o valor "Null"** a uma coluna |
| `NullToZero(coluna)` | Converte nulo numérico em zero |
| `NullToEmpty(coluna)` | Converte nulo de string em string vazia |

Exemplos:

```
NullToValue(LnkLeDsNulos.DESC,"NAO IDENTIFICADO")
IF MOD(LnkLeDs.COD,3) = 0 THEN SetNull() ELSE UpCase(LnkLeDs.DESC)
```

> **Regra de metadados:** para que uma coluna possa receber nulo, ela deve estar com **`Nullable = Yes`**. Se a coluna estiver `Nullable = No` e a derivação retornar nulo, a linha vai para o **link de rejeição** (ou o job falha).
>
> Inversamente, ao aplicar `NullToValue` e eliminar os nulos, a coluna de saída deve ser marcada **`Nullable = No`**.

### 11.11. IF-THEN-ELSE

Permite a **execução condicional de comandos**.

Sintaxe:

```
IF <condição> THEN <Comando1> [ELSE <Comando2>] END IF
```

| Elemento | Significado |
|---|---|
| **CONDIÇÃO** | Comparação cujo valor resultante determina o fluxo. **Precisa ser um valor booleano** |
| **THEN** | Comando a ser executado para a condição **verdadeira** |
| **ELSE** | Comando a ser executado para a condição **falsa** |

Encadeamento (nested if), usado para tabelas de-para inline:

```
If @INROWNUM=1 Then 'SP' Else
If @INROWNUM=2 Then 'RJ' Else
If @INROWNUM=3 Then 'SC' Else 'AL'
```

### 11.12. Funções do Transformer

#### String

| Função | Formato | Efeito |
|---|---|---|
| **UpCase** | `UpCase(%string%)` | Passa todas as letras para **maiúscula** |
| **DownCase** | `DownCase(%string%)` | Passa todas as letras para **minúscula** |
| **Len** | `Len(%string%)` | **Conta quantas letras e espaços** tem na palavra |
| **Substring** | `String[Começo, Tamanho]` | Divide uma string em substring |
| `Trim` | `Trim(%string%)` | Remove espaços à esquerda/direita e duplicados internos |
| `TrimLeading` / `TrimTrailing` | | Remove espaços só de um lado |
| `Field` | `Field(string, delimitador, ocorrência[, nº ocorrências])` | Extrai o **n-ésimo token** de uma string delimitada |
| `DCount` | `DCount(string, delimitador)` | **Conta quantos tokens** existem na string |
| `Index` | `Index(string, substring, ocorrência)` | Posição de uma substring |
| `Convert` | `Convert(de, para, string)` | Substitui caracteres |
| `Pad` / `Str` | | Preenchimento e repetição |
| `:` (dois-pontos) | `a : b` | **Operador de concatenação** |

#### Numéricas

| Função | Efeito |
|---|---|
| **`Mod(valor, divisor)`** | Resto da divisão (módulo) |
| `Abs`, `Ceil`, `Floor`, `Round`, `Div`, `Sqrt`, `Power` | Operações aritméticas |

#### Data e hora

`CurrentDate()`, `CurrentTimestamp()`, `DateFromDaysSince()`, `DaysSinceFromDate()`, `MonthFromDate()`, `YearFromDate()`, `StringToDate()`, `DateToString()`, `TimestampToString()`.

#### Tipo e conversão

`StringToDecimal`, `DecimalToString`, `AsInteger`, `AsDouble`, `IsValid(tipo, valor)`.

### 11.13. Variáveis de sistema (@ variables)

| Variável | Valor |
|---|---|
| **`@INROWNUM`** | Número da linha de **entrada** que está chegando no Transformer, **para cada partição** |
| **`@OUTROWNUM`** | Número da linha de **saída** gerada, por partição |
| **`@PARTITIONNUM`** | Número da partição corrente (base 0) |
| **`@NUMPARTITIONS`** | Total de partições da execução |
| `@DATE`, `@TIME`, `@TIMESTAMP` | Data/hora da execução |
| `@TRUE`, `@FALSE`, `@NULL` | Constantes |
| `@JOBNAME`, `@PROJECTNAME`, `@USERNO` | Contexto de execução |

> **Armadilha clássica de `@INROWNUM`:** como o Transformer é **nativamente paralelo**, `@INROWNUM` **reinicia em cada partição**. Um job que esperava 12 valores distintos (linhas 1 a 12) com 2 partições vê apenas os números de **1 a 6 em cada partição** — produzindo **6 valores distintos, duplicados**.
>
> **Duas soluções:**
> 1. Alterar o algoritmo de particionamento do link de entrada para **`Same`**; ou
> 2. Configurar o Transformer para executar em **modo sequencial**: duplo clique no estágio → botão de propriedades → `Stage > Advanced` → **`Execution Mode = Sequential`**.
>
> Para numeração global sem serializar o job, a alternativa correta é `@PARTITIONNUM + (@INROWNUM - 1) * @NUMPARTITIONS` ou o estágio **Surrogate Key Generator**.

### 11.14. Dicas oficiais do treinamento

- **Utilizar links de rejeitados**;
- **Tentar manter os tipos de dados importados**;
- **Prestar atenção nos tipos de dados das colunas e das variáveis de estágio**.

### Fatos testáveis — Capítulo 11

- O Transformer é um estágio **ativo**, com **um link de entrada** e **um ou vários links de saída**.
- O Transformer pode ter link de **rejeição**, criar/deletar colunas, definir constraints e **variáveis de estágio locais**.
- Ordem de execução: **(1) Stage Variables, de cima para baixo; (2) Constraints; (3) Derivations, de cima para baixo**.
- As **constraints são executadas antes das derivações**.
- Uma linha vai para o **link de rejeitados** quando se usou `Nullable` em alguma coluna **ou** a derivação retornou nulo.
- O **link Otherwise** recebe os dados que **não atenderam a nenhuma constraint**, deve vir **depois de todas as constraints** e **gera warning no log**.
- Pode-se configurar o job para **abortar após um certo número de warnings**.
- Funções de null: **`IsNull`, `IsNotNull`, `NullToValue(coluna, valor)`, `SetNull()`**.
- **`SetNull()`** atribui o valor nulo a uma coluna.
- Sintaxe: `IF <condição> THEN <comando1> ELSE <comando2> END IF`; a condição **precisa ser booleana**.
- **`UpCase`** converte para maiúsculas; **`DownCase`** para minúsculas; **`Len`** conta letras **e espaços**; **`Substring`** usa o formato `String[Começo, Tamanho]`.
- **`Field()`** extrai um token por delimitador; **`DCount()`** conta tokens.
- O operador de **concatenação** é o **dois-pontos (`:`)**.
- **`Mod(valor, divisor)`** retorna o resto da divisão.
- Um **contador** se faz com Stage Variable de valor inicial **0** e derivação **`nomeVariavel + 1`**.
- **`@INROWNUM`** dá o número da linha de entrada **por partição** — por isso reinicia em cada partição.
- Para que `@INROWNUM` seja global, altera-se o particionamento para **`Same`** ou o modo de execução do Transformer para **`Sequential`** (`Stage > Advanced`).
- **`Derivation Substitution`** aplica uma função a várias derivações de uma vez, usando **`$1`** como o valor anterior.
- No Parallel Job, o Transformer é compilado em **C++**.

---

## 12. Copy, Filter, Switch e Modify

### 12.1. Estágio Copy

**Função:** permite a **replicação de um fluxo que vem em 1 link para vários links de saída**, e também **renomear os campos em cada link de saída**.

- Um link de entrada, **N links de saída**;
- Pode **remover e reordenar colunas** por link de saída (aba `Output > Mapping`);
- Quando não faz nenhuma alteração e não há bifurcação, o DataStage **otimiza e elimina o Copy** em tempo de execução (propriedade `Force = False` por padrão);
- Uso comum no treinamento: **estágio intermediário que serve apenas para aplicar um particionamento** antes do próximo estágio, ou para **gravar o mesmo resultado em Dataset e Fileset simultaneamente**.

Padrão "bifurcação-junção" (fork-join): o Copy bifurca os dados em dois fluxos; um vai para um Aggregator (que calcula sobre grupos) e o resultado é **reunido de volta** por um Join com o fluxo original — assim cada linha recebe o valor agregado do seu grupo.

### 12.2. Estágio Filter

**Função:** direcionar registros para links de saída diferentes com base em **condições tipo SQL WHERE**.

| Propriedade | Efeito |
|---|---|
| **`Where clause`** | Condição da saída; pode-se ter **uma cláusula por link de saída** |
| **`Output Rejects`** | `True`/`False` — cria um link de **rejeição** com os registros que não atenderam a **nenhuma** condição |
| **`Output Row Only Once`** | `True`/`False` — se `True`, cada registro sai **apenas pelo primeiro link cuja condição atender**; se `False` (default), pode sair por **vários** links |
| **`Nulls Value`** | Como tratar nulos na comparação (`Less Than` / `Greater Than`) |

Sintaxe das condições: operadores SQL (`=`, `<>`, `<`, `>`, `LIKE`, `IN`, `IS NULL`) e conectores `AND` / `OR`.

```
Region = 'Telangana' AND City = 'Mumbai' AND OS = 'Android'
Verdict = 'Hit'
Verdict = 'Flop'
```

**Filter × Transformer:** o Filter é mais leve (não compila C++) e mais legível para filtros puros; o Transformer é necessário quando há derivação/transformação de valores além do filtro.

### 12.3. Estágio Switch

**Função:** direcionar cada registro para **exatamente um** de até 128 links de saída, com base no valor de uma **coluna seletora** — equivale ao `switch/case` do C.

| Propriedade | Efeito |
|---|---|
| **`Selector`** | Coluna cujo valor decide o link |
| **`Case`** | Mapeamento `valor = número do link` |
| **`If not found`** | `Fail` (default) / `Drop` / `Output` (envia ao link `Reject`) |

**Diferença essencial:** Switch é **mutuamente exclusivo** (um registro, um link); Filter e Transformer podem enviar o mesmo registro para vários links.

### 12.4. Estágio Modify

**Função:** alterar **metadados** (tipo, nome, nullability) de forma leve, sem compilar código.

Propriedade única: **`Specification`**, aceitando expressões como:

```
novoNome = antigoNome
coluna:int32 = coluna
DESC = handle_null(DESC,"NAO IDENTIFICADO")
coluna = make_null(coluna, valor)
DROP nomeColuna
KEEP col1, col2
```

Funções mais usadas:

| Função | Efeito |
|---|---|
| **`handle_null(coluna, valor)`** | Converte nulo no valor informado (equivale a `NullToValue` do Transformer) |
| **`make_null(coluna, valor)`** | Converte o valor informado em nulo |
| `null_to_empty`, `null_to_zero` | Conversões específicas |

> **Observação prática:** o Modify exige que os metadados do link de saída sejam definidos corretamente. No exercício do treinamento, salva-se a Table Definition do link de **entrada** (`Input > Columns > Save`) e a importa no link de **saída** (`Output > Columns > Load`), **alterando a coluna tratada para `Non-nullable`**.

**Modify × Transformer:** o Modify é mais rápido (não gera código C++) e é a escolha recomendada quando a operação é **apenas de metadados/null handling**.

### Fatos testáveis — Capítulo 12

- O **Copy** replica um link de entrada em **vários links de saída** e permite **renomear campos** por link.
- O Copy pode ser usado apenas para **aplicar um particionamento** antes do próximo estágio.
- No **Filter**, a propriedade **`Output Rejects`** cria o link com os registros que não atenderam a nenhuma condição.
- A propriedade **`Output Row Only Once`** do Filter controla se um registro pode sair por mais de um link.
- O **Switch** envia cada registro para **exatamente um** link (mutuamente exclusivo); o Filter, não necessariamente.
- O `If not found` do Switch tem como default **`Fail`**.
- O **Modify** altera metadados e trata nulos com **`handle_null()`** e **`make_null()`**, **sem compilar C++**.
- O **Modify** é mais performático que o Transformer para operações apenas de metadados.

---

## 13. Sort e Remove Duplicates

### 13.1. Por que ordenar

- **Alguns estágios necessitam da entrada ordenada:** **Join** e **Remove Duplicates**;
- **Alguns estágios utilizam menos memória quando a entrada está ordenada**, ou seja, **melhoram a performance do job** — por exemplo o **Aggregator** (no método `Sort`).

### 13.2. Onde é possível ordenar

| Forma | Onde | Características |
|---|---|---|
| **Ordenação implícita (dentro dos estágios)** | Na aba **`Partitioning`** do link de entrada, **com exceção do método de particionamento `Auto`** | Menos visível no canvas; menos opções |
| **Ordenação explícita (estágio Sort)** | Estágio **Sort** próprio | **Fica mais visível no Job Designer**; **possui mais opções** |

Quando há ordenação em um link, o Designer desenha um **ícone de sort** antes do estágio.

### 13.3. Estágio Sort — visão geral

- É um **estágio ativo**;
- Utilizado para **executar operações mais complexas de classificação** do que as fornecidas nas abas `Inputs/Partitioning` dos editores de estágio;
- Também utilizado para **operações simples quando se deseja deixar o layout do job mais claro e explícito**;
- Possui **um único link de entrada** (dados a classificar) e **um único link de saída** (dados classificados).

### 13.4. Chaves de ordenação (Sort Key Mode)

Para cada chave é possível especificar o **modo de ordenação**:

| Modo | Significado |
|---|---|
| **`Sort`** | **Ordenar por esta chave** |
| **`Don't Sort (Previously Sorted)`** | **Assume que os dados já estão ordenados por esta chave** e **continua a ordenação pela(s) chave(s) secundária(s)** |
| **`Don't Sort (Previously Grouped)`** | **Assume que os registros já estão agrupados por esta chave, mas não ordenados** |

Ainda por chave:

- **Sort Order**: `Ascending` / `Descending`;
- **Case Sensitive**: se a operação de ordenação diferencia maiúsculas de minúsculas (default `True`);
- **Character Set**: `ASCII` (default) ou `EBCDIC`;
- **Nulls position**: `First` / `Last`.

### 13.5. Propriedades (Options) do estágio Sort

| Propriedade | Valores | Default | Descrição |
|---|---|---|---|
| **`Sort Utility`** | `DataStage` / `UNIX` | **`DataStage`** | `DataStage` é o padrão; `UNIX` utiliza o comando de sort do Unix |
| **`Stable Sort`** | `True` / `False` | **`True`** | Aplica o classificador do DataStage. `True` **garante que a operação de classificação não irá reordenar registros que já se encontram classificados** no arquivo. `False` **não garante** que a classificação prévia será preservada |
| **`Allow Duplicates`** | `True` / `False` | **`True`** | `False` especifica que, **no caso de existirem múltiplos registros com a mesma chave de classificação, somente um registro é retido**. Se `Stable Sort = True`, **o primeiro registro é retido**. **Esta propriedade não está disponível para o UNIX** |
| **`Memory usage` / `Restrict Memory Usage`** | inteiro (MB) | **20** | Restringe o Sort a usar o número de memória virtual especificado (em MB) **em um node de processamento**. **Utiliza disco se necessário**; aumentar a memória **pode melhorar o desempenho** |
| **`Create Key Change Column`** | `True` / `False` | **`False`** | É mostrada para o tipo de classificação **DataStage** e é **opcional**. Quando `True`, o Sort **cria uma coluna `KeyChange` em cada registro de saída**: **`1` para o primeiro registro de cada grupo** onde o valor da chave muda; **`0`** para os registros subsequentes do grupo |
| **`Create Cluster Key Change Column`** | `True` / `False` | `False` | Equivalente ao anterior, para chaves já agrupadas |
| **`Sort Key Mode`** | ver 13.4 | `Sort` | Por chave |
| **`Output Statistics`** | `True` / `False` | `False` | Publica estatísticas de sort no log |

### 13.6. Chave de particionamento × chave de ordenação (reforço)

- A **chave de particionamento geralmente é diferente das chaves de ordenação**;
- **Chave de particionamento** (ex.: Hash): agrupar registros com o mesmo valor de chave **em uma mesma partição**;
- **Chaves de ordenação**: estabelecer **uma ordem dentro de cada partição**.

> Corolário importante: um Sort paralelo produz dados **ordenados dentro de cada partição**, não globalmente. Para ordenação **global** é preciso coletar com **Sort Merge** (ou particionar com **Range**).

### 13.7. Remoção de duplicados — as três formas

| Forma | Como | Limitações |
|---|---|---|
| **Estágio Sort** | `Allow Duplicates = False` | **Nenhuma escolha sobre qual registro manter.** Com `Stable Sort`, **retém sempre o primeiro** registro de cada grupo; **sem** `Stable Sort` **não há como determinar** qual registro será mantido |
| **Aba `Partitioning` do link de entrada** | Marcar a opção **`Unique`** (junto com `Perform Sort`) | Mesma limitação; menos visível no canvas |
| **Estágio Remove Duplicates** | Estágio dedicado | **Possui maneiras mais sofisticadas**: pode-se **escolher manter o primeiro ou o último** |

### 13.8. Estágio Remove Duplicates

**Visão geral:**

- É um **estágio ativo**;
- Pode apresentar **um único link de entrada e um único link de saída**;
- Recebe **um único arquivo classificado como entrada**, remove todas as duplicidades e grava o resultado em um arquivo de saída;
- A remoção de duplicados é **uma forma comum de limpar o arquivo antes do processamento**;
- **Dois registros são considerados duplicados se forem adjacentes no mesmo arquivo e possuírem valores idênticos para as colunas-chave**;
- **O arquivo de entrada precisa estar classificado** para que todos os registros com chaves idênticas sejam **adjacentes** e as duplicidades possam ser eliminadas.

**Propriedades:**

| Propriedade | Descrição | Default |
|---|---|---|
| **`Key`** | Especifica a **coluna-chave** para a operação. **Pode ser repetida** para especificar múltiplas colunas | — |
| **`Character Set`** | Por padrão os dados são apresentados em **ASCII**; escolhendo **EBCDIC**, em EBCDIC | `ASCII` |
| **`Case Sensitive`** | Diferencia maiúsculas/minúsculas | **`True`** |
| **`Duplicate To Retain`** | Especifica **qual das colunas duplicadas encontradas será mantida**: **`First`** ou **`Last`** | **`First`** |

**Boas práticas ao usar após um Sort:**

- Na aba **`Input > Partitioning`**, selecionar o algoritmo **`Same`** para **manter a ordenação realizada no estágio Sort** — o Designer desenha o ícone de `Same` antes do estágio;
- Não esquecer de **especificar as colunas de saída** na aba **`Output > Mapping`**.

### Fatos testáveis — Capítulo 13

- Os estágios que **necessitam da entrada ordenada** são **Join** e **Remove Duplicates**.
- O **Aggregator** usa **menos memória** quando a entrada está ordenada (método `Sort`).
- É possível ordenar **dentro dos estágios** (aba `Partitioning`, **exceto** com o método `Auto`) ou **pelo estágio Sort**.
- O **estágio Sort** deixa a operação **mais visível no Designer** e **tem mais opções**.
- Modos de chave do Sort: **`Sort`**, **`Don't Sort (Previously Sorted)`** e **`Don't Sort (Previously Grouped)`**.
- **`Don't Sort (Previously Sorted)`** assume ordenação prévia e **continua pela chave secundária**.
- **`Sort Utility`** aceita **`DataStage`** (padrão) e **`UNIX`**.
- **`Stable Sort`** tem default **`True`** e garante que registros já classificados **não sejam reordenados**.
- **`Allow Duplicates`** tem default **`True`**; com `False`, retém apenas um registro por chave, e com `Stable Sort = True` **retém o primeiro**.
- **`Allow Duplicates` não está disponível para o utilitário UNIX**.
- **`Restrict Memory Usage`** tem default **20 MB** por node de processamento.
- **`Create Key Change Column`** tem default **`False`**; quando `True`, cria a coluna **`KeyChange`** com **1 no primeiro registro de cada grupo** e **0 nos subsequentes**.
- Uma **classificação estável (stable sort)** é aquela que **preserva a ordem relativa de registros já classificados**.
- O **Remove Duplicates** é um estágio **ativo** com **um link de entrada e um de saída**.
- Dois registros são duplicados se forem **adjacentes** e tiverem **valores idênticos nas colunas-chave** — por isso a entrada **precisa estar ordenada**.
- **`Duplicate To Retain`** aceita **`First`** (default) e **`Last`**.
- O **estágio Sort** com `Allow Duplicates = False` **não permite escolher** qual registro manter; o **Remove Duplicates** permite.
- Após um Sort, usar particionamento **`Same`** no Remove Duplicates preserva a ordenação.

---

## 14. Estágio Aggregator

### 14.1. Função

Executa **agregações de dados**. **Funciona como uma instrução SQL com uma cláusula `GROUP BY`**: especificam-se uma ou mais colunas que definem os **grupos de agregação**.

### 14.2. Os dois tipos de agregação

| Tipo (`Aggregation Type`) | O que faz |
|---|---|
| **`Count Rows`** | Simplesmente **conta as linhas dentro de cada grupo**. Especifica-se a **coluna de saída** (`Count Output Column`) |
| **`Calculation`** | **Agrega os dados dentro de colunas específicas**: seleção das colunas para cálculo, seleção dos cálculos a executar e especificação das colunas de saída |

**Cálculos disponíveis no tipo `Calculation`:**

- **Soma (Sum)**
- **Mínimo e Máximo (Min, Max)**
- **Média (Mean)**
- **Contagem de valor ausente (Missing Value Count)**
- **Contagem de valor não ausente (Non-missing Value Count)**
- Desvio padrão (Standard Deviation), variância, soma dos quadrados, percentil, contagem de valores distintos

### 14.3. Propriedades principais

| Propriedade | Descrição |
|---|---|
| **`Group`** | Coluna(s) que definem o grupo (equivale ao `GROUP BY`). Pode ser repetida |
| **`Aggregation Type`** | `Count Rows` ou `Calculation` |
| **`Count Output Column`** | Nome da coluna de saída da contagem (tipo `Count Rows`) |
| **`Column for Calculation`** | Coluna sobre a qual calcular (tipo `Calculation`) |
| **`Method`** | **`Hash`** (padrão) ou **`Sort`** |
| **`Default To Decimal Output`** | Define a precisão/escala decimal das saídas. **Recebe o formato `"precisão,escala"` — por exemplo `12,2` — e não um booleano** |
| **`Allow Null Outputs`** | Se saídas podem ser nulas quando não há valores no grupo |

Configuração típica:

```
Group                = SEXO
Aggregation Type     = Count Rows
Count Output Column  = CONTADOR
```

Não esquecer: na aba **`Output > Mapping`**, arrastar as colunas (a de grupo e a de resultado) para o link de saída. Na aba `Output > Columns`, ajustar o tipo (ex.: `ContaCOD` como **Integer, comprimento 10**).

> **Detalhe de metadados:** por padrão, o resultado de um cálculo do tipo `Calculation` sai como **`Double`**. Para saídas decimais com escala definida, use `Default To Decimal Output` ou corrija o tipo na aba `Columns`.

### 14.4. Métodos de agrupamento — Hash × Sort

| Aspecto | **Hash (padrão)** | **Sort** |
|---|---|---|
| Como funciona | Os cálculos são feitos **para todos os grupos** e **armazenados na memória**, em uma estrutura de **hashtable** (daí o nome) | **Somente um único grupo é mantido na memória por vez**; depois de um grupo ser processado, o resultado é gravado |
| Quando grava | Os resultados são gravados **depois de todas as linhas da partição terem sido processadas** | Grava **assim que o grupo termina** |
| Exige entrada ordenada? | **Não** | **Sim** — requer que os dados de entrada estejam **classificados pelas chaves de agrupamento** |
| Faz a ordenação? | — | **Não executa a classificação! Espera a classificação** já feita |
| Memória | **Precisa de memória suficiente para armazenar todos os grupos** de dados a serem processados | Precisa apenas de memória para o **grupo processado no momento** |
| Quando usar | Poucos grupos distintos | **Muitos grupos distintos** / grande volume |

### 14.5. O padrão fork-join com Aggregator

Cenário: adicionar a cada linha a contagem de linhas do seu grupo.

```
Sort (por COD) → Copy ─┬─→ (todas as colunas) ─────────────→ Join (chave COD, Left Outer) → ...
                       └─→ (só COD) → Aggregator (Count Rows) ─┘
```

- O **Copy bifurca** os dados em dois fluxos;
- Um fluxo vai para o **Aggregator**, onde os cálculos são executados sobre todos os grupos;
- **Os resultados são reunidos de volta** a cada linha de dados da bifurcação esquerda, pelo **Join**;
- No Join, verificar em **`Stage > Link Ordering`** que o link do Copy é o link **esquerdo (Left)**.

### Fatos testáveis — Capítulo 14

- O **Aggregator** executa cálculos sobre valores de coluna **agrupados**, funcionando como um **`GROUP BY`** do SQL.
- Os **dois tipos de agregação** são **`Count Rows`** e **`Calculation`**.
- Cálculos do tipo `Calculation` incluem: **Sum, Min, Max, Mean, contagem de valor ausente e contagem de valor não ausente**.
- Os **dois métodos de agrupamento** são **`Hash`** (padrão) e **`Sort`**.
- O método **`Hash`** armazena **todos os grupos na memória** e **não exige entrada ordenada**.
- O método **`Sort`** **exige entrada ordenada pelas chaves de agrupamento** e **não executa a ordenação** — apenas a espera.
- O método `Sort` mantém **apenas um grupo na memória por vez**.
- O tipo de saída padrão de um cálculo é **`Double`**.
- A propriedade **`Default To Decimal Output`** recebe o formato **`"precisão,escala"`** (ex.: `12,2`), **não** um valor booleano.
- O Aggregator funciona de modo **mais eficiente** se os dados tiverem sido **pré-classificados**.
- Para agregar corretamente em paralelo, o particionamento deve ser **Hash pela chave de agrupamento**.

---

## 15. Combinação de dados: Join, Lookup, Merge e Funnel

### 15.1. As três maneiras de combinar dados

| Direção | Descrição | Estágios |
|---|---|---|
| **Horizontalmente** | **Múltiplos links de entrada**; **um link de saída** feito das colunas de diferentes links de entrada | **Join, Lookup, Merge** |
| **Verticalmente** | **Um link de entrada, um link de saída**, combinando registros relacionados em **um único registro** | **Aggregator, Remove Duplicates** |
| **Union** | **Múltiplos fluxos de entrada convergidos em um único fluxo de saída** | **Funnel** |

### 15.2. Estágio Funnel

**Função:** estágio de processamento que **combina múltiplos links de entrada em um único link de saída**. Útil para **combinar dados de diversas fontes de formatos idênticos**.

**As três opções (`Funnel Type`):**

| Tipo | Comportamento |
|---|---|
| **`Continuous Funnel`** (padrão) | **Combina os registros da entrada sem garantir a ordem.** Busca **um registro de cada link por vez**. **Não tenta criar nenhuma ordem** nos dados que está processando |
| **`Sort Funnel`** | **Combina os registros de entrada em uma ordem definida pelo(s) valor(es) de uma ou mais colunas-chave**. Exige entrada ordenada e particionamento compatível |
| **`Sequence`** | **Move todos os registros de um link de entrada para o link de saída, em seguida todos os registros do segundo link**, e assim por diante |

**Regra de metadados:** o Funnel **só permite a saída de colunas com mesmo nome e estrutura** (data type e tamanho). Se as origens tiverem estruturas diferentes, **apenas as colunas existentes em todas as origens** estarão disponíveis, e é **necessário remapear a saída** ao adicionar novas origens.

**Alternativas ao Funnel para arquivos sequenciais:**

1. Ler por **File Pattern** em um único Sequential File;
2. Adicionar a propriedade **`File` várias vezes** no mesmo Sequential File.

Conclusão do treinamento: o Funnel é útil **no caso de origens heterogêneas** em que se necessita agrupar os dados de um conjunto de colunas comum a todas as origens.

### 15.3. Join × Lookup × Merge — visão comparativa

Estes estágios **combinam dois ou mais links de entrada**, com os dados sendo combinados **de acordo com a chave**. As **principais diferenças** entre eles são:

- **Consumo de memória**;
- **Tratamento dos registros não encontrados**;
- **Necessidade de a entrada estar ordenada e de-duplicada**.

| Aspecto | **Join** | **Lookup** | **Merge** |
|---|---|---|---|
| Nº de entradas | 2 ou mais (1 primária + N secundárias) | 1 primária (stream) + N referências | 1 master + N updates |
| **Entrada ordenada?** | **Sim, obrigatório** | **Não** | **Sim, obrigatório** |
| **Entrada de-duplicada?** | Não exigido (gera produto cartesiano) | Referência deve ser única | **Updates devem ser de-duplicados** |
| **Onde processa** | Usa **arquivos temporários em disco** (scratch) quando necessário | **Em memória** — a tabela é carregada antes de processar | Disco/memória |
| **Volume da referência** | Suporta referências **grandes** | Referência deve **caber na memória** | Grande |
| **Tratamento de não-correspondência** | Tipos de join (Inner/Left/Right/Full). **Não possui fail nem reject** | **Fail (default), Drop, Continue, Reject** | **Keep / Drop** para o master; link de rejeição **por update** |
| **Link de rejeição** | **Não** | **Sim** (opção Reject) | **Sim**, um por link de update |
| Captura de não encontrados | Via Full/Left/Right Outer | Via Reject | Via reject links |

> **Regra de ouro:** se a tabela de referência é **pequena e cabe em memória**, use **Lookup** (mais rápido, não exige sort). Se é **grande**, use **Join** (ordenando antes). Use **Merge** quando precisar de **múltiplos links de rejeição**, um por fonte de atualização.

### 15.4. Estágio Lookup

**Conceito:** utiliza **uma ou mais colunas-chave como índice em uma tabela**, que geralmente contém outros valores associados a cada chave. **A tabela do lookup é criada na memória antes de qualquer registro de origem do lookup ser processado.**

```
Chave da coluna de origem        Tabela Lookup (índice → valor associado)
cod_cidade = "MG"         →      ES  Espírito Santo
                                 GO  Goiás
                                 MG  Minas Gerais      ← encontrado
                                 PB  Paraíba
                                 RR  Roraima
                                 SC  Santa Catarina
```

**Ações caso o Lookup falhe** (chave de origem sem correspondente na referência) — propriedade **`Lookup Failure`** / `Condition Not Met`, definida no botão **`Constraints`** do estágio:

| Ação | Comportamento |
|---|---|
| **`fail`** | O estágio Lookup **retorna um erro e o job aborta imediatamente**. **Esta é a opção default** |
| **`drop`** | O registro de origem **não encontrado na referência é excluído** |
| **`continue`** | Mesmo não sendo encontrado, o registro **é transferido para o link de saída** (as colunas da referência vêm como **string vazia ou NULO**) |
| **`reject`** | Os registros não encontrados são **transferidos para o link de rejeitados** |

> **Observação do treinamento:** "não existe nenhuma opção para capturar os registros não encontrados na referência" **dentro das opções fail/drop/continue** — a captura exige a opção **`reject`** e a criação de um **link de rejeição** para gravar em tabela ou arquivo e analisar posteriormente.

Mensagem típica de falha com a opção default:

```
Lookup,1: Failed a key lookup for record 1 Key Values: UF: MG
```

**Configuração das chaves:** arrastar manualmente o campo-chave do link de origem (stream) para o link de referência dentro do editor do Lookup; depois usar o botão **`Column Auto-Match`** para completar o mapeamento de saída, e marcar as colunas da referência que devem ir para a saída.

> **Armadilha frequente:** as chaves de join devem ser declaradas via o **checkbox `Key Expression`** nos painéis do editor, **não** digitadas na caixa de texto `Lookup Stage Conditions`.

**Particionamento:** o Lookup **não exige ordenação** porque executa em memória. O particionamento `Auto` insere **`Entire`** no link de referência no modo **Normal** (não Sparse), garantindo que cada partição tenha a tabela completa.

**Normal × Sparse Lookup** (quando a referência é um banco de dados):

| Modo | Comportamento |
|---|---|
| **Normal** | Carrega **toda a tabela de referência em memória** antes de processar |
| **Sparse** | Executa **uma consulta SQL por linha de entrada** contra o banco. Só vale a pena quando o volume de entrada é **muito menor** que a tabela de referência |

**Comportamento — exemplo:**

Origem (primário) e Lookup (secundário), ordenados por `Nome`, sem chaves duplicadas:

```
Origem:          Referência:
ID  Nome         Nome      Estado
32  Leonardo     Matheus   MG
41  Matheus      Mariana   SP
```

| Opção | Saída |
|---|---|
| **`continue`** | `32 Leonardo (vazio)` + `41 Matheus MG` → **mesma saída do Left Outer Join e do merge/keep** |
| **`drop`** | `41 Matheus MG` → **mesma saída do Inner Join e do merge/drop** |

### 15.5. Estágio Join

**Características:**

- **Dois ou mais links de entrada ordenados**, **1 link de saída**;
- **"Esquerdo" na entrada primária, "direito" na entrada secundária**;
- **A pré-ordenação torna o join mais leve**: apenas alguns registros precisam estar na memória;
- **O estágio Join realiza o produto cartesiano em caso de registros duplicados.** Entradas que "baterem" podem ser utilizadas para outras ocorrências;
- Registros não encontrados no join podem ser capturados pelos tipos **Left, Right, Full**;
- **Não possui as opções de `fail` ou `reject`** para registros não encontrados;
- **Permite múltiplas colunas-chave**.

**Ordem dos links:** *"a ordem dos links não importa para as opções de Inner e Full Outer Joins, mas é muito importante para Left e Right Outer Joins"*. A ordem é definida em **`Stage > Link Ordering`**.

**Os quatro tipos de join:**

Exemplo comum — Link da esquerda (primário) e Link da direita (secundário), ordenados por `Nome`, sem chaves duplicadas:

```
Esquerda:        Direita:
ID  Nome         Nome     Estado
32  Leonardo     Matheus  MG
41  Matheus      Ricardo  SP
```

| Tipo | Regra | Saída do exemplo |
|---|---|---|
| **Inner Join** | Transfere para a saída **todos os registros que possuem o mesmo valor de chave em ambas as entradas**. **Trata ambas as entradas simetricamente** | `41 Matheus MG` |
| **Left Outer Join** | Transfere **todos os valores do link da esquerda** e os valores do link da direita **somente quando a coluna-chave foi igual** | `32 Leonardo (vazio)` + `41 Matheus MG` |
| **Right Outer Join** | Transfere **todos os valores do link da direita** e os do link da esquerda **somente quando a coluna-chave for igual** | `41 Matheus MG` + `(Nulo ou 0) Ricardo SP` |
| **Full Outer Join** | Transfere os registros de ambas as entradas **com o mesmo valor de chave** **e também** os registros **cujas colunas-chave possuam valores diferentes**. **Trata ambas as entradas simetricamente**. **Cria colunas com novos nomes!** | `32 leftRec_Nome=Leonardo` / `41 Leonardo... Matheus MG` / `0 rightRec_Nome=Ricardo SP` |

**Equivalências entre estágios:**

| Resultado | Join | Lookup | Merge |
|---|---|---|---|
| Mantém só o que casa | **Inner Join** | **drop** (ou reject) | **merge/drop** |
| Mantém tudo da origem | **Left Outer Join** | **continue** | **merge/keep** |

> **Ponto de atenção do Full Outer Join:** como ele **cria colunas novas** (`leftRec_Nome`, `rightRec_Nome`), a aba `Output > Mapping` mostra **mais colunas** do que nos outros tipos, e o mapeamento precisa ser refeito.

**Particionamento recomendado para Join:** **Hash** pela chave no link principal, e **Hash** (ou **Entire**, se a referência for pequena) no link de referência, com ordenação prévia pela mesma chave.

### 15.6. Estágio Merge

- Combina um **master** com um ou mais **update links**;
- **Exige que todas as entradas estejam ordenadas** pela chave e que os **updates estejam de-duplicados**;
- Propriedade `Unmatched Masters Mode`: **`Keep`** (mantém masters sem correspondência) ou **`Drop`**;
- Propriedade `Warn On Reject Updates` / `Warn On Unmatched Masters`;
- Cada **update link pode ter seu próprio link de rejeição** — é a característica que o distingue de Join e Lookup.

### 15.7. Boa prática de desenho

O **link de referência deve ficar perpendicular ao fluxo principal** — acima ou abaixo, a 90° — em operações de **Join, Merge e Lookup**, para facilitar a leitura do job.

### Fatos testáveis — Capítulo 15

- Os três estágios de combinação apresentados são **Lookup, Join e Funnel** (além do Merge).
- Combinação **horizontal** = Join/Lookup; **vertical** = Aggregator/Remove Duplicates; **union** = Funnel.
- As três diferenças principais entre Join, Lookup e Merge são: **consumo de memória, tratamento dos não encontrados e necessidade de entrada ordenada/de-duplicada**.
- O **Join** **exige entrada ordenada**; o **Lookup, não**.
- O **Lookup** executa **em memória**; o **Join** usa **arquivos temporários em disco**.
- A **tabela de lookup é criada na memória antes** de qualquer registro de origem ser processado.
- As ações de falha do Lookup são **`fail` (default), `drop`, `continue` e `reject`**.
- Com **`continue`**, as colunas não encontradas vêm como **string vazia ou nulo**, e a saída equivale a um **Left Outer Join**.
- Com **`drop`**, a saída equivale a um **Inner Join**.
- A opção **`reject`** exige a criação de um **link de rejeição**.
- O **Join** **não possui** as opções `fail` nem `reject`.
- Os quatro tipos de join são **Inner, Left Outer, Right Outer e Full Outer**.
- A **ordem dos links não importa** para **Inner** e **Full Outer**, mas é **muito importante** para **Left** e **Right Outer**. Define-se em `Stage > Link Ordering`.
- O **Full Outer Join** **cria colunas com novos nomes**.
- O **Join realiza produto cartesiano** quando há registros duplicados na chave.
- Os três tipos de Funnel são **`Continuous` (padrão), `Sort Funnel` e `Sequence`**.
- **`Continuous Funnel`** **não garante a ordem** e busca **um registro de cada link por vez**.
- **`Sequence`** move **todos os registros de um link**, depois todos do segundo, e assim por diante.
- O Funnel só permite saída de colunas com **mesmo nome, tipo e tamanho** em todas as origens.
- O **Merge** é o único dos três que permite **um link de rejeição por link de update**.
- Boa prática: desenhar o **link de referência perpendicular (90°)** ao fluxo principal.

---

## 16. Dados relacionais: Connectors e SQL Builder

### 16.1. Importação de definições de tabela relacional

Duas vias:

| Via | Menu | Limite |
|---|---|---|
| **ODBC** | `Import > Table Definitions > ODBC Table Definitions` | Importa **várias tabelas por vez**; requer conexão de origem de dados ODBC |
| **Orchestrate Schema** | `Import > Table Definitions > Orchestrate Schema Definitions` | Importa **apenas uma tabela por vez**; seleciona-se o tipo de banco, nome do banco e nome da tabela |

### 16.2. Estágios Connector

Os **Connectors** são a família moderna de estágios de banco de dados.

- Os tipos incluem **ODBC, DB2, Oracle, Teradata, Hive, Redshift, Snowflake**, JDBC, Netezza, SQL Server, Greenplum, entre outros;
- **Todos os estágios Connector têm o mesmo conjunto central de propriedades**;
- Alguns tipos incluem **propriedades específicas do tipo de banco de dados**;
- **As propriedades requeridas são identificadas visualmente** (marcação na interface);
- **Suporte paralelo para leitura e gravação**:
  - **Leitura**: conexões paralelas ao servidor e **consultas SQL modificadas para cada conexão**;
  - **Gravação**: conexões paralelas ao servidor.

Recursos de interface: botão **`Test`** para testar a conexão, **`View Data`** para visualizar, abas `Properties` e `Columns`.

### 16.3. Propriedades de uso do campo SQL

**`Generate SQL` — habilitar ou não o SQL automático?**

| Valor | Comportamento |
|---|---|
| **`Yes`** | O estágio **gera o SQL** com base nas **definições de coluna** e no **nome de tabela** especificado |
| **`No`** | **É preciso especificar o SQL**: digitá-lo manualmente ou usar o **SQL Builder** |

> **Regra do nome de esquema:** se o **nome do esquema não for especificado**, ele **assumirá o ID de usuário do DataStage**. Exemplo: `EMP_CLI` torna-se `IGOR.EMP_CLI`.

### 16.4. Session — níveis de isolamento

| Nível | Comportamento |
|---|---|
| **Leitura não confirmada** (Read Uncommitted) | Linhas lidas durante uma transação **podem ser alteradas** por outros processos |
| **Leitura confirmada** (Read Committed) | Linhas lidas podem ser alteradas por outros processos, **mas não podem ser lidas até que a transação seja concluída** |
| **Leitura repetida** (Repeatable Read) | **Não é possível alterar** as linhas por outros processos até que a transação seja concluída |
| **Serializável** (Serializable) | **Não é possível ler nem alterar** as linhas por outros processos até que a transação seja concluída |

### 16.5. Before / After SQL

- Instrução SQL a ser processada **antes ou depois** de os dados serem processados pelo estágio Connector;
- Exemplo de uso: **criar ou eliminar índices secundários**;
- Variantes: `Before SQL (node)` / `After SQL (node)` — executadas **uma vez por node**, em vez de uma vez por job.

### 16.6. Propriedades de gravação

**`Write mode` (modo de gravação):**

| Modo | Comportamento |
|---|---|
| **Insert** (Inserir) | Insere as linhas |
| **Update** (Atualizar) | Atualiza as linhas existentes |
| **Insert then update** (Inserir depois atualizar) | **Se a inserção falhar, tenta atualizar** |
| **Update then insert** (Atualizar depois inserir) | **Se a atualização falhar, tenta inserir** |
| **Delete** | Remove as linhas |
| **Bulk load** (Carregamento em massa) | **Chama o utilitário de carregamento em massa** (ex.: `db2load` no DB2) |

**`Table action` (ação da tabela):**

| Ação | Comportamento |
|---|---|
| **Append** (Anexar) | **Anexa dados a uma tabela existente** |
| **Truncate** (Truncar) | **Exclui dados existentes antes de gravar** |
| **Create** (Criar) | **Cria a tabela** |
| **Replace** (Substituir) | **Cria uma tabela ou substitui uma tabela existente** |

> **Erro clássico do treinamento:** com `Table action = Create`, a **segunda execução do job falha**, porque já existe uma tabela com o mesmo nome. A solução é parametrizar a `Table action` (por exemplo, com um parâmetro `#TableAction#`) ou usar `Replace`.

**Chave primária na criação:** marcando a caixa **`Key`** ao lado de uma coluna na aba `Columns`, o `CREATE TABLE` gerado inclui a opção **`PRIMARY KEY`** para essa coluna. Consequência: em uma segunda carga com `Append`, **todas as linhas são rejeitadas por chave duplicada** — cenário usado no treinamento para testar links de rejeição.

### 16.7. Objetos de conexão de dados (Data Connection)

Armazenam **os valores das propriedades da conexão como um objeto do repositório**:

- **Nome de usuário e senha** — **a senha é criptografada**;
- **Origem de dados ou nome do banco de dados**;
- **Outras propriedades da conexão específicas ao tipo de conexão**.

Características:

- Os objetos de conexão são **vinculados a um tipo específico de Connector** (ou outro tipo de estágio de banco);
- Os valores podem ser **carregados no estágio Connector de um job**:
  - pelo **link de carregamento dentro do estágio**;
  - por **botão direito > `Load Data Connection`**;
- **Também é possível salvar valores de estágio existentes em um objeto de conexão de dados**.

Criação: `New > Other > Data Connection`, escolhendo o **stage type** em `Connect using Stage Type` e preenchendo os parâmetros (ConnectionString, Username, Password, RDBMS, etc.).

### 16.8. Vários links de entrada em um Connector

Permite **gravar linhas em várias tabelas dentro da mesma unidade de trabalho (transação)**.

- Use o **painel de navegação** no estágio para selecionar as propriedades **de cada link**;
- É possível **especificar a ordem dos registros de entrada** pela propriedade **`Record ordering`**:

| Valor | Comportamento |
|---|---|
| **`All records`** | **Todos os registros do primeiro link**, então o link seguinte, etc. |
| **`First record`** | **Um registro de cada link é processado por vez** |
| **`Ordered`** | **Ordenação especificada pelo usuário** |

**Links de rejeição por link de entrada:**

- Podem ser criados **para cada link de entrada**;
- Podem ser baseados em:
  - **Erro de SQL** (`SQL error`);
  - **Linha não atualizada** (`Row not updated`);
- As colunas **`ERRORCODE`** e **`ERRORTEXT`** podem ser incluídas a cada linha de rejeição (aparecem como `RejectERRORCODE` e `RejectERRORTEXT` na saída).

### 16.9. SQL Builder

Ferramenta gráfica para construir instruções SQL sem digitá-las.

Acesso: na linha `Select statement` (ou `Insert/Update statement`), botão **`Tools`** → **`Build new SQL (ODBC 3.52 extended syntax)`** ou **`Edit existing SQL`**.

Funcionamento:

1. **Arrastar a Table Definition** para a tela;
2. **Arrastar as colunas** desejadas para o painel `Select columns`;
3. Definir **ordenação** (coluna `Sort` = Ascending/Descending e a ordem de classificação);
4. Construir a **cláusula WHERE** no painel de filtro, podendo **usar parâmetros do job** (ex.: `entre #Baixo# e #Alto#`);
5. Criar **colunas calculadas** com o **Expression Editor** (selecionar predicado `Functions`, escolher a função — ex.: `SUBSTRING` — e informar os parâmetros), atribuindo um **alias de coluna**;
6. Conferir o SQL gerado na **guia `SQL`** na parte inferior da janela;
7. `OK` para salvar — o DataStage pede confirmação para **mesclar as colunas selecionadas do SQL Builder com as colunas da guia `Columns`**.

Pontos de atenção:

- Colunas removidas do SELECT devem ser **removidas da aba `Columns`**;
- Colunas calculadas novas (ex.: `COLUNA05_CURTA`) precisam ter o **tipo corrigido manualmente** (ex.: `Varchar(10)`);
- Para filtrar por uma coluna com parâmetros, **a coluna precisa ser adicionada antes** de ser alvo dos parâmetros.

### Fatos testáveis — Capítulo 16

- Os tipos de Connector incluem **ODBC, DB2, Oracle, Teradata, Hive, Redshift, Snowflake**, entre outros.
- **Todos os Connectors compartilham o mesmo conjunto central de propriedades**; as **requeridas são identificadas visualmente**.
- Connectors têm **suporte paralelo para leitura e gravação**.
- Com **`Generate SQL = Yes`**, o estágio gera o SQL a partir das **definições de coluna** e do **nome da tabela**.
- Se o **nome do esquema não for especificado**, o estágio assume o **ID de usuário do DataStage**.
- As **três maneiras** de compor instruções SQL em um Connector: **gerar automaticamente (`Generate SQL = Yes`), digitar manualmente ou usar o SQL Builder**.
- Instruções suportadas nos Connectors incluem **Select, Insert, Update, Upsert** e ações de tabela como **Create Table**.
- Os quatro níveis de isolamento são: **leitura não confirmada, leitura confirmada, leitura repetida e serializável**.
- **Before/After SQL** executa instruções antes/depois do processamento; uso típico: **criar ou eliminar índices secundários**.
- **Write modes**: Insert, Update, **Insert then update**, **Update then insert**, Delete e **Bulk load** (`db2load` no DB2).
- **Table actions**: **Append, Truncate, Create, Replace**.
- Um **Data Connection** armazena usuário e **senha criptografada**, origem de dados e propriedades específicas.
- As **duas maneiras** de carregar metadados de conexão em um estágio: **link de carregamento dentro do estágio** e **botão direito > `Load Data Connection`**.
- A propriedade **`Record ordering`** aceita **`All records`, `First record` e `Ordered`**.
- Links de rejeição de Connector podem ser baseados em **erro de SQL** ou **linha não atualizada**, e podem incluir as colunas **`ERRORCODE`** e **`ERRORTEXT`**.
- Marcar a caixa **`Key`** na aba Columns faz o `CREATE TABLE` gerado incluir **`PRIMARY KEY`**.
- Com `Table action = Create`, a **segunda execução falha** porque a tabela já existe.

---

# Parte IV — Orquestração, repositório e operação

## 17. Job Sequence

### 17.1. Recursos

O **Job Sequence** é um tipo de job cujo objetivo é **realizar o agendamento e sequenciamento** de jobs de integração de dados.

Recursos:

- **Efetua controle e execução de um conjunto de jobs DataStage**;
- **Controla a ordem de execução**;
- **Permite estabelecer condições para execução**;
- **Permite configurar fluxos complexos de execução:**
  - **Loop**
  - **All / Some**
  - **Wait for file**
- **Funcionalidades de sistema:**
  - **E-mail**;
  - **Executa comandos no sistema operacional**;
- **Permite a configuração de checkpoints para restart**.

> O canvas do Job Sequence tem **coloração diferente** do canvas de um Parallel Job — é a pista visual de que se trata de um desenvolvimento de natureza distinta.

### 17.2. Estágios do Job Sequence

| Categoria | Estágio | Função |
|---|---|---|
| **Execução** | **Job Activity** | **Execução de um Job** |
| | **Execute Command** | **Executa comando** no sistema operacional |
| | **Notification Activity** | **Envia e-mail** |
| | **Routine Activity** | Executa uma rotina (BASIC routine) |
| **Controle de fluxo** | **Sequencer** | **Continua para Todos (All) / Algum (Any)** |
| | **Wait for File** | **Executa se arquivo existe / não existe** |
| | **StartLoop / EndLoop** | Laço de repetição (numérico ou por lista) |
| | **Nested Condition** | **Executa se condição é atendida** |
| | **User Variables Activity** | Define variáveis reutilizáveis no sequence |
| **Controle de erros** | **Exception Handler** | **Stage de exceção para manipular interrupções** |
| | **Terminator Activity** | Encerra jobs em execução de forma controlada |

### 17.3. Sequência para criação de um Sequence

1. **Abertura de um novo Sequence**;
2. **Especificar se é reinicializável** (`Add checkpoints so sequence is restartable on failure`);
3. **Inclusão de estágios**:
   - estágios para executar tarefas;
   - estágios para executar comandos do sistema e executáveis;
   - estágios de propósito especial;
4. **Inclusão de links** — especificação da ordem em que as tarefas devem ser executadas;
5. **Especificação de acionadores (triggers)** — *acionadores especificam a condição sob a qual o controle passa através de um link*;
6. **Especificação de manipulação de erros**;
7. **Ativação/desativação de pontos de verificação de reinicialização (checkpoints)**.

### 17.4. Job Activity — modos de execução

Ao arrastar um job do repositório para o canvas do Sequence, cria-se automaticamente um objeto **`Job Activity`**. Existem **quatro modos de execução**:

| Modo | Comportamento |
|---|---|
| **`Run`** | **Executa o job, apenas se estiver em um estado válido** |
| **`Reset if required, then run`** | **Caso esteja em estado inconsistente, tenta efetuar uma nova compilação/Reset e executar** |
| **`Validate Only`** | **Efetua apenas uma validação** de ambiente e parâmetros, **porém não executa o job** propriamente dito |
| **`Reset Only`** | **Efetua uma operação de Reset apenas** — tenta recompilar o job e deixá-lo em estado consistente para execução, **sem de fato executar** |

> **Boa prática explícita do treinamento:** selecionar **`Reset if required, then run`**, pois em certos casos o job é importado para o ambiente porém não é compilado nele, e a execução do sequence poderia falhar desnecessariamente.

**Parâmetros no Job Activity:** na aba `Parameters`, o botão **`Insert Parameter`** faz o job **herdar os parâmetros** do Parameter Set importado no Job Sequence. O Parameter Set usado pelos jobs filhos **precisa ser importado também no Job Sequence** (`Ctrl+J > Parameters`).

**Boa prática de nomenclatura:** renomear o estágio `Job Activity` com **o nome do job que será executado** (copiar da aba `Job` e colar em `General > Name`).

### 17.5. Triggers (acionadores)

Os triggers definem **a condição sob a qual o controle passa através de um link**.

| Expression Type | Significado |
|---|---|
| **`Unconditional`** | Segue sempre, independentemente do resultado |
| **`OK`** (Conditional - OK) | **Só executa o próximo job se o anterior terminou com sucesso.** Altera a cor do link para **verde** |
| **`Failed`** (Conditional - Failed) | Segue apenas se o job anterior falhou |
| **`Warnings`** (Conditional - Warnings) | Segue se terminou com avisos (`Finished (see log)`) |
| **`Custom`** (Conditional - Custom) | Expressão personalizada sobre o status/retorno |
| **`ReturnValue`** | Usado com Execute Command / Routine: avalia o código de retorno |
| **`Otherwise`** | Caminho alternativo quando nenhum trigger anterior foi satisfeito |

> **Ponto essencial:** **apenas ligar um job a outro cria sequenciamento de execução independentemente do status do anterior.** Para garantir integridade (ex.: carregar Dimensões antes da Fato em um Data Warehouse; carregar Cadastro de Produtos antes de Pedidos), é preciso definir **`Expression Type = OK`** em cada estágio.

### 17.6. Sequencer

O estágio **Sequencer** (representado por uma seta azul) é usado para **sincronizar fluxos paralelos**: ele aguarda várias entradas e libera a continuação.

| Modo | Comportamento |
|---|---|
| **`All`** | Só dispara os próximos processos após **todos** os jobs de entrada finalizarem |
| **`Any`** | Dispara após **qualquer um** dos jobs de entrada finalizar |

Uso típico: permitir que jobs independentes rodem simultaneamente, mas garantir que um job que consome os arquivos gerados por eles só comece depois que **todos** terminarem.

### 17.7. Restart e checkpoints

Em `Job Sequence Properties > General`:

- **`Add checkpoints so sequence is restartable on failure`** — habilita os pontos de verificação;
- Em caso de falha, ao reiniciar, o sequence **retoma a partir do ponto em que parou**, sem reexecutar as atividades já concluídas com sucesso;
- Opções de **log** do sequence: `Log warnings after activities that finish with status other than OK`, `Log report messages after each job run`;
- **Stage de exceção (Exception Handler)** para manipular interrupções não previstas;
- Em um Job Activity específico é possível marcar **`Do not checkpoint run`**, forçando a reexecução daquela atividade em todo restart.

### 17.8. Modo de execução e parâmetros do Sequence

Em `Job Sequence Properties`:

- **Modo de execução** (`Sequence execution mode`): pode ser configurado para tratar as atividades como **reutilizáveis** ou não;
- **Parâmetros do job**: o Sequence tem sua própria lista de parâmetros, que são **repassados aos jobs filhos**;
- `Allow Multiple Instance` também se aplica a sequences.

### 17.9. Notification Activity (e-mail)

Configuração exige informações do **servidor SMTP de saída** da empresa, previamente configurado pelo administrador do Information Server.

Campos típicos:

| Campo | Conteúdo |
|---|---|
| `SMTP Mail server name` | Host do servidor de e-mail |
| `Senders email address` | Remetente |
| `Recipients email address` | Destinatário(s) |
| `Email subject` | Assunto |
| `Attachments` | Anexos (ex.: arquivo de log) |
| `Email body` | Corpo; aceita variáveis do sequence |
| `Include job status in email` | Anexa o status da atividade anterior |

### 17.10. Wait For File Activity

| Propriedade | Efeito |
|---|---|
| `Filename` | Arquivo a observar (aceita parâmetro) |
| `Wait for file to appear` | Aguarda o arquivo **existir** |
| `Wait for file to disappear` | Aguarda o arquivo **sumir** |
| `Timeout length (hh:mm:ss)` | Tempo máximo de espera |
| `Do not timeout` | Espera indefinidamente |
| `Do not checkpoint run` | Não gravar checkpoint desta atividade |

### Fatos testáveis — Capítulo 17

- O **Job Sequence** controla a execução de um conjunto de jobs, a **ordem de execução**, **condições** e permite **checkpoints para restart**.
- O Job Sequence roda no **Server Engine**.
- Estágios de **execução**: **Job Activity** (executa job), **Execute Command** (executa comando), **Notification Activity** (envia e-mail).
- Estágios de **controle de fluxo**: **Sequencer**, **Wait for File**, **StartLoop/EndLoop**, **Nested Condition**.
- Estágio de **controle de erros**: **Exception Handler**.
- Os **quatro modos de execução** do Job Activity são: **`Run`**, **`Reset if required, then run`**, **`Validate Only`** e **`Reset Only`**.
- **`Validate Only`** valida ambiente e parâmetros, **mas não executa** o job.
- **`Reset Only`** recompila/reseta **sem executar**.
- A boa prática recomendada é usar **`Reset if required, then run`**.
- **Triggers** especificam a **condição sob a qual o controle passa através de um link**.
- O trigger **`OK`** só continua se o job anterior terminou com sucesso, e deixa o link **verde**.
- Apenas ligar dois jobs cria sequenciamento **independentemente do status** do anterior.
- O estágio **`Sequencer`** tem as opções **`All`** e **`Any`**.
- O canvas do Job Sequence tem **coloração diferente** do canvas de um Parallel Job.
- O Parameter Set usado pelos jobs filhos **precisa ser importado no Job Sequence**; o botão **`Insert Parameter`** faz o job herdar esses parâmetros.

---

## 18. Funções do repositório

### 18.1. Objetivos

- Executar **busca simples**;
- Executar **busca avançada**;
- Executar uma **análise de impacto**;
- **Comparar as diferenças entre duas definições de tabela**;
- **Comparar as diferenças entre dois jobs**.

### 18.2. Quick Find (busca rápida)

Na janela `Repository` (painel esquerdo), clique em **`Open quick find`** na parte superior.

| Campo | Função |
|---|---|
| **`Name to find`** | Nome com **caractere curinga** (ex.: `Busca*`) |
| **`Types to find`** | Filtro por tipo de objeto (Jobs, Table Definitions, etc.); botões `Select all` / `Unselect all` |
| **`Include descriptions`** | **Inclusão de correspondências nas descrições de objeto** |
| `Find` / `Next` | Executa e **destaca o próximo item** encontrado |

**Caracteres curinga aceitos:** **`*`** (qualquer sequência de caracteres) e **`?`** (um único caractere).

### 18.3. Advanced Find (busca avançada)

Acessada pelo botão **`Adv.`** do Quick Find — abre a janela **`Repository Advanced Find`**.

Filtros disponíveis:

| Filtro | Descrição |
|---|---|
| **Name to find** | Nome, com curingas |
| **Type** | Tipo de objeto (Parallel Jobs, Table Definitions, Parameter Sets, Routines...) |
| **Folder / Location** | Pasta do repositório em que procurar |
| **Creation / Last modification** | Intervalo de datas de criação ou última modificação |
| **Where used** | Localiza objetos **que usam** um objeto especificado (ex.: jobs que usam a Table Definition `SeqLookup`) |
| **Dependencies of** | Localiza objetos **dos quais** um objeto depende |
| **Created by / Modified by** | Usuário responsável |
| **Options** | Case sensitivity, incluir descrições |

Resultados: guias **`Results - Details`** (texto) e **`Results - Graphical`** (gráfico navegável, com **Bird's Eye View** e controle de **Zoom**).

A partir dos resultados é possível: **executar análise de impacto**, **comparar objetos** e **exportar para um arquivo**.

> **Caso prático:** "Você tem um job cujo nome começa com `Lab`, não lembra o restante do nome nem onde ele está. Qual a maneira mais rápida de exportá-lo?" → **fazer um Quick/Advanced Find por `Lab*`, selecionar o resultado, botão direito > `Export`**.

### 18.4. Análise de impacto (Impact Analysis)

**O que permite localizar:**

- **Onde um objeto é usado:**
  - localizar os **jobs ou estágios** em que uma **Table Definition** é usada;
  - localizar as **Job Sequences** em que um **job** está;
  - localizar os **jobs, Table Definitions e estágios** em que **colunas** são usadas;
- **Dependências do objeto:**
  - localizar os **estágios de que um job depende**.

**Como executar:** clique com o **botão direito sobre um objeto** para abrir o menu e escolha a opção de análise (ex.: `Find where used`, `Find dependencies`, `Show dependency path to '<objeto>'`).

**A dependência pode ser exibida de maneira textual ou gráfica.**

**Localização da origem de uma coluna (linhagem):** selecionar a coluna e escolher de onde o dado se originou — rastreamento de *data lineage*.

**Geração de relatório:** `File > Generate report` gera um relatório descrevendo os resultados da busca avançada. O relatório é **salvo no Repository** e pode ser visualizado pelo **Reporting Console** (login na console web).

### 18.5. Comparação de objetos

**Cenário típico:** `Job1` é salvo como `Job2`; alterações são feitas em `Job2`. Quais alterações foram feitas?

- `Job1` pode ser um **job de produção**;
- `Job2` é uma **cópia do job de produção** após aprimoramentos ou outras alterações.

**Como comparar:** na janela `Repository`, **botão direito no job** → **`Compare Against`** → escolher o outro job → `OK`. A janela **`Comparison Results`** exibe as diferenças.

Recursos da janela de resultados:

- Clicar em um link do relatório (ex.: o nome de um link alterado) **destaca o estágio em ambos os jobs** (use `Window > Tile` para exibir os dois lado a lado);
- Clicar em uma **palavra sublinhada** abre o **editor para o item de referência**;
- **`File > Save as`** salva o relatório como **arquivo HTML**.

**Objetos comparáveis:** é possível comparar as diferenças entre **dois jobs** e entre **duas Table Definitions**.

### 18.6. Import/Export como controle de versão

Ver Capítulo 5.5. Complementos:

- A ferramenta de linha de comando **`istool`** (`istool export` / `istool import`) permite automatizar exportações `.isx` em pipelines de CI;
- O **Information Governance Catalog** e o **InfoSphere Information Server Manager** oferecem gestão de *assets* e deploy entre ambientes.

### Fatos testáveis — Capítulo 18

- É possível comparar as diferenças entre **dois jobs** e entre **duas Table Definitions**.
- Os caracteres curinga aceitos na busca são **`*`** e **`?`**.
- A opção **`Include descriptions`** faz a busca considerar também as descrições dos objetos.
- Filtros do **Advanced Find** incluem: **tipo de objeto, pasta, data de criação/modificação, `Where used`, `Dependencies of` e criador/modificador**.
- A **análise de impacto** localiza **onde um objeto é usado** e **de que um objeto depende**.
- A análise de impacto é acionada pelo **botão direito** sobre o objeto.
- O resultado de dependência pode ser exibido de forma **textual ou gráfica**.
- O relatório de busca é gerado por **`File > Generate report`**, salvo no **Repository** e visualizado no **Reporting Console**.
- A comparação de jobs é feita por **botão direito > `Compare Against`**; o resultado pode ser salvo como **HTML**.
- Para exportar rapidamente um job cujo nome parcial se conhece: **buscar com curinga e usar botão direito > `Export`** no resultado.

---

## 19. Execução, monitoramento e linha de comando

### 19.1. Execução pelo Designer e pelo Director

- No **Designer**: `Compile` → `Run`. A caixa **`Job Run Options`** permite informar valores de parâmetros e escolher o **value file** do Parameter Set;
- No **Director**: selecionar o job na visão `Status` e clicar em `Run`; jobs com status `Aborted` exigem **Reset** antes;
- `Show performance statistics` (botão direito no canvas do Designer) mostra **linhas e taxa por link** durante a execução.

### 19.2. Estatísticas de desempenho e log

- O **log** registra cada evento da execução: início/fim, mensagens de estágio, warnings, erros fatais;
- **`Event Detail`**: duplo clique em uma mensagem abre a janela com o conteúdo completo;
- Níveis de mensagem: **Info**, **Warning**, **Fatal**, **Control**, **Reject**;
- Mensagens do **Peek** aparecem prefixadas pelo nome do estágio.

### 19.3. Monitor do Director

- `Tools > New Monitor` abre o monitor do job;
- Mostra **linhas processadas, linhas/segundo e tempo** por estágio/link;
- **`Show Instances`** expande cada estágio em suas **instâncias por partição** — é como se visualizam as **partições de execução do Peek** e se diagnostica desbalanceamento.

### 19.4. Execução em linha de comando — `dsjob`

O utilitário **`dsjob`** executa e consulta jobs a partir da linha de comando do sistema operacional.

| Comando | Função |
|---|---|
| **`dsjob -run -param numrows=100 <Projeto> <Job>`** | **Executa uma tarefa.** `-run` executa; **`-param` especifica os parâmetros** |
| **`dsjob -logsum <Projeto> <Job>`** | **Exibe as mensagens da tarefa no log** |
| `dsjob -stop <Projeto> <Job>` | Interrompe um job em execução |
| `dsjob -jobinfo <Projeto> <Job>` | Status, hora de início/fim e código de retorno |
| `dsjob -lprojects` | Lista os projetos |
| `dsjob -ljobs <Projeto>` | Lista os jobs de um projeto |
| `dsjob -lparams <Projeto> <Job>` | Lista os parâmetros do job |
| `dsjob -report <Projeto> <Job>` | Gera relatório de execução |
| `dsjob -paramfile <arquivo>` | Passa parâmetros a partir de um arquivo |

Outras flags de `-run`: `-mode NORMAL|RESET|VALIDATE`, `-jobstatus` (retorna o status como código de saída), `-wait` (aguarda a conclusão), `-warn <n>` (limite de warnings), `-rows <n>` (limite de linhas).

> **Resposta clássica:** *"Qual comando é usado para executar tarefas na linha de comandos do sistema operacional?"* → **`dsjob`**.

### 19.5. Agendamento

- Pelo **Director**, na visão **`Schedule`** (usa o agendador do sistema operacional: `at`/Task Scheduler no Windows, `cron` no Unix);
- Por ferramentas externas de orquestração corporativa (Control-M, Autosys, Tivoli), chamando `dsjob`;
- Por **Job Sequence** disparado por agendamento.

### Fatos testáveis — Capítulo 19

- O comando de linha para executar jobs é **`dsjob`**.
- **`dsjob -run`** executa a tarefa; **`-param`** especifica parâmetros; **`-logsum`** exibe as mensagens do log.
- A opção **`Show Instances`** do Monitor mostra as **instâncias por partição**.
- Jobs em status **Aborted** precisam de **Reset** antes de nova execução.
- Os níveis de mensagem do log incluem **Info, Warning e Fatal**.
- O agendamento nativo é feito pela visão **`Schedule`** do Director.

---

# Parte V — QualityStage

## 20. Qualidade de dados e o ciclo QualityStage

### 20.1. Por que qualidade de dados importa

- Sistemas de informação estão presentes em **quase 100% das empresas**;
- As **informações são recursos estratégicos** das corporações;
- A **qualidade das informações é fator determinante de fracasso ou sucesso**.

**Consequências da falta de qualidade de informações:**

- **Retrabalho**
- **Tempo**
- **Consumo de recursos**
- **Perda de oportunidades**
- **Perda de credibilidade**
- **Perda de clientes**

### 20.2. Aspectos da qualidade de dados

Os aspectos tratados no treinamento:

| Aspecto | O que avalia |
|---|---|
| **Consistência** | Os dados seguem o mesmo padrão/formato em todas as ocorrências |
| **Integridade** | O **relacionamento entre dados** está correto (ex.: Produto × Categoria de Produto) |
| **Completude** | Os campos necessários estão preenchidos |
| **Atualização** | Os dados refletem o estado atual do mundo real |
| **Duplicidade** | Ausência de registros repetidos representando a mesma entidade |
| **Relevância** | Os dados servem ao propósito de negócio |

> O relacionamento entre dados (Produto × Categoria de Produto) é tratado no aspecto **Integridade**.

### 20.3. Desafios de qualidade de dados

- **Padrões diferentes ou inconsistentes** em estrutura, formato e valores;
- **Dados ausentes, valores padrão** (default sem significado);
- **Erros de ortografia, dados em campos errados**;
- **Informações enterradas** (dado relevante escondido dentro de um campo de texto livre);
- **Anormalidades de dados**.

**Por que é importante:**

- **Relatórios precisos**;
- **Informações precisas para operações de suporte**;
- **Suporte ao desenvolvimento de aplicativos que vão além do escopo original para o qual os dados foram concebidos**.

### 20.4. Exemplos de problemas

**Padrões diferentes ou inconsistentes** (mesma pessoa em três origens):

| Origem 1 | Origem 2 | Origem 3 |
|---|---|---|
| `Igor S. Franco / BH` | `Igor Franco / Belo Horizonte` | `Dr. Igor da Silveira F. / 30310-000` |
| `Marco A. de Souza / São Paulo` | `Marco Antonio S. / Sao Paulo` | `Senhor Marcos Antonio S. / 05628-010` |

**Verificação de integridade dos metadados / dados ausentes:**

| Nome | CPF | Telefone |
|---|---|---|
| Igor S. Franco | 00717455102 | 31918294389 |
| *(ausente)* | 837182491 | (11)918274612 |
| Julia da Silva M. | 991.425.122-24 | 61-91829-9184 |
| Janaina da Lua | *(ausente)* | 819281941-99 |
| Pedro Xavier | 11111111111 *(valor padrão inválido)* | 41 8172 9182 |

**O mix das anormalidades** (mesma empresa, cinco grafias):

```
19281904  Amazon                      187 N.Pk. Str. Salem NH 01456
19241904  Amazon Web Services, Inc.   187 No. Park St Salem NH 04156
19281104  Amazon AWS                  15 Main St. Andover MA 02341
19281404  AWS                         PO Box 9 Boston MA 02210
19281907  Amazon Web Services         187 Park Ave Salem NH 04156
```

### 20.5. O ciclo de qualidade de dados do QualityStage

```
Início → Investigate → Standardize → Matching → Survive
```

| Etapa | Objetivo |
|---|---|
| **Investigate** (Investigação) | Entender os dados, descobrir anormalidades, identificar problemas |
| **Standardize** (Padronização) | **Minimizar as diferenças encontradas no conteúdo dos campos e facilitar o processo de Matching** |
| **Matching** (Pareamento) | Identificar registros que representam a mesma entidade, com **comparação aproximada** |
| **Survive** (Sobrevivência) | **Composição do melhor registro** (Golden Record) |

Complementarmente, um **projeto de qualidade de dados** tem três momentos: **Investigar → Corrigir → Monitorar** os dados a fim de garantir a qualidade de informações.

**Correspondência etapa × definição (quadro clássico de exercício):**

| Etapa | Definição |
|---|---|
| **Enriquecimento** | Validar e complementar dados |
| **Matching** | Comparação aproximada |
| **Sobrevivência** | Composição do melhor registro |
| **Padronização** | Descrever de forma padrão |
| **Investigação** | Identificação de problemas |

### 20.6. Exemplo — gestão de dados mestres (MDM)

```
Origem 1 ┐
Origem 2 ├→ Padronizar os formatos → Vincular registros → Consolidar → Visão única do cliente
Origem 3 ┘       dos dados              relacionados
```

### 20.7. Os estágios do QualityStage (paleta Data Quality)

| Estágio | Função |
|---|---|
| **Investigate** | Investigação dos dados |
| **Standardize** | Padronização dos dados; permite **construção e customização total das regras** a serem empregadas |
| **Match Frequency** | Criação de **arquivos de frequência** utilizados no Matching |
| **One-source Match** | Matching entre registros de **mesma origem** (tabelas/arquivos) — *Unduplicate Matching* |
| **Two-source Match** | Matching entre registros de **origens distintas** — *Reference Matching* |
| **Survive** | Sobrevivência dos dados; permite a definição dos critérios a serem empregados |
| **MNS** (Multinational Standardize) | **Padroniza dados de endereço internacional.** Utiliza **nomes de países, abreviações ou códigos de país ISO** no arquivo de entrada para aplicar regras de padronização adequadas ao país |
| **MDM Connector** | Utiliza as **APIs MDM `MemGet` e `MemPut`** para **recuperar (ler)** membros de dados MDM e **inserir ou atualizar (gravar)** membros |
| **SQA** (Standardization Quality Assessment) | **Avalia os resultados do processo de padronização** e verifica se os resultados atendem aos objetivos de qualidade de dados |

### 20.8. Definições das quatro etapas

**Por que investigar?**

- **Descobrir possíveis anormalidades nos dados**;
- **Identificar dados inválidos e valores padrão**;
- **Revelar regras de negócios não documentadas**;
- **Verificar a confiabilidade dos dados nos campos a serem usados como critérios de correspondência**;
- **Obter uma compreensão completa dos dados**.

**O que é padronizar?**

- **Aplicar lógica de negócios à "confusão" de dados** → manipulação de padrões;
- **Impor padrões de negócios a elementos de dados** → definição de padrões;
- **Transformar a entrada em uma saída que cumpra o requisito de negócios** → estruturação dos campos.

**Como padronizar?**

- **Fazer a análise sintática (parsing) de campos de dados específicos em elementos de dados atômicos menores**;
- A análise sintática **se baseia em caracteres de separação definidos** (por exemplo, `,` ou ` `);
- **Os elementos de dados atômicos são chamados de "tokens"**;
- **Categorizar elementos de dados.**

Exemplo: `Nome = 'Sr Antonio Silva Lopes'` torna-se:

| Token | Categoria |
|---|---|
| Sr | **Título (T)** |
| Antonio | **Nome / First name (F)** |
| Silva | **Segundo nome / Middle (I)** |
| Lopes | **Sobrenome / Last (L)** |

**Padronização no QualityStage:**

- **Usa uma linguagem de reconhecimento de padrões altamente flexível**;
- **Pode utilizar padronização específica de campo ou de domínio** (regras exclusivas para nomes × endereços × datas, etc.);
- **Contém tabelas customizáveis de classificação e padronização**;
- **Utiliza resultados da investigação de dados**.

**O que é Matching?**

- **Identificar todos os registros de um arquivo que correspondem a registros semelhantes de outro arquivo**;
- **Identificar registros duplicados em um arquivo**;
- **Desenvolver relacionamentos entre registros de diversos arquivos**;
- **Realizar correspondência estatística e probabilística**;
- **Calcular uma pontuação com base na probabilidade de uma correspondência**.

**Como fazer Matching?**

- **Arquivo único (deduplicação) ou dois arquivos (referência)**;
- **Diferentes comparações para diferentes tipos de dados** (caractere exato, correspondência incerta/difusa, erros de pressionamento de tecla, comparação de várias palavras);
- **Geração de pesos compostos de vários campos**;
- **Uso de algoritmos probabilísticos ou estatísticos**;
- **Aplicação de cortes ou limites de correspondência** para identificar níveis de correspondência automáticos ou administrativos;
- **Incorporação de pesos de substituição** para avaliar condições específicas de dados (valores padrão, elementos discriminatórios).

**O que é sobreviver?**

- **Criação de dados de sobrevivência da melhor qualidade** com base em informações de **nível de registro ou de campo**;
- **Criar formatos corretos de saída:**
  - **Tabela relacional com chaves primárias e estrangeiras**;
  - **Transações para atualizar bancos de dados**.

Exemplo de sobrevivência:

```
Variações:
Igor          Franco        00717455102   31918294389
Igor  Da Silveira  Franco   (vazio)       (vazio)

Sobrevivente (Golden Record):
Igor  Da Silveira  Franco   00717455102   31918294389
```

### Fatos testáveis — Capítulo 20

- Um dos motivos de **aumento de custos** das empresas em termos de tecnologia é a **falta de qualidade de informações**.
- O **aumento da qualidade de informações** é obtido por meio do **aumento da qualidade de dados**.
- Um projeto de qualidade visa **Investigar, Corrigir e Monitorar** os problemas de qualidade de dados.
- Os aspectos da qualidade de dados são: **Consistência, Integridade, Completude, Atualização, Duplicidade e Relevância**.
- O **relacionamento entre dados** (ex.: Produto × Categoria) é tratado no aspecto **Integridade**.
- A etapa que visa **minimizar as diferenças no conteúdo dos campos e facilitar o Matching** é a **Padronização (Standardize)**.
- Correspondências: **Matching = comparação aproximada**; **Investigação = identificação de problemas**; **Enriquecimento = validar e complementar dados**; **Sobrevivência = composição do melhor registro**; **Padronização = descrever de forma padrão**.
- O ciclo do QualityStage é **Investigate → Standardize → Matching → Survive**.
- Consequências da falta de qualidade: **retrabalho, tempo, consumo de recursos, perda de oportunidades, perda de credibilidade e perda de clientes**.
- Os elementos atômicos resultantes da análise sintática são chamados **tokens**.
- O estágio **MNS** padroniza **endereços internacionais** usando nomes/abreviações/códigos **ISO** de país.
- O **MDM Connector** usa as APIs **`MemGet`** (ler) e **`MemPut`** (gravar).
- O estágio **SQA** avalia os **resultados da padronização**.
- O **One-source Match** compara registros da **mesma origem** (deduplicação); o **Two-source Match**, de **origens distintas** (referência).
- O **Match Frequency** cria os **arquivos de frequência** usados no matching.

---

## 21. Estágio Investigate

### 21.1. Propósito da investigação

- **Verificar o domínio:** revisar cada campo de interesse e **verificar se os dados correspondem aos metadados**; identificar **formatos dos dados, valores ausentes e valores padrão**;
- **Identificar anormalidades de dados:** de **formato**, **estrutura** e **conteúdo**;
- **Detectar as regras de negócios não escritas**;
- **Identificar os requisitos de preparação de dados**.

### 21.2. Funcionalidades do estágio

- **Analisa campos de forma livre e de domínio único**;
- **Fornece distribuições de frequência de valores e padrões distintos**.

### 21.3. Os três métodos do Investigate

| Método | Para que serve |
|---|---|
| **Character Discrete Investigate** | **Analisa cada coluna individualmente**, em uma única execução. Cada campo tem uma linha específica de análise, de acordo com cada padrão encontrado, **sem concatenação de campos** |
| **Character Concatenate Investigate** | **Concatena vários campos** e analisa o conjunto — usado para **correlação de campo cruzado**, verificando os relacionamentos de lógica entre campos |
| **Word Investigate** | **Identificar campos de forma livre** que poderão exigir **análise sintática (parsing)** e **detecção de palavras-chave** para classificação |

> **Nota sobre as descrições do material:** as duas primeiras categorias frequentemente aparecem descritas de forma cruzada. O critério operacional inequívoco é: **Discrete = uma análise por coluna** (as colunas selecionadas são investigadas separadamente); **Concatenate = as colunas selecionadas são unidas e investigadas como um único valor** (cross-field correlation).

### 21.4. Terminologia: máscaras de coluna e tokens

**Máscaras de coluna (Column Masks)** — definem como cada caractere da coluna será tratado:

| Caractere de máscara | Uso |
|---|---|
| **`C`** | Para **visualizar os valores reais de caractere** dos dados |
| **`T`** | Para **visualizar o padrão (type) dos dados** |
| **`X`** | Para **ignorar caracteres** |

**Tokens:** **valores individuais que são analisados para criar padrões**.

> É possível fazer análises com **máscaras diversas em um mesmo estágio Investigate**; separar em dois estágios (um com máscara `T`, outro com `C`) é apenas critério didático e de organização.

### 21.5. Colunas padrão de saída do Investigate

| Coluna | Significado |
|---|---|
| **`qsInvColumnName`** | Identifica os **nomes da coluna que está sendo investigada** |
| **`qsInvPattern`** | Exibe o caractere e o inclui na contagem de frequência e na análise de padrão. **`n` = números; `b` = branco/vazio; `a` = caracteres alfa (letras)**; os demais **não são substituídos** (parênteses, hífens, ponto, etc.) |
| **`qsInvSample`** | Mostra **uma ou mais amostras do conteúdo** dessa coluna. **O número a ser exibido é configurável** |
| **`qsInvCount`** | **Quantidade de ocorrências (frequência)** do determinado pattern |
| **`qsInvPercent`** | **Porcentagem de ocorrências (frequência em %)** do determinado pattern |

### 21.6. Word Investigate — detalhes

**Uso:**

- **Análise de padrões de campos de forma livre**;
- **Visualizar o padrão dos dados em um campo de texto livre e fazer a análise sintática em tokens individuais**.

**Processo do QualityStage:**

- **Aplicar conjuntos de regras (rule sets) a campos de forma livre**;
- **Detectar requisitos de análise sintática**;
- **Detectar padrões nos dados**;
- **Gerar relatórios de distribuições de frequência de padrões e relatórios de tokens**.

**Os dois relatórios:**

| Relatório | Uso |
|---|---|
| **Relatório de padrões (Pattern Report)** | **Examinar os padrões de ocorrência mais frequente**; **estimar quanto trabalho será necessário** para modificar um conjunto de regras para um cliente |
| **Relatório de tokens (Token Report)** | **Revisar os tokens com um especialista no assunto** para verificar se foram classificados adequadamente; **identificar os tokens não classificados que ocorrem com mais frequência e incluí-los no conjunto de regras** |

O estágio Word Investigate configurado com ambos os relatórios tem **duas saídas** — uma para o relatório de padrões e outra para o de tokens. A associação é feita em `Stage Properties > Stage > Link Ordering`.

### 21.7. Conjuntos de regras (Rule Sets)

**Regras para análise sintática, classificação e organização dos dados.**

**Domínios dos conjuntos de regras:**

- **Processamento de país**;
- **Pré-processamento**;
- **Processamento de domínios:**
  - **Nome**: negócios e pessoais;
  - **Endereço**;
  - **Área**: local, cidade, estado e CEP/códigos postais;
- **Processamento de endereços multinacionais**.

Exemplo de rule set brasileiro usado no treinamento: **`BREMAIL.SET`** (e-mail), com a legenda:

| Classe | Significado |
|---|---|
| **`D`** | Domínios BR |
| **`G`** | Domínios internacionais genéricos |
| **`P`** | País (alto nível ou domínio de topo) |
| **`S`** | Indicadores de site |

### 21.8. Processo de avaliação da qualidade de dados

Revise e analise **cada campo** para obter as seguintes informações:

- **Com que frequência o campo é preenchido?**
- **Quais são as anormalidades e valores fora do intervalo?**
- **Com que frequência cada um ocorre?**
- **Quantos valores exclusivos foram encontrados?**
- **Qual é a distribuição dos dados ou padrões?**

**Use os resultados do estágio Investigate para:**

- **Atualizar os requisitos de negócios do projeto**;
- **Definir o plano de desenvolvimento e o design do aplicativo**.

### Fatos testáveis — Capítulo 21

- Os **três métodos** do estágio Investigate são **Character Discrete**, **Character Concatenate** e **Word**.
- O Investigate **analisa campos de forma livre e de domínio único** e fornece **distribuições de frequência de valores e padrões distintos**.
- As **máscaras de coluna** são: **`C`** (valores reais de caractere), **`T`** (padrão/tipo dos dados) e **`X`** (ignorar caracteres).
- **Tokens** são os **valores individuais analisados para criar padrões**.
- As colunas padrão de saída são: **`qsInvColumnName`, `qsInvPattern`, `qsInvSample`, `qsInvCount` e `qsInvPercent`**.
- No `qsInvPattern`: **`n` = números, `a` = letras, `b` = branco/vazio**; os demais caracteres **não são substituídos**.
- **`qsInvSample`** mostra amostras do conteúdo e **o número de amostras é configurável**.
- O **Word Investigate** gera o **Pattern Report** e o **Token Report**.
- O **Pattern Report** serve para examinar os padrões mais frequentes e **estimar o esforço de customizar um rule set**.
- O **Token Report** serve para **revisar tokens com um especialista** e **incluir tokens não classificados no rule set**.
- Domínios de rule sets: **processamento de país, pré-processamento, processamento de domínios (nome, endereço, área) e endereços multinacionais**.
- Propósitos da investigação: **verificar domínio, identificar anormalidades, detectar regras de negócio não escritas e identificar requisitos de preparação de dados**.

---

## 22. Estágio Standardize

### 22.1. Função

No estágio Standardize efetuam-se as **padronizações necessárias a cada campo** — por exemplo decidir se um campo de CPF vai armazenar apenas números ou com pontos e traços, se um CNPJ vai ter caracteres especiais, e assim por diante.

### 22.2. Os cinco componentes de um Rule Set

| Componente | Função |
|---|---|
| **Dictionary** | Define o **layout de saída**: os campos que o rule set produz, com nome, formato e tamanho |
| **Classifications** | **Tabela de-para** que associa cada palavra de entrada a uma **forma padronizada** e a uma **classe** |
| **Pattern-Action** | **Linguagem de padrões e ações** que decide o que fazer com cada combinação de tokens |
| **Overrides** | Ajustes/exceções aplicados sobre o rule set sem alterar o arquivo base |
| **Reference Tables** | Tabelas auxiliares de conversão consultadas pelas ações |

### 22.3. Dictionary — exemplo (domínio de endereço)

| Nome | Formato | Tamanho | Descrição |
|---|---|---|---|
| `StreetType` | C | 10 | StreetType |
| `StreetNamePrefix` | C | 10 | StreetNamePrefix |
| `StreetName` | C | 40 | StreetName |
| `HouseNumber` | C | 10 | HouseNumber |
| `UnitType` | C | 15 | UnitType |
| `UnitValue` | C | 10 | UnitValue |
| `BuildingType` | C | 15 | BuildingType |
| `BuildingValue` | C | 20 | BuildingValue |
| `FloorValue` | C | 10 | FloorValue |
| `POBoxValue` | C | 10 | PostBoxValue |
| `AdditionalAddress` | C | 50 | AdditionalAddress |

### 22.4. Classifications — exemplo

Formato: `Entrada | Saída padronizada | Classe`

```
AV          AV      T
AVE         AV      T
AVENIDA     AV      T
RUA         RUA     T
TRV         TRAV    T
TRAV        TRAV    T
TRAVESSA    TRAV    T
DR          DR      P
DOUTOR      DR      P
PROF        PROF    P
PROFESSOR   PROF    P
```

Leitura: qualquer das formas de entrada é convertida para a **saída padronizada** e recebe a **classe** que a identifica no pattern (`T` = tipo de logradouro, `P` = prefixo/título).

### 22.5. Pattern-Action

> "Você usa a linguagem Pattern Action para manipular dados. Você pode decifrar e identificar padrões nos dados e, em seguida, executar ações nos dados com base no padrão. Um arquivo Pattern Action contém uma série de conjuntos de ações padrão. Cada conjunto contém uma **condição padrão** seguida por **instruções de ação**. As ações são executadas em relação aos dados de entrada que foram **separados em tokens e classificados**. As ações são baseadas em um determinado padrão de tokens."

**Os quatro elementos estruturais:**

| Elemento | Função |
|---|---|
| **`STRIPLIST`** | **Retira os caracteres da entrada presentes na lista** |
| **`SEPLIST`** | Define os caracteres que **separam** tokens |
| **`PATTERN`** | A **condição** — a combinação de classes de tokens a ser reconhecida |
| **`ACTION`** | As **instruções** executadas quando o pattern casa |

**Exemplo de STRIPLIST:**

```
STRIPLIST: ".,"

"AV. ALVORADA, 134"   →   "AV ALVORADA 134"
"R. JOSE MARIA, 209"  →   "R JOSE MARIA 209"
```

**Exemplo de pattern + actions:**

```
Pattern:  T | ? | ^              Pattern:  T | P | ? | ^
  COPY_A [1] {StreetType}          COPY_A [1] {StreetType}
  COPY_S [2] {StreetName}          COPY_A [2] {StreetNamePrefix}
  COPY   [3] {HouseNumber}         COPY_S [3] {StreetName}
                                   COPY   [4] {HouseNumber}
```

Leitura: o primeiro pattern reconhece "tipo de logradouro + palavra desconhecida + número" (ex.: `AV ALVORADA 134`); o segundo reconhece "tipo + prefixo/título + palavra + número" (ex.: `AV PROF ALVORADA 134`). `[n]` refere-se à **posição do token** no pattern, e `{Campo}` é o **campo do Dictionary** que recebe o valor.

### 22.6. Classes para descrição de patterns

| Classe | Significado |
|---|---|
| **`A` – `Z`** | **Definidas pelo usuário** (classes vindas do arquivo de Classifications) |
| **`^`** | **Numérico** |
| **`?`** | **Palavras desconhecidas** (não classificadas) |
| **`+`** | **Uma única palavra** |
| **`&`** | **Um token de qualquer tipo** |
| **`>`** | **Token iniciado por número** |
| **`<`** | **Token iniciado por letra** |
| **`@`** | **Token complexo** (mistura letras e números) |
| **`~`** | **Especial** |
| **`-`** | **Hífen** |
| **`/`** | **Barra** |
| **`\&`** | **"E comercial"** (&) |
| **`\#`** | **Sustenido** (#) |
| **`\(`** | **Parêntese esquerdo** |
| **`\)`** | **Parêntese direito** |
| **`**`** | **Universal** (casa com qualquer sequência) |

### 22.7. Comandos utilizados nas Actions

| Comando | Efeito |
|---|---|
| **`COPY`** | Copia |
| **`COPY_A`** | Copia **abreviação** (a forma padronizada do Classifications) |
| **`COPY_S`** | Copia **com espaços** |
| **`COPY_C`** | Copia **closest** (correspondência mais próxima) |
| **`COPY_I`** | Copia **iniciais** |
| **`MOVE`** | Move dados |
| **`CONCAT`** | Concatena dados |
| **`CONCAT_A`** | Concatena abreviação |
| **`CONCAT_I`** | Concatena inicial |
| **`PREFIX`** | Adiciona no início |
| **`PREFIX_A`** | Adiciona abreviação no início |
| **`PREFIX_I`** | Adiciona iniciais no início |
| **`CONVERT`** | Converte valores |
| **`CONVERT_P`** | Converte prefixo |
| **`CONVERT_S`** | Converte sufixo |
| **`RETYPE`** | **Troca o tipo do operando** (reclassifica um token) |
| **`PATTERN`** | **Exibe o pattern da entrada** (uso de depuração) |

### 22.8. Reference Tables — exemplo

Tabela de-para consultada pelas ações (`CONVERT`):

```
Mês abreviado → Mês número
JAN  01     JUL  07
FEV  02     AGO  08
MAR  03     SET  09
ABR  04     OUT  10
MAI  05     NOV  11
JUN  06     DEZ  12
```

### 22.9. Utilização do estágio Standardize

Três momentos: **Testando → Criação de jobs → Execução de jobs**.

**Testando:** o Standardize oferece uma janela de teste em que se informa um **registro As-Is (entrada)** e se obtém o **registro padronizado (saída)** — permite validar regras sem compilar job.

**Criação de jobs:**

1. Criar um novo processo no estágio;
2. **Selecionar a coluna e o Rule Set correspondente**;
3. Clicar em **`>`** para associar a coluna à regra;
4. **Repetir para cada coluna com sua respectiva regra**;
5. Em `Stage Properties > Output > Mapping`, **arrastar primeiro todas as colunas de entrada** e depois **alterar o mapeamento das colunas tratadas para as colunas geradas pelo Standardize**.

> **Regra importante:** **cada regra trata apenas um campo por vez e o estágio só permite que uma regra seja utilizada uma única vez.** Se dois campos precisam do **mesmo rule set** (por exemplo, duas colunas de data), é necessário **um segundo estágio Standardize**.

### 22.10. Standardize Rules Designer

Ferramenta web para criar e manter rule sets sem editar arquivos manualmente.

**Home / Work Area:**

- **Exibe o status atual dos conjuntos de regras**;
- **Revisão de publicações**;
- **Reset**;
- **Deleted**.

Funcionalidades:

- **Os dados podem ser importados e descartados** para teste;
- **Classification**: **adicionar uma definição de tabela de pesquisa** que as regras podem referenciar como parte de ações ou condições; **adicionar definições importando de uma fonte**;
- **Rules**: **adicionar uma definição de tabela** que as regras podem referenciar como parte de ações ou condições; **adicionar definições de importação de uma fonte**.

### 22.11. Padrão de uso com Transformer (pós-processamento)

Fluxo típico do exercício de referência:

```
Sequential File (CLIENTES_ORIGEM.CSV)
   → Standardize (nome, endereço, bairro, cidade, estado, telefone, e-mail, data_nascimento)
   → Standardize (data_ult_alt)           ← segundo estágio: regra já usada
   → Transformer (recompõe o endereço)
   → Match Frequency → DataSet (frequências)
   → DataSet (clientes padronizados)
```

No Transformer, três **Stage Variables** recebem as colunas geradas pelo Standardize (`StreetType`, `StreetNamePrefix`, `StreetName`), encapsuladas de uma vez com **Derivation Substitution**, e o endereço final é recomposto:

```
Trim(vStreetType : ' ' : vStreetNamePrefix : ' ' : vStreetName)
```

E, para uniformizar caixa em todos os campos texto, **Derivation Substitution** com `UpCase($1)`.

> Observação do treinamento: campos como **COMPLEMENTO** e **PROFISSÃO** continuam despadronizados porque **não existe rule set para eles** — em um cenário real, seriam desenvolvidas regras de qualidade específicas.

### Fatos testáveis — Capítulo 22

- Os **cinco componentes** de um rule set são: **Dictionary, Classifications, Pattern-Action, Overrides e Reference Tables**.
- O **Dictionary** define o layout de saída (nome, formato, tamanho, descrição dos campos).
- O arquivo de **Classifications** tem o formato **Entrada | Saída padronizada | Classe**.
- A linguagem **Pattern-Action** contém **uma condição de padrão seguida de instruções de ação**, executadas sobre dados já **separados em tokens e classificados**.
- Os elementos do Pattern-Action são: **`STRIPLIST`, `SEPLIST`, `PATTERN` e `ACTION`**.
- **`STRIPLIST`** **retira da entrada os caracteres presentes na lista**.
- Classes de pattern: **`^` numérico, `?` palavra desconhecida, `+` uma única palavra, `&` token de qualquer tipo, `>` token iniciado por número, `<` token iniciado por letra, `@` token complexo, `~` especial, `**` universal, `A–Z` definidas pelo usuário**.
- Comandos de ação incluem **`COPY`, `COPY_A` (abreviação), `COPY_S` (com espaços), `COPY_C` (closest), `COPY_I` (iniciais), `MOVE`, `CONCAT`, `PREFIX`, `CONVERT`, `RETYPE` e `PATTERN`**.
- **`RETYPE`** troca o tipo do operando.
- **Cada regra trata apenas um campo por vez** e **o estágio só permite que uma regra seja usada uma única vez** — campos que compartilham o mesmo rule set exigem **um segundo estágio Standardize**.
- O estágio Standardize permite **testar** regras informando um registro As-Is e vendo o registro padronizado.
- O **Standardize Rules Designer** exibe status dos rule sets, permite **revisão de publicações, Reset e Deleted**.

---

## 23. Match: Match Frequency, One-source e Two-source

### 23.1. Estágio Match Frequency

**Características:**

- **Gera a distribuição da frequência dos valores das colunas** dos arquivos de entrada do Match;
- **Gera frequência de todas as colunas ou somente das colunas utilizadas pelo Match** (neste caso, informando a **Match Specification**).

Por que existe: os algoritmos probabilísticos do Match precisam saber **quão raro é cada valor**. Um sobrenome raro que coincide vale muito mais peso do que um sobrenome comum que coincide.

### 23.2. Conceitos do Match

> *Matching = co-relacionamento de dados semelhantes. O motor leva em consideração todas as informações de métricas e critérios de validação e qualificação da informação para comparar os registros entre si a fim de identificar os registros duplicados.*

Conceitos fundamentais:

- **Tipos de Match**
- **Blocos (comparação exata)**
- **Comparação aproximada**
- **Notas de corte**
- **Passos (Passes)**
- **Match Designer**

### 23.3. Tipos de Match

| Categoria | Tipo | Uso |
|---|---|---|
| **One-Source Match** (*Unduplicate Matching*) | **Dependent** | Deduplicação dentro de uma única origem; registros já pareados **são retirados** dos passos seguintes |
| | **Independent** | Cada passo avalia **todos** os registros, independentemente dos passos anteriores |
| **Two-Source Match** (*Reference Matching*) | **Many-to-one** | Vários registros da origem podem casar com **um** da referência |
| | **Many-to-one Multiple** | Como o anterior, mas **todos os pares acima do corte** são retornados |
| | **Many-to-one Duplicates** | Como o Many-to-one, retornando também as **duplicatas** |
| | **One-to-one** | Cada registro da origem casa com **no máximo um** da referência |

### 23.4. Blocagem (Blocking) — comparação exata

A **blocagem** define a **comparação exata** que restringe o universo de comparações: apenas registros **dentro do mesmo bloco** são comparados entre si.

Exemplo:

```
BLOCO: CPF + Iniciais do NOME

CPF               NOME                          DATA NASC
00042357234570    Maria Apparecida Rodrigues    19381230
00018758863290    Antonio José Fernandes        19450815
00042357234570    Maria Aparecida Rodrigues     19381230
00018758863290    Antonio J Fernandes           19540815
```

Sem blocagem, um arquivo de N registros exigiria N² comparações. Com blocagem, compara-se apenas dentro de cada bloco — é o que torna o matching viável em grandes volumes.

> Trade-off: blocos **muito restritivos** perdem pares verdadeiros (registros que deveriam casar mas caíram em blocos diferentes); blocos **muito amplos** explodem o custo computacional. Por isso normalmente se usam **vários passos (passes)** com blocos diferentes.

### 23.5. Comparação aproximada

Comandos de comparação aplicados **dentro** do bloco:

```
Uncert:   NOME       – u: 0.9   m: 0.1   parm1: 800
Cnt_Diff: DATA_NASC  – parm1: 1
```

| Comando | Significado |
|---|---|
| **`UNCERT`** | Comparação **incerta/difusa** de strings; `parm1` é o limiar de similaridade (ex.: 800 em escala de 0 a 900) |
| **`CNT_DIFF`** | Conta **quantos caracteres diferem**; `parm1` é o número máximo de diferenças toleradas |
| `CHAR` | Comparação **exata** de caractere |
| `PREFIX` | Compara apenas o prefixo |
| `NAME_UNCERT` | Comparação difusa específica para nomes |
| `DATE8` | Comparação de datas |
| `NUMERIC` | Comparação numérica |

**Probabilidades `m` e `u`:**

| Parâmetro | Significado |
|---|---|
| **`m`** | Probabilidade de os campos **concordarem dado que os registros são um par verdadeiro** |
| **`u`** | Probabilidade de os campos **concordarem por acaso** |

O peso composto de um par é a soma dos pesos de cada campo comparado, calculados a partir de `m`, `u` e da **frequência do valor** (vinda do Match Frequency).

### 23.6. Notas de corte (Cutoffs)

Duas notas de corte dividem os pares em três faixas:

```
peso ≥ Match cutoff        →  MATCH      (correspondência automática)
Clerical ≤ peso < Match    →  CLERICAL   (duvidoso — revisão manual/administrativa)
peso < Clerical cutoff     →  RESIDUAL   (não é correspondência)
```

Exemplo do treinamento:

```
NOTAS DE CORTE:
  Clerical: 6.00
  Match:    9.00
```

### 23.7. Passos (Passes)

Um **passo** de matching é a combinação de:

```
BLOCO:    CPF + Iniciais NOME
COMANDOS: Uncert: NOME – u:0.9 m:0.1 parm1:800
          Cnt_Diff: DATA_NASC – parm1:1
CORTES:   Clerical: 6.00 | Match: 9.00
```

Vários passos são executados em sequência, cada um com bloco e comandos diferentes, para capturar duplicidades que um único critério não pegaria.

### 23.8. Match Designer

Ferramenta gráfica de criação e teste das **Match Specifications**. Fluxo de trabalho:

1. **Tipo de Match** (One-source Dependent/Independent, Two-source Many-to-one etc.);
2. **Arquivo de entrada** (e o arquivo de frequência gerado pelo Match Frequency);
3. **Layout do arquivo** (colunas disponíveis);
4. **Criação de blocos**;
5. **Criação do match** (comandos de comparação por campo, com `m`, `u` e `parm`);
6. **Testes**.

A tela de testes contém:

- **Editor de passagens (passes)**;
- **Visualizador de dados**;
- **Gráfico histograma com o resultado do teste** (distribuição de pesos);
- **Regras de decisões**;
- **Ajuste de limites** (arrastar as notas de corte sobre o histograma).

> **IMPORTANTE (destaque do treinamento):** ao finalizar a regra e salvar, **selecione a especificação e, com o botão direito, dê um `Provision All`** — **este procedimento equivale a uma compilação**. Sem o Provision All, o job usará a versão anterior da especificação.

### 23.9. Saídas do estágio Match

Um **One-source Match** típico produz quatro saídas:

| Saída | Conteúdo |
|---|---|
| **Match / MatchDuplicate** | Registros identificados como duplicados (peso ≥ match cutoff) |
| **Clerical** | Registros **duvidosos**, entre os dois cortes, para revisão manual |
| **Duplicate** | Duplicatas identificadas dentro dos grupos |
| **Residual / NonMatch** | Registros **sem correspondência** |

No exercício de referência, os quatro DataSets de saída são `ArquivoMatchDuplicate.ds`, `ArquivoClerical.ds` e `ArquivoNonMatch.ds` — e é normal que **Clerical e Residual venham vazios** quando os dados já estão bem padronizados e as regras são adequadas.

Configurar também **`Stage Properties > Output > Mapping`** e conferir a ordem de links em **`Stage > Link Ordering`**, tanto de entrada quanto de saída.

### 23.10. Arquitetura de unificação (MDM)

```
BUP → Motor de Resolução de Identidade → Passos do Matching
                                          ├─ Regras de Matching
                                          ├─ Especificações Match (algoritmos probabilísticos)
                                          ├─ Notas de Corte
                                          └─ Blocagem (comparação exata)
                                      → Sobrevivência → BIP
Saídas: LnkMatch | LnkClerical | LnkNoMatching | BQA
```

### Fatos testáveis — Capítulo 23

- O **Match Frequency** gera a **distribuição de frequência dos valores das colunas** dos arquivos de entrada do Match.
- O Match Frequency pode gerar a frequência de **todas as colunas** ou **somente das colunas usadas pelo Match** (informando a Match Specification).
- Tipos de **One-Source Match**: **Dependent** e **Independent** (também chamado *Unduplicate Matching*).
- Tipos de **Two-Source Match**: **Many-to-one**, **Many-to-one Multiple**, **Many-to-one Duplicates** e **One-to-one** (também chamado *Reference Matching*).
- A **blocagem (blocking)** é a **comparação exata** que restringe quais registros são comparados entre si.
- A **comparação aproximada** usa comandos como **`UNCERT`** e **`CNT_DIFF`**, com parâmetros **`m`**, **`u`** e **`parm1`**.
- As **notas de corte** dividem os resultados em **Match**, **Clerical** e **Residual**.
- Exemplo de cortes do treinamento: **Clerical = 6.00** e **Match = 9.00**.
- O **Clerical** é a faixa de registros **duvidosos**, que exige revisão administrativa/manual.
- Um **passo (pass)** combina **bloco + comandos de comparação + notas de corte**.
- No **Match Designer**, a tela de testes traz **editor de passagens, visualizador de dados, histograma dos pesos, regras de decisões e ajuste de limites**.
- Ao salvar uma Match Specification é necessário executar **`Provision All`** (botão direito), que **equivale a uma compilação**.
- O matching usa algoritmos **probabilísticos/estatísticos** e calcula uma **pontuação (peso)** com base na probabilidade de correspondência.

---

## 24. Estágio Survive

### 24.1. Características

- **Escolhe o melhor registro**;
- **Seleção de campos do melhor registro**;
- **Composição do melhor registro a partir de campos de grupo de registros relacionados**.

> *Sobrevivência é a composição de informações de quaisquer uma das instâncias da entidade, podendo conter dados de diversos registros cuja informação tenha sido definida mediante a regra de matching.*
>
> *O **Golden Record** pode ser composto por dados de diversos registros cuja informação tenha sido definida mediante a regra de sobrevivência.*

### 24.2. Critérios de sobrevivência

| Critério | Significado |
|---|---|
| **Menor / Maior** | Pela **quantidade de caracteres** do valor |
| **Mais frequente** | O valor que mais se repete no grupo |
| **Mais frequente não-nulo** | Idem, ignorando nulos/vazios |
| **Igual a / Diferente de** | Comparação com um valor de referência |
| **Maior que / Menor que** | Comparação numérica/data |
| **Pelo menos um** | Sobrevive se ao menos um registro atender |
| **Composição de vários critérios** | Regras combinadas |

### 24.3. Regras abrangentes × restritivas

Na criação do job é possível escolher regras **abrangentes** (aplicadas a um conjunto de campos) ou **restritivas** (campo a campo).

No exercício de referência, cria-se uma **especificação customizada** com a regra:

```
"Current Record" > "Best Record"
```

Ou seja: **compara o registro atual, individualmente, com o último que havia sido eleito como o "Best Record"**.

### 24.4. Exemplo de melhor registro

```
Prof  Antonio J     Fernandes  19450815  20030514
Dr    Antonio José  Fernandes            20021220
Prof  Antonio José  Fernandes  19450815  20080630   ← sobrevivente
Prof  Antonio José  Fernandes  19540815  20080425
```

O registro sobrevivente combina o título mais frequente (`Prof`), o nome completo mais longo (`Antonio José`), a data de nascimento mais frequente (`19450815`) e a data de última alteração mais recente (`20080630`).

### 24.5. Job típico de sobrevivência

```
DataSet MatchDuplicate ┐
DataSet Clerical       ├→ Funnel → Survive → Copy ─┬→ DataSet (cliente único)
DataSet NonMatch       ┘                           └→ Aggregator (Count por CPF/SEXO)
                                                        → Transformer (constraint QTD > 1)
                                                        → Peek
```

- O **Funnel** reúne as três saídas do Match (mapeando todos os campos);
- O **Survive** aplica as regras campo a campo (CPF, Cliente, Endereço, Data de Nascimento, E-mail, demais campos);
- O **Aggregator** conta registros por CPF e por SEXO;
- O **Transformer** filtra com a constraint **`LnkFiltra.QTD > 1`**;
- **Finalidade da validação:** identificar registros duplicados remanescentes — o que indica que **um maior refinamento das regras de matching e sobrevivência deve ser realizado até garantir a unicidade dos registros de clientes**.

### Fatos testáveis — Capítulo 24

- O **Survive** escolhe o melhor registro, seleciona campos do melhor registro e **compõe** o melhor registro a partir de campos de um grupo de registros relacionados.
- O registro resultante é chamado **Golden Record**.
- Critérios do Survive incluem: **menor/maior (quantidade de caracteres), mais frequente, mais frequente não-nulo, igual a/diferente de, maior que/menor que, pelo menos um e composição de vários critérios**.
- **Menor/Maior** no Survive refere-se à **quantidade de caracteres**, não ao valor numérico.
- A regra customizada do exercício compara **"Current Record" > "Best Record"**.
- As saídas do Match (**MatchDuplicate, Clerical e NonMatch**) são normalmente reunidas por um **Funnel** antes do Survive.
- Encontrar registros com **QTD > 1** após o Survive indica que as **regras de matching e sobrevivência precisam de refinamento**.

---

# Parte VI — Prática, boas práticas e referência

## 25. Boas práticas de desenvolvimento

### 25.1. Nomenclatura e organização

| Prática | Detalhe |
|---|---|
| **Evitar acentuação** na nomenclatura de objetos | Acentos e caracteres especiais causam problemas de portabilidade entre ambientes e sistemas operacionais |
| **Prefixar links por função** | `Lnk` + verbo + objeto: `LnkLeArq`, `LnkGravaSeq1`, `LnkLeRef`, `LnkFiltra` |
| **Renomear estágios** com o papel que exercem | `SeqArquivoExemplo`, `TrfFormataEndereco`, `Ordena_original`, `Ordena_final` — nunca deixar `DSLink13`, `Copy_1` |
| **Nomear jobs por atividade e variante** | `complementar_02`, `complementar_02_a1`…`_a4` (tipos de Join), `_b1`…`_b4` (falhas de Lookup), `_c` (Filter), `_d` (Funnel), `_e` (Remove Duplicates), `_f` (Sort), `_seq` (Sequence) |
| **Organizar o repositório em pastas** | `Jobs/USUARIOS/<usuario>`, `Table Definitions/Sequential/Seq`, `Parametros` |
| **Documentar com Annotation** | Todo job de produção deve ter uma anotação explicando o propósito |

### 25.2. Desenho do job

- **Trabalhe da esquerda para a direita** ao criar o fluxo;
- **Link de referência perpendicular (90°)** ao fluxo principal em Join, Merge e Lookup;
- **Monte o job em etapas pequenas e teste com poucos registros** (uma amostra) antes de rodar com a base completa;
- **Implemente cada etapa primeiro em jobs separados** e só depois una tudo em um job único;
- **Planeje o fluxo no papel antes de montar no Designer** — ajuda a organizar quantos links de entrada e saída cada estágio vai precisar;
- Prefira **um job por responsabilidade** a um job monolítico difícil de depurar e reiniciar.

### 25.3. Parametrização e promoção de ambiente

- **Nunca codifique caminhos manualmente** — use parâmetros;
- **Use `$PROJDEF`** para que o mesmo job funcione em DEV, HOM e PRD;
- **Use Parameter Sets** e **value files** em vez de repetir parâmetros job a job;
- **O administrador deve criar a mesma variável de ambiente, com o mesmo nome, nos três ambientes**, cada um com o caminho adequado;
- **Reutilize os Parameter Sets existentes no projeto** em vez de inventar novos — e **verifique os nomes reais dos objetos** antes de referenciá-los;
- Ao usar parâmetros em propriedades, prefira a função **`Insert Job Parameter`** para evitar erro de digitação.

### 25.4. Particionamento e ordenação

- **Escolha o método que equilibre as partições** (etapa 1 do método de 3 etapas);
- **O método deve se encaixar à lógica do estágio** (etapa 2);
- **Evite reparticionamento** desnecessário (etapa 3);
- **Use `Same`** para preservar particionamento/ordenação já estabelecidos;
- **Use o estágio Data Set** para ligar dois jobs preservando o particionamento;
- **Ordene explicitamente com o estágio Sort** quando a clareza do job importar; ordene implicitamente (aba `Partitioning`) quando o custo visual não compensar;
- **Use `Don't Sort (Previously Sorted)`** para chaves já ordenadas, adicionando apenas as chaves secundárias.

### 25.5. Desempenho

| Prática | Motivo |
|---|---|
| Preferir **Data Set** a Sequential File para intermediários | Formato interno, sem import/export, preserva particionamento |
| Preferir **Lookup** quando a referência cabe em memória | Evita o sort obrigatório do Join |
| Preferir **Join** para referências grandes | Lookup estouraria a memória |
| Usar **Aggregator método `Sort`** com muitos grupos | Mantém apenas um grupo em memória |
| Usar **Modify** em vez de Transformer para operações só de metadados | Não gera código C++ |
| Reduzir colunas cedo (Copy/Modify com `DROP`) | Menos dados trafegando no pipeline |
| Aumentar `Restrict Memory Usage` do Sort quando houver RAM | Reduz uso de disco no sort |
| Usar `APT_DUMP_SCORE` e `APT_PM_PLAYER_TIMING` para diagnosticar | Mostram onde o tempo é gasto e onde há reparticionamento oculto |

### 25.6. Robustez e auditoria

- **Utilize links de rejeitados** em Sequential File, Transformer, Lookup e Connectors — e grave-os para análise posterior;
- **Tente manter os tipos de dados importados**; converta apenas quando necessário;
- **Preste atenção nos tipos de dados das colunas e das variáveis de estágio**;
- **Inclua `ERRORCODE` e `ERRORTEXT`** nos links de rejeição de Connectors;
- **Configure o limite de warnings** para que o job aborte quando algo sistematicamente errado acontecer;
- **Precompute as contagens esperadas de linhas** antes de rodar (ver Capítulo 26).

### 25.7. Job Sequence

- Use **`Reset if required, then run`** nos Job Activities;
- Defina **triggers `OK`** entre jobs com dependência real de dados;
- Use **`Sequencer` com `All`** para sincronizar fluxos paralelos, em vez de encadear jobs artificialmente;
- **Habilite checkpoints** para que uma falha no meio da carga não exija reprocessar tudo;
- Inclua um **Exception Handler** e uma **Notification Activity** para alertar a operação.

### 25.8. QualityStage

- **Investigue antes de padronizar**: os resultados do Investigate definem quais rule sets e overrides são necessários;
- **Revise o Token Report com um especialista no assunto (SME)** — tokens não classificados frequentes devem entrar no rule set;
- **Gere as frequências (Match Frequency) a partir dos dados já padronizados**, não dos dados brutos;
- **Teste a Match Specification no Match Designer** com o histograma antes de rodar em volume;
- **Não esqueça o `Provision All`** após salvar a especificação;
- **Itere**: registros duplicados remanescentes após o Survive indicam que blocos, comandos de comparação ou notas de corte precisam de ajuste.

### Fatos testáveis — Capítulo 25

- É boa prática **evitar acentuação** na nomenclatura de objetos.
- É boa prática **montar o job em etapas pequenas e testar com poucos registros** antes da base completa.
- É boa prática desenhar o **link de referência perpendicular** ao fluxo principal.
- Para promover jobs entre ambientes sem alteração manual, usa-se **`$PROJDEF`** com a mesma variável definida nos três ambientes.
- Para manter o particionamento entre jobs, usa-se o estágio **Data Set**.
- A recomendação de particionamento tem **três etapas**: equilíbrio das partições, aderência à lógica do estágio e simplicidade (evitando reparticionamento).
- Recomenda-se **`Reset if required, then run`** nos Job Activities de um Sequence.
- O **Provision All** é obrigatório após salvar uma Match Specification.

---

## 26. Armadilhas, erros silenciosos e troubleshooting

### 26.1. O problema central: o DataStage não aborta em erro de lógica

**O DataStage compila e executa com sucesso jobs logicamente incorretos.** Um Join sem ordenação prévia, uma deduplicação pela chave errada ou um Lookup com chave mal declarada **não geram erro** — geram **resultados errados silenciosamente**.

**Contramedida obrigatória:** **precompute as contagens de linha esperadas para cada saída** antes de executar o job, e compare com o resultado real. Divergência = erro de lógica.

### 26.2. Catálogo de armadilhas

| Armadilha | Sintoma | Causa | Correção |
|---|---|---|---|
| **Join sem entrada ordenada** | Linhas faltando ou duplicadas, sem erro no log | O Join exige entrada **ordenada** pela chave; sem isso, pares adjacentes não se encontram | Estágio Sort antes do Join, com particionamento **Hash** pela mesma chave |
| **Chave não única no Join** | Saída com **mais linhas que qualquer uma das entradas** | O Join realiza **produto cartesiano** em chaves duplicadas (many-to-many) | Deduplicar antes, ou aceitar conscientemente a multiplicação e validar a contagem esperada |
| **Chave de Lookup na caixa errada** | Lookup falha ou não casa nada | As chaves devem ser declaradas via o **checkbox `Key Expression`** nos painéis, **não** digitadas em `Lookup Stage Conditions` | Declarar a chave no painel correto |
| **`Lookup Failure` no default** | `Failed a key lookup for record N Key Values: ...` e job abortado | O default é **`fail`** | Escolher `drop`, `continue` ou `reject` conforme a regra de negócio |
| **Aggregator sem Hash** | Mais grupos do que valores distintos de chave | Registros do mesmo grupo caíram em partições diferentes | Particionar com **Hash** pela chave de agrupamento |
| **Remove Duplicates sem Sort** | Duplicidades permanecem | Duplicados só são removidos se forem **adjacentes** | Sort pela chave antes, e particionamento `Same` no Remove Duplicates |
| **Sort paralelo confundido com ordenação global** | Arquivo de saída não está ordenado do começo ao fim | O Sort paralelo ordena **dentro de cada partição** | Coletar com **Sort Merge** no estágio final, ou particionar com **Range** |
| **`@INROWNUM` reiniciando por partição** | Sequência de valores repetida N vezes (N = nº de partições) | O Transformer é nativamente paralelo | Particionamento **`Same`** ou `Execution Mode = Sequential` em `Stage > Advanced` |
| **`Table action = Create` na segunda execução** | Job aborta: tabela já existe | O estágio tenta criar a tabela toda vez | Parametrizar `Table action` (`#TableAction#`) ou usar `Replace` |
| **`Append` em tabela com PRIMARY KEY** | **Todas as linhas rejeitadas** por chave duplicada | O `CREATE TABLE` gerado incluiu `PRIMARY KEY` (caixa `Key` marcada) | Comportamento esperado; use os links de rejeição com `ERRORCODE`/`ERRORTEXT` para diagnosticar |
| **Job em `Aborted` não roda de novo** | "Job is not in a runnable state" | Estado inconsistente após falha | **Reset** pelo Director (status vira `Has been Reset`) ou recompilar no Designer |
| **Funnel com schemas diferentes** | Job falha por *schema mismatch*, ou colunas somem | O Funnel só entrega colunas com **mesmo nome, tipo e tamanho** em todas as origens | Alinhar metadados; remapear a saída após adicionar origens |
| **Metadados de Decimal não propagam** | Truncamento ou erro de conversão em estágios intermediários | Length/Scale de colunas Decimal **não se propagam automaticamente** entre estágios | Corrigir Length/Scale **individualmente em cada estágio** |
| **`Default To Decimal Output` como booleano** | Propriedade rejeitada ou saída errada | A propriedade espera **`"precisão,escala"`** (ex.: `12,2`), **não** `True` | Informar no formato correto |
| **Colisão de nomes entre Parameter Sets** | Erro de compilação por parâmetro ambíguo | Dois Parameter Sets contendo um parâmetro de **mesmo nome** (ex.: `$paramDirSeq`) usados **no mesmo job** | **Nunca combinar no mesmo job** Parameter Sets com nomes colidentes; escolher um só |
| **Parameter Set quebrado por `$PROJDEF`** | Parâmetro resolve para vazio | O parâmetro de projeto correspondente não existe (ou tem outro nome) naquele projeto | Conferir os parâmetros no Administrator antes de usar `$PROJDEF` |
| **Parameter Set não importado no Sequence** | Job filho falha por parâmetro ausente | O Sequence não repassa o que não possui | Importar o Parameter Set no Job Sequence e usar `Insert Parameter` no Job Activity |
| **Filtro AND que retorna zero linhas** | Saída vazia sem erro | Condições mutuamente inconsistentes nos dados (ex.: `Region='Telangana' AND City='Mumbai'` — Mumbai pertence a Maharashtra) | Validar a semântica dos dados antes; usar condições separadas + Funnel |
| **Valor vazio contado como categoria** | Contagem de distintos maior que o esperado | Strings vazias contam como um valor distinto no Remove Duplicates | Tratar vazios antes (`Modify`/`Transformer`) ou considerá-los na contagem esperada |
| **Excluir `.ds` pelo sistema operacional** | Arquivos de dados órfãos ocupando o `resource disk` | O `.ds` é apenas o descritor | Usar `Tools > Data Set Management` ou `orchadmin delete` |
| **Desbalanceamento de partição (data skew)** | Job paralelo lento, comportando-se como sequencial | Hash sobre chave de baixa cardinalidade ou muito enviesada | Verificar com `Show Instances` / `$APT_RECORD_COUNTS`; trocar a chave ou o método |
| **Acentuação mal lida em CSV** | Caracteres corrompidos | NLS map / encoding inadequado | Importar com `NLS map` apropriado (ex.: `ISO8859-10`) e marcar colunas como **Unicode** |
| **CRLF tratado como dado** | Última coluna com caractere estranho | Arquivo gerado no Windows lido como Unix | `Format > Record delimiter string = DOS format` |

### 26.3. Compile-time × runtime

| Erro de **compilação** | Erro de **runtime** |
|---|---|
| Coluna referenciada e inexistente | Arquivo inexistente no caminho parametrizado |
| Derivação inválida / sintaxe errada no Transformer | Falha de conexão ao banco de dados |
| Propriedade obrigatória vazia (`?` na propriedade `File`) | Violação de chave primária |
| Estágio sem metadados definidos | `Failed a key lookup` (Lookup com `fail`) |
| Parâmetro ambíguo (colisão de Parameter Sets) | Tabela já existente com `Table action = Create` |
| Mapeamento de saída não preenchido | Estouro de memória no Lookup/Aggregator Hash |
| Incompatibilidade de schema no Funnel | Disco cheio em `resource disk` / `scratchdisk` |

### 26.4. Roteiro de diagnóstico

1. **O job compila?** Se não → erro de desenho/metadados. Leia a mensagem exata do compilador.
2. **O job aborta?** Abra o **log** (`Ctrl+L` ou Director) e procure a **primeira mensagem `Fatal`** — as seguintes são consequência.
3. **O job termina mas com `Finished (see log)`?** Há warnings. Analise-os: warnings de conversão de tipo e de link Otherwise costumam esconder perda de dados.
4. **O job termina OK mas o resultado está errado?** Compare as **contagens de linha por link** com as contagens **esperadas** precomputadas.
5. **Distribuição entre partições:** ative `Show Instances` no Monitor e/ou `$APT_RECORD_COUNTS`.
6. **Plano de execução:** ative `APT_DUMP_SCORE` para ver onde o DataStage **inseriu sorts e partitioners automaticamente** — muitas surpresas de desempenho estão aí.
7. **Isolamento:** insira um **Peek** logo após o estágio suspeito e reexecute com poucos registros.

### Fatos testáveis — Capítulo 26

- O DataStage **não gera erro** em joins ou deduplicações logicamente incorretos — falha silenciosamente com resultados errados.
- Precomputar as **contagens de linha esperadas** é a contramedida recomendada.
- O **Join** exige entrada **ordenada**; o **Lookup**, não.
- O Join gera **produto cartesiano** quando a chave não é única, podendo produzir **mais linhas que qualquer das entradas**.
- As chaves de um Lookup são declaradas pelo **checkbox `Key Expression`** nos painéis, não digitadas em `Lookup Stage Conditions`.
- Metadados de **Decimal (Length/Scale)** **não se propagam automaticamente** entre estágios.
- **`Default To Decimal Output`** espera **`"precisão,escala"`**, não um booleano.
- Dois **Parameter Sets** com parâmetros de mesmo nome **não podem ser combinados no mesmo job**.
- Um job **`Aborted`** precisa de **Reset** ou recompilação.
- Nunca excluir um arquivo **`.ds`** pelo sistema operacional.
- `Record delimiter string = DOS format` resolve problemas de fim de linha **CRLF**.
- **`APT_DUMP_SCORE`** revela sorts e partitioners inseridos automaticamente pelo DataStage.

---

## 27. Catálogo de exercícios práticos

Esta seção cataloga os exercícios do caderno de treinamento e da lista complementar. Serve de referência para perguntas do tipo "qual estágio se usa para..." e "qual o resultado esperado de...".

### 27.1. Ambiente de referência do treinamento

| Item | Valor |
|---|---|
| Servidor do IIS | `iistreinamento.md2.local` (IP `192.168.0.244:9446`) |
| Projeto | `TREINAMENTO` |
| Pasta de jobs | `Jobs/USUARIOS/<usuario>` |
| Arquivo de configuração | `Treinamento.apt` (2 nodes), derivado de `Default.apt` (3 nodes) |
| Caminho de configurações | `/opt/IBM/InformationServer/Server/Configurations/Treinamento.apt` |
| Diretório de arquivos complementares | `/opt/IBM/InformationServer/Server/Projects/TREINAMENTO/Seq/arquivos_complementares` |
| Parâmetros de diretório | `paramDirDataSet`, `paramDirFileSet`, `paramDirHash`, `paramDirSeq` |
| Parameter Set | `Diretorios` (parâmetros com `$PROJDEF`) |
| Banco de exemplo | `LABMD2` (DB2), usuário `dsadm` |
| Cliente SQL usado | **DBeaver** |
| Arquivos de dados | `bollywood.csv`, `bollywood.xlsx`, `webpage_add - Part1.csv`, `webpage_add - Part2.csv`, `ArquivoExemplo.csv`, `CLIENTES_ORIGEM.csv` |

### 27.2. Labs do caderno de exercícios

| Item | Lab | Objetivo | Estágios / recursos |
|---|---|---|---|
| 2 | Parâmetros | Criar parâmetro de projeto, parâmetro local e Parameter Set | Administrator, Job Properties, Parameter Set, `$PROJDEF` |
| 3 | `Treinamento.apt` | Criar arquivo de configuração com 2 nodes | `Tools > Configurations` |
| 4 | Metadados | Importar table definition via ODBC (`CRM_DATA`) e exportar `.dsx` | Import/Export |
| 5 | `Lab5GeraLinhas` | Primeiro job paralelo: gerar 100 linhas e ver no log | **Row Generator + Peek** |
| 5.3 | `Lab5GeraLinhasNomes` | Propriedades estendidas (algoritmos de geração) | Row Generator `Extended Properties` |
| 5.4 | — | Documentar o job | **Annotation** |
| 5.5 | `Lab5GeraLinhasParam` | Parâmetro `NumRows` (Integer, default 10) | Job Parameters |
| 5.6 | `Lab5GeraLinhasParamSet` | Parameter Set `RowGenParam` com value files `LowGen` e `HighGen` (10000) | Parameter Set + Values |
| 6 | `Lab4Particionamentos` | Testar cada algoritmo de particionamento e ver o resultado no log | **Sequential File + Copy + Peek**; `Peek Number of Records (Per Partition) = 100` |
| 7.1 | `Lab5SeqFile` | Gerar um arquivo texto por algoritmo (`Seq_Hash.txt`, `Seq_Entire.txt`, `Seq_Modulus.txt`, `Seq_RoundRobin.txt`) | Copy múltiplos + Sequential File |
| 7.2 | `Lab5FilePattern` | Ler todos os `Seq*.txt` e unificar em `Seq_ArquivoUnificado.txt` | **Read Method = File Pattern** |
| 7.3 | `Lab5DataSet` | Converter o arquivo unificado em `ArquivoUnificado.ds` | **Data Set** + `Data Set Management` |
| 8.1 | `Lab6TrfFuncoesBasicas` | Dois links de saída, renomear `DESC`→`MES`, `UpCase`, criar campo `SEXO` fixo | **Transformer** |
| 8.2 | `Lab6TrfConstraints` | Separar pares e ímpares: `Mod(COD,2)=0` e `=1` | Transformer **Constraints** |
| 8.3 | `Lab6Aggregator` | `IF MOD(COD,2)=0 THEN 'M' ELSE 'F'`, contar por SEXO | **Aggregator** (`Group=SEXO`, `Count Rows`, `Count Output Column=CONTADOR`) |
| 8.4 | `Lab6GeraNulos` / `Lab6TrataNulos` | Gerar nulos com `SetNull()` e tratá-los de 3 formas | **Transformer** (`NullToValue`), **Sequential File** (`Format > Null field value`), **Modify** (`handle_null`) |
| 9.1 | `Lab7SortExplicito` | Ordenar por `COD` ascendente | **Sort** (`Key=COD`, `Sort Key Mode=Sort`, `Sort Order=Ascending`) |
| 9.2 | `Lab7SortImplicito` | Ordenar na aba `Partitioning` do Sequential File | Ordenação implícita |
| 9.3 | `Lab7SortExplicitoDedup` | Deduplicar com `Allow Duplicates = false` | Sort |
| 9.4 | `Lab7SortImplicitoDedup` | Deduplicar com a opção **`Unique`** na aba `Partitioning` | Ordenação implícita |
| 9.5 | `Lab7RemDup` | Deduplicar com `Key=COD`, `Duplicate to Retain=First`, particionamento `Same` | **Remove Duplicates** |
| 10 | `Lab10Aggregator1` | Padrão fork-join: Sort → Copy → (Aggregator `Count Rows` em `ContaCOD`) + Join Left Outer → Sort final → Remove Duplicates `Last` → Sequential com coleta `Sort Merge` | Sort, Copy, Aggregator (`Method=Sort`), Join, Remove Duplicates |
| 11 | `Lab8GeraReferencia` | Gerar tabela de referência UF/Estado com `@INROWNUM`; corrigir com `Execution Mode = Sequential` | Transformer, variável de sistema |
| 11.1 | `Lab8Join` | Inner, Left Outer e Full Outer com `Key=UF`; Hash no principal, Entire na referência | **Join** |
| 11.2 | `Lab8Lookup` | Testar `fail` (default), `drop` e `continue` | **Lookup** |
| 11.3 | `Lab8Funnel` / `Lab8SeqFunnel` | Unir `Seq_Hash.txt` e `Seq_Modulus.txt`; coleta `Sort Merge` por `COD` | **Funnel** (Continuous) |
| 12 | `Busca1` | Quick Find (`Busca*`), Advanced Find, relatório, impact analysis, `Compare Against` | Funções de repositório |
| 13.1 | `DRS_DB2_Connector` | Criar objeto Data Connection | Data Connection |
| 13.2 | `Lab12LeArquivoGravaDB2` | Criar/carregar tabela DB2; erro na 2ª execução com `Create table` | **DRS Connector** |
| 13.3-13.4 | `Lab12LeODBCGravaDataset` | Importar table definition ODBC e ler `DB2INST1.ERP_CLI` | **ODBC Connector** |
| 13.5 | `Lab12LeArquivoGravaMultDB2` | Vários links de entrada, `#TableAction#`, links de rejeição com `ERRORCODE`/`ERRORTEXT` | **DB2 Connector** |
| 13.6-13.7 | `Lab12LeODBC_sqlBuild` / `_expr` | SQL SELECT com SQL Builder; `SUBSTRING` e WHERE com parâmetros `#Baixo#` / `#Alto#` | **SQL Builder** + Expression Editor |
| 14.1 | `Lab9Sequence1` | Três jobs sem interdependência (execução simultânea) | **Job Sequence** |
| 14.2 | `Lab9Sequence2` | Triggers `OK` + estágio **Sequencer** (`All`/`Any`) | Job Sequence |
| 14.3 | `Lab9Sequence3` | Sequencer + **Notification Activity** (SMTP) | Job Sequence |
| 15.1 | `Lab11InvestigateCharConcat` | Concatenar `CLIENTE+SEXO`, máscaras `T` e `C` | **Investigate** |
| 15.2 | `Lab11InvestigateCharDiscrete` | `TELEFONE`, `SEXO`, `CPF` individualmente | Investigate |
| 15.3 | `Lab11InvestigateWord` | Campo `EMAIL` com regra **`BREMAIL.SET`**, Pattern Report + Token Report | Investigate (Word) |
| 16 | `Lab12Standardize` | Padronizar 9 campos; 2º Standardize para `DATA_ULT_ALT`; Transformer com Stage Variables e `Derivation Substitution` | **Standardize + Match Frequency** |
| 17.1 | `Lab13Matching` | One-source Match (Unduplicate) com 4 saídas | **One-source Match** |
| 18.1 | `Lab14_1Survive` | Funnel das saídas do Match, Survive com regra `Current Record > Best Record`, validação `QTD > 1` | **Survive** |

### 27.3. Lista de atividades complementares (trainee)

**Recomendação geral:** antes de começar cada atividade, **monte o job em etapas pequenas e teste com poucos registros** (uma amostra dos dados).

#### Atividade 1 — Sequential File, Aggregator, Lookup e Filter
**Arquivo:** `Bollywood.csv` / `.xlsx` (colunas: Data de Lançamento, Hero, Total Collection, Verdict). 52 registros.

1. Encontrar a **maior quantidade de filmes lançados na mesma data** (dica: existem **três filmes** lançados numa mesma data) e listar nome do filme, ator e arrecadação;
2. Calcular a **arrecadação total por Hero** e identificar o maior; gravar em **dois arquivos**: um só com o maior (`Hero`, `Max_Total_Collection`) e outro com os demais;
3. Descobrir qual Hero teve o **maior número de filmes 'Flop'**;
4. Criar **quatro arquivos de saída**, um por `Verdict`: **Hit, Super Hit, Flop e Average**.

**Dicas:** converter `.xlsx` para `.csv` antes de importar (o DataStage trabalha melhor com CSV), validando a integridade; `Sort` por data + `Aggregator` com `Count`; `Aggregator` com `Sum`/`Count`/`Max`; `Filter` (ou constraint no Transformer) para separar o maior dos demais e para os quatro `Verdict`.

#### Atividade 2 — Join, Lookup, Filter, Funnel, Remove Duplicates e Sort
**Arquivos:** `webpage_add - Part1.csv` e `Part2.csv` (~175.000 linhas somadas).
**Colunas:** `Event` (Varchar), **`Distinct_ID` (coluna-chave)**, `City`, `OS`, `Region`.

Em todos os jobs, direcionar a saída por um estágio **Copy** e salvar **tanto em Datasets quanto em Filesets**.

1. **Join** com os quatro tipos (Inner, Left Outer, Right Outer, Full Outer); Part1 = principal, Part2 = junção; chave `Distinct_ID`;
2. **Lookup** com as quatro opções (`Continue`, `Drop`, `Fail`, `Reject`); Part1 = principal, Part2 = referência;
3. **Filter** com a condição `Region='Telangana' AND City='Mumbai' AND OS='Android'`, capturando os rejeitados em link separado;
4. **Funnel** reunindo as saídas do item 3 em um único arquivo;
5. **Remove Duplicates** para achar os valores únicos de `Region`, `OS` e `City`;
6. **Sort** para gerar, em um dataset, os valores únicos e, em outro, os duplicados;
7. **Job Sequence** combinando os jobs 1, 2, 3 e 4.

**Dicas:** o tipo de junção é uma **propriedade do estágio Join** (não são quatro estágios); Join e Lookup exigem entrada ordenada pela chave; as opções `Condition Not Met` ficam nas propriedades do **link de referência** do Lookup; `Datasets (.ds)` são o formato nativo, `Filesets (.fs)` guardam texto distribuído.

**Achados de pré-análise (valores esperados):**

| Achado | Consequência |
|---|---|
| `Distinct_ID` **não é única**, apesar de ser a chave de junção | O Inner Join produz **mais linhas que qualquer das entradas** (~102.822) por multiplicação many-to-many |
| `Region='Telangana' AND City='Mumbai' AND OS='Android'` retorna **zero linhas** | Mumbai pertence a **Maharashtra**, não a Telangana — o Funnel do item 4 se torna consequência natural de usar três condições separadas |
| A coluna `os` tem **~926 valores vazios** | O vazio conta como **um dos 8 valores distintos** no Remove Duplicates |

#### Atividade 3 — Verificação de ordem alfabética
Determinar se as letras de uma palavra estão em ordem alfabética.

| Entrada | Saída |
|---|---|
| almost | almost IN ORDER |
| banana | banana NOT IN ORDER |
| very | very NOT IN ORDER |
| begins | begins IN ORDER |
| order | order NOT IN ORDER |
| in | in IN ORDER |

**Abordagem:** **Transformer** com funções de string (`Field`, `Len`, `Convert`, comparação de caracteres); comparar cada letra com a seguinte; alternativamente uma **Server Routine em BASIC**.

#### Atividade 4 — Número palíndromo
**Entrada:** 77, 161, 168, 252, 259, 343, 434, 525, 595, 616, 686, 700, 707, 770, 777, 861
**Saída esperada:** 77, 161, 252, 343, 434, 525, 595, 616, 686, 707, 777

**Abordagem:** converter para string, inverter os caracteres (não há função `reverse` pronta em todas as versões — combinar `substring`/`Field` em loop ou rotina customizada) e comparar com o original; `Filter` ou constraint para manter apenas os palíndromos.

#### Atividade 5 — Extração de primeiro nome, nome do meio e sobrenome

| Entrada | Fname | Mname | Lname |
|---|---|---|---|
| Atul Kr Singh | Atul | Kr | Singh |
| Geeta Vishwas | Geeta | *(vazio)* | Vishwas |
| Anoop Despande | Anoop | *(vazio)* | Despande |
| Rohit S Pande | Rohit | S | Pande |
| Ankit Singh | Ankit | *(vazio)* | Singh |
| Garima Bhatia Arya | Garima | Bhatia | Arya |

**Abordagem:** **`DCount()`** para contar tokens, **`Field()`** para extrair a 1ª, 2ª e 3ª palavra, e `If/Then/Else` no Transformer para tratar nomes com 2 ou 3 palavras.

#### Atividade 6 — Terceiro maior salário por departamento

**Saída esperada:**

| Nome | Salário | Departamento |
|---|---|---|
| Partha | 52760 | ETL |
| Kawshik | 51023 | Reporting |
| Akhil | 75447 | SAP |

**Observação-chave:** o departamento **Oracle não aparece** porque tem **apenas dois registros** — não existe um "terceiro" salário para esse grupo.

**Abordagem:** `Sort` por Departamento (ascendente) e Salário (descendente); usar **`Create Key Change Column`** para identificar o início de cada grupo; numerar as linhas dentro do grupo em um Transformer com **Stage Variables**; `Filter` mantendo posição = 3.

#### Atividade 7 — Header e Trailer
Adicionar cabeçalho (`Employee Name`) e rodapé (`Employee Count : 11`) a uma lista de 11 nomes.

**Abordagem:** três fluxos unidos por **Funnel** — (1) registro fixo do cabeçalho, (2) os dados originais, (3) registro calculado com a contagem (`Aggregator` com `Count`). Como o **Funnel não garante ordenação por padrão**, usar a opção **`Sequence`** ou adicionar uma coluna auxiliar de ordenação (0=header, 1=dados, 2=trailer) e ordenar por ela. **Todos os três fluxos precisam ter o mesmo layout** (mesmo nome e tipo de coluna) antes do Funnel, sob pena de *schema mismatch*.

#### Atividade 8 — Contagem de linhas e células preenchidas

| Count Rows | Count_col1 | Count_col2 | Count_col3 |
|---|---|---|---|
| 9 | 8 | 6 | 5 |

**Abordagem:** no Transformer, usar **`IsNull()`** para criar uma flag 0/1 por coluna; no **Aggregator**, somar as flags (`Sum`) e contar o total de linhas (`Count`), tudo em uma única linha de saída. Atenção a como os nulos estão representados no arquivo (aqui como o texto `{NULL}`, mas podem vir como campo vazio ou nulo real).

### Fatos testáveis — Capítulo 27

- Para separar registros por categoria em arquivos distintos usa-se o estágio **Filter** (ou constraints no Transformer).
- Para contar quantos filmes existem em cada data usa-se **Sort + Aggregator com `Count`**.
- **Datasets (`.ds`)** são o formato nativo do DataStage, otimizados para leitura/escrita entre jobs; **Filesets (`.fs`)** armazenam os dados em **arquivos de texto distribuídos**.
- O tipo de junção é uma **propriedade do estágio Join** — não são quatro estágios diferentes.
- As opções `Condition Not Met` (Continue, Drop, Fail, Reject) ficam nas propriedades do **link de referência** do Lookup.
- Para numerar linhas dentro de um grupo usa-se **`Create Key Change Column`** do Sort mais Stage Variables no Transformer.
- Quando um grupo tem menos registros que a posição buscada (ex.: 3º salário em um grupo de 2), esse grupo **não aparece na saída**.
- O **Funnel não garante ordenação por padrão**; para ordem determinística usa-se o tipo **`Sequence`** ou uma coluna auxiliar de ordenação.
- Antes do Funnel, **todos os fluxos precisam ter o mesmo layout** de colunas.
- **`DCount()`** conta tokens e **`Field()`** extrai o n-ésimo token de uma string.
- **`IsNull()`** + **Aggregator `Sum`** é o padrão para contar células preenchidas por coluna.

---

## 28. Glossário PT/EN

| Termo (EN) | Termo (PT) | Definição |
|---|---|---|
| **Aggregator** | Agregador | Estágio que executa cálculos sobre grupos de linhas, equivalente a um `GROUP BY` do SQL |
| **Annotation** | Anotação | Estágio puramente documental que insere texto no canvas do job |
| **APT_CONFIG_FILE** | — | Variável de ambiente que aponta o arquivo de configuração usado pelo Parallel Engine |
| **Blocking** | Blocagem | Comparação exata que restringe quais registros são comparados no Matching |
| **Canvas** | Área de trabalho | Superfície do Designer onde se desenham estágios e links |
| **Clerical** | Duvidoso / administrativo | Faixa de pares de matching entre a nota de corte Clerical e a Match, que exige revisão manual |
| **Collector** | Coletor | Componente que reúne partições em um fluxo único para um estágio sequencial |
| **Configuration file** | Arquivo de configuração | Arquivo texto (`.apt`) que define nodes, pools e recursos do Parallel Engine |
| **Connector** | Conector | Família de estágios de acesso a bancos de dados (ODBC, DB2, Oracle, Snowflake...) |
| **Constraint** | Restrição | Expressão booleana que filtra quais registros seguem por um link de saída do Transformer |
| **Data Connection** | Objeto de conexão de dados | Objeto de repositório com credenciais e propriedades de conexão (senha criptografada) |
| **Data Set** | Conjunto de dados | Formato binário particionado nativo do DataStage: descritor `.ds` + arquivos de dados |
| **Derivation** | Derivação | Expressão que produz o valor de uma coluna de saída no Transformer |
| **Descriptor file** | Arquivo descritor | Cabeçalho de um Data Set/File Set que aponta para os arquivos de dados reais |
| **dsjob** | — | Utilitário de linha de comando para executar e consultar jobs |
| **Entire** | — | Método de particionamento keyless que envia **todas** as linhas para **todas** as partições |
| **File Set** | — | Formato particionado em arquivos de **texto** (`.fs`), legível por aplicações externas |
| **Filter** | Filtro | Estágio que direciona registros por condições tipo `WHERE` |
| **Fork-join** | Bifurcação-junção | Padrão em que um Copy bifurca o fluxo, um ramo agrega e o resultado é rejuntado por um Join |
| **Funnel** | Afunilamento | Estágio que une múltiplos links de entrada em um único link de saída (union) |
| **Golden Record** | Registro de ouro | Melhor versão consolidada de uma entidade, produzida pelo Survive |
| **Hash** | — | Método de particionamento keyed que envia valores iguais de chave sempre à mesma partição |
| **Impact analysis** | Análise de impacto | Rastreamento de onde um objeto é usado e de que ele depende |
| **Job** | Tarefa | Programa DataStage executável, construído com estágios e links |
| **Job Sequence** | Sequência de jobs | Job de controle que orquestra a execução de outros jobs |
| **Join** | Junção | Estágio que combina entradas ordenadas por chave (Inner/Left/Right/Full Outer) |
| **KeyChange** | — | Coluna criada pelo Sort com valor 1 na primeira linha de cada grupo e 0 nas demais |
| **Keyed / Keyless** | Com chave / sem chave | Classificação dos métodos de particionamento conforme dependam ou não de valores de campo |
| **Lookup** | Consulta / pesquisa | Estágio que resolve chaves contra uma tabela de referência carregada **em memória** |
| **Match Frequency** | — | Estágio que gera as distribuições de frequência usadas pelos algoritmos de matching |
| **Match Specification** | Especificação de match | Conjunto de passos, blocos, comparações e notas de corte, criado no Match Designer |
| **Merge** | — | Estágio que combina um master com updates ordenados, com link de rejeição por update |
| **MNS** | — | Multinational Standardize: padroniza endereços internacionais usando códigos ISO de país |
| **Modify** | — | Estágio leve de alteração de metadados e tratamento de nulos, sem geração de código C++ |
| **Node** | Nó | Unidade lógica de processamento definida no arquivo de configuração |
| **OSH** | Orchestrate Shell | Linguagem de script para a qual um Parallel Job é compilado |
| **Otherwise link** | Link "caso contrário" | Link do Transformer que recebe registros que não atenderam a nenhuma constraint |
| **Parameter Set** | Conjunto de parâmetros | Objeto de repositório que agrupa parâmetros e value files reutilizáveis |
| **Partitioner** | Particionador | Componente que distribui linhas entre partições na entrada de um estágio paralelo |
| **Pass** | Passo / passagem | Uma rodada de matching com bloco, comparações e cortes próprios |
| **Pattern-Action** | — | Linguagem do QualityStage que reconhece padrões de tokens e executa ações sobre eles |
| **Peek** | — | Estágio de debug que imprime amostras de dados no log |
| **Pipeline parallelism** | Paralelismo de pipeline | Execução simultânea de estágios, sem gravar em disco entre eles |
| **Provision All** | — | Ação (botão direito) que compila/publica uma Match Specification |
| **$PROJDEF** | — | Valor especial que faz um parâmetro resolver para o valor definido no projeto |
| **RCP** | Propagação de colunas em runtime | Runtime Column Propagation: propaga colunas não declaradas em tempo de execução |
| **Reject link** | Link de rejeição | Link que captura registros que falharam em uma regra |
| **Remove Duplicates** | Remoção de duplicados | Estágio que elimina registros adjacentes com chaves idênticas; exige entrada ordenada |
| **Residual** | — | Faixa de pares de matching abaixo da nota de corte Clerical: não são correspondência |
| **Resource disk / scratchdisk** | Disco de recursos / temporário | Locais definidos no arquivo de configuração para arquivos de dados e temporários |
| **Rule Set** | Conjunto de regras | Regras de parsing, classificação e organização usadas por Investigate e Standardize |
| **Same** | — | Método de particionamento que preserva o particionamento existente |
| **Score** | — | Plano de execução do Parallel Job, exibido no log por `APT_DUMP_SCORE` |
| **Sequencer** | Sequenciador | Estágio de Job Sequence que sincroniza fluxos com as opções `All` e `Any` |
| **Sequential File** | Arquivo sequencial | Estágio de leitura/gravação de arquivos texto (CSV, TXT) |
| **SQA** | — | Standardization Quality Assessment: avalia os resultados da padronização |
| **Stable sort** | Classificação estável | Sort que preserva a ordem relativa de registros já classificados |
| **Stage** | Estágio | Componente que executa uma operação sobre os dados |
| **Stage Variable** | Variável de estágio | Variável local do Transformer, avaliada de cima para baixo e persistente entre linhas |
| **Standardize** | Padronização | Estágio do QualityStage que aplica rule sets para normalizar campos |
| **Survive** | Sobrevivência | Estágio que compõe o melhor registro a partir de um grupo de registros relacionados |
| **Switch** | — | Estágio que envia cada registro para exatamente um de até 128 links |
| **Table Definition** | Definição de tabela | Objeto de repositório que armazena os metadados de uma origem ou destino |
| **Token** | — | Valor individual resultante da análise sintática, usado para criar padrões |
| **Transformer** | Transformador | Estágio ativo de transformação de propósito geral; compilado em C++ |
| **Trigger** | Acionador | Condição sob a qual o controle passa através de um link em um Job Sequence |
| **Uncert** | Incerteza | Comando de comparação difusa de strings no Matching |
| **Value file** | Arquivo de valores | Arquivo texto associado a um Parameter Set com um conjunto de valores |
| **Where used** | Onde é usado | Filtro/consulta que localiza os objetos que usam um determinado objeto |
| **XMETA** | — | Banco de dados do repositório de metadados do Information Server |

---

## 29. Tabela-resumo de estágios

| Estágio | Categoria | Tipo | Entradas | Saídas | Exige sort? | Reject? | Observação-chave |
|---|---|---|---|---|---|---|---|
| **Sequential File** | File | Passivo | 1 ou 0 | 1 ou 0 | Não | **Sim** | Sequencial com 1 reader; paralelo com múltiplos readers/arquivos |
| **Data Set** | File | Passivo | 1 ou 0 | 1 ou 0 | Não | Não | Formato binário nativo; preserva particionamento |
| **File Set** | File | Passivo | 1 ou 0 | 1 ou 0 | Não | Sim | Texto distribuído, legível externamente |
| **Lookup File Set** | File | Passivo | 1 ou 0 | 1 ou 0 | Não | Não | Referência de Lookup pré-processada |
| **Row Generator** | Dev/Debug | — | **0** | 1 | — | Não | Gera dados mock |
| **Column Generator** | Dev/Debug | — | 1 | 1 | Não | Não | Adiciona colunas geradas |
| **Peek** | Dev/Debug | — | 1 | 0 ou 1 | Não | Não | Imprime amostras no log |
| **Head / Tail / Sample** | Dev/Debug | — | 1 | 1+ | Não | Não | Amostragem |
| **Annotation** | — | — | 0 | 0 | — | — | Documentação no canvas |
| **Transformer** | Processing | **Ativo** | 1 | 1..N | Não | **Sim** | Stage Variables → Constraints → Derivations; compila C++ |
| **Copy** | Processing | Ativo | 1 | 1..N | Não | Não | Replica fluxo; renomeia/descarta colunas |
| **Filter** | Processing | Ativo | 1 | 1..N | Não | **Sim** | Condições tipo `WHERE`; `Output Row Only Once` |
| **Switch** | Processing | Ativo | 1 | até 128 | Não | **Sim** | Mutuamente exclusivo |
| **Modify** | Processing | Ativo | 1 | 1 | Não | Não | Metadados e nulos; sem C++ |
| **Sort** | Processing | **Ativo** | 1 | 1 | — | Não | `Stable Sort`, `Allow Duplicates`, `Create Key Change Column` |
| **Remove Duplicates** | Processing | **Ativo** | 1 | 1 | **Sim** | Não | `Duplicate To Retain = First/Last` |
| **Aggregator** | Processing | Ativo | 1 | 1 | Só no método `Sort` | Não | `Count Rows` / `Calculation`; `Hash`/`Sort` |
| **Join** | Processing | Ativo | 2+ | 1 | **Sim** | **Não** | Inner/Left/Right/Full; produto cartesiano em chaves duplicadas |
| **Lookup** | Processing | Ativo | 1 + N ref | 1 (+ reject) | **Não** | **Sim** | `fail` (default)/`drop`/`continue`/`reject`; em memória |
| **Merge** | Processing | Ativo | 1 master + N updates | 1 (+ N rejects) | **Sim** | **Sim** | Um reject por update link |
| **Funnel** | Processing | Ativo | 2+ | 1 | Só no `Sort Funnel` | Não | `Continuous`/`Sort Funnel`/`Sequence` |
| **Connectors (ODBC/DB2/Oracle...)** | Database | Passivo | 0..N | 0..N | Não | **Sim** | `Generate SQL`, write modes, table actions, `ERRORCODE`/`ERRORTEXT` |
| **Investigate** | Data Quality | Ativo | 1 | 1..2 | Não | Não | Character Discrete / Concatenate / Word; máscaras `C`, `T`, `X` |
| **Standardize** | Data Quality | Ativo | 1 | 1 | Não | Não | Uma regra por campo; regra não se repete no mesmo estágio |
| **Match Frequency** | Data Quality | Ativo | 1 | 1 | Não | Não | Gera frequências para o Match |
| **One-source Match** | Data Quality | Ativo | 2 (dados + freq) | até 4 | Não | Não | Dependent / Independent |
| **Two-source Match** | Data Quality | Ativo | 4 | várias | Não | Não | Many-to-one, Many-to-one Multiple/Duplicates, One-to-one |
| **Survive** | Data Quality | Ativo | 1 | 1 | Não | Não | Golden Record |
| **MNS** | Data Quality | Ativo | 1 | 1 | Não | Não | Endereços internacionais (ISO de país) |
| **SQA** | Data Quality | Ativo | 1 | 1+ | Não | Não | Avalia a qualidade da padronização |
| **Job Activity** | Sequence | — | 1..N | 1..N | — | — | 4 modos: Run / Reset if required, then run / Validate Only / Reset Only |
| **Sequencer** | Sequence | — | 2+ | 1+ | — | — | `All` / `Any` |
| **Wait For File** | Sequence | — | 1 | 1+ | — | — | Aguarda arquivo existir/sumir, com timeout |
| **Notification Activity** | Sequence | — | 1 | 0..N | — | — | E-mail via SMTP |
| **Execute Command** | Sequence | — | 1 | 1+ | — | — | Comando de sistema operacional |
| **Exception Handler** | Sequence | — | 0 | 1 | — | — | Trata interrupções não previstas |

---

## Apêndice A — Respostas às perguntas de revisão do treinamento

| Pergunta | Resposta |
|---|---|
| Qual estágio pode ser usado para exibir os dados de saída no log da tarefa? | **Peek** |
| Qual estágio é usado para documentar sua tarefa na tela de tarefa? | **Annotation** |
| Qual comando é usado para executar tarefas na linha de comandos do SO? | **`dsjob`** |
| Qual arquivo define o grau de paralelismo sob o qual uma tarefa é executada? | **O arquivo de configuração** (`APT_CONFIG_FILE`) |
| Quais são os dois algoritmos de particionamento que particionam com base em valores da chave? | **Hash** e **Modulus** (também são keyed: Range e DB2) |
| Quais algoritmos de particionamento produzem distribuições uniformes de dados nas partições? | **Round Robin** e **Random** |
| Que estágio é usado para executar cálculos de valores de coluna agrupados de maneiras específicas? | **Aggregator** |
| Quais são os dois modos possíveis de executar classificações? | **Dentro do estágio** (aba `Partitioning`) e **pelo estágio Sort** |
| O que é uma classificação estável? | Aquela que **não reordena registros já classificados** — preserva a ordem relativa original |
| Quais são dois tipos de agregações que podem ser executados? | **Count Rows** e **Calculation** |
| É possível comparar as diferenças entre quais dois tipos de objetos? | **Jobs** e **Table Definitions** |
| Quais caracteres "curinga" podem ser usados em uma busca? | **`*`** e **`?`** |
| Job cujo nome começa com "Lab", localização desconhecida — maneira mais rápida de exportar? | **Busca (Quick/Advanced Find) com `Lab*`, botão direito no resultado > `Export`** |
| Cite três filtros que você pode usar em Advanced Find. | **Tipo de objeto, pasta/localização, data de criação/modificação, `Where used`, `Dependencies of`, criador** |
| Quais são as três maneiras de compilar instruções SQL em estágios Connector? | **`Generate SQL = Yes` (automático), digitar manualmente, usar o SQL Builder** |
| Quais instruções podem ser especificadas nos estágios Connector? | **Select, Insert, Update, Upsert** e ações de tabela como **Create Table** |
| Quais são duas maneiras de carregar metadados de conexão de dados em um estágio de banco? | **Link de carregamento dentro do estágio** e **botão direito > `Load Data Connection`** |
| Um dos motivos de aumento de custos das empresas em tecnologia deve-se a: | **Falta de qualidade de informações** |
| Quais são os aspectos principais da qualidade de dados? | **Consistência, Integridade, Completude, Atualização/Relevância e Duplicidade** |
| O relacionamento entre dados (Produto × Categoria) é tratado em qual aspecto? | **Integridade** |
| Qual etapa do ciclo visa minimizar as diferenças no conteúdo dos campos e facilitar o Matching? | **Padronização (Standardize)** |
| Matching / Investigação / Enriquecimento / Sobrevivência / Padronização ↔ definições | Matching = **comparação aproximada**; Investigação = **identificação de problemas**; Enriquecimento = **validar e complementar dados**; Sobrevivência = **composição do melhor registro**; Padronização = **descrever de forma padrão** |

---

## Apêndice B — Fontes

1. **Treinamento IBM QualityStage & DataStage — Qualidade de dados** (MD2 Consultoria; instrutor Igor da Silveira Franco) — deck completo do treinamento.
2. **Caderno de Exercícios — Treinamento DataStage e QualityStage** (MD2) — 19 itens de laboratório prático.
3. **IBM DataStage — Lista de Exercícios Práticos para Trainees** — 8 atividades complementares traduzidas para PT-BR.
4. **Guia de arquivos no servidor** — caminhos e parâmetros do ambiente de treinamento.
5. **Documentação oficial IBM InfoSphere Information Server 11.7** — `https://www.ibm.com/docs/pt-br/iis/11.7.0`.
6. Aprendizados práticos consolidados de implementação das atividades (Capítulo 26).
