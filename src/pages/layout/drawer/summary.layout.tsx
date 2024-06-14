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
enum ETabSelected {
    SUMMARY,
    MY_BOOK
}

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




    return (
        <div className="drawer">
            <input ref={checkboxRef} id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-side" >
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className='menu p-4 w-5/6 min-h-full bg-sky-50 text-base-content'>

                    <div className='mt-4 flex flex-row items-center justify-between'>

                        <h2 onClick={() => {
                            if (checkboxRef.current) {
                                checkboxRef.current.checked = !checkboxRef.current.checked;
                            }
                        }} className='  text-sky-950  text-3xl font-bold'>X</h2>

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
                                <Alert className='mt-7 ml-1 mr-1 rounded-md' message1="Installez vous confortablement face à votre interlocuteur avec un verre d’eau et/ou quelques photos puis cliquez sur commencer. "></Alert>
                                <ProgressBar containerClass='mt-2 mb-2' min={0} max={100} current={75}></ProgressBar>
                            </>
                        </SummaryWithStates>
                    }

                    {project?.id && tabSelected == ETabSelected.SUMMARY &&
                        <Summary saveDialog={true} projectId={project.id}></Summary>
                    }


                </div>
            </div>
        </div>
    )
}