import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import ROUTES from '@/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
