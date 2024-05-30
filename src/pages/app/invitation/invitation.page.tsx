import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component';
import useProject from '@app/hook/use-project';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { UserOwner } from '@app/modeles/database/embedded/data-owner';
import { Divider } from 'antd';
import { User } from 'firebase/auth';
import { ERoles } from '@app/modeles/database/roles';


import "@app/components/app/forms/forms.scss";
import { securityAlert } from '@app/components/app/alert/security-alert';
import { TbTrashXFilled } from 'react-icons/tb';

type Props = {}

interface IRelationDto {
    relations: UserOwner[]
}

export default function InvitationPage({ }: Props) {

    const params: any = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const project = useProject(params.id)

    const [relations, setRelations] = useState<IRelationDto>(
        {
            relations: [{
                email: '',
                phone: "",
                user_name: '',
                user_role: ERoles.FAMILY
            }]
        })

    const relationSchema = Yup.object().shape({
        relations: Yup.array()
            .of(
                Yup.object().shape({
                    email: Yup.string().email(),
                    phone: Yup.string()
                })
            )
    });

    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='text-sky-950  text-xl font-bold mt-5 '>Partager avec des proches ?</h2>
                <p className='text-lg mt-5 mb-5'>
                    Voulez-vous inviter des proches à participer à la création de cette histoire ?
                </p>
                <h2 className='text-sky-950  text-xl font-bold mt-5 '>Détails</h2>


                <Formik
                    enableReinitialize={true}
                    validationSchema={relationSchema}
                    initialValues={relations}
                    onSubmit={async (values) => {
                        console.log("submit", values)
                    }}
                >

                    {({ values }) => (
                        <Form className='flex-grow flex flex-col'>
                            <FieldArray
                                name="relations"
                                render={(arrayHelpers: any) => (
                                    <div >

                                        {values.relations.map((relation: UserOwner, index) => {
                                            return (
                                                <div key={index} className='one-relation'>
                                                    <div className="f-elem">
                                                        <label htmlFor="email"><b>{index + 1} - </b> Email du proche</label>
                                                        <Field className="field" id="email" name={'relations[' + index + '].email'} placeholder="pierre@mail.com" />
                                                        <ErrorMessage name={'relations[' + index + '].email'} >{msg => <div className='custom-error opacity-70'>email non valide</div>}</ErrorMessage>
                                                    </div>
                                                    <div className="f-elem">
                                                        <label htmlFor="mobile">Son téléphone mobile</label>
                                                        <Field className="field" id="phone" name={'relations[' + index + '].phone'} placeholder="+33678654543" />
                                                        <ErrorMessage name={'relations[' + index + '].phone'}>{msg => <div className='custom-error opacity-70'>numéro de téléphone non valide</div>}</ErrorMessage>
                                                    </div>


                                                    <button className='mt-6 flex flex-row justify-end w-full mr-4 items-center' type="button" onClick={() => arrayHelpers.remove(index)}>
                                                        <TbTrashXFilled className='text-red-400 mr-2'></TbTrashXFilled> supprimer
                                                    </button>
                                                </div>
                                            )
                                        })}

                                        {/* ADD A RELATION */}
                                        <button type="button" className='mt-6 text-xl text-sky-500' onClick={() => arrayHelpers.insert(1, '')}>
                                            + Ajouter un proche
                                        </button>

                                    </div>
                                )}></FieldArray>


                            {/* SUBMIT FORM*/}
                            <div className='flex flex-col justify-end  flex-grow mt-10'>
                                <button type='submit'
                                    className={`mt-8 btn bg-sky-500 text-sky-50 text-sm rounded-3xl w-11/12 text-xl w-full`}>
                                    Suivant
                                </button>

                                <button type="button" className='mt-6 text-xl text-sky-500'>
                                    Passer cette étape
                                </button>

                            </div>

                            {/* SECURITY ALERT */}
                            <div className=''>
                                {securityAlert()}
                            </div>
                        </Form>


                    )}
                </Formik>


            </div>
        </div>


    )
}