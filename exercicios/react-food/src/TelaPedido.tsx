import { Link } from "react-router-dom";

export default function TelaPedido() {
  return (
    <div className="tela">
      <header>
        <h2>Pedido</h2>
      </header>
      <main></main>
      <footer>
        <Link to="/">Adicionar mais itens</Link>
      </footer>
    </div>
  );
}
