import { createSelector, createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "./store";
import { ERoles } from "@app/modeles/roles";
import { Project } from "@app/modeles/database/project";
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IProduct } from "@app/modeles/interfaces/refine.test";
import { Root } from "react-dom/client";

export interface ProjectStore {
    project?: Project
    chapterTree?: IChapterTree[]
}

const initialState: ProjectStore = {
    project: undefined,
    chapterTree: undefined
};

export const authSlice = createSlice({
    name: "currentProject",
    initialState,
    reducers: {
        setCurrentProject: (state, action: PayloadAction<Project | undefined>) => {
            console.log("setCurrentProject")
            state.project = action.payload
        },

        setChapterTree: (state, action: PayloadAction<IChapterTree[] | undefined>) => {
            state.chapterTree = action.payload
        },

        setQuestionResponse: (state, action: PayloadAction<IBookQuestion | undefined>) => {
            if (state && state.project && state.project.questions) {
                let index = state.project.questions.findIndex((q: IBookQuestion) => q.id === action.payload?.id)
                if (index != -1) {
                    state.project.questions[index].responses = action.payload?.responses
                }
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const { setCurrentProject, setChapterTree, setQuestionResponse } = authSlice.actions;

export const selectChapters = (state: RootState): IChapterTree[] | undefined => {
    if (state.currentProject.chapterTree && state.currentProject.project?.questionsOrder && state.currentProject.project?.questions) {


        let chapters: IChapterTree[] = []

        if (state.currentProject?.project?.chapters && state.currentProject?.project?.chapters.length > 0) {
            let sortedQuestions = sortQuestions(state.currentProject.project?.questionsOrder, state.currentProject.project?.questions)

            state.currentProject?.project?.chapters.forEach((c: IChapter) => {
                let questions = sortedQuestions.filter((q: IBookQuestion) => q.chapterId === c.id)
                if (questions) {
                    chapters.push({
                        ...c,
                        orderedQuestions: questions
                    } as IChapterTree)
                }
            })
        }
        console.log("by chapters", chapters)
        return chapters


    }
}


export const selectProject = (state: RootState): Project | undefined => {
    if (state.currentProject.project) {
        return state.currentProject.project
    }
}

export const selectQuestionPosition = (state: RootState, chapterId: string, questionId: string): [number, number, string | undefined, string | undefined] => {
    let chapter = state.currentProject.chapterTree?.find((d: IChapterTree) => d.id === chapterId)
    if (chapter) {
        let indexOf = chapter.orderedQuestions?.findIndex((d) => d.id === questionId)
        if (indexOf !== -1 && indexOf !== undefined && chapter.orderedQuestions) {

            let nextId: string | undefined;
            let prevId: string | undefined
            if (indexOf + 1 < chapter.orderedQuestions?.length) {
                nextId = chapter.orderedQuestions[indexOf + 1].id
            }

            if (indexOf > 0) {
                prevId = chapter.orderedQuestions[indexOf + -1].id
            }


            return [indexOf + 1, chapter.orderedQuestions?.length, prevId, nextId]
        }
    }

    throw [0, 0]

}

export const selectAllQuestions = (state: RootState): IBookQuestion[] => {
    return state.currentProject.project?.questions ?? []
}

export const selectQuestion = (state: RootState, questionId: string): [IBookQuestion, IChapter] => {
    let res = state.currentProject.project?.questions?.find((q: IBookQuestion) => q.id === questionId)
    if (res) {
        let chapter = state.currentProject.project?.chapters.find((c: IChapter) => c.id === res?.chapterId)
        if (chapter) {
            return [res, chapter]
        } else {
            throw 'chapter not found'
        }
    } else {
        throw 'question not found ' + questionId
    }
}

export function sortQuestions(questionsOrder: { index: number, id: string }[], questions: IBookQuestion[]): IBookQuestion[] {

    // if there is an order : return sorted questions

    if (questionsOrder && questionsOrder.length > 0 && questions.length > 0) {

        let sortedIds = [...questionsOrder]?.sort((a, b) => {
            return a.index - b.index
        })

        const sortedQuestions: IBookQuestion[] = []
        if (sortedIds) {
            for (const s of sortedIds) {
                const q = questions.find((q) => q.template_question_id == s.id)
                if (q) {
                    sortedQuestions.push(q)
                }
            }
            return sortedQuestions
        }
    }
    return []
}



export default authSlice.reducer;