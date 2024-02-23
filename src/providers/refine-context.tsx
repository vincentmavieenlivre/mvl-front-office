import { GitHubBanner, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { NavigateToResource, DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { createAction, useRegisterActions } from "@refinedev/kbar";
import {
    RefineThemes,
    useNotificationProvider,
    RefineSnackbarProvider,
} from "@refinedev/mui";

import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";

import { ReactNode } from "react";
import { refineFirestoreDatabase } from "./firebase-data-provider";


export function RefineContext({ children }: { children: ReactNode }) {
    return (
        <DevtoolsProvider>

            <RefineSnackbarProvider preventDuplicate={true}>
                <RefineKbarProvider>
                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={refineFirestoreDatabase.getDataProvider()}
                        //dataProvider={dataProvider("https://api.finefoods.refine.dev")}
                        notificationProvider={useNotificationProvider}
                        resources={[
                            {
                                name: "products",
                                list: "/admin/products",
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
            </RefineSnackbarProvider>
            <DevtoolsPanel />
        </DevtoolsProvider>
    );
}