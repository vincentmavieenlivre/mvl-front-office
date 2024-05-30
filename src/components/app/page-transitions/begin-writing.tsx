import { Project } from '@app/modeles/database/project'
import React from 'react'
import Alert from '../alert/alert'

type Props = {
    onNextClicked: () => void
    show: boolean
    project: Project | undefined
}

export default function BeginWrite({ project, show = false, onNextClicked }: Props) {

    if (show == false || !project) {
        return null
    }

    return (
        <div className='bg-sky-500 flex flex-col items-center' style={{ position: "absolute", top: 0, left: 0, height: "100vh", width: "100%" }}>
            <div className="madi mt-20 text-sky-100 text-4xl">{project.name}</div>
            <Alert className='mt-16 ml-10 mr-10 rounded-md' message1="Installez vous confortablement face à votre interlocuteur avec un verre d’eau et/ou quelques photos puis cliquez sur commencer. "></Alert>



            <div className='text-sky-100 mt-20 text-xl'>Nos recommandations</div>
            <div className='flex flex-row text-xl gap-3 mt-2'>
                <div className='text-sky-100'>20 questions</div>
                <span className='text-sky-100'>|</span>
                <div className='text-sky-100'>1 heure</div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-end mb-10 w-full">
                <button onClick={onNextClicked}
                    className={`mt-8 btn bg-sky-500 text-sky-50  rounded-3xl w-10/12 text-xl`}>
                    Suivant
                </button>
            </div>

        </div>
    )
}