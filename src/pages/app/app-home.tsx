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
                                <p className="text-sm font-semibold leading-6 text-gray-900">{p.name}</p>
                            </div>
                        </div>
                        <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                            <Link to={`/app/projects/${p.id}`}>
                                <button className='btn btn-primary'>Éditer</button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }



    return (
        <>
            <h2>Mes projects</h2>
            <div className='m-4 flex flex-end'>
                {userToken && hasPermission(userToken, EPermission.CREATE_PROJECT) &&
                    <Link to={APP_ROUTES.NEW_PROJECT}>
                        <button className="btn btn-primary">Créer projet</button>
                    </Link>
                }

            </div>
            {renderProjectList()}
        </>
    )
}