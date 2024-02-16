import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initFirebase, testFirestore } from './init/firebase.ts'
import { Firestore, collection, getDocs, getFirestore } from 'firebase/firestore'
import { Env, getEnv } from './utils/EnvUtils.ts'


initFirebase()

if (getEnv() == Env.DEVELOPMENT) {
  testFirestore()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
