import { auth } from '@app/init/firebase'
import { getRoleColor } from '@app/modeles/roles'
import { selectToken, selectUser } from '@app/redux/auth.slice'
import { Avatar, Space, Tag } from 'antd'
import { IdTokenResult } from 'firebase/auth'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useNavigation } from 'react-router-dom'

type Props = {}

const BackOfficeNavBar = (props: Props) => {

    const nav = useNavigate()


    const user = useSelector(selectUser)
    const tokenResult: IdTokenResult | undefined = useSelector(selectToken)

    if (!user || !tokenResult) {
        return (null)
    }

    const logout = async () => {
        await auth?.signOut()
    }

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Mvl</a>
            </div>
            <div className="flex-none gap-2">
                <div className="form-control flex flex-row justify-around">
                    {user?.email} <Space /> - <Tag color={getRoleColor(tokenResult?.claims.role)}>{tokenResult?.claims.role}</Tag>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <Avatar style={{ backgroundColor: "purple", verticalAlign: 'middle' }} size="large" gap={1}>
                                {user.displayName[0].toUpperCase()}
                            </Avatar>
                        </div>
                    </div>



                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li onClick={() => nav('/app')}><a>Go</a></li>
                        <li onClick={logout}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BackOfficeNavBar