Nas seções anteriores discutimos como o React torna o código declarativo.
Ou seja, nós descrevemos como a interface deve ser, dados props e estado do componente.
Fazendo uma analogia com programação funcional, a função de renderização de um componente deve ser fazer uma computação pura, ou seja:

- para a mesma entrada (props e estado) deve retornar a mesma saída (JSX);
- não deve ter efeitos colaterais (alterar variáveis globais, fazer comunicação de rede, etc.).
