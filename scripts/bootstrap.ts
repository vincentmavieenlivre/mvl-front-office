

import dotenv from 'dotenv';
let env = dotenv.config({ path: '.env.development' }).parsed;

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, collection, connectFirestoreEmulator, getDocs, getFirestore } from 'firebase/firestore';

import { Functions, connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { Env, getEnv } from '../src/utils/EnvUtils';
import {  getAuth as adminGetAuth } from "firebase-admin/auth";
import { initializeApp as adminInit } from 'firebase-admin/app';
import { FirebaseStorage, connectStorageEmulator, getStorage } from 'firebase/storage';

// export firebase entry points
export let db: Firestore | undefined = undefined;
export let firebase: FirebaseApp | undefined = undefined
export let functions: Functions | undefined = undefined
export let auth: Auth | undefined = undefined;
export let app: FirebaseApp | undefined = undefined
export let storage: FirebaseStorage | undefined = undefined

console.info("[firebase admin-sdk] FIREBASE EMULATEUR ENV VARIABLES")
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099" 
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080" 
process.env.FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"

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
    console.warn("VERIFY project is linked to front-office-staging-f55fa or the prod")
    const test = adminInit({projectId: "front-office-staging-f55fa"});
    app = initializeApp(config);
    db = getFirestore(app);
    functions = getFunctions(app)
    storage = getStorage();
    auth = getAuth();
  

    if (getEnv() == Env.DEVELOPMENT) {
        console.log("[firebase emulator] bind firestore to local emulator db")
        connectFirestoreEmulator(db, '127.0.0.1', 8080)
        console.log("[firebase emulator] bind cloud functions to local emulator functions")
        connectFunctionsEmulator(functions, "127.0.0.1", 5003);
        console.log("[firebase emulator] bind authentification")
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
        console.log("[firebase emulator] bind storage")
        connectStorageEmulator(storage, "127.0.0.1", 9199);
    }

}