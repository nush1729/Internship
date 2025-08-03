import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // REASON: Don't make a decision until the initial loading check is complete.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // REASON: If the user is authenticated, render the requested page. Otherwise, redirect to the login page.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;