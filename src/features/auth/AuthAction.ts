
import  supabase  from "../../api/supabase";
import type { AppDispatch } from "../../app/store";
import * as AuthSlice from "./AuthSlice";



export const RegisterUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    
    dispatch(AuthSlice.startAuthAction());
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        dispatch(AuthSlice.setAuthError(error.message));
      } else {
        dispatch(AuthSlice.setAuthSuccess(data.user));
      }
    } catch (error) {
      dispatch(AuthSlice.setAuthError(error instanceof Error ? error.message : "An unexpected error occurred"));
    }
  };
};
export const LoginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    
    dispatch(AuthSlice.startAuthAction());
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        dispatch(AuthSlice.setAuthError(error.message));
      } else {
        dispatch(AuthSlice.setAuthSuccess(data.user));
      }
    } catch (error) {
      dispatch(AuthSlice.setAuthError(error instanceof Error ? error.message : "An unexpected error occurred"));
    }
  };
};
export const LogoutUser = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(AuthSlice.startAuthAction());  
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        dispatch(AuthSlice.setAuthError(error.message));
      }
      else {
        dispatch(AuthSlice.clearAuthState());
      }
    } catch (error) {
      dispatch(AuthSlice.setAuthError(error instanceof Error ? error.message : "An unexpected error occurred"));
    } 
  };
};