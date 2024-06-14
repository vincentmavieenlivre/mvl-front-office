import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from "./store";
import { Project } from "@app/modeles/database/project";
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { getChapterTree } from "./helpers/project.slice.helpers";
import { updateStatsProjectInList } from "./auth.slice";

export interface ISaveDialog {
    shouldSave: boolean
    displaySaveDialog: boolean
    wantedRoute: string | undefined
}

export interface ProjectStore {
    project?: Project
    chapterTree?: IChapterTree[]
    saveDialog: ISaveDialog;

}

const initialState: ProjectStore = {
    project: undefined,
    chapterTree: undefined,
    saveDialog: {
        shouldSave: false,
        displaySaveDialog: false,
        wantedRoute: undefined
    }


};

export const currentProjectSlice = createSlice({
    name: "currentProject",
    initialState,
    reducers: {
        setCurrentProject: (state, action: PayloadAction<Project | undefined>) => {
            console.log("setCurrentProject")
            state.project = action.payload
        },

        updateChapters: (state, action: PayloadAction<IChapter[]>) => {
            if (state && state.project) {
                state.project.chapters = action.payload
            }

        },

        /*    updateChapter: (state, action: PayloadAction<IChapter>) => {
   
               let index = state.project?.chapters.findIndex((c) => c.id == action.payload.id)
               if (index != -1 && index != undefined && state.project?.chapters) {
                   state.project.chapters[index] = action.payload
               }
           }, */

        setChapterTree: (state, action: PayloadAction<IChapterTree[] | undefined>) => {
            state.chapterTree = action.payload
        },

        setQuestionResponse: (state, action: PayloadAction<IBookQuestion | undefined>) => {
            if (state && state.project && state.project.questions) {
                let index = state.project.questions.findIndex((q: IBookQuestion) => q.id === action.payload?.id)
                if (index != -1) {

                    /*    // 1 - before assigning the response : computed if it is the first one to answer the question to increment the stats counter
                       let beforeState = state.project.questions[index].responses == undefined || state.project.questions[index].responses?.length == 0
                       let afterState = (action.payload?.responses && action.payload?.responses?.length > 0)
                       console.log("BEFORE STATE", beforeState, "AFTER STATE", afterState)
   
   
                       if (beforeState == true && afterState) { // means first response
                           state.project.stats.numAnswered += 1
                           console.log("xx increment counter in save response in store", state.project.stats.numAnswered)                   
                       } */

                    // 2 - assign the response
                    state.project.questions[index].responses = action.payload?.responses


                }
            }
        },

        setQuestion: (state, action: PayloadAction<IBookQuestion>) => {
            if (state && state.project && state.project.questions) {
                let index = state.project.questions.findIndex((q: IBookQuestion) => q.id === action.payload?.id)
                if (index != -1) {
                    state.project.questions[index] = action.payload
                }
            }
        },

        setDisplaySaveDialog: (state, action: PayloadAction<{ displaySaveDialog: boolean, wantedRoute: string | undefined }>) => {
            state.saveDialog.displaySaveDialog = action.payload.displaySaveDialog
            state.saveDialog.wantedRoute = action.payload.wantedRoute

        },

        setShouldSave: (state, action: PayloadAction<boolean>) => {
            state.saveDialog.shouldSave = action.payload
        }
    },
});

// Action creators are generated for each case reducer function
export const { setCurrentProject, setChapterTree, setQuestionResponse,
    setShouldSave, setDisplaySaveDialog, updateChapters,
    setQuestion } = currentProjectSlice.actions;

export const selectChapters = (state: RootState): IChapterTree[] | undefined => {
    if (state.currentProject.chapterTree && state.currentProject.project?.questionsOrder && state.currentProject.project?.questions) {
        return getChapterTree(state.currentProject.project)
    }
}

export const selectSaveDialog = (state: RootState): ISaveDialog => {
    return state.currentProject.saveDialog
}

export const selectShouldSave = (state: RootState): boolean => {
    return state.currentProject.saveDialog.shouldSave
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

    return [0, 0, undefined, undefined]

}

export const selectAllQuestions = (state: RootState): IBookQuestion[] => {
    return state.currentProject.project?.questions ?? []
}

export const selectQuestion = (state: RootState, questionId: string): [IBookQuestion | undefined, IChapter | undefined] => {
    let res = state.currentProject.project?.questions?.find((q: IBookQuestion) => q.id === questionId)
    if (res) {
        let chapter = state.currentProject.project?.chapters.find((c: IChapter) => c.id === res?.chapterId)
        if (chapter) {
            return [res, chapter]
        } else {
            throw 'chapter not found'
        }
    }

    return [undefined, undefined]
}



export default currentProjectSlice.reducer;