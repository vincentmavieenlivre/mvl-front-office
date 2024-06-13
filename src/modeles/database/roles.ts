
export enum ERoles {
    SUPER_ADMIN = "super_admin",
    ORGANIZATION_ADMIN = "organization_admin",
    BIOGRAPHER = "biographer",
    USER = "user",
    INVITED = "invited" // use for user<->project (not in auth token)
}

export enum EPermission {
    CREATE_PROJECT
}

