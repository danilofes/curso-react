Aplicações React tipicamente consistem em um único documento HTML e toda a interface é construída via JavaScript.
Neste tipo de arquitetura, que é conhecida com SPA (Single Page Application), é essencial que utilizemos roteamento do lado do cliente para representar diferentes telas como diferentes URLs.
Caso contrário, a experiência de usuário ficaria comprometida, pois mudanças de tela não ficariam representadas no histórico do navegador e as ações de voltar/avançar não funcionariam.
O React não oferece funcionalidades relacionadas ao roteamento do lado do cliente, mas existem bibliotecas de terceiros que nos auxiliam nessa tarefa.
A mais popular delas é [React Router](https://reactrouter.com/), que vamos estudar nesta seção.

### Adicionando React Router no projeto

O projeto criado via `create-react-app` é um projeto Node.js.
Sendo assim, a gestão de dependências do projeto, seja o React Router ou qualquer outra biblioteca adicional, pode ser feita via `npm`.
Para adicionar a dependência para o projeto, execute em um terminal, no diretório do projeto:

```
npm install react-router-dom
```

Este comando instalará a versão mais recente.
Se preferir instalar a versão exata utilizada no curso, mude o comando para:

```
npm install react-router-dom@6.4
```

Após a execução deste comando, o pacote será adicionado como dependência no arquivo `package.json` do projeto e instalado no diretório `node_modules`.
A partir daí, já poderemos importá-lo e utilizá-lo no código-fonte.

:::info
**Nota:**
O projeto base fornecido no curso já vem com React Router instalado, portanto você pode pular a instalação deste pacote.
:::

### Escolhendo o tipo de roteamento

Para usar o React Router, primeiro devemos escolher uma dentre duas opções de roteamento do lado do cliente:

- **Browser Router**: Faz o roteamento baseado na URL da página.
  A URL de uma página fica assim: `http://meu.servidor/pagina-1`.
  Este método usa a [API History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) para manipular o histórico de navegação sem precisar recarregar o documento.
- **Hash Router**: Faz o roteamento baseado apenas no `location.hash`, ou seja, a parte final da URL a partir do caractere `#` (tecnicamente denominada de [URI Fragment](https://en.wikipedia.org/wiki/URI_fragment)).
  A URL de uma página fica assim: `http://meu.servidor/#/pagina-1`.
  Este método não precisa usar a API History pois alterar `location.hash` NÃO faz com que o documento seja recarregado.

A estratégia de roteamento escolhida tem mais impacto no _back end_ da aplicação do que no _front end_.
Usando o Browser Router, o _back end_ receberá requisições HTTP com URLs diferentes para cada tela, mas deve tomar o cuidado de servir o mesmo documento principal, contendo a aplicação React.
Usando o Hash Router, o _back end_ receberá requisições HTTP apenas na URL raiz, pois a _URI Fragment_ não é enviada pelo navegador.
Resumindo, com Hash Router não precisamos de configuração alguma no _back end_, portanto esta costuma ser a solução mais simples.
No entanto, Browser Router é uma solução mais elegante e que dá maior flexibilidade, por exemplo, para usar recursos mais avançados do React como a renderização do lado do servidor.
Dito isto, no restante da seção usaremos Hash Router, por sua simplicidade, visto que a maneira de usar React Router não se altera.

### Criando o router

O primeiro passo para configurar o roteamento na aplicação é criar o objeto router usando a função `createHashRouter` (ou `createBrowserRouter`).
Esta função recebe como parâmetro um _array_ de objetos que descrevem cada rota da aplicação.
Cada rota descreve o padrão de URL que a ativa e qual elemento deve ser exibido.
Digamos que nossa aplicação possua duas telas, com as rotas `/tela-1` e `/tela-2`.
O código ficaria assim:

```tsx
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/tela-1",
    element: <Tela1 />,
  },
  {
    path: "/tela-2",
    element: <Tela2 />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

function Tela1() {
  return <div>Tela1</div>;
}

function Tela2() {
  return <div>Tela2</div>;
}
```

Além de definir as rotas, note que precisamos inserir `<RouterProvider router={router} />` no JSX da aplicação para exibir o conteúdo da rota ativa.
Por exemplo, se executarmos essa aplicação localmente, a URL `http://localhost:3000/#/tela-1` exibirá o conteúdo de `Tela1`.

### Rotas aninhadas

Podemos adicionar rotas filhas de outra rota.
Isso é particularmente útil para montar _layouts_, pois podemos ter os elementos comuns da interface, como cabeçalho e rodapé, em uma rota principal e o conteúdo que varia como sub-rota.
Para definir sub-rotas, basta usarmos a propriedade `children` em uma rota.
Além disso, no conteúdo da rota principal, marcamos a posição onde as sub-rotas serão renderizadas com o componente `<Outlet />`, por exemplo:

```tsx
const router = createHashRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Layout Principal</h1>
        <Outlet /> {/* Aqui aparece o conteúdo da sub-rota. */}
      </div>
    ),
    children: [
      {
        path: "tela-1",
        element: <Tela1 />,
      },
      {
        path: "tela-2",
        element: <Tela2 />,
      },
    ],
  },
]);
```

Note que quando especificamos o `path` iniciando com `/`, temos um caminho absoluto, caso contrário, temos um caminho relativo a rota pai.
Vale ressaltar que não estamos restritos a um nível de aninhamento, podemos ter sub-rotas dentro de sub-rotas em quantos níveis desejarmos.

### Rotas index

Podemos definir uma rota sem `path`, usando a propriedade `index: true`, para marcá-la como uma rota padrão a ser ativada se nenhuma outra estiver ativa.

```tsx
const router = createHashRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Layout Principal</h1>
        <Outlet /> {/* TelaInicial será renderizada se nenhum outra rota estiver ativa. */}
      </div>
    ),
    children: [
      {
        index: true,
        element: <TelaInicial />,
      },
      {
        path: "tela-1",
        element: <Tela1 />,
      },
      // ... outras rotas
    ],
  },
]);
```

Neste exemplo, com a URL `http://localhost:3000` o componente `<TelaInicial />` será exibido.
Já com a URL `http://localhost:3000/#/tela-1`, o componente `<Tela1 />` será exibido.

### Rotas com segmentos dinâmicos

Podemos definir rotas cujo caminho possui partes dinâmicas, especificando segmentos começando com o caractere `:`.
Estes segmentos dinâmicos, ou seja, parâmetros da rota, podem ser acessados via _hook_ `useParams` no componente.

```tsx
import { createHashRouter, useParams } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/contacts/:contactId",
    element: <ContactDetail />,
  },
]);

function ContactDetail() {
  // `useParams` retorna um objeto onde cada propriedade é um segmento dinâmico da rota.
  const { contactId } = useParams();
}
```

### Criando links para rotas

Para gerar links para uma rota, devemos usar o componente `Link` e especificar o caminho da rota.

```tsx
<Link to="/tela-1">Texto do link</Link>
```

Isso vai gerar um elemento `a` com o `href` correto.
É importante ressaltar que quando especificamos o caminho iniciando com `/`, temos um caminho absoluto, caso contrário, temos um caminho relativo.

Além do `Link`, temos como alternativa o componente `NavLink`, que oferece a capacidade de estilização diferente quando o link está ativo.
Por padrão, `NavLink` adiciona a classe CSS `active` quando a rota atual corresponde ao link.
Outra opção é usar a propriedade `className`, que aceita uma função.

```tsx
<NavLink to="tasks" className={({ isActive }) => (isActive ? "classeQuandoAtivo" : undefined)}>
  Link
</NavLink>
```

`NavLink` também aceita a propriedade booleana `end` para indicar que o link NÃO será considerado ativo se uma rota descendente estiver ativa.
Por exemplo, para renderizar um link que só está ativo na raiz da aplicação teríamos:

```tsx
<NavLink to="/" end>
  Home
</NavLink>
```

### Carregando dados na rota

Como é muito comum que uma tela precise buscar dados no _back end_ para renderizar seu conteúdo, o React Router oferece recursos para facilitar o carregamento de dados associados a uma rota.
Podemos especificar em cada rota a propriedade `loader`, que é uma função responsável pelo carregamento de dados.
Esta função recebe os parâmetros da rota e deve retornar os dados, ou uma `Promise` dos dados.
Se o valor retornado for `Promise<Response>`, ou seja, resultado de uma chamada HTTP via `fetch`, o dados JSON resultantes são automaticamente convertidos para objetos.
No componente, acessamos os dados carregados via _hook_ `useLoaderData`.

```tsx
import { createHashRouter, useLoaderData } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/rota-com-dados/:id",
    element: <RotaComDados />,
    loader: ({ params }) => fetch(`http://meu-backend/api/dados/${params.id}`),
  },
]);

function RotaComDados() {
  const dados = useLoaderData();
  // Resto do componente.
}
```

Poderíamos fazer o carregamento de dados com `useEffect`, como vimos na seção Efeitos Colaterais.
No entanto, como o carregamento de dados ocorre de maneira assíncrona, a primeira renderização do componente ocorre sem que os dados estejam disponíveis.
Isso muitas vezes é inconveniente e torna o código mais complicado, pois temos que tratar este caso excepcional.
Ao usar o `loader`, o React Router aguarda o carregamento dos dados antes de renderizar o conteúdo da rota, evitando que nos preocupemos com este problema.

:::info
**Nota:**
Além de carregar dados, o React Router oferece recursos para alteração de dados.
Este conteúdo não será coberto neste curso, mas sugerimos ler o [Tutorial do React Router](https://reactrouter.com/en/main/start/tutorial) para conhecer todos os recursos disponíveis.
:::

### Acessando a situação do carregamento

Enquanto carregamos dados é desejável exibir um indicador de carregamento na interface, caso contrário o usuário pode imaginar que aplicação está travada.
Quando o carregamento é feito via `loader`, podemos fazer isso via _hook_ `useNavigation`.
Esta função nos dá um objeto contendo, entre outras informações, a propriedade `status`, que pode ter os valores `"idle" | "loading" | "submitting"`.
Podemos utilizar este valor para exibir condicionalmente um indicador de carregamento.
No entanto, é importante ter em mente que a rota só renderiza após o carregamento e portanto faz mais sentido exibir o indicador na rota raiz, que contém o layout principal.

```tsx
import { Outlet, useNavigation } from "react-router-dom";

function RootRoute() {
  const navigation = useNavigation();

  return (
    <div>
      {navigation.state === "loading" && <span className="loading" />}
      <Outlet />
    </div>
  );
}
```
