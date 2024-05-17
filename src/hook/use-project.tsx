import { UserProjectsService } from '@app/domains/services/user-projects.service';
import { db } from '@app/init/firebase';
import { IChapterTree } from '@app/modeles/database/book/book-template';
import { Project } from '@app/modeles/database/project';
import { setCurrentProject, setChapterTree, selectProject } from '@app/redux/current.project.slice';
import { RootState } from '@app/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {}

export default function useProject(projectId: string | undefined) {


    let project: Project | undefined = useSelector((state: RootState) => {
        return selectProject(state)
    })

    console.log("useProject => from store", project?.name)

    const dispatch = useDispatch();


    const loadProject = async () => {
        if (!projectId || !db) {
            console.error("projectId or db is null")
            return
        }

        const pm = new UserProjectsService(projectId, db)
        const p = await pm.loadProject(db)
        if (p) {
            let questions = await pm.loadQuestions()
            const chapters: IChapterTree[] = pm.getQuestionsByChapters(questions)


            p.questions = questions
            dispatch(setCurrentProject(p))
            dispatch(setChapterTree(chapters))
        }
    }

    useEffect(() => {
        if ((!project || project.id != projectId) && projectId != undefined) {
            console.log("load the whole project")
            loadProject()
        } else {
            console.log("project ever loaded", project)
        }
    }, [])



}