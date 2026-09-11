# Módulo 5 — Processos de Higienização

> **Tempo estimado de leitura em voz alta:** ~20 minutos (≈2.945 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 90 a 109
> **Nota:** a agenda chama esse módulo de "Processos de Higienização"; os slides internos usam o título completo "Processos de padronização e higienização". É o mesmo módulo.

---

## ABERTURA

Módulo 5: Processos de Higienização.

Esse é o módulo da lavanderia. É onde a STG vira BIP.

E ele importa porque **ele é pré-requisito duro da unificação**. Eu não consigo descobrir que "MARIA C. FIGUEIRA" e "Maria Castilho Figueira" são a mesma pessoa se elas continuarem escritas desse jeito. Comparar texto sujo com texto sujo não dá resultado. Então antes de comparar, eu preciso deixar todo mundo no mesmo formato.

Tem uma frase que resume o módulo inteiro e vale guardar: **higienização não é embelezamento, é pré-condição.** A base fica mais bonita, sim — mas o objetivo real é tornar a comparação possível.

E uma observação sobre o nome do módulo: a agenda diz "higienização", mas os slides dizem "padronização **e** higienização". Isso não é descuido — são atividades distintas que acontecem juntas, e vale separar bem na cabeça.

---

## PARTE 1 — O que é a camada BIP

A definição que a apostila dá:

**"Camada intermediária, entre a STAGING e a BUP (base unificada). Nessa camada os dados são PADRONIZADOS, VALIDADOS e possivelmente ENRIQUECIDOS com as bases de referências."**

Três verbos, em caixa alta na própria apostila. E o "possivelmente" do terceiro é importante — nem todo dado é enriquecido, mas todo dado é padronizado e validado.

Vou definir os três agora, porque eles são o esqueleto do módulo:

**Padronizar** é colocar no mesmo formato. Não estou dizendo se está certo ou errado — só estou deixando igual. "Rua", "R.", "RUA" viram tudo "RUA".

**Validar** — que a apostila também chama de **criticar** — é julgar se o dado é aceitável. O CPF passa no cálculo do dígito verificador? O e-mail tem arroba? A data de nascimento é de alguém com 340 anos?

**Enriquecer** é adicionar informação que não veio. O registro tem CEP mas não tem cidade — eu descubro a cidade pelo CEP e preencho.

Repara na ordem: padronizar vem antes de validar. Faz sentido — eu não consigo validar um CPF que veio como "111.222.333-44" sem antes tirar os pontos e o traço.

---

## PARTE 2 — O fluxo da carga da BIP

A apostila descreve o processo:

**"Durante o processo de carga da BIP os dados são extraídos da STAGING, onde estão no formato AS-IS, são então padronizados, validados e enriquecidos. A modelagem da BIP também difere da modelagem da staging por conta das especializações. No exemplo abaixo temos 3 tabelas derivadas de uma única tabela da STAGING."**

Esse detalhe da **especialização** é o que o Módulo 3 antecipou: uma tabela da STG pode virar três da BIP.

Deixa eu dar um exemplo plausível de por que isso acontece. Imagina que na STG existe uma única `STG_PESSOA` com tudo dentro — inclusive campos que na verdade descrevem coisas diferentes: dados da pessoa, dados de qualificação dela, dados de perfil. Na BIP, isso se separa em tabelas especializadas, cada uma com seus tipos corretos.

[⚠️ CONFERIR NA APOSTILA: o exemplo das "3 tabelas derivadas de uma única tabela da STAGING" é uma imagem sem texto extraível. Quais são as três tabelas concretamente, e qual o critério de separação, só dá pra ver no slide. Vale anotar, porque é o exemplo canônico de especialização.]

E depois a apostila descreve o fluxo completo, passo a passo. Esse trecho é a espinha dorsal do módulo:

**"Representação do fluxo da BIP. Como origem da informação temos a STAGING. Em seguida podemos ter alguma BCR de tradução de domínio para a equalização — como por exemplo sexo, que no sistema A pode ser (1 e 2), no sistema B pode ser (M e F) e no sistema Z pode ser (MASC e FEM). Adiante temos as etapas de padronização e validação, que detalharemos adiante. Temos ainda a parte de enriquecimento junto às bases externas, e para concluir a carga da tabela do modelo BIP."**

Então o fluxo, em ordem, é:

1. **Lê da STAGING**
2. **Traduz domínios usando a BCR**
3. **Padroniza**
4. **Valida (critica)**
5. **Enriquece com bases externas**
6. **Grava na BIP**

Guarda essa sequência. Ela é a resposta pra "o que acontece entre STG e BIP".

---

## PARTE 3 — Tradução de domínios e a BCR

O primeiro passo depois da leitura é a tradução de domínios. A apostila:

**"Uma etapa importante da padronização dos dados é a tradução de domínios, que contempla a associação dos dados de referência (Ex.: Estado Civil, Tipo de Telefone) verificados nas origens de dados — e por consequência armazenados na camada staging — com os dados padronizados armazenados na camada BCR."**

**"Dessa forma garantimos que não existirão diversas visões de domínio para um mesmo dado de referência (Ex.: S, 1 e Solteiro representando o mesmo dado de referência para Estado Civil)."**

**"Essa etapa pode ser realizada por meio do MD2 Quality Manager."**

Lembrando: **BCR é Base Corporativa de Referência**, a camada do Módulo 3 que guarda as "traduções".

O exemplo do sexo é o mais didático, então vou desenvolver:

| Sistema de origem | Como vem | Vira na BIP |
|---|---|---|
| Sistema A (Portal) | `1` | `M` |
| Sistema A (Portal) | `2` | `F` |
| Sistema B (PDV) | `M` | `M` |
| Sistema B (PDV) | `F` | `F` |
| Sistema Z (CRM) | `MASC` | `M` |
| Sistema Z (CRM) | `FEM` | `F` |

Lembra do exemplo da Maria no Módulo 1? No Portal ela é "Sexo: Feminino". No CRM ela é "Sexo: 2". No registro do João é "Sexo: M". Três representações. A BCR é o que resolve isso.

E o mesmo vale pra estado civil: "S", "1" e "Solteiro" todos apontam pro mesmo valor padronizado.

Agora, um ponto que eu acho o mais relevante dessa parte: **"essa etapa pode ser realizada por meio do MD2 Quality Manager."**

Isso significa que **as traduções são mantidas por gente, não por programador.** Quando entra um sistema novo que codifica sexo como "H" e "M" (homem/mulher), alguém do time de dados abre o Quality Manager e cadastra essa tradução. Não precisa de deploy, não precisa de release.

Isso é governança na prática: a regra de negócio mora numa tabela editável, não dentro do código.

---

## PARTE 4 — Padronização e o catálogo de regras

Sobre padronização, a apostila conecta com o Information Governance Catalog:

**"Por meio do Governance Catalog temos acesso às regras de padronização que foram aplicadas e documentadas."**

Como eu falei no Módulo 2: o **IGC (IBM Information Governance Catalog)** é onde as regras ficam **documentadas**, não onde elas rodam. É o livro de receitas, não a cozinha.

E por que isso importa? Porque quando alguém do negócio perguntar "por que o nome da minha cliente virou MARIA CASTILHO FIGUEIRA em vez de Maria Castilho Figueira?", a resposta não pode ser "sei lá, o sistema fez". Tem que existir uma regra documentada, com nome e descrição, que alguém possa consultar.

Isso é **auditabilidade da transformação**. Sem isso, o MDM vira caixa-preta e o negócio para de confiar.

---

## PARTE 5 — Crítica e a BQA

Agora a validação. A apostila:

**"A depender do campo e da necessidade da informação, a crítica pode resultar desde um alerta até a invalidação do registro, armazenados então na camada BQA."**

Essa frase é curta mas tem muito dentro. Três coisas:

**Primeira: o resultado da crítica é graduado.** Não é binário "passou/não passou". Pode ser um **alerta** — o dado é suspeito mas segue o fluxo. Ou pode ser uma **invalidação** — o dado não é aceito.

**Segunda: a gradação depende do campo.** "A depender do campo e da necessidade da informação." Ou seja, a mesma severidade não se aplica a tudo.

Exemplo concreto pra fixar: se o **CPF** estiver inválido, isso é grave — o CPF é chave de identidade, e sem ele o matching fica muito mais fraco. Provavelmente invalida. Mas se o **complemento do endereço** estiver estranho, isso é um alerta — não vale a pena parar o registro por causa disso.

**Terceira: o resultado vai pra BQA.** E aqui a BQA do Módulo 3 fica concreta. Ela não é uma lixeira — é uma **fila de trabalho**. Cada linha ali é uma pendência que alguém vai olhar no Quality Manager (Módulo 8).

E é importante entender o que **não** acontece: o registro inválido **não é descartado**. Ele fica marcado. Porque descartar seria perder informação e, pior, seria esconder o problema. O MDM prefere registrar "esse CPF está inválido" e deixar visível.

---

## PARTE 6 — Como isso é construído: jobs, containers e Standardize Rules

Agora a parte de implementação. Três blocos.

### Onde ficam os jobs

**"Assim como os JOBs da camada STAGING, os JOBs da camada BIP estão agrupados por assunto. Porém, como possui uma convergência muito grande com a BUP, os mesmos ficaram juntos. Local: `Jobs\MDM\04_BIP_BUP`"**

Repara: BIP e BUP compartilham a mesma pasta. Isso não é desorganização — é reflexo do que o Módulo 3 disse, que "a camada BUP é estruturalmente similar à BIP". Os processos são parecidos e conversam muito, então ficaram juntos.

Compare com a pasta da ingestão: `Jobs\MDM\03_STG\Generico\`. Repara na numeração — 03 pra STG, 04 pra BIP_BUP. As pastas seguem a ordem do pipeline.

### Containers

**"Exemplo de um job da BIP com a utilização de um container. Utilizamos containers para aproveitar e otimizar o tempo quando mais de um processo necessita fazer a mesma operação. Nesse caso não precisaremos duplicar os códigos nem o esforço em uma possível manutenção."**

**Container**, no DataStage, é um pedaço de job encapsulado que pode ser reutilizado em vários jobs. É o equivalente a uma função ou um módulo em programação.

Por que isso existe aqui? Exemplo: a regra de padronização de nome de pessoa é a mesma pra `BIP_PESSOA`, pra `BIP_SOCIO` e pra `BIP_FUNCIONARIO`. Em vez de desenhar a mesma coisa três vezes, você desenha um container e chama nos três. Se a regra mudar, você muda num lugar só.

E aí vem a contrapartida honesta, que eu acho ótimo a apostila admitir:

**"Apenas observando um JOB já podemos identificar os objetivos do mesmo por conta dos estágios utilizados. Porém, com um container isso não é possível — somente acessando o container descobrimos de fato o que o mesmo faz. Observe a complexidade do container apresentado anteriormente."**

Esse é o trade-off clássico do encapsulamento: **você ganha reuso e perde transparência.** O job fica limpo na tela, mas você não consegue mais entender o que ele faz só de olhar. Precisa abrir a caixa.

Isso é uma dica prática de manutenção: quando for investigar um problema de padronização, **não confie no desenho do job**. Abra o container.

[⚠️ CONFERIR NA APOSTILA: os slides de exemplo de job e de container são screenshots. A apostila diz "observe a complexidade do container apresentado anteriormente" — vale mesmo olhar essa imagem pra calibrar a expectativa de quanta lógica está escondida ali.]

### Standardize Rules

**"Além de utilizar o estágio Transformer para aplicar regras de crítica e padronização, também encapsulamos regras em componentes chamados Standardize Rules, que são aplicados aos JOBs utilizando o estágio Standardize."**

Duas ferramentas diferentes, e vale separar:

**Transformer** é o estágio genérico do DataStage. Nele você escreve expressão, condição, cálculo. É código, basicamente. Serve pra qualquer transformação.

**Standardize** é um estágio específico do **QualityStage** — lembra, o irmão especializado em qualidade. E ele usa **Standardize Rules**, que são conjuntos de regras já prontas pra tipos específicos de dado.

Por que existem regras prontas? Porque padronizar nome de pessoa é **muito** mais difícil do que parece. Pensa em tudo que o QualityStage precisa saber pra processar "DR MARIA CASTILHO F DE ALMEIDA JUNIOR":

- "DR" é um título, não parte do nome
- "MARIA" é primeiro nome, e é nome tipicamente feminino
- "CASTILHO" é sobrenome
- "F" é uma inicial
- "DE" é uma partícula de ligação, não um sobrenome
- "ALMEIDA" é sobrenome
- "JUNIOR" é sufixo geracional

Isso exige dicionários de nomes, listas de partículas, listas de títulos, listas de sufixos. Ninguém escreve isso do zero — vem pronto no produto e é adaptado ao país.

E isso conecta com o que a apostila prometeu no Módulo 2: **"banco de regras prontas para padronização e enriquecimento de dados cadastrais de pessoas e produtos. Aumento na produtividade e redução do prazo e custo de projeto."**

---

## PARTE 7 — Enriquecimento: as três técnicas

Agora a terceira atividade. A apostila é bem estruturada aqui:

**"Para realizar o enriquecimento fazemos uso de três técnicas: enriquecimento implícito; enriquecimento com bases internas; enriquecimento com bases externas (necessário contratação por parte do cliente junto ao provedor)."**

Vamos uma por uma.

### Técnica 1 — Enriquecimento implícito

É deduzir informação a partir do que **já está no próprio registro**. Não consulta nada de fora.

O exemplo da apostila:

**"Se o campo `STA_SEXO` não estiver preenchido, utilizar o campo `GenderCode` gerado na padronização do nome."**

Isso é lindo e vale explicar bem. Lembra da Standardize Rule que processa nome de pessoa? Além de separar as partes do nome, ela também gera um `GenderCode` — um palpite de gênero baseado no primeiro nome. "MARIA" é um nome tipicamente feminino; a regra devolve feminino.

Então se o cadastro da Maria no Ponto de Vendas não tem o campo sexo preenchido, o MDM preenche sozinho, deduzindo de "MARIA".

E repara na condição: **"se o campo não estiver preenchido"**. O enriquecimento implícito **não sobrescreve** dado existente. Ele só preenche buraco. Se o sistema informou o sexo, o informado ganha do deduzido.

Isso é uma regra de ouro: **dado informado vale mais que dado deduzido.**

E é "implícito" porque a informação já estava lá, implícita no nome — só ninguém tinha extraído.

### Técnica 2 — Enriquecimento com bases internas

A apostila cita a técnica mas não dá exemplo dela.

[⚠️ CONFERIR NA APOSTILA: a apostila lista "enriquecimento com bases internas" como uma das três técnicas, mas **dá exemplos apenas das outras duas** — implícito e externo. O que conta como "base interna" não é explicado. Minha leitura é que seriam as próprias tabelas do hub (BCR, ou até a BUP de cargas anteriores), mas isso é dedução. Perguntar ao instrutor por um exemplo concreto.]

### Técnica 3 — Enriquecimento com bases externas

Essa é a que a apostila detalha, e ela deixa claro que **é necessária contratação por parte do cliente junto ao provedor.** Ou seja: custa dinheiro e não vem no pacote.

Os exemplos:

**"Se o campo `NOM_CIDADE` não estiver preenchido, recuperar a cidade pelo intervalo de CEP usando as tabelas do DNE."**

**"Quando os campos DDD e Telefone estiverem preenchidos, e for de alguma região brasileira, preencher automaticamente com o DDI do Brasil (55)."**

Vamos às siglas.

**DNE é o Diretório Nacional de Endereços**, dos Correios. É a base oficial de CEPs — quais existem, a que logradouro pertencem, em que bairro, cidade e estado. É como o MDM pega o CEP da Maria e descobre que ela mora em Brasília, DF.

Repara na expressão **"intervalo de CEP"**. O DNE não lista CEP por CEP em todos os casos — em muitos lugares ele define faixas. "Do CEP tal ao CEP tal, é a cidade X." Por isso a busca é por intervalo.

**DDI** é o código de discagem internacional. O do Brasil é 55. E **DDD** é o código de área — 11 pra São Paulo, 61 pra Brasília.

Esse exemplo do DDI é mais esperto do que parece. Ele é **enriquecimento condicional**: só preenche 55 se o DDD for de região brasileira. Porque se o telefone for de outro país, botar 55 estaria errado. É a mesma lógica do "não sobrescreve e não chuta".

E a apostila também menciona o tratamento de telefones com **base Anatel** — a agência de telecomunicações — que valida se a faixa de número existe e a que operadora pertence.

E tem um detalhe de arquitetura no fim:

**"Além dessas regras, também permitimos por meio do modelo o armazenamento de dados para enriquecimento de outras bases externas, onde a partir do momento em que tais estruturas estejam populadas, o processo já os utiliza automaticamente para enriquecimento."**

Traduzindo: o modelo tem lugar reservado pra bases externas que ainda não foram contratadas. Se amanhã o cliente contratar um provedor de dados de renda, ou de score de crédito, a estrutura já existe — basta popular e o processo passa a usar. **Sem alterar código.**

Isso é o mesmo princípio do SIF do Módulo 4: extensibilidade por configuração, não por desenvolvimento. É um padrão que se repete na solução toda.

---

## PARTE 8 — Os exemplos de regras

A apostila fecha com quatro slides de exemplos concretos de regras:

- **Nome Pessoa Física**
- **Nome Pessoa Física (Crítica)**
- **Telefone**
- **E-mail**

[⚠️ CONFERIR NA APOSTILA: esses quatro slides são **só título, sem nenhum texto extraível** — são tabelas ou imagens com as regras concretas. Eles são provavelmente o conteúdo mais prático do módulo inteiro, porque mostram as regras reais aplicadas. É obrigatório olhar esses quatro slides. Repare especialmente na distinção entre o slide "Nome Pessoa Física" e "Nome Pessoa Física (Crítica)" — o primeiro deve ser padronização, o segundo validação. São as duas atividades separadas no mesmo assunto.]

O fato de existir um slide de padronização e outro de crítica pro mesmo assunto (nome de pessoa física) reforça o ponto de abertura: **padronizar e validar são coisas diferentes**, aplicadas ao mesmo campo.

---

## PARTE 9 — O que fica populado ao fim

A apostila fecha o ciclo, do mesmo jeito que fez no Módulo 4:

**"Ao fim do processo de higienização teremos as camadas BIP e BQA populadas."**

Duas camadas, e a distinção é elegante:

- **BIP** = o que deu certo. O dado limpo, padronizado, validado, enriquecido e tipado.
- **BQA** = o que deu problema. Os inválidos, os alertas, os status de qualificação.

E repara que **o mesmo registro pode alimentar as duas**. A Maria pode ter o nome padronizado perfeitamente (vai pra BIP) e o CPF invalidado (gera anotação na BQA). Não é ou-um-ou-outro.

Comparando com o fim do Módulo 4, que populava STG, STG TRILHA e STG HISTÓRICO — o padrão é o mesmo: **cada etapa do pipeline popula suas camadas de resultado e suas camadas de controle/exceção.**

---

## TRANSIÇÃO PRO MÓDULO 6

Então, onde eu estou agora?

A BIP está populada. E agora a Maria está assim:

- No registro que veio do Portal: `MARIA CASTILHO FIGUEIRA`, sexo `F`, CPF `11344567801`, CEP e cidade preenchidos pelo DNE.
- No registro que veio do PDV: `MARIA FIGUEIRA`, sexo `F` (deduzido pelo GenderCode, porque não tinha).
- No registro que veio do CRM: `MARIA C FIGUEIRA`, sexo `F` (traduzido de "2" pela BCR), CPF `11344568701`.

Todos limpos. Todos no mesmo formato. Todos comparáveis.

**Mas ainda são três registros.** A base continua tendo três Marias.

E aqui está a dependência lógica que abre o próximo módulo: **é só depois que os dados estão limpos e padronizados na BIP que a gente consegue fazer o próximo passo, que é comparar registro com registro e decidir quem é quem.** Sem a higienização, essa comparação seria inútil — "MARIA C. FIGUEIRA" nunca bateria com "Maria Castilho Figueira".

Agora ela é possível. Não é fácil — repara que os dois CPFs limpos ainda são diferentes por causa dos dígitos trocados, e o nome do PDV está mais curto que os outros. Mas agora é possível.

O Módulo 6 — Processos de Unificação — é onde isso acontece. É onde o motor de matching compara todo mundo com todo mundo, dá nota, e decide: mesma pessoa, pessoa diferente, ou dúvida.

É o módulo mais denso dos oito. Respira antes.

---

## AUTO-TESTE — Módulo 5

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** Diga o fluxo completo da carga da BIP, em ordem, da STAGING até a gravação. Onde exatamente a BCR entra, e o que ela faz? Dê o exemplo do campo sexo.

**2.** Descreva as três técnicas de enriquecimento. Para a implícita e a externa, dê o exemplo concreto da apostila. E responda: se o sistema de origem já informou o sexo, o enriquecimento implícito sobrescreve? Por quê?

**3.** Qual a diferença entre padronizar, validar e enriquecer? E o que acontece com um registro cujo CPF foi invalidado na crítica — ele é descartado?

---
