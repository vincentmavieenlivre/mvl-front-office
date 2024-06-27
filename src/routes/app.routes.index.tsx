import React from "react"
import { View, Text } from "react-native"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PublicRoutes from "./public.routes";
import { IdTokenResult, User } from "firebase/auth";
import { useSelector } from "react-redux";
import BackOfficeRoutes from "./backoffice.routes";
import { TokenRole, selectToken, selectUser } from "../redux/auth.slice";
import AppHome from "@app/pages/app/app-home";
import AppLayout from "@app/pages/layout/app.layout";
import NewProject from "@app/pages/app/projects/new.project.page";
import { Project } from "@app/modeles/database/project";
import ShowProjectPage from "@app/pages/app/projects/show.project.page";

import ShowQuestion from "@app/pages/app/projects/questions/show.question";
import SummaryDrawer from "@app/pages/layout/drawer/summary.layout";
import { ERoles } from "@app/modeles/database/roles";
import ShowBookPage from "@app/pages/app/books/show.book.page";
import DashboardLayout from "@app/pages/layout/dashboard-nav.layout";
import ShowBookForDetailsPage from "@app/pages/app/projects/book-for/book-for-details.page";
import ShowBookForPage from "@app/pages/app/projects/book-for/book-for.page";
import InvitationPage from "@app/pages/app/invitation/invitation.page";
import { selectUserProjects } from "@app/redux/current.project.slice";

export const APP_ROUTES = {
  NEW_PROJECT: "/app/projects/new",
  SHOW_PROJECT: "/app/projects/:id",
  SHOW_BOOK: "/app/books/:id",
  LIST_PROJECTS: "/app",
  SHOW_PROJECT_QUESTION: "/app/projects/:id/questions/:questionId",
  SHOW_BOOK_FOR: "/app/projects/:id/bookFor",
  SHOW_BOOK_FOR_DETAILS: "/app/projects/:id/bookForDetails",
  BOOK_INVITATION: "/app/projects/:id/invitation",
  ONBOARD_INVITATION: "/app/invited",
  APP_DASHBOARD: "/app"

}

interface RoutesProps {
  authDone: boolean;
}

export const AppRoutes = (props: RoutesProps) => {
  return (
    <Routes>

      {/* PUBLIC ROUTES (NOT AUTHENTICATED) */}
      <Route path="/*" element={<PublicRoutes></PublicRoutes>} />
      {props.authDone &&
        <>

          {/* BACKOFFICE ROUTES */}
          <Route path="/admin/*" element={<RequireAuth><BackOfficeRoutes /></RequireAuth>} />

          {/* APP ROUTES */}
          <Route element={<InternalAppRedirector><AppLayout /></InternalAppRedirector>} >
            <Route path={APP_ROUTES.APP_DASHBOARD} element={<DashboardLayout> <AppHome /></DashboardLayout>} />

            {/* PROJECTS */}
            <Route path={APP_ROUTES.NEW_PROJECT} element={<NewProject />} />
            <Route path={APP_ROUTES.SHOW_PROJECT} element={<ShowProjectPage />} />
            <Route path={APP_ROUTES.SHOW_PROJECT_QUESTION} element={<SummaryDrawer><ShowQuestion /></SummaryDrawer>} />
            <Route path={APP_ROUTES.SHOW_BOOK} element={<ShowBookPage />} />
            <Route path={APP_ROUTES.SHOW_BOOK_FOR} element={<ShowBookForPage />} />
            <Route path={APP_ROUTES.SHOW_BOOK_FOR_DETAILS} element={<ShowBookForDetailsPage />} />
            <Route path={APP_ROUTES.BOOK_INVITATION} element={<InvitationPage />} />


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

  console.log("user projects", userProjects)
  // redirect to create a new project
  if (user && [ERoles.USER].includes(role) && location.pathname != APP_ROUTES.NEW_PROJECT) {
    console.log("one")
    if (userProjects.length == 0) {
      console.info("[internalAppRedirector] user has no project - redirect to create one")
      console.log("oui")

      return <Navigate to={APP_ROUTES.NEW_PROJECT} state={{ from: location }} replace />;

    }
  }


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

