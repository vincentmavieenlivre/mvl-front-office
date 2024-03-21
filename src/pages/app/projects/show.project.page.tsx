import AudioRecorder from '@app/components/app/media/AudioRecorder'
import { UserProjectsService } from '@app/domains/services/user-projects.service'
import { useMicrophone } from '@app/hook/use-microphone'
import { db, functions } from '@app/init/firebase'
import { IBookQuestion } from '@app/modeles/database/book/book-question'
import { Project } from '@app/modeles/database/project'
import { ECollections } from '@app/utils/firebase/firestore-collections'
import { FirestoreHelper } from '@app/utils/firebase/firestore-helper'
import { List } from 'antd'
import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'

type Props = {}

export default function ShowProjectPage({ }: Props) {
    const params: any = useParams()

    const [project, setProject] = useState<Project>()
    const [questions, setQuestions] = useState<IBookQuestion[]>([])
    const micGranted: boolean = useMicrophone()



    const loadProject = async () => {
        let pm = new UserProjectsService(params.id)
        let p = await pm.loadProject()
        if (p) {
            let questions: IBookQuestion[] = await pm.loadQuestions()
            if (questions.length > 0) {
                setQuestions(questions)
            }
            console.log("question length", questions)
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
        console.log("grand change", micGranted)
    }, [micGranted])



    useEffect(() => {
        loadProject()

    }, [])



    return (
        <div>ShowProjectPage

            <button onClick={onInvite} className="btn btn-primary">Inviter</button>

            {project &&
                <div>loaded: {project.name}</div>
            }

            <List
                itemLayout="horizontal"
                dataSource={questions}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a>{item.questionTitle}</a>}

                        />
                        <div>

                            {micGranted == true &&
                                <AudioRecorder projectId={params.id} question={item}></AudioRecorder>
                            }


                        </div>
                    </List.Item>
                )}
            />

        </div>
    )
}