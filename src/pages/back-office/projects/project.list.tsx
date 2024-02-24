
import { useUpdate } from "@refinedev/core";


import { Table, Input, Space, Divider } from "antd";
import {
    useTable,
    EditButton,
    ShowButton,
    getDefaultSortOrder,
    FilterDropdown,
    useSelect,
    List,
} from "@refinedev/antd";

export const ProjectList = () => {
    const { mutate, isLoading, isUpdating } = useUpdate();

    /*  let { dataGridProps: tableProps, tableQueryResult: { data, isLoading } } = useTable({
         resource: "user",
         pagination: { current: 1, pageSize: 10 },
         sorters: { initial: [{ field: "email", order: "asc" }] },
     }); */

    let { tableProps, sorters, filters } = useTable({
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

    console.log("[project data]", tableProps.dataSource)
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
                    dataIndex="name"
                    title="name"
                    sorter

                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Input />
                        </FilterDropdown>
                    )}
                />

                <Table.Column
                    dataIndex="user_id"
                    title="Utilisateur"
                    sorter
                    render={(_: any, record: any) => (
                        <div>
                            <Space>
                                <ShowButton size="small" resource="user" recordItemId={record.user_id}>{record.user_id}</ShowButton>
                            </Space>
                            <Space>
                                <ShowButton size="small" resource="user" recordItemId={record.user_id}>{record.user_id}</ShowButton>
                            </Space>
                        </div>
                    )}
                ></Table.Column>


            </Table>
        </List>
    );


}