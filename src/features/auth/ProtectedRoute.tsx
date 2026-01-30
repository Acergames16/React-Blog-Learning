import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../app/store';

export const ProtectedRoute = () => {
  const { user, authLoading } = useSelector((state: RootState) => state.auth);

  if (authLoading) {
    return <div className="p-10 text-xs uppercase tracking-widest text-gray-400">Authenticating...</div>;
  }

  // If user exists, go to Outlet; if not, go to landing
  return user ? <Outlet /> : <Navigate to="/" replace />;
};