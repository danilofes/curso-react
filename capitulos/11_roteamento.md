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
Usando o **Browser Router**, o _back end_ receberá requisições HTTP com URLs diferentes para cada tela, mas deve tomar o cuidado de servir o mesmo documento principal, contendo a aplicação React.
Usando o **Hash Router**, o _back end_ receberá requisições HTTP apenas na URL raiz, pois a _URI Fragment_ não é enviada pelo navegador.
Resumindo, com **Hash Router** não precisamos de configuração alguma no _back end_, portanto costuma ser a solução mais simples.
No entanto, **Browser Router** é uma solução mais elegante e que dá maior flexibilidade, por exemplo, para usar recursos mais avançados do React como a renderização do lado do servidor.
Dito isso, no restante da seção usaremos **Hash Router**, por sua simplicidade, visto que a maneira de usar React Router não se altera.

### Criando o router

O primeiro passo para configurar o roteamento na aplicação é criar o objeto router usando a função `createHashRouter` (ou `createBrowserRouter`).
Esta função recebe como parâmetro um _array_ de objetos que descrevem cada rota da aplicação.
Cada rota descreve o padrão de URL que a ativa e qual elemento deve ser exibido.
Digamos que nossa aplicação possua duas telas, com as URLs `/tela-1` e `/tela-2`.
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

### Criando links para a rota

Para gerar links para uma rota, devemos usar o componente `Link` e especificar o caminho da rota.

```tsx
<Link to="tela-1">Texto do link</Link>
```

```tsx
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  Link,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router-dom";

interface Match {
  date: string;
  stage: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

const router = createHashRouter([
  {
    path: "/",
    element: <RootRoute />,
    children: [
      {
        index: true,
        element: <IndexRoute />,
      },
      {
        path: "matches/:year",
        element: <MatchesRoute />,
        loader: ({ params }) =>
          fetch(`https://danilofes-curso-react.netlify.app/api/worldcup/matches-${params.year!}.json`),
      },
    ],
  },
]);

export default function WorldCupApp() {
  return <RouterProvider router={router} />;
}

function RootRoute() {
  const navigation = useNavigation();

  const years: number[] = [];
  for (let year = 1950; year <= 2018; year += 4) {
    years.push(year);
  }

  return (
    <div className="worldCupApp">
      <header>
        <h1>World Cup App</h1>
        {navigation.state === "loading" && <span className="loading" />}
      </header>
      <nav>
        <h2>Year</h2>
        <ul>
          {years.map((year) => (
            <li key={year}>
              <Link to={`matches/${year}`}>{year}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function IndexRoute() {
  return <p>Select an year to view the list of matches of the World Cup.</p>;
}

function MatchesRoute() {
  const { year } = useParams();
  const matches = useLoaderData() as Match[];

  return (
    <div>
      <h2>Matches of World Cup {year}</h2>
      <table>
        <tbody>
          {matches.map((match, i) => (
            <tr key={i}>
              <td>{match.team1}</td>
              <td>
                {match.score1} X {match.score2}
              </td>
              <td>{match.team2}</td>
              <td>{match.stage}</td>
              <td>{match.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```
