import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type Props = {
    children: ReactNode
}

export default function StudioLayout(props: Props) {
    return (
        <>
            <header className="bg-sky-500 h-16 rounded-br-[40px]">
                [studio]
            </header>
            <div>
                {props.children}
            </div>
        </>

    )
}