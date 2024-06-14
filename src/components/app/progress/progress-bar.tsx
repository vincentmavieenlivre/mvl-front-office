import React from 'react'

import './progress-bar.css'
type Props = {
    message?: string;
    min: number;
    max: number;
    current: number
    containerClass?: string
}

const EMPTY_SPACE_POURCENTAGE = 2

export default function ProgressBar({
    min = 0,
    current,
    max,
    message,
    containerClass = ''

}: Props) {

    let currentWidthPourcentage = (current / max * 100)

    return (
        <div className={`progress-bar flex flex-row w-full ${containerClass}`} >
            {/* current */}
            <div className='bar bg-sky-800' style={{ width: currentWidthPourcentage.toString() + "%" }}>

            </div>

            <div className='bg-white' style={{ width: EMPTY_SPACE_POURCENTAGE.toString() + "%" }}></div>

            {/* remaining */}
            <div className='bar bg-sky-300' style={{ width: (100 - currentWidthPourcentage - EMPTY_SPACE_POURCENTAGE).toString() + "%" }}>

            </div>
        </div>
    )
}   