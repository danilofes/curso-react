import { Link, useRouteLoaderData } from "react-router-dom";
import { Produto } from "./backend";
import { usePedido } from "./PedidoProvider";
import { formataValor } from "./util";

export default function TelaCardapio() {
  const produtos = useRouteLoaderData("root") as Produto[];

  const { pedido, adicionaProduto } = usePedido();

  return (
    <div className="tela">
      <header>
        <h2>Cardápio</h2>
        <div className="toolbar">
          <span className="flex-1">R$ 0,00 (pedido vazio)</span>
          <Link to="/pedido">Ver pedido</Link>
        </div>
      </header>
      <main>
        {produtos.map((produto, i) => (
          <>
            {(i === 0 || produto.categoria !== produtos[i - 1].categoria) && (
              <div className="categoria">{produto.categoria}</div>
            )}
            <button
              className="itemLista"
              onClick={() => adicionaProduto(produto)}
            >
              <span className="flex-1">{produto.descricao}</span>
              <span>{formataValor(produto.preco)}</span>
            </button>
          </>
        ))}
      </main>
    </div>
  );
}
