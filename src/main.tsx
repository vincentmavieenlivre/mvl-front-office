import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initFirebase, testFirestore, testFunctions } from './init/firebase.ts'
import { Env, getEnv } from './utils/EnvUtils.ts'
import { BrowserRouter } from "react-router-dom";

initFirebase()

if (getEnv() == Env.DEVELOPMENT || getEnv() == Env.STAGING) {
  await testFirestore()
  await testFunctions()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
