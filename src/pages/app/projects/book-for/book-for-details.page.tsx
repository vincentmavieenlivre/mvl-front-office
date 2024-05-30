import { useNavigate, useParams } from 'react-router-dom';
import useProject from '@app/hook/use-project';
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import "@app/components/app/forms/forms.scss";
import { EBookDestination, EForGenre } from '@app/modeles/database/book-target';
import { Project } from '@app/modeles/database/project';
import { IBookFor } from "@app/modeles/database/book-target"
import { useEffect, useRef, useState } from 'react';
import { ImageUploader } from '@app/components/app/images/image-uploader';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { Avatar } from 'antd';
import * as Yup from 'yup';
import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { db } from '@app/init/firebase';
import { updateUserProjectInList } from '@app/redux/auth.slice';
import { UserImageManager } from '@app/manager/client/user-image.manager';
import { BookImage, EImageKind } from '@app/components/app/summary/summary';
import avatarSvg from "@app/assets/avatar.svg"
type Props = {}

export default function ShowBookForDetailsPage({ }: Props) {
    const params: any = useParams()
    let avatarImgRef = useRef<HTMLImageElement>()

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const project = useProject(params.id)
    const [loaded, setLoaded] = useState(false)

    const getDefault = () => {

        let initBookFor: IBookFor = {
            firstName: '',
            lastName: '',
            genre: EForGenre.WOMEN,
            avatarUrl: undefined,
            email: '',
            phone: '',
            room: '',
            destination: project?.bookFor?.destination ?? EBookDestination.ME,
            ...project?.bookFor
        }
        console.log("getDefault()", initBookFor)

        return initBookFor
    }

    const [bookFor, setBookFor] = useState<IBookFor>(getDefault())
    const [hasAvatar, setHasAvatar] = useState(project?.bookFor?.avatarUrl != undefined ?? false)

    useEffect(() => {
        setBookFor(getDefault())
    }, [project?.bookFor])


    useEffect(() => {
        if (avatarImgRef.current !== null && bookFor.avatarUrl != undefined) {
            avatarImgRef.current.src = bookFor.avatarUrl
        }
        setLoaded(true)
    }, [avatarImgRef.current, bookFor]);

    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        lastName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        email: Yup.string().email('Invalid email')
    });

    const save = async (values: IBookFor) => {

        if (db && project?.id) {
            await UserProjectsService.updateProjectBookFor(db, values, project?.id)
            let toUpdate = { ...project }

            toUpdate.bookFor = bookFor

            if (hasAvatar) {
                let avatarUrl = await (new UserImageManager({
                    selectedImage: avatarImgRef.current.src,
                    imageKind: EImageKind.BOOK_DESTINATION_AVATAR,
                    projectId: toUpdate.id
                } as BookImage)).uploadDestinationAvatar()

                console.log("AVATAR URL", avatarUrl)

                if (avatarUrl && toUpdate?.bookFor) {
                    console.log("set the avatar url in new project")
                    toUpdate.bookFor.avatarUrl = avatarUrl
                } else {
                    console.log("FAIL", toUpdate, avatarUrl)
                }
            }
            dispatch(updateUserProjectInList(toUpdate))
            navigate(`/app/projects/${project.id}/bookForDetails`)
        }
    }


    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Qui est le sujet de cette histoire ?</h2>

                <p className='text-lg mt-5 mb-5'>Veuillez fournir concernant cette personne pour démarrer.</p>


                <Formik
                    enableReinitialize={true}
                    validationSchema={SignupSchema}
                    initialValues={bookFor}
                    onSubmit={async (values) => {
                        save(values)
                    }}
                >

                    {(props) => (


                        <Form>
                            <div className="f-elem">

                                <label htmlFor="genre">Son genre</label>

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
                                    <option value={EForGenre.WOMEN} label="Une femme">
                                        Femme
                                    </option>
                                    <option value={EForGenre.MEN} label="Un homme">
                                        Homme
                                    </option>
                                </select>
                            </div>

                            <div className="f-elem">
                                <label className='required' htmlFor="firstName">Son prénom</label>
                                <Field className="field" id="firstName" name="firstName" placeholder="Pierre" />
                                <ErrorMessage name="firstName">{msg => <div className='custom-error'>obligatoire</div>}</ErrorMessage>
                            </div>

                            <div className="f-elem">
                                <label className='required' htmlFor="lastName">Son nom</label>
                                <Field className="field" id="lastName" name="lastName" placeholder="Durand" />
                                <ErrorMessage name="lastName">{msg => <div className='custom-error'>obligatoire</div>}</ErrorMessage>
                            </div>

                            <div className="f-elem">
                                <label htmlFor="room">Son numéro de chambre</label>
                                <Field className="field" id="room" name="room" placeholder="406" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="mobile">Son téléphone mobile</label>
                                <Field className="field" id="phone" name="phone" placeholder="+33678654543" />
                            </div>

                            <div className="f-elem">
                                <label htmlFor="email">Son email</label>
                                <Field className="field" id="email" name="email" placeholder="pierre@mail.com" />
                                <ErrorMessage name="email">{msg => <div className='custom-error'>email non valide</div>}</ErrorMessage>
                            </div>

                            {/* AVATAR */}
                            <ImageUploader onImageSelected={(base64Image: any) => {
                                if (avatarImgRef.current) {
                                    avatarImgRef.current.src = base64Image
                                    setHasAvatar(true)
                                }
                            }}>
                                <div className='flex flex-row items-center mt-10 '>
                                    <div className="avatar">
                                        <div className="w-24 rounded-full border-2">
                                            <img ref={avatarImgRef} src={avatarSvg} />
                                        </div>
                                    </div>
                                    <div className='ml-5 flex flex-row items-center ' >
                                        Ajouter une photo
                                    </div>
                                </div>
                            </ImageUploader>


                            {/* SUBMIT FORM*/}
                            <div className='flex flex-col justify-end  flex-grow mb-16'>
                                <button type='submit'
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