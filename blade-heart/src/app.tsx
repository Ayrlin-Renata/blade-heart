
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//css
import './css/app.scss'

//components
import Root from './routes/Root'
import ErrorPage from "./errorpage";
import MangaReader from "./routes/MangaReader";

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "manhua/:manhuaName",
    element: <MangaReader />
  },
]);

//
// APP RENDER
//
export function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
