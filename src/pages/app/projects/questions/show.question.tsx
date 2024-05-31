import { selectSaveDialog, selectQuestion, selectQuestionPosition, selectShouldSave, setDisplaySaveDialog, setQuestionResponse, setShouldSave, ISaveDialog } from '@app/redux/current.project.slice'
import { RootState } from '@app/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionNavigation from './question-navigation/question.navigation'
import "./record-container.scss"
import RecordButton, { IActionRecordStates } from './record-button/record.button'
import AudioRecorder, { IActionRecordRef, IRecord } from '@app/components/app/media/audio-recorder'
import ResponseInteractor from '@app/components/app/media/reponse-interactor'
import { nanoid } from 'nanoid'
import { UserProjectQuestionManager } from '@app/manager/client/user-project-question.manager'
import { IResponse, shouldBeSaved } from '@app/modeles/database/book/response'
import useProject from '@app/hook/use-project'
import { render } from 'react-dom'
import SaveDialog from '@app/components/app/studio/save-dialog/save-dialog'

type Props = {}


export default function ShowQuestion({ }: Props) {
    const dispatch = useDispatch();

    const [isHeaderFixed, setIsHeaderFixed] = useState(false)
    const [entries, setEntries] = useState<IResponse[]>([])
    const audioRecordRef = useRef<IActionRecordRef | undefined>(undefined);

    const navigate = useNavigate()
    const params: any = useParams()

    const [actionState, setActionState] = useState<IActionRecordStates>(IActionRecordStates.WAIT_FOR_RECORD)

    let { id: projectId, questionId } = params;

    useProject(projectId)


    let [question, chapter] = useSelector((state: RootState) => { return selectQuestion(state, questionId) })



    useEffect(() => {
        setEntries(question?.responses?.map((d) => {
            return {
                ...d,
                modified: false
            }
        }) ?? [])

        dispatch(setShouldSave(false))


    }, [question])

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



    const onSaveAll = async () => {

        let m = new UserProjectQuestionManager(projectId, question)

        // trick to min display loader for one sec
        let trick = new Promise((resolve) => setTimeout(resolve, 500))
        await Promise.all([m.updateAllResponses(entries), trick])

        if (question) {

            let responses: IResponse[] = [...entries.map((e) => {
                e.modified = false
                return e
            })]

            dispatch(
                setQuestionResponse(
                    {
                        ...question,
                        responses: responses
                    }
                )
            )

            dispatch(setShouldSave(false))


        }
    }


    let [index, totalCount, prevId, nextId] = useSelector((state: RootState) => {
        return selectQuestionPosition(state, chapter?.id, questionId)
    })

    console.log("question", question?.id, "chapter", chapter?.id, `${index}/${totalCount} prev=${prevId} next=${nextId}`)



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

    if (!question) {
        return (
            <div className='flex flex-row justify-center items-center h-screen'>
                <span className="loading loading-spinner loading-xs"></span>
            </div>
        )
    }

    let seed = question.id

    return (
        <React.Fragment>

            <SaveDialog onSave={onSaveAll}></SaveDialog>



            <QuestionNavigation
                onHeaderFixed={setIsHeaderFixed}
                question={question}
                prevId={prevId} nextId={nextId}
                projectId={projectId}
                currentIndex={index} lastIndex={totalCount} chapterStr={chapter.name}>

            </QuestionNavigation>
            <div className='flex flex-row justify-center mt-4'>
                <img className='rounded-lg w-[300px] h-[200px]' src={question.pictureUrl}></img>
            </div>


            <div className={`m-5 mt-7    text-sky-950 text-md font-bold ${isHeaderFixed ? 'opacity-0 transition-opacity duration-1000 ' : ''}`}>
                {question.questionTitle}
            </div>


            <AudioRecorder
                state={actionState}
                onNewAudioRecorded={async (a: IRecord) => {
                    setEntries([...entries, { id: nanoid(), audioRecord: a, modified: true }])
                    dispatch(setShouldSave(true))
                    return
                }}

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

                                    dispatch(setShouldSave(true))

                                }}
                                entry={entry}
                                isLast={isLast}
                                onTextAnimationEnd={onTextAnimationEnd}
                                changeState={(newState: IActionRecordStates) => setActionState(newState)}
                                state={actionState}

                                onDelete={(idToDelete) => {
                                    let updatedOnes = [...entries.filter((r) => r.id !== idToDelete)]
                                    dispatch(setQuestionResponse({ ...question, responses: updatedOnes }))
                                    setEntries(updatedOnes)
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