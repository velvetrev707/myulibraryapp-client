import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'librarian')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
