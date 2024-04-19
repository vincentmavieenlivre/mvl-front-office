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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FcPrivacy } from 'react-icons/fc'
import { current } from '@reduxjs/toolkit'
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
            const templates = await BookTemplateManager.loadAllTemplates(db)
            if (templates && templates.length) {
                console.log("templates loaded", templates.length)
                setTemplates(templates)
            }
        }
    }

    useEffect(() => {
        console.log("template change", currentTemplate)
    }, [currentTemplate])


    useEffect(() => {
        loadAllTemplates()
    }, [])


    const onProjectSubmit = async (event: any) => {

        event.preventDefault()

        if (user && token && db && currentTemplate?.id) {
            //const projectName = event.target.projectName.value;
            const newProject: Project = await UserProjectsService.createProject(currentTemplate.name, user, token, currentTemplate?.id)
            dispatch(addUserProjects(newProject))
            navigate(APP_ROUTES.LIST_PROJECTS)

        } else {
            console.warn('no project selected')
        }
    }

    const renderTemplateCard = (t: IBookTemplate) => {
        return (
            <div onClick={() => { setCurrentTemplate(t == currentTemplate ? undefined : t) }} key={t.id}
                className={`mb-10 flex flex-col justify-center items-center shadow-xl border-solid border-1 rounded-2xl bg-white ${currentTemplate?.id == t.id ? 'border-4 border-sky-300' : ''}`}
                style={{ width: 300, height: 300 }}>

                <div className='text-center text-gray-700 text-lg font-bold '>
                    {t.name}
                </div>


                <div className={`bg-cover bg-no-repeat bg-center mt-4`} style={{
                    borderRadius: '10px',
                    backgroundSize: "cover",
                    width: 200,
                    height: 200,
                    backgroundImage: `url('${t.coverUrl}')`
                }}></div>



            </div>
        )
    }



    return (
        <div className='bg-sky-50 h-screen'>
            <form onSubmit={onProjectSubmit} className='p-4'>
                {/* <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Le nom de votre projet</label>
                    <input type="text" id="projectName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Nommez votre projet" required />
                </div>
            </div> */}


                <h2 className=' mt-4 text-sky-950  text-2xl font-bold '>Sélectionnez le thème de votre livre de vie</h2>

                <div className='mt-12'>
                    <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >

                        {templates.map((t: IBookTemplate, index) => {
                            return (
                                <SwiperSlide key={index} className='flex justify-center '>
                                    {renderTemplateCard(t)}
                                </SwiperSlide>

                            )
                        })}



                    </Swiper>
                </div>



                <div className="flex flex-col justify-center items-end fixed bottom-0 left-0 w-full mb-4 items-center">

                    <button type='submit'

                        className={`mt-8 btn ${currentTemplate != undefined ? 'bg-sky-500' : 'bg-sky-200'}   text-sky-50 text-sm rounded-3xl w-11/12 text-xl`}>Suivant</button>

                    <div className='flex flex-row mt-4'>
                        <div className='w-1/5 flex flex-row justify-center'>
                            <FcPrivacy className='self-center text-center' />
                        </div>
                        <div className='text-gray-500 w-4/5'>Vos informations sont sécurisées par chiffrement.</div>

                    </div>
                </div>
            </form >
        </div>
    )
}