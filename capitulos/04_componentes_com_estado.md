Nas seções anteriores vimos como definir componentes que recebem props e geram elementos no DOM de acordo com os dados recebidos.
No entanto, um recurso fundamental para a construção de interfaces gráficas ainda não foi discutido: estado.

Para começar a entender como trabalhar com estado em React, vamos considerar como exemplo o componente `Counter`.
Este componente exibe o valor de um contador e provê dois botões:

- _Incrementar_: acrescenta 1 no contador.
- _Reiniciar_: volta o contador para zero.

Abaixo temos uma demonstração de seu funcionamento.

<iframe src="https://cralmg-react-counter.stackblitz.io/" style="border:4px solid #ddd; width:300px; height:100px"></iframe>

### Como adicionar estado a um componente

O componente `Counter`, portanto, possui estado: o valor do contador.
Vamos agora analisar seu código-fonte:

```tsx
import { useState } from "react";

export default function Counter() {
  const [counter, setCounter] = useState(0);

  function increment() {
    setCounter(counter + 1);
  }

  function reset() {
    setCounter(0);
  }

  return (
    <div>
      <div>Valor: {counter}</div>
      <button onClick={increment}>Incrementar</button>
      <button onClick={reset}>Reiniciar</button>
    </div>
  );
}
```

O primeiro ponto que devemos observar é a chamada à função `useState`.

```tsx
const [counter, setCounter] = useState(0);
```

Ao chamar tal função, informamos ao React que armazenaremos estado no componente.
Esta função recebe como parâmetro um valor inicial a ser armazenado (neste caso, zero, o valor inicial do contador) e retorna um array com dois valores:

- o valor atual armazenado no estado;
- a função para atualizar o estado.

No linha de código acima, usamos desestruturação para atribuir estes valores às variáveis `counter` e `setConter`, respectivamente.
Podemos armazenar tanto tipos primitivos quanto objetos no estado.
O compilador TypeScript é capaz de inferir o tipo armazenado no estado com base no valor inicial informado (neste caso um `number`).

Após declarar o estado, definimos a função `increment`:

```tsx
function increment() {
  setCounter(counter + 1);
}
```

Tal função altera o estado por meio da chamada à `setCounter`, passando como parâmetro o novo valor (`counter + 1`).
De forma semelhante, a função `reset` também atualiza o estado por meio da chamada à `setCounter`, voltando o contador para zero.
A única maneira válida de atualizar o estado é chamando a função de atualização associada a ele.
Por fim, o componente retorna o JSX:

```tsx
return (
  <div>
    <div>Valor: {counter}</div>
    <button onClick={increment}>Incrementar</button>
    <button onClick={reset}>Reiniciar</button>
  </div>
);
```

Nele usamos interpolação para exibir o valor do estado (`counter`) e chamamos as funções `increment` e `reset` quando clicamos nos botões correspondentes.

### Renderização de componentes e o Virtual DOM

Visto o exemplo acima, é importante entendermos com mais profundidade como o React exibe os componentes na página e lida com atualizações (no jargão de React, este processo é chamado de renderização).
Como vimos na introdução, a renderização de componentes é iniciada por um código como este:

```tsx
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MeuComponente />);
```

A partir daí, o React vai chamar a função `MeuComponente`, que retorna uma árvore de elementos React.
Esta árvore de elementos é chamada de _virtual DOM_, pois trata-se de uma representação dos elementos que serão inseridos no DOM, mas que ainda não são elementos reais.
O React então transforma o virtual DOM em elementos HTML e os adiciona ao DOM, completando a renderização.

Se `MeuComponente` não tiver estado, a renderização inicial será a primeira e única.
No entanto, supondo que `MeuComponente` possua estado, a cada mudança de estado o React dispara um novo processo de renderização.
Sendo assim, a função `MeuComponente` é chamada novamente para computar o novo virtual DOM.
Agora, porém, já existem elementos reais no DOM, provenientes da renderização anterior.
O React então faz uma comparação entre o DOM e o virtual DOM e altera apenas os nós necessários para atualizar a página.

A grande vantagem de se usar React, portanto, reside no fato de que não precisamos nos preocupar em como atualizar a interface.
Em um componente, nós simplesmente descrevemos como a interface deve ser, dados o _props_ e o estado atual.
Ou seja, o código-fonte torna-se mais declarativo e menos imperativo.
Isto não parece uma grande vantagem para componentes pequenos como o que construímos, mas conforme nossos componentes ficam maiores e mais complexos podemos perceber a vantagem deste paradigma.

### Estado e imutabilidade

Vamos considerar uma nova versão do componente `Counter`, que em vez de armazenar um `number` no estado, armazena um objeto que possui uma propriedade `counter` do tipo `number`.
Poderíamos ficar tentados a fazer um código como esse:

```tsx
export default function CounterObj() {
  const [obj, setObj] = useState({ counter: 0 });

  function increment() {
    obj.counter += 1; // isto não vai funcionar
  }

  return (
    <div>
      <div>Valor: {obj.counter}</div>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

Ao testar este componente, perceberemos que ele não funciona: o botão Incrementar não faz com que o valor do contador mude.
Mas agora que sabemos mais sobre React, podemos entender o motivo.
Quando executamos `obj.counter += 1;`, o valor do contador é alterado, mas o React não faz ideia que o estado do componente mudou e, portanto, não dispara o processo de renderização novamente.
Se não chamarmos `setObj`, o componente jamais será renderizado novamente.
Vamos então tentar um segunda implementação da função `increment`:

```tsx
function increment() {
  obj.counter += 1;
  setObj(obj); // isto também não vai funcionar
}
```

Agora mudamos `counter` e chamamos `setObj`, mas o componente continuará não funcionando.
O problema agora é outro.
Ao chamar `setObj` o React tentará atualizar o estado, mas ele vai comparar o valor antigo com novo e perceberá que ambos são o mesmo objeto, portanto, nada será feito.
A única forma do React entender que houve uma mudança é chamando `setObj` passando um novo valor, ou seja, um novo objeto:

```tsx
function increment() {
  setObj({ counter: obj.counter + 1 });
}
```

Agora sim nosso componente funcionará.
De fato, para trabalhar com React, devemos abraçar o conceito de imutabilidade.
Tipos primitivos como `number` ou `string` são inerentemente imutáveis (é impossível mudar seu conteúdo sem criar um novo valor).
Em contraste, objetos (e _arrays_) são mutáveis, mas **nunca devemos alterar o conteúdo de objetos diretamente**.
Crie um novo objeto (ou _array_) com as alterações desejadas.
