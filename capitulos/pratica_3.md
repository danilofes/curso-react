Crie uma aplicação React para exibir as partidas da copa do mundo.
A aplicação deve conter um menu de navegação à esquerda, com cada edição da copa do mundo de 1950 a 2018.
Ao clicar em uma das edições, a lista de partidas deve ser exibida no centro.
Defina as seguintes rotas na aplicação:

- **`/`** Tela inicial.
- **`/matches/:year`** Lista de partidas de um determinado ano.

Os dados devem ser obtidos da seguinte API:

```
https://danilofes-curso-react.netlify.app/api/worldcup/matches-{year}.json
```

onde `{year}` é um ano de copa do mundo (entre 1950 e 2018).
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

Carregue os dados usando um `loader` do React Router.
Enquanto os dados são carregados, exiba um indicador visual de carregamento.

Verifique <a href="https://cralmg-world-cup-matches-router.stackblitz.io" target="_blank">a demonstração da aplicação em funcionamento</a>.

### Solução

Sugerimos que você tente resolver o exercício e depois veja a solução.
Utilize o projeto base fornecido nas informações gerais do curso como ponto de partida.

O código fonte da solução está disponível no repositório do curso, em [exercicios/world-cup](https://github.com/danilofes/curso-react/tree/main/exercicios/world-cup).
Abaixo temos um vídeo da resolução.

<iframe width="720" height="480" src="https://www.youtube.com/embed/o6ogXfv7t1g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
