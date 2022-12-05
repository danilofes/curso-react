import { Link, useRouteLoaderData } from "react-router-dom";
import { Produto } from "./backend";
import { usePedido } from "./PedidoProvider";
import { formataValor } from "./util";

export default function TelaCardapio() {
  const produtos = useRouteLoaderData("root") as Produto[];
  const pedido = usePedido();

  return (
    <div className="tela">
      <header>
        <h2>Cardápio</h2>
        <div className="toolbar">
          <span className="flex-1">
            {formataValor(pedido.preco)} ({pedido.quantidade}
            {pedido.quantidade === 1 ? " item" : " itens"})
          </span>
          <Link to="/pedido">Ver pedido</Link>
        </div>
      </header>
      <main>
        {produtos.map((produto, i) => (
          <div key={produto.id}>
            {(i === 0 || produto.categoria !== produtos[i - 1].categoria) && (
              <div className="categoria">{produto.categoria}</div>
            )}
            <button
              className="itemLista"
              onClick={() => pedido.adicionaProduto(produto)}
            >
              <span className="flex-1">{produto.descricao}</span>
              <span>{formataValor(produto.preco)}</span>
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
