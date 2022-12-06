import { Produto } from "./backend";

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
}

export class Pedido {
  constructor(public readonly itens: ItemPedido[], private setState: (v: ItemPedido[]) => void) { }

  get preco(): number {
    let total = 0;
    for (const item of this.itens) {
      total += item.quantidade * item.produto.preco;
    }
    return total;
  }

  get quantidade(): number {
    let total = 0;
    for (const item of this.itens) {
      total += item.quantidade;
    }
    return total;
  }

  adicionaProduto(produto: Produto) {
    const novosItens = [...this.itens];
    const idx = novosItens.findIndex(
      (e) => e.produto.id === produto.id
    );
    if (idx !== -1) {
      novosItens[idx] = {
        produto: novosItens[idx].produto,
        quantidade: novosItens[idx].quantidade + 1,
      };
    } else {
      novosItens.push({ produto: produto, quantidade: 1 });
    }
    this.setState(novosItens);
  }

  limpa() {
    this.setState([]);
  }
}