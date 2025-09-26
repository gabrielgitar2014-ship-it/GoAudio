import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Enquanto a autenticação está sendo verificada, exibe um loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Se não houver usuário, redireciona para o login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se há usuário, mas o perfil ainda não carregou (caso raro), espera.
  if (!profile) {
    // Você pode mostrar uma mensagem de erro ou um loading aqui também
    // Isso pode acontecer se o perfil não for encontrado após o login
    return <p>Erro: Perfil do usuário não encontrado.</p>;
  }

  // --- LÓGICA PRINCIPAL DE REDIRECIONAMENTO ---

  // Caso 1: Usuário é um "cliente mestre" (fono, admin da licença)
  // Eles não têm um 'empresa_id' no perfil deles.
  if (!profile.empresa_id) {
    // Se ele tentar acessar o dashboard de uma empresa, permita.
    // Mas se ele tentar acessar a raiz, redirecione para a seleção de empresas.
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      return <Navigate to="/selecionar-empresa" replace />;
    }
  }

  // Caso 2: Usuário é um funcionário de uma empresa específica
  // Eles têm um 'empresa_id' no perfil.
  if (profile.empresa_id) {
    const empresaDashboardUrl = `/empresa/${profile.empresa_id}/dashboard`;
    // Se ele já não estiver no dashboard da sua empresa, redirecione-o para lá.
    if (location.pathname !== empresaDashboardUrl) {
       return <Navigate to={empresaDashboardUrl} replace />;
    }
  }

  // Se nenhuma das condições de redirecionamento acima for atendida,
  // renderiza a rota que o usuário tentou acessar.
  return children;
};

export default ProtectedRoute;
