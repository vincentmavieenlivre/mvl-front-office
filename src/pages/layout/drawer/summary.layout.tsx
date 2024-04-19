import { RightCircleOutlined } from '@ant-design/icons';
import Alert from '@app/components/app/alert/alert';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { selectChapters, selectProject } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode
}

export default function SummaryDrawer({ children }: Props) {

    const checkboxRef = useRef(null);

    let nav = useNavigate()

    let project: Project = useSelector((state: RootState) => {
        return selectProject(state)
    })


    let chapters: IChapterTree[] = useSelector((state: RootState) => {
        return selectChapters(state)
    })


    const renderQuestion = (q: IBookQuestion) => {



        return (
            <label
                onClick={() => {
                    nav(`/app/projects/${project.id}/questions/${q.id}`)
                }}

                htmlFor="my-drawer" className=" mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center">
                {/* <Link to={`/app/projects/${project.id}/questions/${q.id}`} key={q.id} className='mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center'> */}
                <div className='text-sm'>{q.questionTitle}</div>
                <RightCircleOutlined className='text-sky-600 px-4' />

            </label>
        )
    }

    const renderChapters = () => {
        return (

            <div className='mt-4'>
                {chapters.map((c: IChapterTree, index: number) => {
                    return (
                        <div key={c.id} className="collapse collapse-arrow bg-sky-100 mt-4">
                            <input type="checkbox" name={"test"} />
                            <div className="collapse-title text-xl font-medium">
                                {c.name}
                            </div>
                            <div className="collapse-content">
                                {c.orderedQuestions?.map((q: IBookQuestion) => renderQuestion(q))}
                            </div>
                        </div>

                    )
                })
                }
            </div>
        )
    }

    return (
        <div className="drawer">
            <input ref={checkboxRef} id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-side" >
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className='menu p-4 w-80 min-h-full bg-sky-50 text-base-content'>

                    <h2 className=' mt-4 text-sky-950  text-3xl font-bold'>Sommaire</h2>

                    <div className='text-sky-950 mt-4 text-lg'>
                        <p>Parcourez et choisissez parmi ces différents chapitres, les questions auxquelles vous souhaitez répondre.</p>
                    </div>

                    <Alert className='mt-4' message1="Recommandation : Répondez à 3 ou 4 questions par chapitre."></Alert>

                    {renderChapters()}
                </div>
            </div>
        </div>
    )
}