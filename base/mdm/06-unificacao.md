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
