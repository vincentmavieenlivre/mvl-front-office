import { RightCircleOutlined } from '@ant-design/icons';
import useProject from '@app/hook/use-project';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { selectProject, selectChapters, selectShouldSave, setDisplaySaveDialog } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import { pluralize } from '@app/utils/diverse.utils';
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SaveDialog from '../studio/save-dialog/save-dialog';

type Props = {
    saveDialog?: boolean;
    projectId?: string
}

export default function Summary(props: Props) {

    let shouldSave: boolean = useSelector((state: RootState) => {
        return selectShouldSave(state)
    })


    useProject(props.projectId)

    let nav = useNavigate()
    let dispatch = useDispatch()

    let project: Project | undefined = useSelector((state: RootState) => {
        return selectProject(state)
    })


    let chapters: IChapterTree[] | undefined = useSelector((state: RootState) => {
        return selectChapters(state)
    })

    const renderQuestion = (q: IBookQuestion, index) => {

        const hasAnswers = (q.responses && q.responses?.length > 0) ?? false;
        const numAnswers = q.responses?.length || 0

        const wantedRoute = `/app/projects/${project.id}/questions/${q.id}`

        return (
            <label id={q.id} key={q.id}
                onClick={() => {
                    if (props.saveDialog && shouldSave) {
                        dispatch(setDisplaySaveDialog({
                            wantedRoute: wantedRoute,
                            displaySaveDialog: true
                        }))
                    } else {
                        nav(wantedRoute)
                    }
                }}
                className={`mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-col ${hasAnswers ? "border-green-400 border-2" : ''}`}
                htmlFor="my-drawer">
                {/* <Link to={`/app/projects/${project.id}/questions/${q.id}`} key={q.id} className='mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center'> */}
                <div className='flex flex-row items-center justify-around'>
                    <div className='text-sm'>{q.questionTitle}</div>
                    <RightCircleOutlined className='text-sky-600 px-4' />
                </div>
                {hasAnswers &&
                    <div className='mt-2 self-end text-green-400'><b>{numAnswers}</b> {pluralize('réponse', numAnswers)} {pluralize('sauvegardée', numAnswers)} </div>
                }

            </label>
        )
    }

    const renderChapters = () => {
        return (

            <div className='mt-4'>
                {chapters?.map((c: IChapterTree, index: number) => {
                    return (
                        <div key={c.id} className="collapse collapse-arrow bg-sky-100 mt-4">
                            <input type="checkbox" name={"test"} defaultChecked={index == 0} />
                            <div className="collapse-title text-xl font-medium">
                                {c.name}
                            </div>
                            <div className="collapse-content">
                                {c.orderedQuestions?.map((q: IBookQuestion, index) => renderQuestion(q, index))}
                            </div>
                        </div>

                    )
                })
                }
            </div>
        )
    }

    return renderChapters()

}