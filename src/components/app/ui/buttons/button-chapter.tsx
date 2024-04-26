import React, { Children } from 'react'

type Props = {
    children: React.ReactNode;
    className?: string;
}

export default function ButtonChapter(props: Props) {
    return (
        <button className={`btn btn-block bg-sky-300 text-sky-50 text-1xl w-80 rounded-3xl ${props.className} `}>{props.children}</button>
    )
}