import { Project } from '@app/modeles/database/project'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { ImageUploader } from '../../images/image-uploader';
import avatarSvg from "@app/assets/avatar.svg"
import { BookImage, EImageKind } from '../summary-with-states';
import ImageCropDialog from '../../images/image-crop-dialog';
import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { db } from '@app/init/firebase';
import { useDispatch } from 'react-redux';
import { updateProjectName } from '@app/redux/current.project.slice';
import { updateNameProjectInList } from '@app/redux/auth.slice';

type Props = {
    project?: Project;
    containerClass: any;
}

export default function CoverCustomization({ project, containerClass }: Props) {
    let dispatch = useDispatch()

    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageSrc, setImageSrc] = useState(undefined)
    const [selectedImage, setSelectedImage] = useState<BookImage | undefined>(undefined)

    /*  if (!project) {
         return (null)
     } */

    /* useEffect(() => {
        if (avatarImgRef.current !== null && project?.templateCoverUrl != '') {
            avatarImgRef.current.src = project?.templateCoverUrl
        }

    }, [project])
 */

    const handleLoad = () => {
        setImageLoaded(true)
    };



    return (
        <div className={containerClass}>


            <h1 className=' text-sky-950  text-xl font-bold '>Couverture</h1>

            <Formik
                enableReinitialize={true}
                initialValues={{ name: project.name }}
                onSubmit={async (values) => {
                    if (db && project?.id) {
                        UserProjectsService.updateProjectName(db, values.name, project.id)
                        dispatch(updateProjectName(values.name))
                        dispatch(updateNameProjectInList({
                            projectId: project.id,
                            name: values.name
                        }))
                        console.log("cover form values", values)
                    }
                }}
            >

                {(propsFormik) => (


                    <Form>

                        <div className="f-elem">
                            <label className='required text-gray-600' htmlFor="firstName">Titre du livre</label>
                            <Field className="pb-4 pt-4 pl-2 field text-xl text-gray-800" id="name" name="name" />
                            <ErrorMessage name="name">{msg => <div className='custom-error'>obligatoire</div>}</ErrorMessage>
                        </div>

                        {/* AVATAR */}
                        <ImageUploader onImageSelected={(base64Image: any) => {

                            setImageSrc(base64Image)
                            setImageLoaded(true)

                            setSelectedImage({
                                imageKind: EImageKind.COVER,
                                selectedImage: base64Image,
                                projectId: project?.id
                            })

                            document.getElementById('crop_cover_modal').showModal()



                        }}
                        >
                            <div className='flex flex-row items-center mt-10 '>

                                {imageLoaded &&
                                    <div className="avatar">
                                        <div className="w-24 rounded-xl border-2">
                                            <img onLoad={handleLoad} src={imageSrc} />
                                        </div>
                                    </div>
                                }
                                <div className='ml-5 flex flex-row items-center ' >
                                    + Changer l'image de couverture
                                </div>
                            </div>
                        </ImageUploader>

                        {(propsFormik.dirty || imageLoaded == true) &&
                            <div className='flex flex-col justify-end  flex-grow mb-16'>
                                <button type='submit'
                                    className={`mt-8 btn bg-sky-500 text-sky-50 text-sm rounded-3xl w-11/12 text-xl w-full`}>
                                    Sauvegarder
                                </button>
                            </div>
                        }
                    </Form>

                )}

            </Formik>

            <ImageCropDialog cropModalId='crop_cover_modal' aspectRatio={1 / 1.41} bookImage={selectedImage}></ImageCropDialog>



        </div >
    )
}