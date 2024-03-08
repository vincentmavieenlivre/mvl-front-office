import { CreateRequest, getAuth } from "firebase-admin/auth";
import { log } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { ERoles } from "../../../src/modeles/roles";
import { User } from "../../../src/modeles/database/user";
import { ECollections } from "../../../src/utils/firebase/firestore-collections";
import { getFirestore } from 'firebase-admin/firestore';
import { AdminUserManager } from "../../../src/manager/admin/user.manager.admin";

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

    let um = new AdminUserManager()
    let customToken = await um.createUser(blob, userRole)

    res.status(200).send({
        data: { token: customToken }//to be called with firebase.auth().signInWithCustomToken(token) at client side
    });

});
