import { CreateRequest, UserRecord, getAuth } from "firebase-admin/auth";
import { log } from "firebase-functions/logger";
import { onCall, onRequest } from "firebase-functions/v2/https";
import { ERoles } from "../../../src/manager/admin/roles.manager";
import { User } from "../../../src/modeles/database/user";
import { ECollections } from "../../../src/modeles/database/firestore-collections";
import { getFirestore } from 'firebase-admin/firestore';
import { generateUniqueToken } from "../utils/utils.function";
import { AdminUserManager } from "../../../src/manager/admin/user.manager.admin";

export const inviteFamily = onCall(async (request) => {

    log("tests from .env TEST_VAR=", process.env.TEST_VAR, "NODE_ENV=", process.env.NODE_ENV);

    let params = request.data

    let familyEmail = params.familyEmail
    if (familyEmail) {
        log("email family", familyEmail)
        if (request.auth?.uid) {
            let userAuth: UserRecord = await getAuth().getUser(request.auth?.uid)
            log("user claims", userAuth.customClaims.role)

            const userDocRef = await getFirestore().collection(ECollections.USERS).doc(userAuth.uid).get()
            let userDoc: User | undefined = userDocRef.data() as User;
            log("user Doc", userDoc)
            if (userDoc) {
                let invitationToken = generateUniqueToken()
                let blob: CreateRequest = {
                    email: userEmail,
                    emailVerified: true,
                    password: userPassword,
                    displayName: userName,
                    disabled: false
                }

                let um = new AdminUserManager()
                let customToken = await um.createUser(blob, userRole)

            }
        }
    }
})