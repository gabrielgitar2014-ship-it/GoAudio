import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar o perfil de um usuário
    const fetchProfile = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (error) throw error;
        setProfile(data || null);
      } catch (profileError) {
        console.error("Erro ao buscar o perfil do usuário:", profileError);
        setProfile(null);
      }
    };

    // Função para verificar a sessão inicial
    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("Erro ao verificar a sessão:", e);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    // Listener para mudanças no estado de autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    // Função de limpeza para remover o listener quando o componente não for mais necessário
    return () => {
      // Adicionada verificação de segurança para evitar o erro
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    logout: () => supabase.auth.signOut(),
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
