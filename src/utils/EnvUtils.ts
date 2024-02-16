export enum Env {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    STAGING = "staging"
}


export function getEnv(): Env {
    console.log("VITE MODE =>", import.meta.env.MODE)
    if (import.meta.env.MODE === 'development') {
        return Env.DEVELOPMENT
    }

    if (import.meta.env.MODE === 'production') {
        return Env.PRODUCTION
    }

    if (import.meta.env.MODE === 'staging') {
        return Env.STAGING
    }

    throw 'env is unknown:' + import.meta.env.MODE
}