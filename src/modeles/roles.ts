import { IdTokenResult } from "firebase/auth";

export enum ERoles {
    SUPER_ADMIN = "super_admin",
    ORGANIZATION_ADMIN = "organization_admin",
    BIOGRAPHER = "biographer",
    USER = "user",
    FAMILY = "family"
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
        default:
            break;
    }

    throw 'unknow role' + r

}