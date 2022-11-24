Nas seções anteriores vimos que o código React é declarativo, não imperativo, portanto a renderização do componente não deve produzir efeitos colaterais.
Contudo, efeitos colaterais são comuns (e desejados) em tratadores de eventos, como resultado de ações do usuário.
Por exemplo, podemos alterar estado, disparar o carregamento de dados, navegar para outra página, ou qualquer outro tipo de código imperativo.

Existem cenários, porém, nos quais precisamos de efeitos colaterais após renderizar um componente.
O exemplo mais comum é o carregamento inicial de dados (via requisição HTTP).
Nesta seção veremos como fazer isso de forma correta.

### O hook `useEffect`

O hook `useEffect` permite que executemos uma função passada como parâmetro, contendo efeito colateral, após a renderização do componente.
Chamaremos esse tipo de código, a partir de agora, simplesmente de **efeito**.
A forma mais básica de utilizar `useEffect` é:

```tsx
import { useEffect } from "react";

function MeuComponente() {
  useEffect(() => {
    // Aqui executamos o efeito desejado.
    // Esta função será executada após TODA renderização deste componente.
  });

  return <div>JSX qualquer</div>;
}
```

No entanto, é muito mais comum utilizar `useEffect` passando dois parâmetros, onde o segundo é um _array_ de valores que são dependências do efeito.
Neste caso, o efeito executa após a primeira renderização e sempre que um dos valores passados no _array_ mudar.

```tsx
useEffect(
  () => {
    // Esta função será executada após a primeira renderização e sempre que valor1 ou valor2 mudar.
  },
  [valor1, valor2] // Suponha que existam variáveis valor1 e valor2.
);
```

Podemos inclusive passar um _array_ vazio como parâmetro.
Neste caso, o efeito executa apenas após a primeira renderização.

```tsx
useEffect(
  () => {
    // Esta função será executada após a primeira renderização.
  },
  [] // Passar um array vazio é diferente de não passar o segundo parâmetro.
);
```

https://danilofes-curso-react.netlify.app/api/cardapio.json
