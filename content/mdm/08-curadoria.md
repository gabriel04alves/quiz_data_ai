# Módulo 8 — Gestão de Dados Mestres e Curadoria

> **Tempo estimado de leitura em voz alta:** ~20 minutos (≈2.855 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 151 a 180
> **Nota:** este módulo tem 30 slides, mas a maioria é **screenshot de tela do MD2 Quality Manager sem texto**. O conteúdo textual está concentrado em três blocos: relacionamentos/hierarquias, tratamento de duvidosos e gestão de carga. O roteiro desenvolve os conceitos e marca com ⚠️ tudo que só existe como imagem.

---

## ABERTURA

Módulo 8: Gestão de Dados Mestres e Curadoria.

Esse é o último módulo, e ele é o que fecha o ciclo — literalmente, porque o que sai daqui volta pro começo do pipeline.

E ele importa por uma razão que eu quero deixar bem clara logo de cara: **os sete módulos anteriores descreveram uma máquina, e essa máquina não é suficiente sozinha.**

Não é crítica ao produto — é a natureza do problema. O motor de matching não consegue decidir o caso dos gêmeos Marcus e Marcos. A crítica de CPF não consegue adivinhar o dígito certo. O enquadramento legal não consegue escolher a hipótese jurídica. Essas decisões são humanas, e sempre serão.

Então **curadoria não é o conserto do que a máquina errou. Curadoria é a parte do processo que sempre foi humana.**

E se ninguém fizer curadoria? O MDM não quebra — ele apodrece devagar. Os clericals se acumulam na BQA. Os inválidos se acumulam. Sistemas novos entram com domínios não traduzidos. E em dois anos, a "visão única do cliente" não é confiável, e o negócio volta a usar as planilhas de sempre.

Por isso esse módulo importa: **ele é o que mantém o MDM vivo.**

---

## PARTE 1 — A ferramenta

A apostila abre direto:

**"A interface de curadoria da solução MD2 MDM é o MD2 Quality Manager, que detém todas as funcionalidades necessárias para esse intuito."**

O Quality Manager já apareceu em quase todos os módulos, sempre de raspão. Vale juntar tudo o que a gente já viu que ele faz, porque agora o quadro fecha:

- **Módulo 2:** plataforma pra gestão da qualidade integrada, conformidade LGPD, e interface de gestão e curadoria MDM.
- **Módulo 4:** CRUD de Golden Record — cadastrar, visualizar, editar e excluir dados de pessoas unificadas. E APIs pra aplicações externas.
- **Módulo 5:** manutenção das traduções de domínio da BCR.
- **Módulo 6:** formalização dos processos de tratamento e hipóteses legais da LGPD, que o WDR depois lê.
- **Módulo 8 (agora):** consulta 360, tratamento de duvidosos, tratamento de inválidos, relatórios e dashboards.

Lembra da divisão do Módulo 2? **DataStage/QualityStage é o motor; Quality Manager é a cara.** Agora dá pra ser mais preciso: o Quality Manager é a cara **e é também uma fonte de entrada** — porque o que o curador registra ali volta pro fluxo.

---

## PARTE 2 — Consulta de Pessoas e a Visão 360

A funcionalidade central é a **Consulta de Pessoas**. E dentro dela, a **Visão 360**.

"Visão 360" quer dizer: tudo o que se sabe sobre aquela pessoa, numa tela só. É o oposto do problema do Módulo 1, onde a Maria estava espalhada em quatro sistemas e ninguém via o conjunto.

A apostila mostra as abas dessa visão:

- **Visão 360** (duas telas)
- **Documentos**
- **Endereços**
- **Telefones**
- **Contatos Eletrônicos**
- **Relacionamentos**
- **Export**
- **Edição de Dados Golden Record**

Repara que essas abas são **exatamente os assuntos** do modelo de dados do Módulo 3 e as views do SIF do Módulo 4. Pessoa, documento, endereço, telefone, contato eletrônico. O modelo, a ingestão e a interface falam a mesma língua — o que é sinal de coerência arquitetural.

E lembra do Módulo 2, que citava "visão de rastreabilidade das origens" e "visão dos sistemas envolvidos"? É aqui que isso vive. O curador não vê só "o endereço da Maria é SQS 110" — ele vê **quais sistemas contribuíram** e o que cada um dizia.

[⚠️ CONFERIR NA APOSTILA: **todas** as telas de Consulta de Pessoas — Visão 360, Documentos, Endereços, Telefones, Contatos Eletrônicos, Export e Edição de Golden Record — são slides **só com título e screenshot**, sem uma linha de texto. Isso é cerca de 10 slides. O que cada tela mostra, quais colunas existem, se dá pra ver a origem de cada campo — tudo isso só existe na imagem. **É o bloco que mais exige olhar a apostila original.**]

---

## PARTE 3 — Relacionamentos

Esse é o primeiro bloco com texto substancial, e é conceito novo — não apareceu em nenhum módulo anterior com essa profundidade.

**"Relacionamento remete à ligação (profissional, familiar, localidade, ...). Identificar os inúmeros relacionamentos entre as pessoas é de extrema importância para qualquer corporação. Primeiro porque agrega informação ao dado; segundo porque pode trazer insight às equipes."**

E os exemplos que a apostila lista:

- **Relacionamento familiar** — pai, filho, irmã, avó...
- **Relacionamento profissional** — chefe, sócio, pares...
- **Relacionamento financeiro** — avalista, fiador, mutuário...
- **Relacionamento estudantil** — estudante, professor, diretor...

Vale parar nos dois motivos que a apostila dá, porque eles são diferentes.

**"Agrega informação ao dado"** — o relacionamento é um dado sobre a pessoa que não está nos campos dela. Saber que a Maria é sócia da empresa X não está no cadastro da Maria; está na ligação.

**"Pode trazer insight às equipes"** — e aqui estão os casos de uso reais. Análise de risco: se o avalista de um empréstimo é o próprio irmão do devedor, a garantia vale menos. Prevenção a fraude: se três pessoas com o mesmo endereço abriram conta no mesmo dia. Compliance: identificar pessoa politicamente exposta pela rede de relacionamentos.

E lembra do Módulo 4? Existiam três views específicas pra isso: `VIEW_RELACIONAMENTO`, `VIEW_FUNCIONARIO` e `VIEW_SOCIO` — todas com dependência dupla, exigindo `VIEW_PESSOA` **para as duas pessoas relacionadas**. Agora fica claro pra que serviam.

E tem um detalhe importante: um relacionamento só é confiável **depois da unificação**. Se a Maria está em três registros, o relacionamento dela com o João pode estar cadastrado em um só. Depois de unificada, o relacionamento vale pro Golden Record inteiro.

### House Holding

**"House Holding pode ser entendida como a base unificada de endereços. Seu objetivo é identificar e agrupar as pessoas que compartilham de um mesmo endereço e que podem ser interpretadas como um mesmo grupo familiar, colegas de trabalho, dentre outros."**

Lembra do Módulo 1? A palavra "Households" apareceu no diagrama dos tipos de Master Data, e eu disse pra guardar. E lembra da pergunta final do exemplo da Maria: **"mesmo grupo familiar?"** — o João Figueira com o mesmo sobrenome e o mesmo endereço.

**House Holding é a resposta a essa pergunta.**

E repara na definição: é uma **base unificada de endereços**. Ou seja, é um matching — mas de endereço, não de pessoa. Ele agrupa endereços que são o mesmo endereço escrito de jeitos diferentes ("SQS 110 A 610" e "110 SUL Bl A Ap 610"), e a partir daí descobre quem mora junto.

E repara na honestidade da apostila: **"podem ser interpretadas como um mesmo grupo familiar, colegas de trabalho, dentre outros."** Ela não afirma que é família — porque não dá pra saber. Mesmo endereço pode ser família, pode ser república de estudantes, pode ser um prédio comercial. O sistema entrega o agrupamento; a interpretação é do negócio.

Casos de uso: oferta de plano familiar, cálculo de renda do domicílio, detecção de endereço usado por muitas pessoas sem relação (indício de fraude).

E aqui, provavelmente, está a resposta pra sigla pendente:

[⚠️ CONFERIR NA APOSTILA: o diagrama de arquitetura do Módulo 2 cita a "Camada BUP e **BHH**". Este bloco de House Holding é a única coisa na apostila que explica o conceito, o que torna muito provável que **BHH = Base House Holding**. Mas a apostila **nunca faz essa ligação explicitamente** e nunca define a sigla. Confirmar com o instrutor.]

---

## PARTE 4 — Os três tipos de hierarquia

A apostila detalha três tipos de hierarquia. Esse trecho é bem conceitual, então vou explicar cada um com exemplo.

**Hierarquia Equilibrada**

**"Uma hierarquia equilibrada é aquela em que todos os caminhos da raiz até as folhas (os nós finais) têm o mesmo comprimento."**

Vocabulário: **raiz** é o topo, **folha** é a ponta que não tem ninguém abaixo, e **nó** é qualquer ponto da árvore.

Exemplo: uma estrutura de País → Estado → Cidade. Toda cidade está a exatamente três níveis da raiz. Nenhuma cidade está pendurada direto no país.

Isso é bom porque é previsível. Dá pra escrever consulta com número fixo de níveis.

**Hierarquia Desequilibrada**

**"Uma hierarquia desequilibrada ocorre quando os nós folha estão em diferentes níveis, o que significa que os caminhos da raiz até as folhas têm comprimentos variados."**

Exemplo: uma estrutura societária. O grupo tem uma holding; a holding tem uma controlada que tem outra controlada que tem outra; mas a holding também tem uma segunda controlada que não tem ninguém abaixo. Um ramo desce quatro níveis, o outro desce um.

Isso é o que acontece no mundo real quase sempre. A vida não é simétrica.

**Hierarquia Recursiva**

**"Os nós podem ter uma relação pai-filho com outros nós do mesmo conjunto. Isso permite que uma entidade esteja relacionada a outra de maneira sequencial ou recursiva. Um bom exemplo seria a estrutura de gerenciamento de funcionários dentro de uma empresa: um funcionário pode ser um superior (chefe) de outros funcionários, e esses funcionários podem ser chefes de outros, e assim por diante."**

Essa é a mais importante das três pro MDM, e vale entender por quê.

Nas duas primeiras, os níveis são **tipos diferentes** — país não é estado, estado não é cidade. Na recursiva, todo mundo é **da mesma natureza**: são todos funcionários, ou são todos pessoas.

E é exatamente esse o caso do MDM. A `VIEW_RELACIONAMENTO` do Módulo 4 liga **pessoa a pessoa**. O relacionamento familiar é pessoa-pessoa. O societário é pessoa-pessoa (ou empresa-empresa). Tudo recursivo.

E a consequência prática é que a profundidade é **desconhecida de antemão**. Você não sabe se a cadeia de chefia tem 3 ou 9 níveis. Não sabe se a rede societária tem 2 ou 15 camadas. Isso exige consulta recursiva no banco, e é o que torna esse tipo de análise custoso.

E é por isso que a apostila mostra um slide de **relacionamentos em grafos**. Grafo é a representação natural pra rede recursiva — pontos ligados por linhas, sem hierarquia rígida. É como você visualiza uma rede societária de verdade.

[⚠️ CONFERIR NA APOSTILA: os slides de "Consulta de Pessoas — Relacionamentos" e "Relacionamentos (Grafos)" são screenshots. A visualização em grafo é uma das funcionalidades mais vendáveis do produto, e como ela se parece só está na imagem. Conferir.]

---

## PARTE 5 — Enquadramento Legal na tela

A apostila mostra três telas:

- **Enquadramento Legal**
- **Enquadramento Legal — Tratamentos**
- **Enquadramento Legal — Compartilhamentos**

Isso é a contraparte visual do que o Módulo 6 explicou. Lá a gente viu o motor: a camada **WDR** lê o repositório do Quality Manager ao fim da carga diária. **Aqui é onde essa informação é digitada.**

**Tratamentos** são os processos que manipulam dados pessoais, cada um com sua hipótese legal — o que o Módulo 6 chamou de "processos de tratamento dos dados formalizados no MD2 QM".

**Compartilhamentos** é um conceito adicional que não apareceu no Módulo 6: com quem os dados são compartilhados. A LGPD exige que o titular saiba não só que você trata os dados dele, mas com quem você compartilha — parceiros, processadores, terceiros.

[⚠️ CONFERIR NA APOSTILA: as três telas de Enquadramento Legal são screenshots sem texto. E **"Compartilhamentos" aparece aqui pela primeira e única vez em toda a apostila** — o Módulo 6 fala de tratamentos e consentimento, mas não de compartilhamento. Conferir o que essa tela registra e como isso alimenta a WDR.]

---

## PARTE 6 — Tratamento de Duvidosos

Esse é o segundo bloco com texto real, e é a funcionalidade mais importante do módulo — porque é onde a fila do Módulo 6 é esvaziada.

**"Registros que passaram pelo processo de unificação (matching) e que ficaram em uma faixa de nota intermediária, onde não foi possível identificar automaticamente se o registro é duplicado ou não."**

**"Esses registros demandam análise manual para identificação da existência ou não de duplicidades. A curadoria desses casos é realizada via MD2 Quality Manager, na interface de Tratamento de Duvidosos, acessível em Governança MDM > Tratamento de Duvidosos."**

Isso é o **CLERICAL** do Módulo 6, agora com nome em português: **duvidoso**.

Vale reconstruir o caminho completo desse registro, porque ele atravessa três módulos:

1. **Módulo 6:** o matching compara dois registros e dá uma nota. A nota cai entre a nota de CLERICAL e a nota de MATCH.
2. **Módulo 6:** o registro é classificado como CLERICAL e gravado na **BQA** — exatamente o que o Módulo 3 descrevia como "duvidosos oriundos da esteira de matching".
3. **Módulo 8 (agora):** o curador abre `Governança MDM > Tratamento de Duvidosos`, vê os dois registros lado a lado, e decide.

E a decisão dele volta pro fluxo. Se ele diz "é a mesma pessoa", isso é um **merge**. Se ele diz "são pessoas diferentes", os registros seguem separados.

**Aqui o ciclo se fecha.** O Módulo 6 explicou split/merge como conceito e eu marquei que a apostila não dizia como o curador dispara a operação. Esta tela é, muito provavelmente, uma das portas — pelo menos pro merge.

[⚠️ CONFERIR NA APOSTILA: a apostila descreve o que é a tela de Tratamento de Duvidosos e onde ela fica no menu, mas o slide seguinte, que mostra a tela em si, **não tem texto**. Não está escrito quais são as ações disponíveis ao curador (confirmar duplicata / negar / adiar?), nem se a decisão dele é aplicada na hora ou na próxima carga, nem se ela vira uma regra permanente que impede o caso de voltar a ser duvidoso na próxima execução. **Essa última pergunta é importante:** se a decisão não for persistida, o mesmo caso reaparece toda carga. Perguntar ao instrutor.]

---

## PARTE 7 — Tratamento de Inválidos

**"Tratamento de Inválidos"** aparece como título de slide, sem texto.

Pelo que a gente sabe do Módulo 5, dá pra reconstruir o que é: são os registros que a **crítica** invalidou — CPF que não passa no dígito verificador, e-mail sem arroba, data de nascimento impossível. O Módulo 5 disse: *"a crítica pode resultar desde um alerta até a invalidação do registro, armazenados então na camada BQA."*

Então a BQA tem **duas filas de trabalho**, e as duas têm tela própria aqui:

| Fila | Origem | Tela de curadoria |
|---|---|---|
| **Duvidosos** | Matching (Mód. 6) — nota intermediária | Tratamento de Duvidosos |
| **Inválidos** | Crítica (Mód. 5) — falhou na validação | Tratamento de Inválidos |

Agora o diagrama do Módulo 2 fecha completamente: a BQA aparecia duas vezes, uma na higienização e uma na unificação, porque ela recebe dessas duas etapas — e cada uma vira uma fila de curadoria diferente.

[⚠️ CONFERIR NA APOSTILA: o slide "Tratamento de Inválidos" é **só título e imagem, sem nenhuma linha de texto** — diferente do de Duvidosos, que ao menos tem um parágrafo explicativo. Não há descrição do que o curador faz com um inválido: ele corrige o dado? Marca como aceito mesmo inválido? Devolve pro sistema de origem corrigir? Essa última seria a mais correta em termos de governança, mas não está escrito. Perguntar ao instrutor.]

---

## PARTE 8 — Relatórios e Dashboards

A apostila lista:

- **Relatórios MDM**
- **Dashboard Visão Geral**
- **Dashboard Duvidosos**
- **Dashboard Inválidos**
- **Dashboard Controle de Carga**

Repara na correspondência: existe um dashboard **por fila de trabalho**. Duvidosos tem tela de tratamento e dashboard. Inválidos, idem. E o Controle de Carga tem dashboard próprio.

E vale entender a diferença entre tela de tratamento e dashboard, porque são públicos diferentes:

**A tela de tratamento é operacional** — é onde o analista trabalha caso a caso. "Esses dois registros são a mesma pessoa?"

**O dashboard é gerencial** — é onde se vê a tendência. "A fila de duvidosos está crescendo ou diminuindo? Quantos entraram esta semana? Quantos foram resolvidos?"

E essa distinção é o que permite gerenciar a curadoria como processo, e não como esforço heroico. Se a fila cresce mais rápido do que é esvaziada, ou falta gente, ou as notas de corte precisam ser recalibradas.

E o **Dashboard Controle de Carga** é a visualização da camada **CTR** do Módulo 3 — a camada que guarda "a gestão e a orquestração das execuções de carga", com a tabela `CTR_EXECUCAO_PROCESSO` e o indicador `STA_LOTE_ABERTO_FECHADO` do Módulo 4. Aqui é onde isso vira gráfico.

[⚠️ CONFERIR NA APOSTILA: os cinco slides de relatórios e dashboards são **todos screenshots sem texto**. Quais indicadores cada dashboard mostra é informação que só existe na imagem — e é justamente o que você precisaria saber pra operar o MDM no dia a dia. Conferir e anotar os KPIs de cada um.]

---

## PARTE 9 — As ferramentas de operação da IBM

E a apostila fecha com duas ferramentas que não são da MD2, são da IBM — voltadas pra quem opera o ambiente, não pra quem cura os dados.

**"IBM DataStage/QualityStage Director — Gestão de Carga MDM. A plataforma IBM IIS contempla cliente para gerenciar a carga MDM, ou seja, verificar o correto funcionamento da solução."**

O **Director** é o cliente onde você vê os jobs rodando: quais estão em execução, quais terminaram, quais falharam, e os logs de cada um. É onde o suporte técnico vai quando a carga quebra às três da manhã.

**"Operations Console — Gestão do Ambiente IIS. A plataforma IBM IIS contempla uma ferramenta para gestão do ambiente onde a solução MD2 MDM é executada."**

O **Operations Console** é um nível acima: é a saúde do ambiente. Uso de CPU e memória, filas de execução, recursos do servidor.

Lembrando: **IIS** aqui é **IBM Information Server** — a suíte que a gente viu no Módulo 2. Não confundir com o servidor web da Microsoft, que usa a mesma sigla.

Vale notar a divisão de públicos que essa parte final revela. São **três perfis** operando a solução:

| Perfil | Ferramenta | Preocupação |
|---|---|---|
| **Curador de dados** | MD2 Quality Manager | O dado está correto? |
| **Operador / suporte** | DataStage Director | O job rodou? |
| **Administrador de ambiente** | Operations Console | O servidor está saudável? |

E os três precisam existir. Um MDM com curador e sem operador não sabe que a carga falhou. Com operador e sem curador, roda perfeitamente produzindo dados que ninguém validou.

---

## FECHAMENTO — O ciclo completo

E aqui termina o treinamento. Deixa eu fechar o círculo inteiro, em voz alta, porque é o melhor jeito de fixar:

**O problema** (Módulo 1): a Maria existe em quatro sistemas, escrita de quatro jeitos, e ninguém consegue responder "quantos clientes temos".

**A planta** (Módulo 2): quatro etapas — ingestão, tratamento, unificação, publicação — sobre IBM DataStage/QualityStage, com o Quality Manager por cima.

**As caixas** (Módulo 3): STG guarda o cru, BIP o limpo, BUP o unificado, BCR as traduções, BQA os problemas, CTR o controle, WDR o enquadramento legal.

**A porta de entrada** (Módulo 4): views no formato SIF, entregues pelo dono do sistema de origem, com campos de rastreabilidade que permitem voltar até a chave primária do legado.

**A lavanderia** (Módulo 5): padroniza, valida, enriquece. STG vira BIP. Os problemas vão pra BQA.

**A identificação** (Módulo 6): matching probabilístico em passos, com blocagem e notas de corte. Match, clerical ou residual. E split/merge pra corrigir o inevitável.

**A composição** (Módulo 7): SURVIVE monta o Golden Record campo a campo, na ordem das regras, do abrangente ao restritivo.

**A curadoria** (Módulo 8): o humano resolve o que a máquina não resolve — e o que ele decide **volta pro fluxo**.

E é esse "volta pro fluxo" que faz do MDM um ciclo e não uma linha reta. O curador corrige um duvidoso, e isso vira merge. O curador cadastra uma tradução na BCR, e a próxima carga padroniza melhor. O jurídico formaliza um enquadramento, e o WDR aplica sobre milhões de registros.

**A máquina processa. O humano decide. E o que ele decide entra na máquina de novo.**

Se eu conseguir explicar isso pra alguém que nunca ouviu falar de MDM, eu aprendi o treinamento.

---

## AUTO-TESTE — Módulo 8

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** A BQA tem duas filas de trabalho diferentes, vindas de dois módulos diferentes. Quais são, de onde cada uma vem, e qual tela do Quality Manager trata cada uma?

**2.** Explique o que é House Holding e como ele responde à pergunta "mesmo grupo familiar?" do exemplo da Maria no Módulo 1. Por que a apostila diz "podem ser interpretadas como" em vez de afirmar que é família?

**3.** Diga os três tipos de hierarquia (equilibrada, desequilibrada, recursiva) com um exemplo de cada. Qual deles descreve os relacionamentos entre pessoas no MDM, e que consequência prática isso traz pra consulta?

**4.** *(a pergunta final)* Explique por que o MDM é um ciclo e não uma linha reta. Dê pelo menos dois exemplos concretos de decisões que o curador toma no Módulo 8 e que voltam a alimentar módulos anteriores do pipeline.

---
