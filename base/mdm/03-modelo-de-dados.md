# Módulo 3 — Modelo de Dados do HUB MDM

> **Tempo estimado de leitura em voz alta:** ~21 minutos (≈3.145 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 47 a 60

---

## ABERTURA

Módulo 3: Modelo de Dados do HUB MDM.

Esse é o módulo das siglas. É aqui que STG, BIP, BUP, BCR, BQA, CTR e WDR deixam de ser letras soltas e viram lugares concretos com endereço e função.

E por que ele importa tanto no pipeline? Porque **modelo de dados é o vocabulário compartilhado do resto do treinamento.** Do Módulo 4 em diante, todo mundo vai falar "carrega a STG", "critica e joga na BQA", "faz o match contra a BUP". Se eu não souber o que é cada uma dessas caixas, os próximos cinco módulos viram ruído.

Tem outra razão, mais profunda. No MDM, as camadas **não são só armazenamento — elas são o registro do estado do dado.** O mesmo cadastro da Maria existe simultaneamente na STG (como o legado tinha), na BIP (limpo) e na BUP (unificado com os outros). Três versões, três verdades diferentes, e todas as três são úteis. Entender isso é entender o produto.

---

## PARTE 1 — O que é modelagem de dados

A apostila começa com uma provocação que eu gosto:

**"Os dados não existem no vácuo; entender a natureza relacional dos dados é a chave para entender seu valor."**

E dá dois exemplos pra provar isso:

- De que serviriam os **IDs** — Identifications, ou seja, os códigos — do cliente para uma equipe de produto, se esses IDs não coincidissem com os produtos específicos que os clientes compraram?
- Ou como uma equipe de marketing conduziria uma análise de preços sem ser capaz de saber os dados que conectam pontos de preço a determinados produtos?

O ponto é: **o valor do dado está na ligação, não no dado isolado.** Isso ecoa a analogia do quebra-cabeça do Módulo 1.

E as definições que a apostila dá:

**"Modelagem de dados é como criar um mapa ou um plano para organizar e guardar informações de forma que sejam fáceis de encontrar e usar."**

**"Modelagem de dados é a prática de organizar e estruturar informações de forma lógica e eficiente, para que possam ser facilmente acessadas, gerenciadas e utilizadas."**

E uma terceira, mais formal:

**"Representação detalhada dos requisitos de dados e das regras de negócio que regem esses dados, usualmente em suporte a um contexto específico de uso — requisitos de aplicações."**

Essa terceira tem uma palavra importante: **regras de negócio**. O modelo não é neutro. Se eu modelo "uma pessoa tem UM endereço", eu estou embutindo uma regra de negócio na estrutura. Se eu modelo "uma pessoa tem VÁRIOS endereços", é outra regra. O modelo decide o que é possível representar.

---

## PARTE 2 — Padrão de nomenclatura: as regras gerais

Agora a apostila entra em algo que parece burocrático mas não é: como nomear as coisas.

E eu quero explicar por que isso não é frescura antes de listar as regras. Num hub MDM você vai ter centenas de tabelas. Se o nome não seguir padrão, ninguém encontra nada, e pior: duas pessoas criam a mesma tabela com nomes diferentes. O padrão de nomenclatura é o que impede o modelo de virar lixo em dois anos.

As **regras gerais** da apostila:

**1. Nomes de entidades devem ser únicos.** Exemplo: `PEDIDO`. Sugestão da apostila: incluir qualificadores no nome da entidade.

**2. Nomes de entidades devem ter significado.** Exemplo: `CONTRATO`. Sugestão: usar substantivos simples sempre que possível.

**3. Deixe claro seu significado.** Exemplo: `CONTRATO_LOCACAO`. Sugestão: se necessário, acrescente um adjetivo.

Repara na progressão dos exemplos 2 e 3: `CONTRATO` é bom, mas se a empresa tem contrato de locação e contrato de venda, aí `CONTRATO` sozinho é ambíguo, e vira `CONTRATO_LOCACAO`.

**4. Padronize o formato.** Exemplo: `PEDIDO`, e não `Pedido`. Sugestão: usar sempre palavras em caixa alta.

**5. Evite uso de acentuação e caracteres especiais.** Sugestão: não utilizar acentuação ou recursos similares como cedilha (Ç), trema (¨) ou qualquer caractere que não esteja no alfabeto A a Z.

Isso não é preciosismo — é porque acentuação em nome de objeto de banco quebra em migração entre sistemas com codificação diferente. É a mesma classe de problema que faz `Higienização` virar `HigienizaÃ§Ã£o` num sistema mal configurado.

**6. Preencha os comentários das tabelas e colunas.** Sugestão: utilizar na definição dos comentários caixa baixa, e acentuar sempre que necessário.

E aqui tem uma inversão elegante que vale destacar: **o nome do objeto é sem acento e em caixa alta; o comentário é em caixa baixa e com acento.** O nome é pra máquina, o comentário é pra gente.

---

## PARTE 3 — Padrão de nomenclatura: as regras específicas

Agora as regras específicas, que são as que explicam a cara das tabelas do MDM:

**1. O nome da tabela deverá ser formado por uma sigla de um domínio, e de uma ou mais descrições que identificam claramente o seu conteúdo, usando o underscore para separar os termos que compõem o nome.**

**Essa é a regra que explica tudo.** É por isso que as tabelas se chamam `STG_PESSOA`, `BIP_TELEFONE`, `BUP_ENDERECO`. A primeira parte é a sigla do domínio — que aqui é a camada. A segunda parte é o assunto.

Então quando eu vir `BQA_PESSOA`, eu já sei ler: camada de Quality Assurance, assunto Pessoa. É a tabela dos problemas de qualidade de pessoas.

**2. O tamanho máximo deve ser 30 caracteres.**

Esse limite não é arbitrário — é uma herança do Oracle, que historicamente limitava identificadores a 30 caracteres. É por isso que a próxima regra existe:

**3. Evite utilizar abreviações; se necessário, utilize as conhecidas, ou consulte a área de administração de dados.**

Ou seja: abreviar é o último recurso, e quando abreviar, abrevie do jeito que todo mundo já abrevia.

[⚠️ CONFERIR NA APOSTILA: existe um slide chamado apenas "Padrão de Nomenclatura" logo depois dessas regras, sem nenhum texto — é provavelmente uma tabela com o dicionário de prefixos de coluna (COD_, NOM_, DAT_, STA_, SEQ_...). Esses prefixos aparecem nos módulos seguintes sem nunca terem sido definidos: `NOM_CIDADE`, `STA_SEXO`, `COD_CAMPO_PK_LEGADO_01`, `DAT_`, `SEQ_`. Vale muito conferir esse slide, porque decorar essa tabelinha faz o resto da apostila ficar legível.]

Como dedução — e eu marco que é dedução minha, não está escrito — o padrão parece ser: `SEQ_` para chave sequencial, `COD_` para código, `NOM_` para nome, `DAT_` para data, `STA_` para status ou situação.

---

## PARTE 4 — Características do modelo MDM

Antes das camadas, a apostila lista as características principais do modelo:

- **Solução madura**
- **Orientado a dados pessoais**
- **Aplicável a diferentes indústrias**
- **Gestão completa dos cadastros**
- **Controle das etapas de processamento**
- **Vários perfis de relacionamento**

Duas dessas merecem comentário.

**"Orientado a dados pessoais"** — isso é uma escolha de escopo. Esse MDM é de **pessoa**, não de produto, não de material. Toda a modelagem gira em torno de Pessoa e dos assuntos satélites dela: documento, endereço, telefone, contato eletrônico. Isso explica por que o matching do Módulo 6 é todo baseado em nome, CPF e data de nascimento.

**"Controle das etapas de processamento"** — isso é o que justifica a camada CTR que a gente vai ver daqui a pouco. O modelo não guarda só o dado; ele guarda **em que ponto do processo o dado está**.

---

## PARTE 5 — Como as tabelas são organizadas

Três regras estruturais que a apostila enuncia direto:

**Primeira: todas as tabelas pertencem a um único owner** — um único dono, um único schema — pra simplificar. E cada tabela pertence a um grupo bem definido, **que pode ser identificado pelo início do nome da tabela**: BIP, BUP, BQA, BCR e assim por diante.

**Segunda: as camadas do modelo contêm tabelas referentes a cada assunto tratado pela solução** — Pessoa, Endereço, Telefone, e assim por diante.

Então o modelo é uma **matriz**: camadas nas linhas, assuntos nas colunas. `STG_PESSOA`, `BIP_PESSOA`, `BUP_PESSOA` são a mesma Maria em três estágios de processamento. `BIP_PESSOA`, `BIP_ENDERECO`, `BIP_TELEFONE` são três assuntos no mesmo estágio.

**Terceira: as chaves primárias — as PKs — seguem o padrão de começar com o prefixo `SEQ_` seguido do nome da tabela.** Exemplo da apostila: `SEQ_BUP_PESSOA`.

Com uma exceção: **algumas tabelas, por serem complementares, detêm a mesma chave de outras.** O exemplo dado é `SEQ_STG_PESSOA` aparecendo dentro da tabela `STG_TRILHA_PESSOA`.

Isso é uma relação um-pra-um. A `STG_TRILHA_PESSOA` não tem vida própria — ela é um complemento da `STG_PESSOA`, guardando os dados de rastreabilidade. Por isso compartilha a chave.

---

## PARTE 6 — As quatro camadas core

Agora a parte central do módulo. A apostila diz: **no tocante à estrutura principal da solução MDM, temos 4 camadas core.**

E as apresenta com um rótulo curto cada uma:

> **STG — Espelho do Legado** | **BIP — Dado Qualificado** | **BUP — Dado Unificado**

E depois, com as trilhas:

> **TRILHA STAGING** → **BIP QUALIFICADA** → **TRILHA BIP_BUP** → **GOLDEN RECORD**

Vamos uma por uma.

### Camada 1 — Trilha Staging + Staging (STG)

Definição da apostila: **camada que garante a rastreabilidade dos dados mestres, respondendo perguntas sobre a origem do dado e a situação dos dados nos sistemas de origem.**

**STG vem de Staging**, que em inglês quer dizer "área de preparação", "palco de espera". É o vestiário: o dado chega, fica esperando, ainda com a roupa que veio de casa.

E a apostila é específica sobre como essa camada é modelada, e isso é a parte mais interessante:

**"Na camada de staging as tabelas foram modeladas pra equalizar estruturalmente os dados independente do sistema de origem. Observe que as colunas em sua maioria são varchar 255, pra aceitar qualquer coisa, pra não travar nenhum registro a nível de banco de dados, uma vez que não temos como prever qual informação virá."**

Isso é uma decisão de projeto deliberada e vale entender bem. `VARCHAR(255)` quer dizer: um campo de texto que aceita até 255 caracteres — qualquer coisa.

Por que fazer isso? Porque se eu declarasse a data de nascimento como tipo DATA, e o sistema legado mandasse a string "31/02/1985" ou "NAO INFORMADO", o banco **rejeitaria a linha inteira**. E aí eu perderia o registro antes mesmo de saber que ele existe.

O princípio é: **na entrada, não julgue. Aceite tudo, e julgue depois.** Se o CPF vier com letra, entra. Se a data vier maluca, entra. O julgamento acontece na próxima camada, e o registro problemático vira uma anotação na BQA em vez de virar um erro de carga às três da manhã.

E repara na palavra **"equalizar estruturalmente"**: o sistema A pode ter a coluna `NM_CLI`, o sistema B `NOME_CLIENTE`, o sistema C `DS_NOME`. Na STG, todos viram a mesma coluna. A estrutura é equalizada. **O conteúdo, não** — ele continua AS-IS, como estava no legado.

E a **Trilha Staging** é o complemento: é o que guarda de qual sistema, de qual tabela e de qual chave primária aquele registro veio.

### Camada 2 — BIP

Definição da apostila: **camada que armazena os dados resultantes das esteiras de qualificação — crítica, higienização, padronização e enriquecimento.**

Sobre a modelagem: **"Na camada BIP as tabelas foram especializadas, ou seja, uma tabela por assunto, e os Data Types bem definidos."**

Duas mudanças em relação à STG:

**Especialização.** Uma tabela da STG pode virar três da BIP. A apostila mostra exatamente isso num exemplo no Módulo 5.

**Data Types bem definidos.** Acabou o `VARCHAR(255)` pra tudo. Data é DATA, número é número. Porque agora o dado já foi validado — o que era "31/02/1985" foi tratado antes de chegar aqui.

Uma nota de vocabulário: a apostila usa "**esteira**" como sinônimo de pipeline, de linha de produção. "Esteira de qualificação", "esteira de unificação", "esteira de matching". É a metáfora da fábrica.

[⚠️ CONFERIR NA APOSTILA: a apostila **nunca expande as siglas BIP e BUP**. Ela dá os rótulos "Dado Qualificado" e "Dado Unificado", e no diagrama de arquitetura chama a BIP de "Camada Integrada e Referências" e a BUP de "Base Unificada". O "B" provavelmente é de "Base", mas as letras IP e UP não são explicadas em nenhum slide. Perguntar ao instrutor — é o tipo de coisa que ajuda a memorizar.]

### Camada 3 — Trilha BIP BUP

Definição da apostila: **camada que garante a rastreabilidade acerca da formação do Golden Record e a visão de suas vigências. Tem sua importância no entendimento de validade, vigência e associação do Golden Record aos registros que o formaram.**

Essa é a camada mais sutil das quatro, então deixa eu explicar com o exemplo da Maria.

Depois de tudo processado, existe **um** Golden Record da Maria na BUP. Mas ele foi formado a partir de **três** registros da BIP — o do Portal, o do Ponto de Vendas e o do CRM.

A Trilha BIP-BUP é a tabela que guarda essa ligação: "o Golden Record número 9001 foi formado pelos registros BIP 101, 102 e 103."

E o "vigências" da definição adiciona a dimensão tempo: essa ligação valeu de quando até quando. Porque isso muda. Se amanhã descobrirem que o registro 103 não era a Maria e for feito um split — que a gente vê no Módulo 6 —, a ligação antiga precisa continuar registrada.

Sem essa camada, o Golden Record seria uma caixa-preta: um registro bonito que ninguém sabe de onde veio.

### Camada 4 — BUP

Definição da apostila: **camada que armazena o dado resultante da esteira de unificação — Matching e Sobrevivência — o chamado Golden Record.**

E sobre a modelagem: **"Já a camada BUP é estruturalmente similar à BIP, porém o que varia é a visão unificada."**

Isso é importante e muita gente erra: **BIP e BUP têm praticamente a mesma estrutura de tabela.** A diferença não é o formato, é o **conteúdo semântico**. Na BIP, uma linha = um cadastro de um sistema, já limpo. Na BUP, uma linha = uma pessoa do mundo real.

Na BIP existem três Marias limpas. Na BUP existe uma Maria.

---

## PARTE 7 — As outras camadas importantes

A apostila continua: **outras camadas de grande importância no modelo MDM são...** e lista quatro. E ela dá os rótulos assim:

> **Base Corporativa de Referência** | **Base de Quality Assurance** | **Base de Quality Assurance** | **Workflow Data Rules**

(Sim, "Base de Quality Assurance" aparece duas vezes nesse rótulo — mas as quatro camadas descritas são BCR, BQA, CTR e WDR.)

### BCR — Base Corporativa de Referência

Definição da apostila: **camada que armazena os dados de referência, usados para padronização, crítica e enriquecimento dos dados mestres. Encontraremos domínios de dados padronizados com o intuito de prover "traduções" dos dados corporativos — Banco, Estado Civil, Tipo de Documento e assim por diante.**

Repara na palavra **"traduções"**, que a própria apostila coloca entre aspas. Esse é o conceito.

Exemplo concreto, que a apostila usa no Módulo 5: o campo sexo. No sistema A vem como 1 e 2. No sistema B vem como M e F. No sistema Z vem como MASC e FEM. A BCR é o dicionário que diz: 1 = M = MASC = Masculino. Todos apontam pro mesmo valor padronizado.

Outro exemplo: estado civil. "S", "1" e "Solteiro" são três representações do mesmo dado de referência. A BCR resolve isso.

E lembra do Módulo 1, dos três tipos de dado? **A BCR é onde mora o dado referencial.** Fecha o círculo.

### BQA — Base de Quality Assurance

Definição da apostila: **camada onde armazenam-se os dados resultantes da esteira de qualidade dos dados. Encontramos aqui registros invalidados, duvidosos oriundos da esteira de matching, e status referentes à qualificação que um determinado atributo recebeu.**

**Quality Assurance** quer dizer garantia da qualidade. Essa é a camada dos problemas.

E ela guarda três tipos de coisa — vale separar bem, porque são diferentes:

**Um: registros invalidados.** Vieram da higienização. "Esse CPF não passa na validação do dígito verificador." "Esse e-mail não tem arroba."

**Dois: registros duvidosos oriundos da esteira de matching.** Vieram da unificação. É o **CLERICAL** do Módulo 6: o motor não teve certeza se são a mesma pessoa. Nota intermediária.

**Três: status referentes à qualificação que um atributo recebeu.** Isso é mais fino: não é o registro inteiro que está errado, é o histórico de "esse campo aqui recebeu tal avaliação".

E o ponto que amarra tudo: **a BQA é a caixa de entrada do curador.** Tudo o que a máquina não conseguiu resolver sozinha cai ali, e vira trabalho humano no Quality Manager. Isso é o Módulo 8.

Agora você entende por que a BQA aparecia duas vezes no diagrama de arquitetura do Módulo 2: porque higienização e unificação alimentam ela por caminhos diferentes.

### CTR — Camada de Controle

Definição da apostila: **camada que armazena os dados que garantem a gestão e a orquestração das execuções de carga das esteiras MDM.**

**CTR é de Controle.** Ela não guarda dado de cliente nenhum. Ela guarda dado sobre **a execução do processo**.

Exemplos concretos que aparecem no Módulo 4: a tabela `CTR_EXECUCAO_PROCESSO`, que guarda estatísticas de tempo de execução. E o indicador `STA_LOTE_ABERTO_FECHADO`, que diz se a carga de um sistema terminou bem ou falhou.

Por que isso é uma camada de primeira classe? Porque MDM roda todo dia, com dezenas de sistemas. Se um falha, eu preciso saber **qual**, **quando**, e **de onde retomar**. Sem CTR, uma falha às três da manhã vira um dia inteiro de investigação. Com CTR, o próximo ciclo já sabe reprocessar o período que faltou.

Isso conecta com a característica "controle das etapas de processamento" que a apostila listou lá atrás.

### WDR — Workflow Data Rules

Definição da apostila: **camada que armazena os dados resultantes das esteiras automatizadas de enquadramento e ranqueamento. Encontramos aqui dados referentes aos tratamentos formalizados no MD2 Quality Manager e enquadramentos que justificam o tratamento das bases de dados, e ranking de assuntos MDM.**

**WDR significa Workflow Data Rules** — regras de dados de fluxo de trabalho.

Essa é a camada de **LGPD**. E ela é diferente de todas as outras num aspecto fundamental: **as outras camadas guardam o dado; a WDR guarda a justificativa legal pra eu ter aquele dado.**

Exemplo concreto: eu tenho o telefone da Maria. Por quê? Porque ela consentiu quando assinou o contrato? Porque é necessário pra execução do contrato? Porque é obrigação legal? Cada uma dessas é uma **hipótese legal** da LGPD, e o **enquadramento** é o ato de dizer qual hipótese cobre qual tratamento.

E o fluxo é: o jurídico formaliza o enquadramento no Quality Manager (na tela), e o processo automatizado do MDM lê isso e associa às bases de dados reais.

O **"ranking de assuntos MDM"** que aparece na definição é a parte menos clara:

[⚠️ CONFERIR NA APOSTILA: a apostila menciona "esteiras automatizadas de enquadramento **e ranqueamento**" e "ranking de assuntos MDM" na definição da WDR, mas **não explica em nenhum lugar** o que é esse ranqueamento nem o que está sendo ranqueado. Enquadramento é detalhado no Módulo 6; ranqueamento não é retomado em nenhum momento. Perguntar ao instrutor.]

---

## PARTE 8 — O quadro completo

Deixa eu consolidar tudo num mapa único, que é o que eu quero conseguir desenhar de cabeça:

| Sigla | Nome | O que guarda | Quando é populada |
|---|---|---|---|
| **STG** | Staging | Espelho AS-IS do legado, tudo VARCHAR(255) | Ingestão (Mód. 4) |
| **STG TRILHA** | Trilha de Staging | Origem: sistema, tabela, chave primária do legado | Ingestão (Mód. 4) |
| **HIST** | Histórico | Versões anteriores dos registros | Ingestão (Mód. 4) |
| **BIP** | Dado Qualificado | Dado padronizado, validado, enriquecido, tipado | Higienização (Mód. 5) |
| **BCR** | Base Corporativa de Referência | Domínios padronizados, as "traduções" | Alimentada por curadoria |
| **BQA** | Base de Quality Assurance | Inválidos, duvidosos (CLERICAL), status de qualificação | Higienização (Mód. 5) e Unificação (Mód. 6) |
| **TRILHA BIP-BUP** | Trilha de unificação | Quais registros BIP formaram qual Golden Record, e vigências | Unificação (Mód. 6) |
| **BUP** | Dado Unificado | O **Golden Record** | Unificação (Mód. 6) + Sobrevivência (Mód. 7) |
| **BHH** | ⚠️ não definida na apostila | provavelmente Household — base unificada de endereços | Unificação |
| **CTR** | Controle | Orquestração e estatísticas de execução das cargas | Todas as etapas |
| **WDR** | Workflow Data Rules | Enquadramento legal LGPD e ranqueamento | Pós-carga (Mód. 6) |

E o caminho de um registro da Maria: entra pelo **SIF** → vira linha na **STG** com rastro na **STG TRILHA** → é limpo e vira linha na **BIP**, consultando a **BCR** e reportando problemas na **BQA** → é comparado com as outras Marias, e a ligação fica na **TRILHA BIP-BUP**, com as dúvidas na **BQA** → vira **um** Golden Record na **BUP**.

---

## TRANSIÇÃO PRO MÓDULO 4

Pronto. Agora eu tenho as caixas nomeadas e sei o que vai dentro de cada uma.

E aí a pergunta natural é: **como é que o dado entra na primeira caixa?**

Porque tem uma dependência dura aqui: **nada acontece no MDM enquanto a STG estiver vazia.** Não tem o que higienizar sem STG. Não tem o que unificar sem BIP. Todo o pipeline é uma cascata, e a primeira pedra é a ingestão.

Então o Módulo 4 — Camada de Ingestão — responde: de onde vêm os dados, em que formato eles precisam chegar (e aí o SIF do Módulo 2 volta com todos os detalhes), como o dono do sistema de origem participa disso, e o que acontece quando dá errado no meio da carga.

E repara que a ingestão é o único módulo onde alguém **de fora do time de MDM** tem trabalho a fazer. É o único ponto de contato obrigatório com as áreas donas dos sistemas legados. Por isso ele é o módulo mais político dos oito.

Vamos abrir a porta de entrada do hub.

---

## AUTO-TESTE — Módulo 3

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** Explique por que as colunas da STG são quase todas VARCHAR(255) enquanto as da BIP têm tipos bem definidos. O que aconteceria se a STG fosse tipada corretamente desde o começo?

**2.** Diga o que significa cada sigla e o que ela guarda: STG, BIP, BUP, BCR, BQA, CTR, WDR. Para BCR e BQA, dê um exemplo concreto de conteúdo.

**3.** A camada Trilha BIP-BUP não guarda dado de cliente nenhum — ela só guarda ligações. Explique que pergunta ela responde, e por que o Golden Record perderia valor sem ela.

---
