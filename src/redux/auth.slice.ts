import { createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { Action, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
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

};

export interface TokenRole {
    role: ERoles
}

// Thunk type
type AppThunk<T> = ThunkAction<Promise<void>, T, unknown, Action<string>>;

const getAuthSlice = (): AppThunk<RootState> => (dispatch: any, getState: any) => {
    const state = getState();
    return state;
};


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


    },
});

// Action creators are generated for each case reducer function
export const { setUser
} = authSlice.actions;


export const selectUser = (state: RootState): User | undefined => state.user.user
export const selectToken = (state: RootState): IdTokenResult | undefined => state.user.tokenResult

export default authSlice.reducer;