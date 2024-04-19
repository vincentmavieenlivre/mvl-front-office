import { auth } from '@app/init/firebase'
import React, { ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

type Props = {
    children: ReactNode
}

export default function DashboardLayout(props: Props) {

    let nav = useNavigate()

    const logout = async () => {
        await auth?.signOut()
        nav('/login')
    }


    return (
        <>
            <header className="bg-sky-500 h-16 rounded-br-[40px]">

                <div className="dropdown dropdown-bottom flex  h-full">

                    {/* header */}
                    <div tabIndex={0} className="ml-5 h-full container flex flex-row gap-4  items-center">
                        <div className="rounded-lg w-10 h-10 bg-sky-50 bg-[url('https://ui-avatars.com/api/?name=John+Doe')] bg-center"></div>
                        <div className="flex flex-col">
                            <h1 className="text-sky-50 text-1xl font-bold">Bonjour</h1>
                            <h1 className="text-sky-50 text-sm ">Les petits Lilas, 54730</h1>
                        </div>
                    </div>


                    {/* menu dropdown */}
                    <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4 bg-sky-200">
                        <li onClick={logout} className='p-2'>Se déconnecter</li>

                    </ul>
                </div>

            </header>
            <div>
                {props.children}
            </div>
        </>

    )
}