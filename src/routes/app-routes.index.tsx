import React from "react"
import { View, Text } from "react-native"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PublicRoutes from "./public.routes";
import { IdTokenResult, User } from "firebase/auth";
import { useSelector } from "react-redux";
import ProtectedSuperAdminRoutes from "./protected-super-admin.routes";
import { TokenRole, selectToken, selectUser } from "../redux/auth.slice";
import { ERoles } from "@app/modeles/roles";

interface RoutesProps {
  authDone: boolean;
}

export const AppRoutes = (props: RoutesProps) => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes></PublicRoutes>} />
      {props.authDone &&
        <Route path="/admin/*" element={<RequireAuth><ProtectedSuperAdminRoutes /></RequireAuth>} />
      }
    </Routes>
  )
};

export default AppRoutes;


function RequireAuth({ children }: { children: JSX.Element }) {
  const user: User | undefined = useSelector(selectUser)
  const token: IdTokenResult | undefined = useSelector(selectToken)
  const role: ERoles = (token?.claims as unknown as TokenRole)?.role
  let location = useLocation();

  console.log("[required auth] can go on protected route =>", user != undefined, "role", role, "user", user?.email)

  if (!user && ![ERoles.BIOGRAPHER, ERoles.SUPER_ADMIN].includes(role)) {
    console.warn("redirect to login")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

