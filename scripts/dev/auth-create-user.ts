import { httpsCallable } from "firebase/functions";
import { auth, functions, scriptBootstrap } from "../bootstrap";
import { ERoles } from "@app/modeles/roles";
import { signInWithCustomToken } from "firebase/auth";

scriptBootstrap()



if (functions && auth) {
    const createUser = httpsCallable(functions, 'createUser');
    let result: any = await createUser({
        userEmail: 'xxx@example.com',
        userPassword: 'coucou',
        userName: 'xxx Doe',
        userRole: ERoles.USER
    })

    console.log("result signup", result)

    let token = result.data.token
    console.log("custom token with claim for end user signup", token)

    signInWithCustomToken(auth, token)
        .then((userCredential) => {

            var user = userCredential.user;

            console.log("[user signed in ok]", user)

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

}