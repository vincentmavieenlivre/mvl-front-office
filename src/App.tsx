

import { useSelector, useDispatch } from "react-redux";
import PublicRoutes from "./routes/public.routes";
import { UserStore, selectToken, selectUser, setUser } from "./redux/auth.slice";
import { useEffect, useState } from "react";
import { IdTokenResult, User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./init/firebase";
import BackOfficeRoutes from "./routes/backoffice.routes";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AppRoutes from "./routes/app.routes.index";
import { UserProjectsService } from "./domains/services/user-projects.service";
import { pdfjs } from "react-pdf";
import { ERoles } from "./modeles/database/roles";
import { setUserProjects } from "./redux/current.project.slice";

/* pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; */

function App() {
  const navigate = useNavigate();
  const [authDone, setAuthDone] = useState(false)

  const dispatch = useDispatch();
  const user = useSelector(selectUser)
  const tokenResult: IdTokenResult | undefined = useSelector(selectToken)

  const onUserSignIn = async (token: IdTokenResult, user: User) => {
    if (token && user) {

      const data: UserStore = {
        user: user,
        tokenResult: token
      }

      const p = await UserProjectsService.getUserProjects(db, data.user?.uid)

      dispatch(setUserProjects(p))
      dispatch(setUser(data));
      setAuthDone(true)
      console.log("[set auth=TRUE]")
    }
  }

  useEffect(() => {
    console.log("user effect")
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {

          console.log("[on auth change => with user]", user)

          user.getIdTokenResult(true).then((idTokenResult) => {

            console.log("[on auth change => with claims]", idTokenResult)
            onUserSignIn(idTokenResult, user)
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
      onUserSignIn(tokenResult, user)
    }
  }, [user])

  useEffect(() => {

    if (tokenResult && tokenResult?.claims?.role) {

      if ([ERoles.SUPER_ADMIN, ERoles.BIOGRAPHER].includes((tokenResult?.claims as any).role)) {
/*       console.info("redirect to backoffice")
      navigate('/admin')
 */    }

      if ([ERoles.USER, ERoles.FAMILY].includes((tokenResult?.claims as any).role)) {
        console.info("redirect to app")
        // navigate('/app')
      }
    }

    if (!tokenResult) {
      //console.info("redirect to login")
      //navigate('/login')


    }
  }, [tokenResult])

  return (
    <AppRoutes authDone={authDone}></AppRoutes>
  )
}



export default App
