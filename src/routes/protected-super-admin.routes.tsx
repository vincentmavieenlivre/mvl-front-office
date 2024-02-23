import { Routes, Route, Outlet } from "react-router-dom";
import { RefineContext } from "../providers/refine-context";
import { ErrorComponent } from "@refinedev/core";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import { UserList } from "../pages/back-office/users/user.list";
import { UserShow } from "../pages/back-office/users/user.show";
import { UserEdit } from "../pages/back-office/users/user.edit";
import { UserCreate } from "../pages/back-office/users/user.create";
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
                <Route path="users" element={<UserList></UserList>} />
                <Route path="users/:id" element={<UserShow />} />
                <Route path="users/:id/edit" element={<UserEdit />} />
                <Route path="users/create" element={<UserCreate />} />
                <Route path="*" element={<ErrorComponent />} />


            </Route>

        </Routes>
    )
};

export default ProtectedSuperAdminRoutes;
