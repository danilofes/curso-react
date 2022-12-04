import { createContext, ReactNode, useMemo, useState, useContext } from "react";
import { Produto } from "./backend";

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
}

export const pedidoContext = createContext({
  pedido: [] as ItemPedido[],
  adicionaProduto(produto: Produto) {},
  limpa() {},
});

export function usePedido() {
  return useContext(pedidoContext);
}

export default function PedidoProvider(props: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const contextValue = useMemo(() => {
    return {
      pedido: itens,
      adicionaProduto(produto: Produto) {
        const novosItens = [...itens];
        const idx = novosItens.findIndex((e) => e.produto.id === produto.id);
        if (idx !== -1) {
          novosItens[idx] = {
            produto: novosItens[idx].produto,
            quantidade: novosItens[idx].quantidade + 1,
          };
        } else {
          novosItens.push({ produto: produto, quantidade: 1 });
        }
      },
      limpa() {
        setItens([]);
      },
    };
  }, [itens, setItens]);

  return (
    <pedidoContext.Provider value={contextValue} children={props.children} />
  );
}
