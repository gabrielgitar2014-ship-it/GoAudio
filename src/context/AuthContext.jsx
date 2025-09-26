import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // <-- NOVO: Estado para o perfil
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Se houver uma sessão, busca o perfil do usuário
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchProfile(session.user.id);
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null); // Limpa o perfil no logout
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // <-- NOVA FUNÇÃO: Busca o perfil na tabela 'profiles'
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const value = {
    user,
    profile, // <-- NOVO: Disponibiliza o perfil no contexto
    loading,
    logout: () => supabase.auth.signOut(),
    // Mantenha suas outras funções de login, etc.
  };

  // Não renderiza nada até que a sessão e o perfil inicial tenham sido carregados
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
