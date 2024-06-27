import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from "./store";
import { Project } from "@app/modeles/database/project";
import { IChapter, IChapterTree } from "@app/modeles/database/book/book-template";
import { IBookQuestion } from "@app/modeles/database/book/book-question";
import { IActionBookFor, IActionImageCoverUpdate, IActionNameUpdate, IActionProjectStatsUpdate, getChapterTree } from "./helpers/project.slice.helpers";
export interface ISaveDialog {
    shouldSave: boolean
    displaySaveDialog: boolean
    wantedRoute: string | undefined
}

export interface ProjectStore {
    project?: Project
    chapterTree?: IChapterTree[]
    saveDialog: ISaveDialog;
    userProjects: Project[]

}

const initialState: ProjectStore = {
    project: undefined,
    chapterTree: undefined,
    saveDialog: {
        shouldSave: false,
        displaySaveDialog: false,
        wantedRoute: undefined
    },
    userProjects: []
};

function updateProjectInList(state: ProjectStore, project: any) {
    console.log("synchronise", current(state.userProjects), project)
    let projectIndex = state.userProjects.findIndex((p) => p.id == project.id)
    if (projectIndex != -1) {
        state.userProjects[projectIndex] = { ...project }
    } else {
        console.error("[synchronise] no current project found in list")
    }
}

export const currentProjectSlice = createSlice({
    name: "currentProject",
    initialState,
    reducers: {
        setCurrentProject: (state, action: PayloadAction<Project | undefined>) => {
            console.log("setCurrentProject")
            state.project = action.payload
            updateProjectInList(state, state.project)
        },

        updateChapters: (state, action: PayloadAction<IChapter[]>) => {
            if (state && state.project) {
                state.project.chapters = action.payload
                updateProjectInList(state, state.project)

            }

        },

        updateProjectCoverUrl: (state, action: PayloadAction<string>) => {
            if (state && state.project) {
                state.project.templateCoverUrl = action.payload
                updateProjectInList(state, state.project)

            }
        },

        updateProjectName: (state, action: PayloadAction<string>) => {
            if (state && state.project) {
                state.project.name = action.payload
                updateProjectInList(state, state.project)

            }
        },


        setChapterTree: (state, action: PayloadAction<IChapterTree[] | undefined>) => {
            state.chapterTree = action.payload
        },

        setQuestionResponse: (state, action: PayloadAction<IBookQuestion | undefined>) => {
            if (state && state.project && state.project.questions) {
                let index = state.project.questions.findIndex((q: IBookQuestion) => q.id === action.payload?.id)
                if (index != -1) {
                    state.project.questions[index].responses = action.payload?.responses
                    updateProjectInList(state, state.project)

                }
            }
        },

        setQuestion: (state, action: PayloadAction<IBookQuestion>) => {
            if (state && state.project && state.project.questions) {
                let index = state.project.questions.findIndex((q: IBookQuestion) => q.id === action.payload?.id)
                if (index != -1) {
                    state.project.questions[index] = action.payload
                    updateProjectInList(state, state.project)

                }
            }
        },

        setDisplaySaveDialog: (state, action: PayloadAction<{ displaySaveDialog: boolean, wantedRoute: string | undefined }>) => {
            state.saveDialog.displaySaveDialog = action.payload.displaySaveDialog
            state.saveDialog.wantedRoute = action.payload.wantedRoute

        },

        setShouldSave: (state, action: PayloadAction<boolean>) => {
            state.saveDialog.shouldSave = action.payload
        },



        updateBookFor: (state, action: PayloadAction<IActionBookFor>) => {
            if (action.payload) {
                console.info("[store] current project updateBookFor", action.payload)
                if (state.project) {
                    state.project.bookFor = { ...state.project.bookFor, ...action.payload.bookFor }
                    updateProjectInList(state, state.project)

                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },





        updateStats: (state, action: PayloadAction<IActionProjectStatsUpdate>) => {
            if (action.payload) {
                console.info("[store] current project stats", action.payload)
                if (state.project) {
                    state.project.stats = action.payload
                    updateProjectInList(state, state.project)

                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },

        updateImageCover: (state, action: PayloadAction<IActionImageCoverUpdate>) => {
            if (action.payload) {
                console.info("[store] current project image cover", action.payload)
                if (state.project) {
                    state.project.templateCoverUrl = action.payload.coverUrl
                    updateProjectInList(state, state.project)

                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },





        /* 
            LIST MANAGEMENT
        */

        setUserProjects: (state, action: PayloadAction<Project[] | undefined>) => {
            if (action.payload && action.payload.length > 0) {
                console.info("[store] users projects num", action.payload.length)
                state.userProjects = action.payload;
            } else {
                console.info("[store] users projects NOT YET PROJECT")

            }
        },
        addUserProjects: (state, action: PayloadAction<Project | undefined>) => {
            if (action.payload) {
                console.info("[store] users projects add", action.payload)
                state.userProjects.push(action.payload)
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },








    },
});

// Action creators are generated for each case reducer function
export const { setCurrentProject, setChapterTree, setQuestionResponse,
    setShouldSave, setDisplaySaveDialog, updateChapters,
    updateProjectName,
    setQuestion, updateProjectCoverUrl,


    updateStats,
    updateImageCover,
    updateBookFor,

    setUserProjects,


    addUserProjects,




} = currentProjectSlice.actions;

export const selectUserProjects = (state: RootState): Project[] => state.currentProject.userProjects

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