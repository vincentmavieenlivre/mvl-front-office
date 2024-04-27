import { selectQuestion, selectQuestionPosition } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QuestionNavigation from './question-navigation/question.navigation'
import "./record-container.scss"
import { FaMicrophoneLines } from "react-icons/fa6";
import RecordButton, { IActionRecordStates } from './record-button/record.button'
import AudioRecorder, { IActionRecordRef } from '@app/components/app/media/audio-recorder'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { RightCircleOutlined } from '@ant-design/icons'
import { TypeAnimation } from 'react-type-animation'
import ResponseInteractor from '@app/components/app/media/reponse-interactor'
import { nanoid } from 'nanoid'
import { isAllOf } from '@reduxjs/toolkit'

type Props = {}

export interface IEntry {
    id: string;
    audio: any;
}

export default function ShowQuestion({ }: Props) {

    const [entries, setEntries] = useState<IEntry[]>([])
    const audioRecordRef = useRef<IActionRecordRef | undefined>(undefined);

    const navigate = useNavigate()
    const params: any = useParams()

    const [actionState, setActionState] = useState<IActionRecordStates>(IActionRecordStates.WAIT_FOR_RECORD)

    let { id: projectId, questionId } = params;
    console.log("test, id: ", projectId, "questions", questionId)

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

    let [index, totalCount, prevId, nextId] = useSelector((state: RootState) => {
        return selectQuestionPosition(state, chapter.id, questionId)
    })

    console.log("question", question.id, "chapter", chapter.id, `${index}/${totalCount} prev=${prevId} next=${nextId}`)



    useEffect(() => {
        if (entries.length) {

        }

    }, [entries])


    const renderQuestion = (q: IBookQuestion) => {
        return (

            <Link to={`/app/projects/${params.id}/questions/${q.id}`} key={q.id} className='mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center'>
                <div className='text-sm'>{q.questionTitle}</div>
                <RightCircleOutlined className='text-sky-600 px-4' />
            </Link>
        )
    }

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

    const text = "faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente"



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
                onNewAudioRecorded={async (a: any) => {
                    setEntries([...entries, { id: nanoid(), audio: a }])
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
                            style={{ display: (isLast && entry.audio && actionState !== IActionRecordStates.UPLOADING) || isLast == false ? 'block' : 'none' }}

                            className='bg-white shadow-lg rounded-md m-2 mt-8'>
                            <ResponseInteractor
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


            <RecordButton state={actionState} onClick={onRecordButtonClicked}></RecordButton>


        </React.Fragment >
    )
}