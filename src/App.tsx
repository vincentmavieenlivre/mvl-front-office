

import { useSelector, useDispatch } from "react-redux";
import PublicRoutes from "./routes/public.routes";
import { UserStore, selectUser, setUser } from "./redux/auth.slice";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { UserCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "./init/firebase";
function App() {



  const dispatch = useDispatch();

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
  }, []);


  return (
    <>
      <PublicRoutes></PublicRoutes>
    </>
  )
}

export default App
