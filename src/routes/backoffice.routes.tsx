import { Routes, Route, Outlet } from "react-router-dom";
import { RefineContext } from "../providers/refine-context";
import { ErrorComponent } from "@refinedev/core";
import { Header, ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import { UserList } from "../pages/back-office/users/user.list";
import { UserShow } from "../pages/back-office/users/user.show";
import { UserEdit } from "../pages/back-office/users/user.edit";
import { UserCreate } from "../pages/back-office/users/user.create";
import { ProjectList } from "../pages/back-office/projects/project.list";
import { ProjectShow } from "../pages/back-office/projects/project.show";
import { Menu } from "antd";
import BackOfficeNavBar from "@app/components/back-office/navigations/navbar";
import { OrganizationList } from "@app/pages/back-office/organizations/organizations.list";
import { OrganizationShow } from "@app/pages/back-office/organizations/organizations.show";
import { OrganizationEdit } from "@app/pages/back-office/organizations/organizations.edit";
import { OrganizationCreate } from "@app/pages/back-office/organizations/organizations.create";
import { TemplateList } from "@app/pages/back-office/templates/templates.list";
import { TemplateCreate } from "@app/pages/back-office/templates/templates.create";
import { TemplateEdit } from "@app/pages/back-office/templates/templates.edit";
interface ProtectedSuperAdminRoutesProps {

}

export const BackOfficeRoutes = (props: ProtectedSuperAdminRoutesProps) => {
    console.log("[ProtectedSuperAdminRoutes] component")
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <RefineContext>
                        <ThemedLayoutV2
                            /* Header={() => <div>lol</div>} */
                            initialSiderCollapsed={false} Title={(props) => (
                                <ThemedTitleV2 {...props} text="MVL Admin" />
                            )}>
                            <Outlet />
                        </ThemedLayoutV2>

                    </RefineContext>



                }
            >

                {/* nested routes (used with Outlet) */}
                <Route index element={<div>[admin home]</div>} />

                {/* USERS */}
                <Route path="users" element={<UserList></UserList>} />
                <Route path="users/:id" element={<UserShow />} />
                <Route path="users/:id/edit" element={<UserEdit />} />
                <Route path="users/create" element={<UserCreate />} />

                {/* PROJECTS */}
                <Route path="projects" element={<ProjectList />} />
                <Route path="projects/:id" element={<ProjectShow />} />

                {/* ORGANIZATIONS */}
                <Route path="organizations" element={<OrganizationList />} />
                <Route path="organizations/:id" element={<OrganizationShow />} />
                <Route path="organizations/:id/edit" element={<OrganizationEdit />} />
                <Route path="organizations/create" element={<OrganizationCreate />} />

                {/* BOOK TEMPLATES */}
                <Route path="templates" element={<TemplateList />} />                
                 <Route path="templates/:id/edit" element={<TemplateEdit />} /> 
                <Route path="templates/create" element={<TemplateCreate />} />

                {/* CATCH ALL */}
                <Route path="*" element={<ErrorComponent />} />
                


            </Route>

        </Routes>
    )
};

export default BackOfficeRoutes;
