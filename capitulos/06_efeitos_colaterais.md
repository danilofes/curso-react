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

### Efeito para carregamento de dados

Para exercitar o carregamento de dados, vamos construir uma aplicação para exibir as partidas das copa do mundo, buscando os dados de uma API (em formato JSON).
A API que usaremos está disponível na seguinte URL:

```
https://danilofes-curso-react.netlify.app/api/worldcup/matches-{year}.json
```

onde `{year}` é um ano de copa do mundo (entre 1930 e 2018).
Por exemplo, carregando a URL `https://danilofes-curso-react.netlify.app/api/worldcup/matches-2018.json` teremos um JSON array no formato a seguir:

```
[
  {
    "date": "2018-06-14",
    "stage": "Group A",
    "team1": "Russia",
    "team2": "Saudi Arabia",
    "score1": 5,
    "score2": 0
  },
  ...
]
```

A interface da aplicação deve possuir um `select` para escolher o ano da copa do mundo (inicialmente virá marcado 2018).
As partidas da copa devem ser carregadas e exibidas no componente, e sempre que mudar o ano no `select`, devemos recarregá-las.
A aplicação final ficaria da seguinte assim:

<iframe src="https://cralmg-world-cup-matches.stackblitz.io" style="border:4px solid #ddd; width:100%; height:600px; margin: 1rem 0"></iframe>

Abaixo temos o código-fonte da implementação.

```tsx
import { useState, useEffect } from "react";

// Interface para descrever os objetos retornados pela API
interface Match {
  date: string;
  stage: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

const years = ["1982", "1986", "1990", "1994", "1998", "2002", "2006", "2010", "2014", "2018"];

export default function WorldCupApp() {
  // Estado para armazenar o valor do select.
  const [year, setYear] = useState("2018");

  // Estado para armazenar a lista de partidas.
  const [matches, setMatches] = useState<Match[]>([]);

  // Efeito que carrega os dados da API.
  useEffect(
    () => {
      // Carrega as partidas e armazena o resultado no estado.
      fetchWorldCupMatches(year).then((data) => setMatches(data));
    },
    [year] // Recarrega se year mudar.
  );

  return (
    <div>
      <h2>FIFA World Cup Matches</h2>
      <label>
        Select the year:{" "}
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
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

async function fetchWorldCupMatches(year: string): Promise<Match[]> {
  const resp = await fetch(`https://danilofes-curso-react.netlify.app/api/worldcup/matches-${year}.json`);
  if (resp.ok) {
    return resp.json();
  } else {
    throw new Error("Error fetching json " + resp.statusText);
  }
}
```

A parte mais relevante do código está no trecho a seguir, no qual definimos o estado `matches` para armazenar a lista de partidas e definimos um efeito para carregá-las da API:

```tsx
// Estado para armazenar a lista de partidas.
const [matches, setMatches] = useState<Match[]>([]);

// Efeito que carrega os dados da API.
useEffect(
  () => {
    // Carrega as partidas e armazena o resultado no estado.
    fetchWorldCupMatches(year).then((data) => setMatches(data));
  },
  [year] // Recarrega se year mudar.
);
```

Tal código resulta no seguinte comportamento:

1. O componente é renderizado pela primeira vez usando o valor inicial de `matches`, que é um _array_ vazio.
2. Após a primeira renderização, o efeito é executado e a função `fetchWorldCupMatches` é chamada com o valor inicial de `year` (2018). Ou seja, neste momento uma requisição HTTP será disparada, mas, como ela ocorre de maneira assíncrona, a execução do efeito termina antes de chegar a resposta.
3. Quando chegar a resposta da requisição, o callback `(data) => setMatches(data)` será executado e portanto o estado do componente será alterado. Isso disparará um novo processo de renderização.
4. O componente é renderizado novamente usando o novo valor de `matches`, que agora contém os dados carregados. O efeito NÃO será executado após esta renderização pois o valor de `year` não mudou desde a última renderização.

Sempre que o valor de `year` for alterado, uma nova renderização será disparada e os passos 2, 3 e 4 serão repetidos.
O restante do componente utiliza conceitos que já vimos.

:::info
**Nota:**
Além do `useEffect` o React oferece o _hook_ `useLayoutEffect` como alternativa para executar efeitos após a renderização.
A diferença entre eles é bastante sutil, `useLayoutEffect` executa o efeito após atualizar o DOM, mas antes do navegador exibir as mudanças (fazer _repaint_).
Isso torna `useLayoutEffect` útil para casos no qual o efeito altera o DOM diretamente e não desejamos que o navegador faça _repaint_ duas vezes na mesma renderização.
No entanto, a maioria dos efeitos que uma aplicação tipicamente necessita podem ser implementados com `useEffect`.
:::

### Efeito com código de limpeza

A função que passamos como primeiro parâmetro do `useEffect` pode, opcionalmente, retornar uma função de limpeza.
Esta função é executada em duas situações:

- antes da execução do efeito, se ele já tiver executado alguma vez;
- ou quando o componente é desmontado (ou seja, quando ele é removido do DOM).

Tal função é muito útil quando fazemos algo no efeito que precisa ser desfeito, por exemplo, registrar um tratador de eventos ou temporizador.

No componente `DigitalClock` a seguir exibimos um relógio que é atualizado a cada segundo.

<iframe src="https://cralmg-digital-clock.stackblitz.io" style="border:4px solid #ddd; width:100%; height:300px"></iframe>

Para isso usamos um efeito que chama `setInterval` para criar um temporizador e chamamos `clearInterval` na função de limpeza retornada pelo efeito.

```tsx
export default function DigitalClock() {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    // Atualiza a hora a cada 1s.
    const intervalId = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    // Devemos chamar clearInterval no código de limpeza para desfazer o setInterval.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <span>{time}</span>;
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString();
}
```
