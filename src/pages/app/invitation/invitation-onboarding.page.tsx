import RegisterForm, { ERegisterForm } from '@app/components/app/forms/register.formik';
import CreateBookNavBar from '@app/components/app/nav/create-book-nav-bar.component';
import { InvitationService } from '@app/domains/services/invitation.service';
import { AuthManager } from '@app/manager/auth.manager';
import { IBookFor } from '@app/modeles/database/book-target';
import { APP_ROUTES } from '@app/routes/app.routes.index';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type Props = {}

/**
 * Page used by invitation from email or sms to onboard the invited user
 *
 * @export
 * @param {Props} { }
 * @return {*} 
 */
export default function InvitationOnboarding({ }: Props) {

    const search = useLocation().search;
    const invitationToken = new URLSearchParams(search).get('invitationToken');

    const navigate = useNavigate()
    const dispatch = useDispatch();

    // test if the invitation token is valid
    const validationInvitation = async (invitationToken: string) => {
        await (new InvitationService()).isValidInvitation(invitationToken).catch((d) => {
            // display "validation not valid => reset pwd if you have been ever logged"
        })
    }

    const registerUserFromInvitationToken = async (user: IBookFor) => {
        console.log("register user with token", user)
        if (invitationToken) {
            let { authToken } = await (new InvitationService()).registerWithInvitation(invitationToken, user).catch((d) => {
                // display "validation not valid => reset pwd if you have been ever logged"
            })

            // TODO should redirect
            await (new AuthManager()).loginWithAuthToken(authToken)

        }
    }

    const save = async (values: IBookFor, avatar: string | undefined) => {

        // TODO save avatar (before or after the register ? )

        await registerUserFromInvitationToken(values)
    }


    /* TODO : make a loading state + display error if invitation not validated */
    useEffect(() => {
        if (invitationToken) {
            validationInvitation(invitationToken)
        }
    }, [invitationToken])

    let initBookFor: Partial<IBookFor> = {
        firstName: '',
        lastName: '',
        avatarUrl: '',
        email: '',
        phone: '',
        room: '',
    }



    return (
        <div className='h-screen flex flex-col p-5'>
            <CreateBookNavBar></CreateBookNavBar>

            <div className='ml-5 mr-5 flex flex-col flex-grow '>

                <h2 className='  text-sky-950  text-xl font-bold mt-5 '>Quelques informations à votre sujet...</h2>

                <p className='text-lg mt-5 mb-5'>Complétez les informations suivantes :</p>

                <RegisterForm formType={ERegisterForm.INVITED_USER_REGISTER} onSubmit={save} bookFor={initBookFor}></RegisterForm>




            </div>
        </div>

    )
}