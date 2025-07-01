import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;