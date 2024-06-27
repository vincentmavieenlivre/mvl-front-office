import { createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "./store";
import { ERoles } from "@app/manager/admin/roles";
import { Project } from "@app/modeles/database/project";
import { IActionImageCoverUpdate, IActionNameUpdate, IActionProjectStatsUpdate } from "./helpers/project.slice.helpers";
import { setQuestionResponse } from "./current.project.slice";
import { IBookQuestion } from "@app/modeles/database/book/book-question";

export interface UserStore {
    user?: User,
    tokenResult?: IdTokenResult,
    userProjects?: Project[]
}

const initialState: UserStore = {
    user: undefined,
    tokenResult: undefined,
    userProjects: []
};

export interface TokenRole {
    role: ERoles
}



export const authSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(setQuestionResponse, (state, action: PayloadAction<IBookQuestion | undefined>) => {
            console.log('xxx ADDCASE', action, state)
        }
        )
    },
    reducers: {
        setUser: (state, action: PayloadAction<UserStore | undefined>) => {
            if (action.payload) {
                console.info("[login ok] user:", action.payload.user?.email, "claim", action.payload.tokenResult?.claims.role, "token", action.payload.tokenResult?.token)
                state.user = action.payload.user;
                state.tokenResult = action.payload.tokenResult
            } else {
                state.user = undefined
                state.tokenResult = undefined
                state.userProjects = undefined
            }
        },
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

        updateStatsProjectInList: (state, action: PayloadAction<IActionProjectStatsUpdate>) => {
            if (action.payload) {
                console.info("[store] users projects add", action.payload)
                let project = state?.userProjects?.find((p) => p.id === action.payload.projectId)
                if (project) {
                    delete action.payload.projectId
                    project.stats = action.payload
                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },

        updateImageCoverProjectInList: (state, action: PayloadAction<IActionImageCoverUpdate>) => {
            if (action.payload) {
                console.info("[store] users projects add", action.payload)
                let project = state?.userProjects?.find((p) => p.id === action.payload.projectId)
                if (project) {
                    project.templateCoverUrl = action.payload.coverUrl
                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },

        updateNameProjectInList: (state, action: PayloadAction<IActionNameUpdate>) => {
            if (action.payload) {
                console.info("[store] users projects add", action.payload)
                let project = state?.userProjects?.find((p) => p.id === action.payload.projectId)
                if (project) {
                    project.name = action.payload.name
                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },



        updateUserProjectInList: (state, action: PayloadAction<Project | undefined>) => {
            if (action.payload) {
                console.info("[store] users projects add", action.payload)
                let projects = state.userProjects.map((p) => {
                    if (action.payload && p.id === action.payload?.id) {
                        return action.payload
                    } else {
                        return p
                    }
                })
                if (projects) {
                    state.userProjects = projects
                }
            } else {
                console.info("[store] users projects NOT YET PROJECT", action)

            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUser, setUserProjects, addUserProjects,
    updateNameProjectInList,
    updateImageCoverProjectInList, updateUserProjectInList,
    updateStatsProjectInList } = authSlice.actions;

export const selectUserProjects = (state: RootState): Project[] => state.user.userProjects
export const selectUser = (state: RootState): User | undefined => state.user.user
export const selectToken = (state: RootState): IdTokenResult | undefined => state.user.tokenResult

export default authSlice.reducer;