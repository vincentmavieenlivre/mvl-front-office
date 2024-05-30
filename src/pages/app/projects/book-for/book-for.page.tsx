import { useNavigate, useParams } from 'react-router-dom'
import useProject from '@app/hook/use-project'
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component'
import { EBookDestination, EForGenre } from '@app/modeles/database/book-target'
import { useEffect, useState } from 'react'
import { UserProjectsService } from '@app/domains/services/user-projects.service'
import { db } from '@app/init/firebase'
import { Project } from '@app/modeles/database/project'
import { updateUserProjectInList } from '@app/redux/auth.slice'
import { useDispatch } from 'react-redux'
import { set } from 'lodash'

type Props = {}

export default function ShowBookForPage({ }: Props) {
    const params: any = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const project = useProject(params.id)

    const [destination, setDestination] = useState<EBookDestination>(project?.bookFor?.destination ?? EBookDestination.ME)


    const saveDestination = async () => {
        if (db && project?.id) {
            await UserProjectsService.updateProjectDestination(db, destination, project?.id)
            console.log("set value", destination, project)
            set({ ...project }, 'bookFor.destination', destination, (value: number) => {
                console.log("value", value)
                return (value === undefined ? 0 : value)
            });
            dispatch(updateUserProjectInList(project))
            navigate(`/app/projects/${project.id}/bookForDetails`)

        }
    }

    useEffect(() => {

        console.log("desintation", destination)
    }, [destination])


    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Quelques informations  supplémentaires ...</h2>

                {/* your selection */}
                <div className='flex flew-row mt-5'>
                    <div className="avatar  w-16 h-16 rounded border-4 border-sky-200 bg-sky-200">
                        <img src={project?.templateCoverUrl} />
                    </div>

                    <div className='ml-5'>
                        <p>Vous avez sélectionné le thème</p>
                        <p className='mt-2 text-sky-500 font-bold'>{project?.name}</p>
                    </div>
                </div>

                {/* genre */}
                <div className='flex flex-col mt-10 mr-5'>
                    <p className='text-lg'>Qui est la personne concernée par ce livre ?</p>

                    {/* radio genre */}
                    <div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                                <input onChange={() => { setDestination(EBookDestination.ME) }} type="radio" name="radio-10" className="radio checked:bg-sky-500" checked={destination == EBookDestination.ME} />
                                <span className="label-text ml-5 text-lg">Moi-même</span>
                            </label>
                        </div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start">
                                <input onChange={() => { setDestination(EBookDestination.OTHER) }} type="radio" name="radio-10" className="radio checked:bg-sky-500" checked={destination == EBookDestination.OTHER} />
                                <span className="label-text ml-5 text-lg">Une autre personne</span>
                            </label>
                        </div>
                    </div>

                </div>



                {/* next step */}
                <div className='flex flex-col justify-end  flex-grow'>
                    <button type='submit' onClick={saveDestination}

                        className={`mt-8 btn bg-sky-500 text-sky-50 text-sm rounded-3xl w-11/12 text-xl w-full`}>
                        Suivant
                    </button>
                </div>

            </div>

        </div>
    )
}