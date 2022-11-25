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

### Exemplo de `useEffect` para carregamento de dados

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

A aplicação final ficaria da seguinte assim:

<iframe src="https://cralmg-world-cup-matches.stackblitz.io" style="border:4px solid #ddd; width:600px; height:600px; margin: 1rem 0"></iframe>

```tsx
import { useState, useEffect } from "react";

// Interface para descrever o objeto que vem no JSON
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
  // Estado para armazenar o valor do select
  const [year, setYear] = useState("2018");

  // Estado para armazenar a lista de partidas carregada.
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    // Carrega as partidas e armazena o resultado no estado. Recarrega se year mudar
    fetchWorldCupMatches(year).then((data) => setMatches(data));
  }, [year]);

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
