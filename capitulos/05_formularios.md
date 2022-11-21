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

Abaixo temos uma possível implementação do componente usando um formulário não controlado.

```tsx
export default function Adder() {
  const [sum, setSum] = useState(0);

  return (
    <div>
      <form onSubmit={addInputs}>
        <input type="number" name="n1" defaultValue="0" />
        <input type="number" name="n2" defaultValue="0" />
        <button type="submit">Soma</button>
      </form>
      <p>O resultado é: {sum}</p>
    </div>
  );

  function addInputs(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const n1 = formEl.elements["n1"].valueAsNumber;
    const n2 = formEl.elements["n2"].valueAsNumber;
    setSum(n1 + n2);
  }
}
```

O componente começa usando `useState` para declarar `sum`/`setSum`.
Este estado é usado para armazenar o resultado da soma.
Em seguida o componente retorna os elementos da interface, contendo o formulário, dois elementos `input` e o botão de submissão.
Note que o elemento `form` possui um tratador de evento _submit_ (`addInputs`), o qual discutiremos adiante.
Note também que os elementos `input` possuem a propriedade `defaultValue`, que é usada para informar o valor inicial dos campos.
Não devemos usar `value` neste caso, pois essa propriedade possui comportamento especial no React e só deve ser utilizada em formulários controlados, como veremos na seção seguinte.

Por fim, vamos analisar a função `addInputs`.
Primeiro ela chama `e.preventDefault()`, evitando que o navegador faça _post_ no formulário.
Em seguida, capturamos uma referência ao elemento `form` por meio de `e.currentTarget`.
Com esta referência, podemos obter os elementos `input` via `name` e pegar o valor com `valueAsNumber`.
Todo esse código usa APIs nativas para acessar o DOM, sem React envolvido.
Por fim, calculamos o valor da soma e usamos `setSum` para alterar o estado.
Isso disparará uma nova renderização do componente e a interface será atualizada.
Em resumo, na abordagem não controlada nós usamos o React apenas para gerar os `input`s e não controlamos seus valores, eles ficam armazenados apenas no DOM.

### Formulários controlados

Agora, vamos reimplementar o componente com a abordagem controlada. Eis o novo código-fonte.

```tsx
export default function AdderControlled() {
  const [sum, setSum] = useState(0);
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);

  return (
    <div>
      <form onSubmit={addInputs}>
        <input type="number" value={n1} onChange={(e) => setN1(e.target.valueAsNumber)} />
        <input type="number" value={n2} onChange={(e) => setN2(e.target.valueAsNumber)} />
        <button type="submit">Soma</button>
      </form>
      <p>O resultado é: {sum}</p>
    </div>
  );

  function addInputs(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSum(n1 + n2);
  }
}
```

A primeira mudança importante é que temos mais duas chamada à `useState`, pois agora armazenamos os valores de ambos os `input`s como estado.
Em segundo lugar, passamos as propriedades `value` e `onChange` para cada `input`, por exemplo:

```tsx
<input type="number" value={n1} onChange={(e) => setN1(e.target.valueAsNumber)} />
```

Quando atribuímos `n1` à propriedade `value`, estamos tornando o `input` controlado.
Com isso, o valor preenchido no campo será sempre o valor armazenado no estado.
No entanto, neste caso precisamos também definir `onChange` como uma função que obtém o valor do elemento e atualiza o estado correspondente.
Se definirmos `value` sem definir `onChange`, o campo ficaria não editável.

:::info
**Nota:**
O React trata `onChange` de forma diferente ao evento `change` nativo de elementos HTML.
Enquanto o primeiro é disparado em tempo real, a cada caractere digitado, o segundo tipicamente só é disparado quando um `input` perde o foco.
Você pode sempre usar `onChange` quando deseja tratar elementos de formulários de forma controlada, independentemente se está usando `input`, `select` ou `textarea`.
:::
