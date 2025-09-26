// AuthContext.jsx
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      setProfile(null);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✨ NOVO: função chamada pelo RegisterPage
  const registerWithMasterKey = async (masterKey, email, password, extra = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('register-with-master-key', {
        body: {
          masterKey,
          email,
          password,
          ...extra, // ex.: { documento }
        },
      });
      // mantenho o mesmo contrato que você espera no RegisterPage:
      // { error: ... } quando der ruim; sem error quando OK
      if (error) return { error };
      return { data, error: null };
    } catch (err) {
      // alinhar com o RegisterPage, que lê registerError.message
      return { error: err };
    }
  };

  const value = {
    user,
    profile,
    loading,
    login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    logout: () => supabase.auth.signOut(),
    registerWithMasterKey, // ✅ exposto para o RegisterPage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
