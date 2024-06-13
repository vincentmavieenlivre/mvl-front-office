
import { Routes, Route } from "react-router-dom";
import RootPage from "../pages/root";
import LoginPage from "../pages/auth/login";
import React from "react";
import AppHome from "@app/pages/app/home";
import InvitationOnboarding from "@app/pages/app/invitation/invitation-onboarding.page";

interface PublicRoutesProps {

}

export const PublicRoutes = (props: PublicRoutesProps) => {
    return (
        <Routes>
            <Route path="/invited" element={<InvitationOnboarding></InvitationOnboarding>} />
            <Route path="/login" element={<LoginPage></LoginPage>} />
        </Routes>
    )
};

export default PublicRoutes;
