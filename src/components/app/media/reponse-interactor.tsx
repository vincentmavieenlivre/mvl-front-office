import { IBookQuestion } from '@app/modeles/database/book/book-question';
import React, { useState } from 'react'
import AudioRecorder from './audio-recorder';
import { TypeAnimation } from 'react-type-animation';
import { Spin } from 'antd';
import TextareaAutosize from 'react-textarea-autosize';
import "./response-interactor.scss"
import { IActionRecordStates } from '@app/pages/app/projects/questions/record-button/record.button';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length: number) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


type Props = {
    index: number;
    question: IBookQuestion;
    projectId: string;
    onAudioRef: (ref: any, index: number) => void
    onDelete: (index: number) => void
    state: IActionRecordStates
    changeState: (newState: IActionRecordStates) => void
}

export default function ResponseInteractor({ state, index, question, projectId, onAudioRef, onDelete, changeState }: Props) {

    const [isTranscribing, setIsTranscribing] = useState<boolean>(false)
    const [transcribedText, setTranscribedText] = useState<string | undefined>(undefined)
    const [animateText, setAnimateText] = useState<boolean>(false)
    const [text, setText] = useState<string | undefined>(undefined)


    const onNewAudio = async (audio: any) => {
        console.log("new audio", audio)

        changeState(IActionRecordStates.UPLOADING)

        await new Promise(resolve => setTimeout(resolve, 4000));


        // transcribed
        changeState(IActionRecordStates.TRANSCRIBING)
        setTimeout(() => {
            setText(generateString(100))
            setAnimateText(true)
            changeState(IActionRecordStates.WAIT_FOR_RECORD)

        }, 2000);

    }

    const textStyle = { fontSize: '1em' }


    return (
        <div>
            <AudioRecorder
                state={state}
                onNewAudioRecorded={onNewAudio} onDelete={() => {
                    onDelete(index)
                }}
                key={index} ref={(ref) => onAudioRef(ref, index)} question={question} projectId={projectId}>

            </AudioRecorder>
            <div>

                {state == IActionRecordStates.TRANSCRIBING &&
                    <div className='flex flex-row justify-center mt-4'>

                        <span className="loading loading-dots loading-xl text-sky-500 "></span>
                    </div>
                }

                <div className='w-full max-w-screen-sm p-6 text-sky-950 ' style={textStyle}>

                    {animateText == true &&
                        <TypeAnimation
                            className='break-all text-wrapper' style={{}}
                            sequence={[0,
                                text, () => {
                                    setAnimateText(false)
                                },

                            ]}
                            wrapper="span"
                            speed={75}
                        //style={ }

                        />
                    }
                    {animateText == false &&
                        <TextareaAutosize className='text-wrapper w-full break-all rounded-md focus:border-blue-500' defaultValue={text}></TextareaAutosize>
                    }

                </div>
            </div>
        </div>
    )
}