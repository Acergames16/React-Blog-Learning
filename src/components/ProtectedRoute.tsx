import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-violet-50 text-violet-600">
        Loading...
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
