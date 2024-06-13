import { CreateRequest, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ECollections } from "../../modeles/database/firestore-collections";
import { User } from "../../modeles/database/user";
import { ERoles } from "@app/modeles/database/roles";

export class AdminUserManager {

    public userId: string | undefined

    constructor() {

    }

    async createCustomToken(firebaseUID: string, userRole: ERoles): Promise<any> {
        const customToken = await getAuth().createCustomToken(firebaseUID, {
            role: userRole
        })
        return customToken
    }

    async createUser(blob: CreateRequest, userRole: ERoles, claimsRole: ERoles, emailVerified: boolean = false): Promise<User> {
        console.log("[user create] params", blob)

        if (!blob.email) throw "email is null"
        if (!blob.displayName) throw "name is null"

        // trim & lowercase
        blob.email = blob.email.trim().toLowerCase()
        blob.displayName = blob.displayName.trim().toLowerCase()

        try {
            await getAuth().getUserByEmail(blob.email);
            throw 'user exists in firebaseAuth'

            // TODO also veriy if to does exists in OUR user collection

        } catch (error) {
            // User does not exist
            if (error.code === 'auth/user-not-found') {
                // TODO Verify it does not exists 
                const userRecord = await getAuth().createUser({
                    ...blob,
                    emailVerified: emailVerified,
                }
                )


                await getAuth().setCustomUserClaims(userRecord.uid, {
                    role: claimsRole
                });

                // See the UserRecord reference doc for the contents of userRecord.
                console.log(`Firebase AUTH user inserted:  ${userRecord}`);

                // create own collection user document
                const userDocument: User = {
                    email: blob.email,
                    name: blob.displayName,
                    role: userRole,
                    id: userRecord.uid
                }

                console.log("[user create] insert document", userDocument)



                await getFirestore().collection(ECollections.USERS).doc(userRecord.uid).set(userDocument);

                this.userId = userDocument.id

                return userDocument
            }

        }


    }


}