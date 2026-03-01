import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.JSX.Element, requireAdmin?: boolean }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
