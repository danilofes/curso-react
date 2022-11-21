Praticamente toda aplicação web permite que o usuário faça entrada de dados e, portanto, precisa lidar com formulários e elementos de entrada de dados, como `input`, `select` e `textarea`.
Nesta seção vamos entender como lidar com estes elementos em React e como se dá a interação entre o estado de um componente o estado interno dos elementos.
Basicamente, veremos duas abordagens para lidar com formulários: não controlados e controlados.

### Formulários não controlados

Nesta abordagem nós NÃO armazenamos o estado interno dos elementos de entrada como estado de um componente React.
Ou seja, se temos um elemento `input` na interface, o valor digitado nele estará armazenado apenas no DOM.
Isto significa que para ler o valor precisamos acessar o DOM diretamente (normalmente em um tratador de eventos).
Como consequência, o valor do `input` não estará disponível durante a renderização do componente.

Para entender melhor melhor, vamos considerar o componente `Adder` a seguir.
Ele possui dois campos numéricos como entrada e o botão Somar.
Ao apertar o botão, a soma dos número é exibida como resultado.

<iframe src="https://cralmg-react-counter-s9hfmb.stackblitz.io/" style="border:4px solid #ddd; width:600px; height:120px"></iframe>

### Formulários controlados

:::info
**Nota:**
O React trata `onChange` de forma diferente ao evento `change` nativo de elementos HTML.
Enquanto o primeiro é disparado em tempo real, a cada caractere digitado, o segundo tipicamente só é disparado quando um `input` perde o foco.
Você pode sempre usar `onChange` quando deseja tratar elementos de formulários de forma controlada, independentemente se está usando `input`, `select` ou `textarea`.
:::
