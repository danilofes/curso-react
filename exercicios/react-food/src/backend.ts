export interface Produto {
  id: number;
  categoria: string;
  descricao: string;
  preco: number;
}

export function carregaCardapio() {
  return fetch("https://danilofes-curso-react.netlify.app/api/cardapio.json");
}