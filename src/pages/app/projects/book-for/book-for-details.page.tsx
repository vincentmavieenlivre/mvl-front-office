import { useNavigate, useParams } from 'react-router-dom'
import useProject from '@app/hook/use-project'
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component'
import { useDispatch } from 'react-redux'


type Props = {}

export default function ShowBookForDetailsPage({ }: Props) {
    const params: any = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const project = useProject(params.id)



    const saveDetails = async () => {

    }



    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Qui est le sujet de cette histoire ?</h2>

                <p className='text-lg mt-5'>Veuillez fournir concernant cette personne pour démarrer.</p>


                {/* next step */}
                <div className='flex flex-col justify-end  flex-grow'>
                    <button type='submit' onClick={saveDetails}

                        className={`mt-8 btn bg-sky-500 text-sky-50 text-sm rounded-3xl w-11/12 text-xl w-full`}>
                        Suivant
                    </button>
                </div>
            </div>

        </div>
    )
}