import { useNavigate, useParams } from 'react-router-dom';
import useProject from '@app/hook/use-project';
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { EBookDestination, EForGenre } from '@app/modeles/database/book-target';
import { Project } from '@app/modeles/database/project';
import { IBookFor } from "@app/modeles/database/book-target"
import { useEffect, useRef, useState } from 'react';
import { ImageUploader } from '@app/components/app/images/image-uploader';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { Avatar } from 'antd';
import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { db } from '@app/init/firebase';
import { updateUserProjectInList } from '@app/redux/auth.slice';
import { UserImageManager } from '@app/manager/client/user-image.manager';
import { BookImage, EImageKind } from '@app/components/app/summary/summary-with-states';


import "@app/components/app/forms/forms.scss";
import RegisterForm, { ERegisterForm } from '@app/components/app/forms/register.formik';


type Props = {}

export default function ShowBookForDetailsPage({ }: Props) {
    const params: any = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const project = useProject(params.id)

    const getDefault = () => {

        let initBookFor: IBookFor = {
            firstName: '',
            lastName: '',
            genre: EForGenre.WOMEN,
            avatarUrl: '',
            email: '',
            phone: '',
            room: '',
            destination: project?.bookFor?.destination ?? EBookDestination.ME,
            ...project?.bookFor
        }
        console.log("getDefault()", initBookFor)

        return initBookFor
    }


    const save = async (values: IBookFor, avatar: string | undefined) => {

        if (db && project?.id) {
            console.log("update detail with", values)
            await UserProjectsService.updateProjectBookFor(db, values, project?.id)
            let toUpdate = { ...project }

            toUpdate.bookFor = values

            if (avatar) {
                console.log("try to upload avatar")
                let avatarUrl = await (new UserImageManager({
                    selectedImage: avatar,
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
            navigate(`/app/projects/${project.id}/invitation`)
        }
    }


    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Qui est le sujet de cette histoire ?</h2>

                <p className='text-lg mt-5 mb-5'>Veuillez fournir concernant cette personne pour démarrer.</p>

                <RegisterForm formType={ERegisterForm.TARGET_BOOK_FOR} onSubmit={save} bookFor={getDefault()}></RegisterForm>




            </div>

        </div>
    )
}