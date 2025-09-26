import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const currentUser = session?.user;
        setUser(currentUser ?? null);
        
        if (currentUser) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
          
          if (error) throw error;
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Erro na sessão inicial:", error);
        setProfile(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', currentUser.id).single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      // O loading principal só acontece na primeira carga
      setLoading(false); 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    logout: () => supabase.auth.signOut(),
  };

  // ALTERAÇÃO PRINCIPAL AQUI:
  // Renderiza os 'children' (sua aplicação) imediatamente.
  // O estado de 'loading' ainda é passado no 'value' para ser usado pelo ProtectedRoute.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
