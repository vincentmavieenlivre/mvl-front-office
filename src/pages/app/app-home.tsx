import { functions } from '@app/init/firebase'
import { hasPermission } from '@app/manager/admin/roles.manager'
import { Project } from '@app/modeles/database/project'
import { EPermission } from '@app/modeles/database/roles'
import { selectToken, selectUser, selectUserProjects } from '@app/redux/auth.slice'
import { APP_ROUTES } from '@app/routes/app.routes.index'
import { httpsCallable } from 'firebase/functions'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

type Props = {}

export default function AppHome({ }: Props) {

    const userProjects: Project[] = useSelector(selectUserProjects)
    const user = useSelector(selectUser)
    const userToken = useSelector(selectToken)

    const renderProjectList = () => {
        return (
            <ul role="list" className="divide-y divide-gray-300">
                {userProjects.map((p: Project) => (
                    <li key={p.id} className="flex flex-row  gap-x-6 py-5 justify-start ">

                        <div className="avatar">
                            <div className="w-12 h-12 rounded border bg-sky-200">
                                <img src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${p.id}`} />
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto">
                                    <p className="text-sm font-semibold leading-6 text-sky-850">{p.name}</p>
                                    <p className="text-sm f leading-6 text-sky-850">Suzanne Jacob</p>

                                </div>
                            </div>




                            <div className=" shrink-0 flex flex-row justify-end w-100 gap-10 mt-4">
                                <Link to={`/app/projects/${p.id}`}>
                                    <div className=' text-sky-500  '>Éditer</div>
                                </Link>
                                <Link to={`/app/books/${p.id}`}>
                                    <div className=' text-sky-500  '>Apercu</div>
                                </Link>
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
        )
    }



    return (
        <div className='m-5'>
            <h2 className=' mt-12 text-sky-950  text-xl font-bold'>Bienvenue sur Ma Vie En Livre</h2>
            <div className='text-sky-950 mt-4'>
                <p>Capturez et préservez les précieux souvenirs de vos résidents en créant des livres de vie personnalisés.</p>
                <p className='mt-4'>Prêt à commencer ?</p>
                {userToken && hasPermission(userToken, EPermission.CREATE_PROJECT) &&
                    <Link to={APP_ROUTES.NEW_PROJECT}>
                        <button className="mt-8 btn btn-block bg-sky-500 text-sky-50 text-sm rounded-3xl">Commencer</button>
                    </Link>
                }

            </div>


            <h2 className=' mt-12 text-sky-950  text-xl font-bold'>Mes projets</h2>

            {renderProjectList()}
        </div>
    )
}