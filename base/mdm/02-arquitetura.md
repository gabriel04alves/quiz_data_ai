# Módulo 2 — Arquitetura do Hub de Dados

> **Tempo estimado de leitura em voz alta:** ~18 minutos (≈2.670 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 27 a 45

---

## ABERTURA

Módulo 2: Arquitetura do Hub de Dados.

No módulo anterior eu entendi o problema e entendi que existe uma disciplina chamada MDM pra resolver ele. Agora eu preciso entender **como a solução da MD2 está montada por dentro**.

Por que esse módulo importa? Porque ele é o mapa. Todos os próximos módulos são zoom em pedaços desse mapa. Se eu não fixar o mapa agora, no Módulo 5 eu vou estar falando de "carregar a BIP" e não vou lembrar de onde a BIP vem nem pra onde ela vai.

Então a minha meta nesse módulo é sair sabendo desenhar o fluxo de ponta a ponta num guardanapo. Ingestão, tratamento, unificação, publicação. E saber o que acontece em cada etapa.

---

## PARTE 1 — O que é arquitetura, afinal

A apostila abre com uma definição que eu acho boa, então vou ler ela e comentar:

**"Arquitetura é a ciência ou arte que planeja a criação de unidades — de qualquer natureza — pensadas e até criadas com certa independência, porém interligadas, e que quando integradas formam um todo homogêneo, funcional e flexível. Compreender a arquitetura de algo permite às pessoas ter algum sentido limitado de coisas muito complexas."**

Tem duas ideias aí que valem parar.

A primeira é **"criadas com certa independência, porém interligadas"**. Isso é o princípio do baixo acoplamento. Cada peça faz seu trabalho sozinha, mas as peças conversam. Na prática do MDM isso significa: eu posso mexer no processo de higienização sem quebrar o processo de ingestão.

A segunda é **"ter algum sentido limitado de coisas muito complexas"**. Repara na honestidade dessa frase. Arquitetura não é a coisa toda — é uma simplificação útil da coisa toda. A planta baixa não é a casa. Mas sem a planta, ninguém constrói.

---

## PARTE 2 — O diagrama funcional da solução

Antes do detalhe técnico, a apostila mostra o desenho de mais alto nível possível. Ele diz o seguinte:

Na empresa existem **sistemas diversos**. Nesses sistemas legados, duas coisas são monitoradas **continuamente**:

- Os **dados pessoais**, pra que sejam capturados e **qualificados**.
- As **estruturas de dados**, pra que sejam capturadas e **classificadas**.

Repara nessa distinção, porque ela é sutil e importante. Uma coisa é olhar pro *conteúdo* — o CPF da Maria está válido? Outra coisa é olhar pra *estrutura* — existe uma coluna nova na tabela do CRM que ninguém me avisou?

E o **HUB MDM** entrega sete capacidades. A apostila lista:

1. Integração com as origens
2. Qualidade de dados
3. Unificação de dados
4. Disponibilização dos dados
5. Gestão de metadados
6. Catalogação dos ativos de TI
7. Classificação de dados
8. Descoberta de dados

Vale separar essas capacidades em dois grupos, porque elas respondem a coisas diferentes.

As quatro primeiras — integração, qualidade, unificação, disponibilização — são o **fluxo do dado**. É a linha de produção: entra sujo, sai limpo e único.

As quatro últimas — metadados, catalogação, classificação, descoberta — são o **fluxo do conhecimento sobre o dado**. Não é o dado em si, é o saber onde ele está e o que ele é. Isso é governança.

Um esclarecimento sobre **metadados**, já que a palavra aparece aqui pela primeira vez: metadado é **dado sobre o dado**. O CPF da Maria é dado. "A coluna CPF é do tipo texto, tem 11 posições, é um dado pessoal sensível, vem da tabela CLIENTES do sistema CRM e foi atualizada pela última vez ontem" — isso tudo é metadado.

---

## PARTE 3 — A tecnologia por trás

Aqui vem uma informação central que vale fixar bem: **a solução MD2 MDM é construída no IBM DataStage / QualityStage.**

Vamos desmontar isso.

**IBM Information Server**, ou **IIS**, é a suíte da IBM pra integração e qualidade de dados. Dentro dessa suíte existem produtos.

**DataStage** é a ferramenta de ETL. ETL significa *Extract, Transform, Load* — extrair, transformar, carregar. É o motor que pega dado de um lugar, mexe nele e coloca em outro.

**QualityStage** é o irmão do DataStage especializado em **qualidade de dados**. É ele que sabe padronizar nome, endereço, telefone, e — principalmente — é ele que sabe fazer o **matching**, que é comparar registros pra descobrir se são a mesma pessoa. Vamos ver isso a fundo no Módulo 6.

Na prática, quando a apostila fala de "jobs", ela está falando de programas visuais construídos dentro do DataStage/QualityStage. E ela menciona que **os ativos são todos organizados em pastas** pra garantir a melhor gestão do ambiente e do produto. Isso vai aparecer nos próximos módulos com caminhos tipo `Jobs\MDM\03_STG\Generico\` e `Jobs\MDM\04_BIP_BUP`.

E existe uma segunda peça de software, que é da própria MD2:

**MD2 Quality Manager**, ou **MD2 QM**. A apostila define assim: é uma plataforma concebida pra gestão da qualidade integrada, pro programa de conformidade à LGPD, e pra funcionar como **interface de gestão e curadoria MDM**, contemplando todas as funcionalidades necessárias pra suportar atividades relacionadas a esses pilares.

Traduzindo: o DataStage/QualityStage é o **motor**, o que roda de madrugada processando milhões de registros. O Quality Manager é a **cara** — a tela onde o ser humano entra pra olhar, decidir e corrigir. Ele é o assunto principal do Módulo 8.

---

## PARTE 4 — A visão geral da solução

A apostila resume o valor da solução em quatro pontos:

- Gerenciamento de dados de forma **flexível**, pra permitir integração de dados em múltiplas plataformas.
- **Única versão da verdade** para múltiplos propósitos de negócio.
- Apoio em programas de **governança, marketing e regulamentação**.
- Entrega de **dados de qualidade** para aplicações e processos de negócio.

Essa expressão "única versão da verdade" — em inglês *single version of the truth* — é sinônimo do Golden Record do Módulo 1. E o "para múltiplos propósitos" é a parte que as pessoas esquecem: o mesmo Golden Record serve o marketing, serve a cobrança, serve o compliance. Não é um por área.

---

## PARTE 5 — A arquitetura da solução (o desenho principal)

Agora o slide mais importante do módulo. Vou descrever ele em camadas, de cima pra baixo e da esquerda pra direita.

**Em cima**, atravessando tudo: a **Interface de Curadoria** e o **Dashboard Administrativo**. Isso é o Quality Manager. Ele fica por cima de tudo porque ele enxerga tudo.

**Na esquerda**: as **Fontes**. Os sistemas legados.

**Na direita**: o **Consumo**. Quem vai usar o dado no final.

**No meio**, atravessando todo o desenho: a **Camada de Governança**.

E dentro dessa camada de governança, quatro processos em sequência, da esquerda pra direita:

1. **Processos de Integração** — que gravam na **Camada STG** e nas **Trilhas de Auditoria**, com uma camada **HIST** associada.
2. **Processos de Higienização** — que gravam nas camadas **BIP** e **BCR**, com a camada **BQA** associada. Isso já é o HUB MDM.
3. **Processos de Unificação** — que gravam nas camadas **BUP** e **BHH**, com a camada **BQA** associada. Também HUB MDM.
4. **Enquadramento / Consentimento** — que é a parte **LGPD**.

E embaixo, atravessando as etapas de higienização e unificação: **Enriquecimento de Dados**.

Na coluna do consumo aparecem: **HUB MDM**, **LGPD**, **Contratos e Produtos**, **Enquadramento Legal**, **Gestão de Consentimento**.

Agora, as siglas. Elas vão ser detalhadas no Módulo 3, mas eu quero introduzir o significado agora pra você já ir ouvindo com sentido:

- **STG** = **Staging**. É o espelho cru do legado. Palco de espera.
- **HIST** = **Histórico**. Guarda as versões anteriores.
- **BIP** = camada do dado **qualificado** — padronizado, validado, enriquecido.
- **BCR** = **Base Corporativa de Referência**. As tabelas de domínio, as "traduções".
- **BUP** = camada do dado **unificado** — é onde mora o Golden Record.
- **BHH** = a camada de **Household** — o agrupamento por endereço.
- **BQA** = **Base de Quality Assurance**. Onde ficam os problemas: inválidos e duvidosos.

[⚠️ CONFERIR NA APOSTILA: a sigla **BHH** aparece nesse diagrama de arquitetura ("Camada BUP e BHH") mas **não é definida em lugar nenhum** da apostila — nem no Módulo 3, que é justamente o módulo que lista e explica as camadas do modelo de dados. A leitura de "BHH = Base House Holding" é dedução minha, apoiada no fato de que o Módulo 8 explica House Holding como "a base unificada de endereços". Confirmar com o instrutor.]

Repara numa coisa importante do desenho: **a BQA aparece duas vezes** — uma na higienização, outra na unificação. Isso não é erro. É porque os dois processos produzem problemas, e os dois jogam esses problemas no mesmo lugar. Na higienização o problema é "esse CPF é inválido". Na unificação o problema é "eu não sei se esses dois são a mesma pessoa". Ambos vão pra BQA e ambos viram trabalho de curadoria.

---

## PARTE 6 — As quatro etapas do MDM

A apostila resume o pipeline inteiro em quatro palavras. Essas quatro palavras são a espinha dorsal do treinamento:

**Ingestão → Tratamento → Unificação → Publicação**

E ela mapeia cada etapa pra um processo e uma camada:

| Etapa | Processo | Camada resultante |
|---|---|---|
| Ingestão | Processos de Integração | Camada Stage e Trilhas de Auditoria (+ Histórico de Alteração) |
| Tratamento | Processos de Higienização | Camada Integrada e Referências (+ Base de Qualificação) |
| Unificação | Processos de Unificação | **Visão Unificada da Pessoa** (+ Base de Qualificação) |
| Publicação | Processos de Consumo | — |

E atravessando as três primeiras etapas, na base do desenho: **Curadoria de Dados** e **Governança e Curadoria de Dados**. Mais o **Dashboard / Gestão**.

Uma observação de vocabulário: no primeiro slide desse diagrama a apostila escreve "VISÃO UNIFICADA **DA PESSOA**", e num slide seguinte escreve "VISÃO UNIFICADA **DO TITULAR**". São a mesma coisa. "Titular" é a palavra da LGPD — titular de dados pessoais. Vale saber que os dois termos aparecem.

---

## PARTE 7 — Etapa 1: Ingestão e o SIF

Agora a apostila detalha cada uma das quatro etapas. Vamos por partes, porque cada uma vira um módulo depois.

**Ingestão.** O ponto central aqui é a sigla **SIF**.

**SIF significa Standard Input Format** — Formato Padrão de Entrada.

E por que ele existe? Esse é o ponto que eu quero que fique claro, porque a razão de existir é mais importante que a definição.

Sem SIF, cada sistema novo que entra no MDM exige que alguém escreva um extrator novo, feito à mão, entendendo a estrutura daquele sistema específico. Isso significa: cada nova origem é um projeto.

Com SIF, a lógica inverte. O MDM publica um contrato: "me entregue uma view com esse layout exato". O dono do sistema de origem monta a view. E o MDM já sabe ler, sem que ninguém mexa no código do MDM.

A apostila descreve isso como **"entrega de dados via view padrão SIF"** e lista os benefícios:

- **Padrão de conectividade** que agiliza a integração de novas fontes, **sem impacto no core da aplicação**.
- Consumo de **views ou serviço web**.
- **Baixo acoplamento.**
- **Ampla conectividade.**
- **Regras reutilizáveis.**
- **Governança de dados.**
- **Rastreabilidade das origens.**

E o resumo da apostila: *"Standard Input Format — facilidade de inclusão de novas origens."*

Deixa eu dar uma analogia. O SIF é a tomada padrão. Não importa se o aparelho é uma geladeira ou um secador — se o plugue for padrão, entra na tomada. Sem padrão, cada aparelho precisaria de um eletricista.

E o dado que chega assim, cru, a apostila chama de **Raw Data** — dado bruto, sem tratamento.

---

## PARTE 8 — Etapa 2: Tratamento

**Tratamento.** A apostila descreve como "crítica e validação — qualidade de dados", e lista o que acontece:

- **Tratamento e enriquecimento de telefones com base Anatel.**
- **Tratamento e validação de endereços eletrônicos** (ou seja, e-mails).
- **Tratamento e enriquecimento de endereços com DNE.**
- **Enriquecimento com fontes externas** e outros provedores contratados.

Duas siglas aqui:

**Anatel** é a Agência Nacional de Telecomunicações. A base da Anatel diz quais faixas de número pertencem a qual operadora, qual DDD, se é fixo ou celular. Se um telefone cai fora dessas faixas, provavelmente é inválido.

**DNE** é o **Diretório Nacional de Endereços**, dos Correios. É a base oficial que diz quais CEPs existem, a que logradouro cada um pertence, em que cidade e estado. É o que permite pegar "SQS 110 A 610" e descobrir que é Brasília, DF, CEP tal.

E aparecem duas palavras-chave que valem distinguir bem:

- **Padronização de dados** — deixar tudo no mesmo formato.
- **Catálogo de regras de tratamento** — o conjunto de regras prontas.

A apostila diz que existe um **banco de regras prontas pra padronização e enriquecimento de dados cadastrais de pessoas e produtos**, e que o resultado é **aumento na produtividade e redução do prazo e custo de projeto**. Ou seja: é acelerador de projeto, não é feito do zero pra cada cliente.

E tem uma ferramenta específica citada: **através do IBM Information Governance Catalog, temos acesso à documentação completa das regras de tratamento de Dados Mestre aplicadas pelo MDM.**

O **Information Governance Catalog**, ou **IGC**, é o catálogo de governança da IBM. É onde as regras ficam **documentadas** — não onde elas rodam. É a diferença entre a receita escrita no livro e o cozinheiro fazendo o prato.

---

## PARTE 9 — Etapa 3: Unificação e Sobrevivência

A apostila é curta aqui, porque tem dois módulos inteiros pra isso depois. Ela cita:

- **Motor de Resolução de Identidade** (isso é o Matching, Módulo 6)
- **Sobrevivência** (Módulo 7)

"Resolução de identidade" é um nome bonito pra: descobrir que a Maria Castilho Figueira, a Maria Figueira e a Maria C. Figueira são a mesma identidade.

---

## PARTE 10 — Etapa 4: Publicação e consumo do Golden Record

Aqui a apostila faz uma afirmação que eu acho a mais honesta do módulo inteiro:

**"Esta é a fase mais customizada da solução."**

Ou seja: as três primeiras etapas são padronizadas, produto de prateleira. A quarta muda em cada cliente.

O princípio geral: **uma vez concluídas todas as etapas, o registro está disponível pra todo e qualquer sistema corporativo. Os métodos pra publicação desses dados podem variar de acordo com a arquitetura desejada pelo cliente.**

E as opções que a apostila lista:

- **Replicar dados em banco de dados transacionais**
- **Replicar dados no Data Lake**
- **Integrar com barramento de serviços**
- **Integrar via mensageria** (Kafka, MQ, etc.)

Explicando os termos:

**Data Lake** é um repositório grande que guarda dados em formato bruto pra análise. É pra onde o pessoal de BI e ciência de dados vai.

**Barramento de serviços** — em inglês *Enterprise Service Bus*, ou ESB — é uma camada de integração central por onde os sistemas conversam via chamadas de serviço. Um sistema pergunta "quem é o cliente 123?" e o barramento roteia a pergunta.

**Mensageria** é integração assíncrona por fila. **Kafka** e **MQ** são produtos disso. A diferença pro barramento é que aqui ninguém pergunta — o MDM **avisa**. "O cliente 123 mudou de endereço" vai pra fila, e quem se interessa lê.

E antes de tudo isso, a apostila destaca: **entender as prioridades de utilização e consumo do HUB MDM**. Ou seja, não é "publica tudo pra todo mundo". É descobrir quem precisa do quê.

---

## PARTE 11 — A visão geral dos dados mestres (o que o usuário vê)

A apostila fecha mostrando o que o usuário final enxerga:

- **Controle dos dados via painéis analíticos**
- **Visão dos sistemas envolvidos**
- **Consulta de pessoas** — navegação e consulta de pessoas no HUB MDM
- **Visão de rastreabilidade das origens**

Esse último item é o que mais me interessa, e é um tema que atravessa a apostila inteira: **rastreabilidade**. Não basta o MDM dizer "o nome dela é Maria Castilho Figueira". Ele tem que conseguir dizer **de onde** veio esse nome, **qual sistema** forneceu, e o que os outros sistemas diziam. Sem isso, o Golden Record vira uma caixa-preta em que ninguém confia.

[⚠️ CONFERIR NA APOSTILA: os slides de "Visão Geral dos Dados Mestre" são todos screenshots das telas, sem texto explicativo além dos rótulos. O conteúdo real é visual. Conferir as telas.]

---

## TRANSIÇÃO PRO MÓDULO 3

Então, o que eu tenho agora?

Eu tenho o mapa. Sei que o dado entra pelo SIF, cai na STG, é tratado e vira BIP, é unificado e vira BUP — o Golden Record — e é publicado. Sei que os problemas caem na BQA, que as referências ficam na BCR, e que existe uma interface humana chamada Quality Manager por cima de tudo.

Mas eu falei um monte de sigla de camada e passei correndo por todas. STG, BIP, BUP, BCR, BQA, HIST, BHH.

E é exatamente isso que o **Módulo 3 — Modelo de Dados do HUB MDM** resolve. Ele para, respira, e explica cada uma dessas camadas: o que ela guarda, por que ela existe, como as tabelas dela são estruturadas e como elas se chamam.

E tem uma dependência lógica clara aqui: **eu não consigo entender o processo de ingestão do Módulo 4 se eu não souber primeiro o que é a tabela de destino.** Não adianta eu falar "o job carrega a STG_PESSOA" se você não sabe o que é a STG.

Então: primeiro as caixas, depois o que corre entre elas. Vamos pro modelo de dados.

---

## AUTO-TESTE — Módulo 2

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** Diga as quatro etapas do MDM na ordem, e para cada uma diga qual camada de dados ela produz. Depois explique por que a ordem não pode ser trocada.

**2.** O que significa SIF, e qual problema concreto ele resolve? Explique o que mudaria no dia a dia da equipe se o SIF não existisse.

**3.** Qual a diferença de papel entre o IBM DataStage/QualityStage e o MD2 Quality Manager? Quem usa cada um, e para quê?

---
