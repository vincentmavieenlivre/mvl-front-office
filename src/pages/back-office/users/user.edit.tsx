import { useForm, useSelect, Create, Edit } from "@refinedev/antd";

import { Form, Input, Select, InputNumber } from "antd";

export const UserEdit = () => {
    const { formProps, saveButtonProps, queryResult } = useForm({
        redirect: "show",
    });
    console.log("query result", queryResult)
    const { selectProps } = useSelect({
        resource: "user",
        defaultValue: queryResult?.data?.data?.id,
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>

            </Form>
        </Edit>
    );
};