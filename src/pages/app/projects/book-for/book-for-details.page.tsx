import { useNavigate, useParams } from 'react-router-dom';
import useProject from '@app/hook/use-project';
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import "@app/components/app/forms/forms.scss";
import { EBookDestination, EForGenre } from '@app/modeles/database/book-target';
import { Project } from '@app/modeles/database/project';
import { IBookFor } from "@app/modeles/database/book-target"
import { useRef, useState } from 'react';
import { ImageUploader } from '@app/components/app/images/image-uploader';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { Avatar } from 'antd';

type Props = {}

export default function ShowBookForDetailsPage({ }: Props) {
    const params: any = useParams()
    let avatarImgRef = useRef<HTMLImageElement>()

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const project = useProject(params.id)


    let initBookFor: Partial<IBookFor> = {
        firstName: 'yop',
        lastName: '',
        genre: EForGenre.WOMEN,
        avatarUrl: '',
        email: '',
        phone: '',
        room: '',
        ...project?.bookFor
    }

    const [bookFor, setBookFor] = useState<Partial<IBookFor>>(initBookFor)


    const saveDetails = async () => {

    }



    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Qui est le sujet de cette histoire ?</h2>

                <p className='text-lg mt-5 mb-5'>Veuillez fournir concernant cette personne pour démarrer.</p>


                <Formik
                    initialValues={bookFor}
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                    }}
                >

                    {({ values,
                        errors,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset }) => (


                        <Form>
                            <div className="f-elem">

                                <label htmlFor="genre">Genre</label>

                                <select
                                    className='field select-field'
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setBookFor({
                                            ...bookFor,
                                            genre: parseInt(e.target.value) as EForGenre
                                        })
                                    }}
                                    name="genre"
                                    value={bookFor.genre}
                                >
                                    <option value={EForGenre.WOMEN} label="Femme">
                                        Femme
                                    </option>
                                    <option value={EForGenre.MEN} label="Homme">
                                        Homme
                                    </option>
                                </select>
                            </div>

                            <div className="f-elem">
                                <label htmlFor="firstName">First Name</label>
                                <Field className="field" id="firstName" name="firstName" placeholder="Jane" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="lastName">Last Name</label>
                                <Field className="field" id="lastName" name="lastName" placeholder="Doe" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="room">Chambre</label>
                                <Field className="field" id="room" name="room" placeholder="Chambre" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="mobile">Téléphone mobile</label>
                                <Field className="field" id="phone" name="phone" placeholder="Téléphone mobile" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="email">Email</label>
                                <Field className="field" id="email" name="email" placeholder="Email" />
                            </div>

                            <ImageUploader onImageSelected={(base64Image: any) => {
                                if (avatarImgRef.current?.src) {
                                    avatarImgRef.current.src = base64Image
                                }
                            }}>
                                <div className='flex flex-row items-center mt-10 '>


                                    <div className="avatar">
                                        <div className="w-24 rounded-full">
                                            <img ref={avatarImgRef} src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                        </div>
                                    </div>


                                    <div className='ml-5 flex flex-row items-center ' >
                                        Ajouter une photo
                                    </div>

                                </div>
                            </ImageUploader>


                            {/* next step */}
                            <div className='flex flex-col justify-end  flex-grow mb-16'>
                                <button type='submit' onClick={saveDetails}

                                    className={`mt-8 btn bg-sky-500 text-sky-50 text-sm rounded-3xl w-11/12 text-xl w-full`}>
                                    Suivant
                                </button>
                            </div>

                        </Form>


                    )}
                </Formik>



            </div>

        </div>
    )
}