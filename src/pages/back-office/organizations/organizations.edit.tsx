import { useForm, useSelect, Create, Edit } from "@refinedev/antd";

import { Form, Input, Select, InputNumber } from "antd";

export const OrganizationEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        redirect: "show",
    });
    console.log("query result", queryResult)
    const { selectProps } = useSelect({
        resource: "organization",
        defaultValue: queryResult?.data?.data?.id,
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="name" name="name">
                    <Input />
                </Form.Item>

            </Form>
        </Edit>
    );
};