import { useForm, useSelect, Create } from "@refinedev/antd";

import { Form, Input, Select, InputNumber } from "antd";

export const UserCreate = () => {
    const { formProps, saveButtonProps } = useForm({
        redirect: "edit",
    });

    const { selectProps } = useSelect({
        resource: "user",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>

            </Form>
        </Create>
    );
};