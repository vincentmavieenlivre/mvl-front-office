import { createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "./store";
import { ERoles } from "@app/modeles/roles";
import { Project } from "@app/modeles/database/project";
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IProduct } from "@app/modeles/interfaces/refine.test";

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
        }
    },
});

// Action creators are generated for each case reducer function
export const { setCurrentProject, setChapterTree } = authSlice.actions;

export const selectQuestionPosition = (state: RootState, chapterId: string, questionId: string): [number, number] => {
    let chapter = state.currentProject.chapterTree?.find((d: IChapterTree) => d.id === chapterId)
    debugger
    if (chapter) {
        let indexOf = chapter.orderedQuestions?.findIndex((d) => d.id === questionId)
        if (indexOf !== -1 && indexOf !== undefined && chapter.orderedQuestions) {
            return [indexOf + 1, chapter.orderedQuestions?.length]
        }
    }

    throw [0, 0]

}

export const selectQuestion = (state: RootState, questionId: string): [IBookQuestion, IChapter] => {
    let res = state.currentProject.project?.questions?.find((q: IBookQuestion) => q.id === questionId)
    debugger
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


export default authSlice.reducer;