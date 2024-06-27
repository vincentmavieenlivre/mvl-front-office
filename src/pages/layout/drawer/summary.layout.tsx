import { RightCircleOutlined } from '@ant-design/icons';
import Alert from '@app/components/app/alert/alert';
import { IBookQuestion } from '@app/modeles/database/book/book-question';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { selectAllQuestions, selectChapters, selectProject } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import { pluralize } from '@app/utils/diverse.utils';
import React, { useEffect, useRef, useState } from 'react'
import { FaHome } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { isEqual } from "lodash";
import SummaryWithStates from '@app/components/app/summary/summary-with-states';
import Summary from '@app/components/app/summary/summary';
import "./summary.layout.scss"
import useProject from '@app/hook/use-project';
import ProgressBar from '@app/components/app/progress/progress-bar';
import { IoChevronBack } from "react-icons/io5";

enum ETabSelected {
    SUMMARY,
    MY_BOOK
}

export const MIN_QUESTIONS_TO_GENERATE = 20

type Props = {
    children: React.ReactNode
}

export default function SummaryDrawer({ children }: Props) {

    const tabs = [
        {
            title: "Sommaire",
            tab: ETabSelected.SUMMARY
        }, {
            title: "Mon livre",
            tab: ETabSelected.MY_BOOK
        }
    ]

    const checkboxRef = useRef(null);

    let nav = useNavigate()

    /*   let project: Project = useSelector((state: RootState) => {
          return selectProject(state)
      }) */

    let project = useProject()


    let chapters: IChapterTree[] = useSelector((state: RootState) => {
        return selectChapters(state)
    })

    const [tabSelected, setTabSelected] = useState<ETabSelected>(ETabSelected.SUMMARY)


    let currentProgress = ((project?.stats?.numAnswered ?? 1) / MIN_QUESTIONS_TO_GENERATE) * 100

    console.log("current progress", currentProgress)
    return (
        <div className="drawer">
            <input ref={checkboxRef} id="summary-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-side" >
                <label htmlFor="summary-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className='menu p-4 w-full min-h-full bg-sky-50 text-base-content'>

                    <div className='mb-4 flex flex-row items-center justify-between'>


                        <button onClick={() => {
                            if (checkboxRef.current) {
                                checkboxRef.current.checked = !checkboxRef.current.checked;
                            }
                        }} className="mr-4 btn  border-sky-900">
                            <IoChevronBack className=' text-sky-900' size={22} />
                        </button>


                        <Link to={`/app/`}>
                            <button className="mr-4 btn  btn-outline border-sky-900">
                                <FaHome className=' text-sky-900' size={22} />
                            </button>
                        </Link>

                    </div>
                    {/*    <div className='text-sky-950 mt-4 text-lg'>
                        <p>Parcourez et choisissez parmi ces différents chapitres, les questions auxquelles vous souhaitez répondre.</p>
                    </div>

                    <Alert className='mt-4' message1="Recommandation : Répondez à 3 ou 4 questions par chapitre."></Alert>
 */}
                    <div className='flex flex-row justify-evenly mt-4 tab'>
                        {tabs.map((t) => {

                            const isActive = t.tab === tabSelected;
                            const tabClassName = isActive ? 'text-2xl active' : 'text-2xl';

                            return (<div
                                key={t.tab}
                                className={tabClassName}
                                onClick={() => setTabSelected(t.tab)} >{t.title}</div>)
                        })}
                    </div>


                    {project?.id && tabSelected == ETabSelected.MY_BOOK &&
                        <SummaryWithStates saveDialog={true} projectId={project.id}>
                            <>
                                <Alert className='mt-7 ml-1 mr-1 rounded-md'
                                    message1='Trucs et astuces'
                                    message2="Retrouvez ici toutes les questions auxquelles vous avez déjà répondues."></Alert>
                                <ProgressBar containerClass='mt-6 mb-6' message={`Réponses enregistrées: ${project?.stats?.numAnswered}/${MIN_QUESTIONS_TO_GENERATE}`} min={0} max={100} current={currentProgress}></ProgressBar>
                            </>
                        </SummaryWithStates>
                    }

                    {project?.id && tabSelected == ETabSelected.SUMMARY &&
                        <Summary saveDialog={true} projectId={project.id}>

                        </Summary>
                    }


                </div>
            </div>
        </div>
    )
}