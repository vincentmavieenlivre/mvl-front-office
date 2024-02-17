import React from "react"
import { auth } from "../../init/firebase";

interface AdminHomeProps {

}

export const AdminHome = (props: AdminHomeProps) => {

    const signOut = async () => {
        await auth?.signOut()
    }

    return (

        <button onClick={signOut} className="btn btn-primary">Logout</button>

    )
};

export default AdminHome;
