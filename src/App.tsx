

import { useSelector, useDispatch } from "react-redux";
import PublicRoutes from "./routes/public.routes";
import { UserStore, selectUser, setUser } from "./redux/auth.slice";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { UserCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "./init/firebase";
import ProtectedSuperAdminRoutes from "./routes/protected-super-admin.routes";
import ErrorsRoutes from "./routes/errors.routes";
import { Route, Routes } from "react-router-dom";
import RootPage from "./pages/root";
import LoginPage from "./pages/auth/login";
function App() {



  const dispatch = useDispatch();
  const user = useSelector(selectUser)

  useEffect(() => {
    console.log("user effect")
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {

          console.log("[on auth change => with user]", user)

          user.getIdTokenResult(true).then((idTokenResult) => {
            let data: UserStore = {
              user: user,
              tokenResult: idTokenResult
            }
            console.log("[on auth change => with claims]", idTokenResult)
            dispatch(setUser(data));
          })


        } else {
          console.log("[on auth change => no user data]")
          dispatch(setUser(undefined));
        }
      });
    }
  }, [auth]);




  return (
    <>
      <Routes>

        <Route path="/*" element={<PublicRoutes></PublicRoutes>} />
        {user &&
          <Route path="/admin/*" element={<ProtectedSuperAdminRoutes></ProtectedSuperAdminRoutes>} />
        }
      </Routes>

    </>
  )
}

export default App
