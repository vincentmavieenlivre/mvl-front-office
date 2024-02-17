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

export function RefineContext({ children }) {
    return (

        <RefineSnackbarProvider preventDuplicate={true}>
        <RefineKbarProvider>
            <Refine
                    routerProvider={routerProvider}
                dataProvider={dataProvider("https://api.finefoods.refine.dev")}
                    notificationProvider={useNotificationProvider}
                resources={[
                    {
                        name: "products",
                        list: "/admin/products",
                    },
                ]}
                options={{ syncWithLocation: true, warnWhenUnsavedChanges: true, }}
            >
                <RefineKbar />

                {children}

                {/*  <UnsavedChangesNotifier />
                <DocumentTitleHandler /> */}
            </Refine>

        </RefineKbarProvider>
        </RefineSnackbarProvider>

    );
}