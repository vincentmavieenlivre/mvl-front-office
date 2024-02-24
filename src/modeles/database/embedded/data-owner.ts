import { ERoles } from "../../roles";

export interface DataOwner {
    organisation_id?: string
    organisation_name?: string

    owner_ids: string[];
    users: UserOwner[];
}

export interface UserOwner {
    user_name?: string;
    user_id?: string;
    user_role?: ERoles;
}