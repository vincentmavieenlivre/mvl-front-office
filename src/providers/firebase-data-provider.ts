
import { app, auth, db } from "../init/firebase";
import { FirestoreDatabase } from "refire-firebase/src";

console.log("[init firebase dataprovider]", db)
export const refineFirestoreDatabase = new FirestoreDatabase({ firebaseApp: app }, db);