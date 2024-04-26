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

type Props = {}

interface IEntry {
    id: string;
}

export default function ShowQuestion({ }: Props) {

    const [entries, setEntries] = useState<IEntry[]>([])
    const entriesRef = useRef<IActionRecordRef[]>([]);

    const navigate = useNavigate()
    const params: any = useParams()

    const [actionState, setActionState] = useState<IActionRecordStates>(IActionRecordStates.WAIT_FOR_RECORD)

    let { id: projectId, questionId } = params;
    console.log("test, id: ", projectId, "questions", questionId)

    useEffect(() => {
        setEntries([])
    }, [params])



    let [question, chapter] = useSelector((state: RootState) => { return selectQuestion(state, questionId) })

    let [index, totalCount, prevId, nextId] = useSelector((state: RootState) => {
        return selectQuestionPosition(state, chapter.id, questionId)
    })

    console.log("question", question.id, "chapter", chapter.id, `${index}/${totalCount} prev=${prevId} next=${nextId}`)

    const addRef = (ref, index) => {
        console.log("add ref", ref, " at ", index)
        entriesRef.current[index] = ref
    }

    useEffect(() => {
        if (entries.length) {
            setTimeout(() => {
                let last = entriesRef.current[entries.length - 1]
                if (last.getFinished() == false) {
                    console.log("last finished", last.getFinished())
                    entriesRef.current[entries.length - 1]?.startRecording()
                    setActionState(IActionRecordStates.RECORDING)
                }
            }, 100);
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
            setEntries([...entries, { id: nanoid() }])
        }

        if (actionState == IActionRecordStates.RECORDING) {
            entriesRef.current[entries.length - 1]?.stopRecording()
            setActionState(IActionRecordStates.WAIT_FOR_RECORD)

        }

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



            <div style={{ marginBottom: 220 }}>
                {entries.map((d, index) => {
                    return (
                        <div key={d.id} className='bg-white shadow-lg rounded-md m-2 mt-8'>
                            <ResponseInteractor
                                changeState={(newState: IActionRecordStates) => setActionState(newState)}
                                state={actionState}
                                onDelete={(indexToDelete) => {
                                    console.log("delete", indexToDelete)
                                    console.log("entries before", entries.length)
                                    let newEntries = entries.splice(indexToDelete, 1)
                                    console.log("modified entry length", entries.length)
                                    setEntries([...entries])
                                    delete entriesRef.current[indexToDelete]
                                }} onAudioRef={addRef} index={index} question={question} projectId={projectId}></ResponseInteractor>
                        </div>
                    )
                })}
            </div>


            <RecordButton state={actionState} onClick={onRecordButtonClicked}></RecordButton>


        </React.Fragment >
    )
}