import { useShow, useOne } from "@refinedev/core";
import { TextField, NumberField, MarkdownField, Show } from "@refinedev/antd";

import { Typography } from "antd";

export const OrganizationShow = () => {
    //  const { queryResult: { data, isLoading } } = useShow();
    const { queryResult } = useShow<any>();

    const { data, isLoading, isError } = queryResult;

    console.log("daukdkkd", data)

    return (
        <Show isLoading={isLoading}>
            <Typography.Title level={5}>Id</Typography.Title>
            <TextField value={data?.data?.id} />

            <Typography.Title level={5}>Name</Typography.Title>
            <TextField value={data?.data?.name} />

        </Show>
    );
};