import { IResourceComponentsProps, useList } from "@refinedev/core";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const { data: products } = useList();

    return (
        <div>
            <h1>Refine Products Page</h1>
            <ul>
                {products?.data?.map((record) => (
                    <li key={record.id}>{record.name}</li>
                ))}
            </ul>
        </div>
    );
};