
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

//css
import './css/app.scss'

//components
import Root from './routes/Root'
import ErrorPage from "./errorpage";
import ChapterReader, { loader as readerLoader } from "./routes/ChapterReader";

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/blade-heart" replace />,
  },
  {
    path: "/blade-heart",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/manhua/:manhuaId/:chapterId",
    element: <ChapterReader />,
    loader: readerLoader,
    errorElement: <ErrorPage />,
  },
]);

//
// APP RENDER
//
export default function Router() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
