import { selectQuestion, selectQuestion2, selectQuestionPosition } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QuestionNavigation from './question-navigation/question.navigation'
import "./record-container.scss"
import { FaMicrophoneLines } from "react-icons/fa6";
import RecordButton, { IActionRecordStates } from './record-button/record.button'
import AudioRecorder, { IActionRecordRef, IRecord } from '@app/components/app/media/audio-recorder'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { RightCircleOutlined } from '@ant-design/icons'
import { TypeAnimation } from 'react-type-animation'
import ResponseInteractor from '@app/components/app/media/reponse-interactor'
import { nanoid } from 'nanoid'
import { createSelector, isAllOf } from '@reduxjs/toolkit'
import { UserProjectQuestionManager } from '@app/manager/client/user-project-question.manager'

type Props = {}

export interface IResponse {
    id: string;
    audioRecord: IRecord;
    text?: string;
    modified: boolean;
}

export default function ShowQuestion({ }: Props) {

    const [entries, setEntries] = useState<IResponse[]>([])
    const audioRecordRef = useRef<IActionRecordRef | undefined>(undefined);

    const navigate = useNavigate()
    const params: any = useParams()

    const [actionState, setActionState] = useState<IActionRecordStates>(IActionRecordStates.WAIT_FOR_RECORD)

    let { id: projectId, questionId } = params;

    useEffect(() => {
        setEntries([])
    }, [params])

    const scrollToEnd = () => {
        const { scrollHeight, clientHeight } = document.documentElement;
        const maxScroll = scrollHeight - clientHeight;
        window.scrollTo({ top: maxScroll, behavior: 'smooth' });
    }

    useEffect(() => {

        if (actionState == IActionRecordStates.END) {
            setActionState(IActionRecordStates.WAIT_FOR_RECORD)
            setTimeout(() => {
                scrollToEnd()
            }, 300);

        }
    }, [actionState])


    let [question, chapter] = useSelector((state: RootState) => { return selectQuestion(state, questionId) })

    const onSaveAll = async () => {

        let m = new UserProjectQuestionManager(projectId, question)

        // trick to min display loader for one sec
        let trick = new Promise((resolve) => setTimeout(resolve, 500))
        await Promise.all([m.updateAllResponses(entries), trick])

        setEntries([...entries.map((e) => {
            e.modified = false
            return e
        })])
    }


    let [index, totalCount, prevId, nextId] = useSelector((state: RootState) => {
        return selectQuestionPosition(state, chapter.id, questionId)
    })

    console.log("question", question.id, "chapter", chapter.id, `${index}/${totalCount} prev=${prevId} next=${nextId}`)



    const onRecordButtonClicked = () => {

        console.log("onRecordButtonClicked STATE=", actionState)

        if (actionState == IActionRecordStates.WAIT_FOR_RECORD) {
            audioRecordRef?.current?.startRecording()
            setActionState(IActionRecordStates.RECORDING)
        }

        if (actionState == IActionRecordStates.RECORDING) {
            console.log("try to stop record")
            audioRecordRef?.current?.stopRecording()
            setActionState(IActionRecordStates.UPLOADING)

        }

    }

    const onTextAnimationEnd = () => {
        scrollToEnd()
    }

    return (
        <React.Fragment>
            <QuestionNavigation
                prevId={prevId} nextId={nextId}
                projectId={projectId}
                currentIndex={index} lastIndex={totalCount} chapterStr={chapter.name}>

            </QuestionNavigation>

            <div className='m-5 mt-7 text-sky-950'>
                {question.questionTitle}
            </div>

            <AudioRecorder
                state={actionState}
                onNewAudioRecorded={async (a: IRecord) => {
                    setEntries([...entries, { id: nanoid(), audioRecord: a, modified: true }])
                    return
                }
                }

                ref={audioRecordRef} question={question} projectId={projectId}>

            </AudioRecorder>


            <div style={{ marginBottom: 300 }}>
                {entries.map((entry, index) => {

                    let isLast = entries.length == index + 1

                    return (
                        <div key={entry.id} id={entry.id}
                            style={{ display: (isLast && entry.audioRecord && actionState !== IActionRecordStates.UPLOADING) || isLast == false ? 'block' : 'none' }}

                            className='bg-white shadow-lg rounded-md m-2 mt-8'>
                            <ResponseInteractor
                                onEntryChange={(newEntry: IResponse) => {
                                    setEntries([...entries.map((e: IResponse) => {
                                        if (e.id === newEntry.id) {
                                            return { ...newEntry, modified: true }
                                        } else {
                                            return e
                                        }
                                    })])
                                }}
                                entry={entry}
                                isLast={isLast}
                                onTextAnimationEnd={onTextAnimationEnd}
                                changeState={(newState: IActionRecordStates) => setActionState(newState)}
                                state={actionState}

                                onDelete={(idToDelete) => {
                                    setEntries([...entries.filter((r) => r.id !== idToDelete)])
                                }} index={index} question={question} projectId={projectId}></ResponseInteractor>
                        </div>
                    )
                })}
            </div>

            {/*         <button className="btn btn-primary fixed z-50 bottom-2" onClick={() => {
                console.log(entries)
            }} >debug</button> */}

            <RecordButton onSaveAll={async () => onSaveAll()} entries={entries} state={actionState} onClick={onRecordButtonClicked}></RecordButton>


        </React.Fragment >
    )
}