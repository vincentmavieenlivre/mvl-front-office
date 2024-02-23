

import { useSelector, useDispatch } from "react-redux";
import PublicRoutes from "./routes/public.routes";
import { UserStore, selectToken, selectUser, setUser } from "./redux/auth.slice";
import { useEffect, useState } from "react";
import { IdTokenResult, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./init/firebase";
import ProtectedSuperAdminRoutes from "./routes/protected-super-admin.routes";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { ERoles } from "./modeles/roles";
function App() {
  let navigate = useNavigate();
  const [authDone, setAuthDone] = useState(false)

  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  const tokenResult: IdTokenResult | undefined = useSelector(selectToken)


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
      }, (error) => {
        console.error("[onAuthStateChanged]", error)
      });
    }
  }, [auth, user]);

  useEffect(() => {
    if (user && tokenResult) {
      console.log("[set auth=TRUE]")
      setAuthDone(true)
    } else {
      console.log("[set auth=FALSE]")

      setAuthDone(false)
    }
  }, [user])

  useEffect(() => {
    if (tokenResult?.claims.role == ERoles.SUPER_ADMIN) {
      console.info("redirect to backoffice")
      navigate('/admin')
    }
  }, [tokenResult])

  return (
    <>
      <Routes>
        <Route path="/*" element={<PublicRoutes></PublicRoutes>} />
        {authDone &&
          <Route path="/admin/*" element={<RequireAuth><ProtectedSuperAdminRoutes /></RequireAuth>} />
        }
      </Routes>
    </>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const user: User | undefined = useSelector(selectUser)
  let location = useLocation();

  console.log("[required auth] can go on protected route =>", user != undefined, children)

  if (!user) {
    console.warn("redirect to login")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}


export default App
