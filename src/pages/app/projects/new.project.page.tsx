import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { UserProjectsService } from '@app/domains/services/user-projects.service'
import { db } from '@app/init/firebase'
import { BookTemplateManager } from '@app/manager/backoffice/book-template.manager'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { IBookTemplate } from '@app/modeles/database/book/book-template'
import { Project } from '@app/modeles/database/project'
import { selectUser, selectToken, setUserProjects, addUserProjects } from '@app/redux/auth.slice'
import { ECollections } from '@app/utils/firebase/firestore-collections'
import { FirestoreHelper } from '@app/utils/firebase/firestore-helper'
import { Card, Divider } from 'antd'
import Meta from 'antd/es/card/Meta'
import { Avatar } from 'antd/lib'
import { IdTokenResult, User } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./new.project.scss"
import { useNavigation, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@app/routes/app.routes.index'

type Props = {}

export default function NewProject({ }: Props) {

    const user: User | undefined = useSelector(selectUser)
    const token: IdTokenResult | undefined = useSelector(selectToken)

    const navigate = useNavigate()


    // STATE
    const [templates, setTemplates] = useState<IBookTemplate[]>([])
    const [currentTemplate, setCurrentTemplate] = useState<IBookTemplate | undefined>(undefined)
    const dispatch = useDispatch();

    const loadAllTemplates = async () => {
        if (db) {
            let templates = await BookTemplateManager.loadAllTemplates(db)
            if (templates && templates.length) {
                console.log("templates loaded", templates.length)
                setTemplates(templates)
            }
        }
    }

    useEffect(() => {
        loadAllTemplates()
    }, [])


    const onProjectSubmit = async (event: any) => {
        console.log("form create project submit", event.target.projectName.value)
        event.preventDefault()
        if (event.target.projectName.value && user && token && db && currentTemplate?.id) {
            let projectName = event.target.projectName.value;
            let newProject: Project = await UserProjectsService.createProject(projectName, user, token, currentTemplate?.id)
            dispatch(addUserProjects(newProject))
            navigate(APP_ROUTES.LIST_PROJECTS)

        } else {
            console.warn('no project selected')
        }
    }

    const renderTemplateCard = (t: IBookTemplate) => {
        return (
            <div key={t.id}>
                <Card onClick={() => setCurrentTemplate(t)} className={'card ' + (currentTemplate == t ? 'active' : '')}
                    style={{ width: 300 }}
                    cover={
                        <img
                            alt="example"
                            src={t.coverUrl}
                        />
                    }
                 /*    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]} */
                >
                    <Meta
                        title={t.name}
                        description="Racontez vos souvenirs d'enfance"
                    />
                </Card>
            </div>
        )
    }


    return (

        <form onSubmit={onProjectSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Le nom de votre projet</label>
                    <input type="text" id="projectName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Nommez votre projet" required />
                </div>
            </div>

            {templates.map((t: IBookTemplate) => {
                return renderTemplateCard(t)
            })

            }


            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
             focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
             dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-10">Créer mon projet</button>
        </form >

    )
}