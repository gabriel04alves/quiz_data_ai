# Métricas de avaliação

## Precisão e recall

Precisão é a fração de exemplos classificados como positivos que realmente são
positivos; responde "quando o modelo diz sim, com que frequência ele acerta".
Recall é a fração de positivos reais que o modelo conseguiu identificar; responde
"de tudo que era positivo, quanto o modelo encontrou". Há um trade-off entre as
duas: aumentar o limiar de decisão costuma elevar a precisão e reduzir o recall.

## F1 e acurácia

O F1-score é a média harmônica entre precisão e recall, útil quando se quer um
único número que penalize desequilíbrio entre as duas. A acurácia — fração total
de acertos — pode enganar em bases desbalanceadas: um classificador que sempre
prevê a classe majoritária pode ter acurácia alta e recall zero na classe rara.
