import React, { ReactElement } from 'react'
import { MdWavingHand } from 'react-icons/md';

type Props = {
    message1: string;
    message2?: string;
    icon?: ReactElement;
    className: string
}

export default function Alert(props: Props) {
    return (
        <div className={` bg-sky-100 px-4 py-3 shadow-md ${props.className}`} role="alert">
            <div className="flex">
                <div className="py-1">
                    <div className='fill-current h-6 w-6 text-sky-500 mr-4'>
                        <MdWavingHand size={20}></MdWavingHand>

                    </div>

                </div>
                <div>
                    <p className="">{props.message1}</p>
                    {props.message2 &&
                        <p className="text-sm">{props.message2}</p>
                    }
                </div>
            </div>
        </div>
    )
}