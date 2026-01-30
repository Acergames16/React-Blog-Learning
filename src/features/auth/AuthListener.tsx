import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import  supabase  from '../../api/supabase'; 
import { setAuthSuccess, clearAuthState, startAuthAction } from '../../features/auth/AuthSlice';
import type{ AppDispatch } from '../../app/store';

export const AuthListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initAuth = async () => {
      dispatch(startAuthAction());
      try {
        const { data: { session } } = await supabase.auth.getSession();
        // Just pass the user (or null) directly
        if (session?.user) {
          dispatch(setAuthSuccess(session.user));
        } else {
          dispatch(clearAuthState());
        }
      } catch (err) {
        dispatch(clearAuthState());
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setAuthSuccess(session.user));
      } else {
        dispatch(clearAuthState());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
};