import { GitHubBanner, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { NavigateToResource, DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { createAction, useRegisterActions } from "@refinedev/kbar";

import { App as AntdApp, ConfigProvider, Layout, Menu } from "antd";
import { ErrorComponent, RefineThemes, ThemedLayoutV2, useNotificationProvider, AuthPage, Header } from "@refinedev/antd";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";

import { ReactNode } from "react";
import { refineFirestoreDatabase } from "./firebase-data-provider";
import BackOfficeNavBar from "@app/components/back-office/navigations/backoffice-navbar";
import { selectUser, selectToken } from "@app/redux/auth.slice";
import { IdTokenResult } from "firebase/auth";
import { useSelector } from "react-redux";
import { ERoles, isRole } from "@app/modeles/roles";

//import "@refinedev/antd/dist/reset.css"

const userRoutes = {
    name: "user", // <- bind to useOne / getList ...
    list: "/admin/users",
    show: "/admin/users/:id",
    edit: "/admin/users/:id/edit",
    create: "/admin/users/create" // add create btn at top of list

}

const projectRoutes = {
    name: "project", // <-<- bind to useOne / getList ...
    list: "/admin/projects",
    show: "/admin/projects/:id",
}

const organizationRoutes = {
    name: "organization", // <- bind to useOne / getList ...
    list: "/admin/organizations",
    show: "/admin/organizations/:id",
    edit: "/admin/organizations/:id/edit",
    create: "/admin/organizations/create" // add create btn at top of list

}

export function RefineContext({ children }: { children: ReactNode }) {

    let provider = refineFirestoreDatabase.getDataProvider()

    const user = useSelector(selectUser)
    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)

    let ressources = []

    if (tokenResult && isRole(tokenResult, ERoles.SUPER_ADMIN)) {
        ressources.push(userRoutes)
        ressources.push(projectRoutes)
        ressources.push(organizationRoutes)
    }

    if (tokenResult && isRole(tokenResult, ERoles.BIOGRAPHER)) {
        ressources.push(projectRoutes)
    }

    if (tokenResult && isRole(tokenResult, ERoles.ORGANIZATION_ADMIN)) {
        ressources.push(projectRoutes)
    }


    return (
        <DevtoolsProvider>
            <ConfigProvider theme={RefineThemes.Purple}>
                <AntdApp>

                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={provider}

                        resources={ressources}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            projectId: "zB8t94-VPwJA0-BmEInX"
                        }}
                    >
                        <BackOfficeNavBar></BackOfficeNavBar>

                        {children}

                    </Refine>



                    <DevtoolsPanel />
                </AntdApp>
            </ConfigProvider>
        </DevtoolsProvider>
    );
}