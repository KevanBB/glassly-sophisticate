
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could add a loading spinner here if needed
    return <div className="flex min-h-screen items-center justify-center bg-dark">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
