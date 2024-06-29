/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';

const app = initializeApp();

export { test } from './test/test'

/* user & family */
export { createUser } from "./user/create-user"
export { inviteFamily } from "./user/invite-family"
export { speechToText } from './transcript/speech-to-text'