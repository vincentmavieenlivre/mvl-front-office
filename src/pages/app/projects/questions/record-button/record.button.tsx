import ButtonChapter from '@app/components/app/ui/buttons/button-chapter'
import React, { useState } from 'react'
import { FaStopCircle } from 'react-icons/fa'
import { FaMicrophoneLines } from 'react-icons/fa6'
import Lottie from 'react-lottie';
import recordAnimationData from '../../../../../assets/animations/recording-button.json'
import uploadAnimationData from '../../../../../assets/animations/uploading.json'
import transcribingAnimationData from '../../../../../assets/animations/transcribing.json'
import { MdMenuBook } from 'react-icons/md';
import './record.buttons.scss'


export enum IActionRecordStates {
    WAIT_FOR_RECORD = "WAIT_FOR_RECORD",
    RECORDING = "RECORDING",
    UPLOADING = "UPLOADING",
    TRANSCRIBING = "TRANSCRIBING",
    END = "END"
}

const help: any = {
    "WAIT_FOR_RECORD": { helpStr: "Cliquez pour enregistrer", icon: <FaMicrophoneLines size={"2.5em"}></FaMicrophoneLines>, classBgColor: "bg-sky-500" },
    "RECORDING": { helpStr: "Cliquez pour stopper", icon: <FaStopCircle size={"2.5em"} ></FaStopCircle>, classBgColor: "bg-red-500" },
    "UPLOADING": { helpStr: "Sauvegarde de l'audio" },
    "TRANSCRIBING": { helpStr: "Transcription en texte", icon: <MdMenuBook size={"2.5em"} ></MdMenuBook>, classBgColor: "bg-sky-500" },
    "END": { helpStr: "Terminé!" }
}

type Props = {
    state: IActionRecordStates;
    onClick: () => void;
}

export default function RecordButton({ state = IActionRecordStates.WAIT_FOR_RECORD, onClick }: Props) {

    const [isStopped, setIsStopped] = useState(true)
    const [isPaused, setIsPaused] = useState(false)

    const transcribingAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: transcribingAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const recordAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: recordAnimationData,
        /*   rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
          } */
    };

    const uploadAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: uploadAnimationData,
        /*   rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
          } */
    };


    return (
        <React.Fragment>
            <div className='record-container '>
                <svg stroke='#b1e6fd' color='green' fill="#b1e6fd" viewBox="0 0 202.9 45.5" >
                    <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7
                             c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5
                             c9.2,3.6,17.6,4.2,23.3,4H6.7z"
                    />
                </svg>
            </div>

            <div className='flex flex-row justify-center fixed record-btn-container'>
                {state == IActionRecordStates.WAIT_FOR_RECORD &&
                    <button onClick={onClick} className={`btn record-btn  w-[7em] h-[7em] rounded-full ${help[state].classBgColor} text-white flex items-center justify-center absolute  z-50  `}>
                        {help[state].icon}
                    </button>
                }

                {state == IActionRecordStates.TRANSCRIBING &&
                    <div className={` record-btn  rounded-full flex items-center  ${help[state].classBgColor} justify-center absolute `}>
                        <Lottie options={transcribingAnimationOptions}
                            height={"7em"}
                            width={"7em"}
                            style={{ zIndex: 9000, backgroundColor: "rgb(14, 165, 233)", borderRadius: "3.5em" }}
                        />
                    </div>
                }

                {state == IActionRecordStates.UPLOADING &&
                    <div className={` record-btn  rounded-full flex items-center  ${help[state].classBgColor} justify-center absolute `}>
                        <Lottie options={uploadAnimationOptions}
                            height={"7em"}
                            width={"7em"}
                            style={{ zIndex: 9000, backgroundColor: "rgb(14, 165, 233)", borderRadius: "3.5em" }}
                        />
                    </div>
                }

                {state == IActionRecordStates.RECORDING &&
                    <div onClick={onClick} className=' record-btn  flex items-center justify-center absolute '>
                        <Lottie options={recordAnimationOptions}
                            height={"7em"}
                            width={"7em"}
                            style={{ zIndex: 9000 }}
                        />
                    </div>
                }
                <div className="record-bar bg-sky-200 fixed">
                    <div className='w-full text-xl text-center text-sky-500 font-bold m-auto'>
                        {help[state].helpStr}
                    </div>
                </div>

                <ButtonChapter className="z-20 mb-2">Sauvegarder</ButtonChapter>

            </div>

        </React.Fragment>
    )
}