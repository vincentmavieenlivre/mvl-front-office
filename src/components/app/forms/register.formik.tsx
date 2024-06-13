import { EForGenre, IBookFor } from '@app/modeles/database/book-target'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { ImageUploader } from '../images/image-uploader'
import * as Yup from 'yup';
import avatarSvg from "@app/assets/avatar.svg"

export enum ERegisterForm {
    TARGET_BOOK_FOR,
    INVITED_USER_REGISTER
}

type Props = {
    onSubmit: (value: IBookFor, avatar: string | undefined) => Promise<any>
    bookFor: Partial<IBookFor>
    formType: ERegisterForm
}

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


export default function RegisterForm(props: Props) {
    let avatarImgRef = useRef<HTMLImageElement>()

    const [bookFor, setBookFor] = useState<Partial<IBookFor>>(props.bookFor)
    const [hasAvatar, setHasAvatar] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (avatarImgRef.current !== null && props.bookFor.avatarUrl != '') {
            avatarImgRef.current.src = props.bookFor.avatarUrl
        }
        setLoaded(true)
    }, [avatarImgRef.current, props.bookFor]);


    const getFirstWord = () => {
        if (props.formType == ERegisterForm.INVITED_USER_REGISTER) {
            return "Votre"
        } else {
            return "Son"
        }
    }

    return (
        <Formik
            enableReinitialize={true}
            validationSchema={SignupSchema}
            initialValues={props.bookFor}
            onSubmit={async (values) => {
                props.onSubmit(values, hasAvatar ? avatarImgRef.current.src : undefined)
            }}
        >

            {(propsFormik) => (


                <Form>

                    {props.formType == ERegisterForm.TARGET_BOOK_FOR &&
                        <div className="f-elem">

                            <label htmlFor="genre">{getFirstWord()} genre</label>

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
                    }

                    <div className="f-elem">
                        <label className='required' htmlFor="firstName">{getFirstWord()} prénom</label>
                        <Field className="field" id="firstName" name="firstName" placeholder="Pierre" />
                        <ErrorMessage name="firstName">{msg => <div className='custom-error'>obligatoire</div>}</ErrorMessage>
                    </div>

                    <div className="f-elem">
                        <label className='required' htmlFor="lastName">{getFirstWord()} nom</label>
                        <Field className="field" id="lastName" name="lastName" placeholder="Durand" />
                        <ErrorMessage name="lastName">{msg => <div className='custom-error'>obligatoire</div>}</ErrorMessage>
                    </div>

                    {props.formType == ERegisterForm.TARGET_BOOK_FOR &&

                        <div className="f-elem">
                            <label htmlFor="room">{getFirstWord()} numéro de chambre</label>
                            <Field className="field" id="room" name="room" placeholder="406" />
                        </div>
                    }

                    <div className="f-elem">
                        <label htmlFor="mobile">{getFirstWord()} téléphone mobile</label>
                        <Field className="field" id="phone" name="phone" placeholder="+33678654543" />
                    </div>

                    {props.formType == ERegisterForm.TARGET_BOOK_FOR &&

                        <div className="f-elem">
                            <label htmlFor="email">{getFirstWord()} email</label>
                            <Field className="field" id="email" name="email" placeholder="pierre@mail.com" />
                            <ErrorMessage name="email">{msg => <div className='custom-error'>email non valide</div>}</ErrorMessage>
                        </div>
                    }

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
    )
}