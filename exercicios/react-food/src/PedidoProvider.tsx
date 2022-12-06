import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { Pedido, ItemPedido } from "./Pedido";

export const pedidoContext = createContext<Pedido>(new Pedido([], () => {}));

export function usePedido(): Pedido {
  return useContext(pedidoContext);
}

export default function PedidoProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<ItemPedido[]>([]);
  const pedido = useMemo(() => new Pedido(state, setState), [state]);
  return <pedidoContext.Provider value={pedido} children={props.children} />;
}
