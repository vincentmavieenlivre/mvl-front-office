
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from "react";

export const UserList = () => {


    const { dataGridProps, tableQueryResult: { data, isLoading } } = useDataGrid({
        resource: "user",
        pagination: { current: 1, pageSize: 10 },
        sorters: { initial: [{ field: "email", order: "asc" }] },
    });

    const columns = React.useMemo<GridColDef<any>[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 150,
            },
            {
                field: "email",
                headerName: "Email",
                width: 150,
            },
        ],
        [],
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log("data", data)

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
};