import { db, functions } from '@app/init/firebase'
import { Project } from '@app/modeles/database/project'
import { ECollections } from '@app/utils/firebase/firestore-collections'
import { FirestoreHelper } from '@app/utils/firebase/firestore-helper'
import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

export default function ShowProjectPage({ }: Props) {
    const params: any = useParams()
    const [project, setProject] = useState<Project>()

    const loadProject = async () => {
        const p = await FirestoreHelper.getDocument<Project>(db, ECollections.PROJECTS, params.id)
        if (p) {
            setProject(p)
        }
    }

    const onInvite = async () => {
        let email = "family@test.com"
        if (functions) {
            const test = httpsCallable(functions, 'inviteFamily');
            let result = await test({ familyEmail: email })
            console.log("[invite family result]", result)
        }
    }

    useEffect(() => {
        loadProject()
    }, [])


    return (
        <div>ShowProjectPage

            <button onClick={onInvite} className="btn btn-primary">Inviter</button>

            {project &&
                <div>loaded: {project.name}</div>
            }

        </div>
    )
}