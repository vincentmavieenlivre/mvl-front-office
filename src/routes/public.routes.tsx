
import { Routes, Route } from "react-router-dom";
import RootPage from "../pages/root";
import LoginPage from "../pages/auth/login";
import React from "react";
import AppHome from "@app/pages/app/home";

interface PublicRoutesProps {

}

export const PublicRoutes = (props: PublicRoutesProps) => {
    return (
        <Routes>
            <Route path="/invitation" element={<RootPage></RootPage>} />
            <Route path="/login" element={<LoginPage></LoginPage>} />
        </Routes>
    )
};

export default PublicRoutes;
