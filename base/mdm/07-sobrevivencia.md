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
