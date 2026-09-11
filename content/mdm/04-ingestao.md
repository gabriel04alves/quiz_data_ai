# Módulo 4 — Camada de Ingestão

> **Tempo estimado de leitura em voz alta:** ~22 minutos (≈3.275 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 62 a 88

---

## ABERTURA

Módulo 4: Camada de Ingestão.

Esse é o módulo da porta de entrada. É onde o dado sai do mundo do cliente e entra no mundo do MDM.

E ele importa por três razões.

**Primeira:** nada acontece sem ele. Higienização sem STG populada não tem o que higienizar. É o primeiro dominó.

**Segunda:** é o único módulo onde tem gente de fora envolvida. Todos os outros sete são trabalho do time de MDM. Esse aqui depende de o dono do sistema legado fazer a parte dele. Por isso ele é o mais político.

**Terceira, e mais importante conceitualmente:** é aqui que se decide se o projeto vai escalar ou não. Um MDM que precisa de um projeto de TI toda vez que entra um sistema novo morre no terceiro sistema. Esse módulo é a resposta pra isso, e a resposta tem um nome: **SIF**.

---

## PARTE 1 — De onde vêm os dados

A apostila começa amplo: **utilizando a suíte IBM Information Server, podemos acessar as mais variadas fontes de dados — desde planilhas, arquivos texto, os principais bancos de dados, até webservices e filas.**

Então tecnicamente a ferramenta lê de quase tudo. Planilha Excel, arquivo TXT, Oracle, SQL Server, DB2, chamada de serviço web, fila de mensagem.

Mas — e esse "mas" é o módulo inteiro — **poder ler de tudo não significa que valha a pena ler de tudo de qualquer jeito.** Porque cada formato diferente é código diferente pra manter.

---

## PARTE 2 — O problema: o modelo tradicional

A apostila mostra o contraste com o que ela chama de **modelo tradicional de ingestão**, e a frase é essa:

**"No modelo de ingestão de dados tradicional, seria necessário desenvolver 18 processos extratores, 1 para cada tabela de cada sistema origem."**

Vamos fazer a conta, porque o número assusta quando você projeta.

O hub tem 18 assuntos. Se eu tenho **1** sistema, são 18 extratores. Se eu tenho **5** sistemas, são 90 extratores. Se eu tenho os **14** sistemas que o IDC dizia ser a média das empresas lá no Módulo 1, são **252 extratores** pra construir e manter.

E cada um deles conhece intimamente a estrutura interna de um sistema legado. Se o time do CRM renomeia uma coluna, um dos 252 quebra. E o time do CRM não tem obrigação nenhuma de avisar o pessoal do MDM.

Esse é o modelo que não escala. É por isso que existe o SIF.

---

## PARTE 3 — A solução: views padronizadas e o SIF

A apostila apresenta a inversão:

**"Visando acelerar a inclusão de novas origens na solução MDM, utiliza-se o formato de exposição de views com um layout padrão — um contrato de assinatura de entrada de dados no HUB MDM."**

Guarda a palavra **contrato**. É o termo certo. Um contrato é um acordo entre duas partes sobre o que cada uma entrega.

E a mecânica:

**"Nesse sentido, o próprio cliente, ao incorporar um novo sistema, consegue com seus próprios recursos, juntamente com um DBA, criar as views para expor os dados."**

**"Feito isso, basta preencher a nossa tabela de controle, e o MDM já estará preparado para reconhecer essa nova origem e começar a extrair suas informações."**

Repara na inversão de responsabilidade, que é o coração do módulo:

**No modelo tradicional:** o time de MDM precisa entender o sistema legado e escrever código pra ele.

**No modelo SIF:** o dono do sistema legado entrega um layout padrão, e o time de MDM não escreve código nenhum — só cadastra a origem numa tabela de controle.

E a apostila é explícita sobre isso: **"é necessário que o responsável de cada sistema entenda sua base e relacionamentos para que seja possível criar a View."**

Isso faz todo sentido. Quem conhece a base do CRM é o time do CRM. Ninguém do MDM vai conhecer melhor. Então em vez de eu ter que aprender 14 sistemas, cada um dos 14 times me entrega o mesmo formato.

Agora o SIF formalmente:

**"O Hub MDM possui diversos assuntos, como Pessoa, Endereço e Telefone. A solução MD2 espera como entrada Views de cada assunto em layout pré-definido, por possuir um padrão de estrutura definida chamada SIF — Standard Input Format."**

**"O responsável pelo sistema de origem dos dados disponibiliza nas bases de dados do sistema fonte todas as Views necessárias para o Hub MDM no formato SIF."**

Uma nota técnica pra quem não é de banco de dados: **view** é uma consulta salva que se comporta como se fosse uma tabela. Ela não duplica dado — ela é uma janela sobre os dados que já existem, apresentados de outro jeito.

E isso é elegante pra caramba nesse contexto, por dois motivos.

**Primeiro:** o sistema legado não precisa mudar nada. As tabelas dele continuam iguais. A view é uma camada por cima.

**Segundo:** a view sempre mostra o dado atual. Não tem cópia desatualizada.

---

## PARTE 4 — Os 18 assuntos

A apostila lista a tabela das views esperadas, com a dependência de cada uma. São 18:

| View | Domínio | Depende de |
|---|---|---|
| `VIEW_PESSOA` | Informações de pessoas | *(não se aplica — é a raiz)* |
| `VIEW_DOCUMENTO` | Documentos | `VIEW_PESSOA` |
| `VIEW_ENDERECO` | Endereços | `VIEW_PESSOA` |
| `VIEW_TELEFONE` | Telefones | `VIEW_PESSOA` |
| `VIEW_CONTATO_ELETRONICO` | Contatos eletrônicos (e-mail etc.) | `VIEW_PESSOA` |
| `VIEW_EVENTO` | Eventos associados à pessoa | `VIEW_PESSOA` |
| `VIEW_CONTRATO` | Contratos | *(não se aplica)* |
| `VIEW_FISCAL` | Dados fiscais | `VIEW_PESSOA` |
| `VIEW_PERFIL` | Perfil | `VIEW_PESSOA` |
| `VIEW_UNIDADE_NEGOCIO` | Unidade de negócio | `VIEW_PESSOA` |
| `VIEW_CONTA` | Contas | `VIEW_PESSOA` |
| `VIEW_CONTATO` | Contatos | `VIEW_PESSOA` |
| `VIEW_MARCACAO` | Marcações | `VIEW_PESSOA` |
| `VIEW_RELACIONAMENTO` | Relacionamentos | `VIEW_PESSOA` para as **duas** pessoas relacionadas |
| `VIEW_FUNCIONARIO` | Funcionários | `VIEW_PESSOA` para as duas pessoas relacionadas |
| `VIEW_SOCIO` | Sócios | `VIEW_PESSOA` para as duas pessoas relacionadas |
| `VIEW_RELACAO_CONTATO_ELE` | Relação contato × contato eletrônico | `VIEW_PESSOA`, `VIEW_CONTATO_ELETRONICO`, `VIEW_CONTATO` |
| `VIEW_RELACAO_CONTATO_END` | Relação contato × endereço | `VIEW_PESSOA`, `VIEW_ENDERECO`, `VIEW_CONTATO` |
| `VIEW_RELACAO_CONTATO_TEL` | Relação contato × telefone | `VIEW_PESSOA`, `VIEW_TELEFONE`, `VIEW_CONTATO` |

[⚠️ CONFERIR NA APOSTILA: nesse slide, o **pareamento entre os nomes das views e suas descrições está desalinhado no PDF**. Por exemplo, `VIEW_CONTRATO` aparece na linha cuja descrição é "informações dos eventos associados a pessoa", e `VIEW_FISCAL` na linha descrita como "informações de contato". Eu reordenei acima pelo que faz sentido semanticamente (contrato → contrato, fiscal → fiscal), mas **conferir a tabela original**, principalmente as colunas de dependência de `VIEW_EVENTO` e `VIEW_CONTRATO` — se `VIEW_CONTRATO` realmente não depende de `VIEW_PESSOA`, isso é uma informação de modelagem relevante.]

Independente do desalinhamento, três coisas ficam claras e são o que importa:

**Uma:** `VIEW_PESSOA` é a raiz. Quase tudo depende dela. Isso reflete o que a gente viu no Módulo 3 — o modelo é orientado a dados pessoais.

**Duas:** existem views de **relacionamento entre pessoas** — Relacionamento, Funcionário, Sócio — e a dependência delas é dupla: precisa da `VIEW_PESSOA` das duas pontas. Isso é o que alimenta a visão de grafo que a gente vê no Módulo 8.

**Três:** existem views de **relação de contato** com três dependências. Elas ligam um contato a um telefone, a um endereço ou a um e-mail específico. Ou seja: "o Dr. Silva, contato da empresa X, atende no telefone tal".

E o rótulo que a apostila coloca embaixo dessa tabela: **"acelerador para inclusão de novas origens."**

---

## PARTE 5 — O layout das views: três grupos de campos

Agora o detalhe fino do contrato SIF. A apostila diz:

**"As views possuem um layout padrão por assunto e são divididas em dois grupos de atributos: atributos de rastreabilidade e atributos de carga."**

E depois, num terceiro slide, ela adiciona um terceiro grupo: **campos de ligação**. Então na prática são três.

### Grupo 1 — Campos de rastreabilidade

**"Armazenam dados que possibilitam rastrear o registro até sua origem, como nome do sistema, nome do banco de dados, nome da tabela e as chaves primárias. Pois os dados serão carregados em uma base integrada (Staging) e é necessário ter as informações de origem para que seja possível rastreá-los."**

Esse "pois" explica tudo. Quando eu junto 14 sistemas na mesma tabela `STG_PESSOA`, eu perco a informação de qual sistema é qual — a menos que eu carregue essa informação junto.

E aí vem a mecânica específica, que é a parte mais técnica do módulo:

**"Nos campos `COD_CAMPO_PK_LEGADO_0X` devem ser gravados os conteúdos das chaves primárias da tabela de origem. Caso haja apenas uma chave, apenas o campo `COD_CAMPO_PK_LEGADO_01` deve ser preenchido; caso a chave seja composta, deve-se preencher seguindo a ordem numérica."**

**"Como os campos chaves na View são nomes genéricos, é necessário que os nomes dos atributos sejam gravados no grupo `NOM_CAMPO_PK_LEGADO_0X`, seguindo a mesma ordem dos campos `COD_CAMPO_PK_LEGADO_0X`."**

Deixa eu explicar isso com exemplo, porque no papel confunde.

Imagina que no CRM a tabela de clientes tem chave primária simples, a coluna `ID_CLIENTE`, e a Maria é o cliente `4471`.

Na view SIF, o time do CRM preenche:
- `NOM_CAMPO_PK_LEGADO_01` = `"ID_CLIENTE"` ← o **nome** da coluna
- `COD_CAMPO_PK_LEGADO_01` = `"4471"` ← o **valor** dela

Agora imagina o ERP, onde a tabela de clientes tem chave **composta** por `COD_FILIAL` + `COD_CLI`, e a Maria é filial `"SP01"`, cliente `"98322"`. Aí:
- `NOM_CAMPO_PK_LEGADO_01` = `"COD_FILIAL"` / `COD_CAMPO_PK_LEGADO_01` = `"SP01"`
- `NOM_CAMPO_PK_LEGADO_02` = `"COD_CLI"` / `COD_CAMPO_PK_LEGADO_02` = `"98322"`

**Por que separar nome e valor?** Porque o MDM não pode ter uma coluna chamada `ID_CLIENTE` — cada sistema chama a chave de um jeito diferente. Então ele tem colunas genéricas numeradas, e guarda o nome original como **dado**, não como estrutura.

Isso é um padrão clássico e é o que permite juntar 14 sistemas com 14 esquemas de chave diferentes na mesma tabela. E é o que sustenta a **rastreabilidade** que a apostila cita o tempo todo: dado esse Golden Record, eu consigo voltar e dizer "esse pedaço veio do CRM, tabela CLIENTES, ID_CLIENTE = 4471".

### Grupo 2 — Campos de carga

**"Campos que contêm os dados de cada assunto do Hub MDM."**

**"Mesmo campos que não possuam informação devem ser mapeados na View com valores nulos."**

Essa segunda regra é importante e as pessoas erram. Se o sistema de origem não tem, por exemplo, o campo "nome da mãe", o time **não pode simplesmente omitir a coluna** da view. Tem que colocar a coluna preenchida com nulo.

Por quê? Porque o processo de leitura do MDM é genérico — ele espera um layout fixo. Se faltar coluna, ele quebra. É a mesma lógica de uma tomada: você não pode entregar um plugue com dois pinos onde o padrão são três.

E: **"cada aba do documento de mapeamento possui o layout padrão de cada assunto do Hub MDM."** Ou seja, existe uma planilha de mapeamento entregue ao cliente, com uma aba por assunto.

### Grupo 3 — Campos de ligação

**"Campos que contêm os dados de ligação com a view da qual o assunto em questão depende. Exemplo: o documento pertence a uma pessoa."**

**"Espera-se que o valor mapeado seja o mesmo utilizado na view principal."**

**"Os campos de ligação serão mapeados com os campos de rastreabilidade da view principal."**

Esse terceiro grupo é o que faz a coluna "Dependência" daquela tabela das 18 views funcionar na prática.

Exemplo: na `VIEW_DOCUMENTO`, cada linha é um documento. Como o MDM sabe de quem é aquele CPF? Pelos campos de ligação, que repetem exatamente a chave de rastreabilidade que a `VIEW_PESSOA` usou pra aquela pessoa.

Então se na `VIEW_PESSOA` a Maria é `ID_CLIENTE = 4471`, na `VIEW_DOCUMENTO` o CPF dela vai ter campo de ligação apontando pra `4471`. **Tem que bater exatamente.** Se não bater, o documento vira órfão.

Essa é, na minha leitura, a parte mais propensa a erro na implantação de uma nova origem. E vale insistir nisso com o time do sistema fonte.

---

## PARTE 6 — Cadastro das views e a tabela de controle

**"Uma vez adicionado o sistema com as devidas configurações de servidor, data source e nome das views, o processo já estará preparado para fazer a leitura de seus dados e carregar o MDM."**

Três configurações: **servidor**, **data source** (a fonte de dados / conexão) e **nome das views**.

E lembra do que a apostila disse antes: "basta preencher a nossa tabela de controle". Essa tabela de controle mora na camada **CTR** que a gente viu no Módulo 3.

**Esse é o ponto que eu quero martelar do módulo:** integrar um sistema novo ao MDM é uma tarefa de **configuração**, não de **desenvolvimento**. Ninguém escreve código. Alguém preenche um cadastro. É a diferença entre uma semana e um trimestre.

[⚠️ CONFERIR NA APOSTILA: o slide de "Cadastro das Views" é um screenshot da tela de cadastro, sem texto além dessa frase. Vale ver quais campos exatamente compõem esse cadastro — provavelmente é uma tela do Quality Manager.]

---

## PARTE 7 — Os processos de integração

Agora, o que roda de fato.

**"A camada STAGING consolida dados provenientes dos diversos sistemas de origem, através da leitura e carga das views de cada assunto específico — Pessoa, Telefone, Endereço, Contato Eletrônico, Documento e outros."**

**"Essas cargas são feitas através de Jobs QualityStage, que extraem os dados das views na forma como os mesmos estão armazenados 'AS-IS' em cada sistema individualmente, e carregam nesta base já com as devidas adequações estruturais."**

Duas expressões pra fixar aqui, porque elas parecem contraditórias mas não são:

**"AS-IS"** significa "como está". O conteúdo do dado **não é alterado** na ingestão. Se o nome vem "MARIA CASTILHO FIGUEIRA " com espaço sobrando, entra com espaço sobrando. Se o sexo vem "2", entra "2".

**"Adequações estruturais"** significa que a **forma** muda. A coluna `NM_CLI` do sistema A e `NOME_CLIENTE` do sistema B viram a mesma coluna na STG.

Então: **estrutura equalizada, conteúdo intocado.** Exatamente o que o Módulo 3 explicou sobre o VARCHAR(255).

E os sistemas de origem que a apostila desenha no diagrama: **CRM, ERP, Call Center, Data Mart e BI.**

Sobre a organização dos jobs, a apostila dá o caminho:

**"Jobs responsáveis pela leitura dos arquivos e carga do modelo da camada STG — Local: `Jobs\MDM\03_STG\Generico\`"**

**"Para cada assunto existem os Jobs responsáveis pela leitura do(s) arquivo(s) gerado(s) após a leitura das views e carga da camada STG."**

Repara numa coisa interessante nessa frase: os jobs leem **arquivos gerados após a leitura das views**. Ou seja, o fluxo tem duas etapas: primeiro um processo extrai as views pra arquivo, depois outro processo lê o arquivo e carrega a STG.

E repara também na pasta: `Generico`. O nome já diz. Os jobs de carga da STG são genéricos — servem pra qualquer origem. É a materialização do SIF em código.

[⚠️ CONFERIR NA APOSTILA: os slides "Processos de Integração" e "Exemplo de Job de Extração" são screenshots dos jobs no DataStage, sem texto. Vale olhar os estágios desenhados no job de exemplo pra entender o fluxo real.]

---

## PARTE 8 — Tratamento de falhas e sincronia

Esse bloco é curto na apostila mas é operacionalmente o mais importante do módulo. Título: **"Falha no processo de extração de um sistema de origem."**

**"Responsável por invocar os processos extratores das Views e os processos genéricos para carga da camada STG do MDM."**

**"Caso haja falha no processo de extração de um sistema, este ficará com o indicador de status de execução do lote `STA_LOTE_ABERTO_FECHADO` = 'A'. Desta forma, no próximo ciclo de execução, o período de extração será o período atual mais o período que ocorreu a falha."**

**"A falha de um sistema não impacta no processamento dos demais sistemas."**

**"As estatísticas de tempo de execução do processo são gravadas na tabela `CTR_EXECUCAO_PROCESSO`."**

Vamos desmontar, porque tem três decisões de projeto boas aqui.

**Primeira: o lote tem estado.** `STA_LOTE_ABERTO_FECHADO` — status do lote, aberto ou fechado. "A" de aberto significa: esse lote não terminou. "F" de fechado significaria: terminou bem.

**Segunda: a recuperação é automática e por período.** Se a carga do CRM falhou na segunda-feira, o lote fica "A". Na terça, o processo não pega só terça — ele pega segunda **mais** terça. Ninguém precisa acordar de madrugada e reprocessar na mão. O sistema se autorrecupera.

Isso é um padrão que em engenharia de dados a gente chama de janela móvel de reprocessamento, e é o que separa um pipeline profissional de um script.

**Terceira: isolamento entre sistemas.** Se o CRM cair, o ERP continua carregando normalmente. Isso significa que uma indisponibilidade do banco do CRM na madrugada não derruba a carga MDM inteira. Sem isso, o MDM ficaria refém do sistema mais instável do parque.

E tudo isso é gravado onde? Na camada **CTR**, exatamente como o Módulo 3 antecipou. Aqui a CTR deixa de ser abstrata: `CTR_EXECUCAO_PROCESSO` é uma tabela concreta com tempos de execução.

---

## PARTE 9 — O que fica populado ao fim da ingestão

A apostila fecha o ciclo:

**"Ao fim do processo de integração teremos as camadas Staging Trilha, Staging e Staging Histórico populadas."**

Três camadas:

- **Staging** — o dado AS-IS.
- **Staging Trilha** — de onde veio (sistema, banco, tabela, chave primária).
- **Staging Histórico** — as versões anteriores.

Esse **Histórico** é o "HIST" do diagrama de arquitetura do Módulo 2. E ele é o que permite responder a pergunta do Módulo 1: **"qual a última vez que o cadastro do cliente foi atualizado?"**

Sem histórico, eu só sei o estado atual. Com histórico, eu sei que o endereço da Maria mudou em março, e qual era o anterior. Isso importa pra auditoria e importa pra LGPD.

---

## PARTE 10 — E o que não cabe no SIF? O CRUD via Quality Manager

Aqui a apostila faz uma pergunta ótima:

**"Como fazer a ingestão de dados que não estão contidos dentro das estruturas de views padrões — dados pessoais, documentos, telefones, endereços e demais?"**

Ou seja: e quando o dado não vem de sistema nenhum? Quando alguém do atendimento descobre no telefone que o endereço da Maria mudou, e esse endereço novo não existe em lugar nenhum pra ser extraído?

A resposta:

**"O CRUD MDM permite que os usuários possam cadastrar, visualizar, editar/atualizar e excluir dados de pessoas unificadas (Golden Record) através da interface da Consulta de Pessoas do MD2 Quality Manager, para posterior processamento no fluxo do MDM."**

Lembrando o CRUD do Módulo 1: **Create, Read, Update, Delete** — criar, ler, atualizar, excluir.

Duas coisas a destacar nessa frase.

**Uma:** a edição é feita sobre a **pessoa unificada**, o Golden Record. Não é sobre um cadastro de origem. Isso faz sentido — o usuário do atendimento não pensa em "registro do CRM", ele pensa "a Maria".

**Duas — e essa é a mais importante:** *"para posterior processamento no fluxo do MDM."* O dado digitado na tela **não vira Golden Record na hora**. Ele entra no fluxo e passa por tudo: higienização, crítica, matching, sobrevivência. Ou seja, o dado manual **não é privilegiado**. Ele é tratado como qualquer outra origem.

Isso é uma decisão de arquitetura importante. Se o dado manual pulasse a fila, o Quality Manager viraria uma porta dos fundos pra sujar a base.

E, conectando com o Módulo 1: **é essa funcionalidade que empurra a solução da MD2 na direção do modo Co-Existence.** Porque agora o MDM não é só receptor — ele também é ponto de entrada.

A apostila mostra telas de: **atributos, dados pessoais, documento e edição.**

[⚠️ CONFERIR NA APOSTILA: os quatro slides de "Manipulação de dados via Quality Manager" são só screenshots das telas, com título e nada mais. Não há texto descrevendo quais campos são editáveis nem se existe fluxo de aprovação. Conferir nas telas, e perguntar ao instrutor se a edição manual passa por algum workflow de aprovação antes de entrar no fluxo.]

---

## PARTE 11 — Entrada via API

E a última porta de entrada:

**"O MD2 Quality Manager permite a utilização da funcionalidade de manipulação dos dados por meio de APIs, para garantir a possibilidade de consumo dessa opção por aplicações externas ao MD2 MDM."**

**API** significa *Application Programming Interface* — é o jeito de um sistema conversar com outro por programa, sem gente no meio.

Então o mesmo CRUD que o curador faz na tela, um sistema externo pode fazer por chamada de API. Exemplo concreto: um app de cadastro de cliente pode consultar o MDM em tempo real pra ver se aquela pessoa já existe, antes de criar mais uma duplicata.

Resumindo as **três portas de entrada** do hub:

1. **SIF / Views padronizadas** — carga em lote, o caminho principal, para sistemas.
2. **CRUD via Quality Manager** — entrada manual, pontual, pelo curador.
3. **API** — entrada programática, para aplicações externas.

E as três desembocam no mesmo lugar: a esteira de processamento do MDM.

---

## TRANSIÇÃO PRO MÓDULO 5

Beleza. Neste ponto a STG está populada.

Mas ela está populada com **lixo honesto**. E eu falo isso sem ironia: a STG é um espelho fiel do legado, e o legado é sujo. Lá dentro está a Maria escrita de três jeitos, o CPF com os dígitos trocados, o sexo como "2" num sistema e "Feminino" no outro, o endereço "SQS 110 A 610" que nenhum sistema de correio entende, e o telefone sem DDD.

E a STG **não pode** consertar isso — por design. Ela é VARCHAR(255) justamente pra aceitar tudo sem julgar.

E aqui está a dependência lógica que amarra o módulo seguinte: **eu não consigo comparar a Maria de um sistema com a Maria de outro enquanto elas estiverem escritas de jeitos diferentes.** Não dá pra fazer matching em cima de "MARIA C. FIGUEIRA" versus "Maria Castilho Figueira " com espaço sobrando. Qualquer comparação vai dar errado.

Então antes de unificar, é obrigatório **padronizar**. Deixar todo mundo no mesmo formato, validar o que dá pra validar, e completar o que dá pra completar.

E é isso o Módulo 5 — Processos de Higienização. É onde a STG vira BIP. É a lavanderia do MDM.

E olha só como a cascata se encaixa: SIF popula a STG, a higienização transforma STG em BIP, e é só depois que os dados estão limpos na BIP que a gente consegue fazer o próximo passo, que é descobrir quem é quem.

---

## AUTO-TESTE — Módulo 4

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** Explique a conta dos "18 processos extratores" e por que o modelo tradicional não escala. Depois explique como o SIF inverte a responsabilidade — quem faz o quê em cada modelo.

**2.** Descreva os três grupos de campos de uma view SIF (rastreabilidade, carga, ligação). Explique especificamente por que existem os pares `NOM_CAMPO_PK_LEGADO_0X` e `COD_CAMPO_PK_LEGADO_0X` em vez de uma coluna com o nome real da chave.

**3.** A carga do CRM falhou hoje de madrugada. O que acontece com o indicador `STA_LOTE_ABERTO_FECHADO`, o que acontece na carga de amanhã, e o que acontece com os outros sistemas hoje?

---
