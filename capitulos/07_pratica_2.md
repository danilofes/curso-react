Crie uma aplicação React contendo um formulário com dois campos para selecionar:

- uma região do Brasil;
- um estado do Brasil (dentro da região selecionada).

Abaixo temos uma demonstração da aplicação em funcionamento.

<iframe src="https://cralmg-regiao-estado.stackblitz.io" style="border:4px solid #ddd; width:100%; height:120px"></iframe>

É importante implementar os seguintes comportamentos:

- O campo Estado fica desabilitado enquanto o campo Região está vazia.
- Ao trocar a região, devemos limpar o campo Estado e carregar a lista de estados daquela região.

As listas de regiões deve ser obtida pela API do IBGE:

<https://servicodados.ibge.gov.br/api/v1/localidades/regioes>

Ela retorna um array de objetos do seguinte formato:

```ts
interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}
```

A lista de estados também pode ser obtida pela mesma API, com a URL:

<https://servicodados.ibge.gov.br/api/v1/localidades/regioes/1/estados>

onde 1 deve ser substituído pelo `id` da região desejada.
Ela retorna um array de objetos do seguinte formato:

```ts
interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}
```

### Solução

Sugerimos que você tente resolver o exercício e depois veja a solução.
Utilize o projeto base fornecido nas informações gerais do curso.

O código fonte da solução está disponível no repositório do curso, em [exercicios/regiao-uf](https://github.com/danilofes/curso-react/tree/main/exercicios/regiao-uf).
