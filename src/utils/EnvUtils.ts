export enum Env {
    DEVELOPMENT = "development",
    PRODUCTION = "production"
}


export function getEnv(): Env {
    if (import.meta.env.MODE === 'development') {
        return Env.DEVELOPMENT
    }

    if (import.meta.env.MODE === 'production') {
        Env.PRODUCTION
    }

    throw 'env is unknown'
}