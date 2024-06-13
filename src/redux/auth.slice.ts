import { createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "./store";
import { ERoles } from "@app/manager/admin/roles";
import { Project } from "@app/modeles/database/project";

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
    reducers: {
        setUser: (state, action: PayloadAction<UserStore | undefined>) => {
            if (action.payload) {
                console.info("[login ok] user:", action.payload.user?.email, "claim", action.payload.tokenResult?.claims.role, "token", action.payload.tokenResult?.token)
                state.user = action.payload.user;
                state.tokenResult = action.payload.tokenResult
            } else {
                state.user = undefined
                state.tokenResult = undefined
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
export const { setUser, setUserProjects, addUserProjects, updateUserProjectInList } = authSlice.actions;

export const selectUserProjects = (state: RootState): Project[] => state.user.userProjects
export const selectUser = (state: RootState): User | undefined => state.user.user
export const selectToken = (state: RootState): IdTokenResult | undefined => state.user.tokenResult

export default authSlice.reducer;