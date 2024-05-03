import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { setCurrentProject, setChapterTree, selectProject } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {}

export default function useProject(projectId: string) {


    let project: Project = useSelector((state: RootState) => {
        return selectProject(state)
    })

    const dispatch = useDispatch();


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
        if (!project) {
            loadProject()
        } else {
            console.log("project ever loaded")
        }
    }, [])



}