import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type Props = {
    children: ReactNode
}

export default function DashboardLayout(props: Props) {
    return (
        <>
            <header className="bg-sky-500 h-16 rounded-br-[40px]">
                <div className="ml-5 h-full ontainer flex flex-row gap-4  items-center">
                    <div className="rounded-lg w-10 h-10 bg-sky-50 bg-[url('https://ui-avatars.com/api/?name=John+Doe')] bg-center"></div>
                    <div className="flex flex-col">
                        <h1 className="text-sky-50 text-1xl font-bold">Bonjour</h1>
                        <h1 className="text-sky-50 text-sm ">Les petits Lilas, 54730</h1>
                    </div>
                </div>
            </header>
            <div>
                {props.children}
            </div>
        </>

    )
}