import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Basic ProtectedRoute stub that allows seamless routing while respecting architecture
 */
const ProtectedRoute = ({ children, allowedRoles = ['designer'] }) => {
  // In our showcase app, user is pre-authenticated as Designer Aarohi Mehta
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
