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
