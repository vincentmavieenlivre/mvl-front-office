import { IResourceComponentsProps, useDelete, useList } from "@refinedev/core";
import { useNotification } from "@refinedev/core";
import Button from '@mui/material/Button';

export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const { data: products } = useList();
    const { open, close } = useNotification();

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

            <Button variant="contained">mui</Button>
        </div>
    );
};