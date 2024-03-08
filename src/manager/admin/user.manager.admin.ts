import { CreateRequest, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { log } from "firebase-functions/logger";
import { ECollections } from "../../utils/firebase/firestore-collections";
import { ERoles } from "../../modeles/roles";
import { User } from "../../modeles/database/user";

export  class AdminUserManager {

    public userId:string|undefined

    constructor() {

    }

    async createUser(blob: CreateRequest, userRole: ERoles) {
        console.log("[user create] params", blob)

        if (!blob.email) throw "email is null"
        if (!blob.displayName) throw "name is null"

        let userRecord = await getAuth().createUser(blob)

        // See the UserRecord reference doc for the contents of userRecord.
        log(`Successfully fetched user data:  ${userRecord}`);

        await getAuth().setCustomUserClaims(userRecord.uid, {
            role: userRole
        })

        let customToken = await getAuth().createCustomToken(userRecord.uid, {
            role: userRole
        })

        // create user document
        let userDocument: User = {
            email: blob.email,
            name: blob.displayName,
            role: userRole,
            id:userRecord.uid
        }

        log("[user create] insert document", userDocument)

       

        await getFirestore().collection(ECollections.USERS).doc(userRecord.uid).set(userDocument);
        
        this.userId = userDocument.id

        return customToken
    }


}