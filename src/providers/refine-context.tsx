import { GitHubBanner, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { NavigateToResource, DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { createAction, useRegisterActions } from "@refinedev/kbar";

import { App as AntdApp, ConfigProvider } from "antd";
import { ErrorComponent, RefineThemes, ThemedLayoutV2, useNotificationProvider, AuthPage } from "@refinedev/antd";
import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";

import { ReactNode } from "react";
import { refineFirestoreDatabase } from "./firebase-data-provider";
//import "@refinedev/antd/dist/reset.css"

export function RefineContext({ children }: { children: ReactNode }) {

    let provider = refineFirestoreDatabase.getDataProvider()
    console.log("provider", provider)

    return (
        <DevtoolsProvider>
            <ConfigProvider theme={RefineThemes.Blue}>
                <AntdApp>

                    <RefineKbarProvider>
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
                            ]}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "zB8t94-VPwJA0-BmEInX"
                            }}
                        >
                            <RefineKbar />

                            {children}

                            {/*  <UnsavedChangesNotifier />
                    <DocumentTitleHandler /> */}
                        </Refine>

                    </RefineKbarProvider>

                    <DevtoolsPanel />
                </AntdApp>
            </ConfigProvider>
        </DevtoolsProvider>
    );
}