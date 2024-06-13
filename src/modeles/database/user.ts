import { ERoles } from "./roles";

export interface User {
    id?: string;
    name: string;
    email: string;
    role: ERoles
}

export interface UserWithInfo extends User {
    room?: string;
    phone?: string;
}

export interface IInvitation {
    projectId: string;
    invitationToken: string;
}

export interface IMinUserInfo {  // used for invitation
    email: string
    phone: string
}
export interface IRelationDto {
    relations: IMinUserInfo[]
}