import React from "react"
import { View, Text } from "react-native"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PublicRoutes from "./public.routes";
import { IdTokenResult, User } from "firebase/auth";
import { useSelector } from "react-redux";
import BackOfficeRoutes from "./backoffice.routes";
import { TokenRole, selectToken, selectUser, selectUserProjects } from "../redux/auth.slice";
import { ERoles } from "@app/modeles/roles";
import AppHome from "@app/pages/app/app-home";
import AppLayout from "@app/pages/layout/app.layout";
import NewProject from "@app/pages/app/projects/new.project.page";
import { Project } from "@app/modeles/database/project";
import ShowProjectPage from "@app/pages/app/projects/show.project.page";
import DashboardLayout from "@app/pages/layout/dashboard.layout";
import ShowQuestion from "@app/pages/app/projects/questions/show.question";
import SummaryDrawer from "@app/pages/layout/drawer/summary.layout";

export const APP_ROUTES = {
  NEW_PROJECT: "/app/projects/new",
  SHOW_PROJECT: "/app/projects/:id",
  LIST_PROJECTS: "/app",
  SHOW_PROJECT_QUESTION: "/app/projects/:id/questions/:questionId"
}

interface RoutesProps {
  authDone: boolean;
}

export const AppRoutes = (props: RoutesProps) => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes></PublicRoutes>} />
      {props.authDone &&
        <>
          <Route path="/admin/*" element={<RequireAuth><BackOfficeRoutes /></RequireAuth>} />
          <Route element={<InternalAppRedirector><AppLayout /></InternalAppRedirector>} >
            <Route path="/app" element={<DashboardLayout> <AppHome /></DashboardLayout>} />

            {/* PROJECTS */}
            <Route path={APP_ROUTES.NEW_PROJECT} element={<NewProject />} />
            <Route path={APP_ROUTES.SHOW_PROJECT} element={<ShowProjectPage />} />
            <Route path={APP_ROUTES.SHOW_PROJECT_QUESTION} element={<SummaryDrawer><ShowQuestion /></SummaryDrawer>} />

          </Route>
        </>
      }
    </Routes>
  )
};

export default AppRoutes;

function InternalAppRedirector({ children }: { children: JSX.Element }) {
  console.log("InternalAppRedirector")
  const user: User | undefined = useSelector(selectUser)
  const token: IdTokenResult | undefined = useSelector(selectToken)
  const role: ERoles = (token?.claims as unknown as TokenRole)?.role
  const userProjects: Project[] = useSelector(selectUserProjects)
  const location = useLocation();

  console.log("user projects", location)
  // redirect to create a new project
  if (user && [ERoles.USER].includes(role) && location.pathname != APP_ROUTES.NEW_PROJECT) {
    console.log("one")
    if (userProjects.length == 0) {
      console.info("[internalAppRedirector] user has no project - redirect to create one")
      console.log("oui")

      return <Navigate to={APP_ROUTES.NEW_PROJECT} state={{ from: location }} replace />;

    }
  }

  console.log("nop")


  return children
}


function RequireAuth({ children }: { children: JSX.Element }) {
  const user: User | undefined = useSelector(selectUser)
  const token: IdTokenResult | undefined = useSelector(selectToken)
  const role: ERoles = (token?.claims as unknown as TokenRole)?.role
  const location = useLocation();

  console.log("[required auth] can go on protected route =>", user != undefined, "role", role, "user", user?.email)

  if (!user && ![ERoles.BIOGRAPHER, ERoles.SUPER_ADMIN].includes(role)) {
    console.warn("redirect to login")
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

