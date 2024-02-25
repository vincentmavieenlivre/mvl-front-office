
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
import { Organization } from "@app/modeles/database/organization";
import { AdminUser } from "@app/modeles/database/embedded/data-owner";

export const OrganizationList = () => {
    const { mutate, isLoading, isUpdating } = useUpdate();

    /*  let { dataGridProps: tableProps, tableQueryResult: { data, isLoading } } = useTable({
         resource: "user",
         pagination: { current: 1, pageSize: 10 },
         sorters: { initial: [{ field: "email", order: "asc" }] },
     }); */

    let { tableProps, sorters, filters } = useTable({
        resource: "organization",
        sorters: { initial: [{ field: "name", order: "asc" }] },

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
            resource: "organization",
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
                    dataIndex="name"
                    title="Nom"
                    sorter

                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input />
                        </FilterDropdown>
                    )}
                />

                <Table.Column
                    dataIndex="name"
                    title="Admins"
                    sorter
                    render={(_, record: Organization) => (
                        record.admins && record?.admins.map((a: AdminUser) => {
                            return <Tag key={a.user_id}>{a.user_name}</Tag>
                        })
                    )}

                />


                <Table.Column
                    title="Actions"
                    render={(_, record: Organization) => (
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