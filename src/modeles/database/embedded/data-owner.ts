import { ERoles } from "../../roles";
import { Organization } from "../organization";

export interface DataOwner {
    organisation_id?: string
    organisation_name?: string

    owner_ids: string[];
    users: UserOwner[];
}

export interface AdminUser {
    user_name?: string;
    user_id?: string;
}

export interface UserOwner extends AdminUser {
    user_role?: ERoles;
}

export function removeOrganizationAdmin(o: Organization, userId: string) {
    if (o.admins?.length) {
        console.log("remove admin", userId)

        const a = o.admins.filter((u: AdminUser) => u.user_id != userId)
        o.admins = a
    }
}

export function addOrganizationAdmin(o: Organization, userId: string, userName: string) {


    console.log("add admin", userId)

    if (!o.admins) {
        o.admins = []
    }

    o.admins.push({
        user_id: userId,
        user_name: userName
    } as AdminUser)
}