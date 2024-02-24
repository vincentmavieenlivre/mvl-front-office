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

//import "@refinedev/antd/dist/reset.css"

export function RefineContext({ children }: { children: ReactNode }) {

    let provider = refineFirestoreDatabase.getDataProvider()
    console.log("provider", provider)
    const items = new Array(15).fill(null).map((_, index) => ({
        key: index + 1,
        label: `nav ${index + 1}`,
    }));

    return (
        <DevtoolsProvider>
            <ConfigProvider theme={RefineThemes.Purple}>
                <AntdApp>

                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={provider}

                        resources={[
                            {
                                name: "user", // <- display in toolbar
                                list: "/admin/users",
                                show: "/admin/users/:id",
                                edit: "/admin/users/:id/edit",
                                create: "/admin/users/create"

                            },
                            {
                                name: "project", // <- display in toolbar
                                list: "/admin/projects",
                                show: "/admin/projects/:id",
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            projectId: "zB8t94-VPwJA0-BmEInX"
                        }}
                    >
                        <BackOfficeNavBar></BackOfficeNavBar>

                        {children}


                        {/*  <UnsavedChangesNotifier />
                    <DocumentTitleHandler /> */}
                    </Refine>



                    <DevtoolsPanel />
                </AntdApp>
            </ConfigProvider>
        </DevtoolsProvider>
    );
}