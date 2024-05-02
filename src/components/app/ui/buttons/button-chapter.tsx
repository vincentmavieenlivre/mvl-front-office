import React, { Children, useState } from 'react'

type Props = {
    children: React.ReactNode;
    className?: string;
    hide?: boolean;
    onClick?: (e: any) => Promise<any>;
}

export default function ButtonChapter(props: Props) {

    const [loading, setLoading] = useState(false)

    if (props.hide == true) {
        return null
    }
    return (
        <button onClick={async (e) => {
            if (props.onClick) {
                setLoading(true)
                await props.onClick(e)
                setLoading(false)
            }
        }} disabled={props.hide ?? false} className={`btn btn-block  text-sky-50 text-1xl w-80 rounded-3xl ${props.className}  bg-sky-300`}>

            {loading == false &&
                props.children
            }

            {loading == true &&
                <span className="loading loading-spinner"></span>
            }


        </button >
    )
}