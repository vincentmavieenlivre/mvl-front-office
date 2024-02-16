import { initializeApp } from 'firebase/app';



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


    return initializeApp(config);
}