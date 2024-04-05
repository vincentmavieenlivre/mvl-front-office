import { IdTokenResult } from "firebase/auth";

export enum ERoles {
    SUPER_ADMIN = "super_admin",
    ORGANIZATION_ADMIN = "organization_admin",
    BIOGRAPHER = "biographer",
    USER = "user",
    FAMILY = "family"
}

export enum EPermission{
    CREATE_PROJECT
}


export const permissionsByRole = {
    "user":  [EPermission.CREATE_PROJECT]
}

export function hasPermission(token:IdTokenResult, permission:EPermission):boolean{
    const r:ERoles = getRoleFromToken(token)
    console.log("ROLE OF CURRENT USER", r)
    const roleString = r.toString()
    
    return permissionsByRole[roleString] && permissionsByRole[roleString].includes(permission)

}

export function getRoleFromToken(token: IdTokenResult): ERoles {
    return token?.claims?.role as ERoles
}

export function isRole(token: IdTokenResult, e: ERoles): boolean {
    return e == token?.claims?.role
}

export function getRoleColor(r?: ERoles) {
    switch (r) {
        case ERoles.BIOGRAPHER:
            return "blue"
        case ERoles.ORGANIZATION_ADMIN:
            return "purple"
        case ERoles.SUPER_ADMIN:
            return "yellow"
        case ERoles.USER:
            return "green"
        case ERoles.FAMILY:
            return "pink"

        default:
            break;
    }

    throw 'unknow role => ' + r

}