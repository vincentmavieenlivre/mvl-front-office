import { httpsCallable } from "firebase/functions";
import { auth, functions, scriptBootstrap } from "../bootstrap";
import { ERoles } from "@app/modeles/roles";
import { signInWithCustomToken } from "firebase/auth";

scriptBootstrap()



if (functions && auth) {
    const createUser = httpsCallable(functions, 'createUser');
    const result: any = await createUser({
        userEmail: 'xxx@example.com',
        userPassword: 'coucou',
        userName: 'xxx Doe',
        userRole: ERoles.USER
    })

    console.log("result signup", result)

    const token = result.data.token
    console.log("custom token with claim for end user signup", token)

    signInWithCustomToken(auth, token)
        .then((userCredential) => {

            const user = userCredential.user;

            console.log("[user signed in ok]", user)

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });

}