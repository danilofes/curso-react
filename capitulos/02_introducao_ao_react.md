React é uma biblioteca JavaScript que nos ajuda a construir a interfaces gráficas de aplicações web.

Existem basicamente duas maneiras de utilizar React: utilizá-lo diretamente em um script no navegador ou criar um projeto React, utilizando um conjunto de ferramentas de desenvolvimento.
Nas seções seguintes vamos descrever estas duas formas.

### Usando React diretamente no navegador

A maneira mais simples de adicionar React em uma aplicação web é adicionar os scripts do React diretamente em um documento HTML.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Meu primeiro componente React</title>
    <!-- Devemos importar as bibliotecas react e react-dom -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  </head>
</html>
```

Feito isso, podemos definir nosso primeiro componente React.

```html
<script>
  // Este é um componente React
  function Componente1() {
    return React.createElement("div", null, "Hello world!");
  }
</script>
```

Um componente React é definido por meio de uma função JavaScript.
Tal função deve retornar um _React Node_.
Neste caso, estamos retornando um elemento `div`, cujo conteúdo é "Hello world!".
Ou seja, quando tal elemento for exibido na interface, espera-se que ele corresponda ao HTML `<div>Hello world!</div>`.
De forma geral, podemos dizer objetivo do React é nos ajudar a criar (au atualizar) elementos na página dinamicamente, via JavaScript.

No entanto, o código acima não exibe conteúdo algum na página, pois não renderizamos o componente.
Para isso, devemos criar um nó raiz usando a função `ReactDOM.createRoot` e chamar sua função `render`.
O exemplo completo ficaria assim.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Meu primeiro componente React</title>
    <!-- Devemos importar as bibliotecas react e react-dom -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  </head>
  <body>
    <!-- Este é o elemento onde exibiremos o componente -->
    <div id="root"></div>
    <script>
      // Este é um componente React
      function Componente1() {
        return React.createElement("div", null, "Hello world!");
      }

      // Devemos renderizar nosso componente
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(React.createElement(Componente1));
    </script>
  </body>
</html>
```

Agora assim, teremos como resultado uma página com a mensagem "Hello world!".

### Criando um projeto com create-react-app

Embora possamos desenvolver em React da maneira descrita na seção anterior, essa não é a forma recomendada de utilizá-lo.
Usar `React.createElement` para construir interfaces mais complexas torna o código muito verboso.
Por exemplo, suponha que queiramos gerar o seguinte HTML:

```html
<ul>
  <li>Item 1</li>
  <li>Item 2 com <strong>texto destacado</strong></li>
</ul>
```

Precisaríamos do seguinte componente:

```js
function Componente() {
  return React.createElement("ul", null, [
    React.createElement("li", null, "Item 1"),
    React.createElement("li", null, ["Item 2 com ", React.createElement("strong", null, "texto destacado")]),
  ]);
}
```

Para tornar o código mais fácil de trabalhar, o time do React criou uma extensão da linguagem JavaScript chamada de JSX, na qual usamos uma sintaxe similar a HTML para criar elementos React.
Usando tal recurso, o código fica bem mais conciso:

```js
function Componente() {
  return (
    <ul>
      <li>Item 1</li>
      <li>
        Item 2 com <strong>texto destacado</strong>
      </li>
    </ul>
  );
}
```

O problema é que agora tal código não é mais JavaScript puro e, portanto, não pode ser executado diretamente no navegador.
Devemos usar primeiro uma ferramenta que transforma JSX em JavaScript.

Podemos criar um projeto React, já configurado com todas as ferramentas que precisamos, por meio do comando.

```
npx create-react-app nome-da-app
```

Feito isso, o projeto será criado no diretório `nome-da-app`, e conterá uma estrutura de arquivos similar a abaixo (omitindo alguns detalhes):

```
node_modules/
public/
    index.html
src/
    App.js
    index.js
package.json
```

Em `src/App.js` encontramos o componente principal da nossa aplicação e em `src/index.js` , tal componente é renderizado no elemento com id `root` que é definido em `public/index.html`.

::: info
**Nota:** Ao usar o `create-react-app`, ele usará sempre a versão mais recente do React e das ferramentas associadas.
Por isso, disponibilizamos no curso um arquivo ZIP com um projeto base com a versão fixa (18.2.0).
Recomendamos que você use tal projeto base como ponto de partida dos exercícios para evitar surpresas, pois futuras versões do React podem introduzir quebras de compatibilidade do código fonte.
:::

### Construindo o projeto React

Para construir o projeto React, executamos os comandos.

```
cd nome-da-app
npm run build
```

Como resultado, teremos no subdiretório `build` uma estrutura similar a abaixo (mais uma vez, omitindo alguns detalhes):

```
static/
    css/
    js/
        main.1726387623.js
index.html
```

Estes são os arquivos estáticos HTML, JavaScript e CSS gerados a partir do código fonte.
Eles podem ser disponibilizados em um servidor web e carregados no browser.
A construção do projeto realiza uma série tarefas, entre elas:

- Realiza verificações de erros ou _warnings_ no projeto;
- Transforma a sintaxe JSX em JavaScript puro;
- Transforma alguns recursos de JavaScript em código JavaScript tradicional (ES5) para obter maior compatibilidade com navegadores antigos;
- Concatena todo o código JavaScript em um arquivo único (este processo é conhecido como _bundling_);
- Também concatena todo o código CSS em um arquivo único;
- Monta o `index.html` final, referenciando os arquivos JavaScript e CSS construídos.

::: info
**Nota:** Todo o ferramental de criação e construção do projeto executa no Node.js, daí a necessidade de instalá-lo.
O `create-react-app` internamente utiliza ferramentas como [ESLint](https://eslint.org/), [Babel](https://babeljs.io/) e [Webpack](https://webpack.js.org/) para realizar estas tarefas.
É possível configurar estas e outras ferramentas manualmente para trabalhar com React de forma mais livre, usando a estrutura de projeto e etapas de construção desejadas, sem depender do `create-react-app`.
No entanto, isto está fora do escopo deste curso.
:::

### Executando o projeto React em modo desenvolvimento

Você deve ter notado que a construção do projeto leva um tempo que não pode ser desprezado.
Portanto, teríamos um grande inconveniente se precisássemos construir o projeto a cada alteração no código para ver o resultado no navegador.
Felizmente isso não é necessário.
Ao executar o comando

```
npm start
```

iniciamos o servidor de desenvolvimento. Ele iniciará um servidor web que serve nossa aplicação em <http://localhost:3000/> e abrirá uma janela do navegador.
Além disso, qualquer alteração no código fonte dispara um processo de reconstrução e automaticamente recarrega a página.

### Utilizando React com TypeScript

Consulte a [documentação oficial do TypeScript](https://www.typescriptlang.org/docs/) para mais informações.
