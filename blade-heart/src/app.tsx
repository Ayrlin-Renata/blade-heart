
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

//css
import './css/app.scss'

//components
import Root from './routes/Root'

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
