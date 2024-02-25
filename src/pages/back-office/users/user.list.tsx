
import { useUpdate } from "@refinedev/core";


import { Table, Input, Space, Tag } from "antd";
import {
    useTable,
    EditButton,
    ShowButton,
    getDefaultSortOrder,
    FilterDropdown,
    useSelect,
    List,
} from "@refinedev/antd";
import { getRoleColor } from "@app/modeles/roles";
import { User } from "@app/modeles/database/user";

export const UserList = () => {
    const { mutate, isLoading, isUpdating } = useUpdate();

    /*  let { dataGridProps: tableProps, tableQueryResult: { data, isLoading } } = useTable({
         resource: "user",
         pagination: { current: 1, pageSize: 10 },
         sorters: { initial: [{ field: "email", order: "asc" }] },
     }); */

    let { tableProps, sorters, filters } = useTable({
        sorters: { initial: [{ field: "email", order: "asc" }] },

        syncWithLocation: true,
    });

    const handleSelectionModelChange = (selectionModel) => {
        // 'selectionModel' contains the selected row(s)
        console.log('Selected Rows:', selectionModel);
        // You can perform any desired action here
    };

    const onCellEditStop = (edit) => {
        console.log("[edit stop]", edit)
    }

    const processRowUpdate = (update) => {
        console.log("[update]", update)
        updateUser(update)
    }

    const onProcessRowUpdateError = (error) => {

    }

    console.log("datagridProps", tableProps)
    tableProps = {
        ...tableProps, disableRowSelectionOnClick: false, filterMode: "client", checkboxSelection: false,
        unstable_cellSelection: false,
        onCellEditStop: onCellEditStop,
        onStateChange: handleSelectionModelChange,
        processRowUpdate: processRowUpdate,
        onProcessRowUpdateError: onProcessRowUpdateError
    }

    const updateUser = async (user: any) => {
        await mutate({
            resource: "user",
            id: user.id,
            values: {
                ...user
            },
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }



    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="id"
                    title="Id"
                    sorter


                />
                <Table.Column
                    dataIndex="email"
                    title="email"
                    sorter

                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input />
                        </FilterDropdown>
                    )}
                />

                <Table.Column
                    title="Role"
                    render={(_, record: User) => (
                        <Tag color={getRoleColor(record.role)}>{record.role}</Tag>
                    )}
                />

                <Table.Column
                    title="Actions"
                    render={(_, record) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <EditButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );


}