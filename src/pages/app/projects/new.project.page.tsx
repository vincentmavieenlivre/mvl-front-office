import { UserProjectsService } from '@app/domains/services/user-projects.service'
import { db } from '@app/init/firebase'
import { Project } from '@app/modeles/database/project'
import { selectUser, selectToken, setUserProjects, addUserProjects } from '@app/redux/auth.slice'
import { ECollections } from '@app/utils/firebase/firestore-collections'
import { FirestoreHelper } from '@app/utils/firebase/firestore-helper'
import { Divider } from 'antd'
import { IdTokenResult, User } from 'firebase/auth'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {}

export default function NewProject({ }: Props) {

    const user: User | undefined = useSelector(selectUser)
    const token: IdTokenResult | undefined = useSelector(selectToken)
    const dispatch = useDispatch();

    const onProjectSubmit = async (event: any) => {
        console.log("form submit", event.target.projectName.value)
        event.preventDefault()
        if (event.target.projectName.value && user && token && db) {
            let projectName = event.target.projectName.value;
            let newProject: Project = UserProjectsService.projectFactory(projectName, user, token)
            await new FirestoreHelper().createNewDocument(db, ECollections.PROJECTS, newProject)
            dispatch(addUserProjects(newProject))

        }
    }


    return (

        <form onSubmit={onProjectSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label for="projectName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Le nom de votre projet</label>
                    <input type="text" id="projectName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Mon mariage" required />
                </div>
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
             dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Créer mon projet</button>
        </form >

    )
}