import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type{ User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    isLoading: boolean;
};
const initialState : AuthState={
    user: null,
    isLoading: true,
};
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isLoading = false;
        },

    },

});
export const { setAuth } = authSlice.actions;
export default authSlice.reducer;