
import { useShow } from "@refinedev/core";

export const RefineComponent = () => {
    const { queryResult } = useShow({ resource: "products", id: 1 });

    return (
        <div>
            <p>Hello From My Refine Component!</p>
            <code>{`const { queryResult } = useShow({ resource: "products", id: 1 });`}</code>
            <p>useShow hook queryResult:</p>
            <code>{JSON.stringify(queryResult.data, null, 2)}</code>
        </div>
    );
};