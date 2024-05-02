import { IBookQuestion } from '@app/modeles/database/book/book-question';
import React, { useEffect, useRef, useState } from 'react'
import AudioRecorder from './audio-recorder';
import { TypeAnimation } from 'react-type-animation';
import { Spin } from 'antd';
import TextareaAutosize from 'react-textarea-autosize';
import "./response-interactor.scss"
import { IActionRecordStates } from '@app/pages/app/projects/questions/record-button/record.button';
import { IResponse } from '@app/pages/app/projects/questions/show.question';
import Player, { playerIconSize } from './player';
import { TbTrashXFilled } from 'react-icons/tb';
import { AudioProcessor } from '@app/domains/services/audio-processor.service';
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
    onDelete: (id: string) => void
    state: IActionRecordStates
    changeState: (newState: IActionRecordStates) => void
    onTextAnimationEnd: () => void;
    entry: IResponse,
    isLast: boolean
    onEntryChange: (entry: IResponse) => void;
}

const debugWait = 500;

const DO_FAKE = false

export default function ResponseInteractor({
    entry,
    onTextAnimationEnd, state, isLast, index, question, projectId, onDelete, changeState, onEntryChange }: Props) {


    const [animateText, setAnimateText] = useState<boolean>(false)
    const [text, setText] = useState<string | undefined>(undefined)
    const [displayPlayer, setDisplayPlayer] = useState(false)

    const textArea = useRef<HTMLTextAreaElement>(null)

    const fake = async (audio: any) => {
        console.log("ON new audio", audio)
        changeState(IActionRecordStates.UPLOADING)
        await new Promise(resolve => setTimeout(resolve, debugWait));
        // transcribed
        changeState(IActionRecordStates.TRANSCRIBING)
        await new Promise(resolve => setTimeout(resolve, debugWait));
        entry.text = generateString(400)
        setText(entry.text)
        setAnimateText(true)
        changeState(IActionRecordStates.END)
        onEntryChange(entry)
    }

    const onNewAudio = async (audio: any): Promise<any> => {

        if (DO_FAKE) {
            await fake(audio)
        } else {
            if (question.id) {
                let ap = new AudioProcessor(projectId, question.id, entry)
                changeState(IActionRecordStates.UPLOADING)
                await ap.upload()
                changeState(IActionRecordStates.TRANSCRIBING)
                let transcribed = await ap.transcribe()
                setText(transcribed)
                setAnimateText(true)
                changeState(IActionRecordStates.END)
                onEntryChange(ap.getEntry())
            }
        }
        return true
    }

    useEffect(() => {
        console.log("new audio", entry.audioRecord, state)
        if (entry.audioRecord && state == IActionRecordStates.UPLOADING) {
            onNewAudio(entry.audioRecord)
        } else {
            console.log("not recording")
            setText(entry.text)
            setDisplayPlayer(true)
            changeState(IActionRecordStates.END)
        }
    }, [entry.audioRecord])




    const textStyle = { fontSize: '1em' }


    return (
        <div>

            {entry.audioRecord && displayPlayer ? (
                <div className="audio-player mt-4 flex flex-row items-center justify-around ">
                    {/* <audio  src={audio}  ></audio> */}
                    <button disabled={state == IActionRecordStates.RECORDING} className="btn btn-circle border-none">
                        <Player url={entry.audioRecord.audioUrl}></Player>
                    </button>
                    <button disabled={state == IActionRecordStates.RECORDING} className="btn btn-circle border-none">

                        <TbTrashXFilled onClick={() => onDelete(entry.id)} size={playerIconSize} color="red"></TbTrashXFilled>
                    </button>
                    {/* <a download href={audio}>
							Download Recording
						</a> */}
                </div>
            ) : null}

            {state == IActionRecordStates.TRANSCRIBING && isLast == true &&
                <div className='flex flex-row justify-center mt-4'>

                    <span className="loading loading-dots loading-xl text-sky-500 "></span>
                </div>
            }

            <div className='w-full  p-6 text-sky-950 ' style={textStyle}>

                {animateText == true &&
                    <TypeAnimation
                        className='break-all text-wrapper' style={{}}
                        sequence={[() => { setDisplayPlayer(true) }, 0,
                            text, () => {
                                setAnimateText(false)
                                onTextAnimationEnd()
                            },

                        ]}
                        wrapper="span"
                        speed={95}
                    //style={ }

                    />
                }
                {animateText == false &&
                    <TextareaAutosize
                        ref={textArea}
                        onChange={() => {
                            if (textArea?.current?.value) {
                                const textAreaContent = textArea.current.value;
                                let updatedEntry = { ...entry, text: textAreaContent }
                                onEntryChange(updatedEntry)
                            }
                        }} className='text-wrapper w-full break-all rounded-md focus:border-blue-500' defaultValue={text}></TextareaAutosize>
                }

            </div>

        </div>
    )
}