import { auth } from '@app/init/firebase'
import { selectToken, selectUser } from '@app/redux/auth.slice'
import { IdTokenResult } from 'firebase/auth'
import React from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const BackOfficeNavBar = (props: Props) => {

    const user = useSelector(selectUser)
    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)

    if (!user || !tokenResult) {
        return (null)
    }

    const logout = async () => {
        await auth?.signOut()
    }

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Mvl</a>
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    {user?.email} - {tokenResult?.claims.role}
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">

                        <li onClick={logout}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BackOfficeNavBar