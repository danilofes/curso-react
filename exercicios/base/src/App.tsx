import { createHashRouter, RouterProvider } from "react-router-dom";
import { carregaCardapio } from "./backend";
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
  return <RouterProvider router={router} />;
}

export default App;
