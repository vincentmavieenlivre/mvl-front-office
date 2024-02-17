import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";

export function RefineContext({ children }) {
    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            resources={[
                {
                    name: "products",
                    list: "/admin/products",
                },
            ]}
            options={{ syncWithLocation: true }}
        >
            {children}
        </Refine>
    );
}