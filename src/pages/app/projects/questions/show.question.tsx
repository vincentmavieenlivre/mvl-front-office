import { selectQuestion, selectQuestionPosition } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QuestionNavigation from './question-navigation/question.navigation'
import "./record-container.scss"
import { FaMicrophoneLines } from "react-icons/fa6";
import RecordButton, { IActionRecordStates } from './record-button/record.button'
import AudioRecorder, { IActionRecordRef } from '@app/components/app/media/AudioRecorder'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { RightCircleOutlined } from '@ant-design/icons'

type Props = {}

interface IEntry {

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
                entriesRef.current[entries.length - 1]?.startRecording()
                setActionState(IActionRecordStates.RECORDING)
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
            setEntries([...entries, {}])
        }

        if (actionState == IActionRecordStates.RECORDING) {
            entriesRef.current[entries.length - 1]?.stopRecording()
            setActionState(IActionRecordStates.WAIT_FOR_RECORD)

        }

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



            <div style={{ marginBottom: 220 }}>
                {entries.map((d, index) => {
                    return (
                        <AudioRecorder key={index} ref={(ref) => addRef(ref, index)} question={question} projectId={projectId}></AudioRecorder>
                    )
                })}
            </div>


            < RecordButton state={actionState} onClick={onRecordButtonClicked}></RecordButton>


        </React.Fragment >
    )
}