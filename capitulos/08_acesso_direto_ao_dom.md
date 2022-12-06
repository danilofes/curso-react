Em React nós privilegiamos o código declarativo e normalmente não interagimos diretamente com o DOM.
No entanto, em determinadas situações, isso é inevitável.
Para fins de exemplo, ações como dar foco em um campo ou alterar a posição do scroll do elemento não podem ser expressadas declarativamente, pois precisamos chamar funções nativas dos elementos.
Para tais casos, o React nos oferece um mecanismo para guardar referências para elementos do DOM, conhecido como _ref_.

### O hook `useRef`

O hook `useRef` nos permite armazenar um valor que persiste durante toda a vida de um componente, assim como o `useState`.
A grande diferença entre ambos é que com `useRef`, mudanças no valor não fazem que o componente seja renderizado novamente.
Embora `useRef` possa ser utilizado para armazenar qualquer coisa, o caso de uso mais frequente para ele é armazenar referências a elementos, para que tenhamos acesso direto ao DOM.

Todo elemento React que corresponda a um elemento HTML nativo aceita uma propriedade `ref` que pode receber um objeto criado com `useRef`.
Ao renderizar o componente pela primeira vez, ou seja, ao montar o componente, a referência ao elemento correspondente do DOM é armazenada no objeto.
O exemplo a seguir demonstra esse comportamento:

```tsx
import { useRef } from "react";

export default function RefExample() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Dá foco no campo</button>
    </div>
  );
}
```

No componente `RefExample`, usamos `useRef` para criar o objeto `inputRef`.
Este objeto é então usado para referenciar o elemento `input` e chamar a função `focus` do mesmo quando pressionamos o botão.
Este é o comportamento resultante:

<iframe src="https://cralmg-react-useref.stackblitz.io" style="border:4px solid #ddd; width:400px; height:100px; margin: 1rem 0"></iframe>

É importante ressaltar os seguintes pontos com relação ao código-fonte:

- `useRef` recebe como parâmetro o valor inicial (assim como `useState`).
  Não temos como acessar o elemento `input` neste momento (ele nem existe no DOM ainda), portanto precisamos inicializar com o valor `null`.
- `useRef` recebe o tipo parametrizado `HTMLInputElement | null`.
  Isso é necessário, neste caso, pois se omitíssemos o tipo, o compilador inferiria o tipo como `null`, visto que esse é o valor inicial.
- Passamos `inputRef` como valor da propriedade `ref` no elemento `input`.
  Esta é a maneira do React vincular a referência com o elemento.
- O valor de uma referência é sempre acessado pela propriedade `current`.
  Observe que no tratador do evento `click` do botão, usamos `inputRef.current?.focus()`.

:::info
**Nota:** Acessar `inputRef.current` durante a renderização seria um erro, pois tal valor só estará definido após a primeira renderização, quando o componente estiver montado.
Só é seguro acessar o valor de uma referência em efeitos ou tratadores de eventos.
:::

### Callback ref

Em vez de passar um objeto criado por meio do `useRef`, a propriedade `ref` também pode receber uma função callback.
Esta função será chamada pelo React passando o elemento como parâmetro quando o componente for montado, e também será chamada novamente passando `null` como parâmetro quando o elemento for desmontado.

```tsx
export default function RefCallbackExample() {
  function callback(el: HTMLDivElement | null) {
    if (el) {
      // Montou o componente, el contém uma referência para o div.
    } else {
      // Desmontou o componente (el === null).
    }
  }

  return <div ref={callback}>Teste</div>;
}
```
