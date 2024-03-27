import { User, UserCredential, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react"
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/auth.slice";
interface LoginProps {

}

export const LoginPage = (props: LoginProps) => {
    const dispatch = useDispatch();

    const doLogin = async (email, password) => {

        const auth = getAuth();
        let userCredential: UserCredential | void = await signInWithEmailAndPassword(auth, email, password).catch((e) => console.error("[login error]", e))
        if (userCredential) {
            const user: User = userCredential.user;
            const idTokenResult = await user.getIdTokenResult(true);
            dispatch(setUser({
                user: user,
                tokenResult: idTokenResult
            }))
        }
    }

    const handleLoginSubmit = async (event: any) => {
        event.preventDefault()
        console.log("[form data]", event.target.elements.email.value)
        console.log("[form data]", event.target.elements.password.value)
        await doLogin(event.target.elements.email.value, event.target.elements.password.value)
    }



    return (
        <div className="bg-no-repeat bg-cover bg-center relative" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}>
            <div className="absolute  bg-primary  opacity-80 inset-0 "></div>
            <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center relative">
                <div className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-50">
                    <div className="self-start hidden lg:flex flex-col  text-white">
                        <img src="" className="mb-3" />
                        <h1 className="mb-3 font-bold text-5xl">Hello, connectez-vous ! </h1>
                        <p className="pr-3">Avec votre email et votre mot de passe</p>
                    </div>
                </div>
                <form onSubmit={handleLoginSubmit} className="flex justify-center self-center  z-10">
                    <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
                        <div className="mb-4">
                            <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                            <p className="text-gray-500">Please sign in to your account.</p>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                                <input name="email" className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type="" placeholder="mail@gmail.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                    Password
                                </label>
                                <input type="password" name="password" 
                                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" placeholder="Enter your password" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded" />
                                    <label className="ml-2 block text-sm text-gray-800">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="text-green-400 hover:text-green-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    Sign in
                                </button>
                            </div>
                        </div>
                        <div className="pt-5 text-center text-gray-400 text-xs">
                            <span>
                                Copyright © 2021-2022
                                <a href="https://codepen.io/uidesignhub" rel="" target="_blank" title="Ajimon" className="text-green hover:text-green-500 ">AJI</a></span>
                        </div>
                    </div>
                </form>
            </div>
        </div >

    )
};

export default LoginPage;
