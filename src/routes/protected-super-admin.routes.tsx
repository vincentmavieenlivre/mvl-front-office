import React from "react"
import { Routes, Route, Outlet } from "react-router-dom";
import BackOffice from "../pages/back-office/back-office-home";
import { RefineContext } from "../providers/refine-context";
import { NavigateToResource, DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { ProductList } from "../pages/back-office/products/list";
import { ErrorComponent, GitHubBanner } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/mui";
import { ListUsers } from "../pages/back-office/users/list";
interface ProtectedSuperAdminRoutesProps {

}

export const ProtectedSuperAdminRoutes = (props: ProtectedSuperAdminRoutesProps) => {
    console.log("[ProtectedSuperAdminRoutes] component")
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <RefineContext>
                        <ThemedLayoutV2 Title={(props) => (
                            <ThemedTitleV2 {...props} text="MVL Admin" />
                        )}>
                        <Outlet />
                        </ThemedLayoutV2>

                    </RefineContext>



                }
            >

                {/* nested routes (used with Outlet) */}
                <Route index element={<div>[admin home]</div>} />
                <Route path="users" element={<ListUsers></ListUsers>} />
                <Route path="*" element={<ErrorComponent />} />


            </Route>

        </Routes>
    )
};

export default ProtectedSuperAdminRoutes;
