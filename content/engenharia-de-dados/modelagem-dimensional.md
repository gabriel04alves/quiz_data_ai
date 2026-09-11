# Modelagem dimensional

## Tabela fato e tabelas dimensão

A modelagem dimensional organiza os dados de análise em torno de uma tabela fato
central, que guarda as métricas do processo de negócio (valores mensuráveis como
receita, quantidade ou duração), cercada por tabelas dimensão que dão contexto a
essas métricas — quem, o quê, quando e onde. O grão da tabela fato é a definição
do que uma linha representa e deve ser declarado antes de qualquer outra decisão
de projeto.

## Esquema estrela e floco de neve

No esquema estrela cada dimensão é uma única tabela desnormalizada, ligada
diretamente à fato. No floco de neve as dimensões são normalizadas em várias
tabelas relacionadas, o que economiza espaço mas aumenta o número de junções e
tende a piorar o desempenho de consulta. Para a maioria dos data warehouses
analíticos o esquema estrela é preferido pela simplicidade e velocidade.
