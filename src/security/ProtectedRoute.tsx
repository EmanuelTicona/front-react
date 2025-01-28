import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';
import { useNotification } from '../hooks/useNotification';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store';

interface ProtectedRouteProps {
    component: React.ComponentType; // El tipo para el componente que quieres renderizar
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const { isAuthenticated, shouldRedirect } = useAuth();
    const queryClient = useQueryClient();
    const { getError } = useNotification();
    const { logout } = useAuthStore();

    useEffect(() => {
        if (shouldRedirect && !isAuthenticated) {
            logout();
            queryClient.removeQueries();
            getError('Session expired or not logged in');
        }
      }, [queryClient, getError, shouldRedirect, isAuthenticated, logout]);

    if (shouldRedirect && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Component />;
};

export default ProtectedRoute;
