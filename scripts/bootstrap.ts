

import dotenv from 'dotenv';
let env = dotenv.config({ path: '.env.development' }).parsed;

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, collection, connectFirestoreEmulator, getDocs, getFirestore } from 'firebase/firestore';

import { Functions, connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { Env, getEnv } from '../src/utils/EnvUtils';

// export firebase entry points
export let db: Firestore | undefined = undefined;
export let firebase: FirebaseApp | undefined = undefined
export let functions: Functions | undefined = undefined
export let auth: Auth | undefined = undefined;
export let app: FirebaseApp | undefined = undefined

export function scriptBootstrap() {

    console.log("[dot env is DEVELOPMENT] .env.development")

    const config = {
        apiKey: env.VITE_REACT_APP_APIKEY,
        authDomain: env.VITE_REACT_APP_AUTHDOMAIN,
        projectId: env.VITE_REACT_APP_PID,
        storageBucket: env.VITE_REACT_APP_SB,
        messagingSenderId: env.VITE_REACT_APP_SID,
        appId: env.VITE_REACT_APP_APPID,
    };

    console.info("firebase config from env", config)

    app = initializeApp(config);
    db = getFirestore(app);
    functions = getFunctions(app)
    auth = getAuth();

    if (getEnv() == Env.DEVELOPMENT) {
        console.log("[firebase emulator] bind firestore to local emulator db")
        connectFirestoreEmulator(db, '127.0.0.1', 8080)
        console.log("[firebase emulator] bind cloud functions to local emulator functions")
        connectFunctionsEmulator(functions, "127.0.0.1", 5003);
        console.log("[firebase emulator] bind authentification")
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }

}