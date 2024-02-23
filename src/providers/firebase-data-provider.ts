import {
    FirebaseAuth,
    FirebaseDatabase,
    FirestoreDatabase,
} from "refine-firebase";
import { app, auth, db } from "../init/firebase";

console.log("[init firebase dataprovider]")
export const refineFirestoreDatabase = new FirestoreDatabase({ firebaseApp: app }, db);