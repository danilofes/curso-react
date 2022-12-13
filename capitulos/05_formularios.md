Praticamente toda aplicação web permite que o usuário faça entrada de dados e, portanto, precisa lidar com formulários e elementos de entrada de dados, como `input`, `select` e `textarea`.
Nesta seção vamos entender como lidar com estes elementos em React e como se dá a interação entre o estado de um componente o estado interno dos elementos.
Basicamente, veremos duas abordagens para lidar com formulários: não controlados e controlados.

### Formulários não controlados

Nesta abordagem nós NÃO armazenamos o estado interno dos elementos de entrada como estado de um componente React.
Ou seja, se temos um elemento `input` na interface, o valor digitado nele estará armazenado apenas no DOM.
Isto significa que para ler o valor precisamos acessar o DOM diretamente (normalmente em um tratador de eventos).
Como consequência, o valor do `input` não estará disponível durante a renderização do componente.

Para entender melhor, vamos considerar o componente `Adder` a seguir.
Ele possui dois campos numéricos como entrada e o botão Somar.
Ao apertar o botão, a soma dos número é exibida como resultado.

<iframe src="https://cralmg-react-counter-s9hfmb.stackblitz.io/" style="border:4px solid #ddd; width:100%; height:300px; margin: 1rem 0"></iframe>

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

Agora, vamos reimplementar o componente com a abordagem controlada. Eis o novo código-fonte:

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

A primeira mudança importante é que temos mais duas chamadas à `useState`, pois agora armazenamos os valores de ambos os `input`s como estado.
Em segundo lugar, passamos as propriedades `value` e `onChange` para cada `input`:

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

A terceira mudança importante é na função `addInputs`:

```tsx
function addInputs(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setSum(n1 + n2);
}
```

Agora que os valores dos campos estarão sempre sincronizados com os estados `n1` e `n2`, basta somá-los e chamar `setSum`.
A maior vantagem da abordagem controlada é, portanto, que temos acesso aos valores diretamente.
Qualquer mudança no estado reflete imediatamente na interface, e qualquer mudança na interface reflete imediatamente no estado.

Podemos nos beneficiar da abordagem controlada para tornar nosso componente ainda mais dinâmico.
Suponha que desejamos eliminar o botão Somar, ou seja, o resultado da soma aparecerá imediatamente conforme digitarmos.
O resultado final ficaria assim:

<iframe src="https://cralmg-react-counter-vhyb2n.stackblitz.io" style="border:4px solid #ddd; width:100%; height:300px; margin: 1rem 0"></iframe>

Este é o novo código-fonte:

```tsx
export default function AdderControlled() {
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const sum = n1 + n2;

  return (
    <div>
      <input type="number" value={n1} onChange={(e) => setN1(e.target.valueAsNumber)} />
      <input type="number" value={n2} onChange={(e) => setN2(e.target.valueAsNumber)} />

      <p>
        {n1} + {n2} = {sum}
      </p>
    </div>
  );
}
```

Note que em vez de ficar mais complicado, o código se tornou mais simples.
Podemos descartar o estado usado para armazenar a soma e computar `sum` durante a renderização.
Inclusive podemos usar `n1` e `n2` para exibir o resultado como `{n1} + {n2} = {sum}` (imagine como seria complicado fazer isso na abordagem não controlada).
Além disso, podemos remover o `form`, o botão e o tratador de evento _submit_.

### Especificidades de formulários controlados

Devemos conhecer algumas especificidades do tratamento de formulários controlados para os diferentes elementos de entrada de dados.

#### Elemento `select`

O elemento `select` em HTML nativo é definido da seguinte forma:

```html
<select>
  <option value="banana">Banana</option>
  <option selected value="laranja">Laranja</option>
  <option value="maca">Maçã</option>
</select>
```

Para usá-lo na abordagem controlada, devemos especificar `value`/`onChange` na tag `select` (em vez de usar o atributo `selected` na tag `option`):

```tsx
export default function SelectExample() {
  const [fruit, setFruit] = useState("laranja");

  return (
    <select value={fruit} onChange={(e) => setFruit(e.target.value)}>
      <option value="banana">Banana</option>
      {/* Esta opção virá marcada inicialmente */}
      <option value="laranja">Laranja</option>
      <option value="maca">Maçã</option>
    </select>
  );
}
```

Também é possível usar `select` múltiplo. Neste caso `value` aceita um _array_.

```tsx
export default function SelectMultipleExample() {
  const [fruits, setFruits] = useState(["laranja", "maca"]);

  return (
    <select
      multiple={true}
      value={fruits}
      onChange={(e) => {
        // primeiro transformamos a lista de opções selecionadas em array de string
        let values = Array.from(e.target.selectedOptions, (option) => option.value);
        setFruits(values);
      }}
    >
      <option value="banana">Banana</option>
      <option value="laranja">Laranja</option>
      <option value="maca">Maçã</option>
    </select>
  );
}
```

#### Elemento `input` do tipo `checkbox` ou `radio`

Utilize `checked`/`onChange` para controlar o valor de um _checkbox_:

```tsx
export default function CheckboxExample() {
  const [like, setLike] = useState(false);

  return (
    <label>
      <input type="checkbox" checked={like} onChange={(e) => setLike(e.target.checked)} /> Eu gosto de React
    </label>
  );
}
```

Também utilizamos `checked`/`onChange` para controlar o valor de elementos `input` do tipo _radio_:

```tsx
export default function CheckboxExample() {
  const [lib, setLib] = useState("react");
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLib(e.target.value);
  }

  return (
    <fieldset>
      <legend>Qual seu framework favorito?</legend>
      <label>
        <input type="radio" checked={lib === "angular"} value="angular" onChange={handleChange} /> Angular
      </label>
      <label>
        <input type="radio" checked={lib === "react"} value="react" onChange={handleChange} /> React
      </label>
      <label>
        <input type="radio" checked={lib === "vue"} value="vue" onChange={handleChange} /> Vue
      </label>
    </fieldset>
  );
}
```

#### Elemento `input` do tipo arquivo

Como o valor de elementos `<input type="file">` não podem ser definidos via JavaScript, apenas pelo própria ação do usuário, não podemos utilizá-los no modo controlado.
Utilize-o com a abordagem não controlada e APIs nativas.

### Formulários com múltiplos campos

Muitas vezes um formulário é utilizado para editar vários campos de um mesmo objeto de negócio.
Nada nos impede de salvar as informações no estado como um único objeto, como no exemplo abaixo, onde temos um objeto `user` cujos campos `name`, `email` e `phone` são editados no formulário:

```tsx
export default function UserFormExample() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    setUser({ ...user, [input.name]: input.value });
  }

  return (
    <form>
      <p>Preencha os dados para cadastrar uma conta.</p>
      <label>
        Nome: <input value={user.name} name="name" onChange={handleChange} />
      </label>
      <br />
      <label>
        E-mail: <input value={user.email} name="email" onChange={handleChange} />
      </label>
      <br />
      <label>
        Telefone: <input value={user.phone} name="phone" onChange={handleChange} />
      </label>
    </form>
  );
}
```

Observe que usamos a mesma função `handleChange` como tratador do evento `change` para todos os campos:

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  const input = e.target;
  setUser({ ...user, [input.name]: input.value });
}
```

Em sua implementação, sabemos qual campo editar pela propriedade `name` do `input`.
Note também que não alteramos o objeto `user`, construímos um novo objeto com o campo alterado.
Usar o mesmo objeto seria um erro, como discutimos na seção **Estado e imutabilidade**.

### Vantagens e desvantagens da abordagem controlada

A abordagem de formulários controlados é a recomendada pelo time do React para a maioria dos casos.
Ela nos oferece a possibilidade de:

- acessar o valor dos campos durante a renderização;
- alterar o valor dos campos alterando o estado, isto é particularmente útil para implementar tarefas como limpar ou restaurar os campos de um formulário.

No entanto, devemos considerar também suas desvantagens:

- precisamos definir `value`/`onChange` e gerir o estado de cada campo, o que pode tornar o código bastante verboso;
- cada caractere digitado em um `input` dispara uma mudança de estado e, consequentemente, uma nova renderização do componente, o que trás preocupações sobre a performance (falaremos mais sobre isso ao longo do curso).
