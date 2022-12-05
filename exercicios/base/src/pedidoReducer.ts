import { Produto } from "./backend";

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
}

export type Acao = { tipo: "adiciona"; produto: Produto } | { tipo: "limpa" };

export default function pedidoReducer(
  estado: ItemPedido[],
  acao: Acao
): ItemPedido[] {
  switch (acao.tipo) {
    case "adiciona": {
      const novosItens = [...estado];
      const idx = novosItens.findIndex(
        (e) => e.produto.id === acao.produto.id
      );
      if (idx !== -1) {
        novosItens[idx] = {
          produto: novosItens[idx].produto,
          quantidade: novosItens[idx].quantidade + 1,
        };
      } else {
        novosItens.push({ produto: acao.produto, quantidade: 1 });
      }
      return novosItens;
    }
    case "limpa": {
      return [];
    }
  }
}