import React from "react"
import { Routes, Route } from "react-router-dom";
import AdminHome from "../pages/admin/admin-home";

interface ProtectedSuperAdminRoutesProps {

}

export const ProtectedSuperAdminRoutes = (props: ProtectedSuperAdminRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<AdminHome></AdminHome>} />
        </Routes>
    )
};

export default ProtectedSuperAdminRoutes;
