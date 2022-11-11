Componentes são a mais importante abstração fornecida pelo React.
Nós construímos interfaces em React por meio de componentes, que podem utilizar outros componentes, e assim sucessivamente, formando uma árvore.
Vimos anteriormente que componentes são simplesmente funções que retornam _React Elements_, mas eles não seriam de grande utilidade se não pudessem receber parâmetros.

### Props

Todo componente recebe um parâmetro, por convenção chamado de _props_, que é um objeto contendo as propriedades que tal componente requer.
Como estamos trabalhando com TypeScript, podemos inclusive explicitar na declaração de tipo as propriedades esperadas.
Vamos definir um novo componente "Hello World", agora recebendo _props_.

```tsx
function Hello(props: { name: string }) {
  return <div>Hello {props.name}</div>;
}
```

Note que definimos que o parâmetro `props` deve possuir a propriedade `name`.
Além disso, usamos a sintaxe `{props.name}` para incluir o valor de `props.name` no texto do elemento `div`.
Esta sintaxe é um recurso do JSX conhecido como interpolação.
Sempre que abrimos chaves dentro do JSX, podemos avaliar uma expressão TypeScript convencional.
Falaremos mais sobre este recurso em breve.

Usamos o componente `Hello` em JSX com sintaxe abaixo (elementos JSX podem ser elementos HTML nativos ou componentes React).

```tsx
<Hello name="Danilo" />
```

Como resultado, teremos no DOM:

```html
<div>Hello Danilo</div>
```

Em JSX, assim como passamos propriedade para componentes, podemos usar a mesma sintaxe para passar propriedades para elementos HTML.
Considere o exemplo a seguir.

```tsx
function Image(props: { url: string; description: string }) {
  return <img className="custom-image" src={props.url} alt={props.description} />;
}
```

Neste caso, passamos as propriedade `src` e `alt` para o elemento `img`. No entanto, usamos a sintaxe de interpolação, tendo em vista que estamos passando o valor de uma expressão TypeScript.

:::info
**Nota:** De forma geral, qualquer atributo HTML pode ser usado normalmente em JSX.
No entanto, você deve ter observado que usamos a propriedade `className` em vez de `class`.
Como `class` é uma palavra-chave reservada em JavaScript, o JSX usa `className` em seu lugar para evitar problemas com a sintaxe da linguagem.
Outra exceção é o atributo `for`, que deve ser escrito como `htmlFor` em JSX.
:::

### Exibição condicional

Como componentes são funções, podemos usar estruturas de controle convencionais como `if` ou `switch` para exibir elementos condicionalmente.
