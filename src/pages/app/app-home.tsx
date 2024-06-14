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
import { LuArrowRightCircle } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";
import { EBookDestination } from '@app/modeles/database/book-target'
import { MdOutlineMenuBook } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { getUserStatusOnProject } from '@app/redux/helpers/project.slice.helpers'
type Props = {}

export default function AppHome({ }: Props) {

    const userProjects: Project[] = useSelector(selectUserProjects)
    const user = useSelector(selectUser)
    const userToken = useSelector(selectToken)

    console.log("user", user)

    const renderProjectList = () => {

        return (
            <ul role="list" className="divide-y divide-gray-300">
                {userProjects?.map((p: Project) => {

                    let userStatus = user?.uid ? getUserStatusOnProject(p, user!.uid) : null

                    return (
                        <li key={p.id} className="flex flex-col  gap-x-6 py-5 justify-start ">

                            <div className="flex flex-row gap-4">
                                <div className="avatar">
                                    {/* AVATAR */}
                                    <div className="w-16 h-16 rounded border bg-sky-200">
                                        {!p.bookFor?.avatarUrl &&
                                            <img src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${p.id}`} />
                                        }
                                        {p.bookFor?.avatarUrl &&
                                            <img src={p.bookFor.avatarUrl} />
                                        }
                                    </div>
                                </div>

                                <div className="flex-grow ">
                                    <div className="flex min-w-0 gap-x-4 h-full">
                                        <div className="min-w-0 flex-col justify-evenly w-full">
                                            {/* BOOK TITLE */}
                                            <div className='flex flex-row justify-between'>
                                                <p className="text-lg text-gray-600 leading-6 text-sky-850 flex flex-row gap-2 items-center"><MdOutlineMenuBook />{p.name}</p>
                                                {userStatus != null &&
                                                    <div className='mr-4 badge bg-sky-500 border-0 text-sky-50 p-3' >{userStatus}</div>
                                                }
                                                <div className='badge'>{p.stats.numAnswered}/{p.stats.totalQuestions}</div>
                                            </div>

                                            {/* WHO */}
                                            <div className='mt-1 text-xl text-gray-700 font-bold leading-6'>

                                                {(p.bookFor?.destination != undefined && p.bookFor?.destination == EBookDestination.OTHER) &&
                                                    <p>{`${p.bookFor?.firstName}  ${p.bookFor?.lastName}`} </p>
                                                }

                                                {(p.bookFor?.destination == EBookDestination.ME) &&
                                                    <p>Mon livre</p>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className=" shrink-0 flex flex-row justify-around w-100 gap-10 mt-6 items-center">

                                <Link to={`/app/books/${p.id}`}>
                                    <div className=' text-gray-500 flex flex-row gap-1 text-cs '>Impression/commande <FiPrinter size={15} className='self-center' />  </div>
                                </Link>
                                <Link className='' to={`/app/projects/${p.id}`}>
                                    <div className=' text-sky-500 flex flex-row gap-1 '>Reprendre <LuArrowRightCircle size={20} className='self-center' /></div>
                                </Link>

                            </div>




                        </li>
                    )
                })
                }
            </ul >
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

            <div className=''>
                <h2 className=' mt-12 mb-4 text-sky-950  text-xl font-bold'>Mes histoires en cours</h2>
                {renderProjectList()}
            </div>

            {/* <div className='mt-20'>
                <h2 className=' mt-12 mb-4 text-sky-950  text-xl font-bold'>Mes histoires en finalisées</h2>
                <GiBookshelf className='text-gray-300 flex flex-row mt-10 ml-10' size={80} />
            </div> */}
        </div>
    )
}