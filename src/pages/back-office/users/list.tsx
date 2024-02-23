
import { useList } from "@refinedev/core";

export const ListUsers = () => {
    console.log("djkfdjfkdjf")
    const { data, isLoading } = useList({ resource: "user" });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {data?.data?.map((user) => (
                    <li key={user.id}>
                        <p>
                            {user.email}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};