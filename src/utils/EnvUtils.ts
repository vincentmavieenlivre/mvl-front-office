export enum Env {
    DEVELOPMENT = "development",
    PRODUCTION = "production",
    STAGING = "staging"
}


export function getEnv(): Env {

    // because of script fallbacks
    const env: any = import.meta.env ?? process.env


    console.log("[ENV] =>", env.MODE)
    if (env.MODE === 'development') {
        return Env.DEVELOPMENT
    }

    if (env.MODE === 'production') {
        return Env.PRODUCTION
    }

    if (env.MODE === 'staging') {
        return Env.STAGING
    }

    throw 'env is unknown:' + env
}