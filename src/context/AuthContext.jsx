import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Este log provará que a nova versão está rodando
  console.log("EXECUTANDO AuthContext SIMPLIFICADO PARA TESTE");

  // Fornecemos valores falsos, sem nenhuma chamada ao Supabase.
  const value = {
    user: null,
    profile: null,
    loading: false, // Definido como 'false' para não travar no loading
    logout: () => console.log("Logout de teste chamado!"),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
