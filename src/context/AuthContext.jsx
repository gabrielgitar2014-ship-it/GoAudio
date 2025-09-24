import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Tenta obter os dados do utilizador do sessionStorage ao carregar
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (token) => {
    // Procura o token na base de dados
    const { data, error } = await supabase
      .from('access_tokens')
      .select('role, empresa_id')
      .eq('token', token)
      .single(); // .single() retorna um único objeto ou null

    if (error || !data) {
      console.error('Token inválido ou erro:', error);
      return { error: 'Token de acesso inválido.' };
    }

    // Se encontrou, define os dados do utilizador
    const userData = {
      role: data.role,
      empresaId: data.empresa_id,
    };
    
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData)); // Guarda na sessão do browser
    return { user: userData };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};