import { createHashRouter, RouterProvider } from "react-router-dom";
import IndexRoute from "./IndexRoute";
import MatchesRoute from "./MatchesRoute";
import RootRoute from "./RootRoute";

const urlBase = "https://danilofes-curso-react.netlify.app/api/worldcup";

const router = createHashRouter([
  {
    path: "/",
    element: <RootRoute />,
    children: [
      { index: true, element: <IndexRoute /> },
      {
        path: "matches/:year",
        element: <MatchesRoute />,
        loader: ({ params }) => fetch(`${urlBase}/matches-${params.year}.json`),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
