import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, collection, connectFirestoreEmulator, getDocs, getFirestore } from 'firebase/firestore';
import { Env, getEnv } from '../utils/EnvUtils';
import { Functions, connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { FirebaseStorage, connectStorageEmulator, getStorage } from 'firebase/storage';


// export firebase entry points
export let db: Firestore | undefined = undefined;
export const firebase: FirebaseApp | undefined = undefined
export let functions: Functions | undefined = undefined
export let auth: Auth | undefined = undefined;
export let app: FirebaseApp | undefined = undefined
export let storage: FirebaseStorage | undefined = undefined


const env = import.meta.env // vite

console.info("init firebase", import.meta.env)

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
storage = getStorage();


if (getEnv() == Env.DEVELOPMENT) {
    const ip = '127.0.0.1'

    console.log("[firebase emulator] bind firestore to local emulator db")
    connectFirestoreEmulator(db, ip, 8080)
    console.log("[firebase emulator] bind cloud functions to local emulator functions")
    connectFunctionsEmulator(functions, ip, 5003);
    console.log("[firebase emulator] bind authentification")
    connectAuthEmulator(auth, `http://${ip}:9099`);

    //console.log("[firebase emulator] bind storage")
    //connectStorageEmulator(storage, ip, 9199);
}

export async function testFirestore() {
    if (db) {
        const users = collection(db, 'test');
        const userSnapshot = await getDocs(users);
        const userList = userSnapshot.docs.map(doc => doc.data());
        console.log("firestore test [ok]", userList)
    }
}

export async function testFunctions() {
    if (functions) {
        const test = httpsCallable(functions, 'test');
        const result = await test({ text: "test parameter helloWorld" })
        console.log("[test cloud function]", result.data)
    }
}

