import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Se não houver utilizador logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a página solicitada
  return children ? children : <Outlet />;
};

export default ProtectedRoute;