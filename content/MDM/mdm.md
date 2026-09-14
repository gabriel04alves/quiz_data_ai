# Módulo 1 — Conceitos de Master Data Management

> **Tempo estimado de leitura em voz alta:** ~22 minutos (≈3.150 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 4 a 25
> **Instrutor da apostila:** Gustavo Santos (MD2)

---

## ABERTURA

Beleza, vamos começar. Esse é o Módulo 1: Conceitos de Master Data Management.

Esse módulo é a base de tudo. Ele não tem nada de técnico ainda — não tem tabela, não tem job, não tem código. Ele existe pra responder uma pergunta só: **por que raios alguém montaria um sistema inteiro só pra arrumar cadastro?**

E se eu não souber responder isso com clareza, todo o resto do treinamento vira decoreba. Porque os sete módulos seguintes são, na prática, a resposta técnica pra um problema de negócio. Se eu não entendo o problema, eu não entendo por que a solução tem essa cara.

Então vamos lá.

---

## PARTE 1 — O que é um dado

Primeiro, o mais básico de todos: o que é um dado?

Dado é a representação bruta de um fato. Pode ser texto, número, imagem, som ou vídeo. É o registro cru de alguma coisa que aconteceu.

Deixa eu dar exemplos concretos. O número de vendas de um produto específico num dia — isso é um dado. O tempo que um visitante passou no meu site — isso é um dado. O CPF que a pessoa digitou no formulário — dado. A data de nascimento dela — dado.

A apostila usa uma analogia que eu gosto: **um dado isolado é como uma peça de quebra-cabeça.** Sozinha, ela não diz muita coisa. Se eu te mostro só a peça, você não sabe se é céu, se é grama, se é o rosto de alguém. Mas quando você junta com as outras peças, aí começa a formar uma imagem clara.

E é exatamente isso que acontece na empresa. Um CPF sozinho não vale nada. Um CPF ligado a um nome, ligado a um endereço, ligado a três contratos, ligado a um histórico de reclamação — aí sim eu tenho uma imagem do meu cliente.

---

## PARTE 2 — Os três tipos de dado

Agora, nem todo dado é igual. A apostila separa em três tipos, e essa separação é importante porque o MDM só cuida de um deles.

**Primeiro: dado mestre.** São os dados-base, os pilares da empresa. Cliente, Empresa, Fornecedor. São as entidades que existem independente de qualquer transação. O cliente Maria existe mesmo que ela nunca compre nada.

**Segundo: dado referencial.** São os dados que normalmente vêm associados ao dado mestre, codificando algumas características dele. Os exemplos da apostila: CEP, CID, DDD, SKU. Pensa assim — o CEP não é o cliente, mas ele qualifica o endereço do cliente. É uma tabela de domínio, uma lista de valores válidos que o mundo inteiro usa.

**Terceiro: dado transacional.** São os dados dinâmicos, produzidos em função dos negócios da empresa. Nota fiscal, pedido de compra, pedido de venda. E repara: o dado transacional está *relacionado* ao dado mestre e ao referencial. A nota fiscal aponta pra um cliente (mestre) e tem um CEP de entrega (referencial).

Então, resumindo em uma frase: **o dado mestre é quem, o referencial é como se classifica, e o transacional é o que aconteceu.**

E o MDM — Master Data Management — cuida do primeiro. Do "quem".

---

## PARTE 3 — O que é Master Data

Master Data, então, é um subconjunto dos dados corporativos. Não é tudo. É um pedaço específico.

A definição que a apostila usa é essa: **Master Data é a informação do núcleo de alto valor de uma empresa, utilizada pra apoiar processos críticos de negócio.**

Deixa eu quebrar essa frase, porque ela é densa.

"Núcleo de alto valor" quer dizer: são poucos dados, mas são os que doem quando estão errados.

"Processos críticos de negócio" quer dizer: se esse dado estiver errado, um processo importante quebra. Não é um relatório bonitinho que fica torto — é a cobrança que não chega, é a fraude que não é detectada, é o cliente que recebe a oferta errada.

Que tipos de coisa entram como Master Data? A apostila lista: clientes, fornecedores, parceiros, produtos, materiais, funcionários, contas. E num diagrama, ela mostra também: Localizações, Indivíduos, Empresas, Produtos, Contratos, Households e Parceiros de Negócio.

Esse "Households" merece um comentário, porque é uma palavra em inglês que aparece sem tradução. Household é o **grupo familiar** — ou, mais tecnicamente, o conjunto de pessoas que compartilham o mesmo endereço. Vamos voltar nisso no Módulo 8, mas guarda a ideia: não é só a pessoa que interessa, é o núcleo dela.

E a última frase dessa parte, que eu acho a mais importante: **Master Data está no coração de cada aplicação de negócio, tanto transacional quanto de decisão.** Ou seja: ele alimenta o sistema operacional do dia a dia *e* alimenta o BI que a diretoria olha. Se ele está podre, os dois estão podres.

---

## PARTE 4 — O problema: dispersão de cadastros em silos

Agora a gente chega no problema de verdade. E esse é o coração do módulo.

O termo é **silo de dados**. Silo é aquela torre de armazenamento de grãos da fazenda — fechada, isolada, sem comunicação com as outras. Na empresa, silo de dados é a mesma ideia: cada sistema guarda seu próprio cadastro, fechado, sem falar com os outros.

E aí surgem as perguntas que ninguém consegue responder. A apostila lista:

- Onde está a minha informação?
- Como eu faço pra buscá-la quando eu precisar?
- Posso confiar nela?
- O dado está atualizado?
- Este dado é correto?
- Qual sistema contém a melhor informação?

E um segundo bloco, ainda mais desconfortável:

- Quantos clientes nós possuímos?
- Quais produtos esses clientes possuem?
- Qual a última vez que o cadastro do cliente foi atualizado?
- Por que eu não consigo contatar o cliente?

Repara na primeira dessas: **"quantos clientes nós possuímos?"** Parece a pergunta mais fácil do mundo. E numa empresa com silos, ela é literalmente irrespondível. Porque se eu somo os quatro sistemas, eu conto a mesma pessoa quatro vezes. E se eu não somo, eu não sei qual sistema está completo.

---

## PARTE 5 — O exemplo da Maria (esse é o exemplo central da apostila)

Aqui a apostila dá o exemplo que eu quero que fique gravado. Preste atenção nesse, porque ele vai voltar em todos os módulos.

Existem quatro cadastros espalhados em sistemas diferentes: um Portal, um Ponto de Vendas e um CRM.

**No Portal:**
- Nome: Maria Castilho Figueira
- Endereço: SBS — Bloco C
- Segmento: Premium
- CPF: 113445678-01
- Produtos: 1234, 5764
- Sexo: Feminino

**No Ponto de Vendas:**
- Nome: Maria Figueira
- Segmento: Padrão
- Contato via e-mail

**No CRM (primeiro registro):**
- Nome: Maria C. Figueira
- Endereço: SQS 110 — A — 610
- CPF: 113445687-01
- Produto: 8674
- Sexo: 2

**E um quarto registro:**
- Nome: João Figueira
- Endereço: 110 SUL — Bl A — Ap 610
- Segmento: Premium
- CPF: 112657087-55
- Sexo: M

Agora olha as perguntas que a apostila faz em cima disso:

**"Mesma pessoa?"** — Maria Castilho Figueira, Maria Figueira e Maria C. Figueira. Provavelmente sim. Mas repara nos CPFs: um é 113445678-01 e o outro é 1134456**87**-01. Os dígitos 7 e 8 estão trocados. Isso é erro de digitação ou são duas pessoas? Um ser humano olhando resolve em dois segundos. Um sistema, não.

**"Cliente especial?"** — No Portal ela é Premium. No Ponto de Vendas ela é Padrão. Qual vale? Se o atendente abrir o sistema errado, ele trata uma cliente Premium como Padrão.

**"Endereços estão corretos?"** — "SQS 110 — A — 610" e "110 SUL — Bl A — Ap 610". Isso é o mesmo endereço escrito de dois jeitos. Quem conhece Brasília sabe. O sistema não sabe.

**"Quais produtos contratados?"** — Ela tem o 1234, o 5764 e o 8674. Mas nenhum sistema sozinho mostra os três. Nenhum vendedor consegue ver a carteira completa dela.

**"Mesmo grupo familiar?"** — E o João Figueira? Mesmo sobrenome, mesmo endereço (110 SUL, Bl A, Ap 610 — o mesmo da Maria no CRM). CPF diferente, sexo diferente. Provavelmente é marido, irmão ou filho. É outra pessoa, mas é o mesmo **household**.

Esse único slide contém o treinamento inteiro em miniatura. Guarda ele.

---

## PARTE 6 — As consequências

E qual o estrago disso? A apostila é direta:

Deficiência no atendimento. Visão reduzida de oportunidades. Aumento de custos. Deficiência nos processos de fraude e risco. E não conformidade com regulamentações — com destaque pra **LGPD**, a Lei Geral de Proteção de Dados Pessoais.

Esse último ponto vale um parêntese, porque ele vai voltar forte no Módulo 6. A LGPD me obriga a saber onde estão os dados pessoais dos meus titulares e sob qual base legal eu os trato. Se eu tenho a Maria em quatro sistemas e não sei que são a mesma Maria, eu **não consigo** atender um pedido de exclusão dela. Eu apago num sistema e deixo nos outros três. Isso é não conformidade.

E tem uma frase de fechamento nesse bloco que resume o objetivo do produto: **"Reconheça seu cliente em qualquer canal."**

---

## PARTE 7 — Mundo ideal versus mundo real

A apostila faz uma tabela comparando o que a gente gostaria de ter com o que a gente tem de fato. Vale ler item por item:

| Mundo ideal | Mundo real |
|---|---|
| Pessoa única | Vários cadastros |
| Nome único | Homônimos e similares |
| Identificação única | Múltiplos documentos |
| Dados corretos | Dados ausentes, desatualizados ou imprecisos |
| Único sistema | Diversos sistemas |
| Contatos estáticos | Contatos voláteis |
| Localidade geográfica única | Mobilidade global |
| Garantia da visão unificada | **Necessária solução de Master Data Management** |

Repara na última linha. Ela é a conclusão do módulo inteiro. O mundo real não vai virar o mundo ideal sozinho. Precisa de uma solução.

E os dados ruins são caracterizados por cinco defeitos, que a apostila lista assim: **duplicada, incompleta, inconsistente, imprecisa, desatualizada.** Vale decorar essas cinco palavras — elas voltam no Módulo 5, quando a gente for higienizar.

O contexto desses cinco defeitos na apostila é um slide chamado "Troca de informações sem governança dos dados", que mostra cinco assuntos — Cliente, Contrato, Fornecedor, Localização, Produto — atravessando cinco sistemas — ERP, CRM, Call Center, Internet, Data Mart. E o diagnóstico embaixo: **GAP de governança, problemas de comunicação.**

---

## PARTE 8 — Os números

A apostila traz quatro estatísticas de mercado pra justificar o investimento:

- **66%** indicam que a lucratividade é impactada negativamente por dados de clientes incorretos. (fonte: SAS, newsletter "In the Know")
- **75%** indicam que a baixa qualidade de dados de clientes impacta negativamente a qualidade dos serviços prestados e a fidelização. (fonte: AIIM & Accenture Surveys)
- **42%** usam informações erradas pelo menos uma vez por semana. (fonte: AIIM & Accenture Surveys)
- **14** — o número médio de bases de dados diferentes que as empresas possuem. (fonte: IDC)

Esse último número é o que mais me impressiona. Quatorze bases. Não são os quatro sistemas do exemplo da Maria — são quatorze, em média.

E tem uma citação: *"Sem uma visão única de clientes, as organizações estão no escuro e tornam-se incapazes de efetivamente reter clientes, efetuar vendas cruzadas, prover uma experiência agradável no relacionamento com seus clientes ou gerenciar os riscos associados a eles."*

[⚠️ CONFERIR NA APOSTILA: nesse slide há um logo do Gartner, mas a citação em bloco aparece sem marcador de fonte — as notas de rodapé numeradas [1], [2] e [3] ligam apenas aos percentuais. Conferir se a citação é do Gartner ou de outra fonte antes de citá-la atribuindo autoria.]

---

## PARTE 9 — Então, o que é MDM?

Agora que o problema está claro, a definição faz sentido.

**MDM é um processo de gestão de dados que compreende um conjunto de disciplinas, processos e ferramentas que definem de forma consistente e gerenciam os dados mestres — ou seja, os dados não transacionais — de uma organização.**

Repara em três palavras dessa definição: **disciplinas, processos e ferramentas.** MDM não é um software. Software é uma das três pernas. Se eu comprar a ferramenta e não tiver processo nem disciplina, eu não tenho MDM, eu tenho um banco de dados caro.

E o que o MDM faz, concretamente? A apostila lista os verbos:

**Coletar, agregar, combinar, consolidar, garantir a qualidade, persistir e distribuir** esses dados a toda a organização, pra garantir a consistência e o controle nas futuras manutenções e no uso da informação.

Guarda essa sequência de verbos, porque ela **é o roteiro dos próximos módulos**. Coletar é o Módulo 4 (Ingestão). Garantir a qualidade é o Módulo 5 (Higienização). Combinar e consolidar são os Módulos 6 e 7 (Unificação e Sobrevivência). Distribuir é a publicação. E o controle no uso é o Módulo 8 (Curadoria).

E uma segunda definição, mais focada no produto: **a solução de MDM entrega um conjunto de processos e ferramentas voltada à captura, integração, saneamento, enriquecimento e unificação de dados mestre, provendo uma plataforma corporativa pra gerenciamento e distribuição de dados mestre.**

---

## PARTE 10 — Benefícios

A apostila lista quatro benefícios principais:

**Visão unificada.** O MDM proporciona uma visão única e confiável dos dados críticos, facilitando a tomada de decisão baseada em informação precisa. No caso da Maria: um registro só, com os três produtos, com o segmento correto.

**Melhoria na qualidade dos dados.** Ao centralizar a gestão, dá pra melhorar significativamente a qualidade. Concretamente: eu conserto o endereço uma vez, no lugar certo, em vez de quatro vezes em quatro sistemas.

**Eficiência operacional.** Consistência e precisão otimizam processos de negócio, reduzindo redundâncias e erros. Concretamente: eu paro de mandar quatro malas diretas pra mesma pessoa.

**Conformidade regulatória.** Facilita o cumprimento de regulamentações, assegurando que os dados estejam corretos e acessíveis. Concretamente: LGPD.

E num segundo slide, ela desenha esses benefícios em roda em volta do MDM:
- Melhorar a tomada de decisão estratégica e a agilidade nos negócios
- Redução de custos operacionais
- Melhorar o serviço prestado e o conhecimento sobre o cliente
- Cumprir requisitos da legislação (compliance) e reduzir risco
- Cross-sell e up-sell
- Entrar em novos mercados, introduzir novos produtos, conquistar novos clientes

Sobre cross-sell e up-sell, já que são termos em inglês: **cross-sell é venda cruzada** — vender um produto diferente pro mesmo cliente. **Up-sell é vender uma versão melhor** do que ele já tem. E os dois dependem de eu saber o que ele já tem. Se eu não sei que a Maria tem o produto 8674, eu posso tentar vender o 8674 pra ela de novo — e passar vergonha.

---

## PARTE 11 — MDM e DAMA

Um enquadramento rápido, mas que vale saber pra conversa com o pessoal de governança.

**DAMA-DMBOK** significa *Data Management Body of Knowledge*, publicado pela DAMA — a associação internacional de gestão de dados. É um framework, uma referência das práticas de gestão de dados. É o "livro-texto" da área.

E no DAMA-DMBOK, o MDM aparece como uma **disciplina central**, focada na gestão dos dados mestres da organização, com o objetivo de garantir que esse conjunto de dados seja mantido de forma precisa, consistente e atualizada em toda a empresa.

Ou seja: MDM não é uma invenção da MD2 nem da IBM. É uma disciplina reconhecida, com corpo de conhecimento formal.

[⚠️ CONFERIR NA APOSTILA: logo depois do slide de DAMA existe um slide chamado "Visão orientada às pessoas" que no arquivo aparece só como título, sem nenhum texto — provavelmente é a roda do DMBOK ou um diagrama de papéis/personas. Conferir o conteúdo visual, porque o título sugere um ponto conceitual que não está escrito em lugar nenhum.]

---

## PARTE 12 — Os quatro tipos de implementação

E fechando o módulo, a parte que mais cai em prova: os **quatro modos de implementação de MDM**.

Antes da lista, o enquadramento da apostila: as soluções de MDM podem ser implementadas de várias maneiras, dependendo dos objetivos de negócio, da arquitetura tecnológica da empresa e das necessidades de governança de dados. Ou seja — não existe modo "certo", existe modo adequado ao contexto.

**Modo 1 — Registry Mode (modo de registro).**
É o método **menos intrusivo**. Ele cria um índice, um registro de referência, que aponta pros dados mestres localizados nos sistemas diferentes. Mas **não cria uma versão mestre centralizada**. Permite obter uma visão unificada sem consolidar nem duplicar informação nos sistemas de origem.

Analogia: é o índice remissivo de um livro. O índice diz "Maria: páginas 12, 47 e 103". Ele não copia o conteúdo das páginas, só aponta. Se você quiser saber o que tem lá, vai ter que ir na página.

**Modo 2 — Consolidation Mode (modo de consolidação).**
Envolve a agregação e harmonização de dados de várias fontes num **repositório central**. Os dados são extraídos das diversas fontes e processados pelo **Motor MDM**, gerando o **Golden Record** — a visão única dos dados mestres — que é armazenado num hub visando o consumo.

Aqui aparece pela primeira vez o termo **Golden Record**, ou Registro Mestre. É o registro único, o melhor registro possível, montado a partir de todas as versões espalhadas. É o "produto final" da fábrica que a gente vai estudar. No caso da Maria: um registro só, com o nome completo correto, o CPF certo, o endereço padronizado e os três produtos.

E repara: nesse modo o fluxo é **de mão única**. Os sistemas alimentam o hub, o hub gera o Golden Record, e quem quiser consome do hub. O hub não escreve de volta nos sistemas de origem.

**Modo 3 — Transactional ou Operational Mode (modo transacional ou operacional).**
Usa o sistema MDM como o **principal ponto de entrada e armazenamento** dos dados mestres. Todas as operações de criação, leitura, atualização e exclusão — o **CRUD**, que é a sigla de *Create, Read, Update, Delete* — são realizadas dentro do MDM. E aí os dados são distribuídos pros sistemas de origem conforme necessário.

Aqui o fluxo inverte. O MDM vira o dono. Se você quer cadastrar um cliente, você cadastra no MDM, e o MDM avisa os outros sistemas. É o modo mais poderoso e o mais difícil de implantar, porque exige mudar o jeito que as áreas trabalham.

**Modo 4 — Co-Existence Mode (modo de coexistência).**
Os dados mestres são **sincronizados** entre o sistema MDM e os sistemas de origem. Uma versão central é mantida e compartilhada, mas as versões locais ainda existem e continuam sendo usadas.

A apostila diz explicitamente que esse modo **mescla o transacional e o de consolidação**: o Golden Record é gerado a partir de inserções e edições feitas no próprio MDM *ou* nos sistemas de origem, e é passível de consumo — inclusive pra atualizar os sistemas de origem de volta.

Ou seja: fluxo de mão dupla, mas sem obrigar ninguém a abandonar seu sistema.

**Uma observação sobre os diagramas:** os slides dos modos 2, 3 e 4 mostram um diagrama com o "HUB MDM" desenhado, e o slide do modo 1 não mostra. Isso reforça a diferença: só o Registry não tem hub de verdade — tem índice.

[⚠️ CONFERIR NA APOSTILA: os diagramas dos quatro modos são imagens sem texto extraível. O sentido das setas — quem escreve em quem — é justamente a parte mais informativa desses slides. Conferir visualmente antes de gravar essa parte.]

**E qual modo a MD2 usa?**

[⚠️ CONFERIR NA APOSTILA: a apostila **não declara** em qual dos quatro modos a solução MD2 se enquadra. Pela arquitetura dos módulos seguintes — camadas STG, BIP e BUP gerando Golden Record num hub central, mas com CRUD via Quality Manager e entrada via API no Módulo 4 — a solução tem cara de Consolidation com elementos de Co-Existence. Mas isso é dedução minha, não está escrito. Vale perguntar ao instrutor: é exatamente o tipo de pergunta que cai no caderno de exercícios.]

---

## TRANSIÇÃO PRO MÓDULO 2

Então, fechando: eu agora sei **o que** é o problema (silos, a Maria em quatro versões), **o que** é a solução conceitualmente (uma disciplina que coleta, qualifica, consolida e distribui dados mestres) e **de quantos jeitos** ela pode ser montada (Registry, Consolidation, Transactional, Co-Existence).

O que eu ainda não sei é **como** isso vira software.

E é aí que entra o Módulo 2: Arquitetura do Hub de Dados. Porque a partir do momento que eu escolho um modo de implementação — e a MD2 escolheu um modo com hub central — eu preciso desenhar as peças desse hub. Quais camadas existem, o que entra em cada uma, em que ordem as coisas acontecem.

Pensa assim: o Módulo 1 me disse que eu preciso de uma fábrica. O Módulo 2 me mostra a planta baixa da fábrica. E os módulos 3 a 8 me levam pra dentro de cada setor da linha de produção.

Vamos pra planta baixa.

---

## AUTO-TESTE — Módulo 1

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto. Só depois siga pro Módulo 2.**

**1.** Explique a diferença entre dado mestre, dado referencial e dado transacional, dando um exemplo de cada um — e diga qual dos três o MDM gerencia.

**2.** No exemplo da Maria existem quatro cadastros em sistemas diferentes. Cite pelo menos três problemas concretos que essa dispersão causa, e explique por que a pergunta "quantos clientes nós temos?" é impossível de responder nesse cenário.

**3.** Descreva os quatro modos de implementação de MDM (Registry, Consolidation, Transactional, Co-Existence). Para cada um responda duas coisas: existe um Golden Record centralizado? E o MDM escreve de volta nos sistemas de origem?

---

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

# Módulo 6 — Processos de Unificação

> **Tempo estimado de leitura em voz alta:** ~30 minutos (≈4.400 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 111 a 140
> **Atenção:** este é o módulo mais longo da apostila (30 slides). Além de Matching, ele contém dois blocos que o título não anuncia: **Split/Merge** e **Enquadramento Legal Automatizado (LGPD / camada WDR)**. Considere gravar em duas ou três sessões, mas **estude como um módulo só** — é assim que está na apostila e no caderno de exercícios.

---

## ABERTURA

Módulo 6: Processos de Unificação.

Esse é o coração do MDM. Tudo o que veio antes foi preparação pra esse momento. Ingestão foi trazer o dado. Higienização foi deixar o dado comparável. Agora é a hora de responder **a** pergunta: **essas três Marias são a mesma pessoa?**

E aqui está a diferença fundamental deste módulo pros anteriores: até agora tudo era determinístico. Padronizar "Rua" pra "RUA" é uma regra clara, sempre dá o mesmo resultado. Validar um CPF é matemática pura.

Unificar não é assim. **Unificar é probabilidade.** O motor não sabe se são a mesma pessoa — ele calcula uma nota de confiança, e alguém definiu um limiar. E onde tem limiar, tem erro possível nos dois sentidos: unir quem não devia, e separar quem devia estar junto.

É por isso que este módulo é o mais denso: ele tem o mecanismo (matching), tem a zona cinzenta (clerical), e tem a correção do erro (split/merge).

E no fim ele tem, ainda, um bloco de LGPD que parece deslocado mas não é — e eu explico por quê quando chegar lá.

---

## PARTE 1 — O que acontece na camada BUP

A apostila abre assim:

**"Nessa camada são armazenados os Golden Records. Mas pra chegar a esse ponto, após as etapas de padronização e de enriquecimento, existem dois outros passos cruciais:"**

**"Matching (co-relacionamento de dados semelhantes): nosso motor leva em consideração todas as informações de métricas e critérios de validação e qualificação da informação para comparar os registros entre si, a fim de identificar os registros duplicados."**

**"Sobrevivência: composição de informações de quaisquer uma das instâncias da entidade, podendo conter dados de diversos registros cuja informação tenha sido definida mediante a regra de matching."**

Então são **dois passos**, e é importante não confundir:

**Matching responde QUEM.** Ele agrupa: "esses três registros são a mesma pessoa."

**Sobrevivência responde O QUÊ.** Dado que são a mesma pessoa, qual nome fica? Qual endereço fica? Qual CPF fica?

Uma metáfora: o matching junta os três depoimentos sobre a mesma testemunha. A sobrevivência escreve a versão oficial.

Este módulo é sobre o matching. A sobrevivência tem módulo próprio, o Módulo 7 — mas ela roda dentro do mesmo processo, então ela vai aparecer aqui de raspão.

---

## PARTE 2 — O fluxo de carga da BUP

**"Abaixo temos a representação do fluxo de carga da BUP. Observe que temos as origens das informações nas camadas BIP e BUP. Isso se faz necessário nessa etapa para verificar se o registro da BIP já possui ou não uma representação na BUP, visando não duplicar o golden record."**

Essa é a primeira coisa não óbvia do módulo, então vamos com calma.

O processo de unificação lê de **dois lugares**: da BIP e da **própria BUP**.

Por quê? Porque o MDM roda todo dia. Na carga de hoje chegou um registro novo da Maria, vindo de um sistema qualquer. Mas a Maria **já tem** um Golden Record na BUP, criado semana passada.

Se eu só olhasse pra BIP, eu criaria um Golden Record novo pra ela. E aí eu teria duas Marias na BUP — exatamente o problema que o MDM existe pra resolver, agora reproduzido dentro do próprio hub.

Então o processo primeiro pergunta: **"esse registro que chegou já tem dono na BUP?"** Isso é o Reference Matching, que a gente vê daqui a pouco.

E a apostila continua, introduzindo o conceito mais importante do módulo:

**"Essa etapa pode apresentar diferentes resultados. O processo pode ficar na dúvida se um registro é ou não o mesmo que o outro. Chamamos esses casos de CLERICAL. O que diferencia um CLERICAL de um MATCH é a nota atribuída ao registro. Para concluir, também podem existir registros que simplesmente não foram identificados como duplicatas."**

**"Abaixo temos então os estágios de match e sobrevivência, que são os responsáveis por identificar que os N registros se referem à mesma entidade, e em seguida por compor (sobreviver) o melhor registro. Vale lembrar que o melhor registro pode ser a composição de várias duplicatas."**

Três resultados possíveis, então:

1. **MATCH** — é a mesma pessoa, com confiança.
2. **CLERICAL** — dúvida. Nota intermediária.
3. **Não duplicado** (a apostila também chama de **Residual**) — é outra pessoa.

Essa palavra **CLERICAL** merece explicação, porque ela é estranha em português. Vem do inglês *clerical review* — revisão de escritório, revisão manual. É o caso que a máquina empurra pra mesa de um humano. **Clerical = pendente de análise humana.**

E lembra onde os clericals vão parar? Na **BQA**, exatamente como o Módulo 3 disse: "registros invalidados, **duvidosos oriundos da esteira de matching**". Agora fecha.

Sobre a localização dos jobs: **`Jobs/MDM/04_BIP_BUP`** — a mesma pasta da BIP, como o Módulo 5 explicou.

E os componentes que a apostila desenha nesse job:
- **Reference Matching**
- **Sobrevivência**
- **Unduplicate Matching**

---

## PARTE 3 — Os dois tipos de matching

A apostila explica os dois tipos, e a diferença é fundamental.

### Reference Match (Two Source)

**"Comparação é feita analisando os dados da origem × dados de referência. Utilizamos esse tipo de matching na solução MDM para identificar se os dados no fluxo de processamento é uma duplicata de um golden record já existente."**

E complementa:

**"Abaixo o job que realiza o matching reference, ou seja, a verificação de associação dos registros no fluxo de processamento com os golden records já existentes. O objetivo é não permitir a criação de novos registros unificados a partir dos registros do fluxo de processamento, caso esses já existam na camada BUP."**

Então: **duas fontes.** De um lado, o que chegou hoje (a BIP). Do outro, o que já existe (a BUP). Cada registro novo é comparado contra a base de Golden Records.

Analogia: é o porteiro do prédio conferindo se a pessoa que chegou já está na lista de moradores.

### Unduplicate Match (One Source)

**"Comparação é feita analisando os dados de uma única origem. Utilizamos esse tipo de matching na solução MDM para verificar se, dentre os casos que não detêm um golden record identificado, existem duplicatas."**

Então: **uma fonte.** Compara os registros do lote entre si.

Analogia: numa festa onde ninguém está na lista, você compara os convidados uns com os outros pra ver se alguém entrou duas vezes.

### E a ordem entre os dois

Repara na sequência lógica, que é o que realmente importa:

**Primeiro roda o Reference.** Todo mundo que já tem Golden Record é encaixado nele.

**Depois, com o que sobrou** — os que "não detêm um golden record identificado" — **roda o Unduplicate**, pra ver se entre esses novatos tem gente repetida.

Exemplo concreto: chegam hoje 4 registros. Dois deles são a Maria, que já existe na BUP → o Reference resolve, os dois grudam no Golden Record existente. Os outros dois são o José, que nunca entrou no hub → o Reference não acha nada, e o Unduplicate descobre que os dois Josés são o mesmo, criando **um** Golden Record novo, não dois.

Se não existisse o Unduplicate, o José entraria duplicado. Se não existisse o Reference, a Maria viraria um Golden Record novo a cada carga.

---

## PARTE 4 — Como uma regra de matching é construída

Agora o miolo técnico. A apostila:

**"As regras de matching utilizadas na solução MDM são divididas por passos, contemplando a lógica de resolução de duplicatas, indicando se as pessoas são as mesmas ou não. Cada passo é formado por:"**

**"Blocagem da regra: colunas onde a comparação é exata. Utilizado para agrupar os registros em blocos."**

**"Regras de match: utilizadas para comparação probabilística, que a depender das notas podem ou não aceitar uma pequena diferença entre os registros. Por exemplo, IGOR pode ser considerado a mesma pessoa que YGOR ou HIGOR."**

**"Notas de MATCH e CLERICAL."**

Vamos por partes, porque cada uma dessas é um conceito.

### Blocagem — e por que ela existe

A **blocagem** (em inglês, *blocking*) é a parte que mais gente não entende, e ela é puramente prática.

Imagina uma base com 10 milhões de pessoas. Se eu comparar cada uma com todas as outras, são 10 milhões vezes 10 milhões dividido por dois — cerca de **50 trilhões de comparações**. Isso não roda. Não em uma noite, não em um mês.

A blocagem resolve isso. Ela escolhe um ou mais campos onde a comparação tem que ser **exata**, e usa isso pra formar grupos. E aí o motor só compara registros **dentro do mesmo bloco**.

Exemplo: se eu bloco por "primeiras 4 letras do sobrenome + data de nascimento", a Maria Figueira nascida em 12/03/1985 só vai ser comparada com outras pessoas "FIGU" nascidas em 12/03/1985. Podem ser 30 pessoas. E aí são 30 vezes 29 comparações — trivial.

**O preço da blocagem:** se o campo de blocagem estiver errado no registro, aquele registro **nunca** vai ser comparado com o par certo. Se a data de nascimento da Maria estiver digitada errada num sistema, ela cai em outro bloco e o match não acontece.

Por isso a próxima frase da apostila é tão importante.

### Passos — do genérico ao específico

**"A solução MDM parte de passos mais genéricos até passos mais específicos."**

E a apostila mostra isso com um exemplo de três passos:

**"Nela observamos os dados do fluxo como entrada do matching, e a tentativa de identificação de duplicatas no passo 1. Nada foi identificado."**

**"Já no passo 2 foram identificadas 2 duplicatas."**

**"E por fim no passo 3 conseguimos identificar o restante das duplicatas."**

Isso é a resposta pro problema da blocagem que eu acabei de descrever. **Vários passos, com blocagens diferentes.**

Se o passo 1 bloca por CPF e a Maria tem o CPF digitado errado num sistema, ela não é pega no passo 1. Mas o passo 2 pode blocar por nome + data de nascimento, e aí ela é pega. E o passo 3 pode blocar por algo ainda mais frouxo, como sobrenome + CEP.

**Cada passo é uma segunda chance com um critério diferente.** É por isso que existem vários — não é redundância, é rede de segurança.

[⚠️ CONFERIR NA APOSTILA: os três slides que mostram os passos 1, 2 e 3 são imagens com os registros e os matches destacados. Quais campos são usados na blocagem de cada passo é a informação mais útil desses slides, e ela só existe visualmente. Vale anotar os campos de blocagem de cada passo.]

### Notas de corte

**"Notas de MATCH e CLERICAL:"**

**"Se o registro tiver uma nota igual ou maior que a definida em MATCH, trata-se da mesma pessoa;"**

**"Se a nota for igual à nota de CLERICAL e menor que a nota de MATCH, então ficamos na dúvida, ou seja, CLERICAL;"**

**"Se a nota for menor que a nota de clerical, significa que é uma outra pessoa."**

Então é uma régua com duas marcas:

```
nota alta  ┌──────────────┐
           │    MATCH     │  ← mesma pessoa, automático
  nota de  ├──────────────┤
   MATCH   │   CLERICAL   │  ← dúvida, vai pra BQA e pro curador
  nota de  ├──────────────┤
 CLERICAL  │   RESIDUAL   │  ← outra pessoa
nota baixa └──────────────┘
```

E num segundo slide a apostila reforça e acrescenta uma terceira nota:

**"As Notas de Corte são: Match — se a nota do registro for igual ou maior que a nota Match, o registro do Data File é considerado duplicado. Duvidoso — se a nota do registro for igual ou maior que essa nota mas menor que a nota Match, o registro é considerado duvidoso (Clerical) e deve ser analisado; caso a nota seja menor que a nota Clerical definida, o registro é considerado Residual. Duplicates — se a nota do registro do Reference File for maior ou igual, o registro do Reference File é considerado duplicado (somente Reference Match)."**

Vocabulário do QualityStage aqui:
- **Data File** é o arquivo de dados que está sendo processado (o fluxo, a BIP).
- **Reference File** é o arquivo de referência (a BUP, os Golden Records existentes).

E a terceira nota, **Duplicates**, só existe no Reference Match. Ela trata o caso inverso: quando **o registro de referência** — o Golden Record — bate com mais de um registro do fluxo.

[⚠️ CONFERIR NA APOSTILA: a definição da nota **Duplicates** está redigida de forma circular no slide ("se a nota do registro do Reference File for maior ou igual **o registro do Reference File é considerado duplicado**") — falta dizer maior ou igual **a quê**. O sentido provável é: maior ou igual à própria nota Duplicates configurada. Conferir a redação original e, se possível, um exemplo de quando essa nota é usada na prática.]

**E quem define essas notas?** A apostila não diz. Mas é a decisão mais consequente do projeto inteiro: nota de match muito alta gera duplicatas não detectadas; nota muito baixa gera pessoas diferentes fundidas. É calibração, e é feita olhando resultado real.

---

## PARTE 5 — Determinístico versus probabilístico

A apostila tem um slide comparando os dois mecanismos, com um exemplo numérico:

```
WILLIAM J     KAZANGIAN  128 MAIN ST   02111  12/8/62
WILLAIM JOHN  KAZANGIAN  128 MAINE AVE 02110  12/8/62
   B    B      A    AB    DB      A            = BBAABDBA
  +5   +2    +20   +3    +4      -1  +7   +9   = +49
```

Repara no exemplo: "WILLIAM" versus "WILLAIM" — o A e o I trocados, erro clássico de digitação. "MAIN ST" versus "MAINE AVE". CEP 02111 versus 02110. E a data de nascimento idêntica.

Cada campo recebe uma classificação (A, B, D...) e uma pontuação. Alguns somam, um deles subtrai (o `-1`). E no fim, a soma: **+49**. Esse 49 é comparado com as notas de corte.

**O que isso mostra:** o matching probabilístico não exige que os campos sejam iguais. Ele **pesa** as concordâncias e discordâncias. Um campo pode discordar e o registro ainda dar match, se os outros concordarem forte o suficiente.

E é isso que o exemplo do IGOR da apostila diz: **"IGOR pode ser considerado a mesma pessoa que YGOR ou HIGOR."** Numa comparação exata, IGOR ≠ YGOR e acabou. Numa comparação probabilística, a diferença de uma letra custa alguns pontos, mas se CPF, data de nascimento e endereço baterem, o resultado ainda é match.

Já o mecanismo **determinístico** é o oposto: compara exato, ou compara por regra fixa. É rápido e previsível, mas quebra com qualquer erro de digitação.

[⚠️ CONFERIR NA APOSTILA: nesse slide há dois blocos de texto — um descrevendo o algoritmo determinístico e outro o probabilístico — que **saem completamente embaralhados/sobrepostos na extração do PDF, ilegíveis**. Dá pra distinguir fragmentos de palavras como "Algoritmos", "Verificação", "Exact", "Falso", "Suspect (B)", "Probabilístico", "Sound", "Matching", mas não a redação. **Este é o trecho mais importante a conferir do módulo inteiro**, porque é a definição formal dos dois mecanismos. O que eu expliquei acima é minha reconstrução a partir do exemplo numérico e do resto da apostila — não é a redação original.]

---

## PARTE 6 — Os três algoritmos de comparação

A apostila detalha três comandos de comparação aproximada:

**"CHAR: compara caractere por caractere dos campos. Caso um dos valores seja menor que o outro, o menor é completado com brancos e a comparação é processada."**

**"PREFIX: compara caractere por caractere dos campos, mas até o tamanho do menor. Ex.: MARIA JOSE × MARIA JOSEFA será considerado igual, pois a comparação feita será MARIA JOSE × MARIA JOSE."**

**"UNCERT: compara as palavras existentes nos campos, na ordem que aparecem, tolerando diferenças de acordo com a parametrização."**

Vamos entender a diferença com o exemplo da Maria, que é perfeito pra isso.

**CHAR** — comparação posição por posição, completando com espaço. Então "MARIA FIGUEIRA" versus "MARIA CASTILHO FIGUEIRA": a partir da posição 7 tudo desalinha. "C" contra "F", "A" contra "I"... O CHAR é implacável com deslocamento. Ele serve bem pra campos de tamanho fixo e conteúdo estável: CPF, data, código.

**PREFIX** — compara só até o tamanho do menor. O exemplo da apostila é ótimo: "MARIA JOSE" e "MARIA JOSEFA" são considerados iguais, porque a comparação para em "MARIA JOSE".

Isso é útil pra nome abreviado ou truncado. Muito sistema legado corta o nome em 20 ou 30 caracteres. O PREFIX salva esses casos.

Mas repara no risco: pelo PREFIX, "JOSE" e "JOSEFA" batem. E "JOSE" e "JOSELITO" também. É tolerante demais pra usar sozinho — por isso ele é um dos vários critérios, com peso.

**UNCERT** — vem de *uncertainty*, incerteza. Compara **palavra por palavra**, na ordem que aparecem, tolerando diferenças conforme a parametrização.

Esse é o mais sofisticado dos três, e é o que resolve o caso "WILLIAM" versus "WILLAIM". A palavra está no lugar certo, tem quase as mesmas letras, então ele reconhece com uma penalidade pequena.

E repara: **"na ordem que aparecem"**. Se o nome vier invertido — "FIGUEIRA, MARIA" versus "MARIA FIGUEIRA" — a ordem muda e o UNCERT sofre. É mais uma razão pela qual a padronização do Módulo 5 é obrigatória: ela é quem coloca o nome sempre na mesma ordem antes de chegar aqui.

**E como os três se combinam?** A apostila diz:

**"A composição das notas geradas por cada um dos comandos que utilizam os algoritmos de comparação aproximada gera uma única nota para cada registro. Essa nota é comparada com as notas de corte definidas e o registro é classificado."**

Ou seja: cada campo é comparado com o algoritmo mais adequado a ele, cada comparação gera pontos, tudo é somado numa nota única, e a nota é jogada na régua. É exatamente o `+49` do exemplo do WILLIAM.

---

## PARTE 7 — O que fica populado ao fim da unificação

**"Após passar por matching e sobrevivência — tópico que será detalhado no próximo módulo — temos os golden records formados e armazenados em suas devidas trilhas."**

**"Após a etapa de unificação os dados são armazenados nas camadas BUP, BUP TRILHA e BQA."**

Três camadas:

- **BUP** — os Golden Records.
- **BUP TRILHA** — a Trilha BIP-BUP do Módulo 3: quais registros formaram qual Golden Record, e as vigências.
- **BQA** — os clericals, as dúvidas pendentes de curadoria.

Mesmo padrão dos módulos anteriores: resultado + rastro + exceções.

---

## PARTE 8 — Split e Merge: quando o motor erra

Agora o segundo grande bloco do módulo. E ele começa com uma admissão que eu acho excelente:

**"O split-merge é uma operação de correção (falso positivo ou falso negativo)."**

**"Mesmo com as regras atuais, com todas as revisões e ajustes, eventualmente podem aparecer situações onde foram unificados registros que de fato não se tratavam da mesma pessoa, ou registros que foram separados mas que deveriam ter sido unificados."**

Vamos ao vocabulário, porque falso positivo e falso negativo confundem:

- **Falso positivo** = o motor disse "é a mesma pessoa" e **não era**. Uniu quem não devia. → Corrige com **SPLIT** (separar).
- **Falso negativo** = o motor disse "são pessoas diferentes" e **eram a mesma**. Deixou separado. → Corrige com **MERGE** (unir).

E o exemplo da apostila é o melhor exemplo do treinamento inteiro. Vou ler devagar:

**"Para exemplificar, imagine dois irmãos gêmeos: Marcus Pereira da Silva e Marcos Pereira da Silva."**

- Mesmo sobrenome;
- Mesmo nome dos pais;
- Mesma data de nascimento;
- Mesmo sexo;
- **Mesmo CPF no cadastro (usaram o CPF do pai);**
- Diferença de apenas 1 letra no primeiro nome.

**"Diante do cenário acima, é fácil entender por que o motor MDM identificaria esses dois titulares como duplicatas. Nesse sentido, é necessário executar a operação de SPLIT, ou seja, separar."**

Para e pensa nesse caso. **Qualquer** motor de matching uniria esses dois. Mesma data de nascimento, mesmo sexo, mesmos pais, mesmo sobrenome, mesmo CPF, e o primeiro nome diferindo em uma letra — que é exatamente o padrão de erro de digitação que o UNCERT foi feito pra tolerar.

O motor está fazendo **exatamente o que foi projetado pra fazer**. E está errado.

Isso é o ponto filosófico do módulo: **não existe conjunto de regras que acerte 100%.** A informação disponível é genuinamente ambígua. Nenhum ajuste de nota resolve o caso dos gêmeos sem quebrar mil outros casos legítimos de erro de digitação.

Por isso a operação de correção manual não é um remendo — **é parte do desenho**.

E o caso inverso:

**"Por outro lado, também existem casos onde dois registros estão separados, porém foi observado que se trata de um único titular; sendo assim, os mesmos têm que ser unificados, ou seja, é uma operação de MERGE."**

Exemplo típico de falso negativo: uma pessoa que casou e mudou de sobrenome, tem CPF digitado errado num dos cadastros, e endereço antigo. Nenhuma blocagem pega, nenhum passo alcança. Só um humano que conhece o caso descobre.

### O que acontece depois do split/merge

E aqui vem o detalhe operacional mais importante desse bloco:

**"Necessário refazer a sobrevivência dos registros de cada grupo (verde e amarelo), para remontar o Golden Record com a visão atualizada (pós Split Merge). O mesmo processo é necessário para os demais dados do MDM (Documento, Endereço, Telefone, Email)."**

Ou seja: **split/merge não é só mexer numa ligação.** Depois de separar ou juntar, o Golden Record precisa ser **recomposto do zero**, rodando a sobrevivência de novo.

Faz total sentido. Se o Golden Record dos "gêmeos unidos" tinha o endereço do Marcus e o telefone do Marcos, ao separar eu preciso decidir de novo, pra cada um dos dois grupos, qual dado sobrevive.

E repara na última frase: **"o mesmo processo é necessário para os demais dados"**. Não é só a pessoa. Documento, endereço, telefone e e-mail — tudo tem que ser recomposto. É uma operação em cascata.

E a apostila menciona uma **"Sequence de Controle"** para o Split/Merge. *Sequence*, no DataStage, é um job orquestrador — um job que chama outros jobs numa ordem. Ou seja, o split/merge não é um jobzinho: é uma sequência controlada de vários processos, por assunto.

[⚠️ CONFERIR NA APOSTILA: existem cinco slides de Split/Merge que são apenas título e imagem — incluindo um chamado "Split/Merge Assuntos" e o da "Sequence de Controle". **Não está escrito em lugar nenhum COMO o curador dispara um split ou um merge** — se é por tela do Quality Manager, se precisa de aprovação, se roda na hora ou no próximo ciclo. Esse é um buraco relevante: o conceito está muito bem explicado, a operação não. Perguntar ao instrutor.]

---

## PARTE 9 — Enquadramento Legal Automatizado (LGPD) e a camada WDR

E agora o terceiro bloco do módulo, que à primeira vista parece deslocado.

**Por que LGPD está dentro do módulo de unificação?** A apostila não explica, mas a lógica é sólida e vale entender: **só faz sentido enquadrar legalmente um titular depois que você sabe quem ele é.** Enquanto a Maria for três registros, não dá pra responder "sob qual base legal eu trato os dados da Maria" — são três respostas possivelmente diferentes. Depois da unificação, existe **uma** Maria, e aí o enquadramento é possível.

A apostila abre assim:

**"O processo de Enquadramento Legal dentro da LGPD Suíte envolve dois atores principais: MD2 MDM — onde o processamento e a automatização do enquadramento são realizados; MD2 QM — onde os processos de tratamento dos dados são formalizados."**

Então a divisão de trabalho é clara:
- **No Quality Manager (a tela):** gente formaliza. O jurídico e o DPO registram quais processos tratam dados pessoais e sob qual hipótese legal.
- **No MDM (o motor):** a máquina automatiza. Ela pega o que foi formalizado e associa aos dados reais.

### Vocabulário LGPD

Antes de continuar, três termos:

**Tratamento** de dados, na LGPD, é qualquer operação com dado pessoal — coletar, guardar, usar, compartilhar, apagar. Praticamente tudo é tratamento.

**Hipótese legal** (ou base legal) é a justificativa jurídica pra tratar. A LGPD lista as hipóteses: consentimento do titular, cumprimento de obrigação legal, execução de contrato, legítimo interesse, e outras. **Não existe tratamento sem hipótese legal** — se você não tem base, não pode tratar.

**Enquadramento** é o ato de ligar um tratamento à sua hipótese legal. "Eu guardo o telefone da Maria porque ela consentiu" é um enquadramento.

**Consentimento** é uma das hipóteses — e a mais frágil, porque o titular pode revogar quando quiser.

### Como a carga funciona

**"Para viabilizar o enquadramento automatizado e o fluxograma indicado anteriormente, o processo de carga é dividido em 3 partes:"**

**"1. Extração de dados oriundos das formalizações no MD2 Quality Manager;"**

**"2. Extração e união dos dados de consentimento oriundos do MD2 Quality Manager e bases externas;"**

**"3. Automatização do enquadramento a partir da associação dos dados extraídos com as bases de origem existentes no Hub MDM."**

Repara na parte 2: os consentimentos vêm de **duas** origens — do próprio Quality Manager **e de bases externas**. Faz sentido: o consentimento pode ter sido dado no app, no site, no call center, em sistemas que não são o QM. Tudo isso precisa ser unido.

### Quando roda e o que é a WDR

**"Ao fim da carga diária do MDM no QualityStage será executado um novo passo, que invocará a camada chamada WDR (Workflow Data Rules)."**

**"A primeira atividade do WDR é realizar a leitura do repositório do MD2 Quality Manager, para capturar a visão dos processos que manipulam os dados pessoais e hipóteses legais associadas."**

**"Após isso, realiza-se a associação dos dados capturados com as bases de dados mapeadas no Hub MDM."**

Duas coisas pra fixar aqui.

**Primeira: o momento.** O enquadramento roda **ao fim da carga diária**, como um passo adicional. Ou seja, ele é posterior a toda a esteira: ingestão, higienização, unificação. Isso confirma a lógica de por que ele está nesse módulo — ele depende de tudo estar pronto.

**Segunda: o sentido do fluxo.** O WDR **lê do Quality Manager**. Repara que aqui a direção é invertida em relação a tudo que a gente viu. Em todos os outros módulos, o motor processa e o QM mostra. Aqui, o QM é a **fonte** e o motor consome.

Faz sentido: a decisão jurídica é humana. Nenhum algoritmo decide qual hipótese legal cobre qual processo. Uma pessoa decide, registra no QM, e o motor aplica isso em escala sobre milhões de registros.

**E o resultado prático?** Depois disso, o hub consegue responder: "os dados de telefone da Maria são tratados pelo processo de cobrança, sob a hipótese de execução de contrato, e pelo processo de marketing, sob consentimento — que ela revogou em maio." Isso é o que a LGPD exige e é impossível de responder sem MDM.

E lembra do Módulo 3? A definição da WDR mencionava também "ranqueamento" e "ranking de assuntos MDM". Aqui, nada disso é retomado.

[⚠️ CONFERIR NA APOSTILA: o "ranqueamento" citado na definição da camada WDR no Módulo 3 **não aparece em nenhum lugar** deste bloco de enquadramento. A apostila descreve só o enquadramento. Continua sem explicação o que é ranqueado e para quê.]

[⚠️ CONFERIR NA APOSTILA: os slides "Fluxo de Tratamento dos Dados" e "Fluxo de Enquadramento Automatizado" são fluxogramas em imagem, sem texto. São justamente os slides que mostram a mecânica passo a passo. Conferir.]

---

## TRANSIÇÃO PRO MÓDULO 7

Então, fazendo o balanço deste módulo.

O motor comparou tudo com tudo — primeiro contra os Golden Records que já existiam (Reference), depois entre os novatos (Unduplicate). Ele fez isso em vários passos, do critério mais genérico ao mais específico, usando blocagem pra viabilizar o volume e comparação probabilística pra tolerar erro de digitação. Cada comparação virou nota, e a nota caiu numa das três faixas: match, clerical ou residual.

Resultado: eu agora sei que os registros 101, 102 e 103 da BIP são todos a Maria.

**Mas eu ainda não tenho o registro dela.**

E é aqui que está a dependência lógica com o próximo módulo, e ela é bem direta: **o matching me deu o grupo; ele não me deu o conteúdo.**

Olha o problema concreto que sobrou na mesa. Os três registros da Maria dizem:

- Nome: `MARIA CASTILHO FIGUEIRA` / `MARIA FIGUEIRA` / `MARIA C FIGUEIRA`
- Segmento: `Premium` / `Padrão` / *(vazio)*
- CPF: `11344567801` / *(vazio)* / `11344568701`
- Endereço: `SBS Bloco C` / *(vazio)* / `SQS 110 A 610`

Qual nome vai pro Golden Record? O mais completo? O mais recente? O do sistema mais confiável?

Qual segmento? Premium ou Padrão?

Qual CPF, se os dois são diferentes e só um pode estar certo?

**Essas perguntas não são respondidas pelo matching.** O matching só disse "são a mesma pessoa". Quem decide o conteúdo é a **sobrevivência**.

E o nome é literal: dos vários valores candidatos pra cada campo, um **sobrevive** e vai pro Golden Record. Os outros ficam registrados na trilha, mas não aparecem na visão unificada.

É o Módulo 7. Ele é curto, mas é onde o Golden Record de fato nasce.

---

## AUTO-TESTE — Módulo 6

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** Explique a diferença entre Reference Match e Unduplicate Match: quantas fontes cada um usa, qual pergunta cada um responde, e por que o Reference roda antes. O que aconteceria se o Reference não existisse?

**2.** O que é blocagem, e por que ela é necessária? Depois explique por que o matching é feito em vários passos, "do mais genérico ao mais específico" — que problema da blocagem isso resolve?

**3.** Um registro recebeu nota abaixo da nota de MATCH mas igual ou acima da nota de CLERICAL. O que acontece com ele, em que camada ele vai parar, e quem resolve o caso?

**4.** *(bônus, sobre split/merge)* No caso dos irmãos gêmeos Marcus e Marcos, o motor errou — mas a apostila diz que ele fez o que era esperado. Explique esse paradoxo, e diga o que precisa acontecer depois de um SPLIT além de simplesmente separar os registros.

---

# Módulo 7 — Regras de Sobrevivência

> **Tempo estimado de leitura em voz alta:** ~12 minutos (≈1.795 palavras de prosa a 150 palavras/minuto)
> **Fonte:** Apostila Treinamento MD2 Master Data Management — slides 142 a 149
> **Nota:** este é o módulo mais enxuto da apostila (8 slides), e vários deles são screenshots da configuração do estágio SURVIVE sem texto. O conteúdo textual é denso mas curto — o roteiro desenvolve os conceitos com exemplos, marcando o que é dedução.

---

## ABERTURA

Módulo 7: Regras de Sobrevivência.

Esse módulo é curto na apostila, mas ele é onde o Golden Record de fato nasce. Todo o resto foi preparação; aqui o registro mestre é escrito.

E ele importa por uma razão que fica clara quando você olha o que sobrou do módulo anterior. O matching me entregou um **grupo**: "os registros 101, 102 e 103 são a mesma Maria." Ótimo. Mas grupo não é registro. Alguém precisa decidir, campo por campo, **qual valor vai valer**.

O nome do módulo é literal e vale saborear: **sobrevivência**. Dos vários valores candidatos pra cada campo, um sobrevive. Os outros não morrem — eles ficam registrados nas trilhas — mas não aparecem na visão unificada. É uma competição, e as regras de sobrevivência são o regulamento dela.

---

## PARTE 1 — O estágio SURVIVE

A apostila abre com a ferramenta:

**"A solução MDM utiliza o estágio SURVIVE para permitir que os usuários definam suas regras de sobrevivência conforme necessidade."**

**SURVIVE** é um estágio do QualityStage — irmão do estágio **Standardize** que a gente viu no Módulo 5, e dos estágios de match do Módulo 6. Ele existe pra fazer uma coisa só: dado um grupo de registros duplicados, produzir um registro único.

E repara na expressão **"conforme necessidade"**. Isso significa que as regras não vêm prontas de fábrica — elas são definidas pelo projeto, com base no que o cliente sabe sobre seus próprios sistemas. Faz sentido: só o cliente sabe se o CRM é mais confiável que o ERP.

---

## PARTE 2 — A chave de grupo: qsMatchSetID

Agora a mecânica, e essa é a parte que amarra o Módulo 6 com o 7:

**"O SURVIVE utiliza uma chave de identificação dos grupos de registros duplicados para aplicar as regras de sobrevivência entre os registros desse grupo. A chave de grupo gerada pelo processo de MATCH é a `qsMatchSetID`, que é utilizada como a chave de identificação do grupo."**

Deixa eu explicar isso bem, porque é o elo entre os dois módulos.

Quando o matching termina, ele não devolve só "sim" ou "não". Ele **carimba** cada registro com um número de grupo. Esse carimbo é o `qsMatchSetID` — o "qs" é de QualityStage, e "MatchSetID" é o identificador do conjunto de match.

Então depois do matching, a saída fica assim:

| Registro BIP | Nome | `qsMatchSetID` |
|---|---|---|
| 101 | MARIA CASTILHO FIGUEIRA | 7 |
| 102 | MARIA FIGUEIRA | 7 |
| 103 | MARIA C FIGUEIRA | 7 |
| 104 | JOAO FIGUEIRA | 8 |

Três registros com o `qsMatchSetID` = 7. Um com 8.

E o SURVIVE trabalha em cima disso: ele agrupa por `qsMatchSetID` e, **dentro de cada grupo**, aplica as regras pra escolher os vencedores. Grupo 7 vira um Golden Record. Grupo 8 vira outro.

É por isso que match e sobrevivência estão no mesmo job, como a gente viu no Módulo 6: a saída de um é a entrada do outro, ligada por essa chave.

---

## PARTE 3 — A ordem das regras (a regra sobre as regras)

Esse é o ponto mais importante do módulo, e é o que mais gera erro na prática. A apostila:

**"A ordem das regras altera o resultado obtido, pois o processamento se dá a partir da primeira até a última. Ou seja, a última regra prevalecerá sobre as demais. Por isso, deve-se ter regras mais abrangentes no começo e mais restritivas no final."**

Vamos destrinchar, porque tem uma lógica embutida aí que não é óbvia.

**O SURVIVE processa as regras em sequência**, da primeira à última. Cada regra que "acerta" **sobrescreve** o resultado anterior. Então quem fala por último, ganha.

Isso é o contrário do que muita gente espera. A intuição comum é "a primeira regra que casar, ganha, e para por aí" — como um `if/else` ou uma cláusula `CASE`. **Não é assim.** Aqui é: roda todas, e a última que se aplicar prevalece.

E daí sai a recomendação: **abrangente no começo, restritivo no fim.**

Deixa eu montar um exemplo pra ficar concreto. Suponha que eu quero definir o **nome** do Golden Record da Maria, e eu configuro três regras nessa ordem:

**Regra 1 (abrangente):** pega o nome mais longo do grupo.
→ Resultado parcial: `MARIA CASTILHO FIGUEIRA` (23 caracteres, ganha de `MARIA C FIGUEIRA` e `MARIA FIGUEIRA`).

**Regra 2 (mais restritiva):** se algum registro veio de um sistema classificado como confiável, use o nome dele.
→ Se o CRM é o sistema confiável, o resultado passa a ser `MARIA C FIGUEIRA`. **Sobrescreveu a regra 1.**

**Regra 3 (a mais restritiva):** se algum registro tem nome validado por fonte oficial, use esse.
→ Se nenhum tem, essa regra não se aplica, e o resultado final continua sendo o da regra 2.

Repara na lógica: a regra 1 é a **rede de segurança** — ela sempre produz alguma coisa, garantindo que o campo nunca fique vazio. As regras seguintes são **refinamentos** que só entram em ação quando a condição delas existe.

Se eu invertesse a ordem — restritiva primeiro, abrangente depois — a regra abrangente sobrescreveria tudo no final, e as regras finas nunca teriam efeito. Eu teria configurado três regras pra sempre obter o resultado da mais burra.

**Essa é a armadilha do módulo.** Ordem errada = regras sofisticadas que não fazem nada.

---

## PARTE 4 — Granularidade e regras complexas

A apostila:

**"A criação das regras é feita para um conjunto de campos, ou campo a campo. E as diversas técnicas para sobrevivência dos dados estão disponíveis nas configurações do estágio."**

Duas granularidades, e a distinção importa muito:

**Campo a campo.** Cada campo compete separadamente. O nome pode vir do registro do Portal, o CPF do registro do CRM e o endereço do registro do PDV. O Golden Record vira um **Frankenstein** — e isso é intencional, é exatamente o que a apostila do Módulo 6 chamou de "o melhor registro pode ser a composição de várias duplicatas".

**Conjunto de campos.** Um bloco de campos viaja junto. Isso existe pra evitar incoerência.

Exemplo concreto de por que o conjunto é necessário: imagina que o endereço é composto por logradouro, número, complemento, bairro, cidade, UF e CEP. Se eu deixar cada um competir sozinho, eu posso acabar com o logradouro do endereço antigo em Brasília e o CEP do endereço novo em São Paulo. O resultado é um endereço que **não existe**.

Então endereço tem que sobreviver **em bloco**: ou vem tudo do registro A, ou vem tudo do registro B.

Mesma lógica pra DDD e telefone: não adianta pegar o DDD de um e o número de outro.

**Essa é a regra prática:** campos que só fazem sentido juntos, sobrevivem juntos.

E a apostila menciona:

**"Existe também a possibilidade de criação de regras complexas de sobrevivência fazendo a combinação de técnicas."**

[⚠️ CONFERIR NA APOSTILA: a apostila diz que **"as diversas técnicas para sobrevivência dos dados estão disponíveis nas configurações do estágio"** e que dá pra combinar técnicas — mas **não lista nenhuma técnica pelo nome**. Os slides que mostram isso são screenshots da tela de configuração do SURVIVE. Essa é a lacuna mais séria do módulo: as técnicas concretas (tipicamente coisas como *most frequent*, *longest*, *shortest*, *most recent*, *first/last record*, ou regra por expressão) só existem na imagem. **Anotar a lista de técnicas do slide é obrigatório** — sem isso não dá pra configurar nem discutir sobrevivência.]

Os exemplos que eu dei acima ("nome mais longo", "sistema mais confiável") são ilustrações minhas do mecanismo, construídas pra explicar a lógica de ordenação. **Não são as técnicas nomeadas na apostila** — confira o slide pra saber os nomes reais.

---

## PARTE 5 — O Golden Record

E a apostila fecha o módulo com a definição consolidada, que é a definição mais completa de Golden Record em toda a apostila:

**"Os registros, após serem padronizados, validados e enriquecidos, passam pelas etapas de match e sobrevivência, resultando em um cadastro único."**

**"Como a composição desse registro único pode ter origem em diversas representações do mesmo, chamamos esse registro de GOLDEN RECORD ou REGISTRO MESTRE, pois conseguimos reunir a versão dos dados e formar o melhor registro."**

**"O Golden Record pode ser composto por dados de diversos registros, cuja informação tenha sido definida mediante a regra de sobrevivência."**

Repara que essa primeira frase é o **pipeline inteiro em uma linha**:

> padronizados (Mód. 5) → validados (Mód. 5) → enriquecidos (Mód. 5) → match (Mód. 6) → sobrevivência (Mód. 7) → **cadastro único**

E o ponto conceitual mais importante do módulo está na última frase: **o Golden Record pode ser composto por dados de diversos registros.**

Isso significa que **o Golden Record não é nenhum dos registros de origem.** Ele não é "o melhor cadastro escolhido entre os três". Ele é um registro **novo**, que possivelmente não existe em sistema nenhum.

Volta pro exemplo da Maria. O Golden Record dela pode ficar assim:

| Campo | Valor que sobreviveu | De onde veio |
|---|---|---|
| Nome | `MARIA CASTILHO FIGUEIRA` | Portal |
| Segmento | `Premium` | Portal |
| CPF | `11344567801` | Portal |
| Endereço | `SQS 110 BLOCO A AP 610` | CRM (padronizado no Mód. 5) |
| E-mail | `maria.figueira@...` | Ponto de Vendas |
| Produtos | `1234, 5764, 8674` | união dos três |
| Sexo | `F` | traduzido/deduzido |

**Nenhum dos três sistemas tem esse registro.** Nenhum deles tinha nome completo *e* endereço completo *e* e-mail *e* os três produtos. O Golden Record é a montagem — e é por isso que ele é "melhor" que qualquer origem individual.

E é exatamente por isso que a **Trilha BIP-BUP** do Módulo 3 existe. Se o Golden Record é uma montagem, alguém vai perguntar "de onde veio esse endereço?". A trilha responde.

[⚠️ CONFERIR NA APOSTILA: existem três slides neste módulo cujo título é apenas "Regras de Sobrevivência", sem nenhum texto — um logo na abertura, um no meio e um no fim. São imagens: provavelmente a tela de configuração do estágio SURVIVE, o exemplo de regras complexas, e possivelmente um diagrama de composição do Golden Record. Como o módulo tem só 8 slides, esses três são quase metade do conteúdo. **É o módulo onde mais conteúdo está preso em imagem.**]

---

## TRANSIÇÃO PRO MÓDULO 8

Então: acabou a esteira automática.

Vale olhar pra trás e ver o caminho completo, porque agora ele fecha:

O dado entrou pelo **SIF**, virou linha na **STG** com rastro na trilha. Foi padronizado, validado e enriquecido, virando **BIP**, com os problemas anotados na **BQA**. Foi comparado pelo **matching**, ganhou um `qsMatchSetID`, e os duvidosos foram pra **BQA**. E agora, pela **sobrevivência**, virou um Golden Record na **BUP**, com a formação registrada na **Trilha BIP-BUP**.

A máquina fez tudo o que ela sabe fazer.

**Mas ela deixou trabalho na mesa.** E é aqui que está a dependência lógica com o último módulo — e ela é diferente de todas as anteriores.

Até agora, cada módulo dependia do anterior porque **precisava do resultado dele**. O Módulo 8 depende dos anteriores por outra razão: ele existe porque os anteriores **não são suficientes sozinhos**.

Olha o que ficou pendente:

- Os **clericals** do Módulo 6 estão na BQA, esperando alguém decidir se são a mesma pessoa ou não.
- Os **inválidos** do Módulo 5 estão na BQA, esperando alguém corrigir.
- Os casos de **split e merge** precisam de alguém que perceba o erro e mande corrigir.
- As **traduções de domínio** da BCR precisam de alguém que cadastre quando entra sistema novo.
- Os **enquadramentos legais** da WDR precisam de alguém do jurídico que formalize.
- E alguém precisa **olhar o Golden Record** e responder se ele está bom.

Nada disso é automatizável. Tudo isso é **curadoria**.

E a ferramenta pra tudo isso é uma só: o **MD2 Quality Manager**, que apareceu de raspão em quase todos os módulos e finalmente vai ser o assunto principal.

O Módulo 8 — Gestão de Dados Mestres e Curadoria — é onde o ser humano entra em cena. E é o que faz o MDM ser uma disciplina viva e não um projeto que rodou uma vez e apodreceu.

---

## AUTO-TESTE — Módulo 7

> **Pare a gravação aqui. Responda em voz alta, sem olhar o texto.**

**1.** O que é o `qsMatchSetID`, quem gera ele, e como o estágio SURVIVE usa essa chave? Explique o elo entre o Módulo 6 e o Módulo 7.

**2.** Por que a ordem das regras de sobrevivência importa, e por que a recomendação é "abrangente no começo, restritiva no fim"? Descreva o que acontece se você inverter a ordem.

**3.** Explique a diferença entre sobrevivência campo a campo e por conjunto de campos, e dê um exemplo concreto de um caso em que usar campo a campo produziria um dado incoerente.

**4.** *(a pergunta que amarra tudo)* Por que o Golden Record pode não ser igual a nenhum dos registros de origem? E qual camada me permite descobrir de onde veio cada pedaço dele?

---

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
