import { CreateRequest, getAuth } from "firebase-admin/auth";
import { log } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { ERoles } from "../../../src/modeles/roles";
import { User } from "../../../src/modeles/database/user";
import { ECollections } from "../../../src/utils/firebase/firestore-collections";
import { getFirestore } from 'firebase-admin/firestore';

export const createUser = onRequest({ cors: true }, async (req, res) => {

    log("tests from .env TEST_VAR=", process.env.TEST_VAR, "NODE_ENV=", process.env.NODE_ENV);

    let params = req.body.data

    log(params)

    let userEmail = params.userEmail
    let userPassword = params.userPassword
    let userName = params.userName
    let userRole = ERoles.USER

    let blob: CreateRequest = {
        email: userEmail,
        emailVerified: true,
        password: userPassword,
        displayName: userName,
        disabled: false
    }



    console.log("[user create] params", blob)

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
        email: userEmail,
        name: userName,
        role: userRole
    }

    log("[user create] insert document", userDocument)
    await getFirestore().collection(ECollections.USERS).doc(userRecord.uid).set(userDocument);

    res.status(200).send({
        data: { token: customToken }//to be called with firebase.auth().signInWithCustomToken(token) at client side
    });

});
