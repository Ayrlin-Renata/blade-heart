
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

//css
import '@/css/home/app.scss'

//components
import ErrorPage from "./errorpage";
import ChapterReader from "./routes/mangareader/Reader";
import AccountPage from "./routes/account/AccountPage";
import HomePage from "./routes/newhome/HomePage";

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/blade-heart/" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/account",
    element: <AccountPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/manhua/:manhuaId/:langId/:chapterId",
    element: <ChapterReader />,
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
