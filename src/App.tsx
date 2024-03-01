

import { useSelector, useDispatch } from "react-redux";
import PublicRoutes from "./routes/public.routes";
import { UserStore, selectToken, selectUser, setUser } from "./redux/auth.slice";
import { useEffect, useState } from "react";
import { IdTokenResult, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./init/firebase";
import BackOfficeRoutes from "./routes/backoffice.routes";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { ERoles } from "./modeles/roles";
import AppRoutes from "./routes/app-routes.index";


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
  }, []);

  useEffect(() => {
    if (user && tokenResult) {
      console.log("[set auth=TRUE]")
      setAuthDone(true)
    }
  }, [user, tokenResult])

  useEffect(() => {



    if ([ERoles.SUPER_ADMIN, ERoles.BIOGRAPHER].includes(tokenResult?.claims.role)) {
      console.info("redirect to backoffice")
      navigate('/admin')
    }

    if ([ERoles.USER].includes(tokenResult?.claims.role)) {
      console.info("redirect to app")
      navigate('/app')
    }

    if (!tokenResult) {
      //console.info("redirect to login")
      navigate('/login')


    }
  }, [tokenResult])

  return (
    <AppRoutes authDone={authDone}></AppRoutes>
  )
}



export default App
