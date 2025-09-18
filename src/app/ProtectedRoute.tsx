import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }: ProtectedRouteProps) => {
    return children;
};


export default ProtectedRoute;
