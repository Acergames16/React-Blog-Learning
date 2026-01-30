import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  authError: string | null;
};
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  authLoading: true,
  authError: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuthAction: (state) => {
      state.authLoading = true;
      state.authError = null;
    },
    setAuthSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.authLoading = false;
      state.authError = null;
    },
    setAuthError: (state, action) => {
      state.authLoading = false;
        state.authError = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.authLoading = false;
      state.authError = null;
    },    
  },
});  

export const { startAuthAction, setAuthSuccess, setAuthError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;