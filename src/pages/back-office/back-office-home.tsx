import React from "react"
import { auth } from "../../init/firebase";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import { OtherComponent } from "../../components/back-office/test/other-component";
import { RefineComponent } from "../../components/back-office/test/refine-component";

interface AdminHomeProps {

}

export const BackOffice = (props: AdminHomeProps) => {

    const API_URL = "https://api.fake-rest.refine.dev";

    const signOut = async () => {
        await auth?.signOut()
    }

    return (
        <Refine dataProvider={dataProvider(API_URL)}>
            {/* You can use Refine hooks inside here */}
            <OtherComponent />
            <RefineComponent />
        </Refine>
    )
};

export default BackOffice;
