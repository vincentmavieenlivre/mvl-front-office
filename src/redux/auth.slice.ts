import { createSlice } from "@reduxjs/toolkit";
import { IdTokenResult, ParsedToken, User } from "firebase/auth";
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from "./store";
import { ERoles } from "@app/modeles/roles";

export interface UserStore {
    user?: User,
    tokenResult?: IdTokenResult
}

const initialState: UserStore = {
    user: undefined,
    tokenResult: undefined
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
                console.info("[login ok] user:", action.payload.user?.email, "claim", action.payload.tokenResult?.claims.role)
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
export const { setUser } = authSlice.actions;

export const selectUser = (state: RootState): User | undefined => state.user.user
export const selectToken = (state: RootState): IdTokenResult | undefined => state.user.tokenResult

export default authSlice.reducer;