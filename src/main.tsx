import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initFirebase, testFirestore } from './init/firebase.ts'
import { Env, getEnv } from './utils/EnvUtils.ts'


initFirebase()

if (getEnv() == Env.DEVELOPMENT || getEnv() == Env.STAGING) {
  testFirestore()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
