import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, collection, connectFirestoreEmulator, getDocs, getFirestore } from 'firebase/firestore';
import { Env, getEnv } from '../utils/EnvUtils';

export let db: Firestore | undefined = undefined;
export let firebase: FirebaseApp | undefined = undefined

export function initFirebase() {

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

    let app = initializeApp(config);
    db = getFirestore(app);

    if (getEnv() == Env.DEVELOPMENT) {
        console.log("[firebase emulator] bind firestore to local emulator db")
        connectFirestoreEmulator(db, '127.0.0.1', 8080)
    }
}


export async function testFirestore() {
    if (db) {
        const users = collection(db, 'test');
        const userSnapshot = await getDocs(users);
        const userList = userSnapshot.docs.map(doc => doc.data());
        console.log("firestore test [ok]", userList)
    }
}

