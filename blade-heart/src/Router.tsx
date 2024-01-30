
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";

//css
import '@/css/home/app.scss'

//components
import ErrorPage from "./errorpage";
import ChapterReader from "./routes/mangareader/Reader";
import AccountPage from "./routes/account/AccountPage";
import HomePage from "./routes/home/HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserdata, useUserdata } from "./utils/firebase";
import { useEffect } from "preact/hooks";
import { useQueryClient } from "@tanstack/react-query";
import ElysianPage from "./routes/tools/elysian/ElysianPage";

var curMhLang = "en"
var curMhChap = "prelude-to-war"

const MhCompWrapper = () => {
  const auth = getAuth()
  if (auth.currentUser) {
    const { status, data } = useUserdata()
    if (status === 'success') {
      const tempLang = data.prefs["second-eruption|sct|language"].value
      const tempChap = JSON.parse(data.prefs["second-eruption|sct|chapter"].value).id
      if (tempLang && tempChap) {
        curMhLang = tempLang
        curMhChap = tempChap
      }
    }
  }

  const { manhuaId } = useParams()
  return (
    <Navigate to={"/blade-heart/manhua/" + manhuaId + "/" + curMhLang + "/" + curMhChap} replace />
  )
}

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
    path: "/blade-heart/manhua/:manhuaId/",
    element: <MhCompWrapper />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/manhua/:manhuaId/:langId/:chapterId",
    element: <ChapterReader />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/blade-heart/tools/elysian",
    element: <ElysianPage />,
    errorElement: <ErrorPage />,
  },
]);

//
// APP RENDER
//
export default function Router() {

  const queryClient = useQueryClient()
  useEffect(() => {
    onAuthStateChanged(getAuth(), async (_user) => {
      const data = await getUserdata(queryClient)
    })
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
