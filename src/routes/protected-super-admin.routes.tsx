import React from "react"
import { Routes, Route, Outlet } from "react-router-dom";
import BackOffice from "../pages/back-office/back-office-home";
import { RefineContext } from "../providers/refine-context";
import { NavigateToResource } from "@refinedev/react-router-v6";
import { ProductList } from "../pages/back-office/products/list";
import { ErrorComponent } from "@refinedev/core";

interface ProtectedSuperAdminRoutesProps {

}

export const ProtectedSuperAdminRoutes = (props: ProtectedSuperAdminRoutesProps) => {
    console.log("ProtectedSuperAdminRoutes")
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RefineContext>
                        <Outlet />
                    </RefineContext>
                }
            >
                <Route index element={<NavigateToResource />} />
                <Route path="products" element={<ProductList />} />
                <Route path="*" element={<ErrorComponent />} />
            </Route>
        </Routes>
    )
};

export default ProtectedSuperAdminRoutes;
