import { createHashRouter, RouterProvider } from "react-router-dom";
import { carregaCardapio } from "./backend";
import PedidoProvider from "./PedidoProvider";
import TelaCardapio from "./TelaCardapio";
import TelaPedido from "./TelaPedido";

const router = createHashRouter([
  {
    path: "/",
    id: "root",
    loader: carregaCardapio,
    children: [
      { index: true, element: <TelaCardapio /> },
      { path: "pedido", element: <TelaPedido /> },
    ],
  },
]);

function App() {
  return (
    <PedidoProvider>
      <RouterProvider router={router} />
    </PedidoProvider>
  );
}

export default App;
