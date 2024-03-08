import { useForm, useSelect, Create } from "@refinedev/antd";

import { Form, Input, Select, InputNumber } from "antd";

export const TemplateCreate = () => {
    const { formProps, saveButtonProps } = useForm({
        redirect: "list",
    });

    /*   if (saveButtonProps) {
          saveButtonProps.onClick = (() => {
              console.log("catch click => make create user")
  
          })
      } */



    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Nom" name="name">
                    <Input />
                </Form.Item>

            </Form>
        </Create>
    );
};