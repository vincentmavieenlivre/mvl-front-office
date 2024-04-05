import { useForm, useSelect, Create, Edit } from "@refinedev/antd";

import { Form, Input, Select, InputNumber, Button, Typography } from "antd";
import { useEffect, useState } from "react";
import { Transfer } from 'antd';
import type { TransferProps } from 'antd';
import { ERoles } from "@app/modeles/roles";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@app/init/firebase";
import { User } from "@app/modeles/database/user";
import { FirestoreHelper, index, removeUndefinedRecursive } from "@app/utils/firebase/firestore-helper";
import { useResource, useUpdate } from "@refinedev/core";
import { ECollections } from "@app/utils/firebase/firestore-collections";
import { Organization } from "@app/modeles/database/organization";
import { AdminUser, addOrganizationAdmin, removeOrganizationAdmin } from "@app/modeles/database/embedded/data-owner";

interface RecordType extends AdminUser {
    key: string | undefined;
}


export const OrganizationEdit = () => {
    const { resources, resource, action, id } = useResource();

    const [organization, setOrganization] = useState<any | undefined>(undefined)

    const getOrganization = async () => {
        if (id) {
            const o = await FirestoreHelper.getDocument<Organization>(db, ECollections.ORGANIZATION, id)
            if (o) {
                setOrganization(o)
                return o;
            }
        }
    }

    useEffect(() => {
        initData()
    }, [])


    const { mutate, isLoading, isUpdating } = useUpdate();

    const updateOrganization = async (updatedOrganization: Organization) => {
        if (id) {
            await mutate({
                resource: "organization",
                id: id,
                values: {
                    ...removeUndefinedRecursive(updatedOrganization)
                },
            });
        }
    };

    const [allOrgaAdmins, setAllOrgaAdmins] = useState<RecordType[] | undefined>([])

    const [organizationKeys, setOrganizationKeys] = useState<string[]>([]); // at right
    const [allAdminsKeys, setAllAdminsKeys] = useState<string[]>([]); // selected at left


    const initData = async () => {
        // get all admins across all projects
        const users: User[] = await index(query(collection(db, "user"), where("role", "==", ERoles.ORGANIZATION_ADMIN)))
        const o = await getOrganization()

        console.log("users", users)

        if (o?.admins?.length > 0) {
            const admins = (o?.admins.map((r: AdminUser) => r.user_id) ?? [])
            setOrganizationKeys(admins)
        }

        const adminsClean = users.map((u: User, index: number) => {
            const v: RecordType = {
                key: u?.id,
                user_name: u.email,
                user_id: u.id
            }
            return v
        })
        console.log("admins2", adminsClean)
        setAllOrgaAdmins(adminsClean)


    }



    const { formProps, saveButtonProps, queryResult } = useForm({
        redirect: "show",
    });


    if (saveButtonProps) {
        saveButtonProps.onClick = (async () => {
            console.log("update organization with", organization)
            await updateOrganization(organization)
        })
    }


    //console.log("orgazation", organization)

    // we a transfert occurs
    const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
        console.log('[change] targetKeys:', nextTargetKeys);
        console.log('[change] direction:', direction);
        console.log('[change] moveKeys:', moveKeys);

        setOrganizationKeys(nextTargetKeys);
        if (direction == 'right') { // left -> right move
            moveKeys.forEach((val: string, index: number) => {
                const u = allOrgaAdmins?.find((e: RecordType) => e.key == val)
                console.log("add", u)
                if (u && u.user_id && u.user_name) {
                    addOrganizationAdmin(organization, u.user_id, u.user_name)
                }
            })
        }
        if (direction == 'left') { // left -> right move
            moveKeys.forEach((val: string, index: number) => {
                const u = allOrgaAdmins?.find((e: RecordType) => e.key == val)
                if (u && u.user_id && u.user_name) {
                    removeOrganizationAdmin(organization, u.user_id)
                }
            })
        }
    };

    // when clicking on checkbox
    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        console.log('[SELECT change] sourceSelectedKeys:', sourceSelectedKeys);
        console.log('[SELECT change] targetSelectedKeys:', targetSelectedKeys);
        setAllAdminsKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        //setOrganization({ ...organization, })
    };


    if (!organization) {
        return (null)
    }


    return (
        <Edit saveButtonProps={saveButtonProps}>

            {/*     <Button onClick={() => {
                console.log("orga", organization)
            }}>test</Button>
 */}
            <Form {...formProps} layout="vertical">
                <Form.Item label="name" name="name">
                    <Input />
                </Form.Item>

            </Form>


            <Typography className="mb-2">Administrateurs</Typography>
            <div className="w-full">
                <Transfer
                    listStyle={{ width: "100%" }}
                    oneWay
                    dataSource={allOrgaAdmins}
                    titles={["Tous les administrateurs d'organisation", `Adminstrateurs de ${organization.name}`]}
                    targetKeys={organizationKeys}
                    selectedKeys={allAdminsKeys}
                    onChange={onChange}
                    onSelectChange={onSelectChange}

                    render={(item) => item.user_name}
                />
            </div>

        </Edit>
    );
};