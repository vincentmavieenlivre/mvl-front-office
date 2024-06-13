import { IRelationDto, UserWithInfo } from "@app/modeles/database/user";
import { getBackendUrl } from "@app/utils/diverse.utils";
import { IdTokenResult, User } from 'firebase/auth';

export class InvitationService {

    constructor() {

    }

    public async isValidInvitation(invitationToken: string): Promise<any> {
        return await fetch(getBackendUrl() + '/invitationActivation', {
            method: 'POST',
            body: JSON.stringify({
                invitationToken: invitationToken,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        }).then(data => {
            console.log("validate invitation token respone", data)
            console.log(data);
            return data
        })
    }

    public async registerWithInvitation(invitationToken: string, userInfo: Partial<any>) {
        return await fetch(getBackendUrl() + '/invitationRegister', {
            method: 'POST',
            body: JSON.stringify({
                invitationToken: invitationToken,
                user: userInfo
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        }).then(data => {
            console.log("invited token token to login:", data)
            console.log(data);
            return data
        })
    }


    public async launchInvitation(projectId: string, token: IdTokenResult, usersInfos: IRelationDto): Promise<any> {
        const response = await fetch(getBackendUrl() + '/inviteFamily', {
            method: 'POST',
            body: JSON.stringify({
                projectId: projectId,
                tokenResult: token,
                usersInfos: usersInfos.relations
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("invite family respone", await response.json())



    }

}