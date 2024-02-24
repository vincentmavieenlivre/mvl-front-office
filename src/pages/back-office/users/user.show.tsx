import { useShow, useOne } from "@refinedev/core";
import { TextField, NumberField, MarkdownField, Show } from "@refinedev/antd";

import { Typography } from "antd";

export const UserShow = () => {
    const { queryResult: { data, isLoading } } = useShow();



    return (
        <Show isLoading={isLoading}>
            <Typography.Title level={5}>Id</Typography.Title>
            <TextField value={data?.data?.id} />

            <Typography.Title level={5}>Name</Typography.Title>
            <TextField value={data?.data?.name} />

            <Typography.Title level={5}>Email</Typography.Title>
            <TextField value={data?.data?.email} />


        </Show>
    );
};