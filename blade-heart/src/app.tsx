
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//css
import './css/app.scss'

//components
import Root from './routes/Root'
import ErrorPage from "./errorpage";
import MangaReader, { loader as readerLoader} from "./routes/MangaReader";

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "manhua/:manhuaName",
    element: <MangaReader />,
    loader: readerLoader,
    errorElement: <ErrorPage />,
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
