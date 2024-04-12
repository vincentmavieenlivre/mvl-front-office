import { functions } from '@app/init/firebase'
import { Project } from '@app/modeles/database/project'
import { EPermission, hasPermission, isRole, permissionsByRole } from '@app/modeles/roles'
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
            <ul role="list" className="divide-y divide-gray-100">
                {userProjects.map((p: Project) => (
                    <li key={p.name} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-sky-850">{p.name}</p>
                            </div>
                        </div>
                        <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                            <Link to={`/app/projects/${p.id}`}>
                                <button className='btn btn-block bg-sky-500 text-sky-50 text-xs rounded-3xl'>Éditer</button>
                            </Link>
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