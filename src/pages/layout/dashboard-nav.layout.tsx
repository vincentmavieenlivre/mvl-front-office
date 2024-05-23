import { auth } from '@app/init/firebase'
import React, { ReactNode } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";

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
            <header className="bg-sky-500 pt-6 pb-6">

                <div className="dropdown dropdown-bottom flex  h-full">

                    {/* header */}
                    <div tabIndex={0} className="ml-5 h-full container flex flex-row gap-4  items-center">

                        {/* avatar */}
                        <div className="avatar">
                            <div className="w-12 h-12 rounded border border-sky-50 border-2 bg-sky-200">
                                <img src={`https://api.dicebear.com/8.x/lorelei/svg?seed=xxx`} />
                            </div>
                        </div>

                        {/* user name */}
                        <div className="flex flex-col">
                            <h1 className="text-sky-50 text-1xl font-bold">Bonjour</h1>
                            <h1 className="text-sky-50 text-sm ">Virginie Jacob</h1>
                        </div>

                        <div className='grow text-right flex flex-row justify-end mr-5'>
                            <IoMdNotificationsOutline size={30} color='white' />
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