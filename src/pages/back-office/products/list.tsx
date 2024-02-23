import { IResourceComponentsProps, useDelete, useList } from "@refinedev/core";
import { useNotification } from "@refinedev/core";
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../../redux/auth.slice";
import { UserCredential, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../init/firebase";


export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const { data: products } = useList();
    const { open, close } = useNotification();
    const dispatch = useDispatch();

    const logout = () => {
        signOut(auth as any).then(() => {
            dispatch(setUser(undefined))
        })


    }

    return (
        <div>

            <h1>Refine Products Page</h1>
            <ul>
                {products?.data?.map((record) => (
                    <li key={record.id}>{record.name}</li>
                ))}
            </ul>

            <button className="btn btn-primary"
                onClick={() => {
                    console.log("notif")
                    open?.({
                        key: "my-notification",
                        message: "Test Notification",
                        description: "This is a test notification.",
                        type: "success", // success | error | progress
                    });
                }}
            >
                Delete Product
            </button>
            <Button onClick={logout} variant="contained">logout</Button>

            <Button variant="contained">mui</Button>
        </div>
    );
};