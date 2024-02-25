
import { useUpdate } from "@refinedev/core";
import { UserOwner } from "@app/modeles/database/embedded/data-owner"

import { Table, Input, Space, Divider, Tag } from "antd";
import {
    useTable,
    EditButton,

    getDefaultSortOrder,
    FilterDropdown,
    useSelect,
    List,
    ShowButton,
} from "@refinedev/antd";
import { Project } from "@app/modeles/database/project";
import { getRoleColor } from "@app/modeles/roles";
import { FieldPath } from "firebase/firestore";
import { IdTokenResult } from "firebase/auth";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "@app/redux/auth.slice";
import { getOwnerFilter } from "@app/utils/refine-helpers/owner-filter"
export const ProjectList = () => {

    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)
    const user = useSelector(selectUser)

    const { mutate, isLoading, isUpdating } = useUpdate();


    let { tableProps, sorters, filters } = useTable({
        sorters: { initial: [{ field: "name", order: "asc" }] },
        filters: getOwnerFilter(user?.uid, tokenResult?.claims.role),
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
                    render={(_: any, record: Project) => {
                        return (
                            record.owners && record.owners.users.map((u: UserOwner, index) =>
                                <Space key={index}>
                                    <ShowButton size="small" meta={{ authorId: "10" }}
                                        recordItemId={u.user_id} resource="user" >{u.user_name}</ShowButton>
                                    <Tag color={getRoleColor(u.user_role)} key={u.user_role}>
                                        {u.user_role}
                                    </Tag>
                                </Space>

                            ))
                    }}
                />


                <Table.Column
                    dataIndex="organisation_name"
                    title="Organisation"
                    sorter
                    render={(_: any, record: Project) => {
                        return (<div>{record?.owners?.organisation_name}</div>)
                    }}
                />


            </Table>
        </List >
    );


}