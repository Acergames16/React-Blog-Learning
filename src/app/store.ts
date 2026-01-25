import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import blogReducer from "../feature/auth/blogSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer
  },  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;