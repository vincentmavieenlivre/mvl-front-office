import { IMinUserInfo } from "./user";

export interface IInvitationDocument extends IMinUserInfo {
    id?: string
    invitationToken: string
    projectId: string
    createdAt: Date
    usedAt?: Date
    invitationUsed: boolean
}