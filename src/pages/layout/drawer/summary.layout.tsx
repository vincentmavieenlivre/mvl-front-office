import { RightCircleOutlined } from '@ant-design/icons';
import Alert from '@app/components/app/alert/alert';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { selectChapters, selectProject } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import React, { useRef } from 'react'
import { FaHome } from 'react-icons/fa';
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


    const renderQuestion = (q: IBookQuestion, index) => {



        return (
            <label id={q.id + index}
                onClick={() => {
                    nav(`/app/projects/${project.id}/questions/${q.id}`)
                }}

                htmlFor="my-drawer" className=" mt-4  ripple-bg-sky-50 rounded-xl p-2 text-sky-950 flex flex-row items-center justify-around
                ">
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
                                {c.orderedQuestions?.map((q: IBookQuestion, index) => renderQuestion(q, index))}
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

                    <div className='mt-4 flex flex-row items-center justify-between'>
                        <h2 className='  text-sky-950  text-3xl font-bold'>Sommaire</h2>
                        <Link to={`/app/`}>

                            <button className="mr-4 btn btn-circle btn-outline border-sky-900">
                                <FaHome className=' text-sky-900' size={22} />
                            </button>
                        </Link>
                    </div>
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