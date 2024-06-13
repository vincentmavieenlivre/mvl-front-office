import { setUser } from "@app/redux/auth.slice";
import { store } from "@app/redux/store"
import { User, UserCredential, getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";

export class AuthManager {

    constructor() {

    }

    public async loginWithAuthToken(authToken: string): Promise<any> {
        const auth = getAuth();
        const userCredential: UserCredential | void = await signInWithCustomToken(auth, authToken).catch((e) => console.error("[login error]", e))
        if (userCredential) {
            const user: User = userCredential.user;
            const idTokenResult = await user.getIdTokenResult(true);
            store.dispatch(setUser({
                user: user,
                tokenResult: idTokenResult
            }))
        }
    }

    public async login(email: string, password: string): Promise<any> {
        const auth = getAuth();
        const userCredential: UserCredential | void = await signInWithEmailAndPassword(auth, email, password).catch((e) => console.error("[login error]", e))
        if (userCredential) {
            const user: User = userCredential.user;
            const idTokenResult = await user.getIdTokenResult(true);
            store.dispatch(setUser({
                user: user,
                tokenResult: idTokenResult
            }))
        }
    }

}