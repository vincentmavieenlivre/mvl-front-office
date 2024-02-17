import { GitHubBanner, Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { NavigateToResource, DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import { createAction, useRegisterActions } from "@refinedev/kbar";
import { useNotificationProvider, RefineThemes } from "@refinedev/antd";


export function RefineContext({ children }) {
    return (


        <RefineKbarProvider>
            <Refine
                routerProvider={routerProvider}
                notificationProvider={useNotificationProvider}
                dataProvider={dataProvider("https://api.finefoods.refine.dev")}
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

    );
}