import { useEffect } from 'react';
import  supabase  from '../../api/supabase';
import { useAppDispatch } from '../../app/hooks';
import { setAuth } from './authSlice';

export const AuthListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Check for an existing session (e.g., if the user refreshes the page)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      dispatch(setAuth(session?.user ?? null));
    };

    checkSession();

    // 2. Setup a real-time listener for Auth changes
    // This catches: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Auth Event: ${_event}`);
      dispatch(setAuth(session?.user ?? null));
    });

    // Cleanup: Unsubscribe when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // This component doesn't render any UI; it only handles logic
  return null;
};