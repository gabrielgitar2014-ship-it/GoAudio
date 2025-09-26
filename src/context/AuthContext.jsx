import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (e) {
        console.error("Erro ao verificar a sessão:", e);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      setProfile(null); // Limpa o perfil antigo
      if (currentUser) {
        await fetchProfile(currentUser.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // O objeto 'value' que o nosso contexto irá fornecer para a aplicação
  const value = {
    user,
    profile,
    loading,
    // ADICIONADO: A função de login que faltava
    login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
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
