import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { setCurrentProject, setChapterTree } from '@app/redux/current.project.slice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

type Props = {}

export default function UseProject(projectId: string) {
    const dispatch = useDispatch();

    const [project, setProject] = useState(null)

    const loadProject = async () => {
        const pm = new UserProjectsService(projectId)
        const p = await pm.loadProject()
        if (p) {
            let questions = await pm.loadQuestions()
            const chapters: IChapterTree[] = pm.getQuestionsByChapters(questions)


            p.questions = questions
            dispatch(setCurrentProject(p))
            dispatch(setChapterTree(chapters))
        }
    }

    useEffect(() => {
        loadProject()
    }, [])



}