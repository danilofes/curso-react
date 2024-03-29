Componentes são a mais importante abstração fornecida pelo React.
Nós construímos interfaces em React por meio de componentes, que podem utilizar outros componentes, e assim sucessivamente, formando uma árvore.
Vimos anteriormente que componentes são simplesmente funções que retornam elementos React, mas eles não seriam de grande utilidade se não pudessem receber parâmetros.

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
Veremos esse recurso frequentemente nos próximos exemplos.

Elementos React (ou seja, tags JSX) podem representar elementos HTML nativos ou componentes React.
Usamos o componente `Hello` em JSX com sintaxe abaixo.

```tsx
function App() {
  return <Hello name="Danilo" />;
}
```

Como resultado, teremos os seguintes elementos na página (talvez você precise clicar em **Run this project** para visualizar):

<iframe src="https://cralmg-react-hello.stackblitz.io/" style="border:4px solid #ddd; width:100%; height:100px"></iframe>

Ou seja, o HTML resultante é `<div>Hello Danilo</div>`.

#### Propriedades de elementos HTML

Em JSX, assim como passamos propriedade para componentes, podemos usar a mesma sintaxe para passar propriedades para elementos HTML.
Considere o exemplo a seguir.

```tsx
function Image(props: { url: string; description: string }) {
  return <img className="custom-image" src={props.url} alt={props.description} />;
}
```

Neste caso, passamos as propriedade `src` e `alt` para o elemento `img`.
Observe que usamos a sintaxe de interpolação para passar o valor de `src` e `alt`, tendo em vista que estamos avaliando uma expressão TypeScript.
De forma geral, existem propriedades JSX correspondentes às propriedades dos elementos no DOM ou atributos da tag.
No entanto, usamos sempre o padrão de nomenclatura _camel case_ quando o atributo é composto por duas palavras.
Por exemplo, o atributo `tabindex` se tornaria `tabIndex` em JSX.

:::info
**Nota:**
Você deve ter observado que usamos a propriedade `className` em vez de `class` no exemplo anterior.
Como `class` é uma palavra-chave reservada em JavaScript, o JSX usa `className` em seu lugar para evitar problemas com a sintaxe da linguagem.
Outra exceção é o atributo `for`, que deve ser escrito como `htmlFor` em JSX.
:::

#### A propriedade `style`

O valor da propriedade `style` em uma tag JSX deve ser um objeto, não uma string.
Este objeto contém uma chave para cada propriedade CSS a ser informada, convertendo seu nome para _camel case_.
Por exemplo, considere o HTML abaixo:

```html
<div style="border: 2px solid green; padding-top: 4px">div com estilo</div>
```

Em JSX, ele poderia ser expresso como:

```tsx
<div style={{ border: "2px solid green", paddingTop: "4px" }}>div com estilo</div>
```

O React adiciona automaticamente a unidade `px` em certas propriedades numéricas.
Por exemplo, as duas linhas de código a seguir dariam o mesmo resultado:

```tsx
<div style={{ height: 10 }}>olá</div>

<div style={{ height: '10px' }}>olá</div>
```

#### Tratamento de eventos

O tratamento de eventos em React é feito com sintaxe semelhante à passagem de propriedades, por exemplo:

```tsx
import React from "react";

function EventHandling() {
  function handleClick(evt: React.MouseEvent) {
    console.log("the button was clicked");
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

É importante notar que o nome da propriedade é sempre em _camel case_, seguindo o padrão `onXxx`, onde `Xxx` é um nome de evento.
Ademais, o valor da propriedade deve ser uma função, que recebe como parâmetro um objeto de evento.

:::info
**Nota:**
No código acima usamos o tipo `React.MouseEvent` para anotar o parâmetro `evt` do handler do evento.
O React usa eventos sintéticos que encapsulam os eventos do DOM para normalizar o comportamento entre diferentes navegadores.
:::

#### Recebendo elementos React via props

Um componente pode receber elementos React via _props_.
Isso pode é muito útil quando nosso componente funciona como um contêiner para conteúdo arbitrário, como no exemplo abaixo:

```tsx
import { ReactNode } from "react";

function Panel(props: { title: string; content: ReactNode }) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>{props.content}</div>
    </div>
  );
}
```

Podemos utilizar o componente `Panel` da seguinte forma:

```tsx
<Panel
  title="Meu painel"
  content={
    <p>
      Este é um conteúdo arbitrário com diferentes elementos <strong>HTML</strong>
    </p>
  }
/>
```

Como vimos acima, o componente `Panel` recebe elementos React via propriedade `content`, cujo tipo é `ReactNode`.

No entanto, é possível tornar o código mais idiomático.
Se renomearmos a propriedade `content` para `children` podemos nos beneficiar de uma convenção do React para tornar o código JSX mais simples: o conteúdo passado dentro das _tags_ de abertura e fechamento do componente se tornam o valor da propriedade `children`.
Ou seja, o novo código ficaria da seguinte forma.

```tsx
function Panel(props: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>{props.children}</div>
    </div>
  );
}
```

```tsx
// O uso do componente agora fica assim:
<Panel title="Meu painel">
  <p>O conteúdo dentro da tag é implicitamente passado como valor da propriedade children.</p>
</Panel>
```

### Exibição condicional de elementos

Componentes frequentemente precisam exibir conteúdo diferente em diferentes condições.
Como componentes são funções, podemos usar estruturas de controle convencionais como `if`, `switch` ou o operador ternário (`? :`) para exibir elementos condicionalmente.

Considere o componente a seguir, que exibe um cartão com título e uma descrição opcional.

```tsx
function Card(props: { title: string; description?: string }) {
  if (props.description) {
    return (
      <div>
        <h3>{props.title}</h3>
        <div>{props.description}</div>
      </div>
    );
  } else {
    return (
      <div>
        <h3>{props.title}</h3>
      </div>
    );
  }
}
```

Neste componente testamos se existe valor em `props.description` e, por meio de um `if/else` exibimos elementos diferentes para cada caso.
Nó podemos reescrever este código de forma mais concisa com o operador ternário.

```tsx
function Card(props: { title: string; description?: string }) {
  return (
    <div>
      <h3>{props.title}</h3>
      {props.description ? <div>{props.description}</div> : null}
    </div>
  );
}
```

No exemplo acima usamos uma expressão ternária, dentro do JSX, que retorna um `div` com a descrição quando `props.description` é _truthy_ e retorna `null` caso contrário.
Neste caso nos beneficiando do fato que ao inserir `null` no JSX nada é exibido.
Mais especificamente, tanto `null` quanto string vazia, `false` ou `undefined` exibem nada.
Usando este conhecimento, é possível encurtar ainda mais o código com o operador `&&`.

```tsx
<div>
  <h3>{props.title}</h3>
  {props.description && <div>{props.description}</div>}
</div>
```

Este código funciona pois o operador `&&` retorna o primeiro operando caso ele seja _falsy_ e o segundo operando caso o primeiro seja _truthy_. Assim, tal expressão retornará o elemento `div` caso `props.description` esteja definido e `undefined` caso contrário. Este tipo de uso do operador `&&` é muito comum em JSX.

### Repetição de elementos

Podemos inserir um _array_ de elementos React no JSX por meio da sintaxe de chaves.
Com isso é possível, por exemplo, usar `for` para gerar elementos dinamicamente.
O componente abaixo exibe uma lista com 10 itens.

```tsx
function Repeticao() {
  let listItems = [];
  for (let i = 0; i < 10; i++) {
    listItems.push(<li>Item {i + 1}</li>);
  }
  return <ul>{listItems}</ul>;
}
```

É bastante comum gerarmos elementos React a partir de itens de um _array_.
Portanto, uma maneira elegante de fazer isso é usarmos a função `map` para transformar um array de objetos em um array de elementos React.
O componente `TodoList` a seguir exemplifica este cenário, ele recebe via _props_ uma lista de tarefas e as exibe como saída.

```tsx
interface TodoItem {
  id: number;
  description: string;
  done: boolean;
}

function TodoList(props: { tasks: TodoItem[] }) {
  return (
    <ul>
      {props.tasks.map((task) => (
        <li>{task.description}</li>
      ))}
    </ul>
  );
}
```

#### A propriedade key

Se exibirmos os dois exemplos de repetição anteriores no navegador iremos notar a seguinte mensagem no console:

```
Warning: Each child in a list should have a unique "key" prop.
```

O React está nos alertando que, quando exibimos um _array_ de elementos React, devemos atribuir a cada elemento um valor distinto para a propriedade `key`.
A propriedade `key` é usada internamente pelo React para atualizar o DOM de forma mais eficiente.
Portanto, o correto seria modificar o componente `TodoList` para sanar o problema:

```tsx
<ul>
  {props.tasks.map((task) => (
    <li key={task.id}>{task.description}</li>
  ))}
</ul>
```
