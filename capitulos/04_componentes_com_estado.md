Nas seções anteriores vimos como definir componentes, receber props e gerar elementos no DOM por meio de JSX.
No entanto, um recurso fundamental para a construção de interfaces gráficas ainda não foi discutido: estado.

Para começar a entender como trabalhar com estado em React, vamos considerar como exemplo o componente `Counter`.
Este componente exibe o valor de um contador e provê dois botões:

- _Incrementar_: acrescenta 1 no contador.
- _Reiniciar_: volta o contador para zero.

Abaixo temos uma demonstração de seu funcionamento.

<iframe src="https://codesandbox.io/embed/react-c04-contador-6k2qth?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:510px; border:0; overflow:hidden;"
     title="react-c04-contador"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Este é o código-fonte do componente:

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
A única maneira de atualizar o estado é chamando a função de atualização associada a ele.
Não funcionaria, por exemplo, tentar atribuir um valor à variável `counter`:

```tsx
counter = counter + 1; // isto não funciona
```

De forma semelhante, a função `reset` também atualiza o estado por meio da chamada à `setCounter`, voltando o contador para zero.
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

Visto o exemplo acima, é importante entendermos com mais profundidade como o React exibe os componentes na página e lida com atualizações.
No jargão de React, este processo é chamado de renderização.
Como vimos na introdução, a renderização de componentes é iniciada por um código como este:

```tsx
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MeuComponente />);
```

A partir daí, o React vai chamar a função `MeuComponente`, que retorna uma árvore de elementos JSX.
Estes elementos, por sua vez, serão transformados nos elementos HTML correspondentes e adicionados ao DOM, completando o processo de renderização.

No entanto, se o componente possui estado
