import { FcPrivacy } from "react-icons/fc";

export function securityAlert() {
    return (
        <div className='flex flex-row mt-4'>
            <div className='w-1/5 flex flex-row justify-center'>
                <FcPrivacy className='self-center text-center' />
            </div>
            <div className='text-gray-500 w-4/5'>Vos informations sont sécurisées par chiffrement.</div>
        </div>
    )
} 